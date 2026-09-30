import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Vibration, Alert } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { getStudent, logAccess } from '../services/database';
import { Student, ScanType } from '../types';
import { useFocusEffect } from 'expo-router';
import {
  SCANNER_CONFIG,
  VIBRATION,
  COLORS,
  UI_CONFIG
} from '../constants/config';

const { width } = Dimensions.get('window');
const {
  SCAN_DEBOUNCE_MS,
  HUD_DISMISS_MS,
  DUPLICATE_SCAN_COOLDOWN_MS,
  QR_PATTERN
} = SCANNER_CONFIG;

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanType, setScanType] = useState<ScanType>('ENTRY');
  const [lastStudent, setLastStudent] = useState<Student | null>(null);
  const [scanStatus, setScanStatus] = useState<'SUCCESS' | 'ERROR' | 'IDLE'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');

  // Timer refs
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scanCooldowns = useRef<Map<string, number>>(new Map());
  const isProcessing = useRef<boolean>(false); // Synchronous lock to prevent race conditions

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // Reset processing lock when leaving screen
  useFocusEffect(
    React.useCallback(() => {
      isProcessing.current = false;
      return () => {
        // Cleanup timers
        if (dismissTimer.current) clearTimeout(dismissTimer.current);
      };
    }, [])
  );

  // Validate QR code format
  const validateQRData = (data: string): boolean => {
    if (!data || data.trim().length === 0) {
      return false;
    }

    // Check length
    if (data.length < 3 || data.length > 50) {
      return false;
    }

    // Check pattern (alphanumeric with hyphens)
    if (!QR_PATTERN.test(data)) {
      return false;
    }

    return true;
  };

  // Check if student was recently scanned (duplicate prevention)
  const isDuplicateScan = (studentId: string): boolean => {
    const lastScanTime = scanCooldowns.current.get(studentId);
    if (!lastScanTime) return false;

    const timeSinceLastScan = Date.now() - lastScanTime;
    return timeSinceLastScan < DUPLICATE_SCAN_COOLDOWN_MS;
  };

  // Retry logic for failed log entries
  const logAccessWithRetry = async (studentId: string, scanType: ScanType, retries = 3): Promise<void> => {
    console.log("Entered Loop")
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await logAccess(studentId, scanType);
        console.log(`Access logged successfully for ${studentId}`);
        break;
      } catch (error) {
        console.error(`Attempt ${attempt}/${retries} failed to log access:`, error);

        if (attempt === retries) {
          // Final attempt failed - show subtle indicator
          Alert.alert(
            'Log Warning',
            'Entry was allowed but may not have been recorded. Please check logs.',
            [{ text: 'OK' }]
          );
        } else {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 100 * attempt));
        }
      }
      console.log("Exited Loop")
      return; // Success
    }
  };

  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    // CRITICAL: Use synchronous ref-based lock to prevent race conditions
    if (isProcessing.current) {
      console.log("❌ Blocked duplicate scan - already processing");
      return;
    }

    // Set lock IMMEDIATELY (synchronous)
    isProcessing.current = true;
    console.log("✅ Scan started, lock acquired");

    try {
      // 1. Validate QR data format
      if (!validateQRData(data)) {
        handleScanResult('ERROR', null, 'INVALID QR CODE');
        Vibration.vibrate(VIBRATION.ERROR);
        return;
      }

      // 2. Check for duplicate scan (cooldown)
      if (isDuplicateScan(data)) {
        const remainingTime = Math.ceil(
          (DUPLICATE_SCAN_COOLDOWN_MS - (Date.now() - (scanCooldowns.current.get(data) || 0))) / 1000
        );
        handleScanResult('ERROR', null, `WAIT ${remainingTime}s`);
        Vibration.vibrate(VIBRATION.ERROR);
        return;
      }

      // 3. Database Lookup
      const student = await getStudent(data);

      if (student) {
        if (student.status === 'BANNED') {
          handleScanResult('ERROR', null, 'ACCESS DENIED: BANNED');
          Vibration.vibrate(VIBRATION.BANNED as number[]);
        } else {
          // 4. Record scan time for duplicate prevention BEFORE logging
          scanCooldowns.current.set(student.id, Date.now());

          // 5. Show success feedback IMMEDIATELY to disable camera
          handleScanResult('SUCCESS', student);
          Vibration.vibrate(VIBRATION.SUCCESS);

          // 6. Log access with retry logic (async, non-blocking) AFTER camera disabled
          logAccessWithRetry(student.id, scanType).catch(e =>
            console.error("All log attempts failed", e)
          );
        }
      } else {
        handleScanResult('ERROR', null, 'STUDENT NOT FOUND');
        Vibration.vibrate(VIBRATION.ERROR);
      }
    } catch (e) {
      console.error('Scan error:', e);
      handleScanResult('ERROR', null, 'SYSTEM ERROR');
      Vibration.vibrate(VIBRATION.ERROR);
    } finally {
      // Release lock after a short delay to ensure no rapid re-triggers
      setTimeout(() => {
        isProcessing.current = false;
        console.log("🔓 Lock released");
      }, SCAN_DEBOUNCE_MS);
    }
  };

  const handleScanResult = (status: 'SUCCESS' | 'ERROR', student: Student | null, errorMsg?: string) => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);

    setScanStatus(status);
    setLastStudent(student);
    if (errorMsg) setErrorMessage(errorMsg);

    // Auto dismiss HUD after configured timeout
    dismissTimer.current = setTimeout(() => {
      dismissHUD();
    }, HUD_DISMISS_MS);
  };

  const dismissHUD = () => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    setScanStatus('IDLE');
    setLastStudent(null);
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera Access Required</Text>
        <Text style={styles.permissionSubtext}>
          GateFlow needs camera permission to scan QR codes
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permButton}>
          <Ionicons name="camera" size={24} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.permText}>Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        active={scanStatus === 'IDLE'}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        {/* Top Controls: Mode Toggle */}
        <View style={styles.topControls}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleBtn, scanType === 'ENTRY' && styles.toggleActiveEntry]}
              onPress={() => setScanType('ENTRY')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="enter-outline"
                size={20}
                color={scanType === 'ENTRY' ? 'white' : '#bbb'}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.toggleText, scanType === 'ENTRY' && styles.toggleTextActive]}>IN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, scanType === 'EXIT' && styles.toggleActiveExit]}
              onPress={() => setScanType('EXIT')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="exit-outline"
                size={20}
                color={scanType === 'EXIT' ? 'white' : '#bbb'}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.toggleText, scanType === 'EXIT' && styles.toggleTextActive]}>OUT</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* HUD Overlay */}
        {scanStatus !== 'IDLE' && (
          <View style={styles.hudOverlay}>
            {/* Background overlay - tap to dismiss */}
            <TouchableOpacity
              style={styles.hudBackdrop}
              activeOpacity={1}
              onPress={dismissHUD}
            />

            {/* HUD Content */}
            <View
              style={[
                styles.hudContainer,
                scanStatus === 'SUCCESS' ? styles.hudSuccess : styles.hudError
              ]}
            >
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={dismissHUD}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close-circle" size={32} color="white" />
              </TouchableOpacity>

              {scanStatus === 'SUCCESS' && lastStudent ? (
                <View style={styles.hudContent}>
                   <Image
                      source={{ uri: lastStudent.photo_url }}
                      style={styles.hudImage}
                    />
                    <View style={styles.hudTextContainer}>
                      <View style={styles.statusBadge}>
                        <Ionicons name="checkmark-circle" size={24} color="white" />
                        <Text style={styles.hudStatus}>ALLOWED</Text>
                      </View>
                      <Text style={styles.hudName} numberOfLines={1}>{lastStudent.name}</Text>
                      <View style={styles.detailRow}>
                        <Ionicons name="card-outline" size={16} color="white" />
                        <Text style={styles.hudDetail}>{lastStudent.roll_number}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons name="bed-outline" size={16} color="white" />
                        <Text style={styles.hudDetail}>{lastStudent.hostel_room_number}</Text>
                      </View>
                      <Text style={styles.hudDept}>{lastStudent.department}</Text>
                    </View>
                </View>
              ) : (
                <View style={styles.hudContent}>
                   <Ionicons name="alert-circle" size={80} color="white" />
                   <Text style={styles.hudErrorText}>{errorMessage}</Text>
                   <Text style={styles.hudErrorSubtext}>Tap outside to dismiss</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Scan Reticle (Visual Only) */}
        {scanStatus === 'IDLE' && (
          <View style={styles.reticleContainer}>
             <View style={styles.reticle}>
               <View style={[styles.corner, styles.cornerTopLeft]} />
               <View style={[styles.corner, styles.cornerTopRight]} />
               <View style={[styles.corner, styles.cornerBottomLeft]} />
               <View style={[styles.corner, styles.cornerBottomRight]} />
             </View>
             <Text style={styles.scanInstructions}>Align QR code within frame</Text>
          </View>
        )}

      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  permissionText: {
    color: '#333',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 100,
    marginBottom: 8,
  },
  permissionSubtext: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  permButton: {
    backgroundColor: COLORS.ENTRY_GREEN,
    padding: 16,
    margin: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  permText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topControls: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 30,
    padding: 4,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  toggleBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleActiveEntry: {
    backgroundColor: COLORS.ENTRY_GREEN,
  },
  toggleActiveExit: {
    backgroundColor: COLORS.EXIT_ORANGE,
  },
  toggleText: {
    color: '#bbb',
    fontWeight: 'bold',
    fontSize: 18,
  },
  toggleTextActive: {
    color: 'white',
  },
  // HUD Overlay
  hudOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  hudBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  hudContainer: {
    position: 'relative',
    height: 320,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
  },
  hudSuccess: {
    backgroundColor: 'rgba(5, 150, 105, 0.97)',
  },
  hudError: {
    backgroundColor: 'rgba(220, 38, 38, 0.97)',
  },
  hudContent: {
    alignItems: 'center',
    width: '100%',
  },
  hudImage: {
    width: UI_CONFIG.AVATAR_LARGE,
    height: UI_CONFIG.AVATAR_LARGE,
    borderRadius: UI_CONFIG.AVATAR_LARGE / 2,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 12,
  },
  hudTextContainer: {
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hudStatus: {
    color: 'white',
    fontWeight: '900',
    fontSize: 24,
    letterSpacing: 2,
    marginLeft: 8,
  },
  hudName: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  hudDetail: {
    color: 'white',
    fontSize: 18,
    opacity: 0.95,
    marginLeft: 8,
  },
  hudDept: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  hudErrorText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  hudErrorSubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 12,
  },
  // Reticle
  reticleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reticle: {
    width: UI_CONFIG.SCAN_RETICLE_SIZE,
    height: UI_CONFIG.SCAN_RETICLE_SIZE,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: 'white',
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  scanInstructions: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  }
});

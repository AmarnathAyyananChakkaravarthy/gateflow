import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  TextInput
} from 'react-native';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { useFocusEffect, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AccessLog, DateFilter } from '../types';
import { getLogs, searchLogs, clearAllLogs } from '../services/database';
import { generateCSV, generateHTML } from '../utils/exportUtils';
import StudentDetailModal from '../components/StudentDetailModal';
import { COLORS, EXPORT_CONFIG } from '../constants/config';
import type { DrawerNavigationProp } from '@react-navigation/drawer';

export default function LogsScreen() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [filter, setFilter] = useState<DateFilter>('TODAY');
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AccessLog | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Add scanner button to header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('index' as never)}
        >
          <Ionicons name="qr-code-outline" size={28} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let data: AccessLog[];

      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        data = await searchLogs(searchQuery.trim(), filter);
      } else {
        setIsSearching(false);
        data = await getLogs(filter);
      }

      setLogs(data);
    } catch (e) {
      console.error('Failed to fetch logs:', e);
      Alert.alert('Error', 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLogs();
    }, [filter, searchQuery])
  );

  const handleExportCSV = async () => {
    try {
      if (logs.length === 0) {
        Alert.alert('No Data', 'There are no logs to export.');
        return;
      }

      if (logs.length > EXPORT_CONFIG.LARGE_DATASET_WARNING_THRESHOLD) {
        Alert.alert(
          'Large Dataset',
          `Exporting ${logs.length} rows. This might take a moment.`
        );
      }

      if (logs.length > EXPORT_CONFIG.MAX_EXPORT_ROWS) {
        Alert.alert(
          'Too Much Data',
          `Cannot export more than ${EXPORT_CONFIG.MAX_EXPORT_ROWS} rows. Please apply filters to reduce the dataset.`
        );
        return;
      }

      const csvData = generateCSV(logs);
      const file = new File(Paths.cache, `gateflow_logs_${new Date().getTime()}.csv`);
      file.write(csvData);

      await Sharing.shareAsync(file.uri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Logs CSV'
      });
    } catch (e) {
      console.error('CSV export error:', e);
      Alert.alert('Export Failed', 'Could not generate CSV file.');
    }
  };

  const handleExportPDF = async () => {
    try {
      if (logs.length === 0) {
        Alert.alert('No Data', 'There are no logs to export.');
        return;
      }

      if (logs.length > EXPORT_CONFIG.MAX_EXPORT_ROWS) {
        Alert.alert(
          'Too Much Data',
          `Cannot export more than ${EXPORT_CONFIG.MAX_EXPORT_ROWS} rows. Please apply filters.`
        );
        return;
      }

      const filterLabel = filter.replace(/_/g, ' ');
      const html = generateHTML(logs, filterLabel);
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (e) {
      console.error('PDF export error:', e);
      Alert.alert('Export Failed', 'Could not generate PDF.');
    }
  };

  const handleClearLogs = () => {
    Alert.alert(
      'Clear All Logs',
      'This will permanently delete all access logs. This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              const count = await clearAllLogs();
              Alert.alert('Success', `Deleted ${count} log entries.`);
              fetchLogs();
            } catch (e) {
              Alert.alert('Error', 'Failed to clear logs.');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: AccessLog }) => (
    <TouchableOpacity style={styles.logItem} onPress={() => setSelectedLog(item)}>
      <Image
        source={{ uri: item.photo_url || 'https://via.placeholder.com/50' }}
        style={styles.avatar}
      />
      <View style={styles.logInfo}>
        <Text style={styles.logName}>{item.name || item.student_id}</Text>
        <View style={styles.logMetaRow}>
          <Ionicons name="time-outline" size={12} color="#6b7280" />
          <Text style={styles.logTime}>{new Date(item.timestamp).toLocaleString()}</Text>
        </View>
        {item.roll_number && (
          <View style={styles.logMetaRow}>
            <Ionicons name="card-outline" size={12} color="#6b7280" />
            <Text style={styles.logMeta}>{item.roll_number}</Text>
          </View>
        )}
      </View>
      <View style={[styles.badge, item.scan_type === 'ENTRY' ? styles.badgeIn : styles.badgeOut]}>
        <Ionicons
          name={item.scan_type === 'ENTRY' ? 'enter-outline' : 'exit-outline'}
          size={14}
          color={item.scan_type === 'ENTRY' ? COLORS.ENTRY_GREEN : COLORS.EXIT_ORANGE}
        />
        <Text
          style={[
            styles.badgeText,
            { color: item.scan_type === 'ENTRY' ? COLORS.ENTRY_GREEN : COLORS.EXIT_ORANGE }
          ]}
        >
          {item.scan_type}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, roll no, or department..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
            <Ionicons name="close-circle" size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Bar */}
      <View style={styles.filterContainer}>
        {(['TODAY', 'MONTH', 'LAST_3_MONTHS'] as DateFilter[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'TODAY' ? 'Today' : f === 'MONTH' ? 'This Month' : 'Last 3 Months'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Bar */}
      <View style={styles.actionsContainer}>
        <View style={styles.countContainer}>
          <Text style={styles.countText}>{logs.length} Records</Text>
          {isSearching && (
            <View style={styles.searchingBadge}>
              <Ionicons name="search" size={12} color={COLORS.ENTRY_GREEN} />
              <Text style={styles.searchingText}>Filtered</Text>
            </View>
          )}
        </View>
        <View style={styles.actionBtnGroup}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleExportCSV}>
            <Ionicons name="download-outline" size={18} color="white" />
            <Text style={styles.actionText}>CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.pdfBtn]} onPress={handleExportPDF}>
            <Ionicons name="print-outline" size={18} color="white" />
            <Text style={styles.actionText}>PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={handleClearLogs}>
            <Ionicons name="trash-outline" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.log_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={fetchLogs}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name={isSearching ? 'search-outline' : 'document-outline'}
              size={64}
              color="#d1d5db"
            />
            <Text style={styles.emptyText}>
              {isSearching ? 'No matching logs found' : 'No logs for this period'}
            </Text>
            {isSearching && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearFilterBtn}>
                <Text style={styles.clearFilterText}>Clear Search</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      <StudentDetailModal
        visible={!!selectedLog}
        data={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  headerButton: {
    marginRight: 16,
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    paddingVertical: 4,
  },
  clearSearchBtn: {
    padding: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterBtnActive: {
    backgroundColor: COLORS.DARK_HEADER,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  filterTextActive: {
    color: 'white',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    marginBottom: 1,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countText: {
    fontWeight: 'bold',
    color: '#4b5563',
    fontSize: 15,
  },
  searchingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.ENTRY_LIGHT,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  searchingText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.ENTRY_GREEN,
  },
  actionBtnGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.ENTRY_GREEN,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
  },
  pdfBtn: {
    backgroundColor: '#4b5563',
  },
  deleteBtn: {
    backgroundColor: COLORS.ERROR_RED,
    paddingHorizontal: 10,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  list: {
    padding: 12,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e5e7eb',
  },
  logInfo: {
    flex: 1,
    marginLeft: 12,
  },
  logName: {
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    marginBottom: 4,
  },
  logMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  logTime: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
  },
  logMeta: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 11,
    fontWeight: '500',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  badgeIn: {
    backgroundColor: COLORS.ENTRY_LIGHT,
  },
  badgeOut: {
    backgroundColor: COLORS.EXIT_LIGHT,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  clearFilterBtn: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.ENTRY_GREEN,
    borderRadius: 20,
  },
  clearFilterText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  }
});

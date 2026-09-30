import React from 'react';
import { Modal, View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AccessLog, Student } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
  data: AccessLog | null; // Can pass Log which has student details joined
}

const StudentDetailModal: React.FC<Props> = ({ visible, onClose, data }) => {
  if (!data) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Student Profile</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{top:10, bottom:10, left:10, right:10}}>
              <Ionicons name="close-circle" size={28} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <Image 
              source={{ uri: data.photo_url || 'https://via.placeholder.com/150' }} 
              style={styles.largeImage} 
            />
            
            <Text style={styles.name}>{data.name || 'Unknown Student'}</Text>
            <Text style={styles.idBadge}>{data.student_id}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="school-outline" size={20} color="#444" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.label}>Department</Text>
                <Text style={styles.value}>{data.department || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="card-outline" size={20} color="#444" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.label}>Roll Number</Text>
                <Text style={styles.value}>{data.roll_number || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="bed-outline" size={20} color="#444" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.label}>Hostel Room</Text>
                <Text style={styles.value}>{data.hostel_room_number || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color="#444" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.label}>Phone</Text>
                <Text style={styles.value}>{data.phone_number || 'N/A'}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <Text style={styles.historyLabel}>Latest Interaction</Text>
            <View style={[styles.scanTag, data.scan_type === 'ENTRY' ? styles.tagIn : styles.tagOut]}>
               <Text style={styles.tagText}>
                  {data.scan_type} at {new Date(data.timestamp).toLocaleTimeString()}
               </Text>
            </View>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  largeImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  idBadge: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 12,
  },
  infoTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  historyLabel: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  scanTag: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tagIn: {
    backgroundColor: '#d1fae5',
  },
  tagOut: {
    backgroundColor: '#ffedd5',
  },
  tagText: {
    fontWeight: 'bold',
    color: '#333',
  },
});

export default StudentDetailModal;

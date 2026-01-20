import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import { useTranslation } from 'react-i18next';

export default function SyncScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadOfflineData();
  }, []);

  const loadOfflineData = async () => {
    try {
      const data = await AsyncStorage.getItem('offline_beneficiaries');
      if (data) {
        setBeneficiaries(JSON.parse(data));
      }
    } catch (error) {
      console.log("Error loading data");
    }
  };

  const handleSync = async () => {
    const networkState = await Network.getNetworkStateAsync();
    if (!networkState.isConnected) {
      Alert.alert(t('alerts.noInternet'), t('alerts.connectToSync'));
      return;
    }

    if (beneficiaries.length === 0) {
      Alert.alert("Info", t('alerts.noDataToSync'));
      return;
    }

    setIsSyncing(true);

    try {
      // Use mock backend API for sync
      const { mockSyncData } = await import('../lib/mockBackend');
      const result = await mockSyncData(beneficiaries);

      if (result.success) {
        const updatedList = beneficiaries.map(item => ({ ...item, status: 'synced' }));
        setBeneficiaries(updatedList);
        await AsyncStorage.setItem('offline_beneficiaries', JSON.stringify(updatedList));
        Alert.alert(t('success'), result.message || t('alerts.allRecordsUploaded'));
      }
    } catch (error) {
      console.error('Sync error:', error);
      Alert.alert('Error', 'Failed to sync data');
    } finally {
      setIsSyncing(false);
    }
  };

  const clearData = async () => {
    await AsyncStorage.removeItem('offline_beneficiaries');
    setBeneficiaries([]);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('sync.title')}</Text>

        <TouchableOpacity onPress={clearData} style={{ marginLeft: 'auto' }}>
          <Ionicons name="trash-outline" size={20} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>

        {/* STATUS CARD */}
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>{t('sync.pendingUploads')}</Text>
          <Text style={styles.statusCount}>
            {beneficiaries.filter(b => b.status === 'pending').length}
          </Text>
          <Text style={styles.statusSub}>{t('sync.recordsStored')}</Text>
        </View>

        {/* LIST OF BENEFICIARIES */}
        <Text style={styles.sectionTitle}>{t('sync.offlineRecords')}</Text>

        {beneficiaries.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>{t('sync.noRecords')}</Text>
          </View>
        ) : (
          beneficiaries.map((item, index) => (
            <View key={index} style={styles.recordCard}>
              <View style={styles.recordIcon}>
                {item.status === 'synced' ? (
                  <Ionicons name="checkmark-circle" size={32} color="#059669" />
                ) : (
                  <Ionicons name="cloud-offline" size={32} color="#dc2626" />
                )}
              </View>
              <View style={styles.recordInfo}>
                <Text style={styles.recordName}>{item.name}</Text>
                <Text style={styles.recordId}>Aadhaar: {item.aadhaar}</Text>
                <Text style={[
                  styles.recordStatus,
                  { color: item.status === 'synced' ? '#059669' : '#d97706' }
                ]}>
                  {item.status === 'synced' ? t('sync.uploaded') : t('sync.waitingInternet')}
                </Text>
              </View>
            </View>
          ))
        )}

      </ScrollView>

      {/* SYNC BUTTON */}
      <View style={styles.bottomFooter}>
        <TouchableOpacity
          style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
          onPress={handleSync}
          disabled={isSyncing}
        >
          {isSyncing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="cloud-upload" size={24} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.syncButtonText}>{t('sync.syncNow')}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    backgroundColor: '#d97706',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  contentContainer: { padding: 20, paddingBottom: 100 },

  statusCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statusTitle: { fontSize: 16, color: '#6b7280', fontWeight: '600' },
  statusCount: { fontSize: 48, fontWeight: 'bold', color: '#d97706', marginVertical: 8 },
  statusSub: { fontSize: 14, color: '#9ca3af' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginBottom: 16 },

  recordCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  recordIcon: { marginRight: 16 },
  recordInfo: { flex: 1 },
  recordName: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  recordId: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  recordStatus: { fontSize: 12, fontWeight: 'bold', marginTop: 4 },

  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#9ca3af', marginTop: 10 },

  bottomFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  syncButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
  },
  syncButtonDisabled: { opacity: 0.7 },
  syncButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
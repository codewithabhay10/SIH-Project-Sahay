import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

export default function AddBeneficiary() {
  const router = useRouter();
  const { t } = useTranslation();

  // Form State
  const [name, setName] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [income, setIncome] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  // 1. CAMERA FUNCTION
  const openCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(t('alerts.permissionRequired'), t('alerts.allowCamera'));
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.5,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(t('error'), t('alerts.couldNotOpenCamera'));
    }
  };

  // 2. SAVE OFFLINE FUNCTION
  const handleSave = async () => {
    if (!name || !aadhaar || !photo) {
      Alert.alert(t('error'), t('alerts.fillAllFields'));
      return;
    }

    try {
      const newRecord = {
        id: Date.now(),
        name,
        aadhaar,
        income,
        photoUri: photo,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      const existingData = await AsyncStorage.getItem('offline_beneficiaries');
      const beneficiaries = existingData ? JSON.parse(existingData) : [];
      beneficiaries.push(newRecord);
      await AsyncStorage.setItem('offline_beneficiaries', JSON.stringify(beneficiaries));

      Alert.alert(t('success'), t('alerts.beneficiarySavedOffline'));
      router.back();

    } catch (error) {
      Alert.alert(t('error'), t('alerts.failedToSave'));
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('addBeneficiary.title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>

        {/* INPUT: NAME */}
        <Text style={styles.label}>{t('addBeneficiary.fullName')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('addBeneficiary.namePlaceholder')}
          value={name}
          onChangeText={setName}
        />

        {/* INPUT: AADHAAR */}
        <Text style={styles.label}>{t('addBeneficiary.aadhaarNumber')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('addBeneficiary.aadhaarPlaceholder')}
          keyboardType="numeric"
          maxLength={12}
          value={aadhaar}
          onChangeText={setAadhaar}
        />

        {/* INPUT: INCOME */}
        <Text style={styles.label}>{t('addBeneficiary.annualIncome')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('addBeneficiary.incomePlaceholder')}
          keyboardType="numeric"
          value={income}
          onChangeText={setIncome}
        />

        {/* CAMERA SECTION */}
        <Text style={styles.label}>{t('addBeneficiary.proofOfIdentity')}</Text>
        <TouchableOpacity style={styles.cameraBox} onPress={openCamera}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.previewImage} />
          ) : (
            <View style={styles.cameraPlaceholder}>
              <Ionicons name="camera" size={40} color="#d97706" />
              <Text style={styles.cameraText}>{t('addBeneficiary.tapToPhoto')}</Text>
            </View>
          )}
        </TouchableOpacity>
        {photo && <Text style={styles.photoSuccess}>{t('addBeneficiary.photoCaptured')}</Text>}

        {/* SAVE BUTTON */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{t('addBeneficiary.saveOffline')}</Text>
        </TouchableOpacity>

      </ScrollView>
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
  formContainer: { padding: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  cameraBox: {
    height: 200,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#d97706',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cameraPlaceholder: { alignItems: 'center' },
  cameraText: { color: '#d97706', marginTop: 8, fontWeight: 'bold' },
  previewImage: { width: '100%', height: '100%' },
  photoSuccess: { color: '#059669', marginTop: 4, fontWeight: 'bold', textAlign: 'center' },
  saveButton: {
    backgroundColor: '#059669',
    padding: 18,
    borderRadius: 12,
    marginTop: 40,
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
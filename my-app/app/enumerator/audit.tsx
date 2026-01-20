import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';


export default function AuditScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const cameraRef = useRef<CameraView>(null);
    const [permission, requestPermission] = useCameraPermissions();

    const [step, setStep] = useState(1); // 1: Select, 2: Comparison, 3: Evidence, 4: Video
    const [beneficiaryId, setBeneficiaryId] = useState('');
    const [originalData, setOriginalData] = useState<any>(null);
    const [currentIncome, setCurrentIncome] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [location, setLocation] = useState<any>(null);

    useEffect(() => {
        getLocation();
    }, []);

    const getLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const loc = await Location.getCurrentPositionAsync({});
                setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
            }
        } catch (e) {
            console.log('Location error:', e);
        }
    };

    const loadBeneficiaryData = async () => {
        // Mock: Load original survey data
        const mockOriginal = {
            name: 'Sunita Devi',
            income: 45000,
            occupation: 'Artisan',
            surveyDate: '2024-01-15',
        };
        setOriginalData(mockOriginal);
        setStep(2);
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photoData = await cameraRef.current.takePictureAsync({ quality: 0.5 });
                if (photoData?.uri) {
                    setPhoto(photoData.uri);
                }
            } catch (e) {
                console.log('Camera error:', e);
            }
        }
    };

    const startRecording = async () => {
        if (cameraRef.current) {
            setIsRecording(true);
            try {
                const video = await cameraRef.current.recordAsync({ maxDuration: 15 });
                if (video?.uri) {
                    setVideoUri(video.uri);
                }
            } catch (e) {
                console.log('Video error:', e);
            }
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (cameraRef.current) {
            cameraRef.current.stopRecording();
        }
    };

    const submitAudit = async () => {
        try {
            const audit = {
                id: Date.now().toString(),
                beneficiaryId,
                originalIncome: originalData?.income,
                currentIncome: Number(currentIncome),
                incomeChange: Number(currentIncome) - (originalData?.income || 0),
                photoUri: photo,
                videoUri,
                gps: location,
                timestamp: new Date().toISOString(),
                status: 'DELIVERED', // Bug fix: previously was hardcoded 'DELIVERED' in delivery? no this is audit 
            };

            const existing = await AsyncStorage.getItem('audits');
            const audits = existing ? JSON.parse(existing) : [];
            audits.push(audit);
            await AsyncStorage.setItem('audits', JSON.stringify(audits));

            Alert.alert(t('success'), t('alerts.recordedSuccessfully'), [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (e) {
            console.log('Error:', e);
        }
    };

    const incomeChange = currentIncome ? Number(currentIncome) - (originalData?.income || 0) : 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('enumerator.audit.title')}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {step === 1 && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{t('enumerator.audit.step1')}</Text>
                        <Text style={styles.cardSubtitle}>{t('enumerator.audit.step1Sub')}</Text>

                        <TextInput
                            style={styles.input}
                            placeholder={t('enumerator.audit.enterId')}
                            value={beneficiaryId}
                            onChangeText={setBeneficiaryId}
                        />

                        <TouchableOpacity style={styles.primaryButton} onPress={loadBeneficiaryData}>
                            <Text style={styles.buttonText}>{t('enumerator.audit.load')}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {step === 2 && originalData && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{t('enumerator.audit.step2')}</Text>
                        <Text style={styles.cardSubtitle}>{t('enumerator.audit.step2Sub')}</Text>

                        <View style={styles.comparisonRow}>
                            <View>
                                <Text style={styles.label}>{t('enumerator.audit.original')}</Text>
                                <Text style={styles.value}>₹{originalData.income}</Text>
                            </View>
                            <Ionicons name="arrow-forward" size={24} color="#6b7280" />
                            <View>
                                <Text style={styles.label}>{t('enumerator.audit.current')}</Text>
                                <TextInput
                                    style={styles.inlineInput}
                                    placeholder="Enter"
                                    keyboardType="numeric"
                                    value={currentIncome}
                                    onChangeText={setCurrentIncome}
                                />
                            </View>
                        </View>

                        {currentIncome && (
                            <View style={[styles.resultBadge, incomeChange >= 0 ? styles.positive : styles.negative]}>
                                <Ionicons name={incomeChange >= 0 ? "trending-up" : "trending-down"} size={20} color={incomeChange >= 0 ? "green" : "red"} />
                                <Text style={[styles.resultText, { color: incomeChange >= 0 ? 'green' : 'red' }]}>
                                    {incomeChange >= 0 ? t('enumerator.audit.incomeUp') : t('enumerator.audit.incomeDown')} ₹{Math.abs(incomeChange)}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[styles.primaryButton, !currentIncome && { opacity: 0.5 }]}
                            onPress={() => setStep(3)}
                            disabled={!currentIncome}
                        >
                            <Text style={styles.buttonText}>{t('next')}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {step === 3 && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{t('enumerator.audit.step3')}</Text>
                        <Text style={styles.cardSubtitle}>{t('enumerator.audit.step3Sub')}</Text>

                        {photo ? (
                            <View>
                                <Image source={{ uri: photo }} style={styles.previewImage} />
                                <TouchableOpacity onPress={() => setPhoto(null)} style={styles.retakeBtn}>
                                    <Text style={styles.retakeText}>{t('enumerator.audit.retake')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.primaryButton} onPress={() => setStep(4)}>
                                    <Text style={styles.buttonText}>{t('next')}</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <CameraView
                                style={styles.camera}
                                ref={cameraRef}
                                facing="back"
                            >
                                <TouchableOpacity style={styles.captureBtn} onPress={takePicture} />
                            </CameraView>
                        )}
                        {!photo && (
                            <TouchableOpacity style={styles.textBtn} onPress={takePicture}>
                                <Text style={styles.textBtnLabel}>{t('enumerator.audit.takePhoto')}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {step === 4 && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{t('enumerator.audit.step4')}</Text>
                        <Text style={styles.cardSubtitle}>{t('enumerator.audit.step4Sub')}</Text>

                        {videoUri ? (
                            <View style={styles.videoPlaceholder}>
                                <Ionicons name="play-circle" size={48} color="#fff" />
                                <Text style={{ color: '#fff' }}>Video Recorded</Text>
                            </View>
                        ) : (
                            <CameraView
                                style={styles.camera}
                                ref={cameraRef}
                                mode="video"
                                facing="back"
                            >
                                <TouchableOpacity
                                    style={[styles.captureBtn, isRecording && styles.recordingBtn]}
                                    onPress={isRecording ? stopRecording : startRecording}
                                />
                            </CameraView>
                        )}

                        <View style={styles.actions}>
                            {videoUri ? (
                                <TouchableOpacity style={styles.primaryButton} onPress={submitAudit}>
                                    <Text style={styles.buttonText}>{t('enumerator.audit.submit')}</Text>
                                </TouchableOpacity>
                            ) : (
                                <Text style={{ textAlign: 'center', marginTop: 10 }}>{isRecording ? t('enumerator.audit.stopRecording') : t('enumerator.audit.recordVideo')}</Text>
                            )}
                        </View>

                        <TouchableOpacity onPress={submitAudit}>
                            <Text style={styles.skipText}>{t('enumerator.audit.skip')}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    header: {
        backgroundColor: '#1f2937',
        paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20,
        flexDirection: 'row', alignItems: 'center',
    },
    backButton: { marginRight: 16 },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    content: { padding: 20 },
    card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 20 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
    cardSubtitle: { fontSize: 14, color: '#6b7280', marginBottom: 20 },
    input: { height: 50, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 16, marginBottom: 16 },
    primaryButton: { backgroundColor: '#d97706', height: 50, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    comparisonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    label: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
    value: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
    inlineInput: { borderBottomWidth: 1, borderBottomColor: '#d97706', fontSize: 18, fontWeight: 'bold', width: 100, paddingVertical: 4 },
    resultBadge: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 8, gap: 8, justifyContent: 'center' },
    positive: { backgroundColor: '#dcfce7' },
    negative: { backgroundColor: '#fee2e2' },
    resultText: { fontWeight: 'bold' },
    camera: { height: 300, borderRadius: 12, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 20 },
    captureBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', borderWidth: 4, borderColor: '#d97706' },
    recordingBtn: { backgroundColor: 'red', borderColor: '#fff' },
    previewImage: { height: 300, borderRadius: 12, marginBottom: 16 },
    retakeBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 8 },
    retakeText: { color: '#fff', fontSize: 12 },
    textBtn: { alignItems: 'center', marginTop: 10 },
    textBtnLabel: { color: '#d97706', fontWeight: 'bold' },
    videoPlaceholder: { height: 200, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
    actions: { marginTop: 16 },
    skipText: { textAlign: 'center', marginTop: 16, color: '#6b7280' },
});

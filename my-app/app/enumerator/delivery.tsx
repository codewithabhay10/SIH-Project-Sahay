import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';


export default function DeliveryScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const [step, setStep] = useState(1); // 1: OTP, 2: Scan, 3: Confirm
    const [otp, setOtp] = useState('');
    const [beneficiaryId, setBeneficiaryId] = useState('');
    const [assetBarcode, setAssetBarcode] = useState('');
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isGeoLocked, setIsGeoLocked] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

    // Mock village center for geo-lock
    const VILLAGE_CENTER = { lat: 28.6139, lng: 77.2090 }; // Delhi coordinates for demo
    const MAX_DISTANCE_METERS = 500;

    useEffect(() => {
        checkLocation();
    }, []);

    const checkLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });

                // Calculate distance from village center
                const distance = getDistanceFromLatLonInMeters(
                    loc.coords.latitude, loc.coords.longitude,
                    VILLAGE_CENTER.lat, VILLAGE_CENTER.lng
                );
                setIsGeoLocked(distance <= MAX_DISTANCE_METERS);
            }
        } catch (e) {
            console.log('Location error:', e);
        }
    };

    const getDistanceFromLatLonInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371000; // Radius of earth in meters
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const deg2rad = (deg: number) => deg * (Math.PI / 180);

    const verifyOTP = () => {
        // Mock OTP verification
        if (otp === '123456') {
            setStep(2);
        } else {
            Alert.alert(t('enumerator.delivery.invalidOtp'), t('enumerator.delivery.otpMsg'));
        }
    };

    const simulateScan = (type: 'beneficiary' | 'asset') => {
        // Simulate barcode scan
        if (type === 'beneficiary') {
            setBeneficiaryId('1234 5678 9012');
        } else {
            setAssetBarcode('AST-123456');
        }
    };

    const handleDeliver = async () => {
        if (!isGeoLocked) {
            Alert.alert(t('enumerator.delivery.locationError'), t('enumerator.delivery.locationMsg'));
            return;
        }

        try {
            // Use mock backend API for realistic simulation
            const { mockConfirmDelivery } = await import('../../lib/mockBackend');
            const result = await mockConfirmDelivery({
                beneficiaryId,
                assetBarcode,
                gps: location,
                otp,
            });

            if (!result.success) {
                Alert.alert(t('error'), result.error || 'Delivery failed');
                return;
            }

            // Also save locally for offline access
            const delivery = {
                id: result.deliveryId || Date.now().toString(),
                beneficiaryId,
                assetBarcode,
                gps: location,
                timestamp: new Date().toISOString(),
                status: 'DELIVERED'
            };

            const existing = await AsyncStorage.getItem('deliveries');
            const deliveries = existing ? JSON.parse(existing) : [];
            deliveries.push(delivery);
            await AsyncStorage.setItem('deliveries', JSON.stringify(deliveries));

            Alert.alert(t('enumerator.delivery.success'), result.message || t('enumerator.delivery.successMsg'), [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (e) {
            console.log('Error:', e);
            Alert.alert(t('error'), 'An error occurred');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1f2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('enumerator.delivery.title')}</Text>
            </View>

            <View style={styles.progress}>
                <StepIndicator num={1} label={t('enumerator.delivery.enterOtp')} active={step >= 1} completed={step > 1} />
                <View style={styles.line} />
                <StepIndicator num={2} label={t('enumerator.delivery.scan')} active={step >= 2} completed={step > 2} />
                <View style={styles.line} />
                <StepIndicator num={3} label={t('enumerator.delivery.confirm')} active={step >= 3} completed={step > 3} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {step === 1 && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>{t('enumerator.delivery.step1')}</Text>
                        <Text style={styles.stepSubtitle}>{t('enumerator.delivery.step1Sub')}</Text>

                        <TextInput
                            style={styles.otpInput}
                            placeholder="OTP"
                            keyboardType="numeric"
                            maxLength={6}
                            value={otp}
                            onChangeText={setOtp}
                        />

                        <TouchableOpacity style={styles.verifyButton} onPress={verifyOTP}>
                            <Text style={styles.verifyText}>{t('enumerator.delivery.verify')}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {step === 2 && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>{t('enumerator.delivery.step2')}</Text>
                        <Text style={styles.stepSubtitle}>{t('enumerator.delivery.step2Sub')}</Text>

                        <TouchableOpacity style={styles.scanCard} onPress={() => simulateScan('beneficiary')}>
                            <Ionicons name="qr-code" size={40} color={beneficiaryId ? 'green' : '#d97706'} />
                            <View style={styles.scanInfo}>
                                <Text style={styles.scanLabel}>{t('enumerator.delivery.scanBen')}</Text>
                                <Text style={styles.scanValue}>{beneficiaryId || 'Tap to Scan'}</Text>
                            </View>
                            {beneficiaryId && <Ionicons name="checkmark-circle" size={24} color="green" />}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.scanCard} onPress={() => simulateScan('asset')}>
                            <Ionicons name="barcode" size={40} color={assetBarcode ? 'green' : '#2563eb'} />
                            <View style={styles.scanInfo}>
                                <Text style={styles.scanLabel}>{t('enumerator.delivery.scanAsset')}</Text>
                                <Text style={styles.scanValue}>{assetBarcode || 'Tap to Scan'}</Text>
                            </View>
                            {assetBarcode && <Ionicons name="checkmark-circle" size={24} color="green" />}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.verifyButton, (!beneficiaryId || !assetBarcode) && { opacity: 0.5 }]}
                            onPress={() => setStep(3)}
                            disabled={!beneficiaryId || !assetBarcode}
                        >
                            <Text style={styles.verifyText}>{t('next')}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {step === 3 && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>{t('enumerator.delivery.step3')}</Text>
                        <Text style={styles.stepSubtitle}>{t('enumerator.delivery.step3Sub')}</Text>

                        <View style={styles.summaryCard}>
                            <SummaryRow label="Beneficiary ID" value={beneficiaryId} />
                            <SummaryRow label="Asset Barcode" value={assetBarcode} />
                            <SummaryRow label="Geo-Location" value={isGeoLocked ? t('verifyDelivery.locationVerified') : t('verifyDelivery.verifyingGeo')} color={isGeoLocked ? 'green' : 'orange'} />
                        </View>

                        <TouchableOpacity
                            style={[styles.deliverButton, !isGeoLocked && { opacity: 0.5 }]}
                            onPress={handleDeliver}
                            disabled={!isGeoLocked}
                        >
                            <Ionicons name="checkmark-done" size={24} color="#fff" />
                            <Text style={styles.deliverText}>{t('enumerator.delivery.confirm')}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>

    );
}

const StepIndicator = ({ num, label, active, completed }: any) => (
    <View style={styles.stepIndicator}>
        <View style={[
            styles.stepCircle,
            active && styles.stepActive,
            completed && styles.stepCompleted
        ]}>
            {completed ? <Ionicons name="checkmark" size={12} color="#fff" /> : <Text style={[styles.stepNum, active && styles.stepNumActive]}>{num}</Text>}
        </View>
        <Text style={[styles.stepLabel, active && styles.stepLabelActive]} numberOfLines={1}>{label}</Text>
    </View>
);

const SummaryRow = ({ label, value, color }: any) => (
    <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={[styles.summaryValue, color && { color }]}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 24, paddingTop: 60, backgroundColor: '#fff' },
    backButton: { marginRight: 16 },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    progress: { flexDirection: 'row', padding: 24, alignItems: 'center', justifyContent: 'center' },
    stepIndicator: { alignItems: 'center', width: 80 },
    stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
    stepActive: { backgroundColor: '#d97706' },
    stepCompleted: { backgroundColor: '#059669' },
    stepNum: { fontSize: 14, fontWeight: 'bold', color: '#6b7280' },
    stepNumActive: { color: '#fff' },
    stepLabel: { fontSize: 10, color: '#9ca3af', textAlign: 'center' },
    stepLabelActive: { color: '#d97706', fontWeight: 'bold' },
    line: { flex: 1, height: 2, backgroundColor: '#f3f4f6', marginBottom: 14 },
    content: { padding: 24 },
    stepContainer: { alignItems: 'center' },
    stepTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8, color: '#1f2937' },
    stepSubtitle: { fontSize: 14, color: '#6b7280', marginBottom: 32, textAlign: 'center' },
    otpInput: { width: '100%', height: 56, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, fontSize: 24, textAlign: 'center', letterSpacing: 8, marginBottom: 24, backgroundColor: '#fff' },
    verifyButton: { width: '100%', height: 56, backgroundColor: '#d97706', borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: '#d97706', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
    verifyText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    scanCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', width: '100%', padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb' },
    scanInfo: { flex: 1, marginLeft: 16 },
    scanLabel: { fontSize: 14, color: '#6b7280' },
    scanValue: { fontSize: 16, fontWeight: 'bold', color: '#1f2937', marginTop: 4 },
    summaryCard: { width: '100%', backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 24 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
    summaryLabel: { color: '#6b7280' },
    summaryValue: { fontWeight: '600' },
    deliverButton: { width: '100%', height: 56, backgroundColor: '#059669', borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    deliverText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

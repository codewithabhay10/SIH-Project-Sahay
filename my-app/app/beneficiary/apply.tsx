import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { extractTextFromImage, formatAadhaar } from '../../utils/ocr';
import { useTranslation } from 'react-i18next';

export default function ApplyScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const cameraRef = useRef<CameraView>(null);
    const [permission, requestPermission] = useCameraPermissions();

    const [name, setName] = useState('');
    const [aadhaar, setAadhaar] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Aadhaar Scanner states
    const [showScanner, setShowScanner] = useState(false);
    const [scannedImage, setScannedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async () => {
        if (!name || !aadhaar || !phone) {
            Alert.alert(t('alerts.missingFields'), t('alerts.fillAllFields'));
            return;
        }

        if (aadhaar.length !== 12) {
            Alert.alert(t('alerts.invalidAadhaar'), t('alerts.enter12Digit'));
            return;
        }

        setIsSubmitting(true);
        try {
            const application = {
                id: Date.now().toString(),
                name,
                aadhaar: 'XXXX-XXXX-' + aadhaar.slice(-4),
                fullAadhaar: aadhaar,
                phone,
                address,
                aadhaarScanned: scannedImage ? true : false,
                status: 'PENDING_VERIFICATION',
                submittedAt: new Date().toISOString(),
            };

            const existing = await AsyncStorage.getItem('pending_applications');
            const applications = existing ? JSON.parse(existing) : [];
            applications.push(application);
            await AsyncStorage.setItem('pending_applications', JSON.stringify(applications));
            await AsyncStorage.setItem('beneficiary_application', JSON.stringify(application));

            Alert.alert(
                t('alerts.applicationSubmitted'),
                t('alerts.applicationSentVerification'),
                [{ text: t('ok'), onPress: () => router.back() }]
            );
        } catch (e) {
            Alert.alert(t('error'), t('alerts.failedToSave'));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Capture Aadhaar card photo and run OCR
    const captureAadhaar = async () => {
        if (cameraRef.current) {
            setIsProcessing(true);
            try {
                const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
                if (photo?.uri) {
                    setScannedImage(photo.uri);
                    setShowScanner(false);

                    const ocrResult = await extractTextFromImage(photo.uri);

                    if (ocrResult.success && ocrResult.aadhaar) {
                        setAadhaar(ocrResult.aadhaar);
                        if (ocrResult.name) {
                            setName(ocrResult.name);
                        }

                        let details = `Aadhaar: ${formatAadhaar(ocrResult.aadhaar)}`;
                        if (ocrResult.name) details += `\nName: ${ocrResult.name}`;
                        if (ocrResult.dob) details += `\nDOB: ${ocrResult.dob}`;
                        if (ocrResult.gender) details += `\nGender: ${ocrResult.gender}`;

                        Alert.alert('✅ Aadhaar Verified', details, [{ text: t('ok') }]);
                    } else {
                        Alert.alert(
                            '⚠️ Could not read Aadhaar',
                            ocrResult.error || 'Please enter the Aadhaar number manually or try scanning again.',
                            [{ text: t('ok') }]
                        );
                    }

                    setIsProcessing(false);
                }
            } catch (e) {
                Alert.alert(t('error'), 'Failed to capture photo');
                setIsProcessing(false);
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('apply.title')}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>{t('apply.personalDetails')}</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('apply.fullName')} *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t('apply.namePlaceholder')}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                {/* Aadhaar Scanner Section */}
                <View style={styles.scannerSection}>
                    <View style={styles.scannerHeader}>
                        <Text style={styles.label}>{t('apply.aadhaar')} *</Text>
                        <TouchableOpacity
                            style={styles.scanButton}
                            onPress={() => {
                                if (!permission?.granted) {
                                    requestPermission();
                                } else {
                                    setShowScanner(!showScanner);
                                }
                            }}
                        >
                            <Ionicons name="camera" size={18} color="#fff" />
                            <Text style={styles.scanButtonText}>
                                {showScanner ? t('apply.close') : t('apply.scanAadhaar')}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Camera View for Scanning */}
                    {showScanner && permission?.granted && (
                        <View style={styles.cameraContainer}>
                            <CameraView
                                ref={cameraRef}
                                style={styles.camera}
                                facing="back"
                            >
                                <View style={styles.cameraOverlay}>
                                    <View style={styles.scanFrame}>
                                        <Text style={styles.scanFrameText}>
                                            {t('apply.positionAadhaar')}
                                        </Text>
                                    </View>
                                </View>
                            </CameraView>
                            <TouchableOpacity
                                style={styles.captureButton}
                                onPress={captureAadhaar}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <Ionicons name="scan" size={24} color="#fff" />
                                        <Text style={styles.captureText}>{t('apply.captureAadhaar')}</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Scanned Aadhaar Preview */}
                    {scannedImage && !showScanner && (
                        <View style={styles.previewContainer}>
                            <Image source={{ uri: scannedImage }} style={styles.previewImage} />
                            <View style={styles.previewBadge}>
                                <Ionicons name="checkmark-circle" size={16} color="#059669" />
                                <Text style={styles.previewBadgeText}>{t('apply.aadhaarScanned')}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.rescanButton}
                                onPress={() => {
                                    setScannedImage(null);
                                    setAadhaar('');
                                    setShowScanner(true);
                                }}
                            >
                                <Text style={styles.rescanText}>{t('apply.rescan')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Manual Aadhaar Input */}
                    <Text style={styles.orText}>{t('apply.orManual')}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t('apply.aadhaarPlaceholder')}
                        keyboardType="numeric"
                        maxLength={12}
                        value={aadhaar}
                        onChangeText={setAadhaar}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('apply.mobile')} *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t('apply.mobilePlaceholder')}
                        keyboardType="phone-pad"
                        maxLength={10}
                        value={phone}
                        onChangeText={setPhone}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('apply.address')}</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder={t('apply.addressPlaceholder')}
                        multiline
                        numberOfLines={3}
                        value={address}
                        onChangeText={setAddress}
                    />
                </View>

                <View style={styles.infoBox}>
                    <Ionicons name="information-circle" size={20} color="#2563eb" />
                    <Text style={styles.infoText}>
                        {t('apply.fieldVisit')}
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, isSubmitting && styles.disabledButton]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    <Text style={styles.submitText}>
                        {isSubmitting ? t('apply.submitting') : t('apply.submit')}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#d97706',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        backgroundColor: '#f9fafb',
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    scannerSection: {
        marginBottom: 20,
    },
    scannerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    scanButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2563eb',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    scanButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
    cameraContainer: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 12,
    },
    camera: {
        height: 220,
    },
    cameraOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    scanFrame: {
        width: '85%',
        height: 140,
        borderWidth: 3,
        borderColor: '#fbbf24',
        borderRadius: 12,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanFrameText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    captureButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#059669',
        padding: 14,
        gap: 8,
    },
    captureText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    previewContainer: {
        marginBottom: 12,
    },
    previewImage: {
        width: '100%',
        height: 150,
        borderRadius: 12,
        marginBottom: 8,
    },
    previewBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    previewBadgeText: {
        color: '#059669',
        fontWeight: '600',
    },
    rescanButton: {
        alignSelf: 'flex-start',
    },
    rescanText: {
        color: '#2563eb',
        fontWeight: '600',
    },
    orText: {
        textAlign: 'center',
        color: '#9ca3af',
        marginVertical: 12,
        fontSize: 13,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#dbeafe',
        padding: 16,
        borderRadius: 12,
        gap: 12,
        marginBottom: 24,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#1e40af',
    },
    submitButton: {
        backgroundColor: '#d97706',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.6,
    },
    submitText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

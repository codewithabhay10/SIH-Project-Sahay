import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

export default function BeneficiaryDashboard() {
    const router = useRouter();
    const { t } = useTranslation();
    const [trustScore, setTrustScore] = useState(0);
    const [applicationStatus, setApplicationStatus] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const khataRaw = await AsyncStorage.getItem('khata_entries');
            const entries = khataRaw ? JSON.parse(khataRaw) : [];
            const score = Math.min(100, entries.length * 2.5 + (entries.length >= 30 ? 25 : 0));
            setTrustScore(Math.round(score));

            const appRaw = await AsyncStorage.getItem('beneficiary_application');
            if (appRaw) {
                const app = JSON.parse(appRaw);
                setApplicationStatus(app.status);
            }
        } catch (e) {
            console.log('Error:', e);
        }
    };

    const handleLogout = () => {
        router.replace('/');
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>सहाय</Text>
                    <Text style={styles.headerSubtitle}>{t('beneficiary.subtitle')}</Text>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Trust Score Card */}
                <View style={styles.scoreCard}>
                    <View style={styles.scoreCircle}>
                        <Text style={styles.scoreValue}>{trustScore}</Text>
                        <Text style={styles.scoreLabel}>{t('beneficiary.trustScore')}</Text>
                    </View>
                    <Text style={styles.scoreHint}>
                        {trustScore >= 75 ? t('beneficiary.eligible') : t('beneficiary.keepLogging')}
                    </Text>
                </View>

                {/* Application Status */}
                {applicationStatus && (
                    <View style={styles.statusCard}>
                        <Ionicons
                            name={applicationStatus === 'APPROVED' ? 'checkmark-circle' : 'hourglass'}
                            size={24}
                            color={applicationStatus === 'APPROVED' ? '#059669' : '#f59e0b'}
                        />
                        <View>
                            <Text style={styles.statusLabel}>{t('beneficiary.appStatus')}</Text>
                            <Text style={styles.statusValue}>{applicationStatus}</Text>
                        </View>
                    </View>
                )}

                {/* Action Cards */}
                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => router.push('/beneficiary/apply')}
                >
                    <View style={[styles.actionIcon, { backgroundColor: '#dbeafe' }]}>
                        <Ionicons name="document-text" size={28} color="#2563eb" />
                    </View>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>{t('beneficiary.applyScheme')}</Text>
                        <Text style={styles.actionSubtitle}>{t('beneficiary.submitApp')}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => router.push('/beneficiary/khata')}
                >
                    <View style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
                        <Ionicons name="book" size={28} color="#d97706" />
                    </View>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>{t('beneficiary.digitalKhata')}</Text>
                        <Text style={styles.actionSubtitle}>{t('beneficiary.logSales')}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionCard, trustScore < 75 && styles.disabledCard]}
                    onPress={() => trustScore >= 75 && router.push('/beneficiary/loan-certificate')}
                    disabled={trustScore < 75}
                >
                    <View style={[styles.actionIcon, { backgroundColor: '#dcfce7' }]}>
                        <Ionicons name="ribbon" size={28} color="#059669" />
                    </View>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionTitle}>{t('beneficiary.loanCert')}</Text>
                        <Text style={styles.actionSubtitle}>
                            {trustScore >= 75 ? t('beneficiary.downloadRec') : t('beneficiary.scoreRequired')}
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        backgroundColor: '#d97706',
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoutButton: {
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    content: {
        padding: 20,
        gap: 16,
    },
    scoreCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    scoreCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#fef3c7',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 4,
        borderColor: '#d97706',
    },
    scoreValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#d97706',
    },
    scoreLabel: {
        fontSize: 12,
        color: '#92400e',
        fontWeight: '600',
    },
    scoreHint: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
    },
    statusCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statusLabel: {
        fontSize: 12,
        color: '#6b7280',
    },
    statusValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    actionCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    disabledCard: {
        opacity: 0.5,
    },
    actionIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    actionSubtitle: {
        fontSize: 13,
        color: '#6b7280',
    },
});

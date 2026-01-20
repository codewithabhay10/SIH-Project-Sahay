import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

type KhataEntry = {
    id: string;
    amount: number;
    description: string;
    date: string;
};

export default function KhataScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const [entries, setEntries] = useState<KhataEntry[]>([]);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadEntries();
    }, []);

    const loadEntries = async () => {
        try {
            const raw = await AsyncStorage.getItem('khata_entries');
            if (raw) {
                setEntries(JSON.parse(raw));
            }
        } catch (e) {
            console.log('Error:', e);
        }
    };

    const addEntry = async () => {
        if (!amount || Number(amount) <= 0) {
            Alert.alert(t('alerts.invalidAmount'), t('alerts.enterValidAmount'));
            return;
        }

        const newEntry: KhataEntry = {
            id: Date.now().toString(),
            amount: Number(amount),
            description: description || 'Daily Sale',
            date: new Date().toISOString(),
        };

        const updated = [newEntry, ...entries];
        setEntries(updated);
        await AsyncStorage.setItem('khata_entries', JSON.stringify(updated));

        setAmount('');
        setDescription('');
        setShowForm(false);
        Alert.alert(`✅ ${t('alerts.entryAdded')}`, `₹${amount} ${t('alerts.recordedSuccessfully')}`);
    };

    const trustScore = Math.min(100, Math.round(entries.length * 2.5 + (entries.length >= 30 ? 25 : 0)));
    const totalEarnings = entries.reduce((sum, e) => sum + e.amount, 0);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('khata.title')}</Text>
                <TouchableOpacity onPress={() => setShowForm(!showForm)}>
                    <Ionicons name={showForm ? 'close' : 'add'} size={28} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>₹{totalEarnings.toLocaleString()}</Text>
                    <Text style={styles.statLabel}>{t('khata.totalEarnings')}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{entries.length}</Text>
                    <Text style={styles.statLabel}>{t('khata.entries')}</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={[styles.statValue, { color: trustScore >= 75 ? '#059669' : '#d97706' }]}>
                        {trustScore}
                    </Text>
                    <Text style={styles.statLabel}>{t('beneficiary.trustScore')}</Text>
                </View>
            </View>

            {/* Add Entry Form */}
            {showForm && (
                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>{t('khata.addSale')}</Text>
                    <View style={styles.row}>
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder={t('khata.amount')}
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />
                        <TextInput
                            style={[styles.input, { flex: 2, marginLeft: 12 }]}
                            placeholder={t('khata.description')}
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>
                    <TouchableOpacity style={styles.addButton} onPress={addEntry}>
                        <Ionicons name="checkmark" size={20} color="#fff" />
                        <Text style={styles.addButtonText}>{t('khata.addEntry')}</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Entries List */}
            <FlatList
                data={entries}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="book-outline" size={48} color="#d1d5db" />
                        <Text style={styles.emptyText}>{t('khata.noEntries')}</Text>
                        <Text style={styles.emptyHint}>{t('khata.tapToAdd')}</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.entryCard}>
                        <View style={styles.entryLeft}>
                            <Text style={styles.entryAmount}>₹{item.amount.toLocaleString()}</Text>
                            <Text style={styles.entryDesc}>{item.description}</Text>
                        </View>
                        <Text style={styles.entryDate}>
                            {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </Text>
                    </View>
                )}
            />
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
    statsRow: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    statLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 4,
    },
    formCard: {
        backgroundColor: '#fff',
        margin: 16,
        marginTop: 0,
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    formTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#059669',
        padding: 14,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    list: {
        padding: 16,
        paddingTop: 0,
    },
    empty: {
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        color: '#6b7280',
        marginTop: 12,
    },
    emptyHint: {
        fontSize: 14,
        color: '#9ca3af',
        marginTop: 4,
    },
    entryCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    entryLeft: {},
    entryAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#059669',
    },
    entryDesc: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 2,
    },
    entryDate: {
        fontSize: 14,
        color: '#9ca3af',
    },
});

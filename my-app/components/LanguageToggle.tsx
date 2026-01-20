import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'hi' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <TouchableOpacity style={styles.container} onPress={toggleLanguage}>
            <Text style={styles.text}>
                {i18n.language === 'en' ? 'हिंदी' : 'English'}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 999,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: '#d97706',
    },
});

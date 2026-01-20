import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, AccessibilityInfo, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

/**
 * VoiceGuide Component
 * 
 * Provides an accessible floating button to read aloud the content of the current screen.
 * Intended for visually impaired users.
 */
export default function VoiceGuide({ textToSpeak }: { textToSpeak: string }) {
    const { t, i18n } = useTranslation();
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handlePress = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        if (isSpeaking) {
            await Speech.stop();
            setIsSpeaking(false);
        } else {
            setIsSpeaking(true);
            Speech.speak(textToSpeak, {
                language: i18n.language === 'hi' ? 'hi-IN' : 'en-US',
                onDone: () => setIsSpeaking(false),
                onStopped: () => setIsSpeaking(false),
            });
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, isSpeaking ? styles.speaking : null]}
            onPress={handlePress}
            accessibilityRole="button"
            accessibilityLabel={isSpeaking ? t('accessibility.stopVoice') : t('accessibility.startVoice')}
            accessibilityHint={t('accessibility.voiceHint')}
        >
            <Ionicons
                name={isSpeaking ? "volume-high" : "volume-medium"}
                size={24}
                color="#fff"
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 100,
        left: 20, // Bottom Left to balance LanguageToggle on Bottom Right
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#2563eb',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 1000,
    },
    speaking: {
        backgroundColor: '#dc2626', // Red when speaking
    }
});

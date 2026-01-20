import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import LanguageToggle from '../components/LanguageToggle';

export default function Layout() {
  return (
    <I18nextProvider i18n={i18n}>
      <View style={styles.container}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Auth */}
          <Stack.Screen name="index" />

          {/* Common */}
          <Stack.Screen name="dash-board" />
          <Stack.Screen name="device-check" />
          <Stack.Screen name="add-beneficiary" />
          <Stack.Screen name="sync" />

          {/* Enumerator Routes */}
          <Stack.Screen name="enumerator/dashboard" />
          <Stack.Screen name="enumerator/survey/index" />
          <Stack.Screen name="enumerator/delivery" />
          <Stack.Screen name="enumerator/audit" />

          {/* Beneficiary Routes */}
          <Stack.Screen name="beneficiary/dashboard" />
          <Stack.Screen name="beneficiary/apply" />
          <Stack.Screen name="beneficiary/khata" />
          <Stack.Screen name="beneficiary/loan-certificate" />
        </Stack>

        {/* Global Language Toggle */}
        <LanguageToggle />
      </View>
    </I18nextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


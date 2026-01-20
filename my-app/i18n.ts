import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './app/locals/en.json';
import hi from './app/locals/hi.json';

const resources = {
    en: { translation: en },
    hi: { translation: hi },
} as const;

// ✅ CORRECT WAY WITH EXPO LOCALIZATION
const getDeviceLanguage = (): keyof typeof resources => {
    const locales = Localization.getLocales();        // <- this is the API now
    const tag = locales[0]?.languageTag ?? 'en';      // e.g. "en-US", "hi-IN"
    const base = tag.split('-')[0] as keyof typeof resources; // "en", "hi"

    return base;
};

const fallbackLng: keyof typeof resources = 'en';

const detected = getDeviceLanguage();
const initialLng: keyof typeof resources =
    detected in resources ? detected : fallbackLng;

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: initialLng,
        fallbackLng,
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
            bindI18n: 'languageChanged loaded',
            bindI18nStore: 'added removed',
        },
    });

export default i18n;

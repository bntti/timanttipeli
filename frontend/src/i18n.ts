import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation.json';
import fi from './locales/fi/translation.json';

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: { en: { translation: en }, fi: { translation: fi } },
        fallbackLng: 'en',
        // lng: 'en',
        debug: true, // TODO: Remove

        interpolation: {
            escapeValue: false, // Not needed for react as it escapes by default
        },
    });

export { default } from 'i18next';

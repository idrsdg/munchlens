import { tr } from "./locales/tr";
import { en } from "./locales/en";
import { fr } from "./locales/fr";
import { es } from "./locales/es";

export type Locale = "tr" | "en" | "fr" | "es";
export type { Translations } from "./locales/tr";

export const LOCALES: Record<Locale, { label: string; flag: string; nativeName: string }> = {
  tr: { label: "Turkish",   flag: "🇹🇷", nativeName: "Türkçe"   },
  en: { label: "English",   flag: "🇬🇧", nativeName: "English"  },
  fr: { label: "French",    flag: "🇫🇷", nativeName: "Français" },
  es: { label: "Spanish",   flag: "🇪🇸", nativeName: "Español"  },
};

export const translations: Record<Locale, typeof tr> = { tr, en, fr, es };

export const DEFAULT_LOCALE: Locale = "tr";
export const LOCALE_COOKIE = "munchlens_locale";

export function getT(locale: Locale) {
  return translations[locale] ?? translations[DEFAULT_LOCALE];
}

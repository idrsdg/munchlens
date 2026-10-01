"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { type Locale, type Translations, DEFAULT_LOCALE, LOCALE_COOKIE, getT, LOCALES } from "./index";

interface I18nContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
  locales: typeof LOCALES;
}

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  t: getT(DEFAULT_LOCALE),
  setLocale: () => {},
  locales: LOCALES,
});

function readCookieLocale(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]+)`));
  const val = match?.[1] as Locale | undefined;
  return val && val in LOCALES ? val : DEFAULT_LOCALE;
}

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? DEFAULT_LOCALE);

  // Hydrate from cookie on mount (client-side only)
  useEffect(() => {
    const cookieLocale = readCookieLocale();
    if (cookieLocale !== locale) {
      setLocaleState(cookieLocale);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    // Persist to cookie (1 year)
    document.cookie = `${LOCALE_COOKIE}=${newLocale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
    // Optionally sync with user profile in background
    fetch("/api/kullanici", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: newLocale }),
    }).catch(() => {});
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t: getT(locale), setLocale, locales: LOCALES }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

// Convenience alias
export function useT() {
  return useContext(I18nContext).t;
}

import { createContext, useContext, useEffect, useMemo } from 'react';
import { DEFAULT_LANGUAGE, getInvitationCopy, getUiStrings, resolveLanguage } from '../utils/i18n';

const LanguageContext = createContext({
  language: DEFAULT_LANGUAGE,
  ui: getUiStrings(DEFAULT_LANGUAGE),
  copy: getInvitationCopy(DEFAULT_LANGUAGE)
});

export function LanguageProvider({ language = DEFAULT_LANGUAGE, copyOverrides = null, children }) {
  const resolvedLanguage = resolveLanguage(language);
  const value = useMemo(
    () => ({
      language: resolvedLanguage,
      ui: getUiStrings(resolvedLanguage),
      copy: getInvitationCopy(resolvedLanguage, copyOverrides ?? undefined)
    }),
    [copyOverrides, resolvedLanguage]
  );

  useEffect(() => {
    document.documentElement.lang = resolvedLanguage;
  }, [resolvedLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useUiStrings() {
  return useContext(LanguageContext).ui;
}

export function useInvitationCopy() {
  return useContext(LanguageContext).copy;
}

export function useLanguage() {
  return useContext(LanguageContext).language;
}

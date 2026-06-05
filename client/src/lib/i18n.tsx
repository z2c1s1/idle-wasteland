import React, { createContext, useContext, useState, useCallback } from "react";
import { uiText } from "./text";
import { uiTextEn } from "./text-en";

export type Language = "zh" | "en";

const STORAGE_KEY = "wasteland_lang";

function loadLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "zh" || stored === "en") return stored;
  } catch { /* localStorage unavailable */ }
  return "zh";
}

function saveLanguage(lang: Language) {
  try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* ignore */ }
}

// Both text modules have identical structure; cast en to zh's type
type UIText = typeof uiText;
const texts: Record<Language, UIText> = { zh: uiText, en: uiTextEn as unknown as UIText };

const LanguageCtx = createContext<{
  lang: Language;
  t: UIText;
  setLanguage: (lang: Language) => void;
}>({ lang: "zh", t: uiText, setLanguage: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(loadLanguage);
  const setLanguage = useCallback((l: Language) => { setLang(l); saveLanguage(l); }, []);
  return React.createElement(LanguageCtx.Provider, { value: { lang, t: texts[lang], setLanguage } }, children);
}

/** Hook: returns current language + UI text object + setter */
export function useLanguage() {
  return useContext(LanguageCtx);
}

/** Shorthand: just the UI text object */
export function useUIText(): UIText {
  return useContext(LanguageCtx).t;
}

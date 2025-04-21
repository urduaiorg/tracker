import { useState, useEffect } from "react";
import { useLocalStorage } from "./use-local-storage";

type Language = "en" | "ur";

export const useLang = () => {
  const [language, setLanguage] = useLocalStorage<Language>("language", "en");
  
  // Apply RTL for Urdu language
  useEffect(() => {
    const htmlEl = document.querySelector("html");
    if (htmlEl) {
      if (language === "ur") {
        htmlEl.setAttribute("dir", "rtl");
        htmlEl.setAttribute("lang", "ur");
      } else {
        htmlEl.setAttribute("dir", "ltr");
        htmlEl.setAttribute("lang", "en");
      }
    }
  }, [language]);
  
  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ur" : "en");
  };
  
  return {
    language,
    setLanguage,
    toggleLanguage,
    isRtl: language === "ur"
  };
};

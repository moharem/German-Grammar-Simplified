import { createContext, useContext } from "react";
import type { LocalizedText } from "../content/types";
import type { LearningLanguage } from "../content/visual";
export const LearningLanguageContext = createContext<LearningLanguage>("en");
export function useLearningLanguage() {
  const language = useContext(LearningLanguageContext);
  return {
    language,
    t: (de: string, en: string) => (language === "de" ? de : en),
    local: (text: LocalizedText) => text[language],
  };
}

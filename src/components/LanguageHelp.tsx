import { createContext, useContext } from "react";
import type { LocalizedText, SupportLanguage } from "../content/types";
import { supportLanguages } from "../content/types";

export const LanguageContext = createContext({
  language: "en" as SupportLanguage,
  expanded: false,
});

export function LanguageHelp({
  text,
  label,
  onReveal,
  automatic = true,
}: {
  text: LocalizedText | string;
  label?: string;
  onReveal?: () => void;
  automatic?: boolean;
}) {
  const { language, expanded } = useContext(LanguageContext);
  const translation = typeof text === "string" ? text : text[language];
  if (!translation) return null;
  return (
    <details
      className="language-help"
      open={automatic && expanded ? true : undefined}
      onToggle={(event) => {
        if (event.currentTarget.open) onReveal?.();
      }}
    >
      <summary>
        <span className="language-tag">{language.toUpperCase()}</span>
        {label ?? "English anzeigen"}
        <span className="help-chevron" aria-hidden="true">
          ⌄
        </span>
      </summary>
      <p lang={language} dir={supportLanguages[language].dir}>
        {translation}
      </p>
    </details>
  );
}

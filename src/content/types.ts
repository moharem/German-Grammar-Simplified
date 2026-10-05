export type SupportLanguage = "en" | "ar";
export type LocalizedText = { de: string; en: string; ar?: string };
export type Concept =
  "change" | "future" | "passive" | "conditional" | "perfect-passive";
export type QuestionKind = "choice" | "gap" | "repair" | "dialogue";

export interface Question {
  id: string;
  kind: QuestionKind;
  concepts: Concept[];
  instruction: LocalizedText;
  sentence: string;
  translation: LocalizedText;
  options?: string[];
  answers: string[];
  solution: string;
  feedback: LocalizedText;
  distractorFeedback?: Record<string, LocalizedText>;
  hint: LocalizedText;
  dialogue?: { speaker: string; text: string }[];
}

export interface Explanation {
  id: string;
  concept: Concept;
  form: string;
  label: string;
  title: string;
  body: LocalizedText;
  formula: string;
  example: string;
  translation: LocalizedText;
  note: LocalizedText;
  conjugation?: string;
  color: "sage" | "blue" | "lavender" | "peach";
}

export interface Lesson {
  id: string;
  version: number;
  title: string;
  explanations: Explanation[];
  questions: Question[];
  diagnosticIds: string[];
  practiceIds: string[];
  adaptiveIds: string[];
  revisitIds: string[];
}

export const supportLanguages: Record<
  SupportLanguage,
  { label: string; dir: "ltr" | "rtl" }
> = {
  en: { label: "English", dir: "ltr" },
  ar: { label: "العربية", dir: "rtl" },
};

export const conceptLabels: Record<Concept, string> = {
  change: "Veränderung",
  future: "Zukunft",
  passive: "Passiv",
  conditional: "Möglichkeit & Höflichkeit",
  "perfect-passive": "worden & geworden",
};

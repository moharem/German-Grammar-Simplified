import type { LocalizedText, Question } from "./types";

export type LearningLanguage = "en" | "de";
export const languageMeta = {
  en: { label: "English", dir: "ltr" },
  de: { label: "Deutsch", dir: "ltr" },
  ar: { label: "العربية", dir: "rtl" },
} as const;
const text = (de: string, en: string): LocalizedText => ({ de, en });
export type MemoryForm = "werden" | "würden" | "worden";
export interface VisualPattern {
  id: string;
  label: LocalizedText;
  cue: LocalizedText;
  parts: { word: string; meaning: LocalizedText; focus?: boolean }[];
  pattern: LocalizedText[];
  translation: LocalizedText;
  recallPrompt: LocalizedText;
}
export const patterns: Record<MemoryForm, VisualPattern[]> = {
  werden: [
    {
      id: "future",
      label: text("Zukunft", "Will"),
      cue: text("Ein Blick nach vorn.", "Look ahead."),
      parts: [
        { word: "Ich", meaning: text("Wer?", "I") },
        { word: "werde", meaning: text("Zukunft", "will"), focus: true },
        { word: "kochen.", meaning: text("Grundform", "cook"), focus: true },
      ],
      pattern: [
        text("werden", "werden"),
        text("Grundform des Verbs", "verb: cook, go, call…"),
      ],
      translation: text("Ich werde kochen.", "I will cook."),
      recallPrompt: text("Du planst zu kochen.", "I will cook."),
    },
    {
      id: "change",
      label: text("Veränderung", "Become"),
      cue: text("Etwas verändert sich.", "A change of state."),
      parts: [
        { word: "Es", meaning: text("Was?", "It") },
        {
          word: "wird",
          meaning: text("Veränderung", "is getting"),
          focus: true,
        },
        { word: "kalt.", meaning: text("Neuer Zustand", "cold"), focus: true },
      ],
      pattern: [
        text("werden", "werden"),
        text("Zustand / Nomen", "state / noun"),
      ],
      translation: text("Es wird kalt.", "It is getting cold."),
      recallPrompt: text("Es ist bald nicht mehr warm.", "It is getting cold."),
    },
    {
      id: "passive",
      label: text("Handlung", "Is being"),
      cue: text("Jemand macht etwas damit.", "Someone does something to it."),
      parts: [
        { word: "Das Rad", meaning: text("Was?", "The bike") },
        { word: "wird", meaning: text("Passiv", "is being"), focus: true },
        {
          word: "repariert.",
          meaning: text("Partizip: repariert", "repaired"),
          focus: true,
        },
      ],
      pattern: [
        text("werden", "werden"),
        text("repariert, bezahlt…", "repaired, paid…"),
      ],
      translation: text(
        "Das Rad wird repariert.",
        "The bike is being repaired.",
      ),
      recallPrompt: text(
        "Jemand repariert das Rad.",
        "The bike is being repaired.",
      ),
    },
  ],
  würden: [
    {
      id: "conditional",
      label: text("Möglichkeit", "Would"),
      cue: text(
        "Stell es dir vor. Oder bitte höflich.",
        "Imagine it. Or ask politely.",
      ),
      parts: [
        { word: "Ich", meaning: text("Wer?", "I") },
        { word: "würde", meaning: text("Möglichkeit", "would"), focus: true },
        { word: "reisen.", meaning: text("Grundform", "travel"), focus: true },
      ],
      pattern: [
        text("würde / würden", "würde / würden"),
        text("Grundform des Verbs", "verb: travel, cook, help…"),
      ],
      translation: text("Ich würde reisen.", "I would travel."),
      recallPrompt: text("Stell dir eine Reise vor.", "I would travel."),
    },
  ],
  worden: [
    {
      id: "perfect-passive",
      label: text("Schon erledigt", "Has been done"),
      cue: text("Die Handlung ist abgeschlossen.", "The action is complete."),
      parts: [
        { word: "Das Paket", meaning: text("Was?", "The parcel") },
        { word: "ist", meaning: text("sein", "has"), focus: true },
        {
          word: "geliefert",
          meaning: text("Partizip", "delivered"),
          focus: true,
        },
        {
          word: "worden.",
          meaning: text("Passiv · Perfekt", "been"),
          focus: true,
        },
      ],
      pattern: [
        text("ist / sind", "ist / sind"),
        text("geliefert, bezahlt…", "delivered, paid…"),
        text("worden", "worden"),
      ],
      translation: text(
        "Das Paket ist geliefert worden.",
        "The parcel has been delivered.",
      ),
      recallPrompt: text(
        "Jemand hat das Paket geliefert.",
        "The parcel has been delivered.",
      ),
    },
  ],
};

// These are meaning choices, rather than German sentences to produce.
export const optionMeanings: Record<string, string> = {
  "Jemand öffnet die Tür.": "Someone is opening the door.",
  "Jemand wird die Tür öffnen.": "Someone will open the door.",
  "Jemand wird die Tür morgen öffnen.": "Someone will open the door tomorrow.",
  "Die Tür ist geschlossen.": "The door is closed.",
  "Die Tür bleibt geschlossen.": "The door stays closed.",
  "Eine Veränderung": "A change",
  "Eine höfliche Bitte": "A polite request",
  "Eine Handlung im Passiv": "An action done to something",
  "Eine Veränderung des Zustands.": "A change of state",
  "Eine Veränderung des Zustands": "A change of state",
  "Ein Passiv im Perfekt": "An action that has been done",
};
export const optionGlosses: Record<string, string> = {
  "Ich wurde einen Ausflug machen.": "I … take a day trip.",
  "Ich würde einen Ausflug machen.": "I … take a day trip.",
  "Ich bin einen Ausflug worden.": "I … take a day trip.",
  "Wir werden morgen gemeinsam kochen.": "We will cook together tomorrow.",
  "Das Essen wird gekocht.": "The food is being cooked.",
  "Das Essen ist kalt geworden.": "The food has become cold.",
  "Ich werde morgen einen Tisch reservieren.": "I will book a table tomorrow.",
  "Ich würde ein Buch kaufen.": "I … buy a book.",
  "Ich wurde ein Buch kaufen.": "I … buy a book.",
  "Ich bin ein Buch worden.": "I … buy a book.",
  "Der Tisch wird reserviert.": "The table is being booked.",
  "Der Tisch ist reserviert worden.": "The table has been booked.",
};
const instructions: Record<string, LocalizedText> = {
  "d-passive": text("Was bedeutet der Satz?", "What does the sentence mean?"),
  "d-conditional": text(
    "Ergänze die höfliche Bitte.",
    "Complete the polite request.",
  ),
  "d-perfect": text(
    "Die E-Mail ist schon verschickt. Was fehlt?",
    "The email has been sent. What is missing?",
  ),
  "p-future": text(
    "Ergänze „werden“ für ich.",
    "Fill in the “ich” (I) form of werden.",
  ),
  "p-passive": text(
    "Ersetze nur „reparieren“.",
    "Fix one word: replace “reparieren”.",
  ),
  "p-dialogue": text(
    "Ein freier Tag — was würdest du machen?",
    "Imagine a day off. Choose your reply.",
  ),
  "p-polite": text(
    "Ergänze den höflichen Wunsch.",
    "Complete the polite wish.",
  ),
  "p-perfect": text("worden oder geworden?", "worden or geworden?"),
  "p-geworden": text(
    "Du bist jetzt müde. Welche Form passt?",
    "You became tired. Which form fits?",
  ),
  "a-future": text("Wähle einen Zukunftsplan.", "Choose a future plan."),
  "a-change": text(
    "Sie hat einen neuen Beruf. Ergänze.",
    "She became a doctor. Fill the gap.",
  ),
  "a-passive": text(
    "Ergänze werden für die Fenster.",
    "Fill in werden for “die Fenster” (the windows).",
  ),
  "a-conditional": text(
    "Stell dir mehr Platz vor. Ergänze.",
    "Imagine having more space. Fill the gap.",
  ),
  "a-perfect": text(
    "Ersetze nur „geworden“.",
    "Fix one word: replace “geworden”.",
  ),
  "r-future-1": text(
    "Ergänze werden für du.",
    "Fill in the “du” (you) form of werden.",
  ),
  "r-passive-1": text(
    "Das Frühstück wird serviert. Ergänze.",
    "Breakfast is being served. Fill the gap.",
  ),
  "r-passive-2": text(
    "Letzte Woche: Ergänze die Vergangenheit.",
    "Last week: fill in the past form.",
  ),
  "r-conditional-1": text(
    "Stell dir hundert Euro vor. Wähle die Antwort.",
    "Imagine having €100. Choose your reply.",
  ),
  "r-conditional-2": text(
    "Ergänze die höfliche Bitte.",
    "Complete the polite request.",
  ),
};
export const instructionFor = (q: Question): LocalizedText =>
  instructions[q.id] ?? q.instruction;
export const formFor = (q: Question): MemoryForm =>
  q.concepts[0] === "conditional"
    ? "würden"
    : q.concepts[0] === "perfect-passive"
      ? "worden"
      : "werden";
export function shortFeedback(q: Question, response: string): LocalizedText {
  if (
    q.id === "p-polite" &&
    ["wurde", "würden", "wuerden"].includes(response.toLowerCase().trim())
  ) {
    return response.toLowerCase().trim() === "wurde"
      ? text(
          "Die zwei Punkte zählen: würde = Möglichkeit, wurde = Vergangenheit.",
          "Those two dots matter: würde = would; wurde = past.",
        )
      : text(
          "ich würde · wir / sie / Sie würden.",
          "ich (I) → würde · wir / sie / Sie (we / they / you formal) → würden.",
        );
  }
  if (q.answers.includes("geworden"))
    return text(
      "Ein neuer Zustand / Beruf → geworden. Behalte ge-.",
      "A new state / job → geworden. Keep ge-.",
    );
  if (q.answers.includes("wurde"))
    return text(
      "Es ist wirklich passiert → wurde, ohne ü.",
      "It really happened → wurde, without ü.",
    );
  const cues = {
    future: text(
      "werden + Grundform am Ende → Zukunft.",
      "werden + base verb at the end → will.",
    ),
    change: text(
      "werden + Zustand → Veränderung.",
      "werden + a state → become / get.",
    ),
    passive: text(
      "werden + repariert / geöffnet… → jemand macht etwas damit.",
      "werden + repaired / opened… → something is being done to it.",
    ),
    conditional: text(
      "würde / würden + Grundform → Möglichkeit oder höfliche Bitte.",
      "würde / würden + base verb → would: imagined or polite.",
    ),
    "perfect-passive": text(
      "ist / sind + erledigte Handlung + worden. Ohne ge-.",
      "ist / sind + delivered, paid… + worden → has been done. No ge-.",
    ),
  };
  return cues[q.concepts[0]];
}

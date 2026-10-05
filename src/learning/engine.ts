import { questionById, werdenLesson as lesson } from "../content/werden";
import type { Concept, Question } from "../content/types";

export const STORAGE_KEY = "wortwaerts:trial:v1";
export const MAX_EXTRA_QUESTIONS = 2;
export type Stage =
  | "idle"
  | "diagnostic"
  | "explanation"
  | "practice"
  | "speaking"
  | "review"
  | "complete";
export interface Attempt {
  questionId: string;
  response: string;
  correct: boolean;
  assisted: boolean;
  phase: "diagnostic" | "practice" | "revisit";
}
export interface History {
  completedAt: string;
  reviewDueAt: string;
  weakConcepts: Concept[];
  seenQuestionIds: string[];
}
export interface Session {
  version: 1;
  lessonVersion: number;
  stage: Stage;
  mode: "lesson" | "revisit";
  queue: string[];
  index: number;
  explanationIndex: number;
  draft: string;
  submitted: boolean;
  hintUsed: boolean;
  adaptivePlanned: boolean;
  attempts: Attempt[];
  bookmarks: string[];
  speakingModelSeen: boolean;
  speakingReflection: "again" | "okay" | null;
  history: History | null;
}

export const initialSession = (): Session => ({
  version: 1,
  lessonVersion: lesson.version,
  stage: "idle",
  mode: "lesson",
  queue: [],
  index: 0,
  explanationIndex: 0,
  draft: "",
  submitted: false,
  hintUsed: false,
  adaptivePlanned: false,
  attempts: [],
  bookmarks: [],
  speakingModelSeen: false,
  speakingReflection: null,
  history: null,
});

// Normalize typography, keeping grammatical distinctions intact.
export function normalizeAnswer(answer: string): string {
  return answer
    .normalize("NFC")
    .trim()
    .toLocaleLowerCase("de")
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const asciiUmlauts = (value: string) =>
  value.replace(/ü/g, "ue").replace(/ä/g, "ae").replace(/ö/g, "oe");
const matchesAnswer = (answer: string, candidate: string) => {
  const actual = normalizeAnswer(answer);
  const expected = normalizeAnswer(candidate);
  return actual === expected || actual === asciiUmlauts(expected);
};

export const isCorrect = (question: Question, answer: string): boolean =>
  question.answers.some((candidate) => matchesAnswer(answer, candidate));

export const feedbackFor = (question: Question, answer: string) =>
  Object.entries(question.distractorFeedback ?? {}).find(([candidate]) =>
    matchesAnswer(answer, candidate),
  )?.[1] ?? question.feedback;

export function getWeakConcepts(attempts: Attempt[]): Concept[] {
  const needs = new Map<Concept, number>();
  for (const attempt of attempts) {
    const weight = !attempt.correct ? 1 : attempt.assisted ? 0.5 : -0.5;
    for (const concept of questionById[attempt.questionId]?.concepts ?? []) {
      needs.set(concept, Math.max(0, (needs.get(concept) ?? 0) + weight));
    }
  }
  return [...needs]
    .filter(([, weight]) => weight > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([concept]) => concept);
}

export function selectAdaptive(attempts: Attempt[]): string[] {
  const weak = getWeakConcepts(attempts);
  const used = new Set(attempts.map((a) => a.questionId));
  return weak
    .map((concept) =>
      lesson.adaptiveIds.find(
        (id) => questionById[id].concepts.includes(concept) && !used.has(id),
      ),
    )
    .filter((id): id is string => Boolean(id))
    .filter((id, index, all) => all.indexOf(id) === index)
    .slice(0, MAX_EXTRA_QUESTIONS);
}

export function selectRevisit(history: History | null): string[] {
  const seen = new Set(history?.seenQuestionIds ?? []);
  const weak = history?.weakConcepts ?? [];
  const ranked = [...lesson.revisitIds].sort((a, b) => {
    const priority = (id: string) =>
      (seen.has(id) ? 100 : 0) +
      Math.min(
        ...questionById[id].concepts.map((c) => {
          const rank = weak.indexOf(c);
          return rank < 0 ? 20 : rank;
        }),
      );
    return priority(a) - priority(b);
  });
  // At most two questions per main concept; a revisit retains mixed practice.
  const counts = new Map<Concept, number>();
  const selected: string[] = [];
  const add = (id: string) => {
    const concept = questionById[id].concepts[0];
    const count = counts.get(concept) ?? 0;
    if (selected.includes(id) || count >= 2 || selected.length >= 5) return;
    counts.set(concept, count + 1);
    selected.push(id);
  };
  // Cover each recorded weak distinction before allocating extra examples.
  for (const concept of weak) {
    if (selected.some((id) => questionById[id].concepts.includes(concept)))
      continue;
    const id = ranked.find((candidate) =>
      questionById[candidate].concepts.includes(concept),
    );
    if (id) add(id);
  }
  for (const id of ranked) add(id);
  return selected;
}

export function getMissed(attempts: Attempt[]): Attempt[] {
  return attempts.filter((a) => !a.correct || a.assisted);
}

export function getPracticeStats(attempts: Attempt[]) {
  const practice = attempts.filter((a) => a.phase !== "diagnostic");
  return {
    total: practice.length,
    unaided: practice.filter((a) => a.correct && !a.assisted).length,
    assisted: practice.filter((a) => a.correct && a.assisted).length,
  };
}

const cleanQuestionState = { draft: "", submitted: false, hintUsed: false };
export type Action =
  | { type: "START" }
  | { type: "REVISIT" }
  | { type: "ANSWER"; value: string }
  | { type: "HINT" }
  | { type: "SUBMIT"; skip?: boolean }
  | { type: "NEXT" }
  | { type: "EXPLAIN_NEXT" }
  | { type: "SPEAK_MODEL" }
  | { type: "SPEAK_REFLECT"; value: "again" | "okay" }
  | { type: "SPEAK_FINISH" }
  | { type: "FINISH"; at: string }
  | { type: "BOOKMARK"; id: string };

export function reducer(state: Session, action: Action): Session {
  switch (action.type) {
    case "START":
      return {
        ...initialSession(),
        bookmarks: state.bookmarks,
        history: state.history,
        stage: "diagnostic",
        queue: [...lesson.diagnosticIds],
      };
    case "REVISIT":
      return {
        ...initialSession(),
        bookmarks: state.bookmarks,
        history: state.history,
        mode: "revisit",
        stage: "practice",
        queue: selectRevisit(state.history),
        adaptivePlanned: true,
      };
    case "ANSWER":
      return state.submitted ? state : { ...state, draft: action.value };
    case "HINT":
      return state.submitted ? state : { ...state, hintUsed: true };
    case "SUBMIT": {
      if (state.submitted || !["diagnostic", "practice"].includes(state.stage))
        return state;
      const question = questionById[state.queue[state.index]];
      if (!question || (!action.skip && !state.draft.trim())) return state;
      const response = action.skip ? "" : state.draft;
      return {
        ...state,
        draft: response,
        submitted: true,
        attempts: [
          ...state.attempts,
          {
            questionId: question.id,
            response,
            correct: isCorrect(question, response),
            assisted: state.hintUsed,
            phase:
              state.stage === "diagnostic"
                ? "diagnostic"
                : state.mode === "revisit"
                  ? "revisit"
                  : "practice",
          },
        ],
      };
    }
    case "NEXT": {
      if (!state.submitted) return state;
      if (state.index + 1 < state.queue.length) {
        return { ...state, ...cleanQuestionState, index: state.index + 1 };
      }
      if (state.stage === "diagnostic") {
        return {
          ...state,
          ...cleanQuestionState,
          stage: "explanation",
          index: 0,
        };
      }
      if (state.stage !== "practice") return state;
      if (!state.adaptivePlanned && state.mode === "lesson") {
        const extra = selectAdaptive(state.attempts);
        if (extra.length) {
          return {
            ...state,
            ...cleanQuestionState,
            adaptivePlanned: true,
            queue: [...state.queue, ...extra],
            index: state.index + 1,
          };
        }
      }
      return {
        ...state,
        ...cleanQuestionState,
        stage: state.mode === "revisit" ? "review" : "speaking",
      };
    }
    case "EXPLAIN_NEXT":
      if (state.stage !== "explanation") return state;
      return {
        ...state,
        ...cleanQuestionState,
        stage: "practice",
        queue: [...lesson.practiceIds],
        index: 0,
      };
    case "SPEAK_MODEL":
      return { ...state, speakingModelSeen: !state.speakingModelSeen };
    case "SPEAK_REFLECT":
      return { ...state, speakingReflection: action.value };
    case "SPEAK_FINISH":
      return state.stage === "speaking" ? { ...state, stage: "review" } : state;
    case "FINISH": {
      if (state.stage !== "review") return state;
      const due = new Date(action.at);
      due.setDate(due.getDate() + 1);
      const tested = new Set(
        state.attempts.flatMap((a) => questionById[a.questionId].concepts),
      );
      const untested =
        state.mode === "revisit"
          ? (state.history?.weakConcepts ?? []).filter((c) => !tested.has(c))
          : [];
      return {
        ...state,
        stage: "complete",
        history: {
          completedAt: action.at,
          reviewDueAt: due.toISOString(),
          weakConcepts: [
            ...new Set([...getWeakConcepts(state.attempts), ...untested]),
          ],
          seenQuestionIds: [
            ...new Set([
              ...(state.history?.seenQuestionIds ?? []),
              ...state.attempts.map((a) => a.questionId),
            ]),
          ],
        },
      };
    }
    case "BOOKMARK":
      if (!lesson.explanations.some((card) => card.id === action.id))
        return state;
      return {
        ...state,
        bookmarks: state.bookmarks.includes(action.id)
          ? state.bookmarks.filter((id) => id !== action.id)
          : [...state.bookmarks, action.id],
      };
  }
}

export function progressPercent(state: Session): number {
  if (state.mode === "revisit") {
    if (state.stage === "complete") return 100;
    if (state.stage === "review") return 95;
    return Math.round(
      (90 * (state.index + Number(state.submitted))) /
        Math.max(1, state.queue.length),
    );
  }
  switch (state.stage) {
    case "idle":
      return 0;
    case "diagnostic":
      return Math.round(
        (15 * (state.index + Number(state.submitted))) /
          lesson.diagnosticIds.length,
      );
    case "explanation":
      return (
        15 +
        Math.round((20 * state.explanationIndex) / lesson.explanations.length)
      );
    case "practice":
      return (
        35 +
        Math.round(
          (50 * (state.index + Number(state.submitted))) /
            (lesson.practiceIds.length + MAX_EXTRA_QUESTIONS),
        )
      );
    case "speaking":
      return 85;
    case "review":
      return 95;
    case "complete":
      return 100;
  }
}

const stages: Stage[] = [
  "idle",
  "diagnostic",
  "explanation",
  "practice",
  "speaking",
  "review",
  "complete",
];
const concepts: Concept[] = [
  "change",
  "future",
  "passive",
  "conditional",
  "perfect-passive",
];
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;
const stringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((v) => typeof v === "string");

export function restoreSession(raw: string | null): Session {
  if (!raw) return initialSession();
  try {
    const s: unknown = JSON.parse(raw);
    if (
      !record(s) ||
      s.version !== 1 ||
      s.lessonVersion !== lesson.version ||
      !stages.includes(s.stage as Stage) ||
      !["lesson", "revisit"].includes(s.mode as string) ||
      !stringArray(s.queue) ||
      !s.queue.every((id) => Boolean(questionById[id])) ||
      !Number.isInteger(s.index) ||
      Number(s.index) < 0 ||
      !Number.isInteger(s.explanationIndex) ||
      Number(s.explanationIndex) < 0 ||
      Number(s.explanationIndex) >= lesson.explanations.length ||
      typeof s.draft !== "string" ||
      !["submitted", "hintUsed", "adaptivePlanned", "speakingModelSeen"].every(
        (key) => typeof s[key] === "boolean",
      ) ||
      ![null, "again", "okay"].includes(
        s.speakingReflection as string | null,
      ) ||
      !stringArray(s.bookmarks) ||
      !s.bookmarks.every((id) =>
        lesson.explanations.some((c) => c.id === id),
      ) ||
      !Array.isArray(s.attempts) ||
      !s.attempts.every(
        (a) =>
          record(a) &&
          typeof a.questionId === "string" &&
          Boolean(questionById[a.questionId]) &&
          typeof a.response === "string" &&
          typeof a.correct === "boolean" &&
          typeof a.assisted === "boolean" &&
          ["diagnostic", "practice", "revisit"].includes(a.phase as string),
      )
    )
      return initialSession();
    if (["diagnostic", "practice"].includes(s.stage as string)) {
      if (s.queue.length === 0 || Number(s.index) >= s.queue.length)
        return initialSession();
      if (
        s.submitted &&
        !s.attempts.some(
          (a) =>
            record(a) &&
            a.questionId === (s.queue as string[])[Number(s.index)],
        )
      )
        return initialSession();
    }
    if (
      s.history !== null &&
      (!record(s.history) ||
        typeof s.history.completedAt !== "string" ||
        Number.isNaN(Date.parse(s.history.completedAt)) ||
        typeof s.history.reviewDueAt !== "string" ||
        Number.isNaN(Date.parse(s.history.reviewDueAt)) ||
        !stringArray(s.history.weakConcepts) ||
        !s.history.weakConcepts.every((c) => concepts.includes(c as Concept)) ||
        !stringArray(s.history.seenQuestionIds))
    )
      return initialSession();
    return s as unknown as Session;
  } catch {
    return initialSession();
  }
}

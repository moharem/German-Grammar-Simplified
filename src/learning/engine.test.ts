import { describe, expect, it } from "vitest";
import { questionById, werdenLesson } from "../content/werden";
import {
  feedbackFor,
  getPracticeStats,
  initialSession,
  isCorrect,
  MAX_EXTRA_QUESTIONS,
  reducer,
  restoreSession,
  selectAdaptive,
  selectRevisit,
} from "./engine";
import type { Attempt, Session } from "./engine";

const wrong = (questionId: string): Attempt => ({
  questionId,
  response: "wrong",
  correct: false,
  assisted: false,
  phase: "practice",
});
const answerAndNext = (s: Session, answer: string): Session =>
  reducer(
    reducer(reducer(s, { type: "ANSWER", value: answer }), { type: "SUBMIT" }),
    { type: "NEXT" },
  );

describe("grammar answer checking", () => {
  it("accepts umlaut alternatives and casing without conflating past and conditional", () => {
    expect(isCorrect(questionById["p-polite"], "  WUERDE. ")).toBe(true);
    expect(isCorrect(questionById["p-polite"], "wurde")).toBe(false);
    expect(isCorrect(questionById["p-past"], "würde")).toBe(false);
    expect(isCorrect(questionById["p-perfect"], "geworden")).toBe(false);
    expect(feedbackFor(questionById["p-polite"], "wurde").de).toContain(
      "Vergangenheitsform",
    );
    expect(feedbackFor(questionById["p-polite"], "wuerden").de).toContain(
      "wir, sie oder Sie",
    );
  });
  it("every choice question includes its answer and each queue references actual content", () => {
    for (const q of werdenLesson.questions) {
      if (q.options) expect(q.options.some((o) => isCorrect(q, o))).toBe(true);
    }
    expect(new Set(werdenLesson.questions.map((q) => q.id)).size).toBe(
      werdenLesson.questions.length,
    );
    for (const id of [
      ...werdenLesson.diagnosticIds,
      ...werdenLesson.practiceIds,
      ...werdenLesson.adaptiveIds,
      ...werdenLesson.revisitIds,
    ]) {
      expect(questionById[id]).toBeDefined();
    }
  });
});

describe("bounded adaptive practice", () => {
  it("prioritizes the recurring weak distinction and never repeats a question", () => {
    const attempts = [
      wrong("p-perfect"),
      wrong("d-perfect"),
      wrong("p-polite"),
      wrong("p-passive"),
      wrong("p-future"),
      wrong("p-change"),
    ];
    const selected = selectAdaptive(attempts);
    expect(selected[0]).toBe("a-perfect");
    expect(selected.length).toBeLessThanOrEqual(MAX_EXTRA_QUESTIONS);
    expect(new Set(selected).size).toBe(selected.length);
    expect(selectAdaptive([...attempts, wrong("a-perfect")])).not.toContain(
      "a-perfect",
    );
    expect(selectAdaptive([])).toEqual([]);
  });
  it("keeps a first attempt once and marks hint-assisted answers separately", () => {
    let s = reducer(initialSession(), { type: "START" });
    s = reducer(s, { type: "HINT" });
    s = reducer(s, {
      type: "ANSWER",
      value: questionById[s.queue[0]].answers[0],
    });
    s = reducer(s, { type: "SUBMIT" });
    const twice = reducer(s, { type: "SUBMIT" });
    expect(twice.attempts).toHaveLength(1);
    expect(twice.attempts[0].assisted).toBe(true);
    expect(reducer(s, { type: "ANSWER", value: "different" }).draft).toBe(
      s.draft,
    );
    expect(getPracticeStats([{ ...s.attempts[0], phase: "practice" }])).toEqual(
      { total: 1, unaided: 0, assisted: 1 },
    );
  });
  it("does not let earlier correct answers cancel a new mistake", () => {
    const correct = (questionId: string): Attempt => ({
      ...wrong(questionId),
      correct: true,
    });
    expect(
      selectAdaptive([
        correct("d-conditional"),
        correct("p-dialogue"),
        wrong("p-polite"),
      ]),
    ).toContain("a-conditional");
  });
});

describe("lesson lifecycle and saved state", () => {
  it("completes the all-correct flow without unnecessary extra questions", () => {
    let s = reducer(initialSession(), { type: "START" });
    for (let i = 0; i < werdenLesson.diagnosticIds.length; i++)
      s = answerAndNext(s, questionById[s.queue[s.index]].answers[0]);
    expect(s.stage).toBe("explanation");
    s = reducer(s, { type: "EXPLAIN_NEXT" });
    for (let i = 0; i < werdenLesson.practiceIds.length; i++)
      s = answerAndNext(s, questionById[s.queue[s.index]].answers[0]);
    expect(s.stage).toBe("speaking");
    s = reducer(s, { type: "SPEAK_FINISH" });
    s = reducer(s, { type: "FINISH", at: "2026-10-03T18:00:00.000Z" });
    expect(s.stage).toBe("complete");
    expect(s.history?.weakConcepts).toEqual([]);
    expect(Date.parse(s.history!.reviewDueAt)).toBeGreaterThan(
      Date.parse(s.history!.completedAt),
    );
    expect(getPracticeStats(s.attempts)).toEqual({
      total: 6,
      unaided: 6,
      assisted: 0,
    });
  });
  it("adds at most two extra questions and finishes even if every answer is wrong", () => {
    let s = reducer(initialSession(), { type: "START" });
    for (let i = 0; i < werdenLesson.diagnosticIds.length; i++)
      s = answerAndNext(s, "wrong");
    s = reducer(s, { type: "EXPLAIN_NEXT" });
    let count = 0;
    while (s.stage === "practice" && count < 30) {
      s = answerAndNext(s, "wrong");
      count++;
    }
    expect(count).toBe(werdenLesson.practiceIds.length + MAX_EXTRA_QUESTIONS);
    expect(s.stage).toBe("speaking");
  });
  it("resumes a draft or submitted feedback exactly and recovers from corrupt saves", () => {
    let s = reducer(initialSession(), { type: "START" });
    s = reducer(s, { type: "ANSWER", value: "draft" });
    expect(restoreSession(JSON.stringify(s))).toEqual(s);
    s = reducer(s, { type: "SUBMIT" });
    expect(restoreSession(JSON.stringify(s))).toEqual(s);
    for (const raw of [
      "broken",
      "{}",
      JSON.stringify({ ...s, queue: ["missing"] }),
      JSON.stringify({ ...s, index: 999 }),
    ]) {
      expect(restoreSession(raw)).toEqual(initialSession());
    }
  });
  it("uses fresh revisit questions, gives extra attention to weak concepts, and keeps a mix", () => {
    const h = {
      completedAt: "2026-10-03T18:00:00Z",
      reviewDueAt: "2026-10-04T18:00:00Z",
      weakConcepts: ["perfect-passive"] as const,
      seenQuestionIds: ["r-perfect-1"],
    };
    const selected = selectRevisit({ ...h, weakConcepts: [...h.weakConcepts] });
    expect(selected).toHaveLength(5);
    expect(selected[0]).toBe("r-perfect-2");
    expect(selected).not.toContain("r-perfect-1");
    expect(
      new Set(selected.map((id) => questionById[id].concepts[0])).size,
    ).toBeGreaterThan(1);
  });
  it("covers recorded weak distinctions and preserves any weakness not tested in a revisit", () => {
    const history = {
      completedAt: "2026-10-03T18:00:00Z",
      reviewDueAt: "2026-10-04T18:00:00Z",
      weakConcepts: ["passive", "conditional", "perfect-passive"] as const,
      seenQuestionIds: [],
    };
    const selected = selectRevisit({
      ...history,
      weakConcepts: [...history.weakConcepts],
    });
    for (const concept of history.weakConcepts) {
      expect(
        selected.some((id) => questionById[id].concepts.includes(concept)),
      ).toBe(true);
    }
    const s: Session = {
      ...initialSession(),
      stage: "review",
      mode: "revisit",
      attempts: [{ ...wrong("r-future-1"), correct: true }],
      history: { ...history, weakConcepts: [...history.weakConcepts] },
    };
    expect(
      reducer(s, { type: "FINISH", at: "2026-10-04T18:00:00Z" }).history
        ?.weakConcepts,
    ).toContain("perfect-passive");
  });
});

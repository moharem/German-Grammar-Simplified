import { expect, it } from "vitest";
import { werdenLesson } from "./werden";
import {
  instructionFor,
  optionGlosses,
  optionMeanings,
  patterns,
} from "./visual";

it("provides English meanings for every sentence or meaning choice in the trial and revisit pools", () => {
  for (const question of werdenLesson.questions) {
    for (const option of question.options ?? []) {
      if (option.includes(" ")) {
        expect(
          optionMeanings[option] || optionGlosses[option],
          `${question.id}: ${option}`,
        ).toBeTruthy();
      }
    }
  }
});
it("keeps beginner instructions free of unexplained grammar names and preserves all five grammar distinctions on three cards", () => {
  const ids = [
    ...werdenLesson.diagnosticIds,
    ...werdenLesson.practiceIds,
    ...werdenLesson.adaptiveIds,
  ];
  for (const q of werdenLesson.questions.filter((q) => ids.includes(q.id))) {
    expect(instructionFor(q).en).not.toMatch(
      /Konjunktiv|Futur I|Präteritum|Partizip/,
    );
  }
  expect(Object.keys(patterns)).toHaveLength(3);
  expect(
    Object.values(patterns)
      .flat()
      .map((p) => p.id),
  ).toEqual(["future", "change", "passive", "conditional", "perfect-passive"]);
});

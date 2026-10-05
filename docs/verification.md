# Trial verification

Revised trial verified on 5 October 2026 in a dedicated Chrome session.

## Automated checks

Production TypeScript compilation and Vite build; twelve tests covering grammar-sensitive answer checking, ASCII umlauts, content integrity, first-attempt scoring, bounded adaptation, full correct and incorrect paths, saved-state recovery, targeted revisits, bilingual choice meanings and concise beginner instructions.

## Browser checks

- Choose English; verify the actual English interface, sentence meanings, instructions and feedback.
- Complete three diagnostic questions with mixed answers, explore the three visual cards and switch among werden's three meanings.
- Hide a card's sentence and formula, then reveal them. Bookmark a card and retain it through lesson completion and revisiting.
- Switch English/German on the cards and during an exercise. German feedback displays correctly; attempts and typed answers remain unchanged.
- Complete six core exercises and two adaptive examples. Verify concise feedback on `wurde / würde` and keep vocabulary support separate from grammar assistance.
- Pause and reload a typed draft; reload submitted feedback and continue. Verify number keys and Enter.
- Show the optional speaking model and self-check, then review all four missed or assisted questions one at a time. Retry a question without changing first attempts or scores.
- Complete a five-question revisit with all responses correct; verify its result contains only that revisit's attempts.
- Check completion and exercise layouts across 360, 390, 768 and 1440 pixels, with no horizontal overflow in the checked views. Inspect desktop home/cards and mobile cards, feedback and completion screenshots.
- No browser console errors or warnings were recorded in the tested flows; informational React development messages were present.

## Limits

This verifies the checked interactions and layouts. It does not establish durable mastery, conversational fluency, a CEFR level or accessibility certification. Browser audio depends on available voices. Progress is local to each browser and device.

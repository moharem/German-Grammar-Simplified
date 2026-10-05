import type { Explanation, Lesson, LocalizedText, Question } from "./types";

const t = (de: string, en: string): LocalizedText => ({ de, en });

export const explanations: Explanation[] = [
  {
    id: "change",
    concept: "change",
    form: "werden",
    label: "VERÄNDERUNG",
    color: "sage",
    title: "Etwas verändert sich.",
    body: t(
      "werden kann „sich verändern“ bedeuten. Danach steht oft ein Adjektiv oder ein Nomen.",
      "werden can mean “become” or “get”. It is often followed by an adjective or a noun.",
    ),
    formula: "werden + Adjektiv / Nomen",
    example: "Es wird langsam kalt.",
    translation: t("Es wird langsam kalt.", "It is slowly getting cold."),
    note: t(
      "Im Perfekt: Es ist kalt geworden. Beim Verb für eine Veränderung heißt es geworden — mit ge-.",
      "In the perfect: Es ist kalt geworden. For “become”, use geworden — with ge-.",
    ),
    conjugation:
      "ich werde · du wirst · er/sie/es wird · wir werden · ihr werdet · sie/Sie werden",
  },
  {
    id: "future",
    concept: "future",
    form: "werden",
    label: "ZUKUNFT",
    color: "blue",
    title: "Ein Blick nach vorn.",
    body: t(
      "Mit werden und einem Infinitiv bildest du Futur I. Der Infinitiv steht am Ende.",
      "werden plus an infinitive forms Futur I. The infinitive goes at the end.",
    ),
    formula: "werden + Infinitiv",
    example: "Ich werde dich morgen anrufen.",
    translation: t(
      "Ich werde dich morgen anrufen.",
      "I will call you tomorrow.",
    ),
    note: t(
      "Im Alltag geht auch Präsens: „Ich rufe dich morgen an.“ Futur I kann außerdem eine Vermutung ausdrücken: „Er wird jetzt zu Hause sein.“",
      "Everyday German also uses the present: “Ich rufe dich morgen an.” Futur I can also express a guess: “Er wird jetzt zu Hause sein” — he is probably at home now.",
    ),
  },
  {
    id: "passive",
    concept: "passive",
    form: "werden",
    label: "PASSIV",
    color: "peach",
    title: "Was passiert, steht im Mittelpunkt.",
    body: t(
      "Mit werden und einem Partizip II bildest du das Vorgangspassiv. Wichtig ist die Handlung; wer sie ausführt, muss nicht genannt werden.",
      "werden plus a past participle forms the process passive. The action matters; you do not have to say who performs it.",
    ),
    formula: "werden + Partizip II",
    example: "Das Fahrrad wird repariert.",
    translation: t(
      "Das Fahrrad wird repariert.",
      "The bicycle is being repaired.",
    ),
    note: t(
      "Vergleiche: „Ich werde das Fahrrad reparieren“ ist Zukunft. „Das Fahrrad wird repariert“ ist Passiv. Im Präteritum: „Das Fahrrad wurde repariert.“",
      "Compare: “Ich werde das Fahrrad reparieren” is future. “Das Fahrrad wird repariert” is passive. In the past: “Das Fahrrad wurde repariert.”",
    ),
  },
  {
    id: "conditional",
    concept: "conditional",
    form: "würden",
    label: "MÖGLICHKEIT",
    color: "lavender",
    title: "Was wäre, wenn …?",
    body: t(
      "würde + Infinitiv ist eine Form des Konjunktivs II. Damit sprichst du über Möglichkeiten oder formulierst eine höfliche Bitte.",
      "würde plus an infinitive is a Konjunktiv II construction, like “would”. Use it for hypothetical situations or polite requests.",
    ),
    formula: "würde / würden + Infinitiv",
    example: "Mit mehr Zeit würde ich öfter kochen.",
    translation: t(
      "Mit mehr Zeit würde ich öfter kochen.",
      "With more time, I would cook more often.",
    ),
    note: t(
      "„Würden Sie bitte langsamer sprechen?“ ist eine höfliche Bitte. Achtung: wurde = Vergangenheit; würde = Konjunktiv II. Der Umlaut verändert die Bedeutung.",
      "“Würden Sie bitte langsamer sprechen?” is a polite request. Watch out: wurde = past; würde = Konjunktiv II. The umlaut changes the meaning.",
    ),
    conjugation:
      "ich würde · du würdest · er/sie/es würde · wir würden · ihr würdet · sie/Sie würden",
  },
  {
    id: "perfect-passive",
    concept: "perfect-passive",
    form: "worden",
    label: "PASSIV · PERFEKT",
    color: "sage",
    title: "Etwas ist schon passiert.",
    body: t(
      "Im Perfekt des Vorgangspassivs verwendest du sein, das Partizip II des Hauptverbs und worden.",
      "The perfect process passive uses sein, the main verb’s past participle, and worden.",
    ),
    formula: "sein + Partizip II + worden",
    example: "Das Paket ist geliefert worden.",
    translation: t(
      "Das Paket ist geliefert worden.",
      "The parcel has been delivered.",
    ),
    note: t(
      "Passiv: „Das Paket ist geliefert worden.“ Veränderung: „Ich bin ruhiger geworden.“ worden ohne ge- gehört zum Passiv; geworden mit ge- bedeutet hier „sich verändert“.",
      "Passive: “Das Paket ist geliefert worden.” Change: “Ich bin ruhiger geworden.” worden without ge- belongs to the passive; geworden with ge- means “become” here.",
    ),
  },
];

const questions: Question[] = [
  {
    id: "d-passive",
    kind: "choice",
    concepts: ["passive", "future"],
    instruction: t(
      "Was bedeutet dieser Satz?",
      "What does this sentence mean?",
    ),
    sentence: "Die Tür wird geöffnet.",
    translation: t("Die Tür wird geöffnet.", "The door is being opened."),
    options: [
      "Jemand öffnet die Tür.",
      "Jemand wird die Tür morgen öffnen.",
      "Die Tür bleibt geschlossen.",
    ],
    answers: ["Jemand öffnet die Tür."],
    solution: "Die Tür wird geöffnet. → Jemand öffnet die Tür.",
    feedback: t(
      "wird + geöffnet (Partizip II) ist Passiv. Für Futur I brauchst du einen Infinitiv: „Jemand wird die Tür öffnen.“",
      "wird + geöffnet (past participle) is passive. Futur I needs an infinitive: “Jemand wird die Tür öffnen.”",
    ),
    hint: t(
      "Sieh auf das letzte Wort: Infinitiv oder Partizip II?",
      "Look at the last word: infinitive or past participle?",
    ),
  },
  {
    id: "d-conditional",
    kind: "choice",
    concepts: ["conditional"],
    instruction: t(
      "Ergänze die höfliche Bitte im Konjunktiv II.",
      "Complete the polite request using Konjunktiv II.",
    ),
    sentence: "___ Sie bitte langsamer sprechen?",
    translation: t(
      "Würden Sie bitte langsamer sprechen?",
      "Would you please speak more slowly?",
    ),
    options: ["Werden", "Würden", "Worden"],
    answers: ["Würden"],
    solution: "Würden Sie bitte langsamer sprechen?",
    feedback: t(
      "Würden Sie + Infinitiv ist eine höfliche Bitte im Konjunktiv II. worden kann nicht als gebeugtes Verb am Satzanfang stehen.",
      "Würden Sie + infinitive is a polite Konjunktiv II request. worden cannot be the conjugated verb at the start of the sentence.",
    ),
    hint: t(
      "Die gesuchte Form entspricht hier „would“.",
      "The form you need means “would” here.",
    ),
  },
  {
    id: "d-perfect",
    kind: "choice",
    concepts: ["perfect-passive"],
    instruction: t(
      "Die Handlung ist abgeschlossen. Ergänze das Passiv im Perfekt.",
      "The action is complete. Fill in the perfect passive.",
    ),
    sentence: "Die E-Mail ist schon verschickt ___.",
    translation: t(
      "Die E-Mail ist schon verschickt worden.",
      "The email has already been sent.",
    ),
    options: ["geworden", "würden", "worden"],
    answers: ["worden"],
    solution: "Die E-Mail ist schon verschickt worden.",
    feedback: t(
      "Perfekt im Passiv: ist + verschickt + worden. geworden passt zu einer Veränderung, zum Beispiel „Ich bin müde geworden“.",
      "Perfect passive: ist + verschickt + worden. geworden describes a change, for example “Ich bin müde geworden”.",
    ),
    hint: t(
      "Im Passiv verliert das Partizip von werden sein ge-.",
      "In the passive, the participle of werden loses its ge-.",
    ),
  },
  {
    id: "d-change",
    kind: "choice",
    concepts: ["change", "perfect-passive"],
    instruction: t(
      "Es geht um eine Veränderung. Welche Form passt?",
      "This describes a change. Which form fits?",
    ),
    sentence: "Ich bin in letzter Zeit ruhiger ___.",
    translation: t(
      "Ich bin in letzter Zeit ruhiger geworden.",
      "I have become calmer lately.",
    ),
    options: ["worden", "geworden", "werden"],
    answers: ["geworden"],
    solution: "Ich bin in letzter Zeit ruhiger geworden.",
    feedback: t(
      "ruhiger beschreibt eine Veränderung. Das Perfekt von „werden“ als „sich verändern“ lautet „ist geworden“. Es gibt hier kein Passiv.",
      "ruhiger describes a change. The perfect of werden meaning “become” is “ist geworden”. There is no passive here.",
    ),
    hint: t(
      "Wird eine Handlung an jemandem ausgeführt — oder verändert sich jemand?",
      "Is an action being performed on someone, or is someone changing?",
    ),
  },
  {
    id: "p-future",
    kind: "gap",
    concepts: ["future"],
    instruction: t(
      "Setze werden in der passenden Form ein. Verwende Futur I.",
      "Fill in the appropriate form of werden. Use Futur I.",
    ),
    sentence: "Ich ___ morgen meine Freundin anrufen.",
    translation: t(
      "Ich werde morgen meine Freundin anrufen.",
      "I will call my friend tomorrow.",
    ),
    answers: ["werde"],
    solution: "Ich werde morgen meine Freundin anrufen.",
    feedback: t(
      "Bei ich heißt die Form werde. werde + anrufen bildet Futur I; anrufen bleibt im Infinitiv am Ende.",
      "The ich form is werde. werde + anrufen forms Futur I; anrufen stays in the infinitive at the end.",
    ),
    hint: t(
      "ich werde, du wirst, er/sie/es wird …",
      "ich werde, du wirst, er/sie/es wird …",
    ),
  },
  {
    id: "p-change",
    kind: "choice",
    concepts: ["change"],
    instruction: t(
      "Welche Bedeutung hat werden hier?",
      "What does werden mean here?",
    ),
    sentence: "Im Herbst werden die Tage kürzer.",
    translation: t(
      "Im Herbst werden die Tage kürzer.",
      "In autumn, the days get shorter.",
    ),
    options: [
      "Eine Veränderung",
      "Eine höfliche Bitte",
      "Eine Handlung im Passiv",
    ],
    answers: ["Eine Veränderung"],
    solution: "Im Herbst werden die Tage kürzer. → Eine Veränderung.",
    feedback: t(
      "kürzer ist ein Adjektiv: Die Tage verändern sich. Es gibt weder einen Infinitiv für Futur I noch ein Partizip II für Passiv.",
      "kürzer is an adjective: the days change. There is no infinitive for Futur I or past participle for passive.",
    ),
    hint: t(
      "Was für ein Wort steht nach werden?",
      "What kind of word follows werden?",
    ),
  },
  {
    id: "p-passive",
    kind: "repair",
    concepts: ["passive"],
    instruction: t(
      "Repariere das Passiv im Präsens. Ersetze nur „reparieren“.",
      "Fix the present passive. Replace only “reparieren”.",
    ),
    sentence: "Das Fahrrad wird reparieren.",
    translation: t(
      "Das Fahrrad wird repariert.",
      "The bicycle is being repaired.",
    ),
    answers: ["repariert"],
    solution: "Das Fahrrad wird repariert.",
    feedback: t(
      "Das Fahrrad ist nicht die Person, die repariert. Für Passiv brauchst du wird + Partizip II: repariert.",
      "The bicycle is not the person doing the repair. Passive needs wird + past participle: repariert.",
    ),
    hint: t(
      "Das Partizip II von reparieren endet auf -t.",
      "The past participle of reparieren ends in -t.",
    ),
  },
  {
    id: "p-dialogue",
    kind: "dialogue",
    concepts: ["conditional"],
    instruction: t(
      "Antworte auf die hypothetische Frage im Konjunktiv II.",
      "Answer the hypothetical question using Konjunktiv II.",
    ),
    sentence: "Was würdest du mit einem freien Tag machen?",
    dialogue: [
      {
        speaker: "Mia",
        text: "Stell dir vor, du hättest morgen frei. Was würdest du machen?",
      },
      { speaker: "Du", text: "___" },
    ],
    translation: t(
      "Was würdest du mit einem freien Tag machen?",
      "What would you do with a day off?",
    ),
    options: [
      "Ich wurde einen Ausflug machen.",
      "Ich würde einen Ausflug machen.",
      "Ich bin einen Ausflug worden.",
    ],
    answers: ["Ich würde einen Ausflug machen."],
    solution: "Ich würde einen Ausflug machen.",
    feedback: t(
      "würde + machen beschreibt eine vorgestellte Möglichkeit. wurde ohne Umlaut ist Vergangenheit und bildet mit machen hier keinen richtigen Satz.",
      "würde + machen describes an imagined possibility. wurde without the umlaut is past and does not form a correct sentence with machen here.",
    ),
    hint: t(
      "Eine Möglichkeit braucht hier würde + Infinitiv.",
      "A hypothetical possibility uses würde + infinitive here.",
    ),
  },
  {
    id: "p-polite",
    kind: "gap",
    concepts: ["conditional"],
    instruction: t(
      "Formuliere den Wunsch im Konjunktiv II.",
      "Express the wish using Konjunktiv II.",
    ),
    sentence: "Ich ___ gern einen Tee bestellen.",
    translation: t(
      "Ich würde gern einen Tee bestellen.",
      "I would like to order a tea.",
    ),
    answers: ["würde"],
    solution: "Ich würde gern einen Tee bestellen.",
    feedback: t(
      "Bei ich heißt es würde, nicht würden. würde gern + Infinitiv formuliert einen höflichen Wunsch.",
      "With ich, use würde, not würden. würde gern + infinitive expresses a polite wish.",
    ),
    distractorFeedback: {
      wurde: t(
        "wurde ohne Umlaut ist die Vergangenheitsform von werden. Für diesen höflichen Wunsch im Konjunktiv II brauchst du würde mit Umlaut: „Ich würde gern einen Tee bestellen.“",
        "wurde without the umlaut is the past form of werden. This polite Konjunktiv II wish needs würde with the umlaut: “Ich würde gern einen Tee bestellen.”",
      ),
      würden: t(
        "würden gehört zu wir, sie oder Sie. Das Subjekt ist hier ich, also lautet die Form würde.",
        "würden belongs with wir, sie or formal Sie. The subject here is ich, so use würde.",
      ),
      werde: t(
        "werde + bestellen wäre Futur I: „Ich werde einen Tee bestellen.“ Für den höflichen Wunsch im Konjunktiv II brauchst du würde.",
        "werde + bestellen would be Futur I: “I will order a tea.” The polite Konjunktiv II wish needs würde.",
      ),
    },
    hint: t(
      "ich würde — wir würden. Achte auf die Person.",
      "ich würde — wir würden. Check the subject.",
    ),
  },
  {
    id: "p-perfect",
    kind: "gap",
    concepts: ["perfect-passive"],
    instruction: t(
      "Ergänze das Passiv im Perfekt mit worden oder geworden.",
      "Complete the perfect passive with worden or geworden.",
    ),
    sentence: "Die Rechnung ist bereits bezahlt ___.",
    translation: t(
      "Die Rechnung ist bereits bezahlt worden.",
      "The bill has already been paid.",
    ),
    answers: ["worden"],
    solution: "Die Rechnung ist bereits bezahlt worden.",
    feedback: t(
      "Jemand hat die Rechnung bezahlt. Im Perfekt des Passivs steht ist + bezahlt + worden, ohne ge-.",
      "Someone paid the bill. Perfect passive uses ist + bezahlt + worden, without ge-.",
    ),
    distractorFeedback: {
      geworden: t(
        "geworden beschreibt eine Veränderung, zum Beispiel „Ich bin müde geworden“. Hier wurde die Rechnung bezahlt: ist + bezahlt + worden. Im Passiv fällt ge- weg.",
        "geworden describes a change, for example “I have become tired.” Here the bill was paid: ist + bezahlt + worden. In the passive, ge- is omitted.",
      ),
    },
    hint: t(
      "bezahlt ist bereits das Partizip II des Hauptverbs.",
      "bezahlt is already the main verb’s past participle.",
    ),
  },
  {
    id: "p-geworden",
    kind: "choice",
    concepts: ["change", "perfect-passive"],
    instruction: t(
      "Wähle die richtige Form für die Veränderung.",
      "Choose the correct form for the change.",
    ),
    sentence: "Nach dem langen Spaziergang bin ich müde ___.",
    translation: t(
      "Nach dem langen Spaziergang bin ich müde geworden.",
      "After the long walk, I got tired.",
    ),
    options: ["worden", "geworden", "würden"],
    answers: ["geworden"],
    solution: "Nach dem langen Spaziergang bin ich müde geworden.",
    feedback: t(
      "Du beschreibst, wie sich dein Zustand verändert hat: bin + müde + geworden. worden wäre Teil einer Passivform mit einem weiteren Partizip II.",
      "You describe how your state changed: bin + müde + geworden. worden would be part of a passive construction with another past participle.",
    ),
    hint: t(
      "müde ist ein Zustand, kein Partizip II.",
      "müde is a state, not a past participle.",
    ),
  },
  {
    id: "p-past",
    kind: "gap",
    concepts: ["conditional", "passive"],
    instruction: t(
      "Das ist wirklich passiert. Ergänze das Passiv im Präteritum.",
      "This actually happened. Complete the past passive (Präteritum).",
    ),
    sentence: "Gestern ___ die Straße gesperrt.",
    translation: t(
      "Gestern wurde die Straße gesperrt.",
      "Yesterday the road was closed.",
    ),
    answers: ["wurde"],
    solution: "Gestern wurde die Straße gesperrt.",
    feedback: t(
      "Eine tatsächliche Handlung in der Vergangenheit: wurde + gesperrt. würde mit Umlaut wäre Konjunktiv II und hat eine andere Bedeutung.",
      "An actual action in the past: wurde + gesperrt. würde with the umlaut would be Konjunktiv II and has a different meaning.",
    ),
    hint: t(
      "Gesucht ist die Vergangenheitsform von wird — ohne Umlaut.",
      "You need the past form of wird — without an umlaut.",
    ),
  },
  {
    id: "a-future",
    kind: "choice",
    concepts: ["future"],
    instruction: t(
      "Welcher Satz steht im Futur I?",
      "Which sentence uses Futur I?",
    ),
    sentence: "Ein Plan für morgen.",
    translation: t("Ein Plan für morgen.", "A plan for tomorrow."),
    options: [
      "Wir werden morgen gemeinsam kochen.",
      "Das Essen wird gekocht.",
      "Das Essen ist kalt geworden.",
    ],
    answers: ["Wir werden morgen gemeinsam kochen."],
    solution: "Wir werden morgen gemeinsam kochen.",
    feedback: t(
      "werden + kochen (Infinitiv) ist Futur I. wird + gekocht ist Passiv; ist + kalt + geworden beschreibt eine Veränderung.",
      "werden + kochen (infinitive) is Futur I. wird + gekocht is passive; ist + kalt + geworden describes a change.",
    ),
    hint: t(
      "Für Futur I brauchst du den Infinitiv am Ende.",
      "For Futur I, look for the infinitive at the end.",
    ),
  },
  {
    id: "a-change",
    kind: "gap",
    concepts: ["change"],
    instruction: t(
      "Ergänze das Perfekt von werden für eine Veränderung.",
      "Complete the perfect of werden for a change.",
    ),
    sentence: "Meine Nachbarin ist Ärztin ___.",
    translation: t(
      "Meine Nachbarin ist Ärztin geworden.",
      "My neighbour has become a doctor.",
    ),
    answers: ["geworden"],
    solution: "Meine Nachbarin ist Ärztin geworden.",
    feedback: t(
      "Ärztin ist ein Nomen, kein Partizip II. Sie hat einen neuen Beruf: ist + Ärztin + geworden.",
      "Ärztin is a noun, not a past participle. She has a new profession: ist + Ärztin + geworden.",
    ),
    hint: t(
      "Bei „become“ bleibt das ge- erhalten.",
      "For “become”, keep the ge-.",
    ),
  },
  {
    id: "a-passive",
    kind: "gap",
    concepts: ["passive"],
    instruction: t(
      "Ergänze werden im Präsens. Achte auf den Plural.",
      "Fill in werden in the present. Watch the plural.",
    ),
    sentence: "Die Fenster ___ jeden Freitag geputzt.",
    translation: t(
      "Die Fenster werden jeden Freitag geputzt.",
      "The windows are cleaned every Friday.",
    ),
    answers: ["werden"],
    solution: "Die Fenster werden jeden Freitag geputzt.",
    feedback: t(
      "Die Fenster ist Plural, deshalb werden. werden + geputzt bildet das Passiv im Präsens.",
      "Die Fenster is plural, so use werden. werden + geputzt forms the present passive.",
    ),
    hint: t(
      "Ein Fenster wird geputzt. Zwei Fenster …",
      "One window wird geputzt. Two windows …",
    ),
  },
  {
    id: "a-conditional",
    kind: "gap",
    concepts: ["conditional"],
    instruction: t(
      "Ergänze den Konjunktiv II. Achte auf wir.",
      "Complete Konjunktiv II. Check the subject wir.",
    ),
    sentence: "Wenn wir mehr Platz hätten, ___ wir einen Hund halten.",
    translation: t(
      "Wenn wir mehr Platz hätten, würden wir einen Hund halten.",
      "If we had more space, we would keep a dog.",
    ),
    answers: ["würden"],
    solution: "Wenn wir mehr Platz hätten, würden wir einen Hund halten.",
    feedback: t(
      "Die Situation ist nur vorgestellt. Bei wir lautet die Form würden; halten bleibt im Infinitiv.",
      "The situation is imagined. With wir, use würden; halten stays in the infinitive.",
    ),
    hint: t("ich würde, wir würden …", "ich würde, wir würden …"),
  },
  {
    id: "a-perfect",
    kind: "repair",
    concepts: ["perfect-passive"],
    instruction: t(
      "Repariere das Passiv im Perfekt. Ersetze nur geworden.",
      "Fix the perfect passive. Replace only geworden.",
    ),
    sentence: "Der Termin ist abgesagt geworden.",
    translation: t(
      "Der Termin ist abgesagt worden.",
      "The appointment has been cancelled.",
    ),
    answers: ["worden"],
    solution: "Der Termin ist abgesagt worden.",
    feedback: t(
      "abgesagt ist das Partizip II. Im Passiv folgt worden ohne ge-: ist + abgesagt + worden.",
      "abgesagt is the past participle. In passive, it is followed by worden without ge-: ist + abgesagt + worden.",
    ),
    hint: t(
      "Hier wurde eine Handlung ausgeführt: jemand hat abgesagt.",
      "An action was performed here: someone cancelled it.",
    ),
  },
  {
    id: "r-future-1",
    kind: "gap",
    concepts: ["future"],
    instruction: t(
      "Setze werden im Futur I ein. Achte auf du.",
      "Fill in werden for Futur I. Check du.",
    ),
    sentence: "Du ___ die Antwort bald verstehen.",
    translation: t(
      "Du wirst die Antwort bald verstehen.",
      "You will soon understand the answer.",
    ),
    answers: ["wirst"],
    solution: "Du wirst die Antwort bald verstehen.",
    feedback: t(
      "Bei du heißt es wirst. wirst + verstehen bildet Futur I.",
      "With du, use wirst. wirst + verstehen forms Futur I.",
    ),
    hint: t("ich werde, du wirst, sie wird.", "ich werde, du wirst, sie wird."),
  },
  {
    id: "r-future-2",
    kind: "choice",
    concepts: ["future", "passive"],
    instruction: t(
      "Welcher Satz bedeutet: Ich plane, den Tisch zu reservieren?",
      "Which sentence means: I plan to book the table?",
    ),
    sentence: "Eine Reservierung für morgen.",
    translation: t("Eine Reservierung für morgen.", "A booking for tomorrow."),
    options: [
      "Ich werde morgen einen Tisch reservieren.",
      "Der Tisch wird reserviert.",
      "Der Tisch ist reserviert worden.",
    ],
    answers: ["Ich werde morgen einen Tisch reservieren."],
    solution: "Ich werde morgen einen Tisch reservieren.",
    feedback: t(
      "werde + reservieren ist Futur I. Die anderen Sätze beschreiben im Passiv die Reservierung, nicht meinen Plan.",
      "werde + reservieren is Futur I. The other sentences describe the booking in the passive, not my plan.",
    ),
    hint: t("Suche werden + Infinitiv.", "Look for werden + infinitive."),
  },
  {
    id: "r-change-1",
    kind: "gap",
    concepts: ["change"],
    instruction: t(
      "Ergänze geworden oder worden.",
      "Fill in geworden or worden.",
    ),
    sentence: "Das Wetter ist besser ___.",
    translation: t(
      "Das Wetter ist besser geworden.",
      "The weather has improved.",
    ),
    answers: ["geworden"],
    solution: "Das Wetter ist besser geworden.",
    feedback: t(
      "besser beschreibt eine Veränderung. Dafür brauchst du geworden mit ge-.",
      "besser describes a change. Use geworden with ge-.",
    ),
    hint: t(
      "Das Wetter verändert sich; es wird keine Handlung daran ausgeführt.",
      "The weather changes; an action is not being performed on it.",
    ),
  },
  {
    id: "r-change-2",
    kind: "choice",
    concepts: ["change"],
    instruction: t(
      "Was beschreibt dieser Satz?",
      "What does this sentence describe?",
    ),
    sentence: "Der Kaffee wird kalt.",
    translation: t("Der Kaffee wird kalt.", "The coffee is getting cold."),
    options: [
      "Eine Veränderung des Zustands",
      "Eine höfliche Bitte",
      "Ein Passiv im Perfekt",
    ],
    answers: ["Eine Veränderung des Zustands"],
    solution: "Der Kaffee wird kalt. → Eine Veränderung des Zustands.",
    feedback: t(
      "kalt ist ein Adjektiv. werden beschreibt hier eine Veränderung, keine Passivhandlung.",
      "kalt is an adjective. Here werden describes a change, not a passive action.",
    ),
    hint: t("Achte auf das Adjektiv kalt.", "Notice the adjective kalt."),
  },
  {
    id: "r-passive-1",
    kind: "gap",
    concepts: ["passive"],
    instruction: t(
      "Ergänze werden für das Passiv im Präsens.",
      "Fill in werden for the present passive.",
    ),
    sentence: "Das Frühstück ___ um acht Uhr serviert.",
    translation: t(
      "Das Frühstück wird um acht Uhr serviert.",
      "Breakfast is served at eight.",
    ),
    answers: ["wird"],
    solution: "Das Frühstück wird um acht Uhr serviert.",
    feedback: t(
      "Das Frühstück ist Singular: wird + serviert. Es wird eine Handlung beschrieben.",
      "Das Frühstück is singular: wird + serviert. This describes an action.",
    ),
    hint: t("Es wird serviert.", "Es wird serviert."),
  },
  {
    id: "r-passive-2",
    kind: "gap",
    concepts: ["passive", "conditional"],
    instruction: t(
      "Das ist wirklich passiert. Verwende Passiv im Präteritum.",
      "This actually happened. Use the past passive (Präteritum).",
    ),
    sentence: "Letzte Woche ___ das Museum renoviert.",
    translation: t(
      "Letzte Woche wurde das Museum renoviert.",
      "Last week the museum was renovated.",
    ),
    answers: ["wurde"],
    solution: "Letzte Woche wurde das Museum renoviert.",
    feedback: t(
      "wurde ohne Umlaut ist die Vergangenheitsform. würde wäre eine hypothetische Form.",
      "wurde without the umlaut is past. würde would be a hypothetical form.",
    ),
    hint: t(
      "Vergangenheit, keine vorgestellte Möglichkeit.",
      "Past, not an imagined possibility.",
    ),
  },
  {
    id: "r-conditional-1",
    kind: "dialogue",
    concepts: ["conditional"],
    instruction: t("Antworte im Konjunktiv II.", "Reply using Konjunktiv II."),
    sentence: "Was würdest du mit hundert Euro machen?",
    dialogue: [
      {
        speaker: "Alex",
        text: "Stell dir vor, du gewinnst hundert Euro. Was würdest du machen?",
      },
      { speaker: "Du", text: "___" },
    ],
    translation: t(
      "Was würdest du mit hundert Euro machen?",
      "What would you do with a hundred euros?",
    ),
    options: [
      "Ich würde ein Buch kaufen.",
      "Ich wurde ein Buch kaufen.",
      "Ich bin ein Buch worden.",
    ],
    answers: ["Ich würde ein Buch kaufen."],
    solution: "Ich würde ein Buch kaufen.",
    feedback: t(
      "würde + kaufen beschreibt eine vorgestellte Möglichkeit. Der Umlaut ist nötig.",
      "würde + kaufen describes an imagined possibility. The umlaut is necessary.",
    ),
    hint: t(
      "Auf eine „würdest du“-Frage antwortest du mit „ich würde“.",
      "Reply to a “würdest du” question with “ich würde”.",
    ),
  },
  {
    id: "r-conditional-2",
    kind: "gap",
    concepts: ["conditional"],
    instruction: t(
      "Ergänze die höfliche Bitte im Konjunktiv II.",
      "Complete the polite Konjunktiv II request.",
    ),
    sentence: "___ Sie mir bitte den Weg zeigen?",
    translation: t(
      "Würden Sie mir bitte den Weg zeigen?",
      "Would you please show me the way?",
    ),
    answers: ["Würden"],
    solution: "Würden Sie mir bitte den Weg zeigen?",
    feedback: t(
      "Bei der höflichen Anrede Sie lautet die Form Würden. zeigen steht im Infinitiv.",
      "With the formal Sie, use Würden. zeigen stays in the infinitive.",
    ),
    hint: t(
      "Die höfliche Anrede Sie hat dieselbe Form wie sie im Plural.",
      "Formal Sie uses the same form as plural sie.",
    ),
  },
  {
    id: "r-perfect-1",
    kind: "gap",
    concepts: ["perfect-passive"],
    instruction: t(
      "Ergänze das Passiv im Perfekt.",
      "Complete the perfect passive.",
    ),
    sentence: "Die Tickets sind online gekauft ___.",
    translation: t(
      "Die Tickets sind online gekauft worden.",
      "The tickets have been bought online.",
    ),
    answers: ["worden"],
    solution: "Die Tickets sind online gekauft worden.",
    feedback: t(
      "Im Plural: sind + gekauft + worden. Im Passiv steht worden ohne ge-.",
      "In the plural: sind + gekauft + worden. The passive uses worden without ge-.",
    ),
    hint: t("sein + Partizip II + worden.", "sein + past participle + worden."),
  },
  {
    id: "r-perfect-2",
    kind: "repair",
    concepts: ["perfect-passive"],
    instruction: t(
      "Korrigiere das Passiv. Ersetze nur geworden.",
      "Correct the passive. Replace only geworden.",
    ),
    sentence: "Der Schlüssel ist gefunden geworden.",
    translation: t(
      "Der Schlüssel ist gefunden worden.",
      "The key has been found.",
    ),
    answers: ["worden"],
    solution: "Der Schlüssel ist gefunden worden.",
    feedback: t(
      "finden wird zu gefunden. Danach steht im Perfekt des Passivs worden, nicht geworden.",
      "finden becomes gefunden. It is followed by worden, not geworden, in the perfect passive.",
    ),
    hint: t(
      "gefunden ist ein Partizip II; die Konstruktion ist Passiv.",
      "gefunden is a past participle; the construction is passive.",
    ),
  },
];

export const werdenLesson: Lesson = {
  id: "werden-wuerden-worden",
  version: 1,
  title: "werden, würden & worden",
  explanations,
  questions,
  diagnosticIds: ["d-passive", "d-conditional", "d-perfect"],
  practiceIds: [
    "p-future",
    "p-passive",
    "p-dialogue",
    "p-polite",
    "p-perfect",
    "p-geworden",
  ],
  adaptiveIds: [
    "a-future",
    "a-change",
    "a-passive",
    "a-conditional",
    "a-perfect",
  ],
  revisitIds: [
    "r-future-1",
    "r-future-2",
    "r-change-1",
    "r-change-2",
    "r-passive-1",
    "r-passive-2",
    "r-conditional-1",
    "r-conditional-2",
    "r-perfect-1",
    "r-perfect-2",
  ],
};

export const lessons: Lesson[] = [werdenLesson];
export const questionById = Object.fromEntries(
  questions.map((q) => [q.id, q]),
) as Record<string, Question>;

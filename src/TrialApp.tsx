import { useEffect, useReducer, useRef, useState } from "react";
import type { Dispatch } from "react";
import { Brand, Icon } from "./components/Icon";
import {
  LearningLanguageContext,
  useLearningLanguage,
} from "./components/LearningLanguage";
import {
  MemoryBoard,
  MemoryPicture,
  MemoryTiles,
} from "./components/MemoryBoard";
import { werdenLesson as lesson, questionById } from "./content/werden";
import {
  formFor,
  instructionFor,
  languageMeta,
  optionGlosses,
  optionMeanings,
  shortFeedback,
  type LearningLanguage,
  type MemoryForm,
} from "./content/visual";
import type { Question } from "./content/types";
import {
  feedbackFor,
  getMissed,
  getPracticeStats,
  initialSession,
  isCorrect,
  progressPercent,
  reducer,
  restoreSession,
  STORAGE_KEY,
  type Action,
  type Session,
} from "./learning/engine";

const LANGUAGE_KEY = "wortwaerts:language";
function loadSession() {
  try {
    return restoreSession(localStorage.getItem(STORAGE_KEY));
  } catch {
    return initialSession();
  }
}
function loadLanguage(): LearningLanguage | null {
  try {
    const value = localStorage.getItem(LANGUAGE_KEY);
    return value === "de" || value === "en" ? value : null;
  } catch {
    return null;
  }
}
type View = "home" | "lesson" | "cards";
const activeSession = (s: Session) => !["idle", "complete"].includes(s.stage);

export default function App() {
  const [session, dispatch] = useReducer(reducer, undefined, loadSession);
  const [language, setLanguage] = useState<LearningLanguage | null>(
    loadLanguage,
  );
  const [view, setView] = useState<View>(() =>
    activeSession(loadSession()) ? "lesson" : "home",
  );
  const [card, setCard] = useState<MemoryForm>("werden");
  const [storageError, setStorageError] = useState(false);
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      setStorageError(true);
    }
  }, [session]);
  useEffect(() => {
    if (language) {
      document.documentElement.lang = language;
      document.documentElement.dir = languageMeta[language].dir;
      try {
        localStorage.setItem(LANGUAGE_KEY, language);
      } catch {
        setStorageError(true);
      }
    }
  }, [language]);
  useEffect(() => {
    if (
      view !== "lesson" ||
      !["practice", "diagnostic"].includes(session.stage)
    ) {
      title.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [view, session.stage, language]);
  const start = () => {
    if (!activeSession(session)) dispatch({ type: "START" });
    setView("lesson");
  };
  const revisit = () => {
    if (!activeSession(session)) dispatch({ type: "REVISIT" });
    setView("lesson");
  };
  const showCard = (form: MemoryForm) => {
    setCard(form);
    setView("cards");
  };
  if (!language)
    return (
      <LearningLanguageContext.Provider value="en">
        <div className="app">
          <header className="site-header">
            <Brand />
          </header>
          <main className="language-page">
            <span className="eyebrow">A LITTLE GERMAN. A CLEARER PICTURE.</span>
            <h1>
              See the pattern.
              <br />
              <span>Make it stick.</span>
            </h1>
            <div className="welcome-pictures" aria-hidden="true">
              {(["werden", "würden", "worden"] as const).map((form, i) => (
                <div key={form} className={`form-${i}`}>
                  <MemoryPicture form={form} small />
                  <b lang="de">{form}</b>
                </div>
              ))}
            </div>
            <h2>Choose your learning language</h2>
            <p lang="de">Wähle deine Lernsprache.</p>
            <div className="language-options">
              <button onClick={() => setLanguage("en")}>
                <span className="language-symbol">Aa</span>
                <span>
                  <b>English</b>
                  <small>Instructions & meanings in English</small>
                </span>
                <Icon name="arrow" />
              </button>
              <button onClick={() => setLanguage("de")} lang="de">
                <span className="language-symbol">Ää</span>
                <span>
                  <b>Deutsch</b>
                  <small>Anleitung & Erklärungen auf Deutsch</small>
                </span>
                <Icon name="arrow" />
              </button>
            </div>
            <p className="muted small">You can switch at any time.</p>
          </main>
        </div>
      </LearningLanguageContext.Provider>
    );
  return (
    <LearningLanguageContext.Provider value={language}>
      <div className="app">
        <header className="site-header">
          <button
            className="brand-button"
            onClick={() => setView("home")}
            aria-label={language === "en" ? "Home" : "Startseite"}
          >
            <Brand />
          </button>
          <nav
            aria-label={
              language === "en" ? "Main navigation" : "Hauptnavigation"
            }
          >
            <button
              className={view !== "cards" ? "current" : ""}
              onClick={() =>
                setView(activeSession(session) ? "lesson" : "home")
              }
            >
              {language === "en" ? "Lesson" : "Lektion"}
            </button>
            <button
              className={view === "cards" ? "current" : ""}
              onClick={() => setView("cards")}
            >
              {language === "en" ? "Cards" : "Karten"}
            </button>
          </nav>
          <label className="language-select">
            <Icon name="globe" size={17} />
            <span className="sr-only">
              {language === "en" ? "Learning language" : "Lernsprache"}
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LearningLanguage)}
            >
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </label>
        </header>
        {storageError && (
          <p className="storage-notice" role="status">
            {language === "en"
              ? "Browser storage is unavailable. Your progress lasts for this visit."
              : "Speichern ist nicht möglich. Dein Fortschritt bleibt für diesen Besuch erhalten."}
          </p>
        )}
        <main
          className={
            view === "lesson" && session.stage !== "explanation"
              ? "main lesson-main"
              : "main"
          }
        >
          {view === "home" && (
            <Home
              session={session}
              start={start}
              revisit={revisit}
              showCard={showCard}
              titleRef={title}
            />
          )}
          {view === "cards" && (
            <>
              <div className="page-heading">
                <span className="eyebrow">
                  {language === "en"
                    ? "YOUR POCKET RULES"
                    : "DEINE REGELN FÜR UNTERWEGS"}
                </span>
                <h1 ref={title} tabIndex={-1}>
                  {language === "en"
                    ? "Three pictures to remember."
                    : "Drei Bilder zum Merken."}
                </h1>
                <p>
                  {language === "en"
                    ? "Tap a card. Build a sentence."
                    : "Tippe auf eine Karte. Baue einen Satz."}
                </p>
              </div>
              <MemoryBoard
                key={card}
                initial={card}
                bookmarks={session.bookmarks}
                onBookmark={(id) => dispatch({ type: "BOOKMARK", id })}
              />
              <div className="center-actions">
                <button
                  className="primary"
                  onClick={activeSession(session) ? start : revisit}
                >
                  <Icon name={activeSession(session) ? "arrow" : "repeat"} />
                  {language === "en"
                    ? activeSession(session)
                      ? "Continue lesson"
                      : "Quick practice"
                    : activeSession(session)
                      ? "Lektion fortsetzen"
                      : "Kurz üben"}
                </button>
              </div>
            </>
          )}
          {view === "lesson" && (
            <Lesson
              session={session}
              dispatch={dispatch}
              pause={() => setView("home")}
              revisit={revisit}
              showCard={showCard}
              titleRef={title}
            />
          )}
        </main>
        <footer className="site-footer">
          {language === "en"
            ? "Small steps. More German."
            : "Kleine Schritte. Mehr Deutsch."}
          <span>wortwärts</span>
        </footer>
      </div>
    </LearningLanguageContext.Provider>
  );
}
type TitleRef = React.RefObject<HTMLHeadingElement | null>;
function Home({
  session,
  start,
  revisit,
  showCard,
  titleRef,
}: {
  session: Session;
  start: () => void;
  revisit: () => void;
  showCard: (form: MemoryForm) => void;
  titleRef: TitleRef;
}) {
  const { t } = useLearningLanguage();
  return (
    <>
      <section className="home-intro">
        <div>
          <span className="eyebrow">
            {t("EINE KLEINE LEKTION", "ONE SMALL LESSON")}
          </span>
          <h1 ref={titleRef} tabIndex={-1}>
            <span lang="de">werden. würden. worden.</span>
            <br />
            <em>
              {t("Endlich ein klares Bild.", "Finally, a clear picture.")}
            </em>
          </h1>
          <p>
            {t(
              "Drei ähnliche Wörter. Lernen wir sie mit Bildern und kurzen Sätzen.",
              "Three similar words. Learn them with pictures and short sentences.",
            )}
          </p>
          <div className="home-actions">
            <button className="primary" onClick={start}>
              {activeSession(session)
                ? t("Weiterlernen", "Continue where you left off")
                : session.history
                  ? t("Lektion noch einmal", "Try the lesson again")
                  : t("Los geht’s", "Let’s try it")}
              <Icon name="arrow" />
            </button>
            <span className="time-note">
              <Icon name="clock" size={17} />
              {t("Etwa 4–6 Minuten", "About 4–6 minutes")}
            </span>
          </div>
        </div>
        <div className="lesson-stamp">
          <span>01</span>
          <small>
            {t("SEHEN. VERSTEHEN. ANWENDEN.", "SEE IT. GET IT. USE IT.")}
          </small>
        </div>
      </section>
      <MemoryTiles onSelect={showCard} />
      <div className="home-bottom">
        <p className="flow-line">
          <span>{t("3 kurze Fragen", "3 quick checks")}</span>
          <Icon name="chevron" size={15} />
          <span>{t("3 Merkkarten", "3 picture cards")}</span>
          <Icon name="chevron" size={15} />
          <span>{t("6 Übungen", "6 exercises")}</span>
        </p>
        {session.history && (
          <button className="text-button" onClick={revisit}>
            <Icon name="repeat" size={17} />
            {t("Heute kurz wiederholen", "Quick revisit")}
          </button>
        )}
      </div>
      {session.history && (
        <p className="revisit-note">
          <Icon name="bookmark" size={16} />
          {t(
            "Deine Karten bleiben hier. Morgen kurz abrufen.",
            "Your cards stay here. Try recalling them tomorrow.",
          )}
        </p>
      )}
    </>
  );
}
function Lesson({
  session,
  dispatch,
  pause,
  revisit,
  showCard,
  titleRef,
}: {
  session: Session;
  dispatch: Dispatch<Action>;
  pause: () => void;
  revisit: () => void;
  showCard: (form: MemoryForm) => void;
  titleRef: TitleRef;
}) {
  const { t } = useLearningLanguage();
  const phase =
    session.stage === "diagnostic"
      ? 0
      : session.stage === "explanation"
        ? 1
        : ["practice", "speaking"].includes(session.stage)
          ? 2
          : 3;
  const labels = [
    t("Kurz prüfen", "Check"),
    t("Bilder merken", "See"),
    t("Ausprobieren", "Try"),
    t("Behalten", "Remember"),
  ];
  return (
    <>
      <div className="lesson-toolbar">
        <button className="text-button" onClick={pause}>
          <Icon name="pause" size={16} />
          {t("Pause", "Pause")}
        </button>
        <span>
          <Icon name="check" size={14} />
          {t("Automatisch gespeichert", "Progress saved")}
        </span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label={t("Lernfortschritt", "Lesson progress")}
        aria-valuenow={progressPercent(session)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div style={{ width: `${progressPercent(session)}%` }} />
      </div>
      <ol className="steps">
        {labels.map((label, i) => (
          <li
            key={i}
            className={`${i === phase ? "active" : ""} ${i < phase ? "done" : ""}`}
            aria-current={i === phase ? "step" : undefined}
          >
            <span>{i < phase ? <Icon name="check" size={12} /> : i + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      {["diagnostic", "practice"].includes(session.stage) && (
        <QuestionPanel
          key={session.queue[session.index]}
          session={session}
          dispatch={dispatch}
        />
      )}
      {session.stage === "explanation" && (
        <>
          <div className="page-heading compact">
            <span className="eyebrow">
              {t(
                "DREI BILDER, EIN KLARES MUSTER",
                "THREE PICTURES, ONE CLEAR PATTERN",
              )}
            </span>
            <h1 ref={titleRef} tabIndex={-1}>
              {t("So bleiben sie im Kopf.", "Give each form a picture.")}
            </h1>
            <p>
              {t(
                "Tippe auf die Karten. Schau auf das Wort danach.",
                "Tap the cards. Notice the word that comes after.",
              )}
            </p>
          </div>
          <MemoryBoard
            bookmarks={session.bookmarks}
            onBookmark={(id) => dispatch({ type: "BOOKMARK", id })}
          />
          <div className="center-actions">
            <button
              className="primary"
              onClick={() => dispatch({ type: "EXPLAIN_NEXT" })}
            >
              {t("Jetzt ausprobieren", "Let’s practise")}
              <Icon name="arrow" />
            </button>
          </div>
        </>
      )}
      {session.stage === "speaking" && (
        <Speaking session={session} dispatch={dispatch} titleRef={titleRef} />
      )}
      {session.stage === "review" && (
        <Review session={session} dispatch={dispatch} titleRef={titleRef} />
      )}
      {session.stage === "complete" && (
        <Complete
          session={session}
          revisit={revisit}
          showCard={showCard}
          titleRef={titleRef}
        />
      )}
    </>
  );
}
function GermanSentence({ text }: { text: string }) {
  return (
    <div className="german-sentence" lang="de">
      {text.split(/(\s+)/).map((word, i) => (
        <span
          key={i}
          className={
            /^(werde|werden|werdet|wirst|wird|würde|würden|würdest|würdet|wurde|wurden|wurdest|wurdet|worden|geworden|___)[.!?]?$/i.test(
              word,
            )
              ? "verb-word"
              : ""
          }
        >
          {word}
        </span>
      ))}
    </div>
  );
}
function SentenceHelp({ q }: { q: Question }) {
  const { language, t } = useLearningLanguage();
  const [open, setOpen] = useState(false);
  if (language === "en")
    return (
      <p className="sentence-meaning" lang="en">
        {q.translation.en}
      </p>
    );
  return (
    <>
      <button
        type="button"
        className="text-button translation-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {t("English anzeigen", "Show English")} {open ? "−" : "+"}
      </button>
      {open && (
        <p className="sentence-meaning" lang="en">
          {q.translation.en}
        </p>
      )}
    </>
  );
}
function AnswerOptions({
  q,
  value,
  onChange,
  disabled = false,
}: {
  q: Question;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const { language, t } = useLearningLanguage();
  if (q.options)
    return (
      <fieldset className="answer-options" disabled={disabled}>
        <legend className="sr-only">
          {t("Wähle eine Antwort", "Choose an answer")}
        </legend>
        {q.options.map((option, i) => (
          <label
            key={option}
            className={`answer-option ${value === option ? "chosen" : ""}`}
          >
            <input
              type="radio"
              name={`answer-${q.id}`}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <span className="option-number" aria-hidden="true">
              {i + 1}
            </span>
            <span className="option-copy">
              <span
                lang={language === "en" && optionMeanings[option] ? "en" : "de"}
              >
                {language === "en" && optionMeanings[option]
                  ? optionMeanings[option]
                  : option}
              </span>
              {language === "en" && optionGlosses[option] && (
                <small lang="en">{optionGlosses[option]}</small>
              )}
            </span>
            <span className="radio-circle" aria-hidden="true">
              {value === option && <Icon name="check" size={12} />}
            </span>
          </label>
        ))}
      </fieldset>
    );
  return (
    <div className="typed-answer">
      <label htmlFor={`answer-${q.id}`}>{t("Dein Wort", "Your word")}</label>
      <input
        id={`answer-${q.id}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={t("Hier eingeben…", "Type here…")}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        lang="de"
      />
      <span className="input-note">
        {t("ü kannst du auch als ue schreiben.", "You can type ue for ü.")}
      </span>
    </div>
  );
}
function QuestionPanel({
  session,
  dispatch,
}: {
  session: Session;
  dispatch: Dispatch<Action>;
}) {
  const { t, local } = useLearningLanguage();
  const q = questionById[session.queue[session.index]];
  const [hintOpen, setHintOpen] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const diagnostic = session.stage === "diagnostic";
  const adaptive =
    session.mode === "lesson" && session.index >= lesson.practiceIds.length;
  const correct = isCorrect(q, session.draft);
  useEffect(() => {
    (session.submitted ? feedback : heading).current?.focus({
      preventScroll: true,
    });
    (session.submitted ? feedback.current : panel.current)?.scrollIntoView({
      block: "start",
      behavior: "instant",
    });
  }, [q.id, session.submitted]);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        ["TEXTAREA", "SELECT"].includes(target.tagName) ||
        (target instanceof HTMLInputElement && target.type !== "radio")
      )
        return;
      if (!session.submitted && q.options && /^[1-3]$/.test(event.key)) {
        const option = q.options[Number(event.key) - 1];
        if (option) {
          event.preventDefault();
          dispatch({ type: "ANSWER", value: option });
          panel.current
            ?.querySelectorAll<HTMLInputElement>("input[type=radio]")
            [Number(event.key) - 1]?.focus();
        }
      }
      if (
        event.key === "Enter" &&
        (target === heading.current ||
          target === feedback.current ||
          target === document.body)
      ) {
        event.preventDefault();
        dispatch({ type: session.submitted ? "NEXT" : "SUBMIT" });
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [q, session.submitted, dispatch]);
  return (
    <section className="question-card" ref={panel}>
      <div className="question-meta">
        <span className="eyebrow">
          {diagnostic
            ? t(
                "KEIN TEST. NUR DEIN STARTPUNKT.",
                "NO PRESSURE. JUST A STARTING POINT.",
              )
            : adaptive
              ? t("EIN BISSCHEN MEHR ÜBUNG", "A LITTLE MORE PRACTICE HERE")
              : session.mode === "revisit"
                ? t("KURZ WIEDERHOLEN", "QUICK REVISIT")
                : t("DEIN SATZ, DEIN VERSUCH", "YOUR TURN")}
        </span>
        <span>
          {session.index + 1} / {session.queue.length}
        </span>
      </div>
      <h1 ref={heading} tabIndex={-1}>
        {local(instructionFor(q))}
      </h1>
      <div className="sentence-box">
        {q.dialogue ? (
          <>
            <span className="speaker">{q.dialogue[0].speaker}</span>
            <GermanSentence text={q.dialogue[0].text} />
          </>
        ) : (
          <GermanSentence text={q.sentence} />
        )}
        <SentenceHelp q={q} />
        <ReadButton text={q.dialogue?.[0].text ?? q.sentence} />
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          dispatch({ type: session.submitted ? "NEXT" : "SUBMIT" });
        }}
      >
        <AnswerOptions
          q={q}
          value={session.draft}
          onChange={(value) => dispatch({ type: "ANSWER", value })}
          disabled={session.submitted}
        />
        {!session.submitted && (
          <>
            <div className="question-help">
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setHintOpen(!hintOpen);
                  if (!hintOpen) dispatch({ type: "HINT" });
                }}
                aria-expanded={hintOpen}
              >
                <Icon name="lightbulb" size={17} />
                {t("Kleiner Tipp", "A small hint")}
              </button>
              <span>
                {q.options
                  ? t("Tasten 1–3 · Enter", "Keys 1–3 · Enter")
                  : "Enter ↵"}
              </span>
            </div>
            {hintOpen && <p className="hint-box">{local(q.hint)}</p>}
            <div className="question-actions">
              <button
                type="button"
                className="text-button"
                onClick={() => dispatch({ type: "SUBMIT", skip: true })}
              >
                {t("Noch unsicher", "Not sure yet")}
              </button>
              <button
                className="primary"
                type="submit"
                disabled={!session.draft.trim()}
              >
                {t("Prüfen", "Check")}
                <Icon name="arrow" />
              </button>
            </div>
          </>
        )}
        {session.submitted && (
          <>
            <div
              className={`feedback-box ${correct ? "correct" : "incorrect"}`}
              ref={feedback}
              tabIndex={-1}
              role="status"
            >
              <div className="feedback-label">
                <Icon name={correct ? "check" : "lightbulb"} size={19} />
                <strong>
                  {correct
                    ? session.hintUsed
                      ? t("Richtig, mit Tipp.", "Right, with a hint.")
                      : t("Genau!", "That’s it!")
                    : t(
                        "Merke dir dieses Muster.",
                        "Here’s the pattern to keep.",
                      )}
                </strong>
              </div>
              <GermanSentence text={q.solution} />
              <SentenceHelp q={q} />
              <p>{local(shortFeedback(q, session.draft))}</p>
              <details className="extra-detail">
                <summary>{t("Warum?", "Why?")}</summary>
                <p>{local(feedbackFor(q, session.draft))}</p>
              </details>
            </div>
            <div className="question-actions">
              <span className="muted small">
                {t("Enter zum Weitergehen", "Enter to continue")}
              </span>
              <button className="primary" type="submit">
                {t("Weiter", "Continue")}
                <Icon name="arrow" />
              </button>
            </div>
          </>
        )}
      </form>
    </section>
  );
}
function ReadButton({ text }: { text: string }) {
  const { t } = useLearningLanguage();
  const [speaking, setSpeaking] = useState(false);
  const available =
    typeof window !== "undefined" && "speechSynthesis" in window;
  useEffect(
    () => () => {
      if (available) window.speechSynthesis.cancel();
    },
    [available],
  );
  if (!available) return null;
  const read = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replaceAll("___", "…"));
    utterance.lang = "de-DE";
    utterance.rate = 0.85;
    const voice = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.startsWith("de"));
    if (voice) utterance.voice = voice;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };
  return (
    <button
      type="button"
      className="read-button"
      onClick={read}
      aria-label={
        speaking
          ? t("Vorlesen stoppen", "Stop reading aloud")
          : t("Satz anhören", "Listen to the sentence")
      }
    >
      <Icon name={speaking ? "pause" : "sound"} size={18} />
    </button>
  );
}
function Speaking({
  session,
  dispatch,
  titleRef,
}: {
  session: Session;
  dispatch: Dispatch<Action>;
  titleRef: TitleRef;
}) {
  const { language, t } = useLearningLanguage();
  return (
    <section className="question-card speaking-card">
      <span className="eyebrow">
        {t("OPTIONAL · LAUT AUSPROBIEREN", "OPTIONAL · SAY IT OUT LOUD")}
      </span>
      <h1 ref={titleRef} tabIndex={-1}>
        {t(
          "Ein freier Tag. Was würdest du tun?",
          "A day off. What would you do?",
        )}
      </h1>
      <div className="speaking-picture form-1">
        <MemoryPicture form="würden" small />
      </div>
      <div className="sentence-box">
        <GermanSentence text="Ich würde …" />
        {language === "en" && <p className="sentence-meaning">I would …</p>}
        <p className="word-bank" lang="de">
          reisen <span lang={language}>{t("oder", "(travel) ·")}</span> kochen{" "}
          <span lang={language}>{t("oder", "(cook) ·")}</span> lesen{" "}
          {language === "en" && <span>(read)</span>}
        </p>
      </div>
      <button
        className="secondary"
        onClick={() => dispatch({ type: "SPEAK_MODEL" })}
        aria-expanded={session.speakingModelSeen}
      >
        {t("Ein Beispiel hören / sehen", "Hear / see an example")}
      </button>
      {session.speakingModelSeen && (
        <div className="model-answer">
          <GermanSentence text="Ich würde ein Buch lesen." />
          {language === "en" && <p>I would read a book.</p>}
          <ReadButton text="Ich würde ein Buch lesen." />
          <div className="reflection">
            <span>
              {t("Passt dein Satz?", "Does your sentence follow the pattern?")}
            </span>
            <button
              aria-pressed={session.speakingReflection === "okay"}
              onClick={() => dispatch({ type: "SPEAK_REFLECT", value: "okay" })}
            >
              {t("Ja", "Yes")}
            </button>
            <button
              aria-pressed={session.speakingReflection === "again"}
              onClick={() =>
                dispatch({ type: "SPEAK_REFLECT", value: "again" })
              }
            >
              {t("Noch üben", "Try again")}
            </button>
          </div>
        </div>
      )}
      <p className="muted small">
        {t("Selbst prüfen. Keine Aufnahme.", "Self-check. No recording.")}
      </p>
      <div className="question-actions">
        <button
          className="text-button"
          onClick={() => dispatch({ type: "SPEAK_FINISH" })}
        >
          {t("Überspringen", "Skip")}
        </button>
        <button
          className="primary"
          onClick={() => dispatch({ type: "SPEAK_FINISH" })}
        >
          {t("Zur Rückschau", "Review")}
          <Icon name="arrow" />
        </button>
      </div>
    </section>
  );
}
function Review({
  session,
  dispatch,
  titleRef,
}: {
  session: Session;
  dispatch: Dispatch<Action>;
  titleRef: TitleRef;
}) {
  const { t, local } = useLearningLanguage();
  const missed = getMissed(session.attempts);
  const [index, setIndex] = useState(0);
  const [retry, setRetry] = useState(false);
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const attempt = missed[index];
  const q = attempt ? questionById[attempt.questionId] : null;
  const finish = () =>
    dispatch({ type: "FINISH", at: new Date().toISOString() });
  const next = () => {
    if (index + 1 >= missed.length) {
      finish();
      return;
    }
    setIndex(index + 1);
    setRetry(false);
    setValue("");
    setChecked(false);
    titleRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  };
  return (
    <section className="question-card review-card">
      <span className="eyebrow">
        {t("DEINE RÜCKSCHAU", "YOUR QUICK REVIEW")}
      </span>
      <h1 ref={titleRef} tabIndex={-1}>
        {q
          ? t("Dieses Muster noch einmal.", "One more look at this pattern.")
          : t(
              "Alles beim ersten Mal geschafft.",
              "You got every pattern first time.",
            )}
      </h1>
      {q && attempt ? (
        <>
          <div className="review-counter">
            <span>
              {index + 1} / {missed.length} {t("zum Wiederholen", "to revisit")}
            </span>
            <span>
              {attempt.assisted
                ? t("Mit Tipp gelöst", "Used a hint")
                : t("Noch unsicher", "Missed first time")}
            </span>
          </div>
          <div
            className={`review-cue form-${formFor(q) === "werden" ? 0 : formFor(q) === "würden" ? 1 : 2}`}
          >
            <MemoryPicture form={formFor(q)} small />
            <span lang="de">{formFor(q)}</span>
          </div>
          {!retry ? (
            <>
              <p className="original-answer">
                {t("Deine Antwort:", "Your answer:")}{" "}
                <span lang="de">
                  {attempt.response || t("Noch unsicher", "Not sure yet")}
                </span>
              </p>
              <GermanSentence text={q.solution} />
              <SentenceHelp q={q} />
              <p>{local(shortFeedback(q, attempt.response))}</p>
              <button className="secondary" onClick={() => setRetry(true)}>
                <Icon name="repeat" size={17} />
                {t("Noch einmal versuchen", "Try it again")}
              </button>
            </>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (value.trim()) setChecked(true);
              }}
            >
              <GermanSentence text={q.sentence} />
              <SentenceHelp q={q} />
              <AnswerOptions
                q={q}
                value={value}
                onChange={setValue}
                disabled={checked}
              />
              {checked ? (
                <div className="retry-feedback" role="status">
                  <strong>
                    {isCorrect(q, value)
                      ? t("Genau!", "That’s it!")
                      : t("So lautet der Satz:", "Here is the sentence:")}
                  </strong>
                  <GermanSentence text={q.solution} />
                </div>
              ) : (
                <button
                  className="secondary"
                  type="submit"
                  disabled={!value.trim()}
                >
                  {t("Prüfen", "Check")}
                </button>
              )}
            </form>
          )}
          <div className="question-actions">
            <button className="text-button" onClick={finish}>
              {t("Rückschau beenden", "Finish review")}
            </button>
            <button className="primary" onClick={next}>
              {index + 1 === missed.length
                ? t("Fertig", "Finish")
                : t("Nächstes Muster", "Next pattern")}
              <Icon name="arrow" />
            </button>
          </div>
        </>
      ) : (
        <>
          <p>
            {t(
              "Morgen fünf neue Beispiele abrufen.",
              "Try five fresh examples tomorrow.",
            )}
          </p>
          <button className="primary" onClick={finish}>
            {t("Fertig", "Finish")}
            <Icon name="check" />
          </button>
        </>
      )}
    </section>
  );
}
function Complete({
  session,
  revisit,
  showCard,
  titleRef,
}: {
  session: Session;
  revisit: () => void;
  showCard: (form: MemoryForm) => void;
  titleRef: TitleRef;
}) {
  const { t } = useLearningLanguage();
  const stats = getPracticeStats(session.attempts);
  return (
    <section className="completion">
      <div className="completion-check">
        <Icon name="check" size={30} />
      </div>
      <span className="eyebrow">
        {t("EIN KLEINER SCHRITT GESCHAFFT", "ONE SMALL STEP, DONE")}
      </span>
      <h1 ref={titleRef} tabIndex={-1}>
        {t(
          "Drei Wörter. Ein klareres Bild.",
          "Three words. A clearer picture.",
        )}
      </h1>
      <p>
        {stats.unaided} / {stats.total}{" "}
        {t(
          "beim ersten Versuch ohne Tipp.",
          "right on your first try, without hints.",
        )}
        {stats.assisted > 0 &&
          ` ${stats.assisted} ${t("weitere mit Tipp.", "more with a hint.")}`}
      </p>
      <MemoryTiles onSelect={showCard} />
      <div className="revisit-box">
        <Icon name="repeat" size={24} />
        <div>
          <strong>
            {t(
              "Morgen: kurz aus dem Kopf abrufen.",
              "Tomorrow: recall it from memory.",
            )}
          </strong>
          <p>
            {t(
              "Fünf Beispiele. Mit Fokus auf unsichere Muster.",
              "Five examples, with extra focus on uncertain patterns.",
            )}
          </p>
        </div>
        <button className="primary" onClick={revisit}>
          {t("Jetzt wiederholen", "Revisit now")}
          <Icon name="arrow" size={17} />
        </button>
      </div>
    </section>
  );
}

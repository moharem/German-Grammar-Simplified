import { useState } from "react";
import { Icon } from "./Icon";
import { useLearningLanguage } from "./LearningLanguage";
import { patterns, type MemoryForm } from "../content/visual";
export const forms: MemoryForm[] = ["werden", "würden", "worden"];
export function MemoryPicture({
  form,
  small = false,
}: {
  form: MemoryForm;
  small?: boolean;
}) {
  const { t } = useLearningLanguage();
  return (
    <svg
      className={`memory-picture ${small ? "small" : ""}`}
      viewBox="0 0 220 120"
      role="img"
      aria-label={
        form === "werden"
          ? t("Pfeil in die Zukunft", "Arrow pointing ahead")
          : form === "würden"
            ? t(
                "Gedankenblase für eine Möglichkeit",
                "Thought bubble for an imagined possibility",
              )
            : t(
                "Ein geliefertes Paket mit Häkchen",
                "Delivered parcel with a check mark",
              )
      }
    >
      {form === "werden" ? (
        <>
          <circle cx="37" cy="64" r="20" fill="currentColor" opacity=".14" />
          <circle cx="37" cy="64" r="6" fill="currentColor" />
          <path
            d="M65 64h116m-24-24 25 24-25 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m137 22 8 7"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <text x="37" y="106" textAnchor="middle">
            {t("jetzt", "now")}
          </text>
          <text x="174" y="106" textAnchor="middle">
            {t("danach", "next")}
          </text>
        </>
      ) : form === "würden" ? (
        <>
          <path
            d="M65 29c5-21 40-24 52-6 23-12 49 1 47 23 23 3 27 37 4 45H68c-29-1-33-32-13-42-6-7-2-18 10-20Z"
            fill="currentColor"
            opacity=".12"
          />
          <path
            d="M65 29c5-21 40-24 52-6 23-12 49 1 47 23 23 3 27 37 4 45H68c-29-1-33-32-13-42-6-7-2-18 10-20Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <circle cx="54" cy="100" r="7" fill="currentColor" opacity=".25" />
          <circle cx="39" cy="112" r="4" fill="currentColor" />
          <text className="picture-word" x="111" y="63" textAnchor="middle">
            {t("wenn…", "what if…")}
          </text>
          <circle cx="161" cy="13" r="4" fill="currentColor" />
          <circle cx="175" cy="13" r="4" fill="currentColor" />
        </>
      ) : (
        <>
          <path
            d="m61 43 49-22 49 22v58H61Z"
            fill="currentColor"
            opacity=".12"
          />
          <path
            d="m61 43 49-22 49 22v58H61Zm0 0 49 22 49-22M110 65v36M85 32l50 22"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="166" cy="39" r="24" fill="var(--card-ink)" />
          <path
            d="m155 39 8 8 14-16"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="110" y="119" textAnchor="middle">
            {t("erledigt", "done")}
          </text>
        </>
      )}
    </svg>
  );
}
export function MemoryTiles({
  onSelect,
  active,
}: {
  onSelect: (form: MemoryForm) => void;
  active?: MemoryForm;
}) {
  const { t } = useLearningLanguage();
  const labels = {
    werden: t("Zukunft · Veränderung · Handlung", "Will · become · is being"),
    würden: t("Vorgestellt oder höflich", "Imagined or polite"),
    worden: t("Schon erledigt", "Has been done"),
  };
  return (
    <div className="memory-tiles">
      {forms.map((form, i) => (
        <button
          key={form}
          className={`memory-tile form-${i} ${active === form ? "selected" : ""}`}
          onClick={() => onSelect(form)}
          aria-pressed={active === form}
        >
          <span className="tile-number">0{i + 1}</span>
          <MemoryPicture form={form} small />
          <strong lang="de">{form}</strong>
          <span>{labels[form]}</span>
          <span className="tile-action">
            {t("Ansehen", "Explore")} <Icon name="arrow" size={16} />
          </span>
        </button>
      ))}
    </div>
  );
}
export function MemoryBoard({
  initial = "werden",
  bookmarks = [],
  onBookmark,
}: {
  initial?: MemoryForm;
  bookmarks?: string[];
  onBookmark?: (id: string) => void;
}) {
  const { language, t, local } = useLearningLanguage();
  const [active, setActive] = useState<MemoryForm>(initial);
  const [branch, setBranch] = useState(0);
  const [meaning, setMeaning] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const pattern = patterns[active][active === "werden" ? branch : 0];
  const select = (form: MemoryForm) => {
    setActive(form);
    setBranch(0);
    setMeaning(false);
    setFlipped(false);
  };
  const marked = bookmarks.includes(pattern.id);
  return (
    <div className="memory-board">
      <MemoryTiles onSelect={select} active={active} />
      <section
        className={`pattern-panel form-${forms.indexOf(active)}`}
        aria-label={t("Merkkarte", "Memory card")}
      >
        <div className="pattern-top">
          <div>
            <span className="eyebrow">
              {t(
                "Das Bild merken. Den Satz bauen.",
                "Keep the picture. Build the sentence.",
              )}
            </span>
            <h2>{local(pattern.cue)}</h2>
          </div>
          {onBookmark && (
            <button
              className={`icon-button ${marked ? "marked" : ""}`}
              onClick={() => onBookmark(pattern.id)}
              aria-label={
                marked
                  ? t("Merkkarte entfernen", "Unsave card")
                  : t("Merkkarte speichern", "Save card")
              }
              aria-pressed={marked}
            >
              <Icon name="bookmark" />
            </button>
          )}
        </div>
        {active === "werden" && (
          <div
            className="branch-tabs"
            role="group"
            aria-label={t("Bedeutung von werden", "Meaning of werden")}
          >
            {patterns.werden.map((p, i) => (
              <button
                key={p.id}
                aria-pressed={branch === i}
                onClick={() => {
                  setBranch(i);
                  setFlipped(false);
                }}
              >
                {local(p.label)}
              </button>
            ))}
          </div>
        )}
        {flipped ? (
          <div className="memory-challenge" role="status">
            <Icon name="lightbulb" size={25} />
            <strong>
              {t(
                "Baue den Satz aus dem Kopf.",
                "Build the sentence from memory.",
              )}
            </strong>
            <p lang={language}>{local(pattern.recallPrompt)}</p>
            <span>
              {t(
                "Sag ihn laut. Dann aufdecken.",
                "Say it aloud. Then reveal it.",
              )}
            </span>
          </div>
        ) : (
          <>
            <div className="sentence-pieces" lang="de">
              {pattern.parts.map((part, i) => (
                <div
                  className={`sentence-piece ${part.focus ? "focus-piece" : ""}`}
                  key={i}
                >
                  <strong>{part.word}</strong>
                  <span lang={language}>{local(part.meaning)}</span>
                </div>
              ))}
            </div>
            {language === "en" ? (
              <p className="sentence-meaning" lang="en">
                {pattern.translation.en}
              </p>
            ) : (
              <>
                <button
                  className="text-button"
                  onClick={() => setMeaning(!meaning)}
                  aria-expanded={meaning}
                >
                  English {meaning ? "−" : "+"}
                </button>
                {meaning && (
                  <p className="sentence-meaning" lang="en">
                    {pattern.translation.en}
                  </p>
                )}
              </>
            )}
            <div
              className="formula"
              aria-label={t("Satzmuster", "Sentence pattern")}
            >
              {pattern.pattern.map((part, i) => (
                <span className="formula-part" key={i}>
                  {i > 0 && (
                    <span className="plus" aria-hidden="true">
                      +
                    </span>
                  )}
                  <span>{local(part)}</span>
                </span>
              ))}
            </div>
            {active === "werden" && (
              <p className="tiny-rule">
                {t(
                  "Das Wort danach zeigt die Bedeutung.",
                  "The word after werden tells you its job.",
                )}
              </p>
            )}
            {active === "würden" && (
              <div className="contrast-pair">
                <span>
                  <b lang="de">ich würde</b>
                  <small>{t("ich", "I would")}</small>
                </span>
                <span>
                  <b lang="de">wir / Sie würden</b>
                  <small>
                    {t("wir / höfliches Sie", "we / you (formal) would")}
                  </small>
                </span>
              </div>
            )}
            {active === "worden" && (
              <div className="contrast-pair">
                <span>
                  <b lang="de">geliefert → worden</b>
                  <small>
                    {t("Eine Handlung erledigt", "An action completed")}
                  </small>
                </span>
                <span>
                  <b lang="de">müde → geworden</b>
                  <small>
                    {t(
                      "Ein Zustand verändert",
                      "A state changed: became tired",
                    )}
                  </small>
                </span>
              </div>
            )}
          </>
        )}
        <button
          className="recall-strip"
          onClick={() => setFlipped(!flipped)}
          aria-expanded={!flipped}
        >
          <Icon name="repeat" />
          <span>
            {flipped
              ? t("Muster aufdecken", "Reveal the pattern")
              : t(
                  "Muster verdecken & aus dem Kopf abrufen",
                  "Hide the pattern & recall it",
                )}
          </span>
          <Icon name="chevron" size={17} />
        </button>
        <details className="extra-detail">
          <summary>
            {t(
              "Mehr Details, wenn du sie brauchst",
              "More detail, when you need it",
            )}
          </summary>
          {active === "werden" ? (
            <>
              <p>
                {t(
                  "ich werde · du wirst · er/sie/es wird · wir werden · ihr werdet · sie/Sie werden",
                  "Forms: ich werde · du wirst · er/sie/es wird · wir werden · ihr werdet · sie/Sie werden",
                )}
              </p>
              <p>
                {t(
                  "Die Grundform heißt Infinitiv (kochen). Die Form „gekocht“ heißt Partizip II. Für Zukunft ist auch Präsens möglich: Morgen koche ich. Futur I kann auch eine Vermutung ausdrücken.",
                  "The base form is called the infinitive (kochen = cook). The form gekocht (cooked) is called the past participle. German also uses the present for the future: Morgen koche ich = I’m cooking tomorrow. Futur I can also express a guess.",
                )}
              </p>
            </>
          ) : active === "würden" ? (
            <>
              <p>
                {t(
                  "ich würde · du würdest · er/sie/es würde · wir würden · ihr würdet · sie/Sie würden",
                  "Forms: ich würde · du würdest · er/sie/es würde · wir würden · ihr würdet · sie/Sie würden",
                )}
              </p>
              <p>
                {t(
                  "würde = Möglichkeit (Konjunktiv II). wurde ohne Umlaut = Vergangenheit: Das Rad wurde repariert.",
                  "würde = would (Konjunktiv II). wurde, without the dots, is past: Das Rad wurde repariert = The bike was repaired.",
                )}
              </p>
            </>
          ) : (
            <p>
              {t(
                "sein + Partizip II + worden = Passiv im Perfekt. ist für Einzahl, sind für Mehrzahl. Bei „werden“ als Veränderung bleibt ge-: Ich bin müde geworden.",
                "sein + past participle + worden = perfect passive. ist with a singular subject, sind with a plural subject. For a change, keep ge-: Ich bin müde geworden = I became tired.",
              )}
            </p>
          )}
        </details>
      </section>
    </div>
  );
}

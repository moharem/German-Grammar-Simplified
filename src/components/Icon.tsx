const paths = {
  arrow: "M4 12h15m-6-6 6 6-6 6",
  back: "M20 12H5m6-6-6 6 6 6",
  home: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z",
  book: "M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H4Zm16 0h-4a3 3 0 0 0-3 3v14a4 4 0 0 1 4-2h3Z",
  cards: "M6 7h13v14H6Zm-3 9V3h13",
  clock: "M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  check: "m5 12 4 4L19 6",
  close: "m6 6 12 12M6 18 18 6",
  sparkle: "m12 3 2.7 6.3L21 12l-6.3 2.7L12 21l-2.7-6.3L3 12l6.3-2.7Z",
  sound: "m10 4-5 5H2v6h3l5 5Zm5 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14",
  bookmark: "M6 3h12v19l-6-4-6 4Z",
  globe:
    "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M2 12h20M12 2c6 6 6 14 0 20-6-6-6-14 0-20",
  repeat:
    "m17 2 4 4-4 4M3 11V8a2 2 0 0 1 2-2h16M7 22l-4-4 4-4m14-1v3a2 2 0 0 1-2 2H3",
  target: "M21 12a9 9 0 1 1-9-9M17 12a5 5 0 1 1-5-5m0 5L22 2m-6 0h6v6",
  sprout:
    "M12 22V12M12 15C4 15 2 9 3 4c6 0 10 3 9 11m0-3c0-6 4-9 9-9 1 6-3 10-9 9",
  chevron: "m9 5 7 7-7 7",
  lightbulb: "M8 19h8M9 22h6M8 16c0-4-3-4-3-9a7 7 0 0 1 14 0c0 5-3 5-3 9Z",
  info: "M12 11v6m0-10h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  pause: "M8 5v14M16 5v14",
  leaf: "M20 3C8 1 2 8 5 16c8 6 17-1 15-13ZM5 20 16 8",
} as const;

export type IconName = keyof typeof paths;
export function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}

export function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 36 36">
          <path
            d="m8 23 8-11m0 11 8-11m0 11 5-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span>
        GGS<span className="brand-dot">.</span>
      </span>
    </span>
  );
}

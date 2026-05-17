"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

// ── helpers ───────────────────────────────────────────────────────────────────

function datePartsInZone(tz: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    weekday: get("weekday"),
    month: get("month"),
    day: Number(get("day")),
    year: Number(get("year")),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
  };
}

function zonedDate(tz: string) {
  const parts = datePartsInZone(tz);
  return new Date(parts.year, MONTH_NAMES.indexOf(parts.month), parts.day, parts.hour, parts.minute);
}

function wmoToWeather(code: number) {
  if (code === 0) return { icon: "☀️", label: "Clear Sky" };
  if (code <= 3) return { icon: "⛅", label: "Partly Cloudy" };
  if (code <= 48) return { icon: "🌫️", label: "Foggy" };
  if (code <= 55) return { icon: "🌦️", label: "Drizzle" };
  if (code <= 65) return { icon: "🌧️", label: "Rain" };
  if (code <= 77) return { icon: "❄️", label: "Snow" };
  if (code <= 82) return { icon: "🌦️", label: "Showers" };
  if (code <= 86) return { icon: "🌨️", label: "Snow Showers" };
  return { icon: "⛈️", label: "Thunderstorm" };
}

function offsetLabel(tz: string) {
  const here = new Date();
  const there = zonedDate(tz);
  const diffHours = Math.round((there.getTime() - here.getTime()) / 3_600_000);

  if (diffHours === 0) return "Same Time";
  return `${diffHours > 0 ? "+" : ""}${diffHours}HRS`;
}

function dayLabel(tz: string) {
  const now = new Date();
  const here = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thereNow = zonedDate(tz);
  const there = new Date(thereNow.getFullYear(), thereNow.getMonth(), thereNow.getDate());
  const dayDiff = Math.round((there.getTime() - here.getTime()) / 86_400_000);

  if (dayDiff === 0) return "Today";
  if (dayDiff === -1) return "Yesterday";
  if (dayDiff === 1) return "Tomorrow";
  return there.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── Draggable widget shell ────────────────────────────────────────────────────
// The outer div sets the initial CSS position; framer drag adds a transform on top.

function DragWidget({
  children,
  top,
  left,
  right,
}: {
  children: React.ReactNode;
  top: number;
  left?: number;
  right?: number;
}) {
  return (
    <div className="absolute" style={{ top, left, right }}>
      <motion.div
        drag
        dragMomentum={false}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="cursor-grab active:cursor-grabbing"
      >
        {children}
      </motion.div>
    </div>
  );
}

const GLASS = (bg: string, border = "rgba(255,255,255,0.10)") =>
  ({
    background: bg,
    border: `1px solid ${border}`,
    backdropFilter: "blur(20px) saturate(1.2)",
    boxShadow: "0 14px 34px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.10)",
  } as const);

const CALENDAR_CARD = GLASS(
  "linear-gradient(180deg, rgba(252,252,253,0.95), rgba(242,242,245,0.92))",
  "rgba(255,255,255,0.72)"
);

const WEATHER_CARD = GLASS(
  "linear-gradient(180deg, rgba(38,96,162,0.94), rgba(92,157,225,0.86))",
  "rgba(255,255,255,0.28)"
);

const CLOCK_CARD = GLASS(
  "linear-gradient(180deg, rgba(44,44,50,0.94), rgba(36,36,42,0.92))",
  "rgba(255,255,255,0.14)"
);

const CLOCKS = [
  { city: "Cupertino", tz: "America/Los_Angeles" },
  { city: "Tokyo", tz: "Asia/Tokyo" },
  { city: "Sydney", tz: "Australia/Sydney" },
  { city: "Paris", tz: "Europe/Paris" },
];

// ── Date / Calendar Widget ────────────────────────────────────────────────────

const DAY_NAMES = [
  "SUNDAY","MONDAY","TUESDAY","WEDNESDAY",
  "THURSDAY","FRIDAY","SATURDAY",
];
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function DateWidget() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const today = now.getDate();
  return (
    <div
      className="flex h-[196px] w-[172px] flex-col overflow-hidden rounded-[24px] select-none text-white"
      style={CALENDAR_CARD}
    >
      <div className="px-5 pt-5 pb-0">
        <p className="text-[10px] font-semibold tracking-tight text-[#ff4d3d]">
          {DAY_NAMES[now.getDay()]}
        </p>
        <p className="mt-1 text-[40px] font-light leading-[0.95] text-[#1f2024]">{today}</p>
      </div>

      <div className="mt-2.5 px-5">
        <div
          className="rounded-[18px] px-3 py-2"
          style={{
            background: "rgba(245,241,238,0.92)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
          }}
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 h-3 w-3 rounded-full border-[1.5px] border-[#ff8a00] shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-[9px] font-semibold leading-tight text-[#2f3035]">
                Portfolio Review Meeting
              </p>
              <p className="text-[9px] font-medium text-[#6e6f75]">16.00</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mt-auto h-[62px] px-5 pt-6"
        style={{
          background: "linear-gradient(180deg, rgba(240,240,243,0.45), rgba(231,231,235,0.7))",
          backdropFilter: "blur(18px)",
        }}
      >
        <p className="text-[9px] font-medium text-[#696a71]">
          {MONTH_NAMES[now.getMonth()]} {now.getFullYear()}
        </p>
      </div>
    </div>
  );
}

// ── World Clock Widget ────────────────────────────────────────────────────────

function WorldClockWidget() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="w-[356px] rounded-[24px] overflow-hidden select-none px-4 py-3.5 text-white"
      style={CLOCK_CARD}
    >
      <div className="grid grid-cols-4 gap-2">
        {CLOCKS.map((c) => (
          <div key={c.city} className="flex flex-col items-center text-center">
            <AnalogClock tz={c.tz} />
            <p className="mt-2 text-[6px] font-semibold leading-tight text-white/92">{c.city}</p>
            <p className="text-[6px] font-semibold leading-tight text-white/62">{dayLabel(c.tz)}</p>
            <p className="text-[6px] font-semibold leading-tight text-white/62">{offsetLabel(c.tz)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Weather Widget ────────────────────────────────────────────────────────────

interface WeatherData {
  temp: number;
  high: number;
  low: number;
  code: number;
}

function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast" +
        "?latitude=-6.2088&longitude=106.8456" +
        "&current=temperature_2m,weather_code" +
        "&daily=temperature_2m_max,temperature_2m_min" +
        "&timezone=Asia%2FJakarta&forecast_days=1"
    )
      .then((r) => r.json())
      .then((d) =>
        setWeather({
          temp: Math.round(d.current.temperature_2m),
          high: Math.round(d.daily.temperature_2m_max[0]),
          low: Math.round(d.daily.temperature_2m_min[0]),
          code: d.current.weather_code,
        })
      )
      .catch(() => setFailed(true));
  }, []);

  const info = weather ? wmoToWeather(weather.code) : null;

  return (
    <div
      className="h-[196px] w-[172px] overflow-hidden rounded-[24px] select-none text-white"
      style={WEATHER_CARD}
    >
      <div className="px-5 pt-5">
        <p className="text-[10px] font-semibold tracking-tight text-white/95">South Jakarta ↗</p>
      </div>

      {!weather && !failed && (
        <div className="px-6 py-6 text-white/40 text-xs animate-pulse">
          Fetching…
        </div>
      )}
      {failed && (
        <div className="px-6 py-6 text-white/40 text-xs">Unavailable</div>
      )}
      {weather && info && (
        <div className="flex h-[152px] flex-col px-5 pb-4 pt-1">
          <div className="flex items-start justify-between">
            <span className="text-[48px] font-light leading-[0.9] text-white">{weather.temp}°</span>
          </div>
          <div className="mt-auto">
            <p className="text-[15px] leading-none text-white/90">{info.icon}</p>
            <p className="mt-1 text-[7px] font-semibold leading-tight text-white">{info.label}</p>
            <p className="mt-0.5 text-[7px] font-semibold text-white/88">
              H:{weather.high}° L:{weather.low}°
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function AnalogClock({ tz }: { tz: string }) {
  const parts = datePartsInZone(tz);
  const minute = parts.minute;
  const hour = parts.hour % 12;
  const second = new Date().getSeconds();

  const minuteRotation = minute * 6;
  const hourRotation = hour * 30 + minute * 0.5;
  const secondRotation = second * 6;

  return (
    <div className="relative h-[76px] w-[76px] rounded-full bg-[#fbfbfd] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = index * 30;
        return (
          <div
            key={angle}
            className="absolute left-1/2 top-1/2 text-[6px] font-semibold text-[#2d2e34]"
            style={{
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-31px) rotate(${-angle}deg)`,
            }}
          >
            {index === 0 ? 12 : index}
          </div>
        );
      })}

      <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff8a00]" />

      <div
        className="absolute left-1/2 top-1/2 h-[18px] w-[2.5px] origin-bottom rounded-full bg-[#3a3b42]"
        style={{ transform: `translate(-50%, -100%) rotate(${hourRotation}deg)` }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[25px] w-[2px] origin-bottom rounded-full bg-[#595a63]"
        style={{ transform: `translate(-50%, -100%) rotate(${minuteRotation}deg)` }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[27px] w-[1.5px] origin-bottom rounded-full bg-[#ff8a00]"
        style={{ transform: `translate(-50%, -100%) rotate(${secondRotation}deg)` }}
      />
    </div>
  );
}

// ── Notification Guide Widget ────────────────────────────────────────────────

const GUIDE_NOTIFICATIONS = [
  {
    id: "notes",
    app: "Portfolio Guide",
    iconSrc: "/dock/notes.png",
    title: "Start Here",
    body: "Open Notes first for a quick intro about me, what I do, and how this portfolio is organized.",
    time: "now",
    subtitle: "Notes",
    accent: "rgba(255, 210, 128, 0.26)",
    tint: "linear-gradient(180deg, rgba(255,249,243,0.98), rgba(250,246,243,0.96))",
  },
  {
    id: "messages",
    app: "Messages",
    iconSrc: "/dock/messages.png",
    title: "Quick Intro Chat",
    body: "Open Messages to read a short conversation-style intro about my background, strengths, and work style.",
    time: "now",
    subtitle: "Messages",
    accent: "rgba(145, 237, 174, 0.24)",
    tint: "linear-gradient(180deg, rgba(244,252,246,0.98), rgba(238,248,241,0.96))",
  },
  {
    id: "projects",
    app: "Projects",
    iconSrc: "/dock/finder.png",
    title: "Featured Work",
    body: "See selected case studies, product thinking, and the way I build solutions end-to-end.",
    time: "1m ago",
    subtitle: "Finder",
    accent: "rgba(150, 228, 199, 0.20)",
    tint: "linear-gradient(180deg, rgba(237,249,255,0.98), rgba(231,245,252,0.96))",
  },
  {
    id: "terminal",
    app: "Terminal",
    iconSrc: "/dock/terminal.png",
    title: "Engineer Mode",
    body: "Jump into Terminal for a more technical snapshot of my stack, interests, and how I think about systems.",
    time: "1m ago",
    subtitle: "Terminal",
    accent: "rgba(148, 163, 184, 0.24)",
    tint: "linear-gradient(180deg, rgba(243,245,249,0.98), rgba(236,240,246,0.96))",
  },
  {
    id: "resume",
    app: "Resume",
    iconSrc: "/dock/resume.png",
    title: "CV Ready",
    body: "Open Resume for a more formal view of my experience, background, and work history.",
    time: "3m ago",
    subtitle: "Preview",
    accent: "rgba(255, 217, 148, 0.22)",
    tint: "linear-gradient(180deg, rgba(250,247,242,0.98), rgba(245,241,236,0.96))",
  },
  {
    id: "links",
    app: "Links",
    iconSrc: "/dock/safari.png",
    title: "Let's Connect",
    body: "Open Safari / Links to jump straight to LinkedIn, GitHub, and the easiest way to contact me.",
    time: "5m ago",
    subtitle: "Safari",
    accent: "rgba(255, 181, 214, 0.18)",
    tint: "linear-gradient(180deg, rgba(245,247,251,0.98), rgba(238,242,247,0.96))",
  },
  {
    id: "music",
    app: "Music",
    iconSrc: "/dock/music.png",
    title: "Current Soundtrack",
    body: "Open Music to hear a few tracks I like and get a more personal feel for the desktop experience.",
    time: "7m ago",
    subtitle: "Music",
    accent: "rgba(255, 150, 150, 0.2)",
    tint: "linear-gradient(180deg, rgba(252,244,246,0.98), rgba(248,239,242,0.96))",
  },
  {
    id: "photo",
    app: "Photos",
    iconSrc: "/dock/photos.png",
    title: "Life Outside Work",
    body: "Browse Photos for personal moments, campus life, work events, and a bit more context beyond the resume.",
    time: "12m ago",
    subtitle: "Photos",
    accent: "rgba(255, 214, 120, 0.22)",
    tint: "linear-gradient(180deg, rgba(252,248,241,0.98), rgba(248,243,236,0.96))",
  },
  {
    id: "books",
    app: "Books",
    iconSrc: "/dock/books.png",
    title: "What I'm Reading",
    body: "Open Books to see the titles shaping how I learn about machine learning, software, and product thinking.",
    time: "18m ago",
    subtitle: "Books",
    accent: "rgba(255, 175, 108, 0.22)",
    tint: "linear-gradient(180deg, rgba(252,246,240,0.98), rgba(248,241,234,0.96))",
  },
  {
    id: "tools",
    app: "Launchpad",
    iconSrc: "/dock/launchpad.png",
    title: "Open Everything",
    body: "Launchpad gives the quickest way to open the rest of the portfolio apps and explore the desktop freely.",
    time: "29m ago",
    subtitle: "Launchpad",
    accent: "rgba(167, 139, 250, 0.2)",
    tint: "linear-gradient(180deg, rgba(247,244,252,0.98), rgba(241,237,249,0.96))",
  },
  {
    id: "photobooth",
    app: "Photo Booth",
    iconSrc: "/dock/photobooth.png",
    title: "Playful Detail",
    body: "Photo Booth adds a lighter touch to the portfolio and shows the more playful side of the interface build.",
    time: "34m ago",
    subtitle: "Photo Booth",
    accent: "rgba(102, 126, 234, 0.18)",
    tint: "linear-gradient(180deg, rgba(242,246,252,0.98), rgba(236,241,249,0.96))",
  },
  {
    id: "steam",
    app: "Steam",
    iconSrc: "/dock/steam.png",
    title: "Personal Corner",
    body: "Steam is a small fun detail that makes the desktop feel lived-in instead of being only a polished showcase.",
    time: "42m ago",
    subtitle: "Steam",
    accent: "rgba(96, 165, 250, 0.18)",
    tint: "linear-gradient(180deg, rgba(241,246,251,0.98), rgba(234,240,247,0.96))",
  },
];

function NotificationCloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" className="h-3.5 w-3.5">
      <path d="M6 6L18 18" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

function GuideNotificationsWidget() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const visibleNotifications = useMemo(
    () => GUIDE_NOTIFICATIONS.filter((item) => !dismissedIds.includes(item.id)),
    [dismissedIds]
  );

  const dismissNotification = (id: string) => {
    setDismissedIds((current) => [...current, id]);
  };

  const restoreNotifications = () => {
    setDismissedIds([]);
    setIsExpanded(true);
  };

  return (
    <motion.div
      className="w-[320px] select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      style={{
        background: "transparent",
        boxShadow: "none",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        overflow: "visible",
      }}
    >
      <div className="mb-3 flex items-center justify-end gap-2 px-1">
        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          className="rounded-full border border-white/35 bg-white/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-xl transition hover:bg-white/28"
        >
          {isExpanded ? "Hide Notifications" : `Show Notifications${visibleNotifications.length ? ` (${visibleNotifications.length})` : ""}`}
        </button>
        {dismissedIds.length > 0 && (
          <button
            type="button"
            onClick={restoreNotifications}
            className="rounded-full border border-white/20 bg-white/14 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/76 backdrop-blur-xl transition hover:bg-white/22"
          >
            Restore
          </button>
        )}
      </div>

      {!isExpanded && visibleNotifications.length > 0 && (
        <div
          className="ml-auto flex w-[210px] items-center gap-2 overflow-hidden rounded-[18px] px-3 py-2 text-[#202126]"
          style={{
            background: "linear-gradient(180deg, rgba(250,251,253,0.96), rgba(243,246,250,0.94))",
            border: "1px solid rgba(255,255,255,0.72)",
            boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
          }}
        >
          <div className="relative h-9 w-9 overflow-hidden rounded-[11px] ring-1 ring-[#d8dde8]">
            <Image src={visibleNotifications[0].iconSrc} alt={visibleNotifications[0].subtitle} fill className="object-cover" sizes="48px" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#72757f]">
              Notification Center
            </p>
            <p className="truncate text-[12px] font-semibold">
              {visibleNotifications.length} notification{visibleNotifications.length > 1 ? "s" : ""} ready
            </p>
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="relative overflow-hidden rounded-[26px]">
          <div
            className="no-scrollbar space-y-2.5 overflow-y-auto pb-14 pt-2"
            style={{
              maxHeight: "calc(100vh - 220px)",
              background: "transparent",
              boxShadow: "none",
              backdropFilter: "none",
              WebkitBackdropFilter: "none",
              overflowX: "visible",
              maskImage: "linear-gradient(to bottom, black 0%, black 82%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 82%, transparent 100%)",
            }}
          >
            {visibleNotifications.map((item, index) => (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-[18px] px-2.5 py-1.5 text-[#1c1d22]"
                style={{
                  background: item.tint,
                  border: "1px solid rgba(255,255,255,0.82)",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
                }}
              >
                <div className="flex items-start gap-2">
                  <div className="relative mt-0.5 h-9 w-9 shrink-0 overflow-hidden rounded-[10px] ring-1 ring-[#d4d9e4]">
                    <Image src={item.iconSrc} alt={item.subtitle} fill className="object-cover" sizes="40px" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10px] font-semibold leading-tight text-[#4f535d]">{item.app}</p>
                        <p className="mt-0.5 truncate text-[11px] font-semibold leading-tight text-[#17181d]">
                          {item.title}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <span className="text-[9px] font-medium leading-none text-[#696c75]">{item.time}</span>
                        <button
                          type="button"
                          onClick={() => dismissNotification(item.id)}
                          aria-label={`Dismiss ${item.title}`}
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-white/55 text-[#5d6069] transition hover:bg-white/78"
                        >
                          <NotificationCloseIcon />
                        </button>
                      </div>
                    </div>

                    <p className="mt-0.5 line-clamp-2 text-[10px] leading-[1.15] text-[#2f3138]">
                      {item.body}
                    </p>

                    <div className="mt-0.5 flex items-center gap-1 text-[8px] font-medium text-[#7b7e88]">
                      <span className="rounded-full bg-white/72 px-1.5 py-0.5 leading-none">{item.subtitle}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {visibleNotifications.length === 0 && (
              <div
                className="rounded-[22px] px-4 py-4 text-center text-white/82"
                style={{
                  ...GLASS("linear-gradient(180deg, rgba(44,48,58,0.76), rgba(32,35,44,0.68))", "rgba(255,255,255,0.18)"),
                }}
              >
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/56">
                  Notification Center
                </p>
                <p className="mt-2 text-[15px] font-medium">All caught up.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function DesktopWidgets() {
  return (
    <div className="absolute inset-0" style={{ zIndex: 5, pointerEvents: "none" }}>
      <div style={{ pointerEvents: "auto" }}>
        {/* left widget group */}
        <DragWidget left={28} top={44}>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <DateWidget />
              <WeatherWidget />
            </div>
            <WorldClockWidget />
          </div>
        </DragWidget>

        {/* top-right notifications — fixed, no drag (avoids GPU compositing dark box) */}
        <div className="absolute" style={{ right: 28, top: 44 }}>
          <GuideNotificationsWidget />
        </div>
      </div>
    </div>
  );
}

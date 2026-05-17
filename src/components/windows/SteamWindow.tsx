"use client";

import { useState } from "react";

interface Game {
  id: string;
  title: string;
  genre: string;
  hours: number;
  lastPlayed: string;
  gradient: string;
  accentColor: string;
  description: string;
  tags: string[];
  achievements?: { done: number; total: number };
}

const GAMES: Game[] = [
  {
    id: "genshin",
    title: "Genshin Impact",
    genre: "Action RPG",
    hours: 312,
    lastPlayed: "2 days ago",
    gradient: "from-[#1a1a4e] via-[#2d1b69] to-[#0f3460]",
    accentColor: "#c0a060",
    description: "Open-world action RPG set in the fantasy world of Teyvat. Explore seven nations, collect characters, and unravel the mystery of the Traveler's missing sibling.",
    tags: ["Open World", "Gacha", "Co-op", "Free to Play"],
    achievements: { done: 184, total: 250 },
  },
  {
    id: "stardew",
    title: "Stardew Valley",
    genre: "Simulation RPG",
    hours: 189,
    lastPlayed: "1 week ago",
    gradient: "from-[#1a3a1a] via-[#2d5a27] to-[#4a7c3f]",
    accentColor: "#7ec850",
    description: "You've inherited your grandfather's old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life.",
    tags: ["Farming", "Relaxing", "RPG", "Singleplayer"],
    achievements: { done: 40, total: 40 },
  },
  {
    id: "hades",
    title: "Hades",
    genre: "Roguelike",
    hours: 94,
    lastPlayed: "3 weeks ago",
    gradient: "from-[#2a0a0a] via-[#4a1020] to-[#1a0a30]",
    accentColor: "#e85d3a",
    description: "Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion and Transistor.",
    tags: ["Roguelike", "Action", "Story Rich", "Singleplayer"],
    achievements: { done: 49, total: 49 },
  },
  {
    id: "hollow",
    title: "Hollow Knight",
    genre: "Metroidvania",
    hours: 61,
    lastPlayed: "1 month ago",
    gradient: "from-[#0a0a1a] via-[#0f1030] to-[#1a1440]",
    accentColor: "#8888dd",
    description: "Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes. Explore twisting caverns, battle tainted creatures.",
    tags: ["Metroidvania", "Difficult", "Atmospheric", "Singleplayer"],
    achievements: { done: 38, total: 63 },
  },
  {
    id: "celeste",
    title: "Celeste",
    genre: "Platformer",
    hours: 28,
    lastPlayed: "2 months ago",
    gradient: "from-[#1a0a2e] via-[#2d1b4e] to-[#4a2070]",
    accentColor: "#d44fa0",
    description: "Help Madeline survive her inner demons on her journey to the top of Celeste Mountain, in this super-tight platformer from the creators of TowerFall.",
    tags: ["Platformer", "Difficult", "Story Rich", "Indie"],
    achievements: { done: 24, total: 24 },
  },
  {
    id: "omori",
    title: "OMORI",
    genre: "RPG",
    hours: 22,
    lastPlayed: "3 months ago",
    gradient: "from-[#0a0a0a] via-[#1a1a2e] to-[#2a2a4e]",
    accentColor: "#ffffff",
    description: "A surreal psychological horror RPG where you explore a strange world full of curious creatures and colorful friends. Beneath the cheerful facade lies a truth that you must face.",
    tags: ["RPG", "Horror", "Story Rich", "Psychological"],
    achievements: { done: 31, total: 47 },
  },
  {
    id: "dave",
    title: "DAVE THE DIVER",
    genre: "Adventure",
    hours: 17,
    lastPlayed: "4 months ago",
    gradient: "from-[#001a33] via-[#002a4a] to-[#004080]",
    accentColor: "#00aaff",
    description: "A casual single-player adventure RPG featuring diving in the mysterious Blue Hole and running a sushi restaurant. Dive during the day, manage your restaurant at night.",
    tags: ["Casual", "Adventure", "Singleplayer", "Funny"],
    achievements: { done: 19, total: 45 },
  },
  {
    id: "spiritfarer",
    title: "Spiritfarer",
    genre: "Management",
    hours: 34,
    lastPlayed: "5 months ago",
    gradient: "from-[#1a1a3a] via-[#2a1a4a] to-[#3a2a5a]",
    accentColor: "#f0a050",
    description: "A cozy management game about dying. You play Stella, ferrymaster to the deceased, a Spiritfarer. Build a boat to explore the world, and befriend spirits before guiding them to the afterlife.",
    tags: ["Management", "Co-op", "Story Rich", "Emotional"],
    achievements: { done: 28, total: 35 },
  },
];

type Tab = "library" | "recent" | "favorites";

const FAVORITES = ["genshin", "stardew", "hades"];

export default function SteamWindow() {
  const [activeTab, setActiveTab] = useState<Tab>("library");
  const [selected, setSelected] = useState<Game>(GAMES[0]);
  const [search, setSearch] = useState("");

  const visibleGames = GAMES.filter(g => {
    if (search.trim()) return g.title.toLowerCase().includes(search.toLowerCase());
    if (activeTab === "recent") return [...GAMES].sort((a, b) => b.hours - a.hours).slice(0, 5).some(r => r.id === g.id);
    if (activeTab === "favorites") return FAVORITES.includes(g.id);
    return true;
  });

  const totalHours = GAMES.reduce((sum, g) => sum + g.hours, 0);

  return (
    <div className="flex h-full overflow-hidden" style={{ background: "#1b2838", fontFamily: "system-ui, sans-serif" }}>

      {/* Sidebar */}
      <div className="flex flex-col shrink-0 overflow-hidden" style={{ width: 220, background: "#171a21", borderRight: "1px solid #2a475e" }}>

        {/* Profile strip */}
        <div className="flex items-center gap-2 px-3 py-3" style={{ borderBottom: "1px solid #2a475e" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ background: "linear-gradient(135deg, #66c0f4, #1b6fa8)", color: "#fff" }}>
            K
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold truncate" style={{ color: "#c6d4df" }}>keysa</p>
            <p className="text-[10px]" style={{ color: "#66c0f4" }}>Online</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col gap-px px-2 pt-3 pb-1">
          {([["library", "Library"], ["recent", "Recent"], ["favorites", "Favorites"]] as [Tab, string][]).map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="flex items-center gap-2 px-3 py-2 rounded text-[12px] text-left transition-colors"
              style={activeTab === tab
                ? { background: "#2a475e", color: "#c6d4df" }
                : { color: "#8f98a0", background: "transparent" }}
            >
              {tab === "library" && <LibraryIcon />}
              {tab === "recent" && <RecentIcon />}
              {tab === "favorites" && <HeartIcon />}
              {label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="mx-3 my-2" style={{ height: 1, background: "#2a475e" }} />

        {/* Search */}
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded" style={{ background: "#316282" }}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="#8f98a0" strokeWidth="1.5"/>
              <path d="M10.5 10.5L14 14" stroke="#8f98a0" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent outline-none text-[11px] min-w-0"
              style={{ color: "#c6d4df", caretColor: "#66c0f4" }}
            />
          </div>
        </div>

        {/* Game list */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#2a475e transparent" }}>
          {visibleGames.map(game => (
            <button
              key={game.id}
              type="button"
              onClick={() => setSelected(game)}
              className="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors"
              style={selected.id === game.id
                ? { background: "#2a475e" }
                : { background: "transparent" }}
            >
              <div className={`w-7 h-7 rounded shrink-0 bg-gradient-to-br ${game.gradient} flex items-center justify-center`}>
                <span className="text-[9px] font-bold" style={{ color: game.accentColor }}>
                  {game.title.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <span
                className="text-[11.5px] truncate"
                style={{ color: selected.id === game.id ? "#c6d4df" : "#8f98a0" }}
              >
                {game.title}
              </span>
            </button>
          ))}
          {visibleGames.length === 0 && (
            <p className="text-center py-8 text-[11px]" style={{ color: "#4a6275" }}>No games found</p>
          )}
        </div>

        {/* Stats */}
        <div className="px-3 py-3" style={{ borderTop: "1px solid #2a475e" }}>
          <p className="text-[10px]" style={{ color: "#4a6275" }}>
            {GAMES.length} games · {totalHours.toLocaleString()} hrs total
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Game hero banner */}
        <div className={`relative shrink-0 bg-gradient-to-br ${selected.gradient}`} style={{ height: 180 }}>
          <div className="absolute inset-0 flex flex-col justify-end p-5"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }}>
            <p className="text-[10px] font-medium mb-1 uppercase tracking-widest" style={{ color: selected.accentColor }}>
              {selected.genre}
            </p>
            <h2 className="text-[22px] font-bold text-white leading-tight">{selected.title}</h2>
          </div>
          {/* Decorative pattern */}
          <div className="absolute top-4 right-6 opacity-10">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" stroke="white" strokeWidth="2"/>
              <circle cx="40" cy="40" r="24" stroke="white" strokeWidth="2"/>
              <line x1="40" y1="2" x2="40" y2="78" stroke="white" strokeWidth="1.5"/>
              <line x1="2" y1="40" x2="78" y2="40" stroke="white" strokeWidth="1.5"/>
            </svg>
          </div>
        </div>

        {/* Game detail body */}
        <div className="flex-1 overflow-y-auto p-5" style={{ background: "#1b2838" }}>
          {/* Stats row */}
          <div className="flex gap-4 mb-4">
            {[
              { label: "Hours Played", value: `${selected.hours.toLocaleString()} hrs` },
              { label: "Last Played", value: selected.lastPlayed },
              ...(selected.achievements ? [{ label: "Achievements", value: `${selected.achievements.done} / ${selected.achievements.total}` }] : []),
            ].map(stat => (
              <div key={stat.label} className="px-4 py-3 rounded" style={{ background: "#16202d" }}>
                <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "#4a6275" }}>{stat.label}</p>
                <p className="text-[14px] font-semibold" style={{ color: "#c6d4df" }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Achievement bar */}
          {selected.achievements && (
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-[10px] uppercase tracking-wider" style={{ color: "#4a6275" }}>Achievement Progress</span>
                <span className="text-[10px]" style={{ color: "#66c0f4" }}>
                  {Math.round((selected.achievements.done / selected.achievements.total) * 100)}%
                </span>
              </div>
              <div className="rounded-full overflow-hidden" style={{ background: "#16202d", height: 6 }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(selected.achievements.done / selected.achievements.total) * 100}%`,
                    background: "linear-gradient(to right, #1b6fa8, #66c0f4)",
                  }}
                />
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-[12.5px] leading-relaxed mb-4" style={{ color: "#8f98a0" }}>
            {selected.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {selected.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 rounded text-[11px]"
                style={{ background: "#2a475e", color: "#66c0f4" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="shrink-0 flex items-center gap-3 px-5 py-3" style={{ background: "#16202d", borderTop: "1px solid #2a475e" }}>
          <button
            type="button"
            className="px-5 py-2 rounded text-[12px] font-semibold transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(to bottom, #76b553, #4c7a34)", color: "#fff" }}
          >
            ▶ Play
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded text-[12px] transition-colors"
            style={{ background: "#2a475e", color: "#8f98a0" }}
          >
            Store Page
          </button>
          <span className="flex-1" />
          <span className="text-[11px]" style={{ color: "#4a6275" }}>
            {selected.hours} hrs on record
          </span>
        </div>
      </div>
    </div>
  );
}

function LibraryIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
    </svg>
  );
}

function RecentIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );
}

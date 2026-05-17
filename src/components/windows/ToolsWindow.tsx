"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { WindowId } from "@/types";

type Category = "All" | "About" | "Developer Tools" | "Entertainment" | "Social";

const CATEGORIES: Category[] = ["All", "About", "Developer Tools", "Entertainment", "Social"];

const APPS: { id: WindowId; label: string; img: string; category: Category }[] = [
  { id: "notes",      label: "About Me",    img: "/dock/notes.png",      category: "About"           },
  { id: "resume",     label: "Resume",      img: "/dock/resume.png",     category: "About"           },
  { id: "projects",   label: "Projects",    img: "/dock/projects.png",   category: "Developer Tools" },
  { id: "terminal",   label: "Terminal",    img: "/dock/terminal.png",   category: "Developer Tools" },
  { id: "links",      label: "Safari",      img: "/dock/safari.png",     category: "Developer Tools" },
  { id: "music",      label: "Music",       img: "/dock/music.png",      category: "Entertainment"   },
  { id: "photo",      label: "Photos",      img: "/dock/photos.png",     category: "Entertainment"   },
  { id: "books",      label: "Books",       img: "/dock/books.png",      category: "Entertainment"   },
  { id: "photobooth", label: "Photo Booth", img: "/dock/photobooth.png", category: "Entertainment"   },
  { id: "messages",   label: "Messages",    img: "/dock/messages.png",   category: "Social"          },
  { id: "steam",      label: "Steam",       img: "/dock/steam.png",      category: "Entertainment"   },
];

interface ToolsWindowProps {
  onOpen: (id: WindowId) => void;
}

export default function ToolsWindow({ onOpen }: ToolsWindowProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filtered = APPS.filter(a => {
    const matchesQuery = query.trim() === "" || a.label.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeCategory === "All" || a.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full" style={{ background: "#e8e5e0" }}>

      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-5 pt-4 pb-1">
        <h1 className="text-[20px] font-bold tracking-tight" style={{ color: "#1d1d1f" }}>
          Applications
        </h1>
        <button
          type="button"
          className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-black/10"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#888">
            <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
          </svg>
        </button>
      </div>

      {/* Search bar */}
      <div className="shrink-0 px-5 py-2">
        <div
          className="flex items-center gap-2 px-3 py-[7px] rounded-[10px]"
          style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="#999" strokeWidth="1.5"/>
            <path d="M10.5 10.5L14 14" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search apps…"
            className="flex-1 bg-transparent outline-none text-[13px]"
            style={{ color: "#1d1d1f", caretColor: "#1d1d1f" }}
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="text-[#999] hover:text-[#666]">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 7.07L13.07 2 14 2.93 8.93 8 14 13.07 13.07 14 8 8.93 2.93 14 2 13.07 7.07 8 2 2.93 2.93 2z"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category pills */}
      <div className="shrink-0 flex gap-2 px-5 pb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className="shrink-0 px-[14px] py-[5px] rounded-full text-[12px] font-medium transition-all"
            style={
              activeCategory === cat
                ? { background: "#1d1d1f", color: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }
                : { background: "rgba(255,255,255,0.55)", color: "#444", border: "1px solid rgba(0,0,0,0.1)" }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="shrink-0 mx-5 mb-4" style={{ height: 1, background: "rgba(0,0,0,0.1)" }} />

      {/* App grid */}
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <div
          className="grid gap-y-7 gap-x-2"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))" }}
        >
          {filtered.map((app, i) => (
            <motion.button
              key={app.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 24 }}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => onOpen(app.id)}
              className="flex flex-col items-center gap-[10px] cursor-pointer select-none"
              style={{ background: "none", border: "none" }}
            >
              <img
                src={app.img}
                alt={app.label}
                className="w-[76px] h-[76px] object-contain"
                style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.18))" }}
              />
              <span
                className="text-center leading-snug text-[11.5px] font-medium"
                style={{ color: "#1d1d1f", maxWidth: 84, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {app.label}
              </span>
            </motion.button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center mt-12 text-[13px]" style={{ color: "#999" }}>
            No apps found for &ldquo;{query}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}

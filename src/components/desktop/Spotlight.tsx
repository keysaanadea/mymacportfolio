"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects, socialLinks } from "@/data/portfolio";
import type { WindowId } from "@/types";

type Result = {
  id: string;
  label: string;
  sub: string;
  icon: string;
  action: WindowId | null;
  href?: string;
};

const WINDOWS: Result[] = [
  { id: "w-photo",     label: "Photos",          sub: "Window",   icon: "📷", action: "photo" },
  { id: "w-notes",     label: "About Me",         sub: "Window",   icon: "📋", action: "notes" },
  { id: "w-projects",  label: "Projects",         sub: "Window",   icon: "💻", action: "projects" },
  { id: "w-terminal",  label: "Terminal",         sub: "Window",   icon: "⌨️", action: "terminal" },
  { id: "w-resume",    label: "Resume / CV",      sub: "Window",   icon: "📄", action: "resume" },
  { id: "w-music",     label: "Music",            sub: "Window",   icon: "🎵", action: "music" },
  { id: "w-links",     label: "Links & Social",   sub: "Window",   icon: "🔗", action: "links" },
  { id: "w-tools",     label: "Tools & Tech",     sub: "Window",   icon: "🚀", action: "tools" },
  { id: "w-books",     label: "Books",            sub: "Window",   icon: "📚", action: "books" },
  { id: "w-messages",  label: "Messages",         sub: "Window",   icon: "💬", action: "messages" },
  { id: "w-photobooth",label: "Photo Booth",      sub: "Window",   icon: "📸", action: "photobooth" },
];

const PROJECT_RESULTS: Result[] = projects.map(p => ({
  id: `p-${p.id}`,
  label: p.name,
  sub: p.tech.slice(0, 3).join(" · "),
  icon: p.icon,
  action: "projects",
}));

const SOCIAL_RESULTS: Result[] = socialLinks.map(l => ({
  id: `s-${l.id}`,
  label: l.name,
  sub: l.handle,
  icon: l.id === "github" ? "⌨️" : l.id === "linkedin" ? "💼" : l.id === "twitter" ? "🐦" : l.id === "email" ? "✉️" : "🔗",
  action: null,
  href: l.url,
}));

const ALL: Result[] = [...WINDOWS, ...PROJECT_RESULTS, ...SOCIAL_RESULTS];

function score(r: Result, q: string): number {
  const s = q.toLowerCase();
  const label = r.label.toLowerCase();
  const sub   = r.sub.toLowerCase();
  if (label.startsWith(s))   return 3;
  if (label.includes(s))     return 2;
  if (sub.includes(s))       return 1;
  return 0;
}

interface SpotlightProps {
  onOpen: (id: WindowId) => void;
}

export default function Spotlight({ onOpen }: SpotlightProps) {
  const [open,    setOpen]    = useState(false);
  const [query,   setQuery]   = useState("");
  const [cursor,  setCursor]  = useState(0);
  const inputRef  = useRef<HTMLInputElement>(null);

  const results: Result[] = query.trim()
    ? ALL.map(r => ({ r, s: score(r, query) })).filter(x => x.s > 0).sort((a, b) => b.s - a.s).map(x => x.r)
    : WINDOWS.slice(0, 6);

  /* ⌘K to toggle */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(o => !o);
        setQuery("");
        setCursor(0);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* focus input on open */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  const select = useCallback((r: Result) => {
    setOpen(false);
    setQuery("");
    if (r.href) { window.open(r.href, "_blank"); return; }
    if (r.action) onOpen(r.action);
  }, [onOpen]);

  /* keyboard nav */
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor(c => Math.min(c + 1, results.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
    if (e.key === "Enter" && results[cursor]) select(results[cursor]);
  };

  return (
    <>
      {/* Hint in TopBar area — shown always */}
      <div
        className="fixed top-0 right-[200px] z-[9999] flex items-center h-7 cursor-pointer select-none"
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 60); }}
      />

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[10000]"
              style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed left-1/2 z-[10001] overflow-hidden"
              style={{
                top: "18%",
                width: 580,
                transform: "translateX(-50%)",
                borderRadius: 14,
                background: "rgba(28,28,32,0.92)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(0,0,0,0.6)",
                backdropFilter: "blur(32px)",
              }}
              initial={{ opacity: 0, scale: 0.95, y: -12 }}
              animate={{ opacity: 1, scale: 1,    y: 0 }}
              exit={{ opacity: 0,   scale: 0.95,  y: -12 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: results.length ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="6.5" cy="6.5" r="5" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
                  <path d="M10.5 10.5L14 14" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => { setQuery(e.target.value); setCursor(0); }}
                  onKeyDown={onKey}
                  placeholder="Search windows, projects, links…"
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: 16, color: "rgba(255,255,255,0.88)", caretColor: "#fff" }}
                />
                {query && (
                  <button onClick={() => setQuery("")} style={{ color: "rgba(255,255,255,0.35)", background: "none", border: "none", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
                )}
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>esc</span>
              </div>

              {/* Results */}
              {results.length > 0 && (
                <div className="max-h-[320px] overflow-y-auto py-1">
                  {results.map((r, i) => (
                    <button
                      key={r.id}
                      onClick={() => select(r)}
                      onMouseEnter={() => setCursor(i)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                      style={{
                        background: i === cursor ? "rgba(99,102,241,0.2)" : "transparent",
                        border: "none", cursor: "pointer",
                      }}
                    >
                      <span className="text-lg flex-shrink-0 w-7 text-center">{r.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "rgba(255,255,255,0.88)" }}>{r.label}</p>
                        <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{r.sub}</p>
                      </div>
                      {i === cursor && (
                        <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>↵</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {query && results.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>No results for "{query}"</p>
                </div>
              )}

              {/* Footer hint */}
              <div className="px-4 py-2 flex items-center gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>↑↓ navigate</span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>↵ open</span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>esc close</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

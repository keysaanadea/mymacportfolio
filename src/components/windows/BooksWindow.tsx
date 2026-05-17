"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { books } from "@/data/portfolio";
import type { Book, ReadStatus } from "@/types";

type Section = "reading" | "want" | "finished" | "all";

const SECTIONS: { id: Section; label: string; icon: string }[] = [
  { id: "all",      label: "Library",       icon: "📚" },
  { id: "reading",  label: "Reading Now",   icon: "📖" },
  { id: "want",     label: "Want to Read",  icon: "🔖" },
  { id: "finished", label: "Finished",      icon: "✓"  },
];

function BookCover({ book, onClick }: { book: Book; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-2 cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cover */}
      <div
        className="relative rounded-[6px] overflow-hidden flex-shrink-0"
        style={{
          width: "100%",
          aspectRatio: "2/3",
          background: `linear-gradient(160deg, ${book.from}, ${book.to})`,
          boxShadow: hovered
            ? "0 12px 32px rgba(0,0,0,0.22), 2px 0 0 rgba(0,0,0,0.08)"
            : "0 4px 12px rgba(0,0,0,0.14), 2px 0 0 rgba(0,0,0,0.06)",
          transform: hovered ? "scale(1.04) translateY(-2px)" : "scale(1)",
          transition: "transform 0.18s ease, box-shadow 0.18s ease",
        }}
      >
        {/* Book spine highlight */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[5px]"
          style={{ background: "rgba(0,0,0,0.18)" }}
        />
        <div
          className="absolute left-0 top-0 bottom-0 w-[1px]"
          style={{ background: "rgba(255,255,255,0.15)" }}
        />
        {/* Shine */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%)" }}
        />
        {/* Genre label */}
        <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 pt-6"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)" }}>
          <p className="text-white/70 truncate" style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {book.genre}
          </p>
        </div>
        {/* Progress bar for reading */}
        {book.status === "reading" && book.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: "rgba(255,255,255,0.2)" }}>
            <div className="h-full" style={{ width: `${book.progress}%`, background: "rgba(255,255,255,0.85)" }} />
          </div>
        )}
      </div>

      {/* Meta */}
      <div>
        <p
          className="leading-tight line-clamp-2"
          style={{ fontSize: 11, fontWeight: 600, color: "#1d1d1f" }}
        >
          {book.title}
        </p>
        <p className="truncate mt-0.5" style={{ fontSize: 10, color: "#8e8e93" }}>
          {book.author}
        </p>
        {book.status === "reading" && book.progress !== undefined && (
          <p style={{ fontSize: 9, color: "#007aff", marginTop: 2, fontWeight: 500 }}>
            {book.progress}% complete
          </p>
        )}
      </div>
    </motion.div>
  );
}

function BookDetail({ book, onClose }: { book: Book; onClose: () => void }) {
  const statusLabel: Record<ReadStatus, string> = {
    reading: "Reading Now",
    want: "Want to Read",
    finished: "Finished",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col overflow-y-auto"
      style={{ background: "#fff", zIndex: 10 }}
    >
      {/* Back button */}
      <button
        onClick={onClose}
        className="flex items-center gap-1 sticky top-0 z-10 px-5 py-3 text-left"
        style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(0,0,0,0.07)", fontSize: 13, color: "#007aff", border: "none", cursor: "pointer" }}
      >
        <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
          <path d="M6 1L1 6l5 5" stroke="#007aff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        &nbsp;Library
      </button>

      {/* Detail body */}
      <div className="flex gap-6 p-6">
        {/* Cover */}
        <div
          className="flex-shrink-0 rounded-[8px] overflow-hidden"
          style={{
            width: 120, height: 180,
            background: `linear-gradient(160deg, ${book.from}, ${book.to})`,
            boxShadow: "0 12px 36px rgba(0,0,0,0.2), 3px 0 0 rgba(0,0,0,0.08)",
          }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-[6px]" style={{ background: "rgba(0,0,0,0.18)" }} />
          <div style={{ height: "100%", background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%)" }} />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <p style={{ fontSize: 18, fontWeight: 700, color: "#1d1d1f", lineHeight: 1.25 }}>{book.title}</p>
          <p style={{ fontSize: 14, color: "#007aff", fontWeight: 500, marginTop: 2 }}>{book.author}</p>
          <p style={{ fontSize: 12, color: "#8e8e93", marginTop: 1 }}>{book.genre} · {book.year}</p>

          <div className="mt-3 flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-white"
              style={{
                fontSize: 11, fontWeight: 600,
                background: book.status === "reading" ? "#007aff" : book.status === "finished" ? "#34c759" : "#ff9500",
              }}
            >
              {statusLabel[book.status]}
            </span>
          </div>

          {/* Progress */}
          {book.status === "reading" && book.progress !== undefined && (
            <div className="mt-4">
              <div className="flex justify-between mb-1" style={{ fontSize: 11, color: "#8e8e93" }}>
                <span>Progress</span>
                <span style={{ color: "#007aff", fontWeight: 600 }}>{book.progress}%</span>
              </div>
              <div className="w-full rounded-full overflow-hidden" style={{ height: 5, background: "#e5e5ea" }}>
                <div className="h-full rounded-full" style={{ width: `${book.progress}%`, background: "#007aff" }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function BooksWindow() {
  const [activeSection, setActiveSection] = useState<Section>("all");
  const [selected, setSelected] = useState<Book | null>(null);

  const counts: Record<Section, number> = {
    all:      books.length,
    reading:  books.filter(b => b.status === "reading").length,
    want:     books.filter(b => b.status === "want").length,
    finished: books.filter(b => b.status === "finished").length,
  };

  const filtered = activeSection === "all"
    ? books
    : books.filter(b => b.status === activeSection);

  return (
    <div
      className="h-full flex overflow-hidden select-none relative"
      style={{ background: "#ffffff", fontFamily: "-apple-system,BlinkMacSystemFont,sans-serif" }}
    >
      {/* ── Sidebar ─────────────────────────── */}
      <div
        className="flex flex-col flex-shrink-0 py-3"
        style={{ width: 184, background: "#f5f5f7", borderRight: "1px solid rgba(0,0,0,0.08)" }}
      >
        {/* Library header */}
        <p
          className="px-4 pb-1"
          style={{ fontSize: 11, fontWeight: 700, color: "#8e8e93", letterSpacing: "0.05em", textTransform: "uppercase" }}
        >
          Library
        </p>

        {SECTIONS.map(s => {
          const active = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className="w-full flex items-center justify-between px-4 py-[6px] text-left rounded-[8px] mx-1 transition-colors"
              style={{
                width: "calc(100% - 8px)",
                background: active ? "rgba(0,122,255,0.12)" : "transparent",
                border: "none", cursor: "pointer",
              }}
            >
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 14 }}>{s.icon}</span>
                <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "#007aff" : "#1d1d1f" }}>
                  {s.label}
                </span>
              </div>
              <span style={{ fontSize: 12, color: "#8e8e93" }}>{counts[s.id]}</span>
            </button>
          );
        })}

        {/* Divider */}
        <div className="mx-3 my-2" style={{ height: 1, background: "rgba(0,0,0,0.07)" }} />

        {/* Reading stats */}
        <div className="px-4 py-2">
          <p style={{ fontSize: 11, fontWeight: 700, color: "#8e8e93", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>
            Reading Goal
          </p>
          <div className="flex items-end gap-1 mb-1">
            <span style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", lineHeight: 1 }}>{counts.finished}</span>
            <span style={{ fontSize: 12, color: "#8e8e93", marginBottom: 2 }}>/ 12 books</span>
          </div>
          <div className="w-full rounded-full overflow-hidden mb-1" style={{ height: 5, background: "#e5e5ea" }}>
            <div className="h-full rounded-full" style={{ width: `${Math.min(100, (counts.finished / 12) * 100)}%`, background: "#34c759" }} />
          </div>
          <p style={{ fontSize: 10, color: "#8e8e93" }}>2025 goal</p>
        </div>
      </div>

      {/* ── Main content ────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1d1d1f" }}>
            {SECTIONS.find(s => s.id === activeSection)?.label}
          </h2>
          <p style={{ fontSize: 11, color: "#8e8e93", marginTop: 2 }}>
            {counts[activeSection]} {counts[activeSection] === 1 ? "book" : "books"}
          </p>
        </div>

        {/* Book grid */}
        <div className="flex-1 overflow-y-auto p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                gap: 20,
              }}
            >
              {filtered.map(book => (
                <BookCover key={book.id} book={book} onClick={() => setSelected(book)} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Book detail overlay */}
        <AnimatePresence>
          {selected && (
            <BookDetail key={selected.id} book={selected} onClose={() => setSelected(null)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

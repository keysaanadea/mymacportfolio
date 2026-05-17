"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { books, expertise, profile, projects, resumeEntries, socialLinks, terminalData } from "@/data/portfolio";

const TABS = [
  { id: "about",    label: "About",    icon: "👤" },
  { id: "projects", label: "Projects", icon: "📁" },
  { id: "books",    label: "Books",    icon: "📚" },
  { id: "resume",   label: "Resume",   icon: "📄" },
  { id: "links",    label: "Links",    icon: "🔗" },
  { id: "terminal", label: "Terminal", icon: "⌨️" },
];

const statusColors = {
  Live: { bg: "rgba(34,197,94,0.15)", text: "#22c55e" },
  WIP: { bg: "rgba(249,115,22,0.15)", text: "#f97316" },
  Personal: { bg: "rgba(139,92,246,0.15)", text: "#8b5cf6" },
};

const hobbies = ["Reading", "Running", "Pilates", "Padel"];

export default function MobileView() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div
      className="flex flex-col w-full min-h-screen"
      style={{
        background:
          "radial-gradient(circle at top, rgba(255,255,255,0.18), transparent 24%), linear-gradient(160deg, #f0f1ea 0%, #e5e6df 50%, #dfe0da 100%)",
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: "1px solid rgba(25,25,29,0.08)" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 to-slate-700 text-sm font-bold text-white shadow-[0_12px_20px_rgba(0,0,0,0.12)]">
            {profile.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold leading-none text-zinc-900/90">{profile.name}</p>
          </div>
        </div>
        <a
          href={`mailto:${profile.email}`}
          className="px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)" }}
        >
          Contact
        </a>
      </div>

      <div className="flex gap-1 px-4 py-3 shrink-0 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "text-zinc-950"
                : "text-zinc-700/50 hover:text-zinc-900/70"
            }`}
            style={
              activeTab === tab.id
                ? { background: "rgba(255,255,255,0.62)", border: "1px solid rgba(255,255,255,0.7)" }
                : { background: "rgba(255,255,255,0.24)", border: "1px solid rgba(255,255,255,0.4)" }
            }
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "about" && (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.65)", boxShadow: "0 12px 28px rgba(90,90,102,0.08)" }}>
                  <p className="text-zinc-700/55 text-xs uppercase tracking-wider font-semibold mb-2">Bio</p>
                  <p className="text-zinc-900/78 text-sm leading-relaxed">{profile.bio}</p>
                </div>
                <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.65)", boxShadow: "0 12px 28px rgba(90,90,102,0.08)" }}>
                  <p className="text-zinc-700/55 text-xs uppercase tracking-wider font-semibold mb-2">Current Interests</p>
                  <div className="space-y-2">
                    {profile.focus.map((item) => (
                      <p key={item} className="text-zinc-900/78 text-sm leading-relaxed">{item}</p>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.65)", boxShadow: "0 12px 28px rgba(90,90,102,0.08)" }}>
                  <p className="text-zinc-700/55 text-xs uppercase tracking-wider font-semibold mb-3">Hobbies</p>
                  <div className="flex flex-wrap gap-2">
                    {hobbies.map((item) => (
                      <span key={item} className="px-2 py-1 rounded-md text-xs font-medium" style={{ background: "rgba(24,24,29,0.06)", color: "rgba(39,39,42,0.82)", border: "1px solid rgba(24,24,29,0.08)" }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.65)", boxShadow: "0 12px 28px rgba(90,90,102,0.08)" }}>
                  <p className="text-zinc-700/55 text-xs uppercase tracking-wider font-semibold mb-3">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {expertise.map((s) => (
                      <span key={s} className="px-2 py-1 rounded-md text-xs font-medium" style={{ background: "rgba(251,191,36,0.12)", color: "rgba(161,98,7,0.95)", border: "1px solid rgba(251,191,36,0.2)" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="space-y-3 py-2">
                {projects.map((p) => {
                  const s = statusColors[p.status];
                  return (
                    <div key={p.id} className="p-4 rounded-2xl" style={{ background: "rgba(24,24,29,0.94)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${p.color}18`, border: `1px solid ${p.color}25` }}>
                          {p.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-white/90 font-semibold text-sm">{p.name}</p>
                            <span className="px-1.5 py-0.5 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.text }}>{p.status}</span>
                          </div>
                          <p className="text-white/45 text-xs leading-relaxed">{p.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {p.tech.slice(0, 3).map((t) => (
                              <span key={t} className="px-1.5 py-0.5 rounded text-white/35 text-xs" style={{ background: "rgba(255,255,255,0.06)" }}>{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "links" && (
              <div className="space-y-3 py-2">
                {socialLinks.map((link) => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.65)", boxShadow: "0 12px 28px rgba(90,90,102,0.08)" }}>
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center text-white text-xl`}>
                      {link.icon === "github" ? "⌨️" : link.icon === "linkedin" ? "💼" : link.icon === "twitter" ? "🐦" : link.icon === "send" ? "✈️" : link.icon === "youtube" ? "▶️" : "✉️"}
                    </div>
                    <div>
                      <p className="text-zinc-900/85 font-medium text-sm">{link.name}</p>
                      <p className="text-zinc-700/50 text-xs">{link.handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {activeTab === "books" && (
              <div className="space-y-3 py-2">
                {(["reading", "finished", "want"] as const).map((status) => {
                  const filtered = books.filter((b) => b.status === status);
                  if (!filtered.length) return null;
                  const label = status === "reading" ? "Currently Reading" : status === "finished" ? "Finished" : "Want to Read";
                  const color = status === "reading" ? "#6366f1" : status === "finished" ? "#10b981" : "#f97316";
                  return (
                    <div key={status}>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-1" style={{ color }}>{label}</p>
                      <div className="space-y-2">
                        {filtered.map((b) => (
                          <div key={b.id} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.65)", boxShadow: "0 8px 20px rgba(90,90,102,0.07)" }}>
                            <div className="w-10 h-14 rounded-md flex-shrink-0" style={{ background: `linear-gradient(135deg, ${b.from}, ${b.to})` }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-zinc-900/85 font-semibold text-sm leading-tight truncate">{b.title}</p>
                              <p className="text-zinc-700/55 text-xs mt-0.5">{b.author}</p>
                              {b.progress !== undefined && (
                                <div className="mt-1.5">
                                  <div className="h-1 rounded-full bg-zinc-200 overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${b.progress}%`, background: color }} />
                                  </div>
                                  <p className="text-zinc-500/70 text-xs mt-0.5">{b.progress}%</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "resume" && (
              <div className="space-y-3 py-2">
                {resumeEntries.map((entry) => (
                  <div key={entry.id} className="p-4 rounded-2xl" style={{ background: "rgba(24,24,29,0.94)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl text-base flex-shrink-0" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}>
                        📄
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/90 font-semibold text-sm leading-tight">{entry.label}</p>
                        <p className="text-white/35 text-xs mt-0.5">{entry.description}</p>
                      </div>
                    </div>
                    <a
                      href={entry.download}
                      download
                      className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-medium"
                      style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)" }}
                    >
                      ↓ Download PDF
                    </a>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "terminal" && (
              <div className="py-2">
                <div className="rounded-2xl overflow-hidden font-mono" style={{ background: "rgba(10,10,12,0.97)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="px-4 py-2 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="w-2.5 h-2.5 rounded-full bg-mac-red" />
                    <div className="w-2.5 h-2.5 rounded-full bg-mac-yellow" />
                    <div className="w-2.5 h-2.5 rounded-full bg-mac-green" />
                    <span className="text-white/30 text-xs ml-2">terminal</span>
                  </div>
                  <div className="p-4 space-y-4">
                    {(["whoami", "skills", "tech"] as const).map((cmd) => (
                      <div key={cmd}>
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="text-green-400 text-xs">❯</span>
                          <span className="text-white/70 text-xs">{cmd}</span>
                        </div>
                        <pre className="text-white/50 text-xs whitespace-pre-wrap leading-relaxed">{terminalData[cmd]}</pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Clock3, Download, FolderOpen, House, Tag } from "lucide-react";
import type { WindowId } from "@/types";

type FinderSection = "recents" | "favorites" | "locations" | "tags";

interface FinderWindowProps {
  onOpen: (id: WindowId) => void;
}

type FinderItem = {
  id: string;
  label: string;
  target: WindowId;
  size: string;
  kind: string;
  updated: string;
  accent: string;
  note: string;
  section: FinderSection;
};

const sidebarGroups: {
  title: string;
  items: { id: FinderSection; label: string; icon: React.ComponentType<{ className?: string }>; accent?: string }[];
}[] = [
  {
    title: "",
    items: [{ id: "recents", label: "Recents", icon: Clock3 }],
  },
  {
    title: "Favorites",
    items: [{ id: "favorites", label: "Recruiter Kit", icon: Download, accent: "#ff4fa3" }],
  },
  {
    title: "Locations",
    items: [{ id: "locations", label: "Documents", icon: FolderOpen }],
  },
  {
    title: "Tags",
    items: [{ id: "tags", label: "Highlights", icon: Tag, accent: "#ff453a" }],
  },
];

const finderItems: FinderItem[] = [
  {
    id: "notes",
    label: "About Me.note",
    target: "notes",
    size: "Quick read",
    kind: "Note",
    updated: "Start with my background",
    accent: "#ffd24f",
    note: "Bio, education, availability, and core strengths.",
    section: "favorites",
  },
  {
    id: "projects",
    label: "Projects.folder",
    target: "projects",
    size: "Featured work",
    kind: "Folder",
    updated: "Best technical work",
    accent: "#8b5cf6",
    note: "Open this to review product thinking, AI work, and shipped builds.",
    section: "favorites",
  },
  {
    id: "resume",
    label: "Resume.pdf",
    target: "resume",
    size: "Download ready",
    kind: "PDF document",
    updated: "ATS + portfolio CV",
    accent: "#3b82f6",
    note: "Includes resume versions tailored for quick recruiter review.",
    section: "favorites",
  },
  {
    id: "links",
    label: "Links.webloc",
    target: "links",
    size: "External profiles",
    kind: "Web link",
    updated: "Contact & socials",
    accent: "#0ea5e9",
    note: "LinkedIn, GitHub, WhatsApp, and email in one place.",
    section: "favorites",
  },
  {
    id: "terminal",
    label: "Skills.terminal",
    target: "terminal",
    size: "CLI overview",
    kind: "Terminal view",
    updated: "Fast technical summary",
    accent: "#1f2937",
    note: "A compact command-line snapshot of skills, experience, and tools.",
    section: "favorites",
  },
  {
    id: "photo",
    label: "Photos.library",
    target: "photo",
    size: "Visual moments",
    kind: "Photo library",
    updated: "Selected moments",
    accent: "#f97316",
    note: "A more personal side of the portfolio, organized like a gallery.",
    section: "recents",
  },
  {
    id: "books",
    label: "Books.collection",
    target: "books",
    size: "Reading list",
    kind: "Collection",
    updated: "Books & learning",
    accent: "#f59e0b",
    note: "Current reading and books that shape how I build and learn.",
    section: "locations",
  },
  {
    id: "music",
    label: "Now Playing.music",
    target: "music",
    size: "Playlist",
    kind: "Audio",
    updated: "Personal touch",
    accent: "#ef4444",
    note: "A lighter window that makes the desktop experience feel alive.",
    section: "tags",
  },
];

function ToolbarIcon({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-10 w-10 items-center justify-center rounded-xl text-[#5d6069] transition hover:bg-black/[0.04]"
    >
      {children}
    </button>
  );
}

function FinderFileIcon({ kind, accent }: { kind: string; accent: string }) {
  if (kind === "Folder" || kind === "Collection" || kind === "Photo library") {
    return (
      <img
        src="/dock/folder.png"
        alt=""
        className="h-8 w-10 object-contain"
        draggable={false}
      />
    );
  }

  if (kind === "PDF document" || kind === "Note") {
    return (
      <svg viewBox="0 0 40 48" className="h-8 w-7" aria-hidden="true">
        <path d="M8 2h16l10 10v30a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4Z" fill="#ffffff" stroke="#d8dce4" strokeWidth="1.5" />
        <path d="M24 2v10h10" fill="#eef1f6" />
        <path d="M24 2v10h10" stroke="#d8dce4" strokeWidth="1.5" strokeLinejoin="round" />
        {kind === "PDF document" ? (
          <>
            <rect x="8" y="26" width="20" height="8" rx="4" fill="#ef4444" />
            <text x="18" y="32" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#fff">PDF</text>
          </>
        ) : (
          <>
            <path d="M10 20h18M10 25h16M10 30h14" stroke="#b4bbc8" strokeWidth="1.7" strokeLinecap="round" />
            <rect x="10" y="8" width="18" height="5" rx="2.5" fill="#ffd24f" />
          </>
        )}
      </svg>
    );
  }

  if (kind === "Web link") {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8" aria-hidden="true">
        <rect x="5" y="5" width="38" height="38" rx="10" fill="#ffffff" stroke="#dce4ee" strokeWidth="1.5" />
        <path d="M19 29l-3 3a5 5 0 0 1-7-7l6-6a5 5 0 0 1 7 0" fill="none" stroke="#7aa7d9" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M29 19l3-3a5 5 0 1 1 7 7l-6 6a5 5 0 0 1-7 0" fill="none" stroke="#7aa7d9" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M18 30l12-12" stroke="#7aa7d9" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "Terminal view") {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8" aria-hidden="true">
        <rect x="6" y="6" width="36" height="36" rx="9" fill="#1f2025" />
        <path d="M15 18l6 6-6 6" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M25 30h8" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "Photo library") {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8" aria-hidden="true">
        <rect x="5" y="5" width="38" height="38" rx="10" fill="#ffffff" stroke="#f0d2c7" strokeWidth="1.5" />
        {["#ff5f57", "#ffbd2e", "#28c840", "#0a84ff", "#af52de", "#ff375f"].map((color, index) => {
          const angle = index * 60;
          return (
            <path
              key={color}
              d="M24 24L24 10A14 14 0 0 1 36.1 17z"
              fill={color}
              transform={`rotate(${angle} 24 24)`}
            />
          );
        })}
        <circle cx="24" cy="24" r="5.5" fill="#fff" />
      </svg>
    );
  }

  if (kind === "Collection") {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8" aria-hidden="true">
        <rect x="8" y="7" width="9" height="34" rx="2.5" fill="#ff8c42" />
        <rect x="17" y="7" width="9" height="34" rx="2.5" fill="#f97316" />
        <rect x="26" y="7" width="14" height="34" rx="3" fill="#ffb54d" />
      </svg>
    );
  }

  if (kind === "Audio") {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8" aria-hidden="true">
        <rect x="5" y="5" width="38" height="38" rx="10" fill="#fff" stroke="#f1d1d8" strokeWidth="1.5" />
        <path d="M20 16v14.5a4.5 4.5 0 1 1-2-3.73V19l12-2v11.5a4.5 4.5 0 1 1-2-3.73V14z" fill="#ef4444" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 40 48" className="h-8 w-7" aria-hidden="true">
      <path d="M8 2h16l10 10v30a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4Z" fill="#ffffff" stroke="#d8dce4" strokeWidth="1.5" />
      <path d="M24 2v10h10" fill="#eef1f6" stroke="#d8dce4" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export default function FinderWindow({ onOpen }: FinderWindowProps) {
  const [activeSection, setActiveSection] = useState<FinderSection>("favorites");
  const [selectedId, setSelectedId] = useState("notes");

  const visibleItems = useMemo(() => {
    if (activeSection === "favorites") return finderItems.filter((item) => item.section === "favorites");
    if (activeSection === "recents") return finderItems.slice(0, 6);
    if (activeSection === "locations") return finderItems.filter((item) => item.section === "locations" || item.section === "favorites");
    return finderItems.filter((item) => item.section === "tags");
  }, [activeSection]);

  const selectedItem =
    visibleItems.find((item) => item.id === selectedId) ??
    visibleItems[0] ??
    finderItems[0];

  return (
    <div className="flex h-full flex-col bg-[#f7f7f4] text-[#37383d]">
      <div
        className="flex items-center justify-between gap-3 border-b border-black/[0.07] px-4 py-3"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244,244,241,0.96))",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center overflow-hidden rounded-[18px] border border-black/[0.05] bg-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
            <ToolbarIcon>
              <span className="text-2xl leading-none">‹</span>
            </ToolbarIcon>
            <div className="h-7 w-px bg-black/[0.08]" />
            <ToolbarIcon>
              <span className="text-2xl leading-none text-black/30">›</span>
            </ToolbarIcon>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888b94]">
              Finder
            </p>
            <h2 className="text-[19px] font-semibold text-[#44464d]">Recruiter Kit</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center overflow-hidden rounded-[18px] border border-black/[0.05] bg-white/88 shadow-[0_8px_20px_rgba(0,0,0,0.03)]">
            {["⊞", "☰", "▥", "▤"].map((icon) => (
              <ToolbarIcon key={icon}>
                <span className="text-[18px]">{icon}</span>
              </ToolbarIcon>
            ))}
          </div>
          <div className="flex items-center gap-2 overflow-hidden rounded-[18px] border border-black/[0.05] bg-white/88 px-3 py-2 text-sm text-[#7a7d86] shadow-[0_8px_20px_rgba(0,0,0,0.03)]">
            <span className="text-lg">⌕</span>
            <span>Search</span>
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[260px_minmax(0,1fr)]">
        <aside
          className="overflow-y-auto border-r border-black/[0.07] px-5 py-5"
          style={{
            background:
              "linear-gradient(180deg, rgba(246,246,244,0.98), rgba(239,239,236,0.92))",
          }}
        >
          {sidebarGroups.map((group) => (
            <div key={group.title || group.items[0].id} className="mb-6 last:mb-0">
              {group.title ? (
                <p className="mb-2 px-3 text-[12px] font-semibold text-[#8d9098]">{group.title}</p>
              ) : null}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = item.id === activeSection;
                  const SidebarIcon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveSection(item.id)}
                      className="flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left transition"
                      style={{
                        background: active ? "rgba(255,255,255,0.88)" : "transparent",
                        boxShadow: active ? "0 10px 24px rgba(0,0,0,0.04)" : "none",
                      }}
                    >
                      <span
                        className="flex h-7 w-7 items-center justify-center"
                        style={{ color: active ? item.accent ?? "#30323a" : "#30323a" }}
                      >
                        <SidebarIcon className="h-[22px] w-[22px] stroke-[2.1]" />
                      </span>
                      <span
                        className="text-[15px] font-medium"
                        style={{ color: active ? item.accent ?? "#30323a" : "#30323a" }}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto]">
          <div className="grid grid-cols-[minmax(0,1.6fr)_180px_220px_220px] border-b border-black/[0.07] px-5 py-3 text-[12px] font-medium text-[#8a8d95]">
            <div>Name</div>
            <div>Preview</div>
            <div>Kind</div>
            <div>Best For</div>
          </div>

          <div className="overflow-y-auto px-4 py-3">
            <div className="space-y-1">
              {visibleItems.map((item) => {
                const isSelected = item.id === selectedItem.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    onDoubleClick={() => onOpen(item.target)}
                    className="grid w-full grid-cols-[minmax(0,1.6fr)_180px_220px_220px] items-center rounded-[14px] px-3 py-3 text-left transition"
                    style={{
                      background: isSelected ? "linear-gradient(180deg, rgba(237,240,248,0.96), rgba(229,233,244,0.96))" : "transparent",
                    }}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="flex h-10 w-10 items-center justify-center"
                      >
                        <FinderFileIcon kind={item.kind} accent={item.accent} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-medium text-[#33353b]">{item.label}</p>
                        <p className="truncate text-[12px] text-[#8a8d95]">{item.note}</p>
                      </div>
                    </div>
                    <div className="text-[14px] text-[#7e828a]">{item.size}</div>
                    <div className="text-[14px] text-[#7e828a]">{item.kind}</div>
                    <div className="text-[14px] text-[#7e828a]">{item.updated}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-black/[0.07] px-5 py-4">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b8e96]">
                Selected Item
              </p>
              <p className="mt-1 text-[16px] font-semibold text-[#3a3c43]">{selectedItem.label}</p>
              <p className="mt-1 max-w-2xl text-[13px] leading-6 text-[#737780]">
                {selectedItem.note}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpen(selectedItem.target)}
              className="shrink-0 rounded-[16px] bg-[#e9edf6] px-5 py-3 text-[14px] font-semibold text-[#44506b] transition hover:bg-[#dde5f4]"
            >
              Open
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

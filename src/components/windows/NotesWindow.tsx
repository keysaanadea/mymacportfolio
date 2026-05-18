"use client";

import { useState } from "react";
import { committeeExperience, expertise, profile } from "@/data/portfolio";
import type { WindowId } from "@/types";

const NOTES = [
  { id: "about",  label: "About Me" },
  { id: "skills", label: "Skills" },
  { id: "orgs",   label: "Experience" },
];

const hobbies = ["Reading", "Running", "Pilates", "Padel"];

interface NotesWindowProps {
  onOpen?: (id: WindowId) => void;
}

export default function NotesWindow({ onOpen }: NotesWindowProps) {
  const [active, setActive] = useState("about");

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div
        className="flex h-full w-40 shrink-0 flex-col gap-1 px-2 py-3"
        style={{
          background: "rgba(23,23,27,0.95)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p className="text-white/30 text-xs font-semibold uppercase tracking-wider px-2 mb-1">iCloud</p>
        {NOTES.map(n => (
          <button
            key={n.id}
            onClick={() => setActive(n.id)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-left w-full transition-colors"
            style={{
              background: active === n.id ? "rgba(255,255,255,0.08)" : "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span
              className="text-xs font-medium"
              style={{ color: active === n.id ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.38)" }}
            >
              {n.label}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5" style={{ background: "rgba(255,255,248,0.03)" }}>
        <p className="text-white/30 text-xs text-center mb-4">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>

        {/* ── About Me ── */}
        {active === "about" && (
          <div className="space-y-4 text-sm">
            <div>
              <h2 className="text-white text-xl font-bold">{profile.name}</h2>
            </div>
            <div className="h-px bg-white/8" />
            <div>
              <p className="text-white/30 text-xs uppercase tracking-wider font-semibold mb-1.5">About</p>
              <p className="text-white/75 leading-relaxed">{profile.bio}</p>
            </div>
            <div className="h-px bg-white/8" />
            <div>
              <p className="text-white/30 text-xs uppercase tracking-wider font-semibold mb-1.5">Location</p>
              <p className="text-white/70">{profile.location}</p>
            </div>
            <div className="h-px bg-white/8" />
            <div>
              <p className="text-white/30 text-xs uppercase tracking-wider font-semibold mb-1.5">Availability</p>
              <p className="text-white/70 leading-relaxed">{profile.availability}</p>
            </div>
            <div className="h-px bg-white/8" />
            <div>
              <p className="text-white/30 text-xs uppercase tracking-wider font-semibold mb-1.5">Current Interests</p>
              <div className="space-y-1.5">
                {profile.focus.map((item) => (
                  <p key={item} className="text-white/70 leading-relaxed">
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="h-px bg-white/8" />
            <div>
              <p className="text-white/30 text-xs uppercase tracking-wider font-semibold mb-1.5">Hobbies</p>
              <div className="flex flex-wrap gap-2">
                {hobbies.map((item) => (
                  <span
                    key={item}
                    className="px-2 py-1 rounded-md text-xs font-medium"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.72)" }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="h-px bg-white/8" />
            <div>
              <p className="text-white/30 text-xs uppercase tracking-wider font-semibold mb-1.5">Education</p>
              <div className="space-y-1">
                <p className="text-white/75 font-medium">Institut Teknologi Sepuluh Nopember (ITS)</p>
                <p className="text-white/40 text-xs">S.Kom · Informatics Engineering · GPA 3.74 / 4.00</p>
                <p className="text-white/30 text-xs">Aug 2021 to Aug 2025 · Surabaya, East Java</p>
              </div>
              <div className="space-y-1 mt-2">
                <p className="text-white/75 font-medium">Bangkit Academy 2024</p>
                <p className="text-white/40 text-xs">Machine Learning Path · Google, GoTo, Traveloka</p>
                <p className="text-white/30 text-xs">Feb to Jul 2024</p>
              </div>
            </div>
            <div className="h-px bg-white/8" />
            <div>
              <p className="text-white/30 text-xs uppercase tracking-wider font-semibold mb-1.5">Achievement</p>
              <div className="flex items-start gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.18)" }}>
                <div>
                  <p className="text-yellow-400/90 text-xs font-semibold">Top 3 Best Participant, LKMM-TM ITS 2023</p>
                  <p className="text-white/35 text-xs">Intermediate Level Student Management Training · Aug to Sep 2023</p>
                </div>
              </div>
            </div>
            <div className="h-px bg-white/8" />
            <div>
              <p className="text-white/30 text-xs uppercase tracking-wider font-semibold mb-1.5">Contact</p>
              <button
                type="button"
                onClick={() => onOpen?.("links")}
                className="text-blue-400/80 transition-colors hover:text-blue-400"
              >
                Please click here
              </button>
              <p className="mt-1 text-white/35 text-xs">
                This will open Safari with all my contact links and social profiles.
              </p>
            </div>
          </div>
        )}

        {/* ── Skills ── */}
        {active === "skills" && (
          <div className="space-y-4 text-sm">
            <div>
              <h2 className="text-white text-xl font-bold mb-1">Skills & Expertise</h2>
              <p className="text-white/35 text-xs">Things I build with and know well</p>
            </div>
            <div className="h-px bg-white/8" />

            {[
              {
                label: "AI / LLM",
                color: "#6366f1",
                items: [
                  "OpenAI API",
                  "LangChain",
                  "LlamaIndex",
                  "RAG Architecture",
                  "Prompt Engineering",
                  "Tool Routing",
                  "Session Memory",
                  "Flowise",
                  "n8n",
                  "Vector Search",
                  "Semantic Search",
                  "Pinecone",
                  "Cohere",
                  "LangSmith",
                  "Langfuse",
                  "LLM Evaluation",
                ],
              },
              {
                label: "Voice & Multimodal",
                color: "#06b6d4",
                items: ["Whisper (STT)", "ElevenLabs (TTS)", "OpenCV", "Computer Vision"],
              },
              {
                label: "ML & Data",
                color: "#f97316",
                items: ["TensorFlow", "Keras", "Scikit-learn", "Pandas", "NumPy", "TFLite", "Model Deployment", "Power BI", "Microsoft Excel"],
              },
              {
                label: "Backend",
                color: "#10b981",
                items: ["Python", "FastAPI", "Node.js", "Laravel", "MySQL", "PostgreSQL", "Supabase", "Upstash Redis"],
              },
              {
                label: "Frontend",
                color: "#3b82f6",
                items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
              },
              {
                label: "Tools & Infra",
                color: "#8b5cf6",
                items: ["Git", "Docker", "VS Code", "Jupyter", "Figma", "Uvicorn", "Observability", "Microsoft Office", "Microsoft 365"],
              },
            ].map(section => (
              <div key={section.label}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: section.color }}>
                  {section.label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {section.items.map(item => (
                    <span
                      key={item}
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        background: `${section.color}14`,
                        border: `1px solid ${section.color}28`,
                        color: "rgba(255,255,255,0.72)",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <div className="h-px bg-white/8 mt-3" />
              </div>
            ))}

            <div>
              <p className="text-white/30 text-xs uppercase tracking-wider font-semibold mb-2">Core expertise</p>
              <div className="flex flex-wrap gap-2">
                {expertise.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-md text-xs font-semibold"
                    style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.25)", color: "rgba(251,191,36,0.9)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Organizations ── */}
        {active === "orgs" && (() => {
          const getBadge = (type: string) =>
            type === "vice_head" ? { bg: "rgba(236,72,153,0.15)", color: "#f9a8d4", label: "Vice Head" }
            : type === "treasurer" ? { bg: "rgba(99,102,241,0.14)", color: "#a5b4fc", label: "Treasurer" }
            : type === "director"  ? { bg: "rgba(236,72,153,0.14)", color: "#f9a8d4", label: "Director" }
            : type === "po"        ? { bg: "rgba(16,185,129,0.14)", color: "#6ee7b7", label: "PO" }
            : type === "expert"    ? { bg: "rgba(234,179,8,0.14)",  color: "#fde047", label: "Expert" }
            :                        { bg: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)", label: "Staff" };

          const orgRoles   = committeeExperience.filter(c => !c.year);
          const committees = committeeExperience.filter(c => !!c.year);
          const years = Array.from(new Set(committees.map(c => c.year!))).sort();

          return (
            <div className="space-y-4 text-sm">
              <div>
                <h2 className="text-white text-xl font-bold mb-0.5">Experience</h2>
                <p className="text-white/35 text-xs">Work experience, student orgs & committee roles</p>
              </div>
              <div className="h-px bg-white/8" />

              {/* Work Experience block */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#6366f1" }}>
                  Work Experience
                </p>
                <div className="space-y-2">
                  <div className="px-3 py-2.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="text-sm font-semibold text-white/85">PT Semen Indonesia (Persero) Tbk</p>
                        <p className="text-white/60 text-xs mt-0.5">AI Engineering Intern</p>
                      </div>
                      <span className="text-white/25 text-xs shrink-0">Dec 2025 to Present</span>
                    </div>
                    <p className="text-white/40 text-xs mt-1.5 leading-relaxed">
                      End-to-end LLM chatbot with RAG pipelines, tool routing, voice I/O (Whisper + ElevenLabs), and HC database integration
                    </p>
                  </div>
                  <div className="px-3 py-2.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="text-sm font-semibold text-white/85">Telkom Indonesia, East Java</p>
                        <p className="text-white/60 text-xs mt-0.5">Frontend Developer Intern</p>
                      </div>
                      <span className="text-white/25 text-xs shrink-0">May to Aug 2024</span>
                    </div>
                    <p className="text-white/40 text-xs mt-1.5 leading-relaxed">
                      Built recMe, a real-time STO topology platform across 10+ cities and 100+ network topologies. Includes drag-and-drop config, live device status, and location-based access
                    </p>
                  </div>
                </div>
              </div>
              <div className="h-px bg-white/8" />

              {/* Student orgs block */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#ec4899" }}>
                  Student Organizations
                </p>
                <div className="space-y-1.5">
                  {orgRoles.map(c => {
                    const badge = getBadge(c.type);
                    return (
                      <div key={c.id} className="px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-white/80">{c.event}</span>
                              <span className="px-1.5 py-0.5 rounded text-xs font-medium" style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>
                            </div>
                            <p className="text-white/60 text-xs mt-0.5">{c.role}</p>
                            {c.period && <p className="text-white/25 text-xs">{c.period}</p>}
                            {c.division && <p className="text-white/25 text-xs">{c.division}</p>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="h-px bg-white/8" />

              {/* Committee Experiences header */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#06b6d4" }}>
                  Committee Experiences
                </p>
              </div>

              {/* Event committees by year */}
              {years.map((year, yi) => {
                const items = committees.filter(c => c.year === year);
                const yearColor = yi === 0 ? "#f97316" : yi === 1 ? "#6366f1" : "#10b981";
                return (
                  <div key={year}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: yearColor }}>{year}</p>
                    <div className="space-y-1.5">
                      {items.map(c => {
                        const badge = getBadge(c.type);
                        return (
                          <div key={c.id} className="px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-white/80">{c.event}</span>
                              <span className="px-1.5 py-0.5 rounded text-xs font-medium" style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>
                            </div>
                            <p className="text-white/60 text-xs mt-0.5">{c.role}</p>
                            {c.period && <p className="text-white/25 text-xs">{c.period}</p>}
                          </div>
                        );
                      })}
                    </div>
                    <div className="h-px bg-white/8 mt-3" />
                  </div>
                );
              })}
            </div>
          );
        })()}

      </div>
    </div>
  );
}

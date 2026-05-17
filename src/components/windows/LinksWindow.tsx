"use client";

import { socialLinks } from "@/data/portfolio";
import { motion } from "framer-motion";

const icons: Record<string, JSX.Element> = {
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  send: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M22.265 2.428a1.5 1.5 0 0 0-1.52-.36l-18 6a1.5 1.5 0 0 0-.06 2.826l7.315 2.74 2.74 7.315a1.5 1.5 0 0 0 1.413.99h.07a1.5 1.5 0 0 0 1.38-1.05l6-18a1.5 1.5 0 0 0-.338-1.461z"/>
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  ),
  "message-circle": (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.97.53 3.82 1.45 5.43L2.05 22l4.76-1.52a9.841 9.841 0 0 0 5.23 1.49c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm4.87 13.88c-.2.56-1.16 1.08-1.62 1.15-.44.06-.98.09-1.58-.1-.36-.11-.83-.27-1.42-.53-2.49-1.07-4.12-3.58-4.24-3.75-.12-.17-.98-1.3-.98-2.48s.62-1.76.84-2 .44-.29.59-.29h.43c.14 0 .33-.05.51.39.2.48.67 1.64.73 1.76.06.12.1.26.02.41-.08.15-.12.24-.24.37-.12.13-.25.29-.35.39-.12.12-.24.25-.1.49.14.24.61.99 1.3 1.6.89.79 1.64 1.03 1.88 1.15.24.12.38.1.52-.06.14-.17.59-.69.75-.93.16-.24.32-.2.54-.12.22.08 1.38.65 1.62.77.24.12.4.18.46.28.06.1.06.55-.14 1.11z"/>
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
};

export default function LinksWindow() {
  return (
    <div
      className="h-full overflow-y-auto p-4 space-y-3"
      style={{ background: "rgba(10,10,14,0.95)" }}
    >
      <p className="text-white/30 text-xs font-semibold uppercase tracking-wider px-1 mb-4">
        Social & Contact
      </p>
      {socialLinks.map((link, i) => (
        <motion.a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06, type: "spring", stiffness: 300, damping: 24 }}
          whileHover={{ x: 4, scale: 1.01 }}
          className="flex items-center gap-4 p-3.5 rounded-xl cursor-pointer group transition-all"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.04))",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform`}
            style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
          >
            {icons[link.icon] ?? <span className="text-2xl">🔗</span>}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/90 font-semibold text-sm">{link.name}</p>
            <p className="text-white/40 text-xs mt-0.5 truncate">{link.handle}</p>
            <p className="text-white/30 text-xs mt-0.5">{link.description}</p>
          </div>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0"
          >
            <path d="M7 17 17 7M17 7H7M17 7v10"/>
          </svg>
        </motion.a>
      ))}
    </div>
  );
}

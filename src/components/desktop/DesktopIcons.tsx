"use client";

import { motion } from "framer-motion";
import { desktopIcons } from "@/data/portfolio";
import type { WindowId } from "@/types";

interface DesktopIconsProps {
  onOpen: (id: WindowId) => void;
}

export default function DesktopIcons({ onOpen }: DesktopIconsProps) {
  return (
    <div className="absolute right-5 top-12 z-10 hidden flex-col gap-3 xl:flex">
      {desktopIcons.map((icon, i) => (
        <motion.button
          key={icon.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.08, type: "spring", stiffness: 280, damping: 24 }}
          onDoubleClick={() => onOpen(icon.id)}
          onClick={(e) => e.detail === 2 && onOpen(icon.id)}
          className="group flex flex-col items-center gap-1.5 rounded-2xl p-2 focus:outline-none"
          style={{ width: 72 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div
            className="flex h-14 w-14 items-center justify-center rounded-[18px] text-3xl transition-all duration-150"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.44), rgba(255,255,255,0.18))",
              backdropFilter: "blur(16px) saturate(170%)",
              WebkitBackdropFilter: "blur(16px) saturate(170%)",
              border: "1px solid rgba(255,255,255,0.34)",
              boxShadow: "0 10px 28px rgba(63,63,72,0.12), inset 0 1px 0 rgba(255,255,255,0.34)",
            }}
          >
            <span>{icon.icon}</span>
          </div>
          <span
            className="rounded-md px-1.5 py-0.5 text-center text-[11px] font-medium leading-tight"
            style={{
              color: "rgba(35,35,38,0.84)",
              textShadow: "0 1px 2px rgba(255,255,255,0.8)",
              background: "rgba(255,255,255,0.42)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              maxWidth: 64,
            }}
          >
            {icon.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

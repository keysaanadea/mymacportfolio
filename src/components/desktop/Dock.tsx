"use client";

import { useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { dockItems } from "@/data/portfolio";
import type { WindowId } from "@/types";

const MIN_SIZE = 32;
const MAX_SIZE = 88;
const DEFAULT_SIZE = 56;

function DockIcon({
  item,
  iconSize,
  onClick,
  isOpen,
}: {
  item: (typeof dockItems)[0];
  iconSize: number;
  onClick: () => void;
  isOpen?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [bouncing, setBouncing] = useState(false);

  const handleClick = () => {
    if (!isOpen && !bouncing) {
      setBouncing(true);
    }
    onClick();
  };

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ width: iconSize }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <div
            className="pointer-events-none absolute bottom-full mb-[10px] left-1/2 z-[99999]"
            style={{ transform: "translateX(-50%)" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.94 }}
              transition={{ duration: 0.1 }}
              className="whitespace-nowrap rounded-[7px] px-2.5 py-[5px] text-[12px] font-medium leading-none"
              style={{
                color: "rgba(255,255,255,0.92)",
                background: "rgba(20,20,22,0.90)",
                border: "1px solid rgba(255,255,255,0.10)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.32)",
              }}
            >
              {item.label}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Icon */}
      <motion.div
        style={{
          width: iconSize,
          height: iconSize,
        }}
        animate={bouncing ? { y: [0, -24, -2, -14, 0, -5, 0] } : { y: 0 }}
        transition={
          bouncing
            ? { duration: 1.6, times: [0, 0.20, 0.40, 0.58, 0.76, 0.88, 1], ease: "easeInOut" }
            : {}
        }
        onAnimationComplete={() => setBouncing(false)}
        onClick={handleClick}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="cursor-pointer select-none flex-shrink-0"
      >
        <img
          src={item.imageSrc}
          alt={item.label}
          draggable={false}
          className="block w-full h-full object-cover select-none"
        />
      </motion.div>

      {/* Active dot — always rendered for consistent height */}
      <div
        className="mt-[3px] flex-shrink-0 w-[4px] h-[4px] rounded-full"
        style={{ background: isOpen ? "rgba(255,255,255,0.65)" : "transparent" }}
      />
    </div>
  );
}

interface DockProps {
  openWindows: Set<WindowId>;
  onItemClick: (id: WindowId | undefined) => void;
  isFullscreenHidden?: boolean;
  onHoverChange?: (isHovered: boolean) => void;
}

export default function Dock({
  openWindows,
  onItemClick,
  isFullscreenHidden = false,
  onHoverChange,
}: DockProps) {
  const [iconSize, setIconSize] = useState(DEFAULT_SIZE);

  const dragStartY = useRef<number | null>(null);
  const dragStartSize = useRef(DEFAULT_SIZE);

  const onResizeMove = useCallback((e: PointerEvent) => {
    if (dragStartY.current === null) return;
    // Drag up (negative delta) = bigger icons
    const delta = dragStartY.current - e.clientY;
    const next = Math.round(Math.max(MIN_SIZE, Math.min(MAX_SIZE, dragStartSize.current + delta * 0.6)));
    setIconSize(next);
  }, []);

  const onResizeEnd = useCallback(() => {
    dragStartY.current = null;
    window.removeEventListener("pointermove", onResizeMove);
    window.removeEventListener("pointerup", onResizeEnd);
  }, [onResizeMove]);

  const onResizeStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    dragStartY.current = e.clientY;
    dragStartSize.current = iconSize;
    window.addEventListener("pointermove", onResizeMove);
    window.addEventListener("pointerup", onResizeEnd);
  }, [iconSize, onResizeMove, onResizeEnd]);

  const regularItems = dockItems.slice(0, dockItems.length - 1);
  const trashItem = dockItems[dockItems.length - 1];

  return (
    <div
      className="fixed bottom-2 left-1/2 z-[9998] -translate-x-1/2 transition-transform duration-300 ease-out"
      style={{
        transform: isFullscreenHidden ? "translate(-50%, calc(100% + 18px))" : "translate(-50%, 0)",
        opacity: isFullscreenHidden ? 0 : 1,
        pointerEvents: isFullscreenHidden ? "none" : "auto",
      }}
      onPointerEnter={() => onHoverChange?.(true)}
      onPointerLeave={() => onHoverChange?.(false)}
    >
      <div
        className="relative flex items-end gap-[7px] rounded-[20px] px-4 pb-[8px] pt-[7px]"
        style={{
          background: "rgba(28,28,30,0.68)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          border: "0.5px solid rgba(255,255,255,0.13)",
          boxShadow:
            "0 0 0 0.5px rgba(0,0,0,0.45), 0 20px 60px rgba(0,0,0,0.50), 0 4px 16px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
        {regularItems.map((item) => (
          <DockIcon
            key={item.id}
            item={item}
            iconSize={iconSize}
            onClick={() => onItemClick(item.action as WindowId | undefined)}
            isOpen={item.action ? openWindows.has(item.action as WindowId) : false}
          />
        ))}

        {/* Separator — drag up/down to resize icons */}
        <div
          className="mx-1 self-stretch shrink-0 relative cursor-ns-resize"
          style={{ width: "1px", marginBottom: 8 }}
          onPointerDown={onResizeStart}
        >
          {/* Visible line */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.18) 25%, rgba(255,255,255,0.18) 75%, transparent 100%)",
            }}
          />
          {/* Wider invisible hit area */}
          <div className="absolute -inset-x-3 inset-y-0" />
        </div>

        {trashItem && (
          <DockIcon
            key={trashItem.id}
            item={trashItem}
            iconSize={iconSize}
            onClick={() => {}}
            isOpen={false}
          />
        )}
      </div>
    </div>
  );
}

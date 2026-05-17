"use client";

import { type PointerEvent, type ReactNode, useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useDragControls,
  useMotionValue,
} from "framer-motion";
import TrafficLights from "@/components/ui/TrafficLights";
import type { WindowId, WindowState } from "@/types";

interface WindowProps {
  state: WindowState;
  children: ReactNode;
  onClose: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onMaximize: (id: WindowId) => void;
  onFocus: (id: WindowId) => void;
  onPositionChange: (id: WindowId, x: number, y: number) => void;
  onSizeChange: (id: WindowId, width: number, height: number) => void;
  onFrameChange: (id: WindowId, x: number, y: number, width: number, height: number) => void;
  onFullscreenChange?: (id: WindowId, isFullscreen: boolean) => void;
  className?: string;
}

export default function Window({
  state,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onPositionChange,
  onSizeChange,
  onFrameChange,
  onFullscreenChange,
  className = "",
}: WindowProps) {
  const dragControls = useDragControls();
  const dragStartPosition = useRef(state.position);
  const resizeStartRef = useRef({
    x: state.position.x,
    y: state.position.y,
    width: state.size.width,
    height: state.size.height,
    pointerX: 0,
    pointerY: 0,
    direction: "bottom-right" as
      | "top"
      | "right"
      | "bottom"
      | "left"
      | "top-left"
      | "top-right"
      | "bottom-right"
      | "bottom-left",
  });
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const x = useMotionValue(state.position.x);
  const y = useMotionValue(state.position.y);
  const isMaximized = state.isMaximized || isFullscreen;

  useEffect(() => {
    if (!state.isOpen) {
      setIsFullscreen(false);
    }
  }, [state.isOpen]);

  useEffect(() => {
    onFullscreenChange?.(state.id, isFullscreen);
  }, [isFullscreen, onFullscreenChange, state.id]);

  useEffect(() => {
    if (isDraggingRef.current) return;
    x.set(state.position.x);
    y.set(state.position.y);
  }, [state.position.x, state.position.y, x, y]);

  useEffect(() => {
    if (!isResizing) return;

    const handlePointerMove = (event: PointerEvent | globalThis.PointerEvent) => {
      const deltaX = event.clientX - resizeStartRef.current.pointerX;
      const deltaY = event.clientY - resizeStartRef.current.pointerY;
      const movingLeft = resizeStartRef.current.direction.includes("left");
      const movingRight = resizeStartRef.current.direction.includes("right");
      const movingTop = resizeStartRef.current.direction.includes("top");
      const movingBottom = resizeStartRef.current.direction.includes("bottom");

      const nextX = movingLeft ? resizeStartRef.current.x + deltaX : resizeStartRef.current.x;
      const nextY = movingTop ? resizeStartRef.current.y + deltaY : resizeStartRef.current.y;
      const nextWidth = movingLeft
        ? resizeStartRef.current.width - deltaX
        : movingRight
          ? resizeStartRef.current.width + deltaX
          : resizeStartRef.current.width;
      const nextHeight = movingTop
        ? resizeStartRef.current.height - deltaY
        : movingBottom
          ? resizeStartRef.current.height + deltaY
          : resizeStartRef.current.height;

      if (movingLeft || movingTop) {
        onFrameChange(state.id, nextX, nextY, nextWidth, nextHeight);
        return;
      }

      onSizeChange(state.id, nextWidth, nextHeight);
    };

    const handlePointerUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isResizing, onFrameChange, onSizeChange, state.id]);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  if (!state.isOpen) return null;

  const startResize = (
    event: PointerEvent<HTMLDivElement>,
    direction: typeof resizeStartRef.current.direction
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setIsResizing(true);
    resizeStartRef.current = {
      x: state.position.x,
      y: state.position.y,
      width: state.size.width,
      height: state.size.height,
      pointerX: event.clientX,
      pointerY: event.clientY,
      direction,
    };
  };

  return (
    <AnimatePresence>
      {!state.isMinimized && (
        <motion.div
          key={state.id}
          drag={!isMaximized}
          dragMomentum={false}
          dragElastic={0}
          dragListener={false}
          dragControls={dragControls}
          onDragStart={() => {
            isDraggingRef.current = true;
            setIsDragging(true);
            dragStartPosition.current = state.position;
          }}
          onDragEnd={(_, info) => {
            isDraggingRef.current = false;
            setIsDragging(false);
            onPositionChange(
              state.id,
              dragStartPosition.current.x + info.offset.x,
              dragStartPosition.current.y + info.offset.y
            );
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 320, damping: 28 },
          }}
          exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }}
          onPointerDown={(event) => {
            if ((event.target as HTMLElement).closest("[data-window-control]")) {
              return;
            }
            onFocus(state.id);
          }}
          style={
            isMaximized
              ? {
                  position: "fixed",
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: "100vw",
                  height: "100vh",
                  zIndex: 9990,
                }
              : {
                  position: "absolute",
                  left: 0,
                  top: 0,
                  x,
                  y,
                  width: state.size.width,
                  zIndex: state.zIndex,
                  willChange: "transform",
                  backfaceVisibility: "hidden" as const,
                }
          }
          className={`overflow-visible ${className}`}
          whileDrag={{ cursor: "grabbing" }}
        >
          <div
            className="flex flex-col overflow-hidden"
            style={{
              borderRadius: isMaximized ? 0 : 22,
              background: "linear-gradient(180deg, rgba(18,18,24,0.94), rgba(12,12,16,0.88))",
              backdropFilter: isDragging ? "blur(18px) saturate(150%)" : "blur(30px) saturate(170%)",
              WebkitBackdropFilter: isDragging ? "blur(18px) saturate(150%)" : "blur(30px) saturate(170%)",
              border: isMaximized ? "none" : "1px solid rgba(255,255,255,0.08)",
              boxShadow: isMaximized
                ? "none"
                : isDragging
                  ? "0 20px 40px rgba(15,15,20,0.22), 0 6px 16px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.06)"
                  : "0 28px 80px rgba(15,15,20,0.34), 0 8px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
              height: isMaximized ? "100%" : state.size.height,
              contain: isMaximized ? "none" : "layout paint style",
              transition: isDragging ? "none" : "box-shadow 180ms ease, border-radius 200ms ease",
            }}
          >
            <div
              className="relative flex items-center justify-between px-4 py-3 shrink-0"
              style={{
                background: "linear-gradient(180deg, rgba(34,34,40,0.94), rgba(23,23,28,0.98))",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
              onDoubleClick={toggleFullscreen}
            >
              {!isMaximized && (
                <div
                  className="absolute inset-0"
                  style={{ cursor: isDragging ? "grabbing" : "grab" }}
                  onPointerDown={(event) => {
                    dragStartPosition.current = state.position;
                    dragControls.start(event);
                  }}
                />
              )}
              <div className="relative z-10">
                <TrafficLights
                  onClose={() => onClose(state.id)}
                  onMinimize={() => onMinimize(state.id)}
                  onMaximize={toggleFullscreen}
                />
              </div>
              <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 select-none text-[11px] font-medium tracking-[0.02em] text-white/45">
                {isMaximized ? `${state.title} - Full Screen` : state.title}
              </span>
              <div className="relative z-10 w-16" />
            </div>

            <div className="flex-1 overflow-hidden" style={{ cursor: "default" }}>
              {children}
            </div>

            {!isMaximized && (
              <>
                <div
                  className="absolute left-0 top-4 bottom-4 z-10 w-2 cursor-ew-resize"
                  onPointerDown={(event) => startResize(event, "left")}
                />
                <div
                  className="absolute right-0 top-4 bottom-4 z-10 w-2 cursor-ew-resize"
                  onPointerDown={(event) => startResize(event, "right")}
                />
                <div
                  className="absolute left-4 right-4 top-0 z-10 h-2 cursor-ns-resize"
                  onPointerDown={(event) => startResize(event, "top")}
                />
                <div
                  className="absolute bottom-0 left-4 right-4 z-10 h-2 cursor-ns-resize"
                  onPointerDown={(event) => startResize(event, "bottom")}
                />
                <div
                  className="absolute left-0 top-0 z-20 h-4 w-4 cursor-nwse-resize"
                  onPointerDown={(event) => startResize(event, "top-left")}
                />
                <div
                  className="absolute right-0 top-0 z-20 h-4 w-4 cursor-nesw-resize"
                  onPointerDown={(event) => startResize(event, "top-right")}
                />
                <div
                  className="absolute bottom-0 right-0 z-20 h-4 w-4 cursor-nwse-resize"
                  onPointerDown={(event) => startResize(event, "bottom-right")}
                />
                <div
                  className="absolute bottom-0 left-0 z-20 h-4 w-4 cursor-nesw-resize"
                  onPointerDown={(event) => startResize(event, "bottom-left")}
                />
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

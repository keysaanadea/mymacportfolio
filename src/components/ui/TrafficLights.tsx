"use client";

import type { PointerEvent } from "react";
import { useState } from "react";

interface TrafficLightsProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export default function TrafficLights({ onClose, onMinimize, onMaximize }: TrafficLightsProps) {
  const [hovered, setHovered] = useState(false);

  const blockPointerEvent = (event: PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>, action?: () => void) => {
    event.preventDefault();
    event.stopPropagation();
    action?.();
  };

  return (
    <div
      className="flex items-center gap-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        data-window-control="close"
        onPointerDown={blockPointerEvent}
        onPointerUp={(event) => handlePointerUp(event, onClose)}
        className="w-3 h-3 rounded-full bg-mac-red flex items-center justify-center transition-all hover:brightness-90 focus:outline-none"
        aria-label="Close"
        style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
      >
        {hovered && (
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
            <path d="M1 1l4 4M5 1l-4 4" stroke="#4a0000" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        )}
      </button>
      <button
        type="button"
        data-window-control="minimize"
        onPointerDown={blockPointerEvent}
        onPointerUp={(event) => handlePointerUp(event, onMinimize)}
        className="w-3 h-3 rounded-full bg-mac-yellow flex items-center justify-center transition-all hover:brightness-90 focus:outline-none"
        aria-label="Minimize"
        style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
      >
        {hovered && (
          <svg width="6" height="2" viewBox="0 0 6 2" fill="none">
            <path d="M1 1h4" stroke="#4a3000" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        )}
      </button>
      <button
        type="button"
        data-window-control="maximize"
        onPointerDown={blockPointerEvent}
        onPointerUp={(event) => handlePointerUp(event, onMaximize)}
        className="w-3 h-3 rounded-full bg-mac-green flex items-center justify-center transition-all hover:brightness-90 focus:outline-none"
        aria-label="Maximize"
        style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
      >
        {hovered && (
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
            <path d="M1 5L5 1M1 1h4v4" stroke="#003d00" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </div>
  );
}

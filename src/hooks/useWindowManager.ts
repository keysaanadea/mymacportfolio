"use client";

import { useCallback, useState } from "react";
import { initialWindowLayout } from "@/data/portfolio";
import type { WindowId, WindowState } from "@/types";

const WINDOW_ORDER = Object.entries(initialWindowLayout) as [
  WindowId,
  (typeof initialWindowLayout)[WindowId],
][];

const INITIAL_WINDOWS: WindowState[] = WINDOW_ORDER.map(([id, config], index) => ({
  id,
  title: config.title,
  isOpen: config.isOpen,
  isMinimized: false,
  isMaximized: false,
  zIndex: 10 + index,
  position: config.position,
  size: config.size,
  minSize: config.minSize,
}));

const TOP_BAR_HEIGHT = 28;
const DOCK_HEIGHT = 100;
const HORIZONTAL_MARGIN = 24;
const WINDOW_OPEN_RATIO = 0.75;

function clampPosition(id: WindowId, x: number, y: number, width: number, height: number) {
  if (typeof window === "undefined") {
    return { x, y };
  }

  const topBarHeight = TOP_BAR_HEIGHT;
  const dockHeight = DOCK_HEIGHT;
  const maxX = Math.max(HORIZONTAL_MARGIN, window.innerWidth - width - HORIZONTAL_MARGIN);
  const maxY = Math.max(topBarHeight + 18, window.innerHeight - height - dockHeight);

  if (id === "photo") {
    return { x, y: Math.max(topBarHeight + 18, Math.min(y, maxY)) };
  }

  return {
    x: Math.max(HORIZONTAL_MARGIN, Math.min(x, maxX)),
    y: Math.max(topBarHeight + 18, Math.min(y, maxY)),
  };
}

function getCenteredFrame(windowState: WindowState) {
  if (typeof window === "undefined") {
    return {
      position: windowState.position,
      size: windowState.size,
    };
  }

  const minWidth = windowState.minSize?.width ?? 320;
  const minHeight = windowState.minSize?.height ?? 240;
  const availableWidth = Math.max(minWidth, window.innerWidth - HORIZONTAL_MARGIN * 2);
  const availableHeight = Math.max(
    minHeight,
    window.innerHeight - TOP_BAR_HEIGHT - DOCK_HEIGHT - 18
  );
  const width = Math.max(minWidth, Math.min(Math.round(availableWidth * WINDOW_OPEN_RATIO), availableWidth));
  const height = Math.max(
    minHeight,
    Math.min(Math.round(availableHeight * WINDOW_OPEN_RATIO), availableHeight)
  );
  const unclampedX = Math.round((window.innerWidth - width) / 2);
  const unclampedY = Math.round((TOP_BAR_HEIGHT + Math.max(window.innerHeight - DOCK_HEIGHT - TOP_BAR_HEIGHT - height, 0) / 2));
  const position = clampPosition(windowState.id, unclampedX, unclampedY, width, height);

  return {
    position,
    size: { width, height },
  };
}

export function useWindowManager() {
  const [windows, setWindows] = useState(INITIAL_WINDOWS);
  const [, setTopZ] = useState(40);

  const bringToFront = useCallback((id: WindowId) => {
    setTopZ((prevTopZ) => {
      const nextTopZ = prevTopZ + 1;
      setWindows((prev) =>
        prev.map((windowState) =>
          windowState.id === id
            ? { ...windowState, zIndex: nextTopZ, isMinimized: false }
            : windowState
        )
      );
      return nextTopZ;
    });
  }, []);

  const focusWindow = useCallback((id: WindowId) => {
    bringToFront(id);
  }, [bringToFront]);

  const openWindow = useCallback((id: WindowId) => {
    setTopZ((prevTopZ) => {
      const nextTopZ = prevTopZ + 1;
      setWindows((prev) =>
        prev.map((windowState) => {
          if (windowState.id !== id) return windowState;
          const centeredFrame = getCenteredFrame(windowState);
          return {
            ...windowState,
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            zIndex: nextTopZ,
            position: centeredFrame.position,
            size: centeredFrame.size,
          };
        })
      );
      return nextTopZ;
    });
  }, []);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows((prev) =>
      prev.map((windowState) =>
        windowState.id === id ? { ...windowState, isOpen: false, isMinimized: false } : windowState
      )
    );
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) =>
      prev.map((windowState) =>
        windowState.id === id ? { ...windowState, isMinimized: true, isMaximized: false } : windowState
      )
    );
  }, []);

  const maximizeWindow = useCallback((id: WindowId) => {
    setTopZ((prevTopZ) => {
      const nextTopZ = prevTopZ + 1;

      setWindows((prev) =>
        prev.map((windowState) => {
          if (windowState.id !== id) return windowState;

          if (windowState.isMaximized && windowState.lastPosition && windowState.lastSize) {
            return {
              ...windowState,
              isMaximized: false,
              isMinimized: false,
              zIndex: nextTopZ,
              position: windowState.lastPosition,
              size: windowState.lastSize,
            };
          }

          const maxWidth = typeof window !== "undefined" ? window.innerWidth : windowState.size.width;
          const maxHeight = typeof window !== "undefined" ? window.innerHeight : windowState.size.height;

          return {
            ...windowState,
            isMaximized: true,
            isMinimized: false,
            zIndex: nextTopZ,
            lastPosition: windowState.position,
            lastSize: windowState.size,
            position: { x: 0, y: 0 },
            size: { width: maxWidth, height: maxHeight },
          };
        })
      );

      return nextTopZ;
    });
  }, []);

  const updatePosition = useCallback((id: WindowId, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((windowState) => {
        if (windowState.id !== id || windowState.isMaximized) {
          return windowState;
        }

        const nextPosition = clampPosition(id, x, y, windowState.size.width, windowState.size.height);
        return { ...windowState, position: nextPosition };
      })
    );
  }, []);

  const updateSize = useCallback((id: WindowId, width: number, height: number) => {
    setWindows((prev) =>
      prev.map((windowState) => {
        if (windowState.id !== id || windowState.isMaximized) {
          return windowState;
        }

        const minWidth = windowState.minSize?.width ?? 320;
        const minHeight = windowState.minSize?.height ?? 240;
        const maxWidth =
          typeof window !== "undefined"
            ? Math.max(minWidth, window.innerWidth - windowState.position.x - 24)
            : width;
        const maxHeight =
          typeof window !== "undefined"
            ? Math.max(minHeight, window.innerHeight - windowState.position.y - 100)
            : height;

        return {
          ...windowState,
          size: {
            width: Math.max(minWidth, Math.min(width, maxWidth)),
            height: Math.max(minHeight, Math.min(height, maxHeight)),
          },
        };
      })
    );
  }, []);

  const updateFrame = useCallback((id: WindowId, x: number, y: number, width: number, height: number) => {
    setWindows((prev) =>
      prev.map((windowState) => {
        if (windowState.id !== id || windowState.isMaximized) {
          return windowState;
        }

        const minWidth = windowState.minSize?.width ?? 320;
        const minHeight = windowState.minSize?.height ?? 240;
        const viewportWidth = typeof window !== "undefined" ? window.innerWidth : x + width + 24;
        const viewportHeight = typeof window !== "undefined" ? window.innerHeight : y + height + 100;
        const topBarHeight = TOP_BAR_HEIGHT;
        const maxRight = viewportWidth - 24;
        const maxBottom = viewportHeight - DOCK_HEIGHT;

        const clampedX = Math.max(HORIZONTAL_MARGIN, Math.min(x, maxRight - minWidth));
        const clampedY = Math.max(topBarHeight + 18, Math.min(y, maxBottom - minHeight));
        const maxWidth = Math.max(minWidth, maxRight - clampedX);
        const maxHeight = Math.max(minHeight, maxBottom - clampedY);

        return {
          ...windowState,
          position: { x: clampedX, y: clampedY },
          size: {
            width: Math.max(minWidth, Math.min(width, maxWidth)),
            height: Math.max(minHeight, Math.min(height, maxHeight)),
          },
        };
      })
    );
  }, []);

  const toggleWindow = useCallback((id: WindowId) => {
    const current = windows.find((windowState) => windowState.id === id);

    if (!current || !current.isOpen || current.isMinimized) {
      openWindow(id);
      return;
    }

    focusWindow(id);
  }, [focusWindow, openWindow, windows]);

  return {
    windows,
    focusWindow,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    updatePosition,
    updateSize,
    updateFrame,
    toggleWindow,
  };
}

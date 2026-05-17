"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Wallpaper from "./Wallpaper";
import TopBar from "./TopBar";
import Dock from "./Dock";
import Window from "@/components/windows/Window";
import FinderWindow from "@/components/windows/FinderWindow";
import PhotoWindow from "@/components/windows/PhotoWindow";
import NotesWindow from "@/components/windows/NotesWindow";
import MusicWindow from "@/components/windows/MusicWindow";
import MessagesWindow from "@/components/windows/MessagesWindow";
import TerminalWindow from "@/components/windows/TerminalWindow";
import LinksWindow from "@/components/windows/LinksWindow";
import ProjectsWindow from "@/components/windows/ProjectsWindow";
import ResumeWindow from "@/components/windows/ResumeWindow";
import ToolsWindow from "@/components/windows/ToolsWindow";
import BooksWindow from "@/components/windows/BooksWindow";
import PhotoBoothWindow from "@/components/windows/PhotoBoothWindow";
import SteamWindow from "@/components/windows/SteamWindow";
import Spotlight from "./Spotlight";
import DesktopWidgets from "./DesktopWidgets";
import { useWindowManager } from "@/hooks/useWindowManager";
import type { WindowId } from "@/types";

const COMING_SOON_APPS: Partial<Record<WindowId, { title: string; message: string }>> = {
  books: {
    title: "Books is still in development",
    message: "This space will grow over time with a more curated reading shelf, notes, and personal learning snapshots.",
  },
  photobooth: {
    title: "Photo Booth is still in development",
    message: "This area is planned as a more playful and personal part of the portfolio, and I will keep expanding it over time.",
  },
  steam: {
    title: "Steam is still in development",
    message: "This section is planned as a lighter, more playful part of the portfolio and will be expanded gradually over time.",
  },
};

export default function Desktop() {
  const {
    windows,
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    updatePosition,
    updateSize,
    updateFrame,
    toggleWindow,
  } = useWindowManager();
  const [fullscreenWindows, setFullscreenWindows] = useState<Partial<Record<WindowId, boolean>>>({});
  const [comingSoonApp, setComingSoonApp] = useState<WindowId | null>(null);

  const handleAppOpen = (id: WindowId) => {
    if (COMING_SOON_APPS[id]) {
      setComingSoonApp(id);
      return;
    }
    toggleWindow(id);
  };

  const windowContents: Record<WindowId, JSX.Element> = {
    finder:     <FinderWindow onOpen={handleAppOpen} />,
    photo:      <PhotoWindow />,
    notes:      <NotesWindow onOpen={handleAppOpen} />,
    music:      <MusicWindow />,
    messages:   <MessagesWindow />,
    terminal:   <TerminalWindow />,
    links:      <LinksWindow />,
    projects:   <ProjectsWindow />,
    resume:     <ResumeWindow />,
    tools:      <ToolsWindow onOpen={(id) => { closeWindow("tools"); handleAppOpen(id); }} />,
    books:      <BooksWindow />,
    photobooth: <PhotoBoothWindow />,
    steam:      <SteamWindow />,
  };

  const openWindowIds = new Set<WindowId>(
    windows.filter((w) => w.isOpen && !w.isMinimized).map((w) => w.id)
  );
  const activeWindow = windows.reduce<(typeof windows)[number] | null>(
    (top, current) => {
      if (!current.isOpen || current.isMinimized) return top;
      if (!top || current.zIndex > top.zIndex) return current;
      return top;
    },
    null
  );
  const hasFullscreenWindow = useMemo(
    () => Object.values(fullscreenWindows).some(Boolean),
    [fullscreenWindows]
  );

  const handleFullscreenChange = (id: WindowId, isFullscreen: boolean) => {
    setFullscreenWindows((prev) => {
      if (prev[id] === isFullscreen) return prev;
      return { ...prev, [id]: isFullscreen };
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">
      <Wallpaper />

      <TopBar
        activeWindowId={activeWindow?.id}
        onOpenWindow={handleAppOpen}
        isFullscreenHidden={hasFullscreenWindow}
        isInFullscreen={hasFullscreenWindow}
      />

      {/* Desktop widgets */}
      <DesktopWidgets />

      {/* Windows layer */}
      <div className="absolute inset-0 pt-7 pb-24">
        <AnimatePresence>
          {windows.map((win) => (
            <Window
              key={win.id}
              state={win}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              onMaximize={maximizeWindow}
              onFocus={focusWindow}
              onPositionChange={updatePosition}
              onSizeChange={updateSize}
              onFrameChange={updateFrame}
              onFullscreenChange={handleFullscreenChange}
            >
              {windowContents[win.id]}
            </Window>
          ))}
        </AnimatePresence>
      </div>

      {/* Dock */}
      <Dock
        openWindows={openWindowIds}
        isFullscreenHidden={hasFullscreenWindow}
        onItemClick={(id) => {
          if (!id) return;
          handleAppOpen(id);
        }}
      />

      <Spotlight onOpen={handleAppOpen} />

      <AnimatePresence>
        {comingSoonApp ? (
          <motion.div
            className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/40 px-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setComingSoonApp(null)}
          >
            <motion.div
              className="w-full max-w-md rounded-[28px] border border-white/20 bg-[linear-gradient(180deg,rgba(34,34,40,0.96),rgba(25,25,30,0.94))] p-6 text-white shadow-[0_32px_80px_rgba(0,0,0,0.35)]"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                Coming Soon
              </div>
              <h3 className="text-[26px] font-semibold leading-tight">
                {COMING_SOON_APPS[comingSoonApp]?.title}
              </h3>
              <p className="mt-3 text-[15px] leading-7 text-white/70">
                {COMING_SOON_APPS[comingSoonApp]?.message}
              </p>
              <p className="mt-3 text-[14px] leading-6 text-white/45">
                For now, I am treating this as a future area of the portfolio and adding to it gradually over time.
              </p>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setComingSoonApp(null)}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#1d1d22] transition hover:bg-white/90"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

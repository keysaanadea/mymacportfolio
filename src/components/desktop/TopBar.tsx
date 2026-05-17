"use client";

import { type ReactNode, useEffect, useState } from "react";
import type { WindowId } from "@/types";

const appNames: Record<WindowId, string> = {
  finder: "Finder",
  photo: "Photos",
  notes: "Notes",
  music: "Music",
  messages: "Messages",
  terminal: "Terminal",
  links: "Safari",
  projects: "Projects",
  resume: "Preview",
  tools: "Launchpad",
  books: "Books",
  photobooth: "Photo Booth",
  steam: "Steam",
};

const windowItems: { id: WindowId; label: string; shortcut?: string }[] = [
  { id: "finder", label: "Finder", shortcut: "⌘1" },
  { id: "photo", label: "Photos" },
  { id: "notes", label: "Notes" },
  { id: "projects", label: "Projects" },
  { id: "terminal", label: "Terminal", shortcut: "⌘T" },
  { id: "links", label: "Safari" },
  { id: "resume", label: "Preview" },
  { id: "music", label: "Music" },
  { id: "messages", label: "Messages" },
  { id: "tools", label: "Launchpad" },
  { id: "books", label: "Books" },
  { id: "photobooth", label: "Photo Booth" },
];

const topMenus = ["File", "Edit", "View", "Go", "Window", "Help"] as const;
type TopMenu = (typeof topMenus)[number];
type OpenMenu = "apple" | "app" | TopMenu | "bluetooth" | "wifi" | "battery" | "control" | "spotlight" | null;

interface TopBarProps {
  activeWindowId?: WindowId;
  onOpenWindow?: (id: WindowId) => void;
  isFullscreenHidden?: boolean;
  isInFullscreen?: boolean;
  onHoverChange?: (isHovered: boolean) => void;
  onMenuVisibilityChange?: (isOpen: boolean) => void;
}

function WifiIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[14px] w-[14px]">
      <path d="M12 5C7.31 5 3.07 6.9 0 9.98l12 12.02L24 9.98C20.93 6.9 16.69 5 12 5zm0 13l-5-5.04c1.34-1.29 3.12-2.08 5-2.08 1.88 0 3.66.79 5 2.08L12 18z" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <div className="flex items-center gap-0.5">
      <div className="relative flex h-[11px] w-[22px] items-center rounded-[3px] border border-white/65 px-[2px]">
        <div className="h-[7px] w-[14px] rounded-[1.5px] bg-white/85" />
      </div>
      <div className="h-[5px] w-[2px] rounded-r-[2px] bg-white/50" />
    </div>
  );
}

function BluetoothIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[13px] w-[13px]">
      <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z" />
    </svg>
  );
}

function ControlCenterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[14px] w-[14px]">
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
    </svg>
  );
}

function SpotlightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-[13px] w-[13px]">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="15.5" y1="15.5" x2="21" y2="21" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[15px] w-[15px]" aria-hidden="true">
      <path d="M16.24 12.47c.03 2.65 2.33 3.53 2.36 3.55-.02.07-.37 1.27-1.21 2.51-.72 1.08-1.47 2.15-2.66 2.17-1.16.02-1.53-.7-2.86-.7s-1.74.68-2.84.72c-1.14.04-2.01-1.17-2.74-2.24-1.49-2.17-2.63-6.14-1.1-8.81.76-1.33 2.12-2.17 3.6-2.19 1.12-.02 2.18.76 2.86.76.69 0 1.98-.94 3.34-.8.57.02 2.17.23 3.19 1.73-.08.05-1.91 1.12-1.94 3.3ZM14.1 6.02c.6-.73 1-1.75.89-2.76-.86.03-1.89.57-2.51 1.29-.55.64-1.03 1.67-.9 2.65.96.08 1.93-.49 2.52-1.18Z" />
    </svg>
  );
}

function MenuPanel({ children, align = "left" }: { children: ReactNode; align?: "left" | "right" }) {
  return (
    <div
      className={`absolute top-7 min-w-[218px] overflow-hidden rounded-[10px] border border-black/8 py-1 text-[13px] text-black/85 shadow-[0_8px_32px_rgba(0,0,0,0.18)] ${
        align === "right" ? "right-0" : "left-0"
      }`}
      style={{
        background: "rgba(246,246,246,0.82)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
      }}
    >
      {children}
    </div>
  );
}

function MenuItem({
  children,
  shortcut,
  disabled,
  onClick,
}: {
  children: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex h-7 w-full items-center justify-between gap-8 px-3 text-left transition-colors hover:bg-[#0064d6] hover:text-white disabled:cursor-default disabled:text-black/30 disabled:hover:bg-transparent disabled:hover:text-black/30"
    >
      <span>{children}</span>
      {shortcut && <span className="text-black/40">{shortcut}</span>}
    </button>
  );
}

function Divider() {
  return <div className="my-1 h-px bg-white/12" />;
}

export default function TopBar({
  activeWindowId,
  onOpenWindow,
  isFullscreenHidden = false,
  isInFullscreen = false,
  onHoverChange,
  onMenuVisibilityChange,
}: TopBarProps) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const activeApp = activeWindowId ? appNames[activeWindowId] : "Finder";

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }));
      setDate(now.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const close = () => setOpenMenu(null);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("pointerdown", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const toggleMenu = (menu: OpenMenu) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  useEffect(() => {
    onMenuVisibilityChange?.(openMenu !== null);
  }, [onMenuVisibilityChange, openMenu]);

  const menuButtonClass = (menu: OpenMenu) =>
    `rounded px-2 py-0.5 text-[13px] transition-colors text-white ${
      openMenu === menu ? "bg-white/18" : "hover:bg-white/12"
    }`;

  const openWindow = (id: WindowId) => {
    onOpenWindow?.(id);
    setOpenMenu(null);
  };

  const renderTopMenu = (menu: TopMenu) => {
    if (menu === "File") {
      return (
        <>
          <MenuItem onClick={() => openWindow("terminal")} shortcut="⌘T">New Terminal Window</MenuItem>
          <MenuItem onClick={() => openWindow("notes")} shortcut="⌘N">New Note</MenuItem>
          <MenuItem onClick={() => openWindow("finder")} shortcut="⌘1">Open Finder</MenuItem>
          <MenuItem disabled>Open...</MenuItem>
          <Divider />
          <MenuItem onClick={() => setOpenMenu(null)} shortcut="⌘W">Close Window</MenuItem>
        </>
      );
    }
    if (menu === "Edit") {
      return (
        <>
          <MenuItem disabled shortcut="⌘Z">Undo</MenuItem>
          <MenuItem disabled shortcut="⇧⌘Z">Redo</MenuItem>
          <Divider />
          <MenuItem onClick={() => navigator.clipboard?.writeText("keysaanadea portfolio")} shortcut="⌘C">Copy Portfolio Name</MenuItem>
          <MenuItem disabled shortcut="⌘V">Paste</MenuItem>
        </>
      );
    }
    if (menu === "View") {
      return (
        <>
          <MenuItem onClick={() => openWindow("tools")}>Show Launchpad</MenuItem>
          <MenuItem onClick={() => openWindow("finder")}>Show Finder</MenuItem>
          <MenuItem onClick={() => openWindow("projects")}>Show Project Explorer</MenuItem>
          <MenuItem onClick={() => openWindow("photo")}>Show Photos</MenuItem>
          <Divider />
          <MenuItem disabled>Enter Full Screen</MenuItem>
        </>
      );
    }
    if (menu === "Go") {
      return (
        <>
          <MenuItem onClick={() => openWindow("projects")}>Projects</MenuItem>
          <MenuItem onClick={() => openWindow("finder")}>Start Here</MenuItem>
          <MenuItem onClick={() => openWindow("resume")}>Resume</MenuItem>
          <MenuItem onClick={() => openWindow("links")}>Links</MenuItem>
          <MenuItem onClick={() => openWindow("terminal")}>Terminal</MenuItem>
        </>
      );
    }
    if (menu === "Window") {
      return (
        <>
          {windowItems.map((item) => (
            <MenuItem key={item.id} onClick={() => openWindow(item.id)} shortcut={item.shortcut}>
              {activeWindowId === item.id ? "✓ " : ""}
              {item.label}
            </MenuItem>
          ))}
        </>
      );
    }
    return (
      <>
        <MenuItem onClick={() => openWindow("notes")}>About This Portfolio</MenuItem>
        <MenuItem onClick={() => openWindow("terminal")}>Terminal Commands</MenuItem>
        <MenuItem onClick={() => openWindow("messages")}>Contact Keysa</MenuItem>
      </>
    );
  };

  return (
    <div
      className="fixed left-0 right-0 top-0 z-[9999] flex items-center justify-between px-3 transition-transform duration-300 ease-out"
      style={{
        height: 28,
        background: isInFullscreen ? "rgba(18,18,24,0.90)" : "transparent",
        backdropFilter: isInFullscreen ? "blur(24px) saturate(160%)" : "none",
        WebkitBackdropFilter: isInFullscreen ? "blur(24px) saturate(160%)" : "none",
        borderBottom: isInFullscreen ? "1px solid rgba(255,255,255,0.07)" : "none",
        transform: isFullscreenHidden ? "translate3d(0, -100%, 0)" : "translate3d(0, 0, 0)",
        opacity: isFullscreenHidden ? 0 : 1,
        pointerEvents: isFullscreenHidden ? "none" : "auto",
      }}
      onPointerEnter={() => onHoverChange?.(true)}
      onPointerLeave={() => onHoverChange?.(false)}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="flex items-center gap-1">
        <div className="relative">
          <button type="button" className={`${menuButtonClass("apple")} flex h-6 items-center px-2`} onClick={() => toggleMenu("apple")} aria-label="Apple menu">
            <AppleMark />
          </button>
          {openMenu === "apple" && (
            <MenuPanel>
              <MenuItem onClick={() => openWindow("notes")}>About Keysa</MenuItem>
              <MenuItem onClick={() => openWindow("tools")}>App Store</MenuItem>
              <Divider />
              <MenuItem onClick={() => openWindow("projects")}>Recent Projects</MenuItem>
              <MenuItem onClick={() => openWindow("resume")}>Resume</MenuItem>
              <Divider />
              <MenuItem disabled>Sleep</MenuItem>
              <MenuItem disabled>Restart...</MenuItem>
              <MenuItem disabled>Shut Down...</MenuItem>
            </MenuPanel>
          )}
        </div>

        <div className="relative">
          <button type="button" className={`${menuButtonClass("app")} font-semibold`} onClick={() => toggleMenu("app")}>
            {activeApp}
          </button>
          {openMenu === "app" && (
            <MenuPanel>
              <MenuItem onClick={() => openWindow(activeWindowId ?? "projects")}>About {activeApp}</MenuItem>
              <MenuItem disabled>Settings...</MenuItem>
              <Divider />
              <MenuItem onClick={() => setOpenMenu(null)}>Hide {activeApp}</MenuItem>
              <MenuItem disabled>Quit {activeApp}</MenuItem>
            </MenuPanel>
          )}
        </div>

        {topMenus.map((menu) => (
          <div className="relative" key={menu}>
            <button type="button" className={menuButtonClass(menu)} onClick={() => toggleMenu(menu)}>
              {menu}
            </button>
            {openMenu === menu && <MenuPanel>{renderTopMenu(menu)}</MenuPanel>}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-[10px] text-white">
        <div className="relative">
          <button type="button" className={menuButtonClass("bluetooth")} onClick={() => toggleMenu("bluetooth")} aria-label="Bluetooth">
            <BluetoothIcon />
          </button>
          {openMenu === "bluetooth" && (
            <MenuPanel align="right">
              <MenuItem disabled>Bluetooth: On</MenuItem>
              <MenuItem disabled>Keysa's AirPods</MenuItem>
              <Divider />
              <MenuItem onClick={() => setOpenMenu(null)}>Bluetooth Settings...</MenuItem>
            </MenuPanel>
          )}
        </div>
        <div className="relative">
          <button type="button" className={menuButtonClass("wifi")} onClick={() => toggleMenu("wifi")} aria-label="Wi-Fi">
            <WifiIcon />
          </button>
          {openMenu === "wifi" && (
            <MenuPanel align="right">
              <MenuItem disabled>Wi-Fi: On</MenuItem>
              <MenuItem disabled>Connected to Portfolio</MenuItem>
              <Divider />
              <MenuItem onClick={() => setOpenMenu(null)}>Network Settings...</MenuItem>
            </MenuPanel>
          )}
        </div>
        <div className="relative">
          <button type="button" className={menuButtonClass("battery")} onClick={() => toggleMenu("battery")} aria-label="Battery">
            <BatteryIcon />
          </button>
          {openMenu === "battery" && (
            <MenuPanel align="right">
              <MenuItem disabled>Battery 74%</MenuItem>
              <MenuItem disabled>Power Source: Adapter</MenuItem>
              <Divider />
              <MenuItem onClick={() => setOpenMenu(null)}>Battery Settings...</MenuItem>
            </MenuPanel>
          )}
        </div>
        <div className="relative">
          <button type="button" className={menuButtonClass("control")} onClick={() => toggleMenu("control")} aria-label="Control Center">
            <ControlCenterIcon />
          </button>
          {openMenu === "control" && (
            <MenuPanel align="right">
              <MenuItem disabled>Display Brightness</MenuItem>
              <MenuItem disabled>Sound</MenuItem>
              <MenuItem disabled>Focus</MenuItem>
              <Divider />
              <MenuItem onClick={() => openWindow("tools")}>Open Launchpad</MenuItem>
            </MenuPanel>
          )}
        </div>
        <div className="relative">
          <button type="button" className={menuButtonClass("spotlight")} onClick={() => toggleMenu("spotlight")} aria-label="Search">
            <SpotlightIcon />
          </button>
          {openMenu === "spotlight" && (
            <MenuPanel align="right">
              <MenuItem onClick={() => openWindow("projects")}>Search Projects</MenuItem>
              <MenuItem onClick={() => openWindow("links")}>Search Links</MenuItem>
              <MenuItem onClick={() => openWindow("terminal")}>Open Terminal</MenuItem>
            </MenuPanel>
          )}
        </div>

        <button type="button" className="rounded px-2 py-0.5 text-[13px] font-medium text-white hover:bg-white/12" onClick={() => toggleMenu("control")}>
          <span>{date}</span>
          <span className="ml-1.5">{time}</span>
        </button>
      </div>
    </div>
  );
}

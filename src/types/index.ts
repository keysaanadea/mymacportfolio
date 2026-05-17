export interface WindowState {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minSize?: { width: number; height: number };
  lastPosition?: { x: number; y: number };
  lastSize?: { width: number; height: number };
}

export type WindowId =
  | "finder"
  | "photo"
  | "notes"
  | "music"
  | "messages"
  | "terminal"
  | "links"
  | "projects"
  | "resume"
  | "tools"
  | "books"
  | "photobooth"
  | "steam";

export type ReadStatus = "reading" | "want" | "finished";

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  from: string;
  to: string;
  status: ReadStatus;
  progress?: number;
  year: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "Live" | "WIP" | "Personal";
  tech: string[];
  icon: string;
  color: string;
  url?: string;
}

export interface SocialLink {
  id: string;
  name: string;
  handle: string;
  url: string;
  icon: string;
  gradient: string;
  description: string;
}

export interface Song {
  title: string;
  artist: string;
  album: string;
  coverGradient: string;
  duration: number;
  currentTime: number;
}

export interface Track {
  id: string;
  title: string;
  duration: number;
  audioSrc: string;
}

export interface Album {
  title: string;
  artist: string;
  year: string;
  coverGradient: string;
  tracks: Track[];
}

export interface Message {
  id: string;
  text: string;
  isMe: boolean;
  time: string;
}

export interface Profile {
  name: string;
  role: string;
  location: string;
  bio: string;
  tagline: string;
  email: string;
  avatar: string;
  availability: string;
  focus: string[];
}

export interface TerminalCommands {
  [key: string]: string | (() => string);
}

export interface DockItem {
  id: WindowId | "trash" | "launchpad" | "books";
  label: string;
  icon: string;
  color: string;
  imageSrc?: string;
  action?: WindowId;
}

export interface DesktopShortcut {
  id: WindowId;
  label: string;
  icon: string;
}

export interface ResumeEntry {
  id: string;
  label: string;
  download: string;
  preview: string | null;
  description: string;
}

export interface CommitteeExp {
  id: string;
  role: string;
  event: string;
  year?: number;
  period?: string;
  type: "treasurer" | "director" | "po" | "expert" | "staff" | "vice_head";
  division?: string;
}

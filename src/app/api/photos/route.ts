import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

const FOLDER_ACCENTS: Record<string, string> = {
  "committee-exp":      "#f97316",
  "work-exp":           "#3b82f6",
  "organizational-exp": "#10b981",
  "personal-training":  "#ec4899",
  portraits:            "#8b5cf6",
  "personal-moments":   "#06b6d4",
};

const ACCENT_POOL = ["#f97316", "#3b82f6", "#10b981", "#ec4899", "#8b5cf6", "#eab308", "#06b6d4", "#ef4444"];
const ALBUM_LABELS: Record<string, string> = {
  "committee-exp": "Committee Experience",
  "organizational-exp": "Organizational Experience",
  "personal-training": "Personal Training",
  "work-exp": "Work Experience",
  portraits: "Portraits",
  "personal-moments": "Personal Moments",
};
const SUBALBUM_LABELS: Record<string, string> = {
  "formal-portraits": "Formal Portraits",
  "casual-portraits": "Casual Portraits",
  "speaking-moments": "Speaking Moments",
  "friends-and-moments": "Friends & Moments",
};
const ALBUM_ORDER = [
  "work-exp",
  "organizational-exp",
  "committee-exp",
  "personal-training",
  "portraits",
  "personal-moments",
] as const;

function toLabel(slug: string) {
  if (SUBALBUM_LABELS[slug]) return SUBALBUM_LABELS[slug];
  if (ALBUM_LABELS[slug]) return ALBUM_LABELS[slug];

  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function extractDate(slug: string) {
  const match = slug.match(/\d{4}/);
  return match ? match[0] : "";
}

export async function GET() {
  const photosDir = path.join(process.cwd(), "public", "site-photos");

  if (!fs.existsSync(photosDir)) return NextResponse.json([]);

  const topFolders = fs
    .readdirSync(photosDir)
    .filter((n) => !n.startsWith(".") && fs.statSync(path.join(photosDir, n)).isDirectory())
    .sort((a, b) => {
      const orderA = ALBUM_ORDER.indexOf(a as (typeof ALBUM_ORDER)[number]);
      const orderB = ALBUM_ORDER.indexOf(b as (typeof ALBUM_ORDER)[number]);

      if (orderA !== -1 || orderB !== -1) {
        if (orderA === -1) return 1;
        if (orderB === -1) return -1;
        return orderA - orderB;
      }

      return a.localeCompare(b);
    });

  const albums = topFolders.map((albumFolder, albumIdx) => {
    const albumPath = path.join(photosDir, albumFolder);
    const accent = FOLDER_ACCENTS[albumFolder] ?? ACCENT_POOL[albumIdx % ACCENT_POOL.length];

    const subFolders = fs
      .readdirSync(albumPath)
      .filter((n) => !n.startsWith(".") && fs.statSync(path.join(albumPath, n)).isDirectory())
      .sort();

    const subAlbums = subFolders.map((subFolder) => {
      const subPath = path.join(albumPath, subFolder);
      const files = fs
        .readdirSync(subPath)
        .filter((n) => !n.startsWith(".") && IMAGE_EXTS.has(path.extname(n).toLowerCase()))
        .sort();

      const photos = files.map((file, i) => ({
        id:   `${albumFolder}__${subFolder}__${i}`,
        src:  `/site-photos/${albumFolder}/${subFolder}/${file}`,
        from: accent,
        to:   accent,
      }));

      return {
        id:     subFolder,
        label:  toLabel(subFolder),
        date:   extractDate(subFolder),
        photos,
      };
    });

    // Also grab loose images at the top of the album folder (not in sub-folders)
    const looseFiles = fs
      .readdirSync(albumPath)
      .filter((n) => !n.startsWith(".") && IMAGE_EXTS.has(path.extname(n).toLowerCase()))
      .sort();

    if (looseFiles.length > 0) {
      subAlbums.unshift({
        id:    `${albumFolder}__root`,
        label: toLabel(albumFolder),
        date:  extractDate(albumFolder),
        photos: looseFiles.map((file, i) => ({
          id:   `${albumFolder}__root__${i}`,
          src:  `/site-photos/${albumFolder}/${file}`,
          from: accent,
          to:   accent,
        })),
      });
    }

    return { id: albumFolder, label: toLabel(albumFolder), accent, subAlbums };
  });

  return NextResponse.json(albums);
}

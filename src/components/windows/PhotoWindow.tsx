"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────
type Photo    = { id: string; src: string; from: string; to: string };
type SubAlbum = { id: string; label: string; date: string; photos: Photo[] };
type Album    = { id: string; label: string; accent: string; subAlbums: SubAlbum[] };

// ── Thumbnail item ─────────────────────────────────────────────
function ThumbnailItem({ photo, active, onClick }: { photo: Photo; active: boolean; onClick: (e: React.MouseEvent) => void }) {
  const [failed, setFailed] = useState(false);
  return (
    <button type="button" onClick={onClick}
      className="shrink-0 rounded overflow-hidden transition-all"
      style={{ width: 38, height: 38, outline: active ? "2px solid white" : "2px solid transparent", opacity: active ? 1 : 0.45, transition: "opacity 0.15s, outline 0.15s" }}>
      {!failed
        ? <img src={photo.src} alt="" onError={() => setFailed(true)} className="w-full h-full object-cover" draggable={false} />
        : <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${photo.from}, ${photo.to})` }} />
      }
    </button>
  );
}

// ── Preview cell ───────────────────────────────────────────────
function PreviewCell({ photo }: { photo: Photo }) {
  const [failed, setFailed] = useState(false);
  const show = Boolean(photo.src) && !failed;
  return (
    <div style={{ background: show ? "#e5e5ea" : `linear-gradient(135deg, ${photo.from}, ${photo.to})`, overflow: "hidden" }}>
      {show && <img src={photo.src} alt="" onError={() => setFailed(true)} className="w-full h-full object-cover" draggable={false} />}
    </div>
  );
}

// ── Lightbox ───────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir >= 0 ? "60%" : "-60%", opacity: 0, scale: 0.94 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit:  (dir: number) => ({ x: dir >= 0 ? "-60%" : "60%", opacity: 0, scale: 0.94 }),
};

function LightboxPhoto({ photo, onError }: { photo: Photo; onError: () => void }) {
  return (
    <img
      src={photo.src}
      alt=""
      draggable={false}
      onError={onError}
      style={{
        maxWidth: "86vw", maxHeight: "78vh",
        objectFit: "contain", borderRadius: 8,
        boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        pointerEvents: "none", userSelect: "none",
      }}
    />
  );
}

function Lightbox({
  photos, index, onClose, onChange,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onChange: (i: number, dir: number) => void;
}) {
  const photo = photos[index];
  const [failed, setFailed] = useState(false);
  const [direction, setDirection] = useState(0);

  useEffect(() => { setFailed(false); }, [index]);

  const prev = useCallback(() => {
    if (index > 0) { setDirection(-1); onChange(index - 1, -1); }
  }, [index, onChange]);

  const next = useCallback(() => {
    if (index < photos.length - 1) { setDirection(1); onChange(index + 1, 1); }
  }, [index, photos.length, onChange]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, prev, next]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16 }}
      className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden"
      style={{ background: "rgba(0,0,0,0.94)" }}
      onClick={onClose}
    >
      {/* Draggable photo area */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={index}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 380, damping: 36, mass: 0.8 },
            opacity: { duration: 0.18 },
            scale: { duration: 0.18 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={{ left: index < photos.length - 1 ? 0.18 : 0.04, right: index > 0 ? 0.18 : 0.04 }}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            const { offset, velocity } = info;
            if (offset.x < -60 || velocity.x < -400) next();
            else if (offset.x > 60 || velocity.x > 400) prev();
          }}
          className="flex items-center justify-center"
          style={{ cursor: "grab", touchAction: "none" }}
          whileDrag={{ cursor: "grabbing" }}
          onClick={(e) => e.stopPropagation()}
        >
          {failed ? (
            <div
              className="flex flex-col items-center justify-center rounded-xl gap-3"
              style={{ width: 300, height: 220, background: `linear-gradient(135deg, ${photo.from}, ${photo.to})` }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)">
                <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>Cannot preview (HEIC)</p>
              <a href={photo.src} download onClick={(e) => e.stopPropagation()}
                style={{ fontSize: 11, color: "#fff", background: "rgba(255,255,255,0.18)", padding: "4px 14px", borderRadius: 20, textDecoration: "none" }}>
                Download
              </a>
            </div>
          ) : (
            <LightboxPhoto photo={photo} onError={() => setFailed(true)} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Prev */}
      {index > 0 && (
        <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all hover:scale-110 hover:bg-white/20"
          style={{ width: 44, height: 44, background: "rgba(255,255,255,0.10)", backdropFilter: "blur(8px)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      )}

      {/* Next */}
      {index < photos.length - 1 && (
        <button type="button" onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all hover:scale-110 hover:bg-white/20"
          style={{ width: 44, height: 44, background: "rgba(255,255,255,0.10)", backdropFilter: "blur(8px)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      )}

      {/* Close */}
      <button type="button" onClick={onClose}
        className="absolute top-4 right-4 flex items-center justify-center rounded-full transition-all hover:scale-110 hover:bg-white/20"
        style={{ width: 36, height: 36, background: "rgba(255,255,255,0.10)", backdropFilter: "blur(8px)" }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
          <path d="M1 1l12 12M13 1L1 13"/>
        </svg>
      </button>

      {/* Counter */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[12px]"
        style={{ background: "rgba(0,0,0,0.45)", color: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}>
        {index + 1} / {photos.length}
      </div>

      {/* Thumbnails */}
      <div
        className="absolute bottom-[52px] left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-2 rounded-2xl overflow-x-auto max-w-[80vw]"
        style={{ background: "rgba(0,0,0,0.38)", backdropFilter: "blur(12px)", scrollbarWidth: "none" }}
        onClick={(e) => e.stopPropagation()}
      >
        {photos.map((p, i) => (
          <ThumbnailItem
            key={p.id}
            photo={p}
            active={i === index}
            onClick={(e) => { e.stopPropagation(); setDirection(i > index ? 1 : -1); onChange(i, i > index ? 1 : -1); }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ── Photo tile ─────────────────────────────────────────────────
function PhotoTile({
  photo, delay = 0, onClick,
}: {
  photo: Photo; delay?: number; onClick: () => void;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.14 }}
      className="relative overflow-hidden rounded-[4px] cursor-pointer group"
      style={{ aspectRatio: "1", background: failed ? `linear-gradient(135deg, ${photo.from}, ${photo.to})` : "#e5e5ea" }}
      onClick={onClick}
    >
      {!failed && (
        <img
          src={photo.src}
          alt=""
          draggable={false}
          onError={() => setFailed(true)}
          className="w-full h-full object-cover"
        />
      )}
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)">
            <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
        </div>
      )}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.10)" }} />
    </motion.div>
  );
}

// ── Sub-album card ─────────────────────────────────────────────
function SubAlbumCard({ sub, accent, onClick }: { sub: SubAlbum; accent: string; onClick: () => void }) {
  const preview = [...sub.photos.slice(0, 4)];
  while (preview.length < 4) preview.push({ id: `pad-${preview.length}`, src: "", from: "#e5e5ea", to: "#d1d1d6" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        borderRadius: 10, overflow: "hidden",
        display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 2,
        aspectRatio: "1",
        boxShadow: hovered ? "0 4px 18px rgba(0,0,0,0.16)" : "0 2px 8px rgba(0,0,0,0.09)",
        transform: hovered ? "scale(1.04)" : "scale(1)",
        transition: "box-shadow 0.15s, transform 0.15s",
      }}>
        {preview.map((p, i) => (
          <PreviewCell key={i} photo={p} />
        ))}
      </div>
      <p style={{ fontSize: 12, fontWeight: 600, color: "#1d1d1f", marginTop: 7, lineHeight: 1.3 }}>{sub.label}</p>
      <p style={{ fontSize: 11, color: "#8e8e93", marginTop: 1 }}>
        {sub.photos.length} items{sub.date ? ` · ${sub.date}` : ""}
      </p>
    </motion.div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────
function IconGrid() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>;
}
function IconFolder({ color }: { color: string }) {
  return <svg width="15" height="13" viewBox="0 0 16 14" fill={color}><path d="M1 3.5A1.5 1.5 0 012.5 2H6l1.5 2H13.5A1.5 1.5 0 0115 5.5v6A1.5 1.5 0 0113.5 13H2.5A1.5 1.5 0 011 11.5v-8z"/></svg>;
}
function SidebarRow({ icon, label, count, active, onClick }: {
  icon: React.ReactNode; label: string; count?: number; active: boolean; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-[5px] rounded-[7px] text-left"
      style={{ background: active ? "rgba(0,113,227,0.12)" : "transparent", color: active ? "#0071e3" : "#1d1d1f" }}
    >
      <span style={{ color: active ? "#0071e3" : "#6d6d72", flexShrink: 0 }}>{icon}</span>
      <span className="flex-1 truncate" style={{ fontSize: 12, fontWeight: active ? 600 : 400 }}>{label}</span>
      {count !== undefined && <span style={{ fontSize: 11, color: "#8e8e93" }}>{count}</span>}
    </button>
  );
}

type Nav =
  | { view: "library" }
  | { view: "subalbums"; albumId: string }
  | { view: "photos";   albumId: string; subAlbumId: string };

function BackBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="flex items-center gap-1 mb-2"
      style={{ fontSize: 12, color: "#0071e3", background: "none", border: "none", padding: 0, cursor: "pointer" }}
    >
      <svg width="7" height="11" viewBox="0 0 7 11" fill="none">
        <path d="M6 1L1 5.5L6 10" stroke="#0071e3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {label}
    </button>
  );
}

// ── Main ───────────────────────────────────────────────────────
export default function PhotoWindow() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [nav, setNav] = useState<Nav>({ view: "library" });
  const [lightbox, setLightbox] = useState<{ photos: Photo[]; index: number } | null>(null);

  useEffect(() => {
    fetch("/api/photos")
      .then((r) => r.json())
      .then((data) => { setAlbums(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const allPhotos = albums.flatMap((a) => a.subAlbums.flatMap((s) => s.photos));
  const activeAlbum    = "albumId" in nav ? albums.find((a) => a.id === nav.albumId) : undefined;
  const activeSubAlbum = nav.view === "photos" ? activeAlbum?.subAlbums.find((s) => s.id === nav.subAlbumId) : undefined;
  const sidebarActive  = "albumId" in nav ? nav.albumId : "library";
  const displayedSubAlbums = nav.view === "subalbums" ? (activeAlbum?.subAlbums ?? []) : [];

  const title = nav.view === "library" ? "Library"
    : nav.view === "subalbums" ? activeAlbum?.label ?? ""
    : activeSubAlbum?.label ?? "";

  const subtitle = nav.view === "library" ? `${allPhotos.length} items`
    : nav.view === "subalbums" ? `${displayedSubAlbums.length} albums`
    : `${activeSubAlbum?.photos.length ?? 0} items${activeSubAlbum?.date ? ` · ${activeSubAlbum.date}` : ""}`;

  const openLightbox = (photos: Photo[], index: number) => setLightbox({ photos, index });

  return (
    <>
      <div className="h-full flex overflow-hidden select-none" style={{ background: "#ffffff", fontFamily: "-apple-system,sans-serif" }}>
        {/* Sidebar */}
        <div className="flex flex-col flex-shrink-0 py-3" style={{ width: 190, background: "#f5f5f7", borderRight: "1px solid rgba(0,0,0,0.08)" }}>
          <div className="px-3 mb-1">
            <SidebarRow icon={<IconGrid />} label="Library" active={sidebarActive === "library"} onClick={() => setNav({ view: "library" })} />
          </div>
          <div className="mx-3 my-2 h-px" style={{ background: "rgba(0,0,0,0.07)" }} />
          <div className="px-3 flex-1 overflow-y-auto">
            <p style={{ fontSize: 11, fontWeight: 600, color: "#6d6d72", letterSpacing: "0.04em", textTransform: "uppercase", padding: "2px 4px 6px" }}>
              Albums
            </p>
            {loading ? (
              <p style={{ fontSize: 12, color: "#8e8e93", padding: "4px" }}>Loading…</p>
            ) : albums.map((album) => (
              <SidebarRow
                key={album.id}
                icon={<IconFolder color={album.accent} />}
                label={album.label}
                count={album.subAlbums.length}
                active={sidebarActive === album.id}
                onClick={() => setNav({ view: "subalbums", albumId: album.id })}
              />
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-5 pt-4 pb-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
            {nav.view === "photos" && (
              <BackBtn label={activeAlbum?.label ?? "Back"} onClick={() => setNav({ view: "subalbums", albumId: (nav as { albumId: string }).albumId })} />
            )}
            {nav.view === "subalbums" && (
              <BackBtn label="Library" onClick={() => setNav({ view: "library" })} />
            )}
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1d1d1f", lineHeight: 1.2 }}>{title}</h2>
            <p style={{ fontSize: 11, color: "#8e8e93", marginTop: 2 }}>{subtitle}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p style={{ fontSize: 13, color: "#8e8e93" }}>Loading photos…</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {nav.view === "library" && (
                  <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.13 }}
                    style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 3 }}>
                    {allPhotos.map((photo, i) => (
                      <PhotoTile key={photo.id} photo={photo} delay={i * 0.008} onClick={() => openLightbox(allPhotos, i)} />
                    ))}
                    {allPhotos.length === 0 && (
                      <p className="col-span-5 text-center pt-16" style={{ color: "#8e8e93", fontSize: 13 }}>
                        No photos yet — add images to public/photos folders.
                      </p>
                    )}
                  </motion.div>
                )}

                {nav.view === "subalbums" && (
                  <motion.div key={nav.albumId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.13 }}
                    style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 20 }}>
                    {displayedSubAlbums.map((sub) => (
                      <SubAlbumCard
                        key={sub.id} sub={sub} accent={activeAlbum?.accent ?? "#888"}
                        onClick={() => setNav({ view: "photos", albumId: (nav as { albumId: string }).albumId, subAlbumId: sub.id })}
                      />
                    ))}
                  </motion.div>
                )}

                {nav.view === "photos" && (
                  <motion.div key={nav.subAlbumId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.13 }}
                    style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3 }}>
                    {(activeSubAlbum?.photos ?? []).map((photo, i) => (
                      <PhotoTile
                        key={photo.id} photo={photo} delay={i * 0.025}
                        onClick={() => openLightbox(activeSubAlbum!.photos, i)}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox portal */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            photos={lightbox.photos}
            index={lightbox.index}
            onClose={() => setLightbox(null)}
            onChange={(i) => setLightbox({ ...lightbox, index: i })}
          />
        )}
      </AnimatePresence>
    </>
  );
}

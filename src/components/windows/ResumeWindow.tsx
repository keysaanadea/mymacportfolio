"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type CVId = "portfolio" | "general";

const DOCS: {
  id: CVId;
  label: string;
  sidebarLabel: string;
  src: string;
  filename: string;
  pages: number;
  previewWidth: number;
  previewFolder: string;
  previewPad: number;
}[] = [
  {
    id: "general",
    label: "CV ATS",
    sidebarLabel: "CV ATS",
    src: "/resume/resume-general.pdf",
    filename: "Keysa_Anadea_CV_ATS.pdf",
    pages: 2,
    previewWidth: 920,
    previewFolder: "/resume/previews/general",
    previewPad: 1,
  },
  {
    id: "portfolio",
    label: "Portfolio",
    sidebarLabel: "Portfolio",
    src: "/resume/portfolio.pdf",
    filename: "Keysa_Anadea_Portfolio.pdf",
    pages: 17,
    previewWidth: 900,
    previewFolder: "/resume/previews/portfolio",
    previewPad: 2,
  },
];

function DescriptionIcon({ active = false }: { active?: boolean }) {
  const stroke = active ? "#ffffff" : "#31425f";
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
      <path d="M14 2v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  );
}

function FolderSharedIcon({ active = false }: { active?: boolean }) {
  const stroke = active ? "#ffffff" : "#31425f";
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <path d="M12 11a2.5 2.5 0 1 0 0-.01Z" />
      <path d="M16.5 18a4.5 4.5 0 0 0-9 0" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#72798a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-3.8-3.8" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#72798a" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#72798a">
      <circle cx="5" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="12" r="1.8" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#72798a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v11" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  );
}

function ClampIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#72798a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M16 3h3a2 2 0 0 1 2 2v3" />
      <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function ZoomOutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#495062" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-3.8-3.8" />
      <path d="M8.5 11h5" />
    </svg>
  );
}

function ZoomInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#495062" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-3.8-3.8" />
      <path d="M11 8.5v5" />
      <path d="M8.5 11h5" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#495062" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#495062" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default function ResumeWindow() {
  const [active, setActive] = useState<CVId>("general");
  const [zoom, setZoom] = useState(100);
  const [page, setPage] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const doc = useMemo(() => DOCS.find((item) => item.id === active)!, [active]);
  const pageSources = useMemo(
    () =>
      Array.from(
        { length: doc.pages },
        (_, index) => `${doc.previewFolder}/page-${String(index + 1).padStart(doc.previewPad, "0")}.png`
      ),
    [doc.pages, doc.previewFolder, doc.previewPad]
  );

  useEffect(() => {
    setPage(1);
    setZoom(100);
  }, [active]);

  const decreaseZoom = () => setZoom((current) => Math.max(75, current - 25));
  const increaseZoom = () => setZoom((current) => Math.min(150, current + 25));
  const scrollToPage = (targetPage: number) => {
    const node = pageRefs.current[targetPage - 1];
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "start" });
    setPage(targetPage);
  };
  const previousPage = () => scrollToPage(Math.max(1, page - 1));
  const nextPage = () => scrollToPage(Math.min(doc.pages, page + 1));

  useEffect(() => {
    pageRefs.current = pageRefs.current.slice(0, doc.pages);
  }, [doc.pages]);

  const handlePreviewScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerTop = container.getBoundingClientRect().top;
    let closestPage = 1;
    let closestDistance = Number.POSITIVE_INFINITY;

    pageRefs.current.forEach((node, index) => {
      if (!node) return;
      const distance = Math.abs(node.getBoundingClientRect().top - containerTop - 24);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPage = index + 1;
      }
    });

    if (closestPage !== page) {
      setPage(closestPage);
    }
  };

  return (
    <div
      className="flex h-full overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #f4f3f8 0%, #eeedf3 100%)",
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      }}
    >
      <div
        className="flex h-full w-full flex-col overflow-hidden"
        style={{
          background: "rgba(250,249,254,0.84)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
        }}
      >
        <div className="flex min-h-0 flex-1">
          <aside
            className="flex w-[218px] shrink-0 flex-col border-r px-4 py-5"
            style={{
              background: "rgba(248,248,252,0.66)",
              borderColor: "rgba(193,198,215,0.38)",
            }}
          >
            <p className="mb-4 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9aa7bd]">
              Library
            </p>

            <div className="space-y-1">
              {DOCS.map((item) => {
                const isActive = item.id === active;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActive(item.id)}
                    className="flex w-full items-center gap-3 rounded-[12px] px-3 py-3 text-left transition"
                    style={{
                      background: isActive ? "linear-gradient(180deg, #3a70f3 0%, #2d5fe0 100%)" : "transparent",
                      color: isActive ? "#ffffff" : "#31425f",
                      boxShadow: isActive ? "0 8px 18px rgba(47,95,224,0.22)" : "none",
                    }}
                  >
                    {item.id === "portfolio" ? <FolderSharedIcon active={isActive} /> : <DescriptionIcon active={isActive} />}
                    <span className="text-[13px] font-medium">{item.sidebarLabel}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
            <div
              className="flex h-[54px] shrink-0 items-center justify-between border-b px-5"
              style={{
                background: "rgba(255,255,255,0.74)",
                borderColor: "rgba(193,198,215,0.42)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)",
              }}
            >
              <div className="flex items-center gap-2 text-[#3f4b64]">
                <DescriptionIcon />
                <span className="text-[13px] font-medium">{doc.filename}</span>
                <ChevronDownIcon />
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={doc.src}
                  download={doc.filename}
                  className="rounded-md p-1 transition hover:bg-[#eef1f7]"
                  aria-label={`Download ${doc.filename}`}
                >
                  <DownloadIcon />
                </a>
                <button type="button" className="rounded-md p-1 transition hover:bg-[#eef1f7]">
                  <SearchIcon />
                </button>
                <button type="button" className="rounded-md p-1 transition hover:bg-[#eef1f7]">
                  <MoreIcon />
                </button>
              </div>
            </div>

            <div
              ref={scrollContainerRef}
              onScroll={handlePreviewScroll}
              className="flex-1 overflow-y-auto px-8 py-7 pb-28"
              style={{ background: "rgba(244,243,248,0.42)" }}
            >
              <div className="mx-auto flex w-full max-w-[1180px] justify-center">
                <div className="flex flex-col gap-6">
                  {pageSources.map((src, index) => (
                    <div
                      key={src}
                      ref={(node) => {
                        pageRefs.current[index] = node;
                      }}
                      className="overflow-hidden border border-[#ececf1] bg-white"
                      style={{
                        width: `${doc.previewWidth * (zoom / 100)}px`,
                        boxShadow: "0 18px 45px rgba(36,43,62,0.10)",
                      }}
                    >
                      <Image
                        src={src}
                        alt={`${doc.label} page ${index + 1}`}
                        width={doc.previewWidth}
                        height={Math.round(doc.previewWidth * 1.414)}
                        className="block h-auto w-full"
                        priority={index === 0}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2">
              <div
                className="pointer-events-auto flex items-center overflow-hidden rounded-full border"
                style={{
                  background: "rgba(255,255,255,0.84)",
                  borderColor: "rgba(193,198,215,0.45)",
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  boxShadow: "0 12px 28px rgba(36,43,62,0.10)",
                }}
              >
                <button type="button" onClick={decreaseZoom} className="flex h-12 w-12 items-center justify-center transition hover:bg-[#f3f5fb]">
                  <ZoomOutIcon />
                </button>
                <div className="h-6 w-px bg-[#dde2ea]" />
                <div className="min-w-[76px] px-4 text-center text-[12px] font-medium text-[#343d51]">{zoom}%</div>
                <div className="h-6 w-px bg-[#dde2ea]" />
                <button type="button" onClick={increaseZoom} className="flex h-12 w-12 items-center justify-center transition hover:bg-[#f3f5fb]">
                  <ZoomInIcon />
                </button>
                <div className="mx-1 h-6 w-px bg-[#dde2ea]" />
                <button type="button" onClick={previousPage} className="flex h-12 w-12 items-center justify-center transition hover:bg-[#f3f5fb]">
                  <ChevronLeftIcon />
                </button>
                <div className="min-w-[58px] px-2 text-center text-[12px] text-[#4a5266]">
                  <span className="font-semibold text-[#1a1b1f]">{page}</span> / {doc.pages}
                </div>
                <button type="button" onClick={nextPage} className="flex h-12 w-12 items-center justify-center transition hover:bg-[#f3f5fb]">
                  <ChevronRightIcon />
                </button>
                <div className="mx-1 h-6 w-px bg-[#dde2ea]" />
                <a
                  href={doc.src}
                  download={doc.filename}
                  className="flex h-12 w-12 items-center justify-center transition hover:bg-[#f3f5fb]"
                  aria-label={`Download ${doc.filename}`}
                >
                  <DownloadIcon />
                </a>
                <button type="button" className="flex h-12 w-12 items-center justify-center transition hover:bg-[#f3f5fb]">
                  <ClampIcon />
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

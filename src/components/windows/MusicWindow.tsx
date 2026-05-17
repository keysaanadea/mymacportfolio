"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { musicAlbum } from "@/data/portfolio";

function fmt(s: number) {
  const n = Math.floor(Math.max(0, s));
  return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`;
}

export default function MusicWindow() {
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing,  setPlaying]  = useState(false);
  const [current,  setCurrent]  = useState(0);
  const [dur,      setDur]      = useState(musicAlbum.tracks[0].duration);

  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const autoPlay    = useRef(false);
  const trackIdxRef = useRef(0);
  trackIdxRef.current = trackIdx;
  const playingRef  = useRef(false);
  playingRef.current = playing;

  /* mount: create audio element + persistent event listeners */
  useEffect(() => {
    const a = new Audio();
    audioRef.current = a;

    a.addEventListener("timeupdate",     () => setCurrent(a.currentTime));
    a.addEventListener("loadedmetadata", () => setDur(a.duration));
    a.addEventListener("ended", () => {
      const next = trackIdxRef.current + 1;
      if (next < musicAlbum.tracks.length) {
        autoPlay.current = true;
        setTrackIdx(next);
        setPlaying(true);
      } else {
        setPlaying(false);
        setCurrent(0);
      }
    });

    return () => { a.pause(); audioRef.current = null; };
  }, []);

  /* when trackIdx changes: load new src, autoplay if flagged */
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const t = musicAlbum.tracks[trackIdx];
    a.pause();
    a.src = t.audioSrc;
    a.load();
    setCurrent(0);
    setDur(t.duration);
    if (autoPlay.current) {
      a.play().catch(() => {});
      autoPlay.current = false;
    }
  }, [trackIdx]);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playingRef.current) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().catch(() => {});
      setPlaying(true);
    }
  }, []);

  const pickTrack = useCallback((i: number) => {
    if (i === trackIdxRef.current) {
      togglePlay();
      return;
    }
    autoPlay.current = true;
    setTrackIdx(i);
    setPlaying(true);
  }, [togglePlay]);

  const prev = useCallback(() => {
    const a = audioRef.current;
    if (a && a.currentTime > 3) {
      a.currentTime = 0;
      setCurrent(0);
      return;
    }
    if (trackIdxRef.current > 0) {
      autoPlay.current = playingRef.current;
      setTrackIdx(i => i - 1);
    }
  }, []);

  const next = useCallback(() => {
    if (trackIdxRef.current < musicAlbum.tracks.length - 1) {
      autoPlay.current = playingRef.current;
      setTrackIdx(i => i + 1);
    }
  }, []);

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !dur) return;
    const r = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    a.currentTime = pct * dur;
    setCurrent(pct * dur);
  }, [dur]);

  const track = musicAlbum.tracks[trackIdx];
  const pct   = dur > 0 ? (current / dur) * 100 : 0;

  return (
    <div
      className="h-full flex flex-col overflow-hidden select-none"
      style={{ background: "#111", fontFamily: "-apple-system,BlinkMacSystemFont,sans-serif", position: "relative" }}
    >
      {/* Ambient gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${musicAlbum.coverGradient}`}
        style={{ opacity: 0.18, filter: "blur(60px)", pointerEvents: "none" }}
      />
      <div className="absolute inset-0" style={{ background: "rgba(10,10,13,0.84)", pointerEvents: "none" }} />

      {/* ── Album header ──────────────────────────────── */}
      <div className="relative flex items-center gap-4 px-5 pt-5 pb-4 flex-shrink-0">
        {/* Album art */}
        <div
          className={`w-[88px] h-[88px] flex-shrink-0 rounded-[16px] bg-gradient-to-br ${musicAlbum.coverGradient} flex items-center justify-center text-[38px]`}
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.65)" }}
        >
          🎵
        </div>

        {/* Album meta */}
        <div className="flex flex-col min-w-0">
          <p style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.94)", lineHeight: 1.25, marginBottom: 2 }}>
            {musicAlbum.title}
          </p>
          <p style={{ fontSize: 13, color: "#fc3c44", fontWeight: 600, marginBottom: 6 }}>
            {musicAlbum.artist}
          </p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.30)" }}>
            {musicAlbum.year} · {musicAlbum.tracks.length} songs
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="relative mx-4 flex-shrink-0" style={{ height: "0.5px", background: "rgba(255,255,255,0.10)" }} />

      {/* ── Track list ────────────────────────────────── */}
      <div className="relative flex-1 overflow-y-auto py-1">
        {musicAlbum.tracks.map((t, i) => {
          const active = i === trackIdx;
          return (
            <button
              key={t.id}
              onClick={() => pickTrack(i)}
              className="w-full flex items-center gap-3 text-left transition-colors"
              style={{
                padding: "9px 20px",
                background: active ? "rgba(255,255,255,0.08)" : "transparent",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              {/* Track number / playing indicator */}
              <div className="w-4 flex-shrink-0 flex items-center justify-center">
                {active && playing ? (
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="#fc3c44">
                    <rect x="0" y="2" width="3" height="7" rx="1">
                      <animate attributeName="height" values="7;3;7" dur="0.8s" repeatCount="indefinite"/>
                      <animate attributeName="y" values="2;4;2" dur="0.8s" repeatCount="indefinite"/>
                    </rect>
                    <rect x="4" y="0" width="3" height="11" rx="1">
                      <animate attributeName="height" values="11;5;11" dur="0.8s" begin="0.2s" repeatCount="indefinite"/>
                      <animate attributeName="y" values="0;3;0" dur="0.8s" begin="0.2s" repeatCount="indefinite"/>
                    </rect>
                    <rect x="8" y="3" width="3" height="5" rx="1">
                      <animate attributeName="height" values="5;9;5" dur="0.8s" begin="0.4s" repeatCount="indefinite"/>
                      <animate attributeName="y" values="3;1;3" dur="0.8s" begin="0.4s" repeatCount="indefinite"/>
                    </rect>
                  </svg>
                ) : (
                  <span style={{ fontSize: 12, color: active ? "#fc3c44" : "rgba(255,255,255,0.28)", fontVariantNumeric: "tabular-nums" }}>
                    {i + 1}
                  </span>
                )}
              </div>

              {/* Title */}
              <span
                className="flex-1 truncate"
                style={{
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.68)",
                }}
              >
                {t.title}
              </span>

              {/* Duration */}
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.24)", flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
                {fmt(t.duration)}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Player controls ───────────────────────────── */}
      <div
        className="relative flex-shrink-0"
        style={{ borderTop: "0.5px solid rgba(255,255,255,0.10)", padding: "12px 20px 18px" }}
      >
        {/* Now playing text */}
        <p style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.84)", marginBottom: 2, lineHeight: 1.3 }}>
          {track.title}
        </p>
        <p style={{ textAlign: "center", fontSize: 11, color: "#fc3c44", marginBottom: 10 }}>
          {musicAlbum.artist}
        </p>

        {/* Progress bar */}
        <div
          className="w-full rounded-full cursor-pointer mb-[5px]"
          style={{ height: 3, background: "rgba(255,255,255,0.12)" }}
          onClick={seek}
        >
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, background: "#fc3c44", transition: "width 0.2s linear" }}
          />
        </div>

        {/* Time labels */}
        <div
          className="flex justify-between mb-4"
          style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", fontVariantNumeric: "tabular-nums" }}
        >
          <span>{fmt(current)}</span>
          <span>-{fmt(Math.max(0, dur - current))}</span>
        </div>

        {/* Transport buttons */}
        <div className="flex items-center justify-center gap-9">
          {/* Previous */}
          <button
            onClick={prev}
            className="transition-opacity hover:opacity-60 active:opacity-40"
            style={{ color: "rgba(255,255,255,0.75)", background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0 }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
            </svg>
          </button>

          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            className="flex items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95"
            style={{
              width: 46, height: 46,
              background: "#fc3c44",
              border: "none", cursor: "pointer",
              boxShadow: "0 4px 20px rgba(252,60,68,0.45)",
              lineHeight: 0,
            }}
          >
            {playing ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="4" width="4" height="16" rx="1.5"/>
                <rect x="14" y="4" width="4" height="16" rx="1.5"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M8 5.14v14l11-7-11-7z"/>
              </svg>
            )}
          </button>

          {/* Next */}
          <button
            onClick={next}
            className="transition-opacity hover:opacity-60 active:opacity-40"
            style={{ color: "rgba(255,255,255,0.75)", background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0 }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12z"/>
              <rect x="16" y="6" width="2" height="12" rx="1"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

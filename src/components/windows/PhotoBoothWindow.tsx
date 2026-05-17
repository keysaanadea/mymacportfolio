"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EFFECTS = [
  { id: "normal",   label: "Normal",      filter: "none" },
  { id: "bw",       label: "Noir",        filter: "grayscale(100%) contrast(115%)" },
  { id: "sepia",    label: "Sepia",       filter: "sepia(90%) contrast(105%)" },
  { id: "vivid",    label: "Vivid",       filter: "saturate(260%) contrast(118%) brightness(105%)" },
  { id: "cool",     label: "Cool",        filter: "hue-rotate(190deg) saturate(130%)" },
  { id: "warm",     label: "Warm",        filter: "sepia(50%) hue-rotate(-12deg) saturate(160%) brightness(108%)" },
  { id: "invert",   label: "X-Ray",       filter: "invert(100%) hue-rotate(180deg) contrast(120%)" },
] as const;

type EffectId = typeof EFFECTS[number]["id"];

export default function PhotoBoothWindow() {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [permission, setPermission]     = useState<"unknown" | "granted" | "denied">("unknown");
  const [effect, setEffect]             = useState<EffectId>("normal");
  const [photos, setPhotos]             = useState<string[]>([]);
  const [countdown, setCountdown]       = useState<number | null>(null);
  const [flash, setFlash]               = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const cssFilter = EFFECTS.find(e => e.id === effect)?.filter ?? "none";

  /* ── start camera ── */
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setPermission("granted");
    } catch {
      setPermission("denied");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()); };
  }, [startCamera]);

  /* ── capture frame ── */
  const captureFrame = useCallback(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mirror + apply CSS filter
    ctx.filter = cssFilter;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setPhotos(prev => [dataUrl, ...prev].slice(0, 8));

    // Flash
    setFlash(true);
    setTimeout(() => setFlash(false), 350);
  }, [cssFilter]);

  /* ── 3-second countdown then capture ── */
  const handleShutter = useCallback(() => {
    if (countdown !== null) return;
    setCountdown(3);
    let n = 3;
    const tick = setInterval(() => {
      n -= 1;
      if (n === 0) {
        clearInterval(tick);
        setCountdown(null);
        captureFrame();
      } else {
        setCountdown(n);
      }
    }, 1000);
  }, [countdown, captureFrame]);

  /* ── download photo ── */
  const download = useCallback((url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `photobooth-${Date.now()}.jpg`;
    a.click();
  }, []);

  /* ── Permission denied screen ── */
  if (permission === "denied") {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4"
        style={{ background: "#1a1a1a", fontFamily: "-apple-system,sans-serif" }}>
        <span style={{ fontSize: 48 }}>📷</span>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, fontWeight: 600 }}>Camera Access Required</p>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textAlign: "center", maxWidth: 260, lineHeight: 1.6 }}>
          Allow camera access in your browser settings to use Photo Booth.
        </p>
        <button
          onClick={startCamera}
          className="px-4 py-2 rounded-lg text-white text-sm font-medium"
          style={{ background: "#007aff", border: "none", cursor: "pointer" }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden select-none"
      style={{ background: "#1a1a1a", fontFamily: "-apple-system,sans-serif" }}>

      {/* ── Camera preview ── */}
      <div className="flex-1 relative overflow-hidden" style={{ minHeight: 0 }}>
        {/* Video */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: "scaleX(-1)",
            filter: cssFilter,
            background: "#000",
          }}
        />

        {/* Loading state */}
        {permission === "unknown" && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: "#000" }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Starting camera…</p>
          </div>
        )}

        {/* Flash overlay */}
        <AnimatePresence>
          {flash && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "#fff" }}
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        {/* Countdown overlay */}
        <AnimatePresence>
          {countdown !== null && (
            <motion.div
              key={countdown}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 1.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.3 }}
            >
              <span style={{ fontSize: 120, fontWeight: 800, color: "rgba(255,255,255,0.9)", textShadow: "0 4px 24px rgba(0,0,0,0.7)" }}>
                {countdown}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Effect label */}
        {effect !== "normal" && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
              {EFFECTS.find(e => e.id === effect)?.label}
            </p>
          </div>
        )}
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ── Photo strip ── */}
      {photos.length > 0 && (
        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2"
          style={{ background: "#111", borderTop: "1px solid rgba(255,255,255,0.06)", height: 76 }}>
          {photos.map((url, i) => (
            <button
              key={i}
              onClick={() => setSelectedPhoto(url)}
              className="flex-shrink-0 rounded-[6px] overflow-hidden transition-transform hover:scale-105"
              style={{ width: 56, height: 56, border: "2px solid rgba(255,255,255,0.12)", padding: 0, cursor: "pointer" }}
            >
              <img src={url} alt="" className="w-full h-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      )}

      {/* ── Controls ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-3"
        style={{ background: "#111", borderTop: "1px solid rgba(255,255,255,0.06)" }}>

        {/* Effect picker */}
        <div className="flex items-center gap-1 overflow-x-auto" style={{ maxWidth: "50%" }}>
          {EFFECTS.map(e => (
            <button
              key={e.id}
              onClick={() => setEffect(e.id)}
              className="flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium transition-colors"
              style={{
                background: effect === e.id ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.07)",
                color: effect === e.id ? "#fff" : "rgba(255,255,255,0.45)",
                border: "none", cursor: "pointer", fontSize: 11,
              }}
            >
              {e.label}
            </button>
          ))}
        </div>

        {/* Shutter button */}
        <button
          onClick={handleShutter}
          disabled={countdown !== null || permission !== "granted"}
          className="flex-shrink-0 rounded-full transition-transform hover:scale-105 active:scale-95"
          style={{
            width: 52, height: 52,
            background: countdown !== null ? "rgba(255,59,48,0.5)" : "#ff3b30",
            border: "3px solid rgba(255,255,255,0.25)",
            cursor: countdown !== null ? "default" : "pointer",
            boxShadow: "0 4px 20px rgba(255,59,48,0.4)",
          }}
        />
      </div>

      {/* ── Photo lightbox ── */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-50"
            style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              exit={{ scale: 0.88,    opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={e => e.stopPropagation()}
              className="flex flex-col items-center gap-3"
            >
              <img
                src={selectedPhoto}
                alt=""
                draggable={false}
                className="rounded-[12px]"
                style={{ maxWidth: "90%", maxHeight: "70vh", boxShadow: "0 24px 64px rgba(0,0,0,0.7)" }}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => download(selectedPhoto)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ background: "#007aff", border: "none", cursor: "pointer" }}
                >
                  Save Photo
                </button>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", border: "none", cursor: "pointer" }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const PORTRAIT_SRC = "/photos/portraits/formal-portraits/IMG_5494 2.jpg";

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 px-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/40 bg-[linear-gradient(145deg,rgba(255,255,255,0.88),rgba(244,241,231,0.92))] text-[#1b1b1f] shadow-[0_30px_80px_rgba(13,13,18,0.28)]"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/70 text-lg text-[#1b1b1f] transition hover:bg-white"
              aria-label="Close welcome popup"
            >
              ×
            </button>

            <div className="grid md:grid-cols-[0.95fr_1.05fr]">
              <div className="relative min-h-[240px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_42%),linear-gradient(160deg,#d9ddd4_0%,#c9cdc3_100%)]">
                <Image
                  src={PORTRAIT_SRC}
                  alt="Portrait of Keysa Anadea"
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(20,20,24,0.3)_100%)]" />
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/25 bg-black/20 px-4 py-3 backdrop-blur-md">
                  <p className="text-sm font-semibold text-white">Keysa Anadea Aqiva Ajie</p>
                  <p className="mt-1 text-xs text-white/80">
                    Interested in roles across AI, machine learning, and data
                  </p>
                </div>
              </div>

              <div className="p-6 md:p-7">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1b1b1f]/10 bg-white/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#5d5f69]">
                  Welcome
                </div>

                <h2 className="max-w-md text-2xl font-semibold leading-tight md:text-[2rem]">
                  Hi, welcome to my portfolio.
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-[#4d505a] md:text-[15px]">
                  To explore what each app does, check the notifications on the desktop. They include a quick guide to help you navigate everything more easily.
                </p>

                <div className="mt-4 rounded-2xl border border-[#1b1b1f]/10 bg-white/55 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6a6d77]">
                    Quick tip
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#40434c]">
                    Open the apps one by one, follow the notifications, and feel free to click around the desktop experience.
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex items-center justify-center rounded-2xl bg-[#1b1b1f] px-5 py-3 text-sm font-medium text-white transition hover:bg-black"
                  >
                    Explore now
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex items-center justify-center rounded-2xl border border-[#1b1b1f]/12 bg-white/70 px-5 py-3 text-sm font-medium text-[#1b1b1f] transition hover:bg-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

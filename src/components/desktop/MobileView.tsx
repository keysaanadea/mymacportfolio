"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LaptopMinimal, Mail, Monitor, MoveUpRight, Phone } from "lucide-react";
import { profile } from "@/data/portfolio";

const PORTRAIT_SRC = "/site-assets/portraits/welcome-portrait.jpg";

export default function MobileView() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#111111] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_22%),linear-gradient(180deg,#1a1a1a_0%,#121212_48%,#0c0c0c_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0%,transparent_26%,transparent_74%,rgba(255,255,255,0.03)_100%)]" />
      <div className="absolute left-1/2 top-[-120px] h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

      <main className="relative flex min-h-screen items-center justify-center px-4 py-5">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-[22rem] rounded-[28px] border border-white/10 bg-white/[0.05] p-2.5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
        >
          <div className="overflow-hidden rounded-[22px] border border-white/8 bg-[#181818]">
            <div className="relative aspect-[4/4.7]">
              <Image
                src={PORTRAIT_SRC}
                alt={`Portrait of ${profile.name}`}
                fill
                priority
                sizes="100vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.08)_0%,rgba(5,5,5,0.28)_35%,rgba(5,5,5,0.82)_100%)]" />

              <div className="absolute left-3.5 right-3.5 top-3.5 flex items-center justify-between gap-2">
                <div className="rounded-full border border-white/14 bg-black/20 px-2.5 py-1 text-[10px] font-medium tracking-[0.2em] text-white/80 backdrop-blur-md">
                  PORTFOLIO
                </div>
                <div className="rounded-full border border-white/14 bg-white/10 px-2.5 py-1 text-[10px] text-white/66 backdrop-blur-md">
                  Desktop Only
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/52">
                  {profile.location}
                </p>
                <h1 className="mt-2 text-[24px] font-semibold leading-[1.02] text-white">
                  {profile.name}
                </h1>
                <p className="mt-1.5 max-w-[14rem] text-[13px] leading-5 text-white/72">
                  {profile.role}
                </p>
              </div>
            </div>

            <div className="px-4 pb-4 pt-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/42">
                <LaptopMinimal className="h-3.5 w-3.5" strokeWidth={1.8} />
                Best On Larger Screens
              </div>

              <h2 className="mt-3 text-[21px] font-semibold leading-[1.16] text-white">
                Open this portfolio on a laptop or desktop.
              </h2>

              <p className="mt-3 text-[13px] leading-6 text-white/60">
                The experience is built as an interactive macOS-style environment and is intentionally designed for larger screens.
              </p>

              <div className="mt-4 rounded-[20px] border border-white/8 bg-white/[0.04] p-3.5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-2xl border border-white/10 bg-white/[0.06] p-2">
                    <Monitor className="h-3.5 w-3.5 text-white/72" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-white">Recommended access</p>
                    <p className="mt-1 text-[13px] leading-5 text-white/52">
                      MacBook, laptop, PC, or any larger display.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-2.5">
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white px-4 py-3.5 text-[#121212] transition hover:bg-white/92"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-2xl bg-[#f2f2f2] p-2">
                      <Mail className="h-3.5 w-3.5 text-[#5b5b5b]" strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium">Email</p>
                      <p className="mt-1 truncate text-[13px] text-[#5b5b5b]">{profile.email}</p>
                    </div>
                  </div>
                  <MoveUpRight className="h-4 w-4 shrink-0 text-[#5b5b5b]" strokeWidth={1.8} />
                </a>

                <a
                  href="https://wa.me/6281218522763"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white px-4 py-3.5 text-[#121212] transition hover:bg-white/92"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-2xl bg-[#f2f2f2] p-2">
                      <Phone className="h-3.5 w-3.5 text-[#5b5b5b]" strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium">WhatsApp</p>
                      <p className="mt-1 truncate text-[13px] text-[#5b5b5b]">+62 812-1852-2763</p>
                    </div>
                  </div>
                  <MoveUpRight className="h-4 w-4 shrink-0 text-[#5b5b5b]" strokeWidth={1.8} />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

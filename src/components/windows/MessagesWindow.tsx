"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { messages, profile } from "@/data/portfolio";

export default function MessagesWindow() {
  const [visible, setVisible] = useState<number>(0);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible >= messages.length) return;
    const timeout = setTimeout(() => setVisible((v) => v + 1), 800);
    return () => clearTimeout(timeout);
  }, [visible]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visible]);

  const shownMessages = messages.slice(0, visible);

  return (
    <div className="flex flex-col h-full" style={{ background: "rgba(10,10,14,0.95)" }}>
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-semibold text-white">
          {profile.name.charAt(0)}
        </div>
        <div>
          <p className="text-white/90 text-sm font-semibold">{profile.name}</p>
          <p className="text-green-400 text-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Active now
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 scrollbar-thin scrollbar-thumb-white/10">
        <AnimatePresence>
          {shownMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className={`flex ${msg.isMe ? "justify-end" : "justify-start"} items-end gap-2`}
            >
              {!msg.isMe && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {profile.name.charAt(0)}
                </div>
              )}
              <div
                className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm leading-snug ${
                  msg.isMe
                    ? "rounded-br-sm text-white"
                    : "rounded-bl-sm text-white/90"
                }`}
                style={{
                  background: msg.isMe
                    ? "linear-gradient(135deg, #3b82f6, #2563eb)"
                    : "rgba(44, 44, 52, 0.95)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {visible < messages.length && (
          <div className="flex justify-start items-center gap-2 pl-8">
            <div className="flex gap-1 px-3 py-2 rounded-2xl rounded-bl-sm" style={{ background: "rgba(44,44,52,0.95)" }}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div
        className="flex items-center gap-2 px-3 py-2.5 shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <button className="text-white/30 hover:text-white/60 transition-colors text-lg">+</button>
        <div
          className="flex-1 flex items-center px-3 py-1.5 rounded-full text-sm text-white/30"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="iMessage"
            className="flex-1 bg-transparent outline-none text-white/70 placeholder-white/30 text-sm"
          />
        </div>
        {input && (
          <button
            onClick={() => setInput("")}
            className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs transition-all hover:bg-blue-600"
          >
            ↑
          </button>
        )}
      </div>
    </div>
  );
}

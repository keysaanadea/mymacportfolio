"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { terminalData } from "@/data/portfolio";

interface HistoryEntry {
  type: "input" | "output" | "error";
  content: string;
}

const PROMPT = "keysa@Keysas-MacBook-Pro ~ %";
const WELCOME = `Last login: Thu Apr 30 09:02:12 on console
Type 'help' to inspect available commands.`;

export default function TerminalWindow() {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: "output", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newHistory: HistoryEntry[] = [
      ...history,
      { type: "input", content: cmd },
    ];

    if (trimmed === "clear") {
      setHistory([{ type: "output", content: WELCOME }]);
      setCmdHistory((prev) => [cmd, ...prev]);
      setHistoryIdx(-1);
      setInput("");
      return;
    }

    const response = terminalData[trimmed as keyof typeof terminalData];
    if (response) {
      newHistory.push({ type: "output", content: response });
    } else if (trimmed === "") {
      // no-op
    } else {
      newHistory.push({
        type: "error",
        content: `command not found: ${trimmed}\nType 'help' to see available commands.`,
      });
    }

    setHistory(newHistory);
    setCmdHistory((prev) => [cmd, ...prev]);
    setHistoryIdx(-1);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIdx = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(newIdx);
      setInput(cmdHistory[newIdx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIdx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(newIdx);
      setInput(newIdx === -1 ? "" : cmdHistory[newIdx] ?? "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const commands = Object.keys(terminalData).concat(["clear"]);
      const match = commands.find((c) => c.startsWith(input));
      if (match) setInput(match);
    }
  };

  return (
    <div
      className="h-full flex flex-col font-mono text-[13px]"
      style={{ background: "linear-gradient(180deg, rgba(25,25,27,0.99), rgba(16,16,18,0.98))" }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 scrollbar-thin scrollbar-thumb-white/10">
        {history.map((entry, i) => (
          <div key={i}>
            {entry.type === "input" ? (
              <div className="flex gap-2">
                <span className="text-white shrink-0">{PROMPT}</span>
                <span className="text-white">{entry.content}</span>
              </div>
            ) : (
              <pre
                className={`whitespace-pre-wrap leading-relaxed ${
                  entry.type === "error" ? "text-red-400" : "text-white"
                }`}
              >
                {entry.content}
              </pre>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div
        className="flex items-center gap-2 px-4 pb-4 pt-1 shrink-0"
      >
        <span className="text-white shrink-0">{PROMPT}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-w-0 flex-1 bg-transparent outline-none text-white caret-white text-[13px]"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
        <span className="w-2 h-5 bg-white/70" />
      </div>
    </div>
  );
}

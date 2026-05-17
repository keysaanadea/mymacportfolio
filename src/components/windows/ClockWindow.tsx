"use client";

import { useEffect, useState } from "react";

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const TIMEZONES = [
  { label: "Jakarta",   tz: "Asia/Jakarta"       },
  { label: "Tokyo",     tz: "Asia/Tokyo"          },
  { label: "London",    tz: "Europe/London"       },
  { label: "New York",  tz: "America/New_York"    },
];

export default function ClockWindow() {
  const now = useNow();
  const [activeTab, setActiveTab] = useState<"clock" | "world">("clock");

  const sec   = now.getSeconds();
  const min   = now.getMinutes();
  const hour  = now.getHours() % 12;

  const secDeg  = sec   * 6;
  const minDeg  = min   * 6  + sec * 0.1;
  const hourDeg = hour  * 30 + min * 0.5;

  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

  return (
    <div className="flex flex-col h-full" style={{ background: "#1c1c1e" }}>

      {/* Tabs */}
      <div className="flex shrink-0 px-4 pt-3 pb-2 gap-2">
        {(["clock", "world"] as const).map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className="px-4 py-1 rounded-full text-[12px] font-medium capitalize transition-colors"
            style={activeTab === tab
              ? { background: "#3a3a3c", color: "#fff" }
              : { background: "transparent", color: "#8e8e93" }}
          >
            {tab === "clock" ? "Clock" : "World Clock"}
          </button>
        ))}
      </div>

      {activeTab === "clock" ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 pb-4">
          {/* Analog clock */}
          <div className="relative" style={{ width: 200, height: 200 }}>
            {/* Face */}
            <svg width="200" height="200" viewBox="0 0 200 200">
              {/* Outer ring */}
              <circle cx="100" cy="100" r="98" fill="#2c2c2e" stroke="#3a3a3c" strokeWidth="1.5"/>
              {/* Hour markers */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const isMain = i % 3 === 0;
                const r1 = isMain ? 82 : 86;
                const r2 = isMain ? 92 : 90;
                return (
                  <line
                    key={i}
                    x1={100 + r1 * Math.cos(angle)}
                    y1={100 + r1 * Math.sin(angle)}
                    x2={100 + r2 * Math.cos(angle)}
                    y2={100 + r2 * Math.sin(angle)}
                    stroke={isMain ? "#fff" : "#555"}
                    strokeWidth={isMain ? 2.5 : 1.5}
                    strokeLinecap="round"
                  />
                );
              })}
              {/* Hour hand */}
              <line
                x1="100" y1="100"
                x2={100 + 50 * Math.cos((hourDeg - 90) * (Math.PI / 180))}
                y2={100 + 50 * Math.sin((hourDeg - 90) * (Math.PI / 180))}
                stroke="#ffffff" strokeWidth="4" strokeLinecap="round"
              />
              {/* Minute hand */}
              <line
                x1="100" y1="100"
                x2={100 + 68 * Math.cos((minDeg - 90) * (Math.PI / 180))}
                y2={100 + 68 * Math.sin((minDeg - 90) * (Math.PI / 180))}
                stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round"
              />
              {/* Second hand */}
              <line
                x1={100 - 16 * Math.cos((secDeg - 90) * (Math.PI / 180))}
                y1={100 - 16 * Math.sin((secDeg - 90) * (Math.PI / 180))}
                x2={100 + 76 * Math.cos((secDeg - 90) * (Math.PI / 180))}
                y2={100 + 76 * Math.sin((secDeg - 90) * (Math.PI / 180))}
                stroke="#ff453a" strokeWidth="1.5" strokeLinecap="round"
              />
              {/* Center dot */}
              <circle cx="100" cy="100" r="5" fill="#ff453a"/>
              <circle cx="100" cy="100" r="2.5" fill="#2c2c2e"/>
            </svg>
          </div>

          {/* Digital time */}
          <div className="text-center">
            <p className="text-[36px] font-thin tracking-widest tabular-nums" style={{ color: "#fff", fontVariantNumeric: "tabular-nums" }}>
              {timeStr}
            </p>
            <p className="text-[13px] mt-1" style={{ color: "#8e8e93" }}>{dateStr}</p>
          </div>

          {/* Jakarta label */}
          <p className="text-[11px] tracking-widest uppercase" style={{ color: "#636366" }}>
            Jakarta · WIB (UTC+7)
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="flex flex-col gap-3 pt-1">
            {TIMEZONES.map(({ label, tz }) => {
              const cityTime = new Date(now.toLocaleString("en-US", { timeZone: tz }));
              const cityTimeStr = cityTime.toLocaleTimeString("en-US", {
                hour: "2-digit", minute: "2-digit", hour12: true,
              });
              const cityDateStr = cityTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
              const h = cityTime.getHours();
              const isNight = h < 6 || h >= 20;

              const offset = tz === "Asia/Jakarta" ? "+7"
                : tz === "Asia/Tokyo" ? "+9"
                : tz === "Europe/London" ? "+0/+1"
                : "-5/-4";

              return (
                <div
                  key={tz}
                  className="flex items-center justify-between rounded-[14px] px-4 py-3"
                  style={{ background: "#2c2c2e" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[20px]">{isNight ? "🌙" : "☀️"}</span>
                    <div>
                      <p className="text-[14px] font-medium" style={{ color: "#fff" }}>{label}</p>
                      <p className="text-[11px]" style={{ color: "#636366" }}>UTC{offset} · {cityDateStr}</p>
                    </div>
                  </div>
                  <p className="text-[20px] font-light tabular-nums" style={{ color: "#fff" }}>
                    {cityTimeStr}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

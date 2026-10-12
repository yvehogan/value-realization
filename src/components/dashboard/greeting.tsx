"use client";

import { useSyncExternalStore } from "react";

type Period = "morning" | "afternoon" | "evening" | "night";

/** Greeting and weather emoji for each part of the day. */
const GREETINGS: Record<Period, { text: string; emoji: string }> = {
  morning: { text: "Good morning", emoji: "⛅️" }, // 05:00–11:59
  afternoon: { text: "Good afternoon", emoji: "☀️" }, // 12:00–16:59
  evening: { text: "Good evening", emoji: "🌥️" }, // 17:00–20:59
  night: { text: "Good evening", emoji: "🌙" }, // 21:00–04:59
};

function periodOf(hour: number): Period {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

// Re-check every minute so a page left open rolls over from morning to afternoon.
const subscribe = (onChange: () => void) => {
  const id = setInterval(onChange, 60_000);
  return () => clearInterval(id);
};
const getSnapshot = () => periodOf(new Date().getHours());
// The server doesn't know the viewer's time zone, so the browser fills the greeting in.
const getServerSnapshot = () => null;

/** “Good afternoon, Evelyn ☀️” in the viewer's local time. */
export function Greeting({ name }: { name: string }) {
  const period = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { text, emoji } = GREETINGS[period ?? "morning"];

  return (
    // Invisible until the browser knows the local time, so the heading never flashes the wrong greeting.
    <span className={period ? undefined : "invisible"}>
      {text}, {name} {emoji}
    </span>
  );
}

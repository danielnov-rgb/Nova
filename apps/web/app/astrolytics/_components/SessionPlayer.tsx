"use client";

import type { SessionReplay } from "../_lib/types";

interface SessionPlayerProps {
  session: SessionReplay;
}

export function SessionPlayer({ session }: SessionPlayerProps) {
  const totalEvents = session.eventTimeline.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
      {/* Video area */}
      <div className="lg:col-span-2">
        {/* Player header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500/30 to-cyan-500/30 flex items-center justify-center text-xs font-semibold text-primary-400">
              {session.user.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <div className="text-sm font-medium text-white">{session.user}</div>
              <div className="text-xs text-gray-500">{session.startTime} · {session.country}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>{session.duration}</span>
            <span>{session.pagesViewed} pages</span>
            <span>{session.events} events</span>
          </div>
        </div>

        {/* Placeholder viewport */}
        <div className="relative aspect-video bg-gray-950 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">Session recording preview</p>
            <p className="text-xs text-gray-600 mt-1">Connect to Nova to enable playback</p>
          </div>
        </div>

        {/* Progress bar with event markers */}
        <div className="px-4 py-3 border-t border-gray-800">
          <div className="relative h-2 bg-gray-800 rounded-full">
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full" />
            {session.eventTimeline.map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/80 hover:bg-white transition-colors cursor-pointer"
                style={{ left: `${(i / (totalEvents - 1)) * 100}%` }}
                title={session.eventTimeline[i].event}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>0:00</span>
            <span>{session.duration}</span>
          </div>
        </div>
      </div>

      {/* Event timeline sidebar */}
      <div className="border-t lg:border-t-0 lg:border-l border-gray-800">
        <div className="px-4 py-3 border-b border-gray-800">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Event Timeline</h3>
        </div>
        <div className="overflow-y-auto max-h-[400px]">
          {session.eventTimeline.map((event, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-4 py-2.5 hover:bg-primary-500/5 transition-colors cursor-pointer border-b border-gray-800/30"
            >
              <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                <div className={`w-2 h-2 rounded-full ${
                  event.event === "Session Start" || event.event === "Session End"
                    ? "bg-primary-400"
                    : event.event === "Button Click"
                    ? "bg-cyan-400"
                    : event.event === "Form Submit"
                    ? "bg-green-400"
                    : "bg-gray-500"
                }`} />
                {i < session.eventTimeline.length - 1 && (
                  <div className="w-px h-4 bg-gray-800 mt-1" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white">{event.event}</div>
                {event.detail && (
                  <div className="text-[11px] text-gray-500 truncate">{event.detail}</div>
                )}
              </div>
              <span className="text-[10px] text-gray-600 flex-shrink-0">{event.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

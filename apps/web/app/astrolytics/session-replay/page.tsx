"use client";

import { useState } from "react";
import { sessions } from "../_data/sessions-data";
import { AnimatedSection } from "../_components/AnimatedSection";
import { FilterBar } from "../_components/FilterBar";
import { SessionPlayer } from "../_components/SessionPlayer";

export default function SessionReplayPage() {
  const [selectedId, setSelectedId] = useState<string | null>(sessions[0]!.id);
  const selected = sessions.find((s) => s.id === selectedId) ?? sessions[0]!;

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700 text-xs text-gray-300 mb-4 backdrop-blur-sm">
            <svg className="w-3.5 h-3.5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
            </svg>
            Session Recordings
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Session Replay</h1>
          <p className="text-gray-400">Watch how users interact with your product</p>
        </div>

        <FilterBar />

        {/* Player */}
        <AnimatedSection className="mb-6">
          <SessionPlayer session={selected} />
        </AnimatedSection>

        {/* Section divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-6" />

        {/* Session list */}
        <AnimatedSection delay={100}>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white mb-1">Recent Sessions</h2>
            <p className="text-sm text-gray-400">Click a session to watch the recording</p>
          </div>

          <div className="group relative bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
            <div className="relative overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Duration</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Pages</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Events</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Country</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">When</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr
                      key={session.id}
                      onClick={() => { setSelectedId(session.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className={`border-b border-gray-800/50 cursor-pointer transition-colors ${
                        selectedId === session.id
                          ? "bg-primary-500/10"
                          : "hover:bg-primary-500/5"
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500/30 to-cyan-500/30 flex items-center justify-center text-[10px] font-semibold text-primary-400 flex-shrink-0">
                            {session.user.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{session.user}</div>
                            {session.email && <div className="text-xs text-gray-500">{session.email}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-300">{session.duration}</td>
                      <td className="py-3 px-4 text-sm text-gray-300 text-right">{session.pagesViewed}</td>
                      <td className="py-3 px-4 text-sm text-gray-300 text-right">{session.events}</td>
                      <td className="py-3 px-4 text-sm text-gray-300">{session.country}</td>
                      <td className="py-3 px-4 text-sm text-gray-400">{session.startTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AnimatedSection>

        {/* Bottom badge */}
        <AnimatedSection className="mt-12 mb-8" delay={300}>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary-900/50 to-cyan-900/50 border border-primary-700/50">
              <span className="text-primary-400 font-semibold">{sessions.length}</span>
              <span className="text-gray-300">sessions recorded today</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}

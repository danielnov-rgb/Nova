"use client";

import { AnimatedSection } from "./AnimatedSection";
import { teamMembers, timeAllocation } from "../_data/proposal-content";

export function TeamSection() {
  return (
    <section id="team" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Team Composition
            </h2>
            <p className="text-xl text-gray-400">
              Three Forward Deployed Engineers
            </p>
          </div>
        </AnimatedSection>

        {/* Team member cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {teamMembers.map((member, index) => (
            <AnimatedSection key={member.name} delay={index * 120}>
              <div className="group relative bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all text-center h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5 group-hover:to-cyan-500/5 rounded-xl transition-all duration-300" />
                <div className="relative">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500/30 to-cyan-500/30 flex items-center justify-center mx-auto mb-4 border border-primary-500/20">
                    <span className="text-lg font-bold text-primary-400">{member.initials}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                  <p className="text-sm font-medium text-primary-400 mb-2">{member.role}</p>
                  <p className="text-sm text-gray-400">{member.expertise}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Time Allocation */}
        <AnimatedSection delay={300}>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{timeAllocation.hoursPerMonth}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">hrs/month</div>
              </div>
              <div className="w-px h-10 bg-gray-800" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{timeAllocation.ratePerFDE}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">per FDE/month</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Billable */}
              <div>
                <h4 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  Billable Hours (2gthr)
                </h4>
                <ul className="space-y-2">
                  {timeAllocation.billableActivities.map((activity) => (
                    <li key={activity} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-gray-600 mt-0.5">•</span>
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Non-Billable */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500" />
                  Non-Billable (Nova Platform)
                </h4>
                <ul className="space-y-2">
                  {timeAllocation.nonBillableActivities.map((activity) => (
                    <li key={activity} className="text-sm text-gray-400 flex items-start gap-2">
                      <span className="text-gray-600 mt-0.5">•</span>
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-800">
              <p className="text-xs text-gray-500">
                Monthly reporting will clearly delineate billable client work from non-billable platform development, ensuring complete transparency and accountability.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

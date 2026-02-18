"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ShowcaseNav } from "../_components/ShowcaseNav";
import { AnimatedSection } from "../_components/AnimatedSection";
import {
  caseStudyMeta,
  challenge,
  approach,
  timeline,
  results,
  velocityBreakdown,
} from "../_data/case-study-content";

function ProgressBar({ factor, delay, isVisible }: { factor: string; delay: number; isVisible: boolean }) {
  const [width, setWidth] = useState(0);
  const num = parseInt(factor);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setWidth((num / 8) * 100), delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, delay, num]);

  return (
    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden flex-1">
      <div
        className="h-full bg-gradient-to-r from-green-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export default function CaseStudyPage() {
  const [timelineVisible, setTimelineVisible] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [velocityVisible, setVelocityVisible] = useState(false);
  const timelineRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const velocityRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observerCallback = (setter: (v: boolean) => void) => (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting) setter(true);
    };

    const o1 = new IntersectionObserver(observerCallback(setTimelineVisible), { threshold: 0.1 });
    const o2 = new IntersectionObserver(observerCallback(setResultsVisible), { threshold: 0.1 });
    const o3 = new IntersectionObserver(observerCallback(setVelocityVisible), { threshold: 0.1 });

    if (timelineRef.current) o1.observe(timelineRef.current);
    if (resultsRef.current) o2.observe(resultsRef.current);
    if (velocityRef.current) o3.observe(velocityRef.current);

    return () => { o1.disconnect(); o2.disconnect(); o3.disconnect(); };
  }, []);

  return (
    <>
      <ShowcaseNav />

      {/* Hero */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 via-gray-950 to-gray-950" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 text-sm text-gray-300 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {caseStudyMeta.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {caseStudyMeta.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
            {caseStudyMeta.subtitle}
          </p>
          <div className="mt-4 text-gray-500">{caseStudyMeta.client}</div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Challenge */}
      <AnimatedSection id="challenge" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{challenge.title}</h2>
          <p className="text-lg text-gray-400 mb-8 leading-relaxed">{challenge.description}</p>
          <div className="space-y-3">
            {challenge.painPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-gray-300">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Approach */}
      <AnimatedSection id="approach" className="py-24 px-4 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{approach.title}</h2>
          <p className="text-lg text-gray-400 mb-8 leading-relaxed">{approach.description}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {approach.principles.map((p, i) => (
              <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-sm">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-white">{p.title}</h3>
                </div>
                <p className="text-sm text-gray-400">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Timeline */}
      <section ref={timelineRef} className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${timelineVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Week by Week</h2>
            <p className="text-xl text-gray-400">Three weeks of focused, continuous delivery</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500 via-cyan-500 to-green-500 hidden md:block" />

            <div className="space-y-8">
              {timeline.map((week, index) => (
                <div
                  key={week.week}
                  className={`relative md:pl-16 transition-all duration-700 ${timelineVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  {/* Dot */}
                  <div className="hidden md:flex absolute left-3.5 w-5 h-5 rounded-full bg-gray-950 border-2 border-primary-500 items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary-400" />
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-sm font-semibold">
                        {week.week}
                      </span>
                      <h3 className="text-xl font-bold text-white">{week.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {week.deliverables.map((d, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300">
                          <svg className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Results */}
      <section ref={resultsRef} className="py-24 px-4 bg-gray-900/30">
        <div className="max-w-5xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${resultsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{results.title}</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">{results.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {results.metrics.map((metric, index) => (
              <div
                key={metric.label}
                className={`bg-gray-900/50 border border-gray-800 rounded-xl p-5 text-center transition-all duration-500 ${resultsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                <div className="text-sm font-medium text-gray-300">{metric.label}</div>
                <div className="text-xs text-gray-500 mt-1">{metric.context}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* Velocity Breakdown */}
      <section ref={velocityRef} className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${velocityVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Velocity Breakdown</h2>
            <p className="text-xl text-gray-400">Category-by-category acceleration factors</p>
          </div>

          <div className="space-y-3">
            {velocityBreakdown.map((item, index) => (
              <div
                key={item.category}
                className={`grid grid-cols-12 gap-4 items-center bg-gray-900/50 border border-gray-800 rounded-xl p-4 transition-all duration-500 ${velocityVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="col-span-4">
                  <div className="font-medium text-white text-sm">{item.category}</div>
                </div>
                <div className="col-span-3">
                  <div className="text-red-400 text-sm">{item.traditional}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-green-400 text-sm">{item.nova}</div>
                </div>
                <div className="col-span-3 flex items-center gap-2">
                  <ProgressBar factor={item.factor} delay={index * 100} isVisible={velocityVisible} />
                  <span className="text-cyan-400 font-bold text-sm whitespace-nowrap">{item.factor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            See the Full Report
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Explore the complete Together POC velocity report with interactive visualizations
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/showcase"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
            >
              Back to Overview
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

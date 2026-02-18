"use client";

import { useState, useRef, useEffect } from "react";
import { workflowExamples } from "../_data/showcase-content";

function WorkflowCard({ example, index }: { example: (typeof workflowExamples)[0]; index: number }) {
  const [showTraditional, setShowTraditional] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="p-6 border-b border-gray-800">
        <h3 className="text-xl font-bold text-white mb-2">{example.title}</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-semibold">{example.traditional.total}</span>
            {example.traditional.multiplier && (
              <span className="text-gray-500 text-sm">{example.traditional.multiplier}</span>
            )}
          </div>
          <span className="text-gray-600">vs</span>
          <span className="text-green-400 font-semibold">Single session</span>
        </div>
      </div>

      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setShowTraditional(true)}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            showTraditional ? "bg-gray-800 text-white" : "bg-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          Traditional Workflow
        </button>
        <button
          onClick={() => setShowTraditional(false)}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            !showTraditional ? "bg-gray-800 text-white" : "bg-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          What Was Eliminated
        </button>
      </div>

      <div className="p-6">
        {showTraditional ? (
          <div className="space-y-2">
            {example.traditional.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs text-gray-400">
                  {i + 1}
                </div>
                <span className="text-gray-300 text-sm">{step}</span>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="mb-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="text-sm text-green-400 font-medium mb-1">Nova Approach</div>
              <div className="text-white">{example.nova.approach}</div>
            </div>
            <div className="text-sm text-gray-400 font-medium mb-3 uppercase tracking-wider">
              Eliminated Steps
            </div>
            <div className="space-y-2">
              {example.nova.eliminated.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-400 line-through">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function WorkflowStrip() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="workflows" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Workflow Compression
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            How Nova eliminates handoffs, delays, and coordination overhead
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowExamples.map((example, index) => (
            <WorkflowCard key={example.id} example={example} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

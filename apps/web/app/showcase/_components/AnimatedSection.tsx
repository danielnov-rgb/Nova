"use client";

import { useEffect, useState, useRef, type ReactNode } from "react";
import { trackSection } from "../_lib/posthog";

interface AnimatedSectionProps {
  children: ReactNode;
  id?: string;
  delay?: number;
  className?: string;
}

export function AnimatedSection({ children, id, delay = 0, className = "" }: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const tracked = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          if (id && !tracked.current) {
            tracked.current = true;
            trackSection(id);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [id]);

  return (
    <div
      ref={ref}
      id={id}
      className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

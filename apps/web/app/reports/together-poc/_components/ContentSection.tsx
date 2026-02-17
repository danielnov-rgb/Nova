"use client";

import { useRef, useState, useEffect, ReactNode } from "react";

interface ContentSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ContentSection({ title, children, className = "" }: ContentSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`py-12 px-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        {children}
      </div>
    </section>
  );
}

interface CardGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3;
}

export function CardGrid({ children, columns = 2 }: CardGridProps) {
  const colClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  }[columns];

  return <div className={`grid ${colClass} gap-4`}>{children}</div>;
}

interface InfoCardProps {
  title: string;
  value?: string | number;
  description?: string;
  children?: ReactNode;
}

export function InfoCard({ title, value, description, children }: InfoCardProps) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
      <div className="text-sm text-gray-400 mb-1">{title}</div>
      {value !== undefined && (
        <div className="text-2xl font-bold text-white">{value}</div>
      )}
      {description && (
        <div className="text-sm text-gray-500 mt-1">{description}</div>
      )}
      {children}
    </div>
  );
}

interface DataTableProps {
  headers: string[];
  rows: (string | ReactNode)[][];
}

export function DataTable({ headers, rows }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            {headers.map((header, i) => (
              <th
                key={i}
                className="text-left py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-900/30">
              {row.map((cell, j) => (
                <td key={j} className="py-3 px-4 text-sm text-gray-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

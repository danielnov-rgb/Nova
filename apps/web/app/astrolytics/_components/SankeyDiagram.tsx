"use client";

import type { PathNode, PathEdge } from "../_lib/types";
import { formatNumber } from "../_lib/formatters";

interface SankeyDiagramProps {
  nodes: PathNode[];
  edges: PathEdge[];
}

const COLORS = [
  "rgba(14, 165, 233, 0.6)",  // primary
  "rgba(34, 211, 238, 0.5)",  // cyan
  "rgba(56, 189, 248, 0.5)",  // blue
  "rgba(74, 222, 128, 0.4)",  // green
  "rgba(251, 191, 36, 0.4)",  // amber
];

export function SankeyDiagram({ nodes, edges }: SankeyDiagramProps) {
  const width = 900;
  const height = 400;
  const nodeWidth = 20;
  const padding = 60;

  const levels = Math.max(...nodes.map((n) => n.level)) + 1;
  const levelWidth = (width - padding * 2 - nodeWidth) / (levels - 1);

  // Position nodes
  const positionedNodes = nodes.map((node) => {
    const x = padding + node.level * levelWidth;
    const y = padding + node.y * (height - padding * 2 - 40);
    const nodeHeight = Math.max(20, (node.count / 8400) * 80);
    return { ...node, x, y, height: nodeHeight };
  });

  const nodeMap = new Map(positionedNodes.map((n) => [n.id, n]));

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[600px]" style={{ height: 400 }}>
        {/* Edges */}
        {edges.map((edge, i) => {
          const source = nodeMap.get(edge.source);
          const target = nodeMap.get(edge.target);
          if (!source || !target) return null;

          const strokeWidth = Math.max(2, (edge.count / 3200) * 16);
          const sx = source.x + nodeWidth;
          const sy = source.y + source.height / 2;
          const tx = target.x;
          const ty = target.y + target.height / 2;
          const mx = (sx + tx) / 2;

          return (
            <path
              key={`${edge.source}-${edge.target}`}
              d={`M${sx},${sy} C${mx},${sy} ${mx},${ty} ${tx},${ty}`}
              fill="none"
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={strokeWidth}
              opacity={0.5}
              className="hover:opacity-80 transition-opacity"
            />
          );
        })}

        {/* Nodes */}
        {positionedNodes.map((node) => (
          <g key={node.id}>
            <rect
              x={node.x}
              y={node.y}
              width={nodeWidth}
              height={node.height}
              rx={4}
              fill="url(#nodeGradient)"
              className="hover:opacity-90 transition-opacity"
            />
            <text
              x={node.x + nodeWidth / 2}
              y={node.y - 8}
              textAnchor="middle"
              className="fill-gray-300 text-[11px] font-medium"
            >
              {node.name}
            </text>
            <text
              x={node.x + nodeWidth / 2}
              y={node.y + node.height + 16}
              textAnchor="middle"
              className="fill-gray-500 text-[10px]"
            >
              {formatNumber(node.count)}
            </text>
          </g>
        ))}

        {/* Gradient defs */}
        <defs>
          <linearGradient id="nodeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

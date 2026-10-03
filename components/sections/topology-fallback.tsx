import { calls, nodes, type NodeId } from '@/content';

/**
 * 2D stand-in for the hero scene: shown until the visitor engages and three.js loads,
 * and kept without WebGL. Static on purpose: it is on screen during first load, where
 * main-thread SVG animation would compete with hydration.
 */
const POS: Record<NodeId, [number, number]> = {
  gateway: [90, 300],
  auth: [260, 150],
  core: [330, 420],
  ai: [520, 170],
  runtime: [470, 520],
  datastore: [760, 290],
  queue: [660, 470],
};

const COLOR: Record<NodeId, string> = {
  gateway: '#62e0ff',
  auth: '#fbbf24',
  core: '#52aeff',
  ai: '#a78bfa',
  runtime: '#6ee7b7',
  datastore: '#fd5c79',
  queue: '#62e0ff',
};

export function TopologyFallback() {
  return (
    <svg viewBox="0 0 860 620" className="h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      {calls.map((call, i) => {
        const [x1, y1] = POS[call.from];
        const [x2, y2] = POS[call.to];
        const cx = (x1 + x2) / 2;
        const cy = Math.min(y1, y2) - 60;
        // A packet frozen part-way along the edge (quadratic Bézier at t).
        const t = 0.3 + ((i * 0.23) % 0.4);
        const px = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t ** 2 * x2;
        const py = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t ** 2 * y2;
        return (
          <g key={`${call.from}-${call.to}`}>
            <path d={`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`} fill="none" stroke={COLOR[call.from]} strokeOpacity="0.3" strokeWidth="1.5" />
            <circle cx={px} cy={py} r="4" fill={COLOR[call.from]} />
          </g>
        );
      })}
      {nodes.map((node) => {
        const [x, y] = POS[node.id];
        return (
          <g key={node.id}>
            <circle cx={x} cy={y} r="34" fill={COLOR[node.id]} fillOpacity="0.08" stroke={COLOR[node.id]} strokeOpacity="0.6" />
            <circle cx={x} cy={y} r="9" fill={COLOR[node.id]} />
            <text x={x} y={y + 58} textAnchor="middle" fill="#a9b8cc" fontSize="14" className="font-mono">
              {node.service}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

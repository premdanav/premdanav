import type { Diagram, DiagramEdge, DiagramNode, DiagramNodeKind } from '@/content';

const WIDTH = 960;
const PAD_X = 116;
const PAD_Y = 40;
const NODE_H = 48;

const KIND_COLOR: Record<DiagramNodeKind, string> = {
  client: '#a9b8cc',
  service: '#52aeff',
  function: '#6ee7b7',
  queue: '#62e0ff',
  store: '#fd5c79',
  model: '#a78bfa',
  external: '#fbbf24',
};

interface Placed extends DiagramNode {
  cx: number;
  cy: number;
  w: number;
}

function place(diagram: Diagram): Map<string, Placed> {
  const innerH = diagram.height - PAD_Y * 2;
  return new Map(
    diagram.nodes.map((n) => [
      n.id,
      {
        ...n,
        cx: PAD_X + (n.x / 100) * (WIDTH - PAD_X * 2),
        cy: PAD_Y + (n.y / 100) * innerH,
        w: Math.min(232, Math.max(104, n.label.length * 8 + 46)),
      },
    ]),
  );
}

/** Where a ray from the node centre toward (tx, ty) leaves the node's box. */
function exitPoint(n: Placed, tx: number, ty: number): [number, number] {
  const dx = tx - n.cx;
  const dy = ty - n.cy;
  const hw = n.w / 2 + 4;
  const hh = NODE_H / 2 + 4;
  const t = Math.min(hw / Math.abs(dx || 1e-6), hh / Math.abs(dy || 1e-6));
  return [n.cx + dx * t, n.cy + dy * t];
}

function edgePath(edge: DiagramEdge, nodes: Map<string, Placed>, autoBend: number) {
  const a = nodes.get(edge.from)!;
  const b = nodes.get(edge.to)!;
  const len = Math.hypot(b.cx - a.cx, b.cy - a.cy) || 1;
  // Perpendicular to the left of travel (SVG y points down).
  const px = (b.cy - a.cy) / len;
  const py = -(b.cx - a.cx) / len;
  const bend = edge.bend ?? autoBend;
  const cx = (a.cx + b.cx) / 2 + px * bend;
  const cy = (a.cy + b.cy) / 2 + py * bend;
  const [x1, y1] = exitPoint(a, cx, cy);
  const [x2, y2] = exitPoint(b, cx, cy);
  return { d: `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`, mid: [0.25 * x1 + 0.5 * cx + 0.25 * x2, 0.25 * y1 + 0.5 * cy + 0.25 * y2] };
}

/** Edges sharing a pair of nodes fan out so each stays visible. */
function autoBends(edges: DiagramEdge[]): number[] {
  return edges.map((edge, i) => {
    const [first] = [edge.from, edge.to].sort();
    const siblings = edges
      .map((e, j) => ({ e, j }))
      .filter(({ e }) => [e.from, e.to].sort().join('|') === [edge.from, edge.to].sort().join('|'));
    if (siblings.length < 2) return 0;
    const k = siblings.findIndex(({ j }) => j === i);
    // Offset measured against one fixed direction, then flipped for edges that run the other way.
    const offset = (k - (siblings.length - 1) / 2) * 56;
    return edge.from === first ? offset : -offset;
  });
}

interface ArchitectureDiagramProps {
  diagram: Diagram;
  /** Compact: no text, used as artwork on project cards. */
  compact?: boolean;
  /** Unique prefix for SVG ids when several diagrams share a page. */
  id: string;
  className?: string;
}

export function ArchitectureDiagram({ diagram, compact = false, id, className = '' }: ArchitectureDiagramProps) {
  const nodes = place(diagram);
  const bends = autoBends(diagram.edges);
  const groups = diagram.groups ?? [];

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${diagram.height}`}
      className={className}
      role={compact ? undefined : 'img'}
      aria-hidden={compact ? true : undefined}
      aria-label={compact ? undefined : `${diagram.title}: ${diagram.caption}`}
    >
      <defs>
        <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#8191a7" />
        </marker>
      </defs>

      {groups.map((group) => {
        const members = [...nodes.values()].filter((n) => n.group === group.id);
        const x1 = Math.min(...members.map((n) => n.cx - n.w / 2)) - 22;
        const x2 = Math.max(...members.map((n) => n.cx + n.w / 2)) + 22;
        const y1 = Math.min(...members.map((n) => n.cy - NODE_H / 2)) - 30;
        const y2 = Math.max(...members.map((n) => n.cy + NODE_H / 2)) + 18;
        return (
          <g key={group.id}>
            <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} rx="18" fill="#fbbf24" fillOpacity="0.03" stroke="#fbbf24" strokeOpacity="0.45" strokeDasharray="6 6" />
            {!compact && (
              <text x={x1 + 16} y={y1 + 19} fill="#fbbf24" fontSize="12" className="font-mono">
                {group.label}
              </text>
            )}
          </g>
        );
      })}

      {diagram.edges.map((edge, i) => {
        const { d, mid } = edgePath(edge, nodes, bends[i]);
        const color = KIND_COLOR[nodes.get(edge.from)!.kind];
        const pathId = `${id}-e${i}`;
        return (
          <g key={pathId}>
            <path id={pathId} d={d} fill="none" stroke="#8191a7" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray={edge.async ? '5 5' : undefined} markerEnd={`url(#${id}-arrow)`} />
            <circle r={compact ? 4 : 4.5} fill={color} className="diagram-packet" style={{ color }}>
              <animateMotion dur={`${edge.async ? 3.6 : 2.4}s`} begin={`${(i * 0.37) % 2}s`} repeatCount="indefinite">
                <mpath href={`#${pathId}`} />
              </animateMotion>
            </circle>
            {!compact && (
              <g>
                <circle cx={mid[0]} cy={mid[1]} r="10" fill="#0b0d12" stroke="#2a3140" />
                <text x={mid[0]} y={mid[1] + 3.5} textAnchor="middle" fill="#a9b8cc" fontSize="10" className="font-mono">
                  {i + 1}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {[...nodes.values()].map((n) => {
        const color = KIND_COLOR[n.kind];
        return (
          <g key={n.id}>
            <rect x={n.cx - n.w / 2} y={n.cy - NODE_H / 2} width={n.w} height={NODE_H} rx="12" fill="#11141b" stroke={color} strokeOpacity="0.7" />
            <rect x={n.cx - n.w / 2} y={n.cy - NODE_H / 2} width={n.w} height={NODE_H} rx="12" fill={color} fillOpacity="0.06" />
            <circle cx={n.cx - n.w / 2 + 16} cy={n.cy} r="4" fill={color} />
            {!compact && (
              <>
                <text x={n.cx - n.w / 2 + 28} y={n.cy - 2} fill="#eaf2ff" fontSize="13" className="font-mono">
                  {n.label}
                </text>
                <text x={n.cx - n.w / 2 + 28} y={n.cy + 13} fill="#8191a7" fontSize="10" className="font-mono">
                  {n.kind}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

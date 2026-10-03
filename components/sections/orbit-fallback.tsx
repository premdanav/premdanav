import { skillTiers, type SkillTierId } from '@/content';

/**
 * Static 2D stand-in for the hero orbit: shown until the visitor engages and three.js
 * loads, and kept without WebGL. Mirrors the 3D layout: three tilted rings, one per tier.
 */
const RINGS: Record<SkillTierId, { r: number; rotate: number; color: string }> = {
  daily: { r: 150, rotate: 0, color: '#6ee7b7' },
  proven: { r: 235, rotate: 60, color: '#62e0ff' },
  familiar: { r: 315, rotate: -60, color: '#a78bfa' },
};

const SQUASH = 0.58;
const CX = 440;
const CY = 340;

export function OrbitFallback() {
  return (
    <svg viewBox="0 0 860 680" className="h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      {skillTiers.map((tier) => {
        const ring = RINGS[tier.id];
        return (
          <g key={tier.id} transform={`rotate(${ring.rotate} ${CX} ${CY})`}>
            <ellipse cx={CX} cy={CY} rx={ring.r} ry={ring.r * SQUASH} fill="none" stroke={ring.color} strokeOpacity="0.4" />
            {tier.skills.map((skill, i) => {
              const a = (i / tier.skills.length) * Math.PI * 2;
              return <circle key={skill.name} cx={CX + Math.cos(a) * ring.r} cy={CY + Math.sin(a) * ring.r * SQUASH} r="5" fill={ring.color} />;
            })}
          </g>
        );
      })}
      <circle cx={CX} cy={CY} r="34" fill="#6ee7b7" fillOpacity="0.25" stroke="#62e0ff" strokeOpacity="0.5" />
      <circle cx={CX} cy={CY} r="18" fill="#6ee7b7" />
    </svg>
  );
}

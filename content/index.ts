import { aiCapabilities } from './ai';
import { awards, certifications, education, roles } from './career';
import { abilities, heroWords } from './home';
import { identity } from './identity';
import { projects } from './projects';
import { resumes } from './resumes';
import { skillTiers } from './skills';
import { calls, nodes } from './topology';
import type { NodeId, Project, ProjectId, ResumeFile, Role, RoleId, ServiceNode } from './types';

export * from './types';
export {
  abilities,
  aiCapabilities,
  awards,
  calls,
  certifications,
  education,
  heroWords,
  identity,
  nodes,
  projects,
  resumes,
  roles,
  skillTiers,
};

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getNode(id: NodeId): ServiceNode {
  return find(nodes, id, 'node');
}

export function getRole(id: RoleId): Role {
  return find(roles, id, 'role');
}

export function capabilitiesFor(projectId: ProjectId) {
  return aiCapabilities.filter((c) => c.projectId === projectId);
}

/** The single engineering role that sets the stated experience span. */
export const currentRole: Role = roles.find((r) => r.track === 'engineering' && r.period.end === 'present')!;

export const defaultResume: ResumeFile = resumes.find((r) => r.isDefault) ?? resumes[0];

function find<T extends { id: string }>(items: T[], id: string, kind: string): T {
  const item = items.find((i) => i.id === id);
  if (!item) throw new Error(`Unknown ${kind}: ${id}`);
  return item;
}

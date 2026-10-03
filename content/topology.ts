import type { Call, ServiceNode } from './types';

/** The seven nodes of the 3D trace. Clicking one scrolls to its section. */
export const nodes: ServiceNode[] = [
  {
    id: 'gateway',
    service: 'api-gateway',
    section: 'hero',
    label: 'Home',
    summary: 'Where every request enters.',
  },
  {
    id: 'auth',
    service: 'auth-service',
    section: 'experience',
    label: 'Experience',
    summary: 'Who I am and how I got here.',
  },
  {
    id: 'core',
    service: 'core-services',
    section: 'work',
    label: 'Work',
    summary: 'Three production systems.',
  },
  {
    id: 'ai',
    service: 'ai-layer',
    section: 'ai',
    label: 'AI',
    summary: 'LLM features that shipped.',
  },
  {
    id: 'runtime',
    service: 'runtime',
    section: 'skills',
    label: 'Skills',
    summary: 'The stack, in three tiers.',
  },
  {
    id: 'datastore',
    service: 'datastore',
    section: 'experience',
    label: 'Record',
    summary: 'Certification, awards, education.',
  },
  {
    id: 'queue',
    service: 'message-queue',
    section: 'contact',
    label: 'Contact',
    summary: 'Enqueue a message.',
  },
];

/** The edges of the scene. Each is a call a real system of this shape makes. */
export const calls: Call[] = [
  { from: 'gateway', to: 'auth', label: 'verify JWT', mode: 'sync' },
  { from: 'gateway', to: 'core', label: 'route request', mode: 'sync' },
  { from: 'auth', to: 'datastore', label: 'load roles (RBAC)', mode: 'sync' },
  { from: 'core', to: 'ai', label: 'generate / validate', mode: 'sync' },
  { from: 'core', to: 'datastore', label: 'read / write', mode: 'sync' },
  { from: 'core', to: 'queue', label: 'publish event', mode: 'async' },
  { from: 'ai', to: 'datastore', label: 'store structured output', mode: 'sync' },
  { from: 'runtime', to: 'core', label: 'hosts', mode: 'hosts' },
  { from: 'runtime', to: 'ai', label: 'hosts', mode: 'hosts' },
];

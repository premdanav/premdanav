import type { Ability, HeroWord } from './types';

/** Rotating word in the hero headline: "Building {word}". */
export const heroWords: HeroWord[] = [
  { text: 'healthcare platforms', icon: 'pulse' },
  { text: 'AI workflows', icon: 'spark' },
  { text: 'secure APIs', icon: 'shield' },
  { text: 'event-driven backends', icon: 'bolt' },
];

export const abilities: Ability[] = [
  {
    title: 'Healthcare integration',
    icon: 'pulse',
    description: 'EHR integration with Cerner over FHIR and HL7, inside HIPAA constraints, with ICD and CPT rules checked in code.',
    tags: ['FHIR', 'HL7', 'Cerner', 'HIPAA'],
  },
  {
    title: 'AI in production',
    icon: 'spark',
    description: 'LLMs wired into real workflows: clinical reports, document validation, patient guidance and recommendations.',
    tags: ['Spring AI', 'Vertex AI', 'OpenAI', 'Claude'],
  },
  {
    title: 'Cloud-native backends',
    icon: 'cloud',
    description: 'Spring Boot microservices and serverless functions with JWT/RBAC security and idempotent payment webhooks.',
    tags: ['Spring Boot', 'AWS', 'GCP', 'Stripe'],
  },
];

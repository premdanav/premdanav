import type { SkillTier } from './types';

export const skillTiers: SkillTier[] = [
  {
    id: 'daily',
    label: 'Daily',
    description: 'What I write and review on a normal working day.',
    skills: [
      { name: 'Java' },
      { name: 'Spring Boot' },
      { name: 'Spring Security' },
      { name: 'Spring Data JPA' },
      { name: 'React.js' },
      { name: 'TypeScript' },
      { name: 'Node.js' },
      { name: 'PostgreSQL' },
      { name: 'REST APIs' },
      { name: 'Git' },
    ],
  },
  {
    id: 'proven',
    label: 'Production-proven',
    description: 'Shipped to production; linked to the projects where it ran.',
    skills: [
      { name: 'Microservices', evidence: ['healthcare-ai-saas', 'ehr-integration'] },
      { name: 'JWT / RBAC', evidence: ['healthcare-ai-saas'] },
      { name: 'Docker', evidence: ['healthcare-ai-saas'] },
      { name: 'AWS (Lambda, S3, SQS)', evidence: ['ehr-integration'] },
      { name: 'GCP (Firebase, Cloud Run, Pub/Sub)', evidence: ['nutrition-ai'] },
      { name: 'Redis', evidence: ['healthcare-ai-saas'] },
      { name: 'Hibernate' },
      { name: 'OpenAI / Vertex AI integration', evidence: ['healthcare-ai-saas', 'ehr-integration', 'nutrition-ai'] },
      { name: 'FHIR / HL7', evidence: ['ehr-integration'] },
      { name: 'Stripe', evidence: ['healthcare-ai-saas'] },
      { name: 'Agile / Scrum' },
    ],
  },
  {
    id: 'familiar',
    label: 'Familiar',
    description: 'Used and comfortable with, but not where my depth is.',
    skills: [
      { name: 'Python' },
      { name: 'Redux' },
      { name: 'Tailwind CSS' },
      { name: 'Material UI' },
      { name: 'MySQL' },
      { name: 'RAG' },
      { name: 'Maven' },
      { name: 'Jira' },
    ],
  },
];

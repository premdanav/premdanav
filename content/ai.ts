import type { AiCapability } from './types';

/** The AI work, pulled out of the projects. Order follows the /ai page. */
export const aiCapabilities: AiCapability[] = [
  {
    id: 'clinical-reports',
    title: 'Clinical analysis reports',
    projectId: 'healthcare-ai-saas',
    stack: ['Spring AI', 'Vertex AI (Gemini)'],
    input: 'Patient data and medical protocols',
    output: 'Structured clinical analysis reports, rendered to PDF',
    detail:
      'LLM workflows whose output is a structured report, not free text; the reports are then rendered from HTML to PDF for end users.',
  },
  {
    id: 'document-validation',
    title: 'AI document validation',
    projectId: 'healthcare-ai-saas',
    stack: [],
    input: 'Uploaded PDF documents',
    output: 'A structured exception for invalid files; report generation for valid ones',
    detail:
      'Validation sits in front of generation: a document that fails never reaches the report workflow, and the caller gets a typed error instead of a bad report.',
  },
  {
    id: 'patient-communication',
    title: 'Patient communication and symptom guidance',
    projectId: 'ehr-integration',
    stack: ['OpenAI GPT', 'Claude'],
    input: 'Patient messages and reported symptoms',
    output: 'Patient communication and symptom-based clinical guidance',
    detail: 'Two model providers behind one healthcare backend, inside HIPAA constraints.',
  },
  {
    id: 'rule-engine',
    title: 'Medical rule engine',
    projectId: 'ehr-integration',
    stack: [],
    input: 'Insurance and clinical documents',
    output: 'Checks against ICD and CPT codes',
    detail: 'An AI-powered rule engine that checks documents against medical coding standards.',
  },
  {
    id: 'nlp-notes',
    title: 'NLP on doctor notes',
    projectId: 'ehr-integration',
    stack: ['Python'],
    input: 'Doctor notes',
    output: 'Detected medical abbreviations and verified clinical terms',
    detail: 'Runs as its own Python microservice alongside the Spring Boot services.',
  },
  {
    id: 'meal-recommendations',
    title: 'Personalised meal recommendations',
    projectId: 'nutrition-ai',
    stack: ['OpenAI API'],
    output: 'Personalised meal recommendations',
    detail: 'Recommendation quality improved through prompt optimisation.',
  },
];

import type { Project } from './types';

/**
 * The three production projects. Diagrams are drafted from CV facts only and stay
 * `reviewed: false` until Prem confirms they match the real systems.
 */
export const projects: Project[] = [
  {
    id: 'healthcare-ai-saas',
    name: 'Healthcare AI SaaS',
    title: 'Multi-tenant clinical analysis platform',
    role: 'Full Stack Developer',
    roleId: 'mindbowser',
    period: { start: '2025-10', end: 'present' },
    shape: 'Multi-tenant AI SaaS',
    story:
      'A multi-tenant healthcare platform where access control and billing have to hold per tenant while LLMs turn patient data into clinical reports.',
    stack: ['Java Spring Boot', 'React.js', 'Spring AI', 'Vertex AI', 'PostgreSQL', 'Redis', 'Docker'],
    highlights: [
      {
        text: 'Built backend microservices for a multi-tenant healthcare platform covering user management, billing and AI-driven clinical analysis.',
      },
      {
        text: 'Designed AI workflows with LLMs and Vertex AI (Gemini) that turn patient data and medical protocols into structured clinical analysis reports.',
      },
      {
        text: 'Added PDF upload with AI-based document validation: invalid files raise structured exceptions, valid files start automated clinical report generation.',
      },
      {
        text: 'Set up Stripe subscription billing and webhook processing, and produced HTML-to-PDF clinical reports for end users.',
      },
    ],
    diagram: {
      kind: 'topology',
      title: 'Service topology',
      caption: 'Tenant-scoped services behind RBAC, with the LLM and Stripe as external dependencies.',
      height: 440,
      groups: [{ id: 'tenant', label: 'tenant boundary · RBAC' }],
      nodes: [
        { id: 'web', label: 'React web app', kind: 'client', x: 0, y: 50 },
        { id: 'users', label: 'user-management', kind: 'service', group: 'tenant', x: 33, y: 10 },
        { id: 'intake', label: 'document-intake', kind: 'service', group: 'tenant', x: 33, y: 50 },
        { id: 'billing', label: 'billing', kind: 'service', group: 'tenant', x: 33, y: 90 },
        { id: 'pdf', label: 'HTML-to-PDF', kind: 'service', group: 'tenant', x: 66, y: 10 },
        { id: 'analysis', label: 'clinical-analysis', kind: 'service', group: 'tenant', x: 66, y: 50 },
        { id: 'llm', label: 'Vertex AI · Gemini', kind: 'model', x: 100, y: 22 },
        { id: 'pg', label: 'PostgreSQL', kind: 'store', x: 100, y: 62 },
        { id: 'stripe', label: 'Stripe', kind: 'external', x: 100, y: 92 },
      ],
      edges: [
        { from: 'web', to: 'users', label: 'authenticate (JWT)' },
        { from: 'users', to: 'pg', label: 'tenants, users, roles', bend: 60 },
        { from: 'web', to: 'intake', label: 'upload PDF' },
        { from: 'intake', to: 'llm', label: 'AI document validation' },
        { from: 'intake', to: 'web', label: 'invalid file → structured exception' },
        { from: 'intake', to: 'analysis', label: 'valid file → start report generation' },
        { from: 'analysis', to: 'llm', label: 'patient data + protocols → structured analysis (Spring AI)' },
        { from: 'analysis', to: 'pdf', label: 'render clinical report' },
        { from: 'analysis', to: 'pg', label: 'persist report' },
        { from: 'billing', to: 'stripe', label: 'manage subscription' },
        { from: 'stripe', to: 'billing', label: 'webhook events', async: true },
      ],
      reviewed: false,
    },
  },
  {
    id: 'ehr-integration',
    name: 'EHR Integration Platform',
    title: 'HIPAA-compliant healthcare backend',
    role: 'Backend Developer',
    roleId: 'mindbowser',
    period: { start: '2025-01', end: '2025-10' },
    shape: 'Integration-heavy healthcare backend',
    story:
      'Patient data arriving from Cerner over FHIR and HL7, mapped, checked against ICD and CPT coding rules and stored, all under HIPAA constraints.',
    stack: ['Spring Boot', 'FHIR', 'HL7', 'Cerner APIs', 'PostgreSQL', 'Python', 'AWS', 'OpenAI', 'Claude'],
    highlights: [
      {
        text: "Drove HIPAA-compliant EHR integration with Cerner's systems, using FHIR/HL7 workflows to ingest and store structured patient data.",
      },
      {
        text: 'Connected OpenAI GPT and Claude models to power AI-driven patient communication and symptom-based clinical guidance.',
      },
      {
        text: 'Created an AI-powered medical rule engine that checks insurance and clinical documents against ICD and CPT codes.',
      },
      {
        text: 'Built a Python NLP microservice that analyses doctor notes, detects medical abbreviations and verifies clinical terms.',
      },
    ],
    diagram: {
      kind: 'sequence',
      title: 'Ingestion sequence',
      caption: 'EHR → FHIR mapping → rule engine → structured store.',
      height: 300,
      nodes: [
        { id: 'ehr', label: 'Cerner EHR', kind: 'external', x: 0, y: 75 },
        { id: 'ingest', label: 'FHIR/HL7 ingestion', kind: 'service', x: 25, y: 75 },
        { id: 'mapper', label: 'FHIR mapping', kind: 'service', x: 50, y: 75 },
        { id: 'rules', label: 'medical rule engine', kind: 'service', x: 75, y: 75 },
        { id: 'llm', label: 'OpenAI GPT / Claude', kind: 'model', x: 75, y: 0 },
        { id: 'pg', label: 'PostgreSQL', kind: 'store', x: 100, y: 75 },
      ],
      edges: [
        { from: 'ehr', to: 'ingest', label: 'FHIR resources / HL7 messages via Cerner APIs' },
        { from: 'ingest', to: 'mapper', label: 'map to structured patient data' },
        { from: 'mapper', to: 'rules', label: 'insurance and clinical documents' },
        { from: 'rules', to: 'llm', label: 'AI-assisted check against ICD / CPT codes' },
        { from: 'rules', to: 'pg', label: 'store structured, checked record' },
      ],
      reviewed: false,
    },
  },
  {
    id: 'nutrition-ai',
    name: 'AI Nutrition Tracker',
    title: 'Serverless nutrition management app',
    role: 'Full Stack Developer',
    roleId: 'mindbowser',
    period: { start: '2024-02', end: '2024-12' },
    shape: 'Serverless and event-driven',
    story:
      'A nutrition app backend built on functions and events instead of always-on servers, with in-app payment state kept consistent by store webhooks.',
    stack: ['GCP Cloud Run functions', 'GCP Pub/Sub', 'Firebase', 'OpenAI', 'Node.js'],
    highlights: [
      {
        text: 'Engineered a serverless, event-driven backend on Cloud Run functions, Pub/Sub and Firebase instead of always-on servers.',
      },
      {
        text: 'Built secure payment integration with webhook-driven state synchronisation for reliable, idempotent transaction handling, using RTDN for Apple and Android.',
      },
      {
        text: 'Integrated the OpenAI API for personalised meal recommendations, tuned through prompt optimisation.',
      },
    ],
    diagram: {
      kind: 'event-flow',
      title: 'Event flow',
      caption: 'Pub/Sub → Cloud Run functions → Firebase, with the store-webhook loop for payments.',
      height: 400,
      nodes: [
        { id: 'app', label: 'Mobile app (iOS / Android)', kind: 'client', x: 0, y: 45 },
        { id: 'pubsub', label: 'Pub/Sub', kind: 'queue', x: 30, y: 5 },
        { id: 'fn', label: 'Cloud Run functions', kind: 'function', x: 60, y: 45 },
        { id: 'openai', label: 'OpenAI API', kind: 'model', x: 100, y: 5 },
        { id: 'firebase', label: 'Firebase', kind: 'store', x: 100, y: 80 },
        { id: 'stores', label: 'App Store / Google Play', kind: 'external', x: 60, y: 100 },
      ],
      edges: [
        { from: 'app', to: 'pubsub', label: 'publish event', async: true },
        { from: 'pubsub', to: 'fn', label: 'trigger function', async: true },
        { from: 'fn', to: 'openai', label: 'meal recommendation prompt' },
        { from: 'fn', to: 'firebase', label: 'write results' },
        { from: 'stores', to: 'fn', label: 'RTDN purchase notification (webhook)', async: true },
        { from: 'fn', to: 'firebase', label: 'idempotent payment state update' },
        { from: 'firebase', to: 'app', label: 'sync state', async: true, bend: -60 },
      ],
      reviewed: false,
    },
  },
];

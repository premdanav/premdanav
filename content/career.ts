import type { Award, Certification, Education, Role } from './types';

/** Most recent first. */
export const roles: Role[] = [
  {
    id: 'mindbowser',
    org: 'Mindbowser Inc.',
    title: 'Full Stack Developer',
    location: 'Pune, India',
    period: { start: '2023-11', end: 'present' },
    track: 'engineering',
    highlights: [
      'Developed full stack web applications and microservices with Java Spring Boot and Node.js on the backend and React.js on the frontend, across three production projects in healthcare and SaaS.',
      'Designed and built RESTful APIs, with JWT-based authentication, Spring Security and RBAC for secure multi-tenant access control.',
      'Integrated AWS and GCP services (S3, Lambda, SQS, Firebase, Cloud Run functions, Pub/Sub) for cloud workflows, and AI tools (OpenAI GPT, Vertex AI, LLMs) for application features.',
      'Performed code and PR reviews, wrote unit tests, and worked in Git following Agile/Scrum and SDLC practices.',
    ],
  },
  {
    id: 'pedagogy',
    org: 'Pedagogy',
    title: 'Content Operations Executive',
    location: 'Remote, India',
    period: { start: '2021-08', end: '2022-05' },
    track: 'operations',
    highlights: [
      'Managed content upload, verification and quality checks across internal platforms; coordinated with cross-functional teams for accurate, timely publishing.',
      'Tracked tasks and deadlines on Jira and Trello boards, improving workflow visibility and turnaround time.',
    ],
  },
];

/** Most recent first. */
export const education: Education[] = [
  {
    id: 'cdac',
    qualification: 'PG Diploma in Advanced Computing',
    institution: 'CDAC',
    year: 2023,
    result: '77%',
    level: 'postgraduate',
  },
  {
    id: 'btech',
    // Discipline deliberately left off the site (Prem's call, 2026-10-03).
    qualification: 'B.Tech',
    institution: 'Priyadarshini Institute of Engineering and Technology, Nagpur',
    year: 2021,
    result: '7.24/10',
    level: 'undergraduate',
  },
  {
    id: 'hsc',
    qualification: '12th',
    institution: 'Maharashtra Board',
    year: 2017,
    result: '77%',
    level: 'school',
  },
  {
    id: 'ssc',
    qualification: '10th',
    institution: 'Maharashtra Board',
    year: 2015,
    result: '87%',
    level: 'school',
  },
];

export const certifications: Certification[] = [
  {
    name: 'AWS Certified Developer – Associate',
    code: 'DVA-C02',
    issuer: 'Amazon Web Services',
    validUntil: '2029-03',
  },
];

export const awards: Award[] = [
  {
    name: 'Shining Star Award',
    org: 'Mindbowser',
    year: 2024,
    citation: 'Technical excellence',
  },
  {
    name: 'Team Player Award',
    org: 'Mindbowser',
    year: 2024,
    citation: 'Outstanding collaborative contributions',
  },
];

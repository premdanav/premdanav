/**
 * The content schema. Every fact on the site lives in content/*.ts as one of
 * these types; flat mode and the 3D scene both read the same objects.
 */

type Month = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';

/** "2023-11" */
export type YearMonth = `${number}-${Month}`;

export interface Period {
  start: YearMonth;
  end: YearMonth | 'present';
}

/* ------------------------------------------------------------------ identity */

export interface Contact {
  email: string;
  /** E.164, used for tel: links. */
  phone: string;
  phoneDisplay: string;
  linkedin: string;
  /** null until Prem confirms which profile or repo the header links to. */
  github: string | null;
}

export interface Identity {
  name: string;
  shortName: string;
  title: string;
  location: string;
  /** The one line on the gateway node. */
  positioning: string;
  /** Two sentences: meta description and the gateway sub-line. */
  summary: string;
  /** The CV header's tech line, in order. */
  headlineStack: string[];
  seeking: { roles: string[]; locations: string[] };
  contact: Contact;
}

/* -------------------------------------------------------------------- career */

export type RoleId = 'mindbowser' | 'pedagogy';

export interface Role {
  id: RoleId;
  org: string;
  title: string;
  location: string;
  period: Period;
  /** Only engineering roles count toward the stated experience span. */
  track: 'engineering' | 'operations';
  highlights: string[];
}

export interface Education {
  id: string;
  qualification: string;
  institution: string;
  year: number;
  result: string;
  /** School records appear on /resume only. */
  level: 'postgraduate' | 'undergraduate' | 'school';
}

export interface Certification {
  name: string;
  code: string;
  issuer: string;
  validUntil: YearMonth;
}

export interface Award {
  name: string;
  org: string;
  year: number;
  citation: string;
}

/* ------------------------------------------------------------------ projects */

export type ProjectId = 'healthcare-ai-saas' | 'nutrition-ai' | 'ehr-integration';

export interface Highlight {
  text: string;
}

export type DiagramNodeKind = 'client' | 'service' | 'function' | 'queue' | 'store' | 'model' | 'external';

export interface DiagramNode {
  id: string;
  label: string;
  kind: DiagramNodeKind;
  /** Id of a `Diagram.groups` entry, e.g. the tenant boundary. */
  group?: string;
  /** Layout position, 0–100 on each axis. */
  x: number;
  y: number;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label: string;
  async?: boolean;
  /** Curve offset in px; positive bends to the left of the direction of travel. */
  bend?: number;
}

export interface Diagram {
  kind: 'topology' | 'event-flow' | 'sequence';
  title: string;
  caption: string;
  /** Drawing height in px at the 960px reference width. */
  height: number;
  groups?: { id: string; label: string }[];
  nodes: DiagramNode[];
  /** In call order. */
  edges: DiagramEdge[];
  /** Drafted from CV facts; false until Prem confirms it matches the real system. */
  reviewed: boolean;
}

export interface Project {
  /** Also the URL segment: /projects/{id}. */
  id: ProjectId;
  name: string;
  title: string;
  role: string;
  roleId: RoleId;
  period: Period;
  /** The architectural shape in a few words. */
  shape: string;
  /** What the project demonstrates, one or two sentences. */
  story: string;
  stack: string[];
  highlights: Highlight[];
  diagram: Diagram;
}

/* -------------------------------------------------------------------- ai */

export interface AiCapability {
  id: string;
  title: string;
  projectId: ProjectId;
  /** Models, frameworks and services involved, as named on the CV. */
  stack: string[];
  input?: string;
  output: string;
  detail: string;
}

/* -------------------------------------------------------------------- skills */

export type SkillTierId = 'daily' | 'proven' | 'familiar';

export interface Skill {
  name: string;
  /** Projects where it shipped. Only set where the CV says so. */
  evidence?: ProjectId[];
}

export interface SkillTier {
  id: SkillTierId;
  label: string;
  description: string;
  skills: Skill[];
}

/* -------------------------------------------------------------------- resume */

export interface ResumeFile {
  id: string;
  label: string;
  /** Public URL path; the file lives at public{path}. */
  path: string;
  isDefault: boolean;
}

/* ------------------------------------------------------------------ topology */

export type NodeId = 'gateway' | 'auth' | 'core' | 'ai' | 'runtime' | 'datastore' | 'queue';

export type SectionId = 'hero' | 'work' | 'experience' | 'skills' | 'ai' | 'contact';

export interface ServiceNode {
  id: NodeId;
  /** Name as it appears in the scene: "auth-service". */
  service: string;
  /** The page section this node opens. */
  section: SectionId;
  /** Plain label for navigation and screen readers. */
  label: string;
  /** What lives at this node, one line. */
  summary: string;
}

/* ---------------------------------------------------------------------- home */

export type IconName = 'pulse' | 'spark' | 'shield' | 'bolt' | 'cloud' | 'layers';

export interface HeroWord {
  text: string;
  icon: IconName;
}

export interface Ability {
  title: string;
  icon: IconName;
  description: string;
  tags: string[];
}

export interface Call {
  from: NodeId;
  to: NodeId;
  label: string;
  /** sync/async are request paths; hosts is the runtime running a service. */
  mode: 'sync' | 'async' | 'hosts';
}

@AGENTS.md

# CLAUDE.md — Prem Danav Portfolio

## What this is

A personal portfolio site for **Premkumar Danav**, Full Stack Developer (Java / Spring
Boot / Node.js / React / AWS), currently job-hunting for Java Backend, Full Stack
(Java + React) and Spring Boot roles in Pune and remote.

The site is navigated as a **distributed trace**. A visitor dispatches a request; a
packet travels through a 3D topology of the architecture Prem actually builds —
gateway, auth, services, datastore, queue — and the camera rides with it into each
section. Navigation *is* request dispatch.

This metaphor is the whole point. It is not decoration: the node names are service
names, the edges are real calls, and a reviewer who knows distributed systems should
be able to read the scene as an architecture diagram.

---

## Non-negotiable rules

1. **Flat mode is built first and never breaks.** Every route renders real
   server-side HTML with the complete text content. `?mode=flat` serves a no-canvas
   version of the entire site. If WebGL dies, the site is still a good portfolio.
2. **One source of content.** Everything lives in `content/` as typed modules. The 3D
   scene and flat mode read the same objects. Never duplicate CV facts in JSX.
3. **No fabricated metrics.** The telemetry panel shows real values only — actual
   FPS, actual bundle size, actual deploy SHA, actual Lighthouse score. No invented
   uptime percentages or fake request counts.
4. **No fake client screenshots.** All of Prem's production work is client work under
   NDA. Projects are illustrated with architecture diagrams authored for this site,
   never with product screenshots.
5. **Performance budget is a build gate**, not an aspiration. See below.
6. **Accessibility is not optional.** Keyboard navigation reaches every route without
   the canvas. `prefers-reduced-motion` disables camera flight.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16, App Router, TypeScript |
| 3D | React Three Fiber 9 + `@react-three/drei` + `@react-three/postprocessing` |
| Motion | GSAP (camera timelines), Motion (DOM transitions) |
| Smooth scroll | Lenis — only if scroll-driven camera is added |
| Styling | Tailwind CSS v4 |
| Deploy | GitHub Pages (static export, `.github/workflows/deploy.yml`) |

Pin exact versions at install time with `npm show <pkg> version`. Do not trust version
numbers written in this file.

---

## Performance budget

- **< 180 KB JS** before the canvas loads. The 3D bundle is dynamically imported after
  first paint.
- **60 fps on integrated graphics.** Instance repeated geometry, keep the scene under
  ~40 draw calls, bake lighting, cap DPR at 2.
- **Lighthouse ≥ 90 performance, 100 accessibility**, measured on throttled mobile.
- **First meaningful content < 1.5 s** on a 4G throttle, with no canvas required.

### Fallbacks

1. `prefers-reduced-motion` → cross-fade between nodes instead of camera flight.
2. Viewport < 768 px → flat mode by default, 3D as an opt-in button.
3. No WebGL / lost context → swap canvas for a static architecture diagram image.
4. JS disabled → every route still serves full readable HTML.

---

## Site map

> Superseded on 2026-10-03: the site is now one page of sections (see Status under
> Build order). The seven nodes remain; each maps to a section in
> `content/topology.ts`. The table below is the original plan, kept for reference.

Seven nodes, seven routes.

| Node | Route | Holds |
|---|---|---|
| `API Gateway` | `/` | Name, positioning line, three headline numbers, resume download, "open the trace" |
| `auth-service` | `/about` | Background, Nov 2023 → now, CDAC, B.Tech, awards, what he's looking for |
| `core-services` | `/projects` | Three production projects, each a sub-node |
| `ai-layer` | `/ai` | The AI work: Spring AI, Vertex AI, OpenAI, Claude, RAG, prompt optimisation, rule engine, NLP service |
| `runtime` | `/stack` | Skills in three tiers (daily / production-proven / familiar) |
| `datastore` | `/resume` | Both resume versions, AWS cert, awards |
| `message-queue` | `/contact` | Email, phone, LinkedIn, GitHub — styled as enqueueing a message |

Project sub-nodes at `/projects/healthcare-ai-saas`, `/projects/ehr-integration`,
`/projects/nutrition-ai`.

---

## Content source of truth (from the CV)

The typed version of everything below lives in `content/`. Edit facts there, not in
JSX; update this section when a fact changes.

### Identity

- Premkumar Danav — Pune, India
- premdanav@gmail.com · +91-7038852922 · linkedin.com/in/prem-danav
- Full Stack Developer at Mindbowser, Nov 2023 → present. This is the only
  engineering role — state the span as "since Nov 2023", never round it up to
  "3+ years"
- AWS Certified Developer – Associate (DVA-C02), valid to March 2029
- Mindbowser Shining Star Award 2024 (technical excellence)
- Mindbowser Team Player Award 2024 (collaboration)
- PG Diploma in Advanced Computing, CDAC, 2023 (77%)
- B.Tech, Priyadarshini Institute of Engineering and Technology, Nagpur, 2021
  (7.24/10). On the site the degree is shown as "B.Tech" only — never name the
  discipline in site copy or taglines (Prem's call, 2026-10-03)
- 12th (Maharashtra Board) 77%, 2017 · 10th (Maharashtra Board) 87%, 2015 —
  `/resume` only

### Career path (not on the CV, supplied by Prem)

B.Tech (2021) → **Pedagogy**, Content Operations Executive, Remote, Aug 2021 – May
2022 → CDAC PG-DAC (2023) → Mindbowser (Nov 2023 → present).

Pedagogy is a pre-engineering role (`track: 'operations'` in `content/career.ts`).
It shows on `/about` as part of the path into software and does not count toward
engineering experience. Its two points:

- Managed content upload, verification and quality checks across internal
  platforms; coordinated with cross-functional teams for accurate, timely publishing
- Tracked tasks and deadlines on Jira/Trello boards, improving workflow visibility
  and turnaround time

### Positioning line

Lead with healthcare systems depth + AI integration. Not "Full Stack Developer" —
that says nothing actionable. Something in the shape of: *builds healthcare platforms
where the compliance is real and the AI isn't a demo.*

### Numbers

None on the site. On 2026-10-03 Prem asked to drop the count-up cards and not to
use the CV's user-count, infrastructure-cost, accuracy, project-count or award-count
figures anywhere. Don't reintroduce metric callouts without asking.

### Projects

Client project names are never used — not on the site, not in this repo (copyright).
Each project goes by a generic name, and its URL slug matches.

**Healthcare AI SaaS — multi-tenant clinical analysis platform** (Oct 2025 → present)
Java Spring Boot · React.js · Spring AI · Vertex AI · PostgreSQL · Redis · Docker

- Backend microservices for a multi-tenant healthcare platform: user management,
  billing, AI-driven clinical analysis
- AI workflows with LLMs and Vertex AI (Gemini) turning patient data and medical
  protocols into structured clinical analysis reports
- PDF upload with AI-based document validation — invalid files raise structured
  exceptions, valid files trigger automated clinical report generation
- Stripe subscription billing with webhook processing; HTML-to-PDF clinical reports

Diagram: service topology with the tenant boundary marked.

**AI Nutrition Tracker — serverless nutrition management app** (Feb 2024 – Dec 2024)
GCP Cloud Run functions · Pub/Sub · Firebase · OpenAI · Node.js

- Serverless event-driven backend instead of always-on servers
- Payment integration with webhook-driven state sync for idempotent transactions
  using RTDN (Apple and Android)
- OpenAI API for personalised meal recommendations, tuned through prompt
  optimisation

Diagram: event flow — Pub/Sub → Cloud Run → Firebase, with the webhook loop.

**EHR Integration Platform — HIPAA-compliant healthcare backend** (Jan 2025 – Oct 2025)
Spring Boot · FHIR · HL7 · Cerner APIs · PostgreSQL · Python · AWS · OpenAI · Claude

- HIPAA-compliant EHR integration with Cerner, FHIR/HL7 workflows ingesting and
  storing structured patient data
- OpenAI GPT and Claude models powering patient communication and symptom-based
  clinical guidance
- AI-powered medical rule engine checking insurance and clinical documents against
  ICD and CPT codes
- Python NLP microservice analysing doctor notes, detecting medical abbreviations,
  verifying clinical terms

Diagram: sequence — EHR → FHIR mapping → rule engine → structured store.

> The three diagrams in `content/projects.ts` are drafted from CV facts only and
> carry `reviewed: false` until Prem confirms they match the real systems.

### Skills, in three tiers

Do **not** render the CV's flat 50-item list. Group as:

- **Daily** — Java, Spring Boot, Spring Security, Spring Data JPA, React.js,
  TypeScript, Node.js, PostgreSQL, REST APIs, Git
- **Production-proven** — Microservices, JWT/RBAC, Docker, AWS (Lambda, S3, SQS),
  GCP (Firebase, Cloud Run, Pub/Sub), Redis, Hibernate, OpenAI/Vertex AI integration,
  FHIR/HL7, Stripe, Agile/Scrum
- **Familiar** — Python, Redux, Tailwind, Material UI, MySQL, RAG, Maven, Jira

Drop "Problem Solving" and "Object Oriented Programming" — they read as filler.

---

## The eight signature elements

These are what stop it reading like a template portfolio. Each should degrade
gracefully.

1. **Trace waterfall loading** — navigation shows a span waterfall (resolve, fetch,
   hydrate, paint) with real milliseconds, not a spinner.
2. **Command palette (`⌘K`)** — accepts `GET /projects`, `curl /resume`,
   `cat about.md`; flies the camera to the target.
3. **Dev mode toggle** — flips the scene into an annotated view labelling each node
   with the component that draws it, the shader, the draw-call count.
4. **Honest telemetry panel** — real FPS, bundle size, deploy SHA, Lighthouse score.
5. **Ambient traffic** — faint packets loop between nodes when idle.
6. **Status-code error pages** — 404 renders as a real response with headers, body,
   and a retry that re-dispatches through the gateway.
7. **`/resume` as a response** — shows a response-header panel, then serves the PDF.
8. **Deep links per node** — every node is a shareable URL that loads the camera
   already in place.

---

## Build order

Do not skip ahead. Each step ends with something deployable.

1. Scaffold + typed `content/` layer
2. **Flat mode, complete and deployed** — seven routes, real HTML, resume download,
   contact form
3. Static scene — canvas, instanced nodes, edges, lighting, camera at gateway
4. Navigation — click node, camera flight, URL sync, back/forward, deep links
5. HUD — command palette, trace waterfall, telemetry
6. Project sub-nodes + architecture diagrams
7. Flourishes — dev mode, ambient traffic, error pages
8. Performance pass — profile, instance, hit budget, Lighthouse, ship

### Status

**Direction change, 2026-10-03.** Prem rejected the plain multi-route flat site
("looks like Swagger") and asked for an immersive 3D portfolio: one long page, 3D
scenes, GSAP scroll animation, glow cards. All 3D scenes are procedural and
original — no third-party models, images or code. Don't name or link any other
portfolio as a reference, in this repo or on the site.

What exists now:

- `/` is a single page of sections: hero (3D skills orbit), system map (3D trace
  topology), work, abilities, AI layer, experience timeline + record, skills (tier
  cards), contact (3D queue). No count-up/number cards (removed at Prem's request).
- Repo: github.com/premdanav/premdanav (branch `main`); Pages URL
  https://premdanav.github.io/premdanav/ (base path "/premdanav").
- Hosting is GitHub Pages, so the site is a static export (`output: 'export'`,
  `trailingSlash: true`): no route handlers, redirects, server actions or request-time
  rendering. The deploy workflow sets `NEXT_PUBLIC_BASE_PATH` ("/<repo>" for a project
  site) and `NEXT_PUBLIC_SITE_URL` from `actions/configure-pages`. `next/link` adds the
  base path itself; plain `<a href>` to site files must go through `withBasePath()` in
  `lib/site.ts`. `npm run preview` serves `out/` after a build.
- `/projects/[id]` are the case-study pages with the full SVG architecture diagram.
- 3D lives in `components/three/*`, loaded through `components/scene-slot.tsx`:
  dynamic import (never in first-load JS), mounted only after the visitor engages
  (first pointer/scroll/touch/key, 9 s fallback) and the slot nears the viewport,
  paused off screen, faded in over a server-rendered fallback, skipped without WebGL.
  Scenes stay mounted once created: unmounting drei `<Html>` labels throws.
- System-map node clicks scroll to sections via `ServiceNode.section` in
  `content/topology.ts`.
- GSAP is loaded lazily through `lib/gsap.ts` (`useScrollAnimation`); all text is in
  the server HTML and visible without it. `prefers-reduced-motion` disables GSAP,
  CSS loops, SVG packets and 3D auto-rotation.
- Contact form (static-host friendly, `components/contact-form.tsx`): posts to a hosted
  form backend when the `CONTACT_ENDPOINT` repository variable is set (Formspree-style:
  form POST, JSON reply, `_gotcha` honeypot, `_subject`); otherwise it opens the
  visitor's email app with the message filled in.
- Resume links appear only if the PDF exists in `public/` at build time; otherwise
  they become "request by email".
- Measured 2026-10-03, local `next start`: first-load JS on `/` ≈ 140 KB gzip for
  modern browsers (+39 KB legacy `noModule` polyfill). Lighthouse: desktop
  performance 94; mobile 66–73 (TBT from hydrating the long page under 4× CPU
  throttle); project page mobile 77–90. Accessibility, best practices, SEO 100.
  Mobile performance is the open item for the step-8 performance pass.

---

## Open items — ask Prem, do not guess

- Whether to include the baby photo growth tracker (Spring Boot, S3 pre-signed
  uploads, Lambda thumbnails, React PWA) as a personal project node
- The resume is `public/resume/Premkumar_Danav.pdf`, labelled just "Resume" on the
  site (no role or stack in the label, Prem's call). The PDF itself still carries the
  client project names, CV figures and degree discipline that the site leaves out —
  Prem may want a site version of it
- Domain name (`NEXT_PUBLIC_SITE_URL`)
- Whether the three drafted architecture diagrams match the real systems
- A form backend for the contact form (e.g. a Formspree endpoint as the
  `CONTACT_ENDPOINT` repo variable); until then it falls back to the email app

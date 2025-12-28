# <!--

SYSTEM GUIDELINES — UNIFIED (FIGMA BASE + ENGINEERING AUTHORITY)
Security-First | Discipline-Driven | Engineering-Grade
Context: VPS Linux + CyberPanel | Full Administrator Control
====================================================================

## HIERARCHY OF RULES

1. MASTER ENGINEERING GUIDELINES (THIS DOCUMENT) — HIGHEST PRIORITY
2. Project / System Rules defined below
3. Figma default examples (LOWEST priority, illustrative only)

If ANY conflict exists:
→ MASTER ENGINEERING GUIDELINES ALWAYS WIN.

This is NOT a creative playground.
This is a controlled engineering environment.
====================================================================
-->

# General guidelines (Figma Base — EXTENDED & OVERRIDDEN WHERE STATED)

These general rules are compatible with Figma’s expectations,
but are enforced with engineering discipline.

- Only use absolute positioning when strictly necessary.
- Default to responsive, structured layouts using Flexbox and Grid.
- Refactor code ONLY when there is measurable gain.
- Keep files small, focused, and single-responsibility.
- Helpers, utilities, and components MUST live in their own files.
- NEVER refactor blindly or for aesthetics alone.
- If an existing structure works, preserve it.

---

---

## MASTER SYSTEM GUIDELINES — ENGINEERING AUTHORITY

## PURPOSE

This section defines NON-NEGOTIABLE rules, mental models, workflows,
and architectural principles that MUST be followed.

The AI (or human) must act as:

- Senior Web Designer
- Frontend Engineer
- Backend / API Architect
- Security-Oriented Engineer
- Code Reviewer & System Analyst

---

# CORE PRINCIPLES (ABSOLUTE RULES)

1. NEVER improvise architecture.
2. NEVER break an existing pattern without explicit justification.
3. NEVER apply changes without understanding full context.
4. ALWAYS analyze before acting.
5. SECURITY > PERFORMANCE > AESTHETICS.
6. CONSISTENCY beats novelty.
7. If something works, DO NOT rewrite without measurable gain.
8. Logs, versioning, and rollback are mandatory.
9. Every change must be traceable and reversible.
10. Existing rules override creativity.

---

# THINKING & DECISION MODEL (MANDATORY)

Before generating or modifying ANYTHING:

1. CONTEXT IDENTIFICATION
   - Frontend, Backend, Infrastructure, or Mixed
   - New feature or refactor
   - Existing stack, style, patterns

2. STRUCTURE ANALYSIS
   - Folder hierarchy
   - Naming conventions
   - Code patterns
   - Framework usage
   - Design system adherence

3. RISK ANALYSIS
   - Security exposure
   - Performance impact
   - Maintainability
   - Backward compatibility
   - Deployment risk

4. MINIMAL CHANGE PROPOSAL
   - No overengineering
   - No unused abstractions
   - No unnecessary dependencies

ONLY AFTER THIS → generate output.

---

# WORKFLOW DISCIPLINE (NON-OPTIONAL)

1. RECOGNITION
2. PLANNING
3. EXECUTION
4. VALIDATION
5. LOGGING & VERSIONING

Each step is mandatory and sequential.

---

---

## DESIGN SYSTEM GUIDELINES (FIGMA-COMPATIBLE, ENGINEERING-ENFORCED)

## Layout & Responsiveness

- Mobile-first is mandatory.
- Flexbox and Grid by default.
- Absolute positioning only if unavoidable.
- Avoid fixed widths unless required.
- Semantic HTML is mandatory.

## Typography

- Base font-size: 14px
- Line-height: 1.4–1.6
- Max 2 font families
- Clear hierarchy (H1 → H6)
- No decorative fonts in functional UI

## Color & Contrast

- Use design tokens only.
- WCAG AA minimum contrast.
- Never rely solely on color for meaning.
- No hardcoded colors when tokens exist.

---

# UI COMPONENT RULES (EXTENDS FIGMA EXAMPLES)

## Button

Buttons are ACTION triggers, not decoration.

### Usage

- Use for explicit user actions.
- Labels must be verbs (Save, Submit, Delete).

### Variants

Primary Button

- One per section or view
- Main action only

Secondary Button

- Supporting actions

Tertiary Button

- Low emphasis
- Text-only

NEVER:

- More than one primary button per context
- Disabled buttons without explanation

## Forms

- Labels are mandatory.
- Placeholders ≠ labels.
- Frontend validation required.
- Backend validation mandatory.
- Clear, actionable error messages.

---

---

## FRONTEND ENGINEERING RULES

- One component per file.
- One responsibility per component.
- Stateless when possible.
- No duplicated logic.
- No inline styles.
- No unnecessary libraries.
- Frontend MUST NEVER expose backend internals or secrets.

---

---

## BACKEND & API ENGINEERING RULES — SECURITY-FIRST

# ABSOLUTE RULES

1. NEVER use root database user in applications.
2. NEVER trust frontend input.
3. NEVER expose stack traces in production.
4. NEVER hardcode secrets.
5. ALWAYS validate inputs.
6. SECURITY > PERFORMANCE > CONVENIENCE.

---

# API DESIGN

- RESTful and predictable.
- Clear HTTP status codes.
- Explicit error handling.
- Versioned when needed.

---

# DATABASE

- Least privilege principle.
- NO SELECT \*.
- Separated responsibilities.
- Schema changes require migration plan.

---

# CONFIGURATION

- Secrets only via environment variables.
- No secrets in code.
- Production and development separated.
- Compatible with CyberPanel reverse proxy.

---

---

## LOGGING, VERSIONING & ROLLBACK

Logs MUST:

- Capture errors, warnings, auth attempts, security events.
- Be structured and readable.
- Never expose secrets.

Versioning:

- Every change numbered.
- What changed.
- Why it changed.
- How to rollback.

Rollback:

- Mandatory for every deploy.

---

---

## OPERATIONAL CHECKLIST — DAILY

# PRE-COMMIT

☐ Structure respected  
☐ No unnecessary refactors  
☐ No secrets committed  
☐ Naming conventions followed  
☐ Logs added  
☐ Rollback path defined

# PRE-DEPLOY

☐ Env vars verified  
☐ DB users not root  
☐ CyberPanel proxy validated  
☐ Firewall rules reviewed  
☐ Disk & resources checked

# POST-DEPLOY

☐ Health check OK  
☐ Logs monitored  
☐ Rollback ready

---

# OPERATIONAL RULES

- Never deploy without backup.
- Never deploy without understanding the change.
- Never deploy tired.
- If unsure → STOP.

====================================================================
END OF UNIFIED GUIDELINES
====================================================================

---

## PROJECT-SPECIFIC CONTEXT (MeuMU Online)

### Stack
- Frontend: React 18 + TypeScript + Tailwind v4.0
- Backend: Node.js 20 + Express.js + MariaDB
- Infrastructure: VPS Linux + CyberPanel + OpenLiteSpeed

### Dual Database Architecture
```
DATABASE 1: muonline (MU Server) - READ-ONLY
DATABASE 2: meuweb (Website) - READ/WRITE
```

**CRITICAL**: NEVER write to `muonline` database from website.

### Design System
- Theme: Dark Medieval Fantasy + Glassmorphism
- Colors: Obsidian (#0a0a0a), Gold (#eab308), Ethereal Blue (#3b82f6)
- Pattern: `bg-black/40 backdrop-blur-xl border border-yellow-500/30`

### Authentication
- JWT Tokens (24h expiration)
- Storage: `localStorage.auth_token`
- Pattern: ALWAYS use `AuthContext` for authentication checks

### API Endpoints
- Base: `http://localhost:3010/api` (dev) | `https://api.meumu.com.br/api` (prod)
- Auth: `/auth/login`, `/auth/register`, `/auth/account`
- Characters: `/characters`, `/characters/add-stats`, `/characters/reset`
- Rankings: `/rankings/level`, `/rankings/resets`, `/rankings/guilds`
- System: `/server-status`, `/news`, `/events`, `/downloads`

### Code Patterns
```typescript
// ALWAYS use getAuthHeaders()
import { getAuthHeaders } from '../config/api';

// ALWAYS handle loading states
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// ALWAYS use try-catch for API calls
try {
  const response = await fetch(url, { headers: getAuthHeaders(token) });
  if (!response.ok) throw new Error('API Error');
  const data = await response.json();
} catch (error) {
  console.error(error);
  toast.error(error.message);
}
```

### Common Anti-Patterns to AVOID
- ❌ Mock data (use real API calls)
- ❌ Manual token checks (use AuthContext)
- ❌ Redirects inside protected components (handle in App.tsx)
- ❌ Writing to `muonline` database

====================================================================
END OF PROJECT CONTEXT
====================================================================
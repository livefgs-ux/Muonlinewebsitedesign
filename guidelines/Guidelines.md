**Add your own guidelines here**
<!--
====================================================================
MASTER GUIDELINES — WEB DESIGN, FRONTEND, BACKEND & OPERATIONS
Security-First | Discipline-Driven | Engineering-Grade
Context: VPS Linux + CyberPanel | Full Administrator Control
====================================================================

PURPOSE
-------
This document defines NON-NEGOTIABLE rules, mental models, workflows,
and architectural principles that MUST be followed when designing,
analyzing, refactoring, deploying, or maintaining web systems.

This is NOT a creative playground.
This is a controlled engineering environment.

The AI (or human) must act as:
- Senior Web Designer
- Frontend Engineer
- Backend / API Architect
- Security-Oriented Engineer
- Code Reviewer & System Analyst
====================================================================
-->

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

--------------------------------------------------------------------

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

--------------------------------------------------------------------

# WORKFLOW DISCIPLINE (NON-OPTIONAL)

All work follows this cycle:

1. RECOGNITION
   - Understand request
   - Identify constraints
   - Identify what must NOT change

2. PLANNING
   - Step-by-step plan
   - Dependency mapping
   - Rollback definition

3. EXECUTION
   - Incremental changes
   - Structure preserved
   - Naming respected

4. VALIDATION
   - Logical validation
   - Security validation
   - Structural validation

5. LOGGING & VERSIONING
   - Version numbering (v1, v2, v3…)
   - What changed
   - Why it changed
   - How to rollback

--------------------------------------------------------------------
--------------------------------------------------------------------
FRONTEND GUIDELINES — WEB DESIGN & UI ENGINEERING
--------------------------------------------------------------------

# FRONTEND ROLE & SCOPE

Responsibilities:
- UI consistency
- Accessibility
- Performance
- Maintainability
- Client-side security awareness

Frontend MUST NEVER:
- Leak backend details
- Expose secrets
- Break visual consistency

--------------------------------------------------------------------

# FRONTEND NON-NEGOTIABLE RULES

1. NEVER break an existing visual pattern.
2. NEVER introduce new style without system-level justification.
3. NEVER mix styling methodologies.
4. ALWAYS reuse components when possible.
5. RESPONSIVENESS is mandatory.
6. CLARITY over visual effects.
7. PERFORMANCE before aesthetics.

--------------------------------------------------------------------

# DESIGN SYSTEM RULES

## Layout & Responsiveness
- Mobile-first
- Flexbox and Grid by default
- Absolute positioning only if unavoidable
- Avoid fixed widths
- Semantic HTML required

## Typography
- Base font-size: 14px
- Line-height: 1.4–1.6
- Max 2 font families
- Clear hierarchy (H1 → H6)
- No decorative fonts in functional UI

## Color & Contrast
- Use design tokens only
- WCAG AA minimum
- Never rely solely on color
- No hardcoded colors when tokens exist

--------------------------------------------------------------------

# UI COMPONENT RULES

## Components
- One responsibility per component
- Stateless when possible
- Shallow nesting
- Reusable by design
- Predictable naming

## Buttons
- Buttons represent ACTIONS
- Labels are verbs (Save, Delete, Submit)
- Only ONE primary button per section

Primary:
- Main action

Secondary:
- Supporting action

Tertiary:
- Low emphasis, text-only

NEVER:
- Multiple primary buttons in same context
- Disabled buttons without explanation

## Forms
- Labels are mandatory
- Placeholders ≠ labels
- Frontend validation required
- Backend validation mandatory
- Clear error messages

--------------------------------------------------------------------

# FRONTEND PERFORMANCE RULES

- Lazy-load when possible
- No unused dependencies
- Optimized assets
- Avoid unnecessary animations

--------------------------------------------------------------------
--------------------------------------------------------------------
BACKEND & API GUIDELINES — SECURITY-FIRST
--------------------------------------------------------------------

# BACKEND ROLE & SCOPE

Responsibilities:
- Data integrity
- Security
- Stability
- Performance
- Observability

--------------------------------------------------------------------

# BACKEND ABSOLUTE RULES

1. NEVER use root DB user in applications.
2. NEVER trust frontend input.
3. NEVER expose stack traces in production.
4. NEVER hardcode secrets.
5. ALWAYS validate inputs.
6. SECURITY > PERFORMANCE > CONVENIENCE.

--------------------------------------------------------------------

# API DESIGN PRINCIPLES

- RESTful structure
- Predictable endpoints
- Clear HTTP status codes
- Explicit error handling
- Versioning when required

--------------------------------------------------------------------

# DATABASE RULES

- Least privilege principle
- Explicit column selection (NO SELECT *)
- Separated databases by responsibility
- Schema changes require migration plan

--------------------------------------------------------------------

# CONFIGURATION & ENVIRONMENT

- Secrets only via environment variables
- No secrets in code or repositories
- Production vs development separated
- Compatible with CyberPanel reverse proxy

--------------------------------------------------------------------

# SECURITY ENFORCEMENT

- Rate limiting on sensitive routes
- Authentication ≠ Authorization
- Secure headers mandatory
- HTTPS assumed
- No debug endpoints exposed

--------------------------------------------------------------------

# LOGGING & ERROR HANDLING

Logs MUST:
- Include errors, warnings, auth attempts, security events
- Be structured and readable
- Rotate properly

Logs MUST NOT:
- Contain passwords, tokens, secrets

Errors:
- Fail safely
- Generic client messages
- Detailed internal logs only

--------------------------------------------------------------------
--------------------------------------------------------------------
OPERATIONAL CHECKLIST — DAILY (PRE-COMMIT / PRE-DEPLOY)
--------------------------------------------------------------------

# PRE-COMMIT CHECKLIST

☐ Structure respected  
☐ No unnecessary refactors  
☐ No secrets committed  
☐ Naming conventions followed  
☐ Logs added where required  
☐ Change is minimal and justified  
☐ Rollback path defined  

--------------------------------------------------------------------

# PRE-DEPLOY CHECKLIST

☐ Environment variables verified  
☐ DB users are NOT root  
☐ Reverse proxy validated (CyberPanel)  
☐ Port exposure reviewed  
☐ Firewall rules unchanged or justified  
☐ Logs directories writable  
☐ Disk space checked  
☐ CPU/RAM baseline known  

--------------------------------------------------------------------

# SECURITY CHECKLIST

☐ No debug endpoints  
☐ Rate limiting active  
☐ HTTPS enabled  
☐ Secure headers active  
☐ No sensitive data in responses  

--------------------------------------------------------------------

# POST-DEPLOY CHECKLIST

☐ Health endpoint OK  
☐ Logs monitored  
☐ Error rate acceptable  
☐ No permission issues  
☐ Rollback ready  

--------------------------------------------------------------------

# OPERATIONAL RULES

- Never deploy without backup
- Never deploy without understanding the change
- Never deploy tired
- If unsure → STOP

====================================================================
END OF MASTER GUIDELINES
====================================================================

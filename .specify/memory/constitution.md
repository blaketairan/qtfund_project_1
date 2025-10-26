<!--
Sync Impact Report:
- Version: 1.1.0 → 1.2.0 (MINOR: Added API contract validation principle)
- PROJECT_NAME: qtfund_project_1 Constitution
- Principles added:
  1. File Structure & Component Organization
  2. Code Clarity & No Comments Policy
  3. Technology Stack Restrictions
  4. JSX Tag Validation
  5. Git Workflow (Single Branch Development)
  6. API Contract Validation
- Sections: Added API Contract Validation under Core Principles
- Templates requiring updates: ⚠ None required (process improvement, not breaking change)
- TODOs: None
-->

# qtfund_project_1 Constitution

## Core Principles

### I. File Structure & Component Organization

All code MUST follow strict file structure: `entities/` (JSON), `pages/` (JSX), `components/` (JSX), `Layout.jsx`.

Complex pages MUST be broken down into multiple components for improved maintainability.

File purpose MUST be clear from structure alone - small, focused files required.

### II. Code Clarity & No Comments Policy

Code MUST be self-explanatory with descriptive variable/function names and clear structure.

NO inline comments, documentation blocks, or TODO markers permitted.

JSON schema definitions MUST be complete and explicit - no placeholders or truncated structures.

Code changes MUST consider all related files and dependencies holistically before implementation.

### III. Technology Stack (NON-NEGOTIABLE)

UI components MUST be imported exclusively from `@headlessui/react`.

Icons MUST be imported only from `lucide-react` and MUST be verified to exist before use.

Use ONLY installed packages: React, @headlessui/react, lucide-react, moment, recharts, react-quill, react-hook-form, react-router-dom, date-fns, lodash, react-markdown, three.js, react-leaflet, @hello-pangea/dnd.

Avoid `try/catch` blocks unless specifically required.

### IV. JSX Tag Validation

MUST ensure all nested JSX tags are properly closed and structure is valid.

MUST verify nested structure completeness before code delivery.

### V. Git Workflow

All code changes MUST be committed directly to the `main` branch.

NO feature branches or pull request workflows permitted.

Changes are committed to main with clear, descriptive commit messages.

### VI. API Contract Validation

API service calls MUST validate actual backend response structure before processing data.

Frontend code MUST handle response format mismatches gracefully - must check both expected paths (e.g., `data` vs `data.items`) when contract is ambiguous.

API contract documentation MUST include complete real response examples, not just schemas - actual backend responses take precedence over documented structure.

When backend response format differs from contract, code MUST be updated to match actual structure, not assumed structure.

**Version**: 1.2.0 | **Ratified**: 2025-01-27 | **Last Amended**: 2025-01-27

Entity definitions in `entities/` MUST contain complete JSON schema without abbreviation.

Component props MUST be explicitly typed through prop interfaces when using TypeScript.

## Component Development Workflow

Complex pages require decomposition into logical sub-components.

Layout.jsx serves as the primary layout wrapper - all pages reference this structure.

Components in `components/` are reusable across pages.

Pages in `pages/` compose components to form complete user views.

## Governance

This constitution supersedes all other development practices.

All PRs and reviews MUST verify compliance with file structure, code clarity, and technology stack restrictions.

Amendments require documentation update, version bump, and affected template synchronization.

Complexity violations MUST be justified through explicit trade-off analysis.

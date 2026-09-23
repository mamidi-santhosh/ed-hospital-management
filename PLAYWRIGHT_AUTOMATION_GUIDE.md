# Master Guide: Playwright E2E Automation Testing & MCP Integration

This document consolidates all concepts, step-by-step implementation workflows, testing scenario checklists, framework comparisons, and client demo guidelines for Playwright automation.

---

## Table of Contents
1. [Overview & Page Object Model (POM) Architecture](#1-overview--page-object-model-pom-architecture)
2. [Playwright E2E vs Jest / Jasmine / React Testing Library](#2-playwright-e2e-vs-jest--jasmine--react-testing-library)
3. [Step-by-Step Implementation Workflow for a Feature](#3-step-by-step-implementation-workflow-for-a-feature)
4. [Database Connection Requirements in Playwright](#4-database-connection-requirements-in-playwright)
5. [Complete Feature Testing Scenario Checklist](#5-complete-feature-testing-scenario-checklist)
6. [Client Demo Call Questionnaire (MCP Automation Mechanism)](#6-client-demo-call-questionnaire-mcp-automation-mechanism)

---

## 1. Overview & Page Object Model (POM) Architecture

### What is POM?
**Page Object Model (POM)** is an architectural design pattern in test automation where each webpage (or major UI component) is represented by a dedicated class.

- **Locators (Selectors)**: Element definitions (`button`, `input`, `modal`) are stored in the Page Object constructor.
- **Action Methods**: Common user interactions (`login()`, `bookAppointment()`, `filterByStatus()`) are encapsulated inside that class.
- **Test Specs**: Test files (`.spec.js`) import these classes to execute user flows and run assertions.

### Why Use POM?
- **Single Source of Truth**: If a UI class or DOM structure changes, you update the locator **once** in the page object class instead of fixing dozens of test files.
- **Readability**: Test specs read like plain English: `await appointmentsPage.bookAppointment({...})`.
- **Reusability**: Shared user journeys can be reused across test suites.

---

## 2. Playwright E2E vs Jest / Jasmine / React Testing Library

| Feature | Jest / Jasmine / React Testing Library | Playwright E2E |
| :--- | :--- | :--- |
| **Testing Scope** | **Unit & Component Testing** | **End-to-End (E2E) Integration Testing** |
| **Browser Engine** | Node.js in-memory fake DOM (`JSDOM`) | **Real Browsers** (Chromium, Firefox, WebKit/Safari) |
| **Backend & APIs** | Mocked out (`jest.mock()`, `msw`) | **Real Backend** (Live Spring Boot REST API + DB) |
| **What It Verifies** | Does component `<Appointments />` render mock props? | Does a real user click perform full-stack React ➔ Backend ➔ DB execution? |
| **Speed** | Ultra-fast (milliseconds) | Fast browser automation (seconds) |
| **Debugging** | Node.js console logs & stack traces | Interactive Playwright UI, failure screenshots, video recordings |

---

## 3. Step-by-Step Implementation Workflow for a Feature

### Step 1: Feature Scope Analysis
- Define **Happy Paths**, **Unhappy Paths**, **Field Validations**, and **Role Permissions (RBAC)**.

### Step 2: Choose Resilient User-Facing Locators
- Preferred: `page.getByRole('button', { name: 'Save' })`, `page.getByLabel('Email')`, `page.getByPlaceholder('Search...')`.
- Avoid: Volatile XPaths, deep DOM hierarchy paths (`div > span:nth-child(2)`), or auto-generated utility CSS classes.

### Step 3: Create / Update Page Object Models (POM)
- Create `e2e/pages/MyFeaturePage.js`. Store locators in the constructor and define user actions as async methods.

### Step 4: Handle State & Test Isolation
- Use `storageState.json` for auth reuse so tests don't spend time logging in manually before every test.
- Use unique dynamic data (e.g., `test_${Date.now()}@hospital.com`) so test specs run cleanly in parallel.

### Step 5: Write Test Specs (`.spec.js`)
- Group tests in `test.describe()`. Use Playwright auto-retrying assertions: `await expect(locator).toBeVisible()`. Never use hardcoded sleeps like `page.waitForTimeout()`.

### Step 6: Execute & Debug
- Run headless: `npx playwright test`
- Interactive debugging: `npx playwright test --ui`
- View report: `npx playwright show-report`

---

## 4. Database Connection Requirements in Playwright

**Do we have to connect directly to the database in Playwright?**
**No.** Playwright tests the database **indirectly** through the UI and API layer.

```
[ Playwright Browser ] ➔ [ React Frontend ] ➔ [ Spring Boot Backend ] ➔ [ Database (MySQL/H2) ]
```

### When is Direct DB Access Optional?
- **Data Seeding**: Running bulk SQL inserts before tests run.
- **Data Cleanup**: Clearing test tables in `afterAll()` hooks.
- **Backend-Only Checks**: Verifying unexposed columns (e.g., `is_deleted = 1`).

---

## 5. Complete Feature Testing Scenario Checklist

### 1. Business Requirements & BA Specs
- [x] All required input fields, buttons, labels, and textareas exist per BA spec.
- [x] Default field values and dropdown options are correctly populated.
- [x] Read-only / auto-generated fields are disabled for user input.

### 2. Validations & Input Constraints
- [x] Submitting empty forms triggers inline required error messages or HTML5 validity popups.
- [x] Invalid formats (email syntax, short phone numbers, invalid characters) trigger validation errors.
- [x] Boundary values (e.g., min/max age, price limits) are enforced.
- [x] Server backend error responses (e.g., duplicate email) display clear UI error banners.

### 3. Routing & Role-Based Access Control (RBAC)
- [x] Direct URL navigation to protected routes without session redirects to `/login`.
- [x] Navigation actions update browser URL parameters correctly.
- [x] Role-based UI visibility (e.g., Admin sees "Add Doctor"; Patient does not).

### 4. Full CRUD User Workflows
- [x] **Create**: Submitting a valid form inserts a new row in the list.
- [x] **Read/Filter**: Search bar and status tabs filter visible list items.
- [x] **Update**: Inline status actions (Confirm/Cancel) update UI badges.
- [x] **Delete**: Action triggers confirmation dialog (`window.confirm`) and removes item from UI.

### 5. UI Interactivity & Dynamic States
- [x] Submit button displays loading text (`"Saving..."`) and disables to prevent double submits.
- [x] Modals open and close cleanly via button click, backdrop click, or ESC key.

### 6. Network & Browser Resilience
- [x] Page refresh (`page.reload()`) preserves login session and current route.
- [x] Simulating 500 API failures displays graceful error fallback views.

---

## 6. Client Demo Call Questionnaire (MCP Automation Mechanism)

Use this checklist during demo calls when inheriting a client's **Playwright + MCP AI mechanism** across projects:

### A. Architecture & Mechanism
1. *"Is the MCP mechanism generating standard Playwright `.spec.js` files, or executing Playwright actions dynamically on-the-fly?"*
2. *"What inputs are required? (Jira tickets, OpenAPI specs, Figma designs, or live URLs?)"*
3. *"What specific MCP tools or servers are configured under the hood?"*
4. *"Does generated code automatically follow the Page Object Model (POM) pattern?"*

### B. Project Onboarding & Setup
5. *"What are the exact prerequisites to onboard a new project onto this mechanism?"*
6. *"How does the mechanism adapt to different frontend tech stacks (React, Angular, Vue, SSR)?"*
7. *"Is there a boilerplate repository or starter package to clone for new projects?"*

### C. Authentication & Test Data
8. *"How does the mechanism handle multi-role logins (Admin vs. Patient) and `storageState` session reuse?"*
9. *"How does it handle complex auth flows (OAuth, SSO, MFA/OTP)?"*
10. *"How is test data created and cleaned up across Dev, Staging, and Local environments?"*

### D. Robustness & Self-Healing
11. *"How does the AI agent pick locators, and does it have self-healing logic when CSS classes change?"*
12. *"How does it handle dynamic elements (spinners, toasts, popups, auto-complete dropdowns)?"*

### E. CI/CD & Handoff
13. *"How is this integrated into CI/CD pipelines (GitHub Actions, GitLab CI, Jenkins)?"*
14. *"Where are screenshots, trace logs, and video failure reports published (Slack/Teams/Jira)?"*
15. *"Which project should we select as our first pilot rollout?"*

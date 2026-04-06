# 12 callbacks

## 1. Overview
- **What this file does**: Asynchronous control flow with callbacks, Promises, and async/await.
- **Where it is used**: Used as interview-prep learning material and onboarding notes for frontend engineers.
- **Why it exists in the architecture**: It acts as a focused concept module for interview preparation and practical frontend onboarding.

## 2. Core Concept
- **Main concept**: Asynchronous control flow with callbacks, Promises, and async/await.
- **Internal working**: Promise state transitions (`pending` -> `fulfilled/rejected`) and microtask scheduling drive resolution order.
- **Data flow**: Input values (or event triggers) are processed through language/runtime constructs and surfaced via logs, returns, or UI callbacks.
- **Reactivity / lifecycle angle (if applicable)**: In UI contexts (Vue/React), this concept affects render timing, state updates, and side-effect orchestration.
- **Design pattern used**: Example-driven educational module with imperative walkthrough snippets.

## 3. Code Walkthrough
- **Setup and declarations**: Introduces constants/imports/examples that frame the topic.
- **Async flow examples**: Demonstrates resolution, error paths, and sequencing.
- **Execution output checks**: Uses logs/tables to validate behavior and interview reasoning.
- **Why it is written this way**: The examples optimize for conceptual clarity and interview discussion rather than production packaging.
- **Alternative senior approaches**:
  - Convert snippets into tested utility modules.
  - Add TypeScript contracts for safer APIs.
  - Separate pure logic from side-effect layers (I/O, storage, network).

## 4. Key Functions / Methods
| Function / Method | Parameters | Return Value | Side Effects | Real-World Usage |
|---|---|---|---|---|
| `greeting` | name | Context-dependent (example/demo output) | May log to console or mutate local/demo state | Use as a reference pattern and adapt to production utilities/components |
| `processUserInput` | callback | Context-dependent (example/demo output) | May log to console or mutate local/demo state | Use as a reference pattern and adapt to production utilities/components |


## 5. Interview Focus
- **What interviewers expect**: Interviewers expect error propagation understanding, concurrency combinators, and cancellation strategy.
- **Common questions**:
  - What problem does this pattern solve in production code?
  - What are the edge cases and failure modes?
  - How would you explain runtime behavior step-by-step?
- **Follow-up questions**:
  - How would you refactor this for scale and team readability?
  - What testing strategy would you apply here (unit/integration)?
  - What changes for modern frameworks like Vue 3 with Composition API?

## 6. Senior Developer Notes
| Area | Notes |
|---|---|
| Scalability concerns | As codebases grow, convert isolated snippets into reusable utilities, tests, and linted standards. |
| Performance impact | Optimize only after profiling; prioritize clear data flow and stable interfaces first. |
| Maintainability | Extract reusable primitives, document contracts, and avoid hidden side effects. |
| Anti-patterns in this file | Overuse of global mutable state, heavy console-driven debugging, and callback nesting without clear error strategy. |
| Refactor path if the project grows | Split by domain, add tests, introduce lint/type checks, and standardize async/state patterns. |

## 7. Best Practices
- Prefer `async/await` with `try/catch` for readability.
- Use `Promise.all` for parallel independent requests.
- Handle cancellation/stale responses in UI apps.
- Avoid nested callback pyramids by composing promises.

## 8. When to Use / When Not to Use
- **When to use**:
  - During interview prep, onboarding, and concept validation spikes.
  - As a reference for implementing the same concept in app code.
- **When not to use**:
  - Do not keep demo-only console-heavy patterns in production modules.
  - Avoid directly shipping educational snippets without error handling, tests, and architecture boundaries.

## 9. Quick Revision Summary
- Understand the core concept and runtime behavior.
- Know common pitfalls and how to prevent them.
- Be able to compare alternatives and trade-offs.
- Explain production-grade usage beyond toy examples.
- Discuss performance and maintainability impact.

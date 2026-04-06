# Vue Security and Best Practices - Interview Questions

## Question 1
### 1. Question
How does Vue reduce XSS risk by default, and where are the dangerous edges?

### 2. Why this question is asked in interviews
Interviewers assess security awareness for frontend attack surfaces in production.

### 3. Short Answer (for quick revision)
Vue escapes interpolated template content by default, which blocks many XSS vectors. The primary risk is bypassing escaping with `v-html` or unsafe DOM APIs. Only render trusted/sanitized HTML, and treat all user content as untrusted.

### 4. Detailed Explanation
- Core concept:
  - Safe-by-default templating with explicit opt-out.
- How it works internally:
  - Template interpolation writes text nodes, not executable HTML.
- Reactivity / rendering impact:
  - Reactive updates to unsafe HTML can repeatedly reintroduce payloads if unsanitized.
- Vue 2 vs Vue 3 differences:
  - Security model is consistent; API ergonomics improved.
- Real project usage:
  - CMS previews must sanitize with allowlist-based sanitizers (for example DOMPurify).

### 5. Code Examples
Basic example:
```vue
<p>{{ userInput }}</p>
```

Real-world example:
```ts
import DOMPurify from 'dompurify'
const safeHtml = computed(() => DOMPurify.sanitize(rawHtml.value))
```

Composition API version:
```vue
<div v-html="safeHtml"></div>
```

### 6. Common Follow-up Questions
- Why is `v-html` dangerous?
- Is frontend sanitization enough without backend validation?
- How do CSP headers help Vue apps?

### 7. Common Mistakes
- Trusting API HTML blindly.
- Using `innerHTML` directly in directives.
- Assuming route guards provide backend security.

### 8. Performance / Best Practices
- Sanitize once and cache if content is reused.
- Use strict CSP and avoid inline scripts.
- Prefer trusted markdown pipelines over raw HTML.

### 9. When NOT to use this
- Do not use `v-html` for standard text rendering.

---

## Question 2
### 1. Question
What are secure token and environment-variable practices in Vue frontend apps?

### 2. Why this question is asked in interviews
This checks whether you understand practical auth and secret-management boundaries.

### 3. Short Answer (for quick revision)
Never put secrets in frontend env variables; anything shipped to browser is public. Prefer backend-managed HttpOnly cookies for session tokens. Frontend route guards improve UX only; backend must enforce authorization.

### 4. Detailed Explanation
- Core concept:
  - Browser code is untrusted execution environment.
- How it works internally:
  - Vite injects `VITE_*` env vars at build time into client bundles.
- Reactivity / rendering impact:
  - Security mistakes can propagate globally via shared stores.
- Vue 2 vs Vue 3 differences:
  - Principle unchanged; tooling conventions differ.
- Real project usage:
  - BFF (backend-for-frontend) proxy pattern keeps credentials server-side.

### 5. Code Examples
Basic example:
```env
VITE_PUBLIC_API_BASE=https://api.example.com
```

Real-world example:
```ts
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !authStore.isAuthenticated) return { name: 'login' }
})
```

Composition API version:
```ts
const apiBase = import.meta.env.VITE_PUBLIC_API_BASE
```

### 6. Common Follow-up Questions
- LocalStorage vs cookie trade-offs?
- How does CSRF protection work with cookies?
- What belongs in frontend authorization logic?

### 7. Common Mistakes
- Storing long-lived JWTs in LocalStorage without risk discussion.
- Logging sensitive payloads in production.
- Putting service secrets in `.env` client files.

### 8. Performance / Best Practices
- Centralize API client with auth/error interceptors.
- Rotate tokens and minimize lifetime.
- Enforce lint rules against unsafe patterns.

### 9. When NOT to use this
- Do not use frontend-only checks for actual access control decisions.

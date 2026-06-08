# VUE MODULE 4: OPTIONS API vs COMPOSITION API

---

## 1. The Two Styles
**Options API:** Define a component as an **object of options** (`data`, `methods`, `computed`, `watch`, lifecycle). Vue merges them and provides `this`.
**Composition API:** Define logic with **functions** inside `setup`/`<script setup>`; no `this`; logic grouped by feature.

```js
// OPTIONS API
export default {
  data() { return { count: 0 } },
  computed: { double() { return this.count * 2 } },
  methods: { inc() { this.count++ } },
  watch: { count(v) { console.log(v) } },
  mounted() { console.log('mounted') }
}
```
```vue
<!-- COMPOSITION API -->
<script setup>
import { ref, computed, watch, onMounted } from 'vue'
const count = ref(0)
const double = computed(() => count.value * 2)
const inc = () => count.value++
watch(count, v => console.log(v))
onMounted(() => console.log('mounted'))
</script>
```

---

## 2. Side-by-Side Mapping
| Concept | Options API | Composition API |
|---------|-------------|-----------------|
| Reactive state | `data() { return {...} }` | `ref()` / `reactive()` |
| Derived | `computed: {}` | `computed()` |
| Methods | `methods: {}` | plain functions |
| Watchers | `watch: {}` | `watch()` / `watchEffect()` |
| Lifecycle | `mounted()` etc. | `onMounted()` etc. |
| Props | `props: []` | `defineProps()` |
| Emits | `emits: []` / `this.$emit` | `defineEmits()` |
| Reuse | mixins (problematic) | **composables** |
| `this` | available | **not used** |

---

## 3. Detailed Comparison
| Aspect | Options API | Composition API |
|--------|-------------|-----------------|
| Organization | By option type | By feature |
| Logic reuse | Mixins (name clash, implicit) | Composables (explicit, clean) |
| TypeScript | Weaker inference | First-class |
| Learning curve | Easier for beginners | Slightly steeper |
| Scalability | Hard in large components | Excellent |
| Boilerplate | Less for tiny components | Less for large; `<script setup>` minimal |
| Tree-shaking | Whole API bundled | Import only what you use |
| `this` confusion | Common pitfall | Eliminated |

**When to use which:**
- **Small/simple components, beginners, legacy:** Options is fine.
- **Large components, shared logic, TS, new projects:** Composition (recommended default in Vue 3).
- They **interoperate** — you can mix per component, even use `setup()` alongside options.

---

## 4. Why Mixins Are Problematic (key interview point)
```js
// mixinA: { data: () => ({ value: 1 }) }
// mixinB: { data: () => ({ value: 2 }) }   ← name clash, silent override
```
- **Naming collisions** (silent).
- **Unclear source** of a property (`this.value` — from which mixin?).
- **Implicit cross-mixin coupling.**
Composables fix all: explicit imports, explicit returns, no `this`, rename on destructure.

---

## 5. Migration Strategy (Options → Composition)
```
1. Move data() → ref/reactive
2. Move computed → computed()
3. Move methods → functions
4. Move watch → watch()
5. Move lifecycle → onXxx()
6. props → defineProps, emits → defineEmits
7. Extract shared/feature logic → composables (replace mixins)
8. Migrate INCREMENTALLY — both APIs coexist; do high-churn/large components first
```
**Enterprise approach:** Don't big-bang rewrite. New components in Composition; migrate existing ones when touched; replace mixins with composables opportunistically. Vue 3 supports both indefinitely.

---

## 6. Enterprise Use Cases
- **Large teams:** Composition + composables → consistent, testable, reusable logic; feature folders.
- **Design systems:** Options or Composition fine for small presentational components.
- **Legacy Vue 2 → 3:** keep Options to reduce migration risk, adopt Composition for new features.

---

## INTERVIEW QUESTIONS
**🟢:** Options vs Composition basics? · Where does state live in each? · Can you mix them?
**🟡:** Why are mixins problematic? · TS differences? · When choose Options vs Composition? · Map each option to its Composition equivalent.
**🔴:** Tree-shaking implications? · Migration strategy for a large codebase. · Why does `<script setup>` outperform Options slightly? · How do composables replace mixins concretely?
**🧩:** Two mixins clash on a property — explain + fix with composables. · Lead a gradual migration of a 200-component app — plan. · A component grew to 800 lines (Options) — refactor approach.

## ⚡ REVISION
- Options = by type + `this` + mixins; Composition = by feature + functions + composables + TS.
- Mixins: clashes/implicit → composables: explicit/renamable.
- Migrate incrementally; both coexist; Composition is the Vue 3 default for scale.

➡️ Next: **Module 5 — Template System.**

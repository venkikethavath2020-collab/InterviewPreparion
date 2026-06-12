# TypeScript Interview Quick Notes

## What is TypeScript?

**Answer:** TypeScript is a superset of JavaScript that adds static typing.
**Explanation:** It helps catch errors during development before code runs.

---

## Why use TypeScript?

**Answer:** To improve code quality and maintainability.
**Explanation:** It provides type safety, better IDE support, and easier refactoring.

---

## What is Static Typing?

**Answer:** Variables have defined types at compile time.
**Explanation:** TypeScript checks type errors before execution.

---

## What is Type Inference?

**Answer:** TypeScript automatically determines a variable's type.
**Explanation:** No need to explicitly define every type.

```ts
let name = "Venkatesh";
```

TypeScript infers `string`.

---

## What is the `any` type?

**Answer:** A type that can hold any value.
**Explanation:** It disables type checking and should be avoided when possible.

---

## What is the `unknown` type?

**Answer:** A safer version of `any`.
**Explanation:** Type checking is required before using the value.

---

## What is the `never` type?

**Answer:** Represents values that never occur.
**Explanation:** Commonly used in functions that always throw errors.

---

## What is the `void` type?

**Answer:** Represents no return value.
**Explanation:** Used for functions that don't return anything.

---

## What is a Union Type?

**Answer:** Allows multiple possible types.
**Explanation:** Uses the `|` operator.

```ts
let id: string | number;
```

---

## What is an Intersection Type?

**Answer:** Combines multiple types into one.
**Explanation:** Uses the `&` operator.

---

## What is a Type Alias?

**Answer:** Creates a custom name for a type.
**Explanation:** Makes complex types reusable.

```ts
type UserId = string;
```

---

## What is an Interface?

**Answer:** Defines the structure of an object.
**Explanation:** Commonly used for API responses and component props.

---

## Interface vs Type?

**Answer:** Both define types.
**Explanation:** Interfaces support declaration merging; types support unions and intersections.

---

## What is Optional Property?

**Answer:** A property that may or may not exist.
**Explanation:** Defined using `?`.

```ts
name?: string
```

---

## What is Readonly?

**Answer:** Prevents modification after assignment.
**Explanation:** Useful for immutable data.

---

## What is an Enum?

**Answer:** A collection of named constants.
**Explanation:** Improves readability and avoids magic values.

---

## What is a Tuple?

**Answer:** An array with fixed length and types.
**Explanation:** Each position has a predefined type.

```ts
let user: [string, number];
```

---

## What are Generics?

**Answer:** Reusable components with type safety.
**Explanation:** Allow functions and classes to work with multiple types.

```ts
function identity<T>(value: T): T
```

---

## What is `keyof`?

**Answer:** Returns all keys of an object type.
**Explanation:** Produces a union of property names.

---

## What is `typeof`?

**Answer:** Extracts the type of a variable.
**Explanation:** Helps create types from existing values.

---

## What is Type Assertion?

**Answer:** Tells TypeScript to treat a value as a specific type.
**Explanation:** Similar to type casting.

```ts
const name = value as string;
```

---

## What is Literal Type?

**Answer:** A type with a specific value.
**Explanation:** Restricts allowed values.

```ts
type Status = "success" | "error";
```

---

## What is a Record Utility Type?

**Answer:** Creates an object type with specific keys and values.
**Explanation:** Useful for maps and dictionaries.

---

## What is Partial<T>?

**Answer:** Makes all properties optional.
**Explanation:** Useful for update operations.

---

## What is Required<T>?

**Answer:** Makes all properties mandatory.
**Explanation:** Opposite of Partial.

---

## What is Pick<T>?

**Answer:** Selects specific properties from a type.
**Explanation:** Creates smaller reusable types.

---

## What is Omit<T>?

**Answer:** Removes specific properties from a type.
**Explanation:** Opposite of Pick.

---

## What is Type Narrowing?

**Answer:** Reducing a broader type into a specific type.
**Explanation:** Achieved using conditions like `typeof` and `instanceof`.

---

## What is Declaration Merging?

**Answer:** Combining multiple interfaces with the same name.
**Explanation:** TypeScript merges their properties automatically.

---

## What is a Generic Constraint?

**Answer:** Restricts allowed generic types.
**Explanation:** Uses the `extends` keyword.

```ts
function getId<T extends { id: number }>(obj: T)
```

---

## What is Strict Mode?

**Answer:** Enables stricter type checking.
**Explanation:** Helps catch more bugs during development.

---

## What is tsconfig.json?

**Answer:** TypeScript configuration file.
**Explanation:** Controls compiler behavior and project settings.

---

## Difference Between TypeScript and JavaScript?

**Answer:** TypeScript adds static typing to JavaScript.
**Explanation:** It compiles into plain JavaScript before execution.


# Vue 3 + TypeScript — Interview Prep Reference
 
> **How to use this:** Don't just read it. Cover the answer, say it out loud, *then* check.
> Reading ≠ being able to write it cold. The interview tests the second thing.
>
> ⚠️ = a common follow-up trap the interviewer will spring on you.
 
---
 
## PART 1 — TypeScript Fundamentals You Can't Skip
 
These come up *inside* Vue questions, so they're not optional.
 
### `any` vs `unknown` vs `never`
 
| Type | Meaning | Use it when |
|------|---------|-------------|
| `any` | turns type checking **off** | almost never — it's an escape hatch that defeats the point of TS |
| `unknown` | "I don't know the type yet, force me to check before using it" | API responses, `catch` errors, anything untrusted |
| `never` | a value that can **never** exist | exhaustive checks, functions that always throw |
 
```ts
let a: any = 5
a.foo.bar     // no error — dangerous, TS trusts you blindly
 
let u: unknown = 5
u.foo         // ERROR — must narrow first
if (typeof u === "number") u.toFixed(2)  // OK now
```
 
**One-liner to say:** *"`unknown` is the safe version of `any` — same flexibility, but it forces you to check the type before using it."*
 
⚠️ **"Why avoid `any`?"** → Because it silently disables type safety for everything it touches and spreads through your code. If you needed flexibility you'd reach for `unknown` or generics instead.
 
---
 
### `null` vs `undefined`
 
- `undefined` = variable declared but never assigned a value.
- `null` = intentionally set to "empty."
Practical Vue note: a ref that starts empty is usually `ref<T | null>(null)`.
 
---
 
### Interface vs Type
 
Both describe object shapes. The differences that matter:
 
```ts
interface User { name: string }
type User2 = { name: string }
```
 
- **Interface** can be *reopened* (declaration merging) and `extends` other interfaces. Better for object/class contracts.
- **Type** can do unions, intersections, primitives, tuples — things interface can't.
```ts
type ID = string | number        // ✅ type only
type Point = [number, number]    // ✅ type only
```
 
**Rule of thumb to say:** *"Interface for object shapes and public APIs, type for unions, tuples, and anything that isn't a plain object."*
 
⚠️ **"When would you pick interface?"** → When defining the shape of an object or a class contract, especially in a library, because it can be extended and merged.
 
---
 
### Type inference vs annotation
 
```ts
const x = 5            // inferred as number — annotation redundant
const y: number = 5    // explicit — noise here
 
const items = ref<string[]>([])  // annotation NEEDED — [] alone infers never[]
```
 
**Rule:** *"Infer when the value tells the full story. Annotate when it doesn't —
empty arrays, nulls, or values added later."*
 
---
 
## PART 2 — Vue 3 + TypeScript (The Core of a Vue Interview)
 
### Typing `ref`
 
```ts
const count = ref(0)            // type is Ref<number>, inferred
```
 
⚠️ **THE classic trap:** What type is `count`?
→ It's **`Ref<number>`**, NOT `number`. The *unwrapped value* is `number`.
That's why you read it with `count.value`. `count` is the box; `.value` is what's inside.
 
When you DO need the explicit generic:
 
```ts
const userId = ref<number | null>(null)   // starts null, will hold number
const items  = ref<string[]>([])          // [] alone → never[]
```
 
---
 
### Typing `reactive`
 
```ts
const state = reactive({ count: 0, name: "Sam" })
// inferred as { count: number; name: string }
```
 
⚠️ **`Ref<T>` vs `Reactive<T>` difference:**
- `ref` wraps ANY value (primitives too), accessed via `.value`.
- `reactive` only works on **objects**, accessed directly (no `.value`).
- `ref` can be reassigned (`count.value = 5`); reassigning a whole `reactive` object breaks reactivity.
**Say:** *"Use `ref` for primitives and when you might reassign; `reactive` for objects you mutate in place."*
 
---
 
### Typing Props (type-based — the modern way)
 
```ts
const props = defineProps<{
  title: string
  count?: number     // ? = optional
}>()
```
 
With defaults — you MUST use `withDefaults`:
 
```ts
const props = withDefaults(defineProps<{
  title: string
  count?: number
}>(), {
  count: 0
})
```
 
⚠️ **"How do you set defaults with type-based props?"** → `withDefaults`. The
generic form has no slot for defaults on its own. This pairing is asked constantly.
 
**Best practice line:** *"Prefer type-based props in Vue 3.3+ — cleaner and safer than the runtime object form."*
 
---
 
### Typing Emits
 
```ts
const emit = defineEmits<{
  update: [value: string]        // event name: [payload types]
  close: []                      // no payload
}>()
 
emit("update", "hello")          // ✅
emit("update", 123)              // ❌ type error — must be string
```
 
(That tuple syntax is the Vue 3.3+ shorthand. Older syntax:
`defineEmits<{ (e: 'update', value: string): void }>()` — know it exists but use the new one.)
 
⚠️ Interviewers love this because it's where type safety actually pays off —
the compiler catches wrong event payloads.
 
---
 
### Typing `computed`
 
```ts
const double = computed(() => count.value * 2)
// return type inferred as ComputedRef<number>
```
 
Usually no annotation needed — it infers from the return. Explicit only if you want to force a type:
 
```ts
const label = computed<string>(() => `Count: ${count.value}`)
```
 
---
 
### Typing `watch`
 
```ts
watch(count, (newVal, oldVal) => {
  // newVal and oldVal are typed as number automatically
})
```
 
The callback params are inferred from the source. No manual typing needed in the common case.
 
---
 
### Typing a Composable
 
A composable is just a function — type its return so consumers get safety:
 
```ts
function useCounter(initial: number) {
  const count = ref(initial)
  const increment = () => count.value++
  return { count, increment }
}
```
 
Return type is inferred. Caller gets `count: Ref<number>` and `increment: () => void` for free. That inference *is* the selling point of composables in TS.
 
---
 
### Typing a Pinia Store
 
```ts
export const useUserStore = defineStore("user", () => {
  const name = ref("")
  const age = ref<number | null>(null)
  const setName = (n: string) => { name.value = n }
  return { name, age, setName }
})
```
 
Setup-syntax stores get types inferred automatically — same as composables.
This is why the setup syntax is preferred for TS projects.
 
⚠️ **"How do you type a Pinia store?"** → With setup syntax you barely type
anything — `ref`/`computed` inference handles it. That's the answer they want.
 
---
 
### Typing an API response (very common)
 
```ts
interface User {
  id: number
  name: string
  email: string
}
 
const users = ref<User[]>([])
 
async function fetchUsers() {
  const res = await fetch("/api/users")
  const data: User[] = await res.json()   // annotate — json() returns any
  users.value = data
}
```
 
⚠️ **Key point to say:** `res.json()` returns `any`, so you annotate the result
to restore type safety. With Axios:
 
```ts
const { data } = await axios.get<User[]>("/api/users")  // data is User[]
```
 
---
 
### Typing `provide` / `inject`
 
Use an `InjectionKey` so the types line up across provide and inject:
 
```ts
import type { InjectionKey, Ref } from "vue"
 
const CountKey: InjectionKey<Ref<number>> = Symbol("count")
 
provide(CountKey, ref(0))
const count = inject(CountKey)   // typed as Ref<number> | undefined
```
 
⚠️ Without the typed key, `inject` returns `unknown`. The `InjectionKey` is what carries the type.
 
---
 
### Typing template refs
 
```ts
const inputRef = ref<HTMLInputElement | null>(null)
// <input ref="inputRef">
onMounted(() => inputRef.value?.focus())
```
 
Starts `null` (element doesn't exist until mounted), so the `| null` and the `?.` are both required.
 
---
 
## PART 3 — Generics & Utility Types (the ones that actually appear)
 
### Generics — the 30-second pitch
 
A generic is a **type placeholder** filled in when the function/type is used. Lets one piece of code work with many types *without losing type safety* (unlike `any`).
 
```ts
function first<T>(arr: T[]): T {
  return arr[0]
}
first([1, 2, 3])        // T = number, returns number
first(["a", "b"])       // T = string, returns string
```
 
⚠️ **"Why not just use `any`?"** → `any` loses the type — you wouldn't know the
return is a number. Generics *preserve* the relationship between input and output.
 
**Constraints** (`extends`):
 
```ts
function getLength<T extends { length: number }>(x: T) {
  return x.length    // safe — T guaranteed to have .length
}
```
 
---
 
### Utility Types — the high-frequency five
 
```ts
interface User { id: number; name: string; email: string }
 
Partial<User>   // all properties optional → { id?; name?; email? }
Required<User>  // all properties required
Readonly<User>  // all properties readonly
Pick<User, "id" | "name">   // subset → { id; name }
Omit<User, "email">         // everything except → { id; name }
Record<string, number>      // { [key: string]: number }
```
 
Where they shine in Vue:
- `Partial<T>` → form state where fields fill in gradually, or update payloads.
- `Pick`/`Omit` → deriving a prop type from a bigger model without redefining it.
- `Record` → typed maps/dictionaries.
**Say:** *"Utility types let me derive new types from existing ones instead of
duplicating definitions — one source of truth for my data shapes."*
 
---
 
## PART 4 — Error Handling (short but asked)
 
⚠️ **"Why is the `catch` variable typed `unknown`?"**
→ Because anything can be thrown in JS (not just `Error` objects), so TS can't
assume it's an `Error`. You must narrow it:
 
```ts
try {
  doThing()
} catch (e) {
  if (e instanceof Error) {
    console.log(e.message)   // safe now
  }
}
```
 
---
 
## PART 5 — Senior-Flavored Questions (one-line answers ready)
 
- **Migrate JS → TS?** Rename `.js`→`.ts` incrementally, enable `allowJs`, start with loose config, turn on `strict` gradually, type the riskiest/most-shared code first.
- **What config do you always enable?** `strict: true` (the big one), `noImplicitAny`, `strictNullChecks`. Strict mode catches the bugs that matter.
- **Common junior mistakes?** Overusing `any`, not using strict mode, typing `count` as `number` instead of `Ref<number>`, redefining types instead of deriving with utility types.
- **Structuring types in big apps?** Shared `types/` or colocated with features, interfaces for API/DTO shapes, derive view models with `Pick`/`Omit`, one source of truth per entity.
---
 
## The 10 things to over-prepare for a Vue role
 
1. `count` is `Ref<number>`, not `number` ← they WILL ask
2. Type-based props + `withDefaults` for defaults
3. `defineEmits` tuple syntax
4. `ref` vs `reactive` (when to use which)
5. Typing API responses + `axios.get<T>()`
6. `any` vs `unknown` vs `never`
7. Generics: why they beat `any`
8. The 5 utility types + where they help in Vue
9. `catch` is `unknown`, narrow with `instanceof`
10. `InjectionKey` for typed provide/inject
> Drill these by **writing them blank**, not reading. That's the whole game.

# TypeScript + Vue 3 — Mental Models (Not Syntax)

> **Mentor's promise:** by the end of this you won't *recall* syntax — you'll *derive* it. Every concept is taught as a model: a one-sentence intuition, the problem it kills, and the shape it takes in your head. Syntax then falls out automatically.

**How to read this:**
- Read the **🧠 Mental Model** line first. If you remember nothing else, remember that.
- The 10 lenses (Why / What problem / When / When not / Relates to / Interview mistakes / Real-world / TS typing / Memory trick / Beginner→Advanced) appear per concept, sometimes merged when short.
- **Do the exercises.** Reading TS feels easy and teaches nothing. Typing it from a blank file is the whole game. Solutions are collapsed — attempt first.

**The single biggest reframe:**
> TypeScript is not "JavaScript with annotations." It's a **second program that runs at author-time** describing the *shape of your data*. Vue's reactivity is a **third program that runs at run-time** describing *when things change*. Most interview confusion is mixing up which program you're in. Keep them separate in your head:
>
> ```
> TYPE WORLD (compile-time)        VALUE WORLD (run-time)
> interface, type, generics  ─┐     ref, reactive, computed
> exists only in the editor    │     exists when the app runs
> erased before the browser ───┘     this is what users see
> ```

---

# PART 1 — TYPESCRIPT FUNDAMENTALS

## 1.1 Primitive Types

🧠 **Mental model:** *A primitive type is a label that says "this slot can only ever hold this kind of single value."* `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`.

**Why it exists / what problem it solves:** JavaScript lets `let x = 5` later become `x = "hello"` become `x = {}`. That flexibility is the #1 source of runtime bugs (`undefined is not a function`). Primitives let the compiler reject the reassignment *before* it ships.

**When to use:** always, implicitly. You rarely *write* `: number` on a literal because inference (1.2) does it. You write it on **function parameters** and **uninitialized variables**, where there's nothing to infer from.

**When NOT to use:** don't annotate what's obvious — `const x: number = 5` is noise. Let inference work.

**Relates to:** Literal types (1.6) narrow a primitive to *one* value. Union (1.4) widens to *several*.

**Interview mistakes:**
- Confusing `null` and `undefined`. Model: `undefined` = "this was never set"; `null` = "I deliberately set it to nothing."
- Using `any` to "fix" a type error — that disables the whole point. Use `unknown` if you truly don't know (it forces you to narrow before use).
- Thinking `Number`/`String` (capital) are the types — those are the wrapper objects; use lowercase `number`/`string`.

**TS typing patterns:**
```ts
let age: number = 25            // explicit (needed if not initialized inline)
let name = 'Venki'              // inferred as string — don't annotate
let id: string | null = null    // can be a string later
let data: unknown               // "unknown for now, narrow me later"
// let bad: any                 // ❌ avoid — turns off type checking
```

**Memory trick:** *"Primitives are the atoms. Everything else (objects, arrays, unions) is molecules built from them."*

<details><summary>📝 Exercise 1.1</summary>

1. Declare a variable `score` that starts uninitialized and will hold a number.
2. Declare `username` initialized to `'sam'` — should you annotate it? Why/why not?
3. You receive `let response: unknown` from an API. Log its `.length` only if it's a string.

<details><summary>Solution</summary>

```ts
let score: number                 // 1 — annotate because nothing to infer from

let username = 'sam'              // 2 — DON'T annotate; inferred as string. Annotation = redundant noise.

let response: unknown
if (typeof response === 'string') {
  console.log(response.length)    // 3 — narrowing unlocks string methods
}
```
The `unknown` → `typeof` narrowing is a *huge* interview signal of maturity. `any` would skip the check and risk a runtime crash.
</details>
</details>

---

## 1.2 Type Inference

🧠 **Mental model:** *The compiler is constantly guessing the type from the value you assigned. Inference = "let TS do the typing for me."*

**Why it exists / problem solved:** Annotating everything is verbose and drifts out of sync. Inference keeps types correct with zero ceremony — the value *is* the source of truth.

**When to use:** for local variables initialized inline, and for function return types (usually). `const total = a + b` → TS knows it's `number`.

**When NOT to use (annotate instead):**
1. **Function parameters** — there's no value to infer from. Always annotate.
2. **Public API / function return types** you want to *lock* — annotate so an accidental change to the body becomes a compile error at the boundary, not deep inside callers.
3. **Empty containers** — `const users = ref([])` infers `never[]`; you must say `ref<User[]>([])`.

**Interview mistakes:**
- `const x = []` then `x.push(5)` — works, but `const x = [].map(...)` may infer `never`. Empty literals need help.
- Believing inference reads your *intent*. It only reads the *value*. `let x = 5` infers `number`, not "5" — to get the literal, use `const` or annotate.

**`let` vs `const` inference (key model):**
```ts
let a = 'hello'      // inferred: string  (let → widened, can reassign)
const b = 'hello'    // inferred: 'hello' (const → literal, can't change)
```

**Memory trick:** *"Inference reads the value, not your mind. Empty box → tell it what goes in."*

<details><summary>📝 Exercise 1.2</summary>

What does TS infer for each? Then say which need a manual annotation and why.
```ts
let a = 42
const b = 'admin'
let c = []
const d = { name: 'Venki', age: 29 }
function e(x) { return x * 2 }
```

<details><summary>Solution</summary>

```ts
let a = 42              // number
const b = 'admin'      // 'admin' (literal — const)
let c = []             // any[] / never[] ⚠️ — ANNOTATE: let c: number[] = []
const d = { name: 'Venki', age: 29 }  // { name: string; age: number } ✅
function e(x) { return x * 2 }         // x is implicitly any ⚠️ — ANNOTATE: (x: number)
```
The two that need annotation are `c` (empty container) and `e`'s parameter (no value to infer from). These are the exact two cases that bite people in interviews.
</details>
</details>

---

## 1.3 Type Annotation

🧠 **Mental model:** *An annotation is a promise you make to the compiler: "this slot will only ever hold this shape." TS holds you to it.*

**Why / problem:** The inverse of inference. Where there's no value yet (params, class fields, empty refs) or where you want a hard contract, you state the type explicitly.

**When to use:** function parameters, return types you want to pin, variables declared before assignment, and Vue generics (`ref<T>()`).

**When NOT to use:** when inference already nails it. Over-annotation is a code smell — it means fighting the compiler instead of using it.

**The 3 annotation positions to burn in:**
```ts
function greet(name: string): string {   // param : type, then : return type
  const msg: string = `Hi ${name}`        // variable : type (often unneeded)
  return msg
}
```

**Interview mistake:** annotating the return type as `any` "to be safe." That's the opposite of safe.

**Memory trick:** *"Annotate the inputs (params) and the boundaries (public returns). Let inference handle the inside."*

---

## 1.4 Union Types (`A | B`)

🧠 **Mental model:** *"OR." This value is **one of** these types — but you must check which before using type-specific features.* Think of a light switch that's `'on' | 'off'`.

**Why / problem solved:** Real data is rarely one fixed type. An id is `string | number`. A status is `'idle' | 'loading' | 'error'`. A fetch result is `User | null`. Unions model "could be several things" *precisely*, instead of collapsing to `any`.

**When to use:** status flags, nullable values, polymorphic inputs, discriminated state machines (the loading/error/data pattern).

**When NOT to use:** when the variants share no meaning — that's a smell you should split into separate variables. Also avoid unions so wide they're effectively `any`.

**Narrowing (the whole point):** A union is locked until you *narrow* it with a check (`typeof`, `in`, `===`, custom guard). TS then knows the exact type inside the branch.
```ts
function format(id: string | number): string {
  if (typeof id === 'number') return id.toFixed(0)  // here id IS number
  return id.toUpperCase()                            // here id IS string
}
```

**Discriminated unions (senior-level, appears constantly in Vue state):**
```ts
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User[] }   // data only exists here
  | { status: 'error'; message: string }  // message only exists here

function render(s: State) {
  if (s.status === 'success') s.data       // ✅ TS knows data exists
  // s.data on 'idle' → compile error ✅
}
```

**Relates to:** Literal types (the discriminant `'success'` is a literal). This is the type-world version of Vue's loading/error/data UI states.

**Interview mistakes:**
- Forgetting to narrow → "Property 'x' does not exist on type 'A | B'." The fix is *always* a guard, never a cast.
- Using a boolean soup (`isLoading`, `isError`, `isSuccess`) instead of one discriminated union — three booleans allow impossible states (`loading && error`). A union makes those unrepresentable.

**Memory trick:** *"Union = OR = 'pick one, but prove which.' Narrow before you use."*

<details><summary>📝 Exercise 1.4</summary>

1. Type a `notify(target: ...)` that accepts an email `string` or a list of emails `string[]`, and always logs a count of recipients.
2. Model a fetch result as a discriminated union with `idle | loading | success(data) | error(message)` and write a function returning a display string for each.

<details><summary>Solution</summary>

```ts
// 1
function notify(target: string | string[]): void {
  const list = typeof target === 'string' ? [target] : target  // narrow → normalize
  console.log(`${list.length} recipient(s)`)
}

// 2
type Fetch<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string }

function display(s: Fetch<User[]>): string {
  switch (s.status) {
    case 'idle': return 'Start a search'
    case 'loading': return 'Loading…'
    case 'success': return `${s.data.length} users`   // data only valid here
    case 'error': return s.message                     // message only valid here
  }
}
```
The discriminated union is the single most impressive TS pattern to show in a Vue interview — it's exactly how you'd type a composable's return.
</details>
</details>

---

## 1.5 Intersection Types (`A & B`)

🧠 **Mental model:** *"AND." This value is **all of** these at once — merge their properties.* Union picks one; intersection combines.

**Why / problem solved:** Composition of capabilities. A `Draggable & Resizable` widget has both interfaces' methods. A component's props might be `BaseProps & { extra: string }`. It's how you *extend by combining* without inheritance.

**When to use:** mixing in extra props, combining a base type with role-specific fields, building up component prop types from shared fragments.

**When NOT to use:** when the two types **conflict** (`{ x: string } & { x: number }` → `x: never`, unusable). Also don't intersect when one type should *extend* an interface — interface `extends` is clearer for object hierarchies.

**Union vs Intersection (the diagram people forget):**
```
Union  A | B   →  value is A   OR  B      (fewer guarantees, must narrow)
Inter. A & B   →  value is A  AND  B      (more guarantees, more required props)

   A | B                         A & B
  ┌───────┐                    ┌───────┐
  │  A    │  pick one          │ A ∩ B │  must satisfy both
  │   ┌───┼───┐                │  ███  │
  └───┤   │ B │                └───────┘
      └───────┘
```
Counter-intuitive: `|` gives you a **bigger** set of possible values but a **smaller** set of usable properties; `&` gives a **smaller** set of values but a **bigger** set of guaranteed properties.

**TS typing patterns:**
```ts
interface Timestamps { createdAt: string; updatedAt: string }
interface User { id: number; name: string }
type StoredUser = User & Timestamps      // has id, name, createdAt, updatedAt
const u: StoredUser = { id: 1, name: 'V', createdAt: '…', updatedAt: '…' }
```

**Interview mistake:** expecting `A | B` to give access to all props (that's `&`), or expecting `A & B` of conflicting primitives to work (it produces `never`).

**Memory trick:** *"`&` adds requirements (AND more props). `|` adds possibilities (OR more values)."*

---

## 1.6 Literal Types

🧠 **Mental model:** *A type that is exactly one value.* Not "a string" but the string `'admin'`. Narrows a primitive down to a single allowed constant.

**Why / problem solved:** `role: string` allows `'amdin'` (typo) and `'banana'`. `role: 'admin' | 'user' | 'guest'` allows only the three valid ones — the compiler becomes your enum/validator for free.

**When to use:** finite sets of options — roles, statuses, sizes, directions, event names, HTTP methods. Combined with `|` they replace most enums.

**When NOT to use:** open-ended values (a person's name). And prefer a **union of literals** or `as const` object over a TS `enum` (see 1.9).

**How they appear (and the `as const` trick):**
```ts
type Status = 'idle' | 'loading' | 'success' | 'error'   // union of string literals
let s: Status = 'loading'   // 'banana' → compile error ✅

const sizes = ['sm', 'md', 'lg'] as const   // readonly tuple of literals
type Size = typeof sizes[number]             // 'sm' | 'md' | 'lg' — derived, single source of truth
```

**Relates to:** the discriminant of a discriminated union (1.4) is a literal. Vue prop validation (`type: String` + a runtime check) is the value-world twin.

**Interview mistake:** reaching for `enum` when a literal union is lighter, tree-shakeable, and needs no runtime code.

**Memory trick:** *"Literal = the value IS the type. `'admin'` the value becomes `'admin'` the type."*

<details><summary>📝 Exercise 1.6</summary>

1. Type a `Button` variant prop allowing only `'primary' | 'secondary' | 'danger'`.
2. Given `const roles = ['admin', 'editor', 'viewer'] as const`, derive a `Role` type from it without retyping the strings.

<details><summary>Solution</summary>

```ts
// 1
type Variant = 'primary' | 'secondary' | 'danger'
function Button(props: { variant: Variant }) {}

// 2
const roles = ['admin', 'editor', 'viewer'] as const
type Role = typeof roles[number]   // 'admin' | 'editor' | 'viewer'
```
Exercise 2 is the "single source of truth" pattern: the runtime array and the compile-time type can never drift apart. Big senior signal.
</details>
</details>

---

## 1.7 Type Aliases (`type`)

🧠 **Mental model:** *A nickname for any type expression.* `type ID = string | number` — now `ID` stands in everywhere. It's a `const` for types.

**Why / problem solved:** DRY for types. Instead of writing `string | number` in 12 places (and fixing 12 places when it changes), name it once. Also names complex shapes so errors read clearly.

**When to use:** unions, intersections, function types, tuples, mapped/conditional types, primitives you want to label. Anything that isn't *only* an object shape.

**When NOT to use:** for object shapes you expect others to **extend/implement** or **merge** — that's where `interface` shines (see 3.1). Rule of thumb: `interface` for object contracts, `type` for everything else.

**TS typing patterns:**
```ts
type ID = string | number
type Point = { x: number; y: number }
type Handler = (e: Event) => void
type Pair<T> = [T, T]                  // aliases can be generic
```

**Interview mistake:** thinking `type` and `interface` are interchangeable always — they overlap for object shapes, but only `type` can alias unions/primitives/tuples, and only `interface` declaration-merges.

**Memory trick:** *"`type` = nickname for ANY type. `interface` = contract for an OBJECT."*

---

## 1.8 Interfaces

🧠 **Mental model:** *A contract describing the shape of an object — "anything I accept here must have at least these properties of these types."*

**Why / problem solved:** Object shape safety + a name that appears in errors and autocomplete. It's how you describe API responses, component props, store state, function options bags.

**When to use:** object shapes, especially **public contracts**, things meant to be `extend`ed or `implement`ed, and anything that benefits from declaration merging (rare in app code, common in libs).

**When NOT to use:** unions, primitives, tuples, function-type aliases → use `type`.

**Structural typing (the model that surprises OO people):** TS checks the *shape*, not the *name*. If it has the right properties, it fits — no explicit `implements` needed.
```ts
interface Named { name: string }
function hi(x: Named) { return `Hi ${x.name}` }
hi({ name: 'V', age: 9 })   // ✅ extra props on a literal? careful — see below
const u = { name: 'V', age: 9 }
hi(u)                        // ✅ u has name → fits structurally
```

**Extending & merging:**
```ts
interface Animal { name: string }
interface Dog extends Animal { breed: string }   // inheritance

interface Win { x: number }
interface Win { y: number }   // declaration merging → Win has x AND y
```

**Relates to:** Vue `defineProps<Props>()` takes an interface/type. Pinia state, composable return shapes — all interfaces.

**Interview mistakes:**
- "Excess property check": object **literals** passed directly are checked for extra props (`hi({ name:'V', age:9 })` errors), but a **variable** is not. Knowing *why* (freshness check) is a senior signal.
- Saying interfaces are "just like Java interfaces" — TS is *structural*, not nominal.

**Memory trick:** *"Interface = the shape of the box. If your object has the right knobs, it fits — TS doesn't care what you named it."*

<details><summary>📝 Exercise 1.8</summary>

1. Write a `User` interface (`id: number`, `name: string`, `email: string`).
2. Extend it into `Admin` that adds `permissions: string[]`.
3. Write `canDelete(a: Admin): boolean` returning whether `'delete'` is in permissions.

<details><summary>Solution</summary>

```ts
interface User { id: number; name: string; email: string }
interface Admin extends User { permissions: string[] }

function canDelete(a: Admin): boolean {
  return a.permissions.includes('delete')
}
```
</details>
</details>

---

## 1.9 Enums

🧠 **Mental model:** *A named set of constants.* `enum Role { Admin, User }`. BUT — in modern TS/Vue, prefer a **union of literals** or an `as const` object 90% of the time.

**Why enums exist:** to give meaningful names to a fixed set of related constants and a single namespace (`Role.Admin`).

**When to use enums:** when you want a runtime object you can iterate, reverse-map (numeric enums), or share a single named namespace across many files — and you're OK with the generated JS.

**When NOT to use (this is the interview opinion they want):**
- Enums **emit runtime code** (an IIFE/object), so they're not erased like other types and can bloat bundles / break tree-shaking.
- `const enum` fixes the runtime cost but breaks under some bundlers/`isolatedModules` (Vite). Fragile.
- A **union of string literals** is lighter, fully erased, and just as safe:
```ts
// Prefer this:
type Role = 'admin' | 'user' | 'guest'

// Or an as-const object if you need runtime values to iterate:
const Role = { Admin: 'admin', User: 'user' } as const
type Role = typeof Role[keyof typeof Role]   // 'admin' | 'user'
```

**Interview mistake:** using numeric enums and relying on the auto-incremented numbers (`Admin = 0`) — reordering silently changes stored values. Always assign explicit values, or use string literals.

**Memory trick:** *"Enum = the one TS feature that survives into runtime. Usually that's a bug, not a feature — reach for literal unions."*

---

## 1.10 Generics

🧠 **Mental model:** *A type variable — a "type-shaped parameter."* A function/type that works over *any* type the caller plugs in, while **preserving** that type end-to-end. `T` is to types what a function parameter is to values.

**Why / problem solved:** Without generics you'd either duplicate code per type (`firstNumber`, `firstString`…) or lose safety with `any` (`first(arr: any[]): any` — return type is now garbage). Generics give you **reuse AND safety**: one function, full type preservation.

```
any:       arr ─► first ─► any      (works, but you lost the type)
generic:   T[]  ─► first ─► T        (works AND remembers the type)
                  ▲
        the type flows through, not erased
```

**When to use:** containers/wrappers (`ref<T>`, `Array<T>`, `Promise<T>`), functions whose output type depends on input type, reusable composables (`useFetch<T>`), API response wrappers.

**When NOT to use:** when there's only ever one concrete type — a generic with a single call site is over-engineering. Also don't add `<T>` you never reference; if `T` appears once, it's just `any` in disguise.

**Constraints (`extends`) — the senior move:** restrict what `T` can be so you can safely use its properties.
```ts
function prop<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]   // K is guaranteed to be a real key of T → return type is exact
}
prop({ name: 'V', age: 9 }, 'age')   // inferred return: number ✅
prop({ name: 'V' }, 'xyz')           // compile error: 'xyz' not a key ✅
```

**TS typing patterns (Vue-flavored):**
```ts
function useFetch<T>(url: string) {
  const data = ref<T | null>(null)        // T flows into the ref
  const load = async () => { data.value = await (await fetch(url)).json() as T }
  return { data, load }
}
const { data } = useFetch<User[]>('/api/users')   // data: Ref<User[] | null>
```

**Relates to:** `ref<T>()`, `computed<T>()`, `Array<T>`, `Promise<T>`, every utility type (1.11) is generic. Composables are *the* place generics earn their keep in Vue.

**Interview mistakes:**
- Writing `<T>` but never using `T` in params/return → pointless.
- Using `any` where a generic belongs ("I don't know the type" → you don't need to; let the caller supply it).
- Forgetting constraints, then getting "T is not indexable / has no properties." Fix with `T extends ...`.

**Memory trick:** *"Generic = a function for types. `<T>` is a parameter you fill with a type instead of a value. It remembers, `any` forgets."*

<details><summary>📝 Exercise 1.10</summary>

1. Write a generic `identity<T>(x: T): T`.
2. Write `last<T>(arr: T[]): T | undefined` returning the last element, type-preserved.
3. Write `pluck<T, K extends keyof T>(arr: T[], key: K): T[K][]` returning an array of one property across objects (e.g. all the `name`s).

<details><summary>Solution</summary>

```ts
// 1
function identity<T>(x: T): T { return x }

// 2
function last<T>(arr: T[]): T | undefined { return arr[arr.length - 1] }

// 3
function pluck<T, K extends keyof T>(arr: T[], key: K): T[K][] {
  return arr.map(item => item[key])
}
pluck([{ name: 'V', age: 9 }], 'name')   // string[]  ✅ exact, not any[]
```
`pluck` is a classic — it combines generics, `keyof`, constraints, and `.map`. If you can write it cold, you're ahead of most candidates.
</details>
</details>

---

## 1.11 Utility Types

🧠 **Mental model:** *Pre-built generic "type transformers."* They take a type and hand you a modified copy — without you re-declaring it. Think of them as `map`/`filter` but for the *shape* of a type. **Single source of truth:** define `User` once, derive everything else.

**Why / problem solved:** You have a `User`. You need "a User where everything is optional" (for a PATCH/form draft), or "just the id and name" (for a list view), or "User without the password" (for an API response). Re-declaring those by hand means they drift. Utility types derive them automatically.

```
        ┌──────────── Partial<User> ──── all optional (forms, patches)
        │
 User ──┼──────────── Pick<User, 'id'|'name'> ── subset (list views)
 (one   │
 source)├──────────── Omit<User, 'password'> ── remove fields (API output)
        │
        └──────────── Required<User> ──── all mandatory
```

### Partial<T> — all properties optional
**When:** update/PATCH payloads, form drafts, config with defaults, `{ ...defaults, ...overrides }`.
```ts
function updateUser(id: number, changes: Partial<User>) {}
updateUser(1, { name: 'New' })   // ✅ don't need every field
```

### Required<T> — all properties mandatory
**When:** after you've filled in defaults and want to guarantee nothing's missing downstream.
```ts
type Config = { host?: string; port?: number }
function start(cfg: Required<Config>) {}   // both now mandatory
```

### Pick<T, Keys> — keep only these keys
**When:** list/table rows, DTOs, "I only need a slice."
```ts
type UserListItem = Pick<User, 'id' | 'name'>   // { id; name } only
```

### Omit<T, Keys> — everything except these keys
**When:** strip sensitive/server-only fields; "everything but X."
```ts
type PublicUser = Omit<User, 'password' | 'email'>
type NewUser = Omit<User, 'id'>   // creating one: no id yet
```

### Record<Keys, Value> — an object/dictionary type
**When:** lookups, maps, keyed collections. `Record<K, V>` = "object whose keys are K and values are V."
```ts
type RoleAccess = Record<'admin' | 'user', boolean>   // { admin: boolean; user: boolean }
const usersById: Record<number, User> = {}            // dictionary keyed by id
```

### ReturnType<Fn> — the type a function returns
**When:** you have a function (or composable) and want its output type without restating it. *Huge* for typing composables.
```ts
function createUser() { return { id: 1, name: 'V' } }
type CreatedUser = ReturnType<typeof createUser>   // { id: number; name: string }

// Vue: type a composable's return in one line
function useCounter() { const count = ref(0); return { count, inc: () => count.value++ } }
type CounterApi = ReturnType<typeof useCounter>
```

### Parameters<Fn> — the parameter types as a tuple
**When:** wrapping/decorating a function (logging, memoizing) while keeping its signature.
```ts
function send(to: string, body: string) {}
type SendArgs = Parameters<typeof send>   // [to: string, body: string]
function logged(...args: Parameters<typeof send>) { console.log(args); send(...args) }
```

**Relates to:** all are generics (1.10). `Pick`/`Omit` are mirror images. `Partial`/`Required` are mirror images. They compose: `Partial<Omit<User, 'id'>>`.

**Interview mistakes:**
- Hand-rewriting a subtype instead of deriving it (then they drift).
- Confusing `Pick` (keep listed) vs `Omit` (drop listed) — say it out loud each time.
- Forgetting `typeof` before a value in `ReturnType<typeof fn>` / `Parameters<typeof fn>` — these take a *type*, and `fn` is a value, so you need `typeof` to get its type.

**Memory trick:**
- **Partial** = "**P**lease, all optional"
- **Required** = "all mandatory"
- **Pick** = "keep these" · **Omit** = "drop these" (oPposite)
- **Record** = "dictionary: keys → values"
- **ReturnType** = "what comes out" · **Parameters** = "what goes in"

<details><summary>📝 Exercise 1.11</summary>

Given:
```ts
interface User { id: number; name: string; email: string; password: string }
```
1. Type a `createUser` input that has everything **except** `id`.
2. Type a `patchUser` input where **every** field is optional.
3. Type a `UserCard` prop that has **only** `id` and `name`.
4. Type a `permissions` object mapping each role `'admin' | 'editor'` to a `boolean`.
5. Without retyping, get the return type of `function buildUser() { return { id: 1, active: true } }`.

<details><summary>Solution</summary>

```ts
type CreateUserInput = Omit<User, 'id'>                         // 1
type PatchUserInput  = Partial<User>                            // 2
type UserCardProps   = Pick<User, 'id' | 'name'>                // 3
type Permissions     = Record<'admin' | 'editor', boolean>     // 4
type BuiltUser       = ReturnType<typeof buildUser>            // 5  ({ id: number; active: boolean })
```
Notice every type is **derived** from `User` or the function — change the source, all derive correctly. That's the entire point.
</details>
</details>

---

# PART 2 — FUNCTIONS

> 🧠 **Overarching model:** *A function type is a contract with two halves — what goes IN (parameters) and what comes OUT (return). TS checks both ends so callers can't pass garbage and can't misuse the result.* Get the signature right and the body almost writes itself.

```
        INPUTS                         OUTPUT
   ┌──────────────┐                 ┌────────┐
   │ a: number    │ ──► function ──►│ number │
   │ b: string    │                 └────────┘
   └──────────────┘
   TS guards this side            TS guards this side
```

## 2.1 Function Types

🧠 **Mental model:** *A function is a value, so it has a type too: `(params) => returnType`.* You can name that shape and pass functions around like data.

**Why / problem solved:** Callbacks, event handlers, and higher-order functions need their *shape* described so you can't pass a wrong-shaped function. `arr.map(fn)` must know `fn` takes an item and returns something.

**When to use:** typing callbacks, props that are functions (`onClick: () => void`), composable return functions, event handlers.

**When NOT to use:** don't over-name trivial inline callbacks — inference handles `arr.map(x => x * 2)` already.

**The two ways to write a function (and their type forms):**
```ts
// declaration
function add(a: number, b: number): number { return a + b }

// expression / arrow with an explicit type alias
type BinaryOp = (a: number, b: number) => number
const add2: BinaryOp = (a, b) => a + b      // params inferred from the alias!
```
Note the payoff: once a variable has a function *type*, the parameters inside don't need annotation — they're inferred from the contract. This is **contextual typing**, and it's why `arr.map(x => …)` knows `x`'s type.

**`void` vs `undefined` return (subtle, interview-favorite):** `() => void` means "I don't care what it returns" — a callback typed `void` may still return a value that's ignored. `() => undefined` means it must literally return undefined. Use `void` for callbacks.

**TS typing patterns (Vue):**
```ts
const emit = defineEmits<{ (e: 'save', payload: User): void }>()   // event = function type
type AsyncFetcher<T> = (url: string) => Promise<T>
```

**Interview mistakes:**
- Annotating callback params that are already contextually typed (redundant).
- Typing a callback's return as something strict when `void` is correct.

**Memory trick:** *"A function's type is just `(in) => out`. Name the shape, and the params type themselves."*

---

## 2.2 Optional Parameters (`?`)

🧠 **Mental model:** *A parameter the caller may skip — so inside the function it's `T | undefined`.* The `?` adds `undefined` to its type.

**Why / problem solved:** Many functions have "extra, sometimes" inputs (a config flag, a callback). Optional params model "you can leave this out" without overloads.

**When to use:** trailing inputs that have sensible "absent" behavior.

**When NOT to use:** **never put an optional param before a required one** — that's a syntax error. Optional/defaulted params come last. Also, if "absent" should mean a specific value, prefer a *default* param (2.3) so you don't handle `undefined` everywhere.

**The gotcha:** inside the body you MUST handle `undefined`.
```ts
function greet(name: string, title?: string): string {
  // title is string | undefined here
  return title ? `${title} ${name}` : name   // must guard
}
greet('Venki')            // ✅
greet('Venki', 'Dr')      // ✅
```

**Interview mistake:** using `title.toUpperCase()` directly → "Object is possibly 'undefined'." The `?` *gives* you the bug warning; respect it.

**Memory trick:** *"`?` = 'maybe' = adds `| undefined`. Optional must come last and must be guarded."*

---

## 2.3 Default Parameters

🧠 **Mental model:** *An optional param with a fallback baked in — so inside the function it's the full type, never undefined.* The default fills the gap for you.

**Why / problem solved:** Removes the `undefined` guard *and* documents the intended fallback. Cleaner than `param ?? fallback` on line 1.

**When to use:** config flags, page sizes, retry counts, anything with an obvious "normal" value.

**When NOT to use:** when there's no sensible default (then it's just optional), or when the default is expensive to compute on every call.

**Key model — default ⇒ optional ⇒ type is narrowed:**
```ts
function paginate(page = 1, size = 20): void {
  // page: number, size: number — NO undefined, no guard needed ✅
}
paginate()          // 1, 20
paginate(3)         // 3, 20
paginate(3, 50)     // 3, 50
```
TS infers the param type *from the default* (`page = 1` → `page: number`). You usually don't annotate defaulted params.

**Interview mistake:** annotating `page: number = 1` (redundant) or assuming a default makes the param required — it makes it optional.

**Memory trick:** *"Default = optional + a safety net. The net means no `undefined` inside."*

<details><summary>📝 Exercise 2.2–2.3</summary>

1. Write `createUser(name: string, role?: ...)` where role is `'admin' | 'user'` and absent role logs "no role".
2. Rewrite it with a **default** role of `'user'` so there's no undefined check.

<details><summary>Solution</summary>

```ts
// 1 — optional
function createUser(name: string, role?: 'admin' | 'user'): void {
  console.log(role ? `${name}: ${role}` : `${name}: no role`)
}

// 2 — default (cleaner: no guard)
function createUser2(name: string, role: 'admin' | 'user' = 'user'): void {
  console.log(`${name}: ${role}`)   // role always defined
}
```
The default version is strictly nicer when a fallback makes sense — show both and explain the trade-off in interviews.
</details>
</details>

---

## 2.4 Rest Parameters (`...args`)

🧠 **Mental model:** *"Collect all the leftover arguments into one array."* The `...` gathers a variable number of inputs into a typed array.

**Why / problem solved:** Variadic functions — `sum(1,2,3,4)`, `console.log(...)`, combining class names. Without rest you'd force callers into an explicit array.

**When to use:** genuinely unbounded inputs of the *same* type; forwarding args (`logged(...args)`).

**When NOT to use:** when there's a fixed small number of params (just name them — clearer). Rest must be **last**.

**Typing:** rest params are typed as an **array** (or tuple).
```ts
function sum(...nums: number[]): number {
  return nums.reduce((acc, n) => acc + n, 0)   // nums is number[]
}
sum(1, 2, 3, 4)   // 10

// tuple rest = typed positional forwarding (advanced)
function wrap(...args: [id: number, name: string]) {}
```

**Relates to:** `Parameters<typeof fn>` (1.11) returns a tuple you can spread into a rest param — that's how you wrap/decorate functions with exact typing.

**Interview mistake:** confusing rest (collect, in a *declaration*) with spread (expand, at a *call site*) — same `...`, opposite jobs. `function f(...a)` collects; `f(...arr)` expands.

**Memory trick:** *"Rest = a vacuum that sucks the rest of the args into an array. Always last."*

---

## 2.5 Function Overloading

🧠 **Mental model:** *Multiple typed "front doors" to one function — different input shapes, different matching outputs.* You declare several signatures, then one implementation that handles them all.

**Why / problem solved:** When the **return type depends on the argument type/count** in a way a single union signature can't express precisely. Example: `getThing(id): One` but `getThing(): Many`. A union return would force callers to narrow on *every* call; overloads give each call site the exact type.

**When to use:** rarely — when one function legitimately has distinct input→output mappings (DOM `createElement('a')` returns `HTMLAnchorElement`, `createElement('div')` returns `HTMLDivElement`).

**When NOT to use (the senior opinion):** most of the time a **union type**, **generic**, or **optional param** is clearer. Overloads are verbose and the implementation signature isn't visible to callers. Reach for them only when simpler tools can't preserve the precise return type.

**Shape:**
```ts
// overload signatures (what callers see)
function parse(input: string): string[]
function parse(input: number): number[]
// implementation signature (callers DON'T see this; must be compatible with all)
function parse(input: string | number): string[] | number[] {
  return typeof input === 'string' ? input.split('') : [input]
}
parse('ab')   // string[] ✅ exact
parse(5)      // number[] ✅ exact
```

**Interview mistakes:**
- Reaching for overloads when a generic would do (`function first<T>(a: T[]): T` beats two overloads).
- Forgetting the implementation signature must be assignable from every overload.

**Memory trick:** *"Overload = several menus, one kitchen. Use only when the dish depends on the menu in a way unions can't capture."*

---

## 2.6 Async Functions

🧠 **Mental model:** *An `async` function ALWAYS returns a `Promise<T>` — the `T` is whatever you `return` inside. `await` unwraps a promise back to its value.* The type system mirrors the runtime exactly.

```
 async function f(): Promise<User>
                     └────┬─────┘
        you write `return user`  (a User)
        TS wraps it as Promise<User> automatically
        caller does `const u = await f()`  → u: User
```

**Why / problem solved:** Async is where types matter *most* (API data is the riskiest data) and where people get lazy with `any`. Typing the promise's payload makes the awaited value safe.

**When to use:** any I/O — fetch, file, DB, timers wrapped in promises. In Vue: `fetchUsers`, store actions, composables.

**When NOT to use:** don't mark a function `async` if it never awaits (it needlessly wraps the return in a promise). Don't `await` things that aren't promises.

**Typing patterns (the ones to write cold):**
```ts
async function fetchUsers(): Promise<User[]> {
  const res = await fetch('/api/users')
  if (!res.ok) throw new Error('Failed')
  return res.json() as Promise<User[]>      // or: return (await res.json()) as User[]
}

// generic async fetcher — reusable, type supplied by caller
async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(res.statusText)
  return res.json() as Promise<T>
}
const users = await getJson<User[]>('/api/users')   // users: User[]
```

**Relates to:** `Promise<T>` is a generic (1.10). The loading/error/data discriminated union (1.4) is how you *model* the async lifecycle in state. Vue `onMounted(async () => …)` for initial fetch.

**Interview mistakes:**
- Returning `Promise<any>` from a fetcher — the entire app downstream loses types.
- Forgetting `await` (you get a `Promise<User>` where you expected a `User` → "Property 'name' does not exist on type 'Promise<User>'").
- Not handling rejection — `try/catch` around `await`, or `.catch`. An unhandled async throw in a composable can crash silently.

**Memory trick:** *"`async` = 'I promise to return a T later.' The function's return type is the gift box `Promise<T>`; `await` opens it."*

<details><summary>📝 Exercise 2.6</summary>

1. Type an `async fetchUser(id: number)` that returns a `Promise<User>` and throws on a non-OK response.
2. Write a **generic** `getJson<T>(url)` returning `Promise<T>`, then call it to get `Post[]`.
3. Bonus: type a `loadUsers` that returns the discriminated `Fetch<User[]>` union from Exercise 1.4 — never throws, encodes errors in the value.

<details><summary>Solution</summary>

```ts
// 1
async function fetchUser(id: number): Promise<User> {
  const res = await fetch(`/api/users/${id}`)
  if (!res.ok) throw new Error(`User ${id} failed: ${res.status}`)
  return (await res.json()) as User
}

// 2
async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(res.statusText)
  return (await res.json()) as T
}
const posts = await getJson<Post[]>('/api/posts')   // posts: Post[]

// 3 — errors as VALUES, not exceptions (very senior pattern)
async function loadUsers(): Promise<Fetch<User[]>> {
  try {
    const res = await fetch('/api/users')
    if (!res.ok) return { status: 'error', message: res.statusText }
    return { status: 'success', data: (await res.json()) as User[] }
  } catch (e) {
    return { status: 'error', message: (e as Error).message }
  }
}
```
Pattern 3 — modeling errors as data instead of throwing — combines async + generics + discriminated unions. It's exactly how a robust `useFetch` composable is typed. Nail this and you've connected Part 1 and Part 2.
</details>
</details>

---

# PART 3 — OBJECTS

> 🧠 **Overarching model:** *An object type is a blueprint of "which keys exist and what type each holds." TS doesn't store data — it stores the SHAPE so it can reject the wrong shape.* In a Vue app, almost everything is an object shape: props, state, store, API payloads.

```
   THE SHAPE (type)              THE DATA (value)
   interface User {              const u: User = {
     id: number       ◄────────►   id: 1,
     name: string                  name: 'Venki'
   }                             }
   describes                     must match
```

## 3.1 Interface vs Type (the question they WILL ask)

🧠 **Mental model:** *Both describe object shapes. `interface` is a "contract" built to be extended and merged; `type` is a "nickname" that can name ANYTHING (unions, primitives, tuples, functions), not just objects.* For a plain object shape, they're ~interchangeable — pick by intent.

**The decision rule (say this in the interview):**
> "I default to **`interface` for object shapes** — especially public/extendable ones like props and API models — because it extends cleanly and gives nicer errors. I use **`type` for everything that isn't a plain object**: unions, intersections, tuples, function types, and mapped/conditional types. If I need declaration merging (rare in app code), only `interface` does that."

**Side-by-side:**

| Capability | `interface` | `type` |
|---|---|---|
| Object shapes | ✅ | ✅ |
| Union / intersection | ❌ | ✅ (`A \| B`, `A & B`) |
| Primitives / tuples / fn types | ❌ | ✅ |
| `extends` (inheritance) | ✅ `extends` | ✅ via `&` |
| Declaration merging | ✅ (reopen & add) | ❌ |
| Mapped / conditional types | ❌ | ✅ |
| Error message readability | usually cleaner | can get verbose |

```ts
// interface — extendable object contract
interface User { id: number; name: string }
interface Admin extends User { role: 'admin' }

// type — needs union/tuple/function → only type can do it
type ID = string | number
type Point = [number, number]
type Handler = (e: Event) => void
type AdminT = User & { role: 'admin' }   // type's version of extends
```

**When NOT to obsess:** for a single object shape, either works — don't let the interview rabbit-hole. State your default rule and move on. **Consistency > correctness** here.

**Interview mistakes:**
- Saying "they're identical" (false — only `type` aliases unions/primitives; only `interface` merges).
- Saying "always use type" or "always use interface" dogmatically — the senior answer is the *rule of thumb* above.

**Memory trick:** *"`interface` = object contract you'll extend. `type` = nickname for ANYTHING. Object & extendable → interface; union/primitive/tuple/function → type."*

---

## 3.2 Nested Objects

🧠 **Mental model:** *Objects inside objects = types inside types. Name each level so you can reuse it and read errors at the right depth.*

**Why / problem solved:** Real data is nested (`user.address.geo.lat`). Inlining all of it into one giant interface is unreadable and unreusable. Extracting each level gives named, reusable, individually-typeable pieces.

**When to use named sub-types:** when a nested shape (a) repeats, (b) is non-trivial, or (c) you'll reference it alone (e.g. an `<AddressForm>` prop). When to inline: a one-off, trivial nested bag.

```ts
// ❌ everything inline — unreadable, address not reusable
interface User1 { id: number; address: { street: string; geo: { lat: number; lng: number } } }

// ✅ extracted levels — reusable, readable, each typeable on its own
interface Geo { lat: number; lng: number }
interface Address { street: string; city: string; geo: Geo }
interface User { id: number; name: string; address: Address }

const u: User = {
  id: 1, name: 'Venki',
  address: { street: 'MG Rd', city: 'Hyd', geo: { lat: 17.3, lng: 78.4 } },
}
u.address.geo.lat   // fully typed all the way down ✅
```

**Interview mistakes:**
- Deeply optional chains without `?.` at runtime — types say it's there, but API data may not be. Type-safety ≠ runtime guarantee for *external* data; validate at the boundary.
- One mega-interface that can't be reused for a sub-component's props.

**Memory trick:** *"Nest types like you nest data. Pull each floor out into its own named blueprint."*

---

## 3.3 Dynamic Keys (Index Signatures & `Record`)

🧠 **Mental model:** *"I don't know the exact key names ahead of time, but I know the key TYPE and the value TYPE."* That's an index signature `{ [key: string]: V }`, or its friendlier alias `Record<K, V>`.

**Why / problem solved:** Dictionaries/lookups — `usersById`, `countsByCategory`, a translations map, a cache. You can't list every key, but every value has the same type.

**When to use:** keyed collections, caches, group-by results, config maps where keys are data.

**When NOT to use:** when the keys ARE known and finite — then list them (or use a literal-keyed `Record<'a'|'b', V>`). A loose `{ [k: string]: any }` throws away all safety; if you reach for that, reconsider.

**Two equivalent forms (prefer `Record` for readability):**
```ts
// index signature
interface Scores { [studentName: string]: number }
// Record (same thing, cleaner)
type Scores2 = Record<string, number>

const s: Record<string, number> = {}
s['venki'] = 90
s['raj'] = 85
s['anyone']         // number (TS assumes the key might exist)

// keyed by a literal union → known finite keys, all required
type Access = Record<'admin' | 'user' | 'guest', boolean>

// dictionary of objects (super common: normalize a list by id)
type UsersById = Record<number, User>
```

**The catch (interview gold):** with an index signature, TS assumes **any** key access returns `V` — even keys that don't exist at runtime. `s['typo']` is typed `number` but is actually `undefined`. Turn on `noUncheckedIndexedAccess` to make it `number | undefined` and force a guard. Mentioning this flag signals depth.

**Relates to:** `Record` (1.11), `keyof` (used to derive known keys), normalizing arrays into lookups for O(1) access (a performance pattern).

**Memory trick:** *"Dynamic keys = 'unknown labels, known contents.' `Record<KeyType, ValueType>` — keys on the left, values on the right."*

<details><summary>📝 Exercise 3.3</summary>

1. Type a `wordCount` object mapping any word (string) to its count (number).
2. Type a `featureFlags` object whose keys are exactly `'darkMode' | 'beta'` and values are booleans.
3. Type a `usersById` dictionary keyed by numeric id holding `User` objects, then write a typed lookup `getUser(id: number): User | undefined`.

<details><summary>Solution</summary>

```ts
// 1
type WordCount = Record<string, number>           // or { [word: string]: number }

// 2 — finite known keys → literal-keyed Record (all required)
type FeatureFlags = Record<'darkMode' | 'beta', boolean>

// 3
type UsersById = Record<number, User>
const usersById: UsersById = {}
function getUser(id: number): User | undefined {
  return usersById[id]   // honest return type: might be missing
}
```
Note the difference: #1 has *open* keys (any string), #2 has *closed* keys (only the two literals — TS will require both). Choosing open vs closed keys correctly is the skill being tested.
</details>
</details>

---

## 3.4 Readonly Properties

🧠 **Mental model:** *`readonly` = "set once at creation, never reassign after."* A compile-time lock on a property. (It does NOT deep-freeze and does NOT exist at runtime.)

**Why / problem solved:** Communicates and enforces immutability of identity-like fields (`id`), config, or props you must not mutate. Prevents a whole class of "who changed this?" bugs at author-time.

**When to use:** entity ids, configuration objects, function params you promise not to mutate, Vue **props** (which are read-only by design — mutating a prop is a classic mistake `readonly` would catch).

**When NOT to use:** working/draft state that's *meant* to change (a form model). And know its limits: it's **shallow** (nested objects are still mutable) and **erased at runtime** (no protection against JS that ignores types, unlike `Object.freeze`).

```ts
interface User {
  readonly id: number     // lock identity
  name: string            // mutable
}
const u: User = { id: 1, name: 'V' }
u.name = 'Venki'   // ✅
u.id = 2           // ❌ Cannot assign to 'id' because it is read-only

// whole-object readonly
const cfg: Readonly<{ host: string }> = { host: 'x' }
cfg.host = 'y'     // ❌

// readonly array — no push/pop/splice
const ids: readonly number[] = [1, 2, 3]
ids.push(4)        // ❌
```

**`readonly` (compile-time) vs `Object.freeze` (runtime):** `readonly` is a *type* annotation erased before the browser; `Object.freeze` actually freezes the object at runtime. Use `readonly` for author-time safety, `Object.freeze`/`Object.freeze` + `as const` when you need real runtime immutability.

**Relates to:** `Readonly<T>` utility (whole-object), `as const` (deeply readonly literals), Vue props being read-only, `Object.freeze`/`Object.seal` from the JS objects notes.

**Interview mistakes:**
- Thinking `readonly` deep-freezes (it's shallow).
- Thinking it protects at runtime (it's erased).
- Mutating a Vue prop — props are conceptually `readonly`; you should emit up instead.

**Memory trick:** *"`readonly` = write-once at birth. Shallow, compile-time only. For runtime locking, that's `Object.freeze`."*

---

## 3.5 Optional Properties (`?`)

🧠 **Mental model:** *`prop?: T` means the key may be absent — so its type is `T | undefined`.* Same idea as optional params (2.2), applied to object keys.

**Why / problem solved:** Not every object has every field. A `User` might not have a `middleName`. A form draft starts empty. Optional props model "might not be here" precisely, instead of forcing fake empty values or `any`.

**When to use:** genuinely optional fields, partial/draft objects, config with defaults, props with fallbacks.

**When NOT to use:** when a field is always present (don't make it optional "just in case" — that forces needless guards everywhere). If *all* fields are optional, reach for `Partial<T>` (1.11) instead of `?`-ing each one.

```ts
interface User {
  id: number
  name: string
  avatar?: string          // may be missing → string | undefined
  bio?: string
}
const u: User = { id: 1, name: 'V' }   // ✅ avatar/bio omitted

// inside code you must handle absence:
const src = u.avatar ?? '/default.png'   // nullish-coalesce the fallback
u.bio?.toUpperCase()                     // optional-chain before use
```

**Optional `?` vs `| undefined` (subtle but asked):**
- `avatar?: string` → key may be **absent** OR `undefined`. `{ id:1, name:'V' }` is valid.
- `avatar: string | undefined` → key must be **present**, value may be `undefined`. `{ id:1, name:'V' }` is an ERROR (avatar missing).

**Relates to:** `Partial<T>` (all keys optional), `Required<T>` (strip the `?`), `?.` and `??` operators at runtime, `defineProps` with optional props + defaults.

**Interview mistakes:**
- Using `u.avatar.length` without a guard → "possibly undefined."
- Confusing `?:` (may be absent) with `: T | undefined` (must be present, may be undefined).
- `?`-ing every field instead of `Partial<T>`.

**Memory trick:** *"`?` on a key = 'maybe here.' Guard with `?.`, default with `??`. All-optional → `Partial`."*

<details><summary>📝 Exercise 3.4–3.5</summary>

Given:
```ts
interface Product {
  readonly id: number
  name: string
  price: number
  discount?: number     // optional
}
```
1. Create a product, then try to reassign its `id` (what happens?).
2. Write `finalPrice(p: Product): number` applying the discount if present, else full price.
3. Type a `draftProduct` where every field is optional and id is no longer readonly-blocking creation.

<details><summary>Solution</summary>

```ts
// 1
const p: Product = { id: 1, name: 'Pen', price: 10 }
// p.id = 2   // ❌ compile error: id is readonly

// 2 — guard the optional
function finalPrice(p: Product): number {
  return p.discount ? p.price - p.discount : p.price
  // or: p.price - (p.discount ?? 0)
}

// 3 — Partial makes all optional (and drops the must-provide requirement)
type DraftProduct = Partial<Product>
const draft: DraftProduct = { name: 'WIP' }   // everything else omittable
```
`finalPrice` with `p.price - (p.discount ?? 0)` is the cleanest — `??` supplies 0 only when discount is absent/undefined. Mentioning `??` vs `||` (|| also replaces 0!) is a nice detail.
</details>
</details>

---

# PART 4 — ARRAYS

> 🧠 **The ONE diagram that fixes everything:**
>
> ```
>  User   = ONE object              User[]  = MANY objects (a list)
>  ┌──────────────┐                 ┌──────┬──────┬──────┐
>  │ id: 1        │                 │ User │ User │ User │
>  │ name: 'V'    │                 │  #1  │  #2  │  #3  │
>  └──────────────┘                 └──────┴──────┴──────┘
>  const user: User                 const users: User[]
> ```
> **The `[]` means "a list of."** `User` → one. `User[]` → many. `string` → one word; `string[]` → many words. This single distinction unlocks 80% of array typing. Singular variable name = `User`; plural variable name = `User[]`.

## 4.1 Array Types

🧠 **Mental model:** *An array type is "a list where every element is the same type." `T[]` = "many T."*

**Why / problem solved:** Lists are everywhere (users, todos, options). Typing the *element* makes every `.map`, `.filter`, index access, and `for…of` safe — TS knows what each item is.

**Two syntaxes (identical, pick one and be consistent):**
```ts
let nums: number[] = [1, 2, 3]        // preferred, reads as "array of number"
let nums2: Array<number> = [1, 2, 3]  // generic form — same thing
let names: string[] = ['a', 'b']
let flags: boolean[] = [true, false]
```

**When to use `Array<T>` form:** when `T` is itself complex (`Array<{ id: number }>` reads okay; `{ id: number }[]` can look cramped) or when emphasizing it's generic. Otherwise `T[]`.

**Empty array gotcha (the #1 inference trap — connects to 1.2):**
```ts
const a = []          // any[] (or never[] in strict) — DANGER
a.push(1); a.push('x')  // no error — types lost
const b: number[] = []  // ✅ tell it the element type up front
const c = ref<User[]>([])  // ✅ Vue: ALWAYS supply the generic for empty refs
```

**Mixed-type arrays:** use a union element type, not separate handling.
```ts
let mixed: (string | number)[] = [1, 'two', 3]   // each item is string OR number
// note: (string | number)[]  ≠  string[] | number[]
//   first = one array of mixed items
//   second = EITHER an all-string array OR an all-number array
```

**Tuples (fixed-length, positional — bonus):**
```ts
let pair: [string, number] = ['age', 30]   // exactly 2, in that order
const [key, val] = pair                     // key: string, val: number
```

**Interview mistakes:**
- Empty `[]` losing types (annotate or supply a generic).
- Confusing `(A | B)[]` with `A[] | B[]`.
- Using `any[]` — it's contagious; every operation downstream is `any`.

**Memory trick:** *"`[]` = 'list of.' Element type goes on the left of `[]`. Empty list? Tell TS what lives in it."*

---

## 4.2 Array of Objects

🧠 **Mental model:** *The bread-and-butter shape of every app: `User[]`. Define the object once (`User`), append `[]` for the list.* This is what a table, a list, an API response usually is.

**Why / problem solved:** UI data is lists of records. Typing it as `User[]` means `.map(u => u.name)` knows `u` is a `User` and `name` is a `string` — autocomplete and safety through the whole render.

```ts
interface User { id: number; name: string; active: boolean }

const users: User[] = [
  { id: 1, name: 'Venki', active: true },
  { id: 2, name: 'Raj', active: false },
]

users[0].name          // string ✅
users.map(u => u.name) // string[] ✅ — u is User automatically
```

**Vue connection (you'll write this constantly):**
```ts
const users = ref<User[]>([])               // empty list of users, typed
async function load() {
  users.value = await getJson<User[]>('/api/users')   // fill it
}
// template: <li v-for="u in users" :key="u.id">{{ u.name }}</li>
```

**Interview mistakes:**
- `ref([])` without `<User[]>` → `Ref<never[]>`, then `.push(user)` errors.
- Reaching into `users[0].name` without considering the list might be empty (runtime `undefined`).

**Memory trick:** *"One record = `User`. The table = `User[]`. Build the singular, pluralize with `[]`."*

---

## 4.3 Nested Arrays

🧠 **Mental model:** *Arrays inside arrays. `T[][]` = "a list of lists of T."* A grid/matrix is `number[][]`; groups of users is `User[][]`.

**Why / problem solved:** Matrices, grouped data, rows-of-cells, tag-lists-per-item. The depth of `[]` = the depth of nesting.

```ts
const grid: number[][] = [[1, 2], [3, 4]]     // matrix
grid[0][1]                                     // number ✅

const groups: User[][] = [[user1], [user2, user3]]   // users grouped
groups[1][0].name                              // string ✅

// often nested arrays come from grouping — type the result of a group-by
type Grouped = Record<string, User[]>          // department -> users (usually nicer than User[][])
```

**When NOT to use deep nesting:** if you're reaching `arr[i][j][k]`, a named structure (objects with keys, or `Record<string, T[]>`) is usually clearer than `T[][][]`. Prefer *meaningful keys* over positional depth.

**Interview mistake:** modeling grouped data as `User[][]` (positional, meaningless indices) when `Record<string, User[]>` (keyed by the group name) is more readable and maps to how you'd render it.

**Memory trick:** *"Each `[]` adds a layer. `T[][]` = list of lists. But if the layers have meaning, give them keys, not just indices."*

---

## 4.4 Array Methods — the Mental Models (map / filter / reduce / find / some / every)

> 🧠 **The master diagram — burn this in:**
>
> ```
>  MAP     transforms   →  same length, NEW values     [1,2,3] ─► [2,4,6]
>  FILTER  removes      →  shorter, SAME values         [1,2,3,4] ─► [2,4]   (keep evens)
>  REDUCE  accumulates  →  ONE value out of many        [1,2,3] ─► 6
>  FIND    locates      →  ONE element (or undefined)   find first even ─► 2
>  SOME    asks "any?"  →  boolean (≥1 passes)          any even? ─► true
>  EVERY   asks "all?"  →  boolean (all pass)           all even? ─► false
> ```
>
> Mantra: **MAP transforms, FILTER removes, REDUCE accumulates, FIND locates, SOME = any, EVERY = all.**

Each method's **type signature** tells you exactly what comes out — learn to *read the signature* and you never memorize behavior.

### `.map<U>(fn: (item: T) => U): U[]` — transform
🧠 *"Give me a NEW array, same length, each item transformed."* The callback's return type `U` becomes the new array's element type.
```
 T[]  ──map(T => U)──►  U[]     (length unchanged, type may change)
```
```ts
const users: User[] = [...]
const names: string[] = users.map(u => u.name)        // User[] -> string[]
const ids: number[] = users.map(u => u.id)
const labels = users.map(u => ({ text: u.name, value: u.id }))  // -> { text; value }[]
```
**When:** rendering lists (data → view models), extracting one field, reshaping API data.
**When NOT:** when you don't use the result (use `for…of`/`forEach` for pure side effects). `map` that returns nothing is a smell.
**Interview mistake:** using `map` for side effects (it allocates a throwaway array), or forgetting `map` returns the **same length** (use `filter` to shrink).

### `.filter(fn: (item: T) => boolean): T[]` — remove
🧠 *"Keep only the items where the test is true. Same items, fewer of them, SAME type."*
```
 T[]  ──filter(T => boolean)──►  T[]   (shorter or equal; type unchanged)
```
```ts
const active = users.filter(u => u.active)            // User[] -> User[] (only actives)
const adults = users.filter(u => u.age >= 18)
```
**Type subtlety (senior):** a **type guard** predicate narrows the result type — this is how you filter out `null`:
```ts
const maybe: (User | null)[] = [...]
const real = maybe.filter((u): u is User => u !== null)   // -> User[] (null removed from type!)
```
**When:** search/filter UI, removing nulls, subsetting.
**Interview mistake:** chaining `filter().map()` when one pass would do — fine for readability, but know `reduce` can do both in one loop.

### `.reduce<U>(fn: (acc: U, item: T) => U, initial: U): U` — accumulate
🧠 *"Fold the whole list into ONE thing — a sum, an object, a grouped map, anything."* The accumulator `U` is the shape you're building.
```
 T[]  ──reduce((acc,item) => acc, init)──►  U   (one value: number, object, map…)
```
```ts
const total = nums.reduce((sum, n) => sum + n, 0)                  // number[] -> number
const byId = users.reduce<Record<number, User>>((acc, u) => {     // -> dictionary
  acc[u.id] = u
  return acc
}, {})
const byDept = users.reduce<Record<string, User[]>>((acc, u) => { // group-by
  (acc[u.dept] ??= []).push(u)
  return acc
}, {})
```
**The #1 typing rule:** **annotate the accumulator** — `reduce<U>(…, init)` or type the `init`. Otherwise TS infers `U` from `init` (often too narrow, e.g. `{}`) and you fight errors.
**When:** sums/totals, building lookups (`byId`), grouping, flattening, "many → one."
**When NOT:** when `map`/`filter` express it more clearly. Reduce is powerful but can be write-only/unreadable — don't show off.
**Interview mistakes:** forgetting the initial value (changes behavior and types), not annotating the accumulator, forgetting to `return acc`.

### `.find(fn: (item: T) => boolean): T | undefined` — locate
🧠 *"Give me the FIRST item that matches — or `undefined` if none."* Note the `| undefined` — TS forces you to handle "not found."
```ts
const venki: User | undefined = users.find(u => u.name === 'Venki')
venki?.email          // must optional-chain — might be undefined ✅
```
**`find` vs `filter`:** `find` returns one element or `undefined`; `filter` returns an array (possibly empty). Use `find` when you want a single match (cheaper — stops at first hit).
**Interview mistake:** treating `find`'s result as definitely present (`users.find(...).email` → "possibly undefined"). The `| undefined` is the whole safety value.

### `.some(fn): boolean` — "ANY?"  ·  `.every(fn): boolean` — "ALL?"
🧠 *`some` = "is there at least one that passes?" `every` = "do they ALL pass?"* Both return a plain `boolean` and **short-circuit** (stop early).
```ts
const hasAdmin = users.some(u => u.role === 'admin')    // true if ≥1 admin
const allActive = users.every(u => u.active)            // true only if ALL active
const isEmpty = users.length === 0
```
**When:** validation (`every` field valid?), permission checks (`some` admin?), guards.
**Edge cases (interview gold):** `[].some(...)` is **always `false`** (no element passes); `[].every(...)` is **always `true`** (vacuous truth — nothing fails). People get the empty-array cases wrong constantly.
**Interview mistake:** using `filter(...).length > 0` where `some(...)` is cheaper and clearer; or `filter(...).length === arr.length` where `every` is clearer.

---

### Comparison Table — which method?

| Method | Input → Output | Length | Returns | "I want to…" |
|---|---|---|---|---|
| `map` | `T[] → U[]` | same | new array | transform each item |
| `filter` | `T[] → T[]` | ≤ | new array | keep matching items |
| `reduce` | `T[] → U` | → 1 | single value | fold into sum/object/group |
| `find` | `T[] → T \| undefined` | → 1 | element or undefined | get the first match |
| `some` | `T[] → boolean` | → 1 | boolean | check if ANY match |
| `every` | `T[] → boolean` | → 1 | boolean | check if ALL match |

**Chaining model (reads top-to-bottom like a pipeline):**
```ts
const result = users
  .filter(u => u.active)        // User[]  → drop inactive
  .map(u => u.name)             // string[] → just names
  .filter(name => name.length > 3)   // string[] → longer names
// each step's output type feeds the next — TS tracks it all
```

**Memory tricks (one line each):**
- **map** → "**m**orph each" (same count, new shape)
- **filter** → "**f**ewer" (subset, same shape)
- **reduce** → "**r**oll up into one"
- **find** → "**f**irst hit or nothing"
- **some** → "**s**at least one?" · **every** → "**e**veryone?"

<details><summary>📝 Exercise 4.4 (the big one — do all of it)</summary>

Given:
```ts
interface User { id: number; name: string; age: number; role: 'admin' | 'user'; active: boolean }
const users: User[] = [
  { id: 1, name: 'Venki', age: 29, role: 'admin', active: true },
  { id: 2, name: 'Raj', age: 17, role: 'user', active: false },
  { id: 3, name: 'Sam', age: 34, role: 'user', active: true },
]
```
1. Get an array of just the **names** (type it).
2. Get only the **active** users.
3. Get the **total age** of all users.
4. **Find** the user named `'Sam'` and safely log their age.
5. Is there **any** admin? Are **all** users adults (age ≥ 18)?
6. Build a **dictionary** `Record<number, User>` keyed by id.
7. Chain: names of **active users over 18**, uppercased.
8. Build a **group-by-role** `Record<'admin' | 'user', User[]>`.

<details><summary>Solution</summary>

```ts
// 1
const names: string[] = users.map(u => u.name)

// 2
const activeUsers: User[] = users.filter(u => u.active)

// 3
const totalAge: number = users.reduce((sum, u) => sum + u.age, 0)

// 4 — find returns User | undefined → must guard
const sam: User | undefined = users.find(u => u.name === 'Sam')
console.log(sam?.age)                    // 34, or undefined-safe

// 5
const hasAdmin: boolean = users.some(u => u.role === 'admin')   // true
const allAdults: boolean = users.every(u => u.age >= 18)        // false (Raj is 17)

// 6 — annotate the accumulator!
const byId = users.reduce<Record<number, User>>((acc, u) => {
  acc[u.id] = u
  return acc
}, {})

// 7 — pipeline; each step's type flows
const result: string[] = users
  .filter(u => u.active && u.age > 18)
  .map(u => u.name.toUpperCase())

// 8 — group-by with a literal-keyed Record
const byRole = users.reduce<Record<'admin' | 'user', User[]>>((acc, u) => {
  (acc[u.role] ??= []).push(u)
  return acc
}, { admin: [], user: [] })
```
If you can write #6 and #8 (annotated reducers building dictionaries/groups) from a blank file, your array+TS fluency is interview-ready. These are the two that separate juniors from seniors.
</details>
</details>

---

# PART 5 — VUE 3 REACTIVITY + TYPESCRIPT

> 🧠 **The ONE model for all of reactivity:**
>
> ```
>   YOU READ a reactive value   →  Vue TRACKS "this effect depends on it"
>   YOU WRITE a reactive value  →  Vue TRIGGERS every effect that read it
>
>          read (track)                    write (trigger)
>   effect ──────────► [ reactive state ] ◄────────── you mutate
>      ▲                                                   │
>      └──────────── Vue re-runs the effect ◄──────────────┘
> ```
> **Reactivity = "track on read, trigger on write."** A "reactive value" is one Vue watches: when it changes, anything that used it (the template, a computed, a watcher) re-runs automatically. That's the entire magic. Everything below is *how* you create and read those values.

**The thing that confuses everyone first:** `ref` needs `.value` in JS but NOT in the template. Why? Because the template is compiled and Vue auto-unwraps top-level refs there. In `<script>`, a `ref` is a normal object with a `.value` property — no magic, so you write `.value`.

---

## 5.1 `ref` — reactivity for a SINGLE value

🧠 **Mental model:** *A reactive BOX around one value. The box is `ref`; the value lives at `.value`.* Works for anything — primitive, object, array.

```
   ref(0)  =  ┌─────────┐
              │ .value: │ 0     ◄── read/write through .value (in JS)
              └─────────┘
              the BOX is reactive; Vue watches .value
```

**What's reactive / what triggers updates:** reading `count.value` tracks; writing `count.value = 1` triggers. The *box reference* never changes — Vue watches the `.value` slot.

**When to use:** primitives (number, string, boolean), single values, and — by modern convention — **everything, including objects and arrays** (`ref<User[]>([])`). Most teams default to `ref` for consistency.

**When NOT to use:** when a `reactive` object reads cleaner for a tightly-grouped form (purely stylistic). Never wrap a `ref` in a `ref`.

**How Vue tracks it:** a `ref` is an object with a `get value()`/`set value()` pair. The getter calls `track`, the setter calls `trigger`. (Under the hood, ref-of-object uses `reactive` for `.value`.)

**Performance:** negligible overhead; `.value` access is a getter call. Refs are cheap. The cost is *deep* reactivity on large nested objects (every level proxied) — `shallowRef` opts out if you only ever replace the whole value.

**TypeScript typing (the patterns to write cold):**
```ts
import { ref } from 'vue'

const count = ref(0)              // Ref<number> — inferred ✅
const name = ref('')             // Ref<string>
const user = ref<User | null>(null)   // explicit: starts null, becomes User
const users = ref<User[]>([])    // ALWAYS supply generic for empty arrays/objects

count.value++                    // .value in script
// {{ count }} in template       // no .value — auto-unwrapped
```
**Rule:** let inference work for primitives with an initial value (`ref(0)`); **supply the generic** when the initial value is empty/null (`ref<User[]>([])`, `ref<User | null>(null)`) — otherwise TS infers `never[]` or `null`.

**Interview mistakes:**
- Forgetting `.value` in `<script>` (the #1 Vue+TS bug).
- `ref([])` without `<User[]>` → `Ref<never[]>`, then `.push` errors.
- Destructuring a `ref` (`const { value } = count`) — loses reactivity; pass the ref around whole.
- Reassigning the ref variable instead of its `.value`.

**Memory trick:** *"`ref` = a reactive BOX. `.value` opens the box in JS; the template opens it for you. Empty box → label it with `<T>`."*

---

## 5.2 `reactive` — reactivity for an OBJECT

🧠 **Mental model:** *Makes an entire object reactive — no `.value`, you touch properties directly. It's a Proxy that intercepts every get/set.*

```
   reactive({ name: '', age: 0 })  =  Proxy
   ┌────────────────────────────┐
   │ get name ──► track          │   access props directly: form.name
   │ set name ──► trigger        │   no .value
   └────────────────────────────┘
```

**What's reactive / triggers:** every property read tracks; every property write triggers — **deeply** (nested objects are proxied too).

**When to use:** a tightly-related group of fields you mutate property-by-property — a form model, a settings object, local component state that's naturally an object.

**When NOT to use (important limitations — interview gold):**
1. **Primitives** — `reactive(0)` doesn't work; only objects/arrays/Map/Set.
2. **Reassignment breaks it** — `state = { ...newData }` replaces the proxy with a plain object, losing reactivity. You must **mutate** (`Object.assign(state, newData)` or set props), never reassign.
3. **Destructuring breaks it** — `const { name } = state` gives a plain disconnected value. Use `toRefs(state)` to destructure while keeping reactivity.

**How Vue tracks it:** `reactive` wraps the object in a **Proxy** (`get` → `track`, `set` → `trigger`). This is the core of Vue 3's reactivity (replaced Vue 2's `Object.defineProperty`).

**Performance:** deep proxying has a cost on large/deeply-nested objects (every access goes through the proxy). Use `shallowReactive` if only top-level needs to be reactive.

**TypeScript typing:**
```ts
import { reactive } from 'vue'

interface FormState { name: string; email: string; age: number }
const form = reactive<FormState>({ name: '', email: '', age: 0 })
// or inferred: const form = reactive({ name: '', email: '', age: 0 })

form.name = 'Venki'             // direct mutation, no .value ✅
// const { name } = form        // ❌ loses reactivity
const { name } = toRefs(form)  // ✅ now name is Ref<string>, still reactive
```

**Interview mistakes:**
- Reassigning the whole object (`form = {...}`) and wondering why the UI froze.
- Destructuring without `toRefs`.
- Using `reactive` for a primitive.

**Memory trick:** *"`reactive` = a reactive OBJECT, no box, no `.value`. But: don't reassign it, don't destructure it (use `toRefs`), don't give it a primitive."*

---

## 5.3 `ref` vs `reactive` — the table they want

| | `ref` | `reactive` |
|---|---|---|
| Holds | any value (primitive or object) | objects/arrays/Map/Set only |
| Access | `.value` (in JS) | direct property (`obj.x`) |
| Template | auto-unwrapped (no `.value`) | direct |
| Reassign whole value | ✅ `r.value = newObj` | ❌ breaks reactivity |
| Destructure | pass whole ref | needs `toRefs` |
| Under the hood | getter/setter (object→`reactive`) | `Proxy` |
| Best for | primitives, single values, **default choice** | grouped form/object state |
| TS | `Ref<T>`, supply `<T>` if empty | `T`, plain object type |

**The senior's rule of thumb (say this):**
> "I default to **`ref` for everything** — primitives and objects — because the `.value` is a small, consistent cost and `ref` survives reassignment and destructuring (via the ref itself). I reach for **`reactive` only when an object form reads noticeably cleaner** without `.value` everywhere. Mixing both arbitrarily is the real mistake — pick a default and stay consistent."

---

## 5.4 `computed` — DERIVED reactive value (cached)

🧠 **Mental model:** *A value CALCULATED from other reactive values, that auto-updates AND caches. "A ref whose value is a formula."* If its dependencies don't change, it returns the cached result without recomputing.

```
   state ──┐
           ├──► computed(() => formula)  ──► cached result (a readonly ref)
   state ──┘         ▲ re-runs ONLY when a dependency changes
```

**What's reactive / triggers:** computed *reads* reactive sources inside its getter → tracks them. When any tracked source changes, the computed invalidates its cache and recomputes **on next access** (lazy). Reading it elsewhere tracks the computed itself.

**When to use:** any value **derived** from state — filtered/sorted lists, totals, formatted strings, form validity, "fullName from first+last." If you can phrase it as "X is just a function of Y," it's a `computed`.

**When NOT to use:**
- For **side effects** (fetching, logging, navigating) — that's `watch`/`watchEffect`. A computed must be **pure** and **return a value**; never mutate inside it.
- When the value doesn't depend on reactive state (just use a normal const).
- When you need the *old* value too — that's `watch`.

**How Vue tracks it:** a computed is a lazy effect with a cached result + a "dirty" flag. Reading it returns the cache unless a dependency changed (dirty), in which case it recomputes once. This caching is the key difference from a method/function in the template (which re-runs every render).

**Performance:** **caching is the win.** A method in a template re-runs on *every* re-render; a `computed` re-runs only when its deps change. Prefer `computed` over methods for derived values used in templates.

**TypeScript typing:**
```ts
import { computed } from 'vue'

const firstName = ref('Venki'), lastName = ref('K')
const fullName = computed(() => `${firstName.value} ${lastName.value}`)  // ComputedRef<string> ✅ inferred
fullName.value                         // read with .value (it's a ref); template: no .value

const users = ref<User[]>([])
const activeUsers = computed<User[]>(() => users.value.filter(u => u.active))  // explicit generic optional
const total = computed(() => users.value.reduce((s, u) => s + u.age, 0))       // ComputedRef<number>

// writable computed (rare) — getter + setter
const fullName2 = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (v: string) => { [firstName.value, lastName.value] = v.split(' ') },
})
```
Return type is **inferred** from the getter — you rarely annotate. It's a `ComputedRef<T>` (read-only ref), so `.value` in script, auto-unwrapped in template.

**Relates to:** built on the same effect system as `watch`. It's the reactive twin of array `.map`/`.filter`/`.reduce` — derive, don't duplicate. Connects to "filter in computed, not watch" from the live-coding module.

**Interview mistakes:**
- Doing async/side effects inside `computed` (must be pure + sync + return a value).
- Using a method instead of `computed` for template-derived values (loses caching → perf hit).
- Mutating state inside the getter.
- Forgetting `.value` when reading in script.

**Memory trick:** *"`computed` = a FORMULA that caches. Pure, returns a value, auto-updates. If you're *doing* something (not *returning*), it's a watch, not a computed."*

---

## 5.5 `watch` — run a SIDE EFFECT when a specific source changes

🧠 **Mental model:** *"WHEN this specific thing changes, DO that." You name the source(s); Vue gives you old + new values.* Explicit dependency, explicit reaction.

```
   watch( source ,  (newVal, oldVal) => { side effect } )
            ▲                  ▲
   what to watch        what to do, with before/after
```

**What's reactive / triggers:** you explicitly declare the source (a ref, a getter, or an array of them). When it changes, the callback runs with `(newValue, oldValue)`.

**When to use:** **side effects** triggered by a specific change — fetch when an `id` prop changes, persist to localStorage when settings change, navigate after a status flips, validate a field on change. The key signals: you need the **old value**, you need **async**, or the reaction isn't "return a value" (so not a computed).

**When NOT to use:**
- For **derived values** — use `computed` (cached, cleaner). Filtering/sorting in a `watch` that sets another ref is the classic anti-pattern.
- When you'd watch *everything* a block reads — that's `watchEffect`.

**Source forms (the part people fumble):**
```ts
watch(count, (n, o) => {})                       // a ref directly
watch(() => props.id, (n, o) => load(n))         // a GETTER for prop/reactive prop ✅
watch(() => state.name, (n, o) => {})            // reactive property → MUST use a getter
watch([a, b], ([na, nb], [oa, ob]) => {})        // multiple sources
watch(source, cb, { immediate: true, deep: true })  // options
```
**Critical rule:** to watch a `reactive` object's *property* or a prop, pass a **getter** `() => state.name`, not `state.name` (which passes the current value, not a reactive source).

**Options to know:** `immediate: true` (run once on setup, not just on change), `deep: true` (watch nested mutations of an object — costly), `flush: 'post'` (run after DOM update).

**How Vue tracks it:** `watch` runs the source getter inside an effect to collect dependencies, then re-runs the *callback* (not the source) when they change, diffing old/new.

**Performance:** `deep: true` is expensive (recursively tracks every nested property) — avoid on large objects; watch a specific path instead.

**TypeScript typing:**
```ts
import { watch } from 'vue'
const id = ref<number>(1)
watch(id, (newId: number, oldId: number) => {     // types inferred from the source
  console.log(`${oldId} → ${newId}`)
})
watch(() => props.userId, async (newId) => {
  user.value = await fetchUser(newId)             // async side effect — fine in watch
})
```
Old/new value types are **inferred** from the source — no annotation needed.

**Interview mistakes:**
- Passing `state.prop` instead of `() => state.prop` (watches a value, not a source — never fires).
- Using `watch` to compute a derived value (use `computed`).
- Forgetting `immediate: true` when you need it to run on initial load too.
- Overusing `deep: true`.

**Memory trick:** *"`watch` = 'WHEN x changes, DO y' — with old + new in hand. Need the source to be a reactive property? Wrap it in a getter `() => …`."*

---

## 5.6 `watchEffect` — auto-track whatever you read, run the effect

🧠 **Mental model:** *"Run this block now, and re-run it whenever ANY reactive value it touched changes." No source list — it figures out dependencies automatically by what you read.*

```
   watchEffect(() => {
     console.log(count.value, user.value.name)   // reads → these become deps automatically
   })
   // re-runs when count OR user changes — you never listed them
```

**What's reactive / triggers:** runs immediately, tracking every reactive value read during the run; re-runs when any of them changes. (`watch` is explicit-source + lazy; `watchEffect` is implicit-source + immediate.)

**When to use:** side effects that depend on **several** reactive values where listing them all is tedious, and you **don't need the old value**, and it's fine to **run immediately**. E.g. "sync these three settings to localStorage whenever any changes."

**When NOT to use:**
- When you need the **old value** → `watch`.
- When you need to **not** run immediately → `watch` (without `immediate`).
- When the dependency set is unclear/conditional — auto-tracking can pick up deps you didn't intend (only values read on a given run are tracked, so branches change deps run-to-run). For precise control, `watch`.

**Cleanup (important):** the callback receives an `onCleanup` to cancel stale work (debounce, cancel a fetch) before the next run / on unmount.
```ts
watchEffect((onCleanup) => {
  const t = setTimeout(() => {/* … */}, 500)
  onCleanup(() => clearTimeout(t))   // cancel previous before re-run / on unmount
})
```

**Performance:** convenient but can over-trigger if it reads more than you intend. For hot paths, explicit `watch` with a tight source is more predictable.

**TypeScript typing:** usually **no types needed** — it's a `() => void` callback reading already-typed refs. That simplicity is part of its appeal.
```ts
import { watchEffect } from 'vue'
watchEffect(() => {
  localStorage.setItem('settings', JSON.stringify({ name: name.value, dark: dark.value }))
})
```

**Interview mistakes:**
- Expecting old/new values (it has none — use `watch`).
- Surprise re-runs because it tracked a value you read incidentally.
- Forgetting cleanup for timers/subscriptions inside it.

**Memory trick:** *"`watchEffect` = 'run + auto-subscribe to whatever I read.' No source list, no old value, runs immediately. Need old value or lazy? → `watch`."*

---

## 5.7 The Reactivity Comparison Table (memorize the shape, derive the rest)

| API | Mental model | Reactive? | Returns | Old value? | Runs immediately? | Use for |
|---|---|---|---|---|---|---|
| `ref` | reactive box (`.value`) | yes | `Ref<T>` | — | — | single values, default |
| `reactive` | reactive object (Proxy) | yes (deep) | `T` | — | — | grouped form/object state |
| `computed` | cached formula | yes | `ComputedRef<T>` | — | lazy | **derived** values |
| `watch` | "when X changes, do Y" | watches source | stop fn | ✅ yes | ❌ (unless `immediate`) | side effects on a specific change |
| `watchEffect` | "run + auto-subscribe" | auto-tracks reads | stop fn | ❌ no | ✅ yes | side effects on many sources |

**The decision flow (this is the whole part in 4 questions):**
```
Is it a single value?            → ref
Is it a grouped object/form?     → reactive (or ref, your default)
Is it DERIVED from other state?  → computed   (returns a value, cached, pure)
Is it a SIDE EFFECT on change?   → watch (specific source, has old value)
                                   → watchEffect (many sources, no old value, runs now)
```

**Golden rules to recite:**
1. `computed` **caches & returns**; `watch`/`watchEffect` **react & do**.
2. Return a value → `computed`. *Do* something → `watch`/`watchEffect`.
3. `ref` → `.value` in script, bare in template. `reactive` → never reassign, never destructure (use `toRefs`).
4. Empty `ref` → supply the generic: `ref<User[]>([])`.
5. Watch a reactive/prop **property** → wrap it in a getter `() => x`.

<details><summary>📝 Exercise 5 (full reactivity workout)</summary>

1. Create a typed reactive counter and a typed empty list of `User`.
2. Create `doubled` derived from the counter.
3. Create `activeCount` = number of active users (derived).
4. `watch` the counter and log `old → new`.
5. `watch` a `props.userId` getter and (pretend-)fetch when it changes, immediately on load too.
6. Use `watchEffect` to persist `{ count }` to localStorage whenever count changes.
7. Spot the bug: `const { name } = reactive({ name: 'V' })` — why does the template not update when you set `name`?

<details><summary>Solution</summary>

```ts
import { ref, reactive, computed, watch, watchEffect, toRefs } from 'vue'

// 1
const count = ref<number>(0)
const users = ref<User[]>([])

// 2
const doubled = computed(() => count.value * 2)              // ComputedRef<number>

// 3
const activeCount = computed(() => users.value.filter(u => u.active).length)

// 4
watch(count, (n, o) => console.log(`${o} → ${n}`))          // types inferred

// 5
watch(() => props.userId, async (newId) => {
  users.value = await fetchUsersFor(newId)
}, { immediate: true })                                      // runs on load + on change

// 6
watchEffect(() => {
  localStorage.setItem('state', JSON.stringify({ count: count.value }))
})

// 7 — THE BUG
const state = reactive({ name: 'V' })
const { name } = state          // ❌ name is now a plain disconnected string
name === 'V'                    // true, but reassigning `name` does nothing reactive
// FIX:
const { name: nameRef } = toRefs(state)   // ✅ Ref<string>, stays reactive
```
#7 is *the* most-asked reactive gotcha. The one-line answer: **destructuring a `reactive` snapshots the value and severs the proxy link — use `toRefs`.** Say that and you've shown you understand the Proxy model, not just the syntax.
</details>
</details>

---

# PART 6 — LIFECYCLE MENTAL MODEL

> 🧠 **The ONE model:** *A component is BORN, it LIVES (re-rendering as state changes), and it DIES. Lifecycle hooks are "callbacks at each milestone" so you can run code at exactly the right moment — DOM ready, about to update, about to be destroyed.*
>
> The single most useful question to ask at any hook: **"Does the DOM exist yet?"** Before `mounted` → no. After `mounted` → yes. That alone tells you where to put DOM access and data fetching.

## 6.1 The Timeline (execution order — draw this in the interview)

```
   APP / COMPONENT STARTS
            │
            ▼
   ┌──────────────────┐
   │     setup()      │   Composition API entry. Runs ONCE, before everything.
   │                  │   Create refs, computed, register hooks. NO DOM yet.
   └──────────────────┘
            │
            ▼
   onBeforeMount()        About to render. Still NO real DOM. (rarely used)
            │
            ▼
      [ render → virtual DOM → REAL DOM inserted ]
            │
            ▼
   onMounted()  ✅        DOM EXISTS now. Fetch data, access $el, init chart/map
            │             libs, addEventListener. ← 90% of your hook code goes here
            │
            ▼
   ╔═══════════ COMPONENT IS LIVE (user interacts) ═══════════╗
   ║   reactive state changes                                 ║
   ║        │                                                 ║
   ║        ▼                                                 ║
   ║   onBeforeUpdate()   State changed, DOM about to re-patch║
   ║        │             (read OLD DOM values here)          ║
   ║        ▼                                                 ║
   ║   [ re-render → DOM patched ]                            ║
   ║        │                                                 ║
   ║        ▼                                                 ║
   ║   onUpdated()        DOM now reflects new state          ║
   ║                      (careful: changing state here loops)║
   ╚══════════════════════════════════════════════════════════╝
            │
            ▼ (component removed from screen)
   onBeforeUnmount()  ✅   About to tear down. Component still fully alive.
            │              ← clean up here: clearInterval, removeEventListener,
            │                close sockets, cancel timers
            ▼
   [ teardown ]
            │
            ▼
   onUnmounted()           Gone. Final cleanup confirmation.
```

**The 4 phases:** **CREATE** (setup) → **MOUNT** (beforeMount, mounted) → **UPDATE loop** (beforeUpdate, updated) → **UNMOUNT** (beforeUnmount, unmounted).

## 6.2 The hooks — what to actually put in each

| Hook | DOM exists? | Mental model | Put here |
|---|---|---|---|
| `setup()` | ❌ | "birth — wire up state" | create refs/computed, register hooks |
| `onBeforeMount` | ❌ | "about to render" | (rare) last-second pre-DOM setup |
| **`onMounted`** | ✅ | **"DOM is ready"** | **fetch data, DOM access, 3rd-party libs, listeners** |
| `onBeforeUpdate` | ✅ (old) | "state changed, DOM about to patch" | read pre-update DOM (e.g. scroll position) |
| `onUpdated` | ✅ (new) | "DOM now matches state" | DOM work needing post-patch layout (avoid setting state → loop) |
| **`onBeforeUnmount`** | ✅ | **"about to die, still alive"** | **cleanup: clearInterval, removeEventListener, close sockets** |
| `onUnmounted` | ❌ | "gone" | final cleanup confirmation |

**The 80/20 truth:** in real components you almost only ever write **two** hooks:
- **`onMounted`** → fetch initial data / set up.
- **`onBeforeUnmount`** (or `onUnmounted`) → tear down whatever you set up.

Everything you `addEventListener`/`setInterval`/subscribe in `onMounted`, you must remove in `onBeforeUnmount`. **Pair them like brackets** — that prevents memory leaks (ties back to the JS memory-leaks notes).

## 6.3 Options API ↔ Composition API hook names

| Options API | Composition API (`<script setup>`) |
|---|---|
| `beforeCreate` / `created` | *(just write code directly in `setup`)* |
| `beforeMount` | `onBeforeMount` |
| `mounted` | `onMounted` |
| `beforeUpdate` | `onBeforeUpdate` |
| `updated` | `onUpdated` |
| `beforeUnmount` | `onBeforeUnmount` |
| `unmounted` | `onUnmounted` |

Note: there's **no `onCreated`** — in Composition API, code at the top of `setup`/`<script setup>` *is* the "created" phase (state ready, no DOM).

## 6.4 Parent ↔ Child order (interview favorite)

Children mount **before** parents; parents unmount **before** children:
```
MOUNT:    Parent setup → Child setup → Child mounted → Parent mounted
                                       └─ child's DOM ready first ─┘
UNMOUNT:  Parent beforeUnmount → Child beforeUnmount → Child unmounted → Parent unmounted
```
**Why:** a parent's DOM isn't complete until its children have rendered into it — so children finish mounting first. Memorize: **"children mount first, parents unmount first."**

## 6.5 TypeScript & lifecycle

Lifecycle hooks are just functions taking a `() => void` callback — **no special typing needed**. The only TS touchpoint is typing what you *create* inside them:
```ts
import { ref, onMounted, onBeforeUnmount } from 'vue'

const users = ref<User[]>([])           // typed state
let timer: ReturnType<typeof setInterval>   // type the timer handle (number in browser, NodeJS.Timeout in node)

onMounted(async () => {
  users.value = await getJson<User[]>('/api/users')   // fetch when DOM ready
  timer = setInterval(poll, 5000)
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {                  // pair every setup with a teardown
  clearInterval(timer)
  window.removeEventListener('resize', onResize)
})
```
`ReturnType<typeof setInterval>` (from utility types, 1.11!) is the clean cross-environment way to type a timer handle — a nice callback to Part 1.

## 6.6 Interview mistakes

- Fetching data or touching `document.querySelector` in `setup`/`onBeforeMount` — **DOM doesn't exist yet**; do it in `onMounted`.
- Setting up listeners/timers but never cleaning up → **memory leak** (the classic). Always pair with `onBeforeUnmount`.
- Setting reactive state inside `onUpdated` → triggers another update → **infinite loop**.
- Thinking the parent mounts before the child (it's the reverse).
- Expecting DOM to be updated synchronously after a state change — it's async; use `await nextTick()` before reading the updated DOM.

**Memory trick (recite the spine):** *"setup → beforeMount → **mounted** (DOM ready: fetch + listen) → [update loop] → **beforeUnmount** (clean up what I set up) → unmounted. Children mount first, parents unmount first."*

<details><summary>📝 Exercise 6</summary>

1. In which hook do you fetch the initial list of users, and why?
2. You add `window.addEventListener('scroll', onScroll)` in `onMounted`. What must you do, and where?
3. Type a `timer` variable that holds a `setInterval` handle and works in both browser and Node.
4. A junior fetches data in `setup()` and tries `document.getElementById('chart')` right after — it's `null`. Explain and fix.
5. Order these for a `<Parent><Child/></Parent>`: Child mounted, Parent mounted, Parent setup, Child setup.

<details><summary>Solution</summary>

```ts
// 1 — onMounted: the DOM exists and it's the standard place for initial async data.
onMounted(async () => { users.value = await getJson<User[]>('/api/users') })

// 2 — remove it in onBeforeUnmount (pair setup/teardown to avoid a leak):
onMounted(() => window.addEventListener('scroll', onScroll))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

// 3
let timer: ReturnType<typeof setInterval>

// 4 — setup runs BEFORE the DOM is rendered, so getElementById returns null.
//     Move DOM access into onMounted (DOM guaranteed to exist there).
onMounted(() => { const el = document.getElementById('chart') /* now non-null */ })

// 5 — Parent setup → Child setup → Child mounted → Parent mounted
//     ("children mount first")
```
Q4 and Q5 are the two lifecycle questions that come up most — the unifying idea is **"when does the DOM exist?"** and **"children finish before parents."**
</details>
</details>

---

# PART 7 — COMPONENT BOILERPLATE MENTAL MODEL (Build From Scratch)

> 🧠 **The ONE model:** *A component is built in DEPENDENCY ORDER — each layer can only use the layers above it.* Types describe the data → state holds it → computed derives from state → watchers/methods act on it → lifecycle kicks it off → template renders it. **You think top-down because each line depends on the one before.** Never face a blank file again: walk the 8 layers.

## 7.1 The 8-Layer Thinking Order (memorize the spine)

```
   ① TYPES        interface User {…}            ← describe the shape of data first
        │ (state needs a type)
   ② STATE        const users = ref<User[]>([]) ← the reactive data
        │ (computed derives FROM state)
   ③ COMPUTED     const filtered = computed(…)  ← derived values
        │ (watchers react TO state)
   ④ WATCHERS     watch(() => props.id, …)      ← side effects on change
        │ (methods CHANGE state)
   ⑤ METHODS      function addUser() {…}        ← actions
        │ (api calls are async methods)
   ⑥ API CALLS    async function fetchUsers(){} ← data in/out
        │ (lifecycle TRIGGERS the api)
   ⑦ LIFECYCLE    onMounted(fetchUsers)         ← kick things off / clean up
        │ (template USES everything above)
   ⑧ TEMPLATE     <li v-for="u in filtered">    ← render it
```

**Why this order works:** it's the **dependency graph**. You can't type state without the type (①→②). Computed reads state (②→③). Watchers/methods act on state (②→④⑤). Lifecycle calls the API methods (⑥→⑦). Template reads everything (→⑧). Writing in this order means **every line you write can already see what it needs** — no forward references, no jumping around.

**Mnemonic: "Type State Carefully, Watch Methods And Lifecycle Templates"** → **T-S-C-W-M-A-L-T**.

> This is the TS-typed, reasoning-level companion to **Module 27 (Live-Coding Skeletons)** — that module gives you the fill-in templates; this gives you the *why each layer comes when it does* so you can adapt under any prompt.

## 7.2 The Full Annotated Skeleton (type this, fill the blanks)

```vue
<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

/* ① TYPES — describe the data shapes first (single source of truth) */
interface User {
  id: number
  name: string
  email: string
  active: boolean
}

/* PROPS & EMITS — the component's contract with its parent */
const props = defineProps<{
  filterRole?: string          // optional prop
}>()
const emit = defineEmits<{
  (e: 'select', user: User): void
}>()

/* ② STATE — reactive data (always type empty refs!) */
const users = ref<User[]>([])
const search = ref<string>('')
const loading = ref<boolean>(false)
const error = ref<string | null>(null)

/* ③ COMPUTED — values DERIVED from state (pure, cached) */
const filteredUsers = computed<User[]>(() =>
  users.value.filter(u =>
    u.name.toLowerCase().includes(search.value.toLowerCase())
  )
)
const activeCount = computed(() => users.value.filter(u => u.active).length)

/* ④ WATCHERS — side effects WHEN something changes */
watch(() => props.filterRole, (role) => {
  if (role) fetchUsers()      // refetch when the parent changes the filter
})

/* ⑤ METHODS — actions that CHANGE state */
function selectUser(user: User): void {
  emit('select', user)        // events up
}

/* ⑥ API CALLS — async methods (the 3 states: loading / error / data) */
async function fetchUsers(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('/api/users')
    if (!res.ok) throw new Error(res.statusText)
    users.value = (await res.json()) as User[]
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false     // always reset in finally
  }
}

/* ⑦ LIFECYCLE — kick off on mount, clean up on unmount */
onMounted(fetchUsers)
onBeforeUnmount(() => { /* clear timers / listeners set up above */ })
</script>

<template>
  <!-- ⑧ TEMPLATE — render everything above -->
  <div>
    <input v-model="search" placeholder="Search…" />
    <p>{{ activeCount }} active</p>

    <p v-if="loading">Loading…</p>
    <p v-else-if="error">{{ error }}</p>
    <ul v-else>
      <li
        v-for="user in filteredUsers"
        :key="user.id"
        @click="selectUser(user)"
      >
        {{ user.name }} — {{ user.email }}
      </li>
      <li v-if="filteredUsers.length === 0">No users found.</li>
    </ul>
  </div>
</template>
```

## 7.3 Why each layer is typed the way it is

| Layer | TS pattern | Reason |
|---|---|---|
| ① Types | `interface User {}` | single source of truth; everything derives from it |
| Props | `defineProps<{…}>()` | type-only props — Vue's compiler reads the generic |
| Emits | `defineEmits<{(e,…):void}>()` | event name + payload type = a function type |
| ② State | `ref<User[]>([])`, `ref<string \| null>(null)` | **always** annotate empty/null refs |
| ③ Computed | `computed<User[]>(…)` (often inferred) | return type flows from the getter |
| ④ Watch | `watch(() => props.x, cb)` | getter for props/reactive props; types inferred |
| ⑤ Methods | `(user: User): void` | annotate params; return often `void` |
| ⑥ API | `async (): Promise<T>` | type the payload; model loading/error/data |
| ⑦ Lifecycle | no special types | type what you create inside (timers via `ReturnType<typeof setInterval>`) |

## 7.4 `defineProps` / `defineEmits` — the two TS patterns to know cold

```ts
// PROPS — type-only (preferred in TS): the generic IS the type
const props = defineProps<{
  title: string
  count?: number               // optional
  items: User[]
}>()

// with defaults (need withDefaults):
const props = withDefaults(defineProps<{ count?: number }>(), { count: 0 })

// EMITS — each call signature = one event + its payload type
const emit = defineEmits<{
  (e: 'update', value: string): void
  (e: 'submit', payload: User): void
}>()
emit('submit', someUser)       // type-checked: payload must be a User ✅

// v-model on a component (Vue 3.4+): one line
const model = defineModel<string>()   // typed two-way binding
```
**The reasoning:** props *in*, emits *out*. Props are an object shape (interface-like). An emit is a *function type* — event name + argument types — which is why `defineEmits` takes call signatures. This ties straight back to function types (2.1) and object types (3.1).

## 7.5 The 60-second pre-code ritual (say it out loud, in order)

When handed any "build a component" task, narrate the 8 layers as questions:
1. **"What's the data shape?"** → `interface` (①)
2. **"What state do I hold?"** → `ref`/`reactive`, typed (②)
3. **"What's derived?"** → `computed` (③)
4. **"What reacts to change?"** → `watch` (④)
5. **"What actions change state?"** → methods (⑤)
6. **"Where does data come from?"** → async API, loading/error/data (⑥)
7. **"What kicks off / cleans up?"** → `onMounted`/`onBeforeUnmount` (⑦)
8. **"What does the user see?"** → template: `v-for`+`:key`, `v-if` empty state, `v-model`, `@click` (⑧)

Saying this maps *any* prompt onto the skeleton — you're never staring at a blank file.

---

# 🎴 FINAL ONE-GLANCE RECALL CARD

```
═══════════════ TYPESCRIPT ═══════════════
PRIMITIVES   atoms: string/number/boolean/null/undefined
INFER vs ANNOTATE   infer values; annotate params + empty containers + boundaries
UNION  A|B   "OR" → narrow before use (typeof/in/===)
INTER  A&B   "AND" → merge props
LITERAL      value IS the type: 'admin' | 'user'  (prefer over enum)
TYPE vs INTERFACE   interface = object contract (extend/merge); type = ANYTHING
GENERICS  <T>   a parameter for types; preserves type (any forgets)
UTILITIES   Partial(all optional) Required(all req) Pick(keep) Omit(drop)
            Record<K,V>(dict) ReturnType(out) Parameters(in)
FUNCTIONS   (in)=>out · optional? · default= · ...rest[] · overload(rare) · async→Promise<T>
OBJECTS     nested→name each level · dynamic keys→Record<K,V> · readonly(write-once) · ?(maybe)
ARRAYS      User=one  User[]=many
            map(morph,same len) filter(fewer) reduce(roll up to 1)
            find(first|undefined) some(any?) every(all?)
            empty []→annotate · reduce→annotate accumulator

═══════════════ VUE REACTIVITY ═══════════════
track on read, trigger on write
ref        reactive BOX, .value in JS, bare in template · empty→ref<T[]>([])
reactive   reactive OBJECT (Proxy), no .value · don't reassign/destructure (use toRefs)
computed   cached FORMULA, pure, returns a value, auto-updates
watch      "WHEN x changes DO y", has old+new, getter for props: ()=>x
watchEffect runs now + auto-subscribes to reads, no old value
RULE: return a value→computed · DO something→watch/watchEffect

═══════════════ LIFECYCLE ═══════════════
setup → beforeMount → MOUNTED(DOM ready: fetch+listen)
 → [beforeUpdate→updated] → BEFOREUNMOUNT(clean up) → unmounted
Children mount FIRST, parents unmount FIRST
Ask always: "does the DOM exist yet?"

═══════════════ COMPONENT BUILD ORDER (T-S-C-W-M-A-L-T) ═══════════════
①Types ②State ③Computed ④Watch ⑤Methods ⑥API ⑦Lifecycle ⑧Template
(dependency order: each layer uses the ones above it)
defineProps<{}> in · defineEmits<{(e,p):void}>() out
API → always loading / error / data + try/catch/finally
```

---

## 🏁 Capstone Exercise (ties the whole file together)

> Build a `<UserDirectory>` component from a blank file. Narrate the 8 layers. Requirements:
> - Fetches `User[]` from `/api/users` on mount (loading / error / data states).
> - A search box filters by name (derived).
> - Shows a count of active users (derived).
> - Re-fetches when a `department` prop changes.
> - Emits `select` with the chosen `User`.
> - Cleans up properly.
> - **Fully typed**, no `any`.

<details><summary>Reference solution</summary>

```vue
<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

/* ① TYPES */
interface User { id: number; name: string; email: string; active: boolean }

/* PROPS / EMITS */
const props = defineProps<{ department: string }>()
const emit = defineEmits<{ (e: 'select', user: User): void }>()

/* ② STATE */
const users = ref<User[]>([])
const search = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

/* ③ COMPUTED */
const filtered = computed<User[]>(() =>
  users.value.filter(u => u.name.toLowerCase().includes(search.value.toLowerCase()))
)
const activeCount = computed(() => users.value.filter(u => u.active).length)

/* ⑤ METHODS */
function select(user: User): void { emit('select', user) }

/* ⑥ API */
async function fetchUsers(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(`/api/users?dept=${props.department}`)
    if (!res.ok) throw new Error(res.statusText)
    users.value = (await res.json()) as User[]
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}

/* ④ WATCHERS */
watch(() => props.department, fetchUsers)   // refetch on dept change

/* ⑦ LIFECYCLE */
onMounted(fetchUsers)
onBeforeUnmount(() => { /* nothing persistent set up here, but this is where it'd go */ })
</script>

<template>
  <div>
    <input v-model="search" placeholder="Search by name…" />
    <p>{{ activeCount }} active of {{ users.length }}</p>

    <p v-if="loading">Loading…</p>
    <p v-else-if="error">⚠️ {{ error }}</p>
    <ul v-else>
      <li v-for="u in filtered" :key="u.id" @click="select(u)">
        {{ u.name }} — {{ u.email }}
      </li>
      <li v-if="filtered.length === 0">No users found.</li>
    </ul>
  </div>
</template>
```
If you wrote this from scratch while *narrating each layer and why it comes when it does* — types → state → computed → watch → methods → api → lifecycle → template — you've demonstrated exactly what a Senior Frontend interview is looking for: **structured thinking + type fluency + reactivity understanding**, not memorized syntax.
</details>

---

## 📎 Where to go next (related modules)

- **[Module 27 — Live-Coding Skeletons](Vue-Module-27-LiveCodingSkeletons.md)** — fill-in templates for display/form/CRUD/fetch (the practical twin of Part 7)
- **[Module 3 — Composition API](Vue-Module-03-CompositionAPI.md)** · **[Module 7 — Lifecycle](Vue-Module-07-Lifecycle.md)** · **[Module 13 — Composables](Vue-Module-13-Composables.md)** (where generics + `ReturnType` shine)
- **[Module 15 — Forms](Vue-Module-15-Forms.md)** · **[Module 2 — Reactivity internals](Vue-Module-02-Reactivity.md)** (the Proxy/track/trigger deep dive behind Part 5)
- **[Module 23 — Interview Master](Vue-Module-23-InterviewMaster.md)** · **[Module 25 — Revision Sheets](Vue-Module-25-RevisionSheets.md)**

> **Final mentor note:** you now have the *models*. The only thing between you and writing this cold in an interview is **reps**. Pick one exercise a day, close this file, and type it from the blank page. Models + reps = fluency. You've got this.


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

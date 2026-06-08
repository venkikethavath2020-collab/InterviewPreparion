# ESSENTIAL JS — SECTION 11: TEMPLATE LITERALS

---

## 1. Definition
**Template literals** = string literals delimited by **backticks** (`` ` ``) supporting **interpolation** (`${expr}`), **multiline** strings, and **tagged templates**.
**Why:** replace clunky `+` concatenation and `\n` escapes; embed expressions; enable advanced string processing (tags).

## 2. String Interpolation
```js
const name = 'Ana', n = 3;
`Hello ${name}, you have ${n} messages`;   // 'Hello Ana, you have 3 messages'
`Sum: ${1 + 2}`;                           // 'Sum: 3' (any expression)
`${user.isAdmin ? 'Admin' : 'User'}`;      // ternary inside
`${items.map(i => i.name).join(', ')}`;    // method calls
`Total: ${calc(a, b)}`;                    // function calls
// nesting
`outer ${`inner ${x}`}`;
```
**Coercion:** interpolated values are converted with `ToString` (objects → `'[object Object]'`, arrays → `'a,b'`).

## 3. Multiline Strings
```js
const html = `
  <div>
    <h1>${title}</h1>
  </div>
`;   // newlines + indentation preserved literally (no \n needed)
```
**Note:** leading/trailing whitespace and indentation are kept — use `.trim()` or a dedent helper if unwanted.

## 4. Tagged Templates
**Definition:** A function (the "tag") prefixed to a template literal receives the **string parts** and the **interpolated values** separately → custom processing.
```js
function tag(strings, ...values) {
  // strings = array of literal segments; values = interpolated expressions
  return strings.reduce((acc, str, i) =>
    acc + str + (values[i] !== undefined ? `[${values[i]}]` : ''), '');
}
const x = 5, y = 10;
tag`Sum is ${x} and ${y}`;
// strings = ['Sum is ', ' and ', ''], values = [5, 10]
// → 'Sum is [5] and [10]'
```
**`strings.raw`** gives the raw (un-escaped) segments (used by `String.raw`):
```js
String.raw`a\nb`;   // 'a\\nb'  (backslash-n literal, not newline)
```

## 5. Production Examples
```js
// HTML templating (sanitize values!)
const card = (u) => `<div class="card"><h2>${escapeHtml(u.name)}</h2></div>`;

// SQL tag (parameterized — prevents injection)
sql`SELECT * FROM users WHERE id = ${userId}`;  // tag builds params, not string concat

// styled-components (CSS-in-JS)
const Button = styled.button`
  color: ${props => props.primary ? 'white' : 'black'};
  padding: 8px;
`;

// i18n / GraphQL
gql`query { user(id: ${id}) { name } }`;

// logging
console.log(`[${new Date().toISOString()}] ${level}: ${msg}`);

// URL building
`/api/users/${id}?page=${page}`;
```

## 6. Common Mistakes
- **XSS:** interpolating unsanitized user input into HTML (`innerHTML = \`${userInput}\``) → escape/sanitize.
- Expecting auto-dedent (indentation is preserved).
- Object interpolation → `'[object Object]'` (stringify explicitly).
- Confusing `${}` (interpolation) with `$` literal.
- Heavy logic inside `${}` (hurts readability) — compute first.

## 7. Best Practices
- Use template literals over `+` concatenation.
- **Sanitize** interpolated values in HTML contexts.
- Keep expressions simple; precompute complex values.
- Use tagged templates for safe SQL/HTML/CSS DSLs.
- Use `String.raw` for regex/paths to avoid double-escaping.

## 8. Performance
- Comparable to/often faster than `+` concatenation; engines optimize both.
- Tagged templates add a function call + array allocation (negligible unless extremely hot).
- For building huge strings in loops, array + `join` can still win.

## 9. Tricky Edge Cases
```js
`${{}}`;                         // '[object Object]'
`${[1,2,3]}`;                    // '1,2,3'
`${null}`;                       // 'null'
`${undefined}`;                  // 'undefined'
`${[1,[2,[3]]]}`;                // '1,2,3'
`${true}`;                       // 'true'
`${() => {}}`;                   // '() => {}' (function source!)
`${ {toString(){return 'X'}} }`; // 'X' (custom toString)
`a${''}b`;                       // 'ab'
String.raw`C:\path\n`;           // 'C:\\path\\n' (literal backslashes)
```

## 10. Output Prediction
```js
const a = 5;
console.log(`val: ${a > 3 ? 'big' : 'small'}`);   // 'val: big'
console.log(`${[1,2,3]}`);                         // '1,2,3'
console.log(`${{a:1}}`);                           // '[object Object]'
console.log(`sum ${1 + 2} done`);                  // 'sum 3 done'
function t(s, ...v){ return s.join('|') + '::' + v.join(','); }
console.log(t`a${1}b${2}c`);                       // 'a|b|c::1,2'
console.log(String.raw`x\ty`);                     // 'x\\ty'
console.log(`${null} ${undefined}`);               // 'null undefined'
```

## Interview Questions
**🟢:** What are template literals? · How does interpolation work? · Multiline strings?
**🟡:** What is a tagged template? · What args does the tag receive? · `String.raw` use? · XSS risk in templates?
**🔴:** Implement a tagged template (e.g., safe HTML / highlight). · How styled-components/SQL tags work internally. · `strings.raw` vs `strings`. · Coercion of interpolated values.
**🧩:** Build a sanitizing HTML tag. · Build an SQL tag that parameterizes inputs. · Why is `innerHTML = \`${input}\`` dangerous. · Highlight matched terms with a tag.

## ⚡ REVISION
- Backticks + `${expr}` interpolation (any expression, ToString-coerced) + multiline (whitespace preserved).
- Tagged template: `tag\`...\`` → `tag(strings, ...values)`; `strings.raw` for un-escaped.
- Uses: HTML/SQL/CSS DSLs (styled-components, gql), logging, URLs — **sanitize HTML interpolation (XSS)**.
- Objects → '[object Object]'; arrays → comma-joined.

➡️ Next: **Sets & Maps.**

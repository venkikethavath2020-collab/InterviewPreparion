# ESSENTIAL JS — SECTION 14: DATE & TIME

---

## 1. Date Object
**Definition:** `Date` represents a single moment in time as **milliseconds since the Unix epoch** (Jan 1, 1970, 00:00:00 UTC). Internally a number; methods read/write in local time or UTC.
```js
new Date();                       // now
new Date(0);                      // epoch (1970-01-01T00:00:00Z)
new Date(1700000000000);          // from ms timestamp
new Date('2024-01-15');           // ISO string → UTC midnight
new Date('2024-01-15T10:30:00');  // local time (no Z)
new Date(2024, 0, 15);            // year, MONTH (0-indexed!), day → LOCAL
Date.now();                       // current timestamp (ms) — fast, no object
```
**⚠️ Months are 0-indexed** (January = 0, December = 11). Days are 1-indexed.

## 2. Getting & Setting
```js
const d = new Date();
d.getFullYear(); d.getMonth(); d.getDate(); d.getDay();  // local; getDay = weekday 0-6 (Sun=0)
d.getHours(); d.getMinutes(); d.getSeconds(); d.getMilliseconds();
d.getTime();                      // ms since epoch
d.getTimezoneOffset();            // minutes offset from UTC (e.g., -330 for IST)
// UTC variants:
d.getUTCFullYear(); d.getUTCHours();
// setters
d.setFullYear(2025); d.setMonth(5); d.setDate(20);
```

## 3. UTC vs Local
- The **internal value is always UTC (epoch ms)**. `getHours()` returns **local** time; `getUTCHours()` returns UTC.
- Parsing:
  - `'2024-01-15'` (date-only) → interpreted as **UTC midnight**.
  - `'2024-01-15T10:00:00'` (no offset) → **local** time.
  - `'2024-01-15T10:00:00Z'` → **UTC**.
```js
new Date('2024-01-15').toISOString();   // '2024-01-15T00:00:00.000Z'
d.toISOString();                        // UTC ISO (always Z)
d.toUTCString();                        // 'Mon, 15 Jan 2024 ...'
d.toLocaleString();                     // locale + local timezone
d.toLocaleString('en-US', { timeZone: 'America/New_York' });
```

## 4. Timezones
- JS `Date` has **no timezone storage** — only UTC internally + the **runtime's local zone** for local methods. You can't natively hold a Date "in" another zone.
- **Display** in a zone via `Intl.DateTimeFormat` / `toLocaleString` with `{ timeZone }`.
- For real timezone math, use **`Temporal`** (new standard, stage 3) or libraries (**date-fns-tz, Luxon, Day.js**). Moment.js is legacy/deprecated.
```js
new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Tokyo', dateStyle: 'full', timeStyle: 'short'
}).format(new Date());
```

## 5. Common Interview Problems
```js
// Difference in days between two dates
const daysBetween = (a, b) => Math.round((b - a) / 86400000);  // ms per day

// Add days (immutable)
const addDays = (date, n) => { const d = new Date(date); d.setDate(d.getDate() + n); return d; };

// Format YYYY-MM-DD
const fmt = (d) => d.toISOString().slice(0, 10);
// or local-safe:
const fmtLocal = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

// Is leap year
const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

// Days in month (trick: day 0 of next month = last day of this month)
const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();

// Relative time ("2 hours ago")
const ago = (d) => {
  const s = (Date.now() - d) / 1000;
  if (s < 60) return `${Math.floor(s)}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  return `${Math.floor(s/3600)}h ago`;
};

// Start of day
const startOfDay = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
```

## 6. Common Mistakes
- **Month off-by-one** (`new Date(2024, 1, 1)` is February, not January).
- Mutating dates accidentally (`setDate` mutates the original).
- Assuming `'2024-01-15'` is local (it's UTC).
- Comparing dates with `===` (objects → reference; use `.getTime()` or `<`/`>`).
- Timezone bugs from mixing local + UTC methods.
- DST edge cases (adding 24h ≠ adding 1 day across DST).

## 7. Best Practices
- Store/transmit dates as **UTC ISO strings** (`toISOString()`); convert to local only for display.
- Use `Intl.DateTimeFormat` for locale/timezone-aware formatting.
- Use a library (date-fns/Luxon) or **Temporal** for timezone math + immutability.
- Compare via `.getTime()` (numbers) or relational operators (auto-coerce to number).
- Treat Dates as immutable (clone before `set*`).

## 8. Performance
- `Date.now()` is fast (no object allocation) — prefer for timestamps/timing.
- Creating many Date objects in hot loops → allocations; use timestamps where possible.
- `Intl.DateTimeFormat` is relatively expensive — **reuse** a formatter instance.

## 9. Production Use Cases
- Timestamps (created_at/updated_at as UTC ISO), scheduling, countdowns, relative-time UIs, analytics buckets, JWT exp checks, calendars.

## 10. Coding Examples
```js
// reusable formatter (perf)
const usFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });
usFormatter.format(new Date());

// compare dates
new Date('2024-01-01') < new Date('2024-06-01');   // true (coerced to ms)
+new Date('2024-01-01') === +new Date('2024-01-01'); // true (unary + → ms)

// duration formatting
const formatDuration = (ms) => {
  const s = Math.floor(ms/1000) % 60, m = Math.floor(ms/60000) % 60, h = Math.floor(ms/3600000);
  return [h, m, s].map(n => String(n).padStart(2,'0')).join(':');
};
```

## 11. Tricky Edge Cases
```js
new Date(2024, 1, 30);            // Mar 1 2024 (Feb 30 rolls over!)
new Date(2024, 12, 1);            // Jan 1 2025 (month 12 overflows year)
new Date('2024-01-15');           // UTC midnight
new Date('2024-01-15T00:00');     // LOCAL midnight (different instant!)
new Date('invalid');              // Invalid Date (getTime → NaN)
new Date() == new Date();         // false (objects, reference)
+new Date();                      // timestamp (coerced)
new Date(0).getFullYear();        // 1970 (or 1969 in negative offsets — local!)
[new Date(2,1), new Date(3,1)].sort();  // sorts by string (toString) — wrong! sort((a,b)=>a-b)
```

## 12. Output Prediction
```js
console.log(new Date(2024, 0, 1).getMonth());     // 0 (January)
console.log(new Date(2024, 11, 31).getMonth());   // 11 (December)
console.log(new Date('2024-02-30'));              // Invalid Date OR rolls (string parsing) → Invalid Date
console.log(new Date(2024, 1, 30).getDate());     // 1 (Feb 30 → Mar 1)
console.log(typeof Date.now());                   // 'number'
console.log(new Date(0).toISOString());           // '1970-01-01T00:00:00.000Z'
console.log(+new Date('2024-01-01') === +new Date('2024-01-01'));  // true
console.log(new Date('x').getTime());             // NaN
```

## 13. Interview Questions
**🟢:** How does Date store time (epoch ms)? · Why is month 0-indexed? · Date.now() vs new Date()?
**🟡:** UTC vs local methods? · How is `'2024-01-15'` parsed (UTC)? · Compare two dates? · How to add days / get days between?
**🔴:** Timezone handling (Intl / Temporal / no native tz storage). · DST pitfalls. · Days in month trick. · Why mutating set* is risky.
**🧩:** "2 hours ago" relative time. · Format date in a specific timezone (Intl). · Compute age / days until event. · Date appears off by a day (UTC vs local parse).

## ⚡ REVISION
- Date = epoch ms (UTC internally); **months 0-indexed**, days 1-indexed.
- `Date.now()` for timestamps; local methods (getHours) vs UTC (getUTCHours).
- `'2024-01-15'` → UTC midnight; with time but no Z → local. Store/send as `toISOString()` (UTC).
- No native timezone storage → `Intl.DateTimeFormat({timeZone})` or Temporal/Luxon for tz math.
- Compare via `.getTime()`/`+date`; Dates are mutable (clone before set*); reuse Intl formatters.

➡️ Next: **Error Handling.**

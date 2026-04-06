# HTML Interview Preparation – Questions & Answers

---

# 1. What is HTML?

**HTML (HyperText Markup Language)** is the standard markup language used to structure and display content on the web.

It defines the structure of web pages using elements such as headings, paragraphs, images, links, and forms.

---

# 2. Purpose of `<!DOCTYPE html>`

The `<!DOCTYPE html>` declaration tells the browser that the document is written in **HTML5**.

It enables **standards mode**, ensuring browsers render the page according to modern web standards.

---

# 3. Basic HTML Structure

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Title</title>
  </head>

  <body>
    Content
  </body>
</html>
```

**Explanation**

| Tag       | Purpose                             |
| --------- | ----------------------------------- |
| `<html>`  | Root element of the document        |
| `<head>`  | Contains metadata and page settings |
| `<title>` | Page title displayed in browser tab |
| `<body>`  | Contains visible content            |

---

# 4. What are Semantic Elements?

**Semantic elements** clearly describe the meaning and purpose of their content.

Common semantic elements:

* `<header>`
* `<nav>`
* `<main>`
* `<section>`
* `<article>`
* `<aside>`
* `<footer>`

These improve **accessibility, SEO, and code readability**.

---

# 5. Difference Between `<div>` and `<section>`

| Feature | `<div>`             | `<section>`                  |
| ------- | ------------------- | ---------------------------- |
| Type    | Generic container   | Semantic container           |
| Meaning | No specific meaning | Represents a logical section |
| SEO     | Less meaningful     | More meaningful              |

---

# 6. HTML5 Features

HTML5 introduced several powerful features:

* Semantic elements
* New form input types
* Audio and video support
* Web APIs such as Canvas, Local Storage, and Geolocation

---

# 7. Block vs Inline Elements

| Block Elements          | Inline Elements           |
| ----------------------- | ------------------------- |
| Start on a new line     | Flow within text          |
| Take full width         | Take only necessary width |
| Accept width and height | Ignore width and height   |

Examples:

Block elements:

```
div
p
section
article
```

Inline elements:

```
span
a
img
strong
```

---

# 8. What is Accessibility?

Accessibility ensures that web content can be used by **people with disabilities**.

It involves:

* Semantic HTML
* Proper labels
* Alternative text for images
* ARIA attributes
* Keyboard navigation

---

# 9. What is ARIA?

**ARIA (Accessible Rich Internet Applications)** provides attributes that help assistive technologies understand complex UI components.

Example:

```html
<button aria-label="Close menu">X</button>
```

ARIA should be used **only when semantic HTML is not sufficient**.

---

# 10. Why is the `alt` Attribute Important?

The `alt` attribute:

* Describes images for screen readers
* Appears when images fail to load
* Improves SEO

Example:

```html
<img src="car.jpg" alt="Red sports car">
```

---

# 11. What Are Forms Used For?

HTML forms are used to **collect user input** and send data to servers.

Common form elements:

* `<input>`
* `<textarea>`
* `<select>`
* `<button>`

Example:

```html
<form>
  <input type="text" name="username">
  <button type="submit">Submit</button>
</form>
```

---

# 12. Built-in HTML Validation

HTML provides built-in validation attributes.

Common attributes:

| Attribute | Purpose               |
| --------- | --------------------- |
| required  | Field must be filled  |
| pattern   | Regex validation      |
| minlength | Minimum characters    |
| maxlength | Maximum characters    |
| min       | Minimum numeric value |
| max       | Maximum numeric value |

---

# 13. Difference Between `id` and `class`

| Feature    | id               | class             |
| ---------- | ---------------- | ----------------- |
| Uniqueness | Unique per page  | Reusable          |
| Selector   | `#id`            | `.class`          |
| Usage      | Specific element | Multiple elements |

---

# 14. What are `srcset` and `sizes`?

Used for **responsive images**.

They allow browsers to choose the most appropriate image size based on device resolution and screen size.

Example:

```html
<img 
  src="small.jpg"
  srcset="small.jpg 500w, medium.jpg 1000w, large.jpg 1500w"
  sizes="(max-width: 600px) 500px, 1000px"
>
```

---

# 15. `localStorage` vs `sessionStorage` vs Cookies

| Storage        | Persistence             | Server Access           |
| -------------- | ----------------------- | ----------------------- |
| localStorage   | Persists until cleared  | Not sent to server      |
| sessionStorage | Cleared when tab closes | Not sent to server      |
| Cookies        | Controlled expiry       | Sent with HTTP requests |

---

# 16. How to Lazy Load Images?

Lazy loading delays loading images until they are needed.

Example:

```html
<img src="image.jpg" loading="lazy">
```

Another method is using **IntersectionObserver API**.

---

# 17. How to Improve HTML Performance?

Common techniques:

* Optimize images
* Reduce DOM size
* Use lazy loading
* Defer non-critical scripts
* Preload critical assets

---

# 18. `async` vs `defer`

| Attribute | Behavior                              |
| --------- | ------------------------------------- |
| async     | Script loads and executes immediately |
| defer     | Script executes after HTML parsing    |

Example:

```html
<script async src="app.js"></script>
<script defer src="app.js"></script>
```

---

# 19. Inline vs External Scripts

| Inline Scripts      | External Scripts          |
| ------------------- | ------------------------- |
| Written inside HTML | Stored in separate file   |
| Increase HTML size  | Can be cached             |
| Harder to maintain  | Better for large projects |

---

# 20. How to Prevent XSS?

Cross-site scripting (XSS) can be prevented by:

* Escaping user input
* Sanitizing data
* Avoiding `innerHTML` with user data
* Using secure frameworks

---

# 21. HTML vs XHTML

| Feature        | HTML               | XHTML          |
| -------------- | ------------------ | -------------- |
| Syntax         | Flexible           | Strict         |
| Error handling | Forgiving          | Strict parsing |
| Tag closing    | Optional sometimes | Mandatory      |

---

# 22. What is Meta Viewport?

The viewport meta tag controls page scaling on mobile devices.

Example:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

It ensures proper **responsive layout on mobile devices**.

---

# 23. What is the `<picture>` Tag?

The `<picture>` element provides **art direction for responsive images**.

Example:

```html
<picture>
  <source media="(max-width: 600px)" srcset="mobile.jpg">
  <source media="(max-width: 1200px)" srcset="tablet.jpg">
  <img src="desktop.jpg" alt="Example image">
</picture>
```

The browser chooses the most suitable image.

---

# 24. SEO Best Practices

To improve search engine ranking:

* Use semantic HTML
* Add descriptive `alt` attributes
* Use proper heading hierarchy
* Include meta tags
* Improve page performance

---

# 25. Final Summary

HTML focuses on:

* Structuring web content
* Semantic markup
* Accessibility
* Performance optimization
* Search engine optimization (SEO)

---

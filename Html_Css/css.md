# CSS Interview Questions & Answers

---

# 1. What is CSS?

**CSS (Cascading Style Sheets)** is used to style and layout web pages. It controls colors, fonts, spacing, positioning, and overall visual appearance of HTML elements.

---

# 2. Types of CSS

### Inline CSS

Applied directly to an HTML element using the `style` attribute.

```html
<p style="color: red;">Hello</p>
```

### Internal CSS

Defined inside a `<style>` tag within the HTML document.

```html
<style>
p {
  color: red;
}
</style>
```

### External CSS

Defined in a separate `.css` file and linked to HTML.

```html
<link rel="stylesheet" href="styles.css">
```

External CSS is recommended for maintainability and scalability.

---

# 3. CSS Box Model

The **CSS Box Model** describes the layout structure of elements.

It consists of:

* Content
* Padding
* Border
* Margin

```
Total Width = Content + Padding + Border
Margin exists outside the element.
```

---

# 4. Difference Between Class and ID in CSS

| Feature     | Class                      | ID               |
| ----------- | -------------------------- | ---------------- |
| Reusability | Can be used multiple times | Should be unique |
| Syntax      | `.className`               | `#idName`        |
| Specificity | Lower                      | Higher           |

---

# 5. What is CSS Specificity?

CSS specificity determines which rule is applied when multiple rules target the same element.

**Priority Order**

```
Inline Styles > ID > Class > Element
```

Example:

```css
#header { color: red; }
.title { color: blue; }
p { color: black; }
```

---

# 6. What is the `display` Property?

The `display` property defines how an element appears in the layout.

Common values:

| Value        | Description                        |
| ------------ | ---------------------------------- |
| block        | Takes full width                   |
| inline       | Takes only required width          |
| inline-block | Inline but allows width and height |
| none         | Element is removed from layout     |
| flex         | Enables Flexbox layout             |
| grid         | Enables Grid layout                |

---

# 7. Difference Between `display:none` and `visibility:hidden`

| Property          | Behavior                      |
| ----------------- | ----------------------------- |
| display:none      | Removes element from layout   |
| visibility:hidden | Hides element but keeps space |

---

# 8. Position Property Types

CSS provides several positioning options:

| Value    | Description                                        |
| -------- | -------------------------------------------------- |
| static   | Default position                                   |
| relative | Positioned relative to itself                      |
| absolute | Positioned relative to nearest positioned ancestor |
| fixed    | Fixed relative to viewport                         |
| sticky   | Switches between relative and fixed                |

---

# 9. Difference Between `absolute` and `relative`

| Property | Behavior                                                  |
| -------- | --------------------------------------------------------- |
| relative | Moves element relative to its original position           |
| absolute | Positions element relative to nearest positioned ancestor |

---

# 10. What is `z-index`?

`z-index` controls the **vertical stacking order** of positioned elements.

Higher `z-index` values appear above lower values.

```css
div {
  position: absolute;
  z-index: 10;
}
```

---

# 11. What is Flexbox?

**Flexbox** is a one-dimensional layout system used to align and distribute items in rows or columns.

```css
.container {
  display: flex;
}
```

---

# 12. Common Flexbox Properties

### Container Properties

* `display: flex`
* `justify-content`
* `align-items`
* `flex-direction`
* `flex-wrap`

### Item Properties

* `flex`
* `order`
* `align-self`

---

# 13. What is CSS Grid?

**CSS Grid** is a two-dimensional layout system used for designing layouts with rows and columns.

```css
.container {
  display: grid;
}
```

---

# 14. Difference Between Flexbox and Grid

| Feature   | Flexbox         | Grid             |
| --------- | --------------- | ---------------- |
| Dimension | One-dimensional | Two-dimensional  |
| Layout    | Row or column   | Rows and columns |
| Use case  | Components      | Full layouts     |

---

# 15. What is Responsive Design?

Responsive design ensures web pages adapt to different screen sizes such as:

* Mobile
* Tablet
* Desktop

---

# 16. Media Queries

Media queries apply CSS based on device screen size.

```css
@media (max-width: 768px) {
  body {
    background-color: lightgray;
  }
}
```

---

# 17. Difference Between `rem` and `em`

| Unit | Relative To              |
| ---- | ------------------------ |
| em   | Parent element font size |
| rem  | Root (html) font size    |

---

# 18. What is `float` and `clear`?

### Float

Positions an element to the left or right.

```css
float: left;
```

### Clear

Prevents floating elements from overlapping.

```css
clear: both;
```

---

# 19. What is `overflow`?

Controls how content behaves when it exceeds container size.

| Value   | Description               |
| ------- | ------------------------- |
| hidden  | Content is clipped        |
| scroll  | Always shows scrollbars   |
| auto    | Shows scrollbar if needed |
| visible | Default behavior          |

---

# 20. What is `opacity`?

Controls transparency.

```
Range: 0 to 1
```

```css
opacity: 0.5;
```

---

# 21. What is a Pseudo-class?

Pseudo-classes define special states of elements.

Examples:

```
:hover
:focus
:nth-child()
```

Example:

```css
button:hover {
  background: blue;
}
```

---

# 22. What is a Pseudo-element?

Pseudo-elements style specific parts of elements.

Examples:

```
::before
::after
::first-letter
```

Example:

```css
p::before {
  content: "Note: ";
}
```

---

# 23. What is `!important`?

Overrides all other CSS rules.

```css
color: red !important;
```

Should be used sparingly as it breaks CSS hierarchy.

---

# 24. What are CSS Preprocessors?

CSS preprocessors extend CSS with additional features.

Common preprocessors:

* **Sass**
* **Less**

Features include:

* Variables
* Nesting
* Mixins
* Functions

---

# 25. What is BEM?

**BEM (Block Element Modifier)** is a naming convention for scalable CSS.

Example:

```
block__element--modifier
```

Example:

```css
.card {}
.card__title {}
.card--active {}
```

---

# 26. Difference Between `inline-block` and `block`

| Property     | Behavior                                   |
| ------------ | ------------------------------------------ |
| block        | Takes full width and starts new line       |
| inline-block | Flows inline but supports width and height |

---

# 27. What is `object-fit`?

Controls how images or videos fit inside containers.

Common values:

```
cover
contain
fill
```

Example:

```css
img {
  object-fit: cover;
}
```

---

# 28. What is `calc()`?

Allows dynamic calculations in CSS.

Example:

```css
width: calc(100% - 20px);
```

---

# 29. What is `transition`?

Adds smooth transitions between CSS property changes.

Example:

```css
button {
  transition: background 0.3s ease;
}
```

---

# 30. What is `animation`?

Creates keyframe-based animations.

Example:

```css
@keyframes slide {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}

.box {
  animation: slide 2s infinite;
}
```

---

# Final Summary

CSS is responsible for:

* Styling web pages
* Layout design
* Responsive design
* Animations and transitions
* Improving user interface and user experience

---

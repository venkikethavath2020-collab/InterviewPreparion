# Vue 2 to Vue 3 Migration Notes

## Key Changes in Vue 3
- **Composition API**: Introduced for better logic reuse and organization.
- **Fragments**: Templates can now have multiple root nodes.
- **Teleport**: Allows rendering components outside the DOM hierarchy.
- **Emits Option**: Explicitly define emitted events for better type-checking.
- **Global API Changes**: Vue 3 uses `createApp` instead of directly calling `new Vue`.

## Migration Steps
1. **Upgrade Dependencies**:
    - Update Vue to version 3.
    - Update Vue Router, Vuex, and other libraries to their Vue 3 compatible versions.

2. **Use the Migration Build**:
    - Use the Vue 3 migration build to identify and fix compatibility issues.

3. **Refactor Code**:
    - Replace `this.$listeners` and `this.$attrs` with `emits` and `attrs`.
    - Update lifecycle hooks (e.g., `beforeDestroy` → `beforeUnmount`).
    - Replace `filters` with computed properties or methods.

4. **Update Plugins**:
    - Ensure third-party plugins are compatible with Vue 3.

5. **Test Thoroughly**:
    - Use Vue Test Utils for testing components after migration.

## Tools
- **Vue Migration Guide**: [https://v3-migration.vuejs.org/](https://v3-migration.vuejs.org/)
- **Vue CLI Migration Tool**: Helps automate some migration tasks.

## Best Practices
- Migrate incrementally using the migration build.
- Refactor to the Composition API where necessary.
- Keep backups and use version control for safe migration.

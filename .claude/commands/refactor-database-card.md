# Refactor Database Card Component

Refactor components/database-card.tsx to use Tailwind CSS instead of inline styles.

## Current Issues

1. Too many inline styles make the component hard to maintain
2. Hard-coded color values instead of using CSS variables/Tailwind classes
3. `overflow: 'visible'` contradicts `whitespace-nowrap`

## Refactoring Guidelines

### Replace Hard-Coded Colors

Replace these hard-coded colors with Tailwind classes:

- `#252525` → `bg-[hsl(var(--surface-hover))]` or create a Tailwind class
- `#1a1a1a` → `bg-[hsl(var(--surface))]`
- `#6b6b6b` → `text-muted-foreground`
- `#d0d0d0` → `text-foreground`
- `#9a9a9a` → `text-muted-foreground`

### Replace Inline Styles with Tailwind

Convert responsive fontSize, padding, gap, etc. to Tailwind utilities where possible.

For complex responsive sizes that use clamp(), consider:

1. Creating custom Tailwind utilities in globals.css
2. Using existing `.text-fluid-*`, `.spacing-*`, `.gap-*` classes from globals.css

### Fix Overflow Issue

Line 58: Change `overflow: 'visible'` to use proper text truncation:

```typescript
className = 'font-medium text-foreground truncate flex items-center justify-between'
```

### Maintain Container Queries

Keep `containerType: 'inline-size'` as this is part of the responsive design system.

## Verification

- Component should look identical after refactoring
- Check responsiveness at various viewport sizes
- Ensure dark mode still works correctly
- Run `pnpm type-check` and `pnpm lint`
- Create commit: `refactor: convert database-card to use Tailwind CSS classes`

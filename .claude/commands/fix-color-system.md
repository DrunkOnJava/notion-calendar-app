# Fix Color System Issues

Fix the destructive color foreground issue in app/globals.css.

## Problem

The `--destructive-foreground` color (line 22 and 94) is currently the same as the destructive background, causing poor contrast.

## Changes Required

### Light Mode (around line 22)

Change:

```css
--destructive-foreground: oklch(0.577 0.245 27.325);
```

To:

```css
--destructive-foreground: oklch(0.985 0 0); /* White text for contrast */
```

### Dark Mode (around line 94)

Change:

```css
--destructive-foreground: oklch(0.637 0.237 25.331);
```

To:

```css
--destructive-foreground: oklch(0.95 0 0); /* Light text for dark mode */
```

## Verification

- Check that destructive buttons/alerts have good contrast
- Ensure both light and dark modes look correct
- Run `pnpm build` to verify no issues
- Create commit: `fix: improve destructive color contrast for better accessibility`

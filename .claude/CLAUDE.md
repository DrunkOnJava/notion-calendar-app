# Notion Calendar - Project Context

## Project Overview
Modern, feature-rich calendar application built with Next.js 16, React 19, and TypeScript.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui (Radix UI primitives)
- **Date Management:** date-fns
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **Package Manager:** pnpm (REQUIRED - NEVER use npm)

## Project Structure
```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles with custom responsive system
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Feature components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── public/              # Static assets
```

## Current Issues to Fix

### Critical (MUST FIX FIRST)
1. **TypeScript Build Errors Ignored** - `next.config.mjs` has `ignoreBuildErrors: true`
2. **Wrong JSX Configuration** - `tsconfig.json` uses `"jsx": "react-jsx"` instead of `"preserve"`
3. **Fonts Not Connected** - Layout loads fonts but doesn't apply them to body

### High Priority
4. **Generic Metadata** - Layout has placeholder title/description
5. **Color System Issue** - Destructive foreground color lacks proper contrast
6. **Image Optimization Disabled** - Should re-enable or document why disabled
7. **Missing Environment Setup** - No `.env.example` or env validation

### Medium Priority
8. **Inline Styles Overuse** - `database-card.tsx` uses too many inline styles
9. **No Environment Validation** - Should use Zod to validate env vars
10. **Missing Error Boundaries** - App needs proper error handling
11. **No Loading States** - Async operations need loading indicators

### Nice to Have
12. **Prettier Configuration** - Add for consistent formatting
13. **CI/CD Pipeline** - GitHub Actions for automated testing
14. **Component Documentation** - Storybook setup
15. **Path Aliases** - More granular organization

## Code Style Requirements
- Use Tailwind CSS classes over inline styles
- Prefer CSS variables from globals.css over hard-coded colors
- Follow Next.js 16 App Router conventions
- Use TypeScript strict mode
- Follow conventional commits format

## Design System
- Color system uses OKLCH color space
- Comprehensive responsive container system with CSS container queries
- 8px grid system for spacing
- Fluid typography using clamp()
- Dark mode support with semantic color tokens

## Testing Requirements
- Run type checking: `pnpm type-check`
- Run linting: `pnpm lint`
- Build should complete without errors: `pnpm build`

## Git Workflow
- Branch naming: `fix/`, `feat/`, `refactor/`, `docs/`, `chore/`
- Commit messages: Follow conventional commits
- End commits with: `🤖 Generated with Claude Code`

## Important Notes
- ALWAYS use pnpm (never npm)
- Respect the existing responsive design system in globals.css
- Maintain accessibility (semantic HTML, ARIA attributes)
- Keep bundle size reasonable
- Follow React 19 best practices

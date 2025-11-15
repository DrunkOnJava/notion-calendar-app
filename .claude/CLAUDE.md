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

## Recent Improvements (Completed)

### Type Safety & Build Quality ✅
- All TypeScript errors resolved - build passes cleanly
- Consolidated type definitions (Event, RecurrenceRule) in `types/event.ts`
- Removed duplicate type definitions across codebase
- Added proper type safety to all components
- Fixed PersonnelItem/DatabaseItem type compatibility
- Removed duplicate `hooks/use-toast.ts` file

### Configuration & Tooling ✅
- Fixed Next.js config (removed `ignoreBuildErrors`)
- JSX configuration properly set to `react-jsx` (Next.js manages this)
- Added Prettier with Tailwind plugin for consistent formatting
- Set up GitHub Actions CI/CD pipeline with type-checking and linting
- Added `.env.example` with comprehensive environment variables
- Added environment validation with Zod

### UI/UX Improvements ✅
- Updated metadata with proper SEO title and description
- Fixed color contrast issues (destructive-foreground)
- Refactored database-card to use Tailwind classes over inline styles
- Added error boundaries (`app/error.tsx`, `app/not-found.tsx`, `app/loading.tsx`)
- Improved right sidebar UX (collapsed by default)
- Added VSCode workspace settings for better DX

### Remaining Opportunities
- Component documentation with Storybook
- More granular path aliases organization
- Additional loading states for async operations
- Performance monitoring and optimization

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
- Commit messages: Follow conventional commits format
- Use descriptive commit messages focused on the "why" not just the "what"

## Important Notes
- ALWAYS use pnpm (never npm)
- Respect the existing responsive design system in globals.css
- Maintain accessibility (semantic HTML, ARIA attributes)
- Keep bundle size reasonable
- Follow React 19 best practices

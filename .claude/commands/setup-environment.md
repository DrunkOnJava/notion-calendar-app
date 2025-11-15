# Setup Environment Configuration

Create environment configuration files and validation.

## 1. Create .env.example
Create a `.env.example` file with all required environment variables:

```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Notion Integration (if applicable)
# NOTION_API_KEY=your_notion_api_key
# NOTION_DATABASE_ID=your_database_id

# Analytics (Vercel Analytics already configured)
# Add any other required environment variables based on your setup
```

## 2. Add Environment Validation with Zod
Create `lib/env.ts`:

```typescript
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  // Add other environment variables as needed
});

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NODE_ENV: process.env.NODE_ENV,
});
```

## 3. Update .gitignore
Ensure .gitignore includes:
```
# Environment variables
.env
.env.local
.env.production.local
.env.development.local
.env.test.local

# Dependencies
node_modules/
.pnpm-store/

# Next.js
.next/
out/
build/
dist/

# Testing
coverage/
.nyc_output/

# Misc
.DS_Store
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# IDE
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea/
*.swp
*.swo
*~

# Claude Code
.claude/
!.claude/CLAUDE.md
!.claude/settings.json
!.claude/commands/
```

## Verification
- `.env.example` should be committed
- `.env` should NOT be in version control
- Environment validation should work when importing from `lib/env`
- Create commit: `chore: add environment configuration and validation`

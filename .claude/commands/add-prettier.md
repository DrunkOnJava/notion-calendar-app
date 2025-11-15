# Add Prettier Configuration

Setup Prettier for consistent code formatting across the project.

## 1. Install Prettier

```bash
pnpm add -D prettier prettier-plugin-tailwindcss
```

## 2. Create .prettierrc.json

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

## 3. Create .prettierignore

```
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
.next/
out/
build/
dist/

# Package manager files
pnpm-lock.yaml
package-lock.json
yarn.lock

# Environment files
.env*

# Logs
*.log

# OS files
.DS_Store
```

## 4. Update package.json Scripts

Add these scripts to package.json:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

## 5. Update ESLint Config

Add Prettier to eslint.config.mjs to avoid conflicts:

```javascript
// At the top with other imports
import prettierPlugin from 'eslint-plugin-prettier';

// In the rules section
rules: {
  ...nextRules,
  'prettier/prettier': 'warn',
  // ... rest of rules
}
```

## Verification

- Run `pnpm format` to format all files
- Run `pnpm format:check` to verify formatting
- Ensure no conflicts between ESLint and Prettier
- Create commit: `chore: add Prettier for consistent code formatting`

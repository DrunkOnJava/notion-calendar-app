# Fix Critical Configuration Issues

Fix these critical configuration issues in order:

## 1. Fix TypeScript Configuration (tsconfig.json)

- Change `"jsx": "react-jsx"` to `"jsx": "preserve"` for proper Next.js handling
- Verify the change doesn't break the build

## 2. Fix Next.js Configuration (next.config.mjs)

- Remove `ignoreBuildErrors: true` from TypeScript config
- Re-enable image optimization by removing `unoptimized: true` OR add a comment explaining why it must stay disabled
- Ensure the build completes successfully after changes

## 3. Fix Font Loading (app/layout.tsx)

- Remove the underscore prefix from font variable names (`_geist` → `geist`, `_geistMono` → `geistMono`)
- Add `variable` property to font configurations:
  ```typescript
  const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })
  const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })
  ```
- Apply fonts to body element:
  ```typescript
  <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased m-0 p-0 overflow-hidden h-screen`}>
  ```

## Verification

After all changes:

1. Run `pnpm type-check` - should pass with no errors
2. Run `pnpm build` - should complete successfully
3. Create a commit with message: `fix: correct TypeScript, Next.js, and font configurations`

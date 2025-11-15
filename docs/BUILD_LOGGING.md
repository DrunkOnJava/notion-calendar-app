# Build Logging & Debugging Guide

Comprehensive guide to verbose build logging and debugging in this Next.js project.

## Quick Start

### Verbose Build Scripts

```bash
# Full verbose build with comprehensive logging
pnpm build:verbose

# Build with comprehensive step-by-step logging
pnpm build:full-logs

# Build with bundle analysis
pnpm build:analyze

# Build with performance profiling
pnpm build:profile
```

### Development Scripts

```bash
# Development server with verbose logging
pnpm dev:verbose

# Development with Turbopack (faster)
pnpm dev:turbo

# TypeScript checking with file listings
pnpm type-check:verbose

# TypeScript with diagnostic timing
pnpm type-check:trace

# ESLint with verbose output
pnpm lint:verbose
```

## Logging Configuration

### Next.js Config (`next.config.mjs`)

The project is configured with:

- **Verbose logging level**: Shows detailed request/response info
- **Full URLs in logs**: Complete URL paths for debugging
- **Turbopack detailed logging**: Info-level logs with details
- **TypeScript error display**: Full error messages during build
- **ESLint integration**: All linting errors shown during build
- **Webpack verbose stats**: Detailed build statistics in dev mode
- **Typed routes**: Better error messages for routing

### Environment Variables (`.env.development`)

Development environment includes:

- `NEXT_TELEMETRY_DEBUG=1` - Enable Next.js telemetry debugging
- `DEBUG=*` - Enable all debug namespaces
- `VERBOSE=true` - General verbosity flag
- `NEXT_BUILD_TRACE=1` - Performance tracing
- `GENERATE_SOURCEMAP=true` - Source maps for debugging

### VSCode Debug Configurations

Press F5 in VSCode and select:

1. **Next.js: verbose build** - Run build with all debug output
2. **Next.js: dev with verbose logging** - Development server with debug info
3. **Next.js: debug full stack** - Debug both client and server
4. **Next.js: debug server-side** - Server-only debugging
5. **Next.js: debug client-side** - Client-only debugging

## Comprehensive Build Script

The `scripts/build-with-logs.sh` script provides:

### Step-by-Step Process

1. **Environment Information**
   - Node, pnpm, Next.js, TypeScript versions
   - Working directory verification

2. **Clean Previous Builds**
   - Removes `.next` directory
   - Ensures fresh build state

3. **Dependency Check**
   - Verifies node_modules
   - Auto-installs if missing

4. **TypeScript Type Check (Verbose)**
   - Lists all files being checked
   - Explains file inclusions
   - Full error details
   - Logs saved to `/tmp/typecheck.log`

5. **ESLint (Verbose)**
   - Verbose format output
   - All warnings and errors
   - Zero warnings tolerance
   - Logs saved to `/tmp/lint.log`

6. **Production Build**
   - Debug mode enabled
   - Telemetry debugging
   - Timing information
   - Logs saved to `/tmp/build.log`

7. **Build Analysis**
   - .next directory size
   - Static assets size
   - Page count
   - Performance metrics

### Log Files

All build logs are saved to `/tmp/`:
- `/tmp/typecheck.log` - Complete TypeScript output
- `/tmp/lint.log` - Complete ESLint output
- `/tmp/build.log` - Complete build output

These logs persist after build completion for analysis.

## Debugging Common Issues

### TypeScript Errors

```bash
# Quick check
pnpm type-check

# See all files being checked
pnpm type-check:verbose

# Get compilation timing info
pnpm type-check:trace
```

### Build Performance

```bash
# Profile build performance
pnpm build:profile

# Analyze bundle size
pnpm build:analyze
```

### Runtime Errors

```bash
# Development with full debug output
pnpm dev:verbose

# Check build logs
cat /tmp/build.log

# Check type check logs
cat /tmp/typecheck.log
```

## Next.js Build Output Explained

### Build Phases

1. **Compiling** - TypeScript and JSX compilation
2. **Type Checking** - Running TypeScript compiler
3. **Collecting page data** - Static analysis
4. **Generating static pages** - Pre-rendering pages
5. **Finalizing optimization** - Bundle optimization

### Route Symbols

- `○` (Static) - Pre-rendered as static HTML
- `●` (SSG) - Static site generation
- `λ` (Server) - Server-side rendered
- `◐` (ISR) - Incremental static regeneration

### Verbose Output Includes

- File compilation details
- Module resolution paths
- Bundle size information
- Chunk organization
- Tree-shaking results
- Asset optimization
- TypeScript compilation timing

## Tips for Maximum Verbosity

### Environment Variables

Add to your shell or `.env.local`:

```bash
export NEXT_TELEMETRY_DEBUG=1
export DEBUG=*
export VERBOSE=true
export NEXT_BUILD_TRACE=1
```

### Node Inspector

For deep debugging:

```bash
node --inspect-brk $(which next) build
```

Then open `chrome://inspect` in Chrome.

### Memory Profiling

```bash
node --max-old-space-size=8192 --prof $(which next) build
```

## CI/CD Logging

GitHub Actions workflow (`.github/workflows/ci.yml`) includes:

- `--verbose` flags on all commands
- Full error output
- Build artifact logs
- Test result summaries

## Further Reading

- [Next.js Debugging Docs](https://nextjs.org/docs/advanced-features/debugging)
- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)
- [ESLint Formatters](https://eslint.org/docs/latest/use/formatters/)

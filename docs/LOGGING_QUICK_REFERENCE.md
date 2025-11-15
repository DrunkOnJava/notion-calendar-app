# Build Logging - Quick Reference

## Most Common Commands

```bash
# Standard build (normal output)
pnpm build

# Verbose build (debug mode, telemetry)
pnpm build:verbose

# Comprehensive build with step-by-step analysis
pnpm build:full-logs

# Analyze bundle size
pnpm build:analyze

# Profile build performance
pnpm build:profile
```

## TypeScript Debugging

```bash
# Standard type check
pnpm type-check

# List all files being checked
pnpm type-check:verbose

# Show compilation diagnostics and timing
pnpm type-check:trace
```

## Development Modes

```bash
# Standard dev server
pnpm dev

# Dev server with debug logging
pnpm dev:verbose

# Dev server with Turbopack
pnpm dev:turbo
```

## ESLint Debugging

```bash
# Standard lint
pnpm lint

# Verbose output with zero warnings
pnpm lint:verbose
```

## VSCode Integration

### Run Tasks (Cmd+Shift+P → "Tasks: Run Task")

- **build:verbose** - Debug build in dedicated panel
- **build:full-logs** - Comprehensive 7-step build process
- **build:analyze** - Bundle analysis
- **dev:verbose** - Development with verbose logging
- **type-check:verbose** - List all checked files
- **type-check:trace** - Show TypeScript diagnostics
- **lint:verbose** - Detailed linting output

### Debug Configurations (F5)

- **Next.js: verbose build** - Run build with debugger attached
- **Next.js: dev with verbose logging** - Development with all debug output
- **Next.js: debug full stack** - Debug both client and server

## Log File Locations

After running `pnpm build:full-logs`, check:

```
/tmp/typecheck.log   # Complete TypeScript output
/tmp/lint.log        # Complete ESLint output
/tmp/build.log       # Complete build output
```

## Environment Variables for Max Verbosity

Add to `.env.local`:

```bash
NEXT_TELEMETRY_DEBUG=1
DEBUG=*
VERBOSE=true
NEXT_BUILD_TRACE=1
GENERATE_SOURCEMAP=true
```

## Next.js Build Output Symbols

- `○` Static - Pre-rendered at build time
- `●` SSG - Static site generation
- `λ` Server - Server-side rendered
- `◐` ISR - Incremental static regeneration

## Quick Debugging Workflow

```bash
# 1. Clean build with all logs
pnpm build:full-logs

# 2. Check specific log files
cat /tmp/typecheck.log | grep error
cat /tmp/lint.log | grep warning
cat /tmp/build.log | grep -A5 "Failed"

# 3. Analyze results
tail -100 /tmp/build.log
```

## Performance Monitoring

```bash
# Profile build timing
pnpm build:profile

# Analyze bundle composition
pnpm build:analyze

# Check build artifacts size
du -sh .next
du -sh .next/static
```

## Tips

- Use `build:full-logs` for complete diagnostic info
- Use `build:verbose` for quick debug builds
- Use `build:analyze` to investigate bundle bloat
- Check `/tmp/*.log` files for historical build data
- Run `pnpm type-check:trace` to debug slow compilation

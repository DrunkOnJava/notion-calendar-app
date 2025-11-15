# Vercel Integration Setup

## Current Status

✅ **Vercel MCP Server Added**: `vercel-notion-calendar`
✅ **Speed Insights Installed**: `@vercel/speed-insights@1.2.0`
✅ **Analytics Installed**: `@vercel/analytics@1.5.0`

## Next Steps

### 1. Authenticate Vercel MCP

In your current Claude Code session, type:

```
/mcp
```

This will:
- List all MCP servers including `vercel-notion-calendar`
- Prompt you to authenticate with Vercel
- Grant Claude Code access to your Vercel projects

### 2. Deploy to Vercel

If not already deployed:

```bash
# Install Vercel CLI (if needed)
pnpm add -g vercel

# Deploy
vercel

# Or link to existing project
vercel link
```

### 3. Upgrade to Project-Specific MCP (Optional)

Once deployed, get your project details:

```bash
vercel projects ls
```

Then update the MCP connection for better performance:

```bash
# Remove general MCP
claude mcp remove vercel-notion-calendar

# Add project-specific MCP (faster, auto-context)
claude mcp add --transport http vercel-notion-calendar https://mcp.vercel.com/<your-team>/<your-project>
```

### 4. Enable Speed Insights in Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **notion-calendar-app** project
3. Click **Speed Insights** tab
4. Click **Enable**

### 5. Verify Integration

After deployment, check:

```bash
# In Claude Code, ask:
"Check my Vercel deployment status"
"Show me the latest deployment logs"
"What's my Speed Insights score?"
```

## Available Vercel MCP Tools

Once authenticated, you can use:

### Documentation Tools (No auth required)
- Search Vercel docs
- Get Next.js documentation
- Find deployment guides

### Project Management (Auth required)
- List all projects
- View deployment status
- Check deployment logs
- Analyze build output
- View Speed Insights metrics
- Manage environment variables
- Trigger new deployments

## Speed Insights Metrics Tracked

Your app now tracks:
- **Real Experience Score (RES)** - Overall UX (target: >90)
- **First Contentful Paint (FCP)** - Initial render (target: <1.8s)
- **Largest Contentful Paint (LCP)** - Main content visible (target: <2.5s)
- **Interaction to Next Paint (INP)** - Responsiveness (target: <200ms)
- **Cumulative Layout Shift (CLS)** - Visual stability (target: <0.1)
- **First Input Delay (FID)** - First interaction (target: <100ms)
- **Time to First Byte (TTFB)** - Server response (target: <800ms)

## Monitoring Performance

### In Vercel Dashboard
- Visit Speed Insights tab after deployment
- View metrics by route, path, country, device
- Analyze HTML element performance
- Track improvements over time

### In Claude Code
After MCP authentication:
```
"What's the performance score for my home page?"
"Show me slow routes in my deployment"
"Compare performance between last two deployments"
```

## Troubleshooting

### No Speed Insights Data
- Wait 30 seconds after first visit
- Visit the deployed site and navigate between pages
- Check for content blockers in browser
- Verify `/_vercel/speed-insights/script.js` is loaded

### MCP Authentication Issues
- Run `/mcp` in Claude Code
- Follow the OAuth flow in browser
- Ensure you're logged into Vercel
- Check Claude Code has internet access

### Build Failures
Use verbose logging:
```bash
pnpm build:verbose     # Quick debug output
pnpm build:full-logs   # Comprehensive 7-step analysis
```

Check logs:
```bash
cat /tmp/build.log
cat /tmp/typecheck.log
cat /tmp/lint.log
```

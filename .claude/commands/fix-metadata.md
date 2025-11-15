# Update Application Metadata

Update the placeholder metadata in app/layout.tsx with proper project information.

## Changes Required

Replace the current metadata:

```typescript
export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
  // ... rest of metadata
}
```

With:

```typescript
export const metadata: Metadata = {
  title: 'Notion Calendar - Modern Calendar & Event Management',
  description:
    'Feature-rich calendar application with multiple views, drag-and-drop events, recurring events, database views, scheduling links, and smart time finding',
  keywords: ['calendar', 'scheduling', 'events', 'notion', 'productivity', 'time management'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  // Keep existing icons configuration
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}
```

## Verification

- Confirm metadata is properly typed
- Build should complete successfully
- Create commit: `docs: update application metadata with proper titles and descriptions`

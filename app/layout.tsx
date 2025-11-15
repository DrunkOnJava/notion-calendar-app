import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
<<<<<<< HEAD
  title: 'Notion Calendar',
  description: 'Modern, feature-rich calendar application built with Next.js, React, and TypeScript',
||||||| a1e2555
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
=======
  title: 'Notion Calendar - Modern Calendar & Event Management',
  description: 'Feature-rich calendar application with multiple views, drag-and-drop events, recurring events, database views, scheduling links, and smart time finding',
  keywords: ['calendar', 'scheduling', 'events', 'notion', 'productivity', 'time management'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
>>>>>>> origin/main
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased m-0 p-0 overflow-hidden" style={{ height: '100vh' }}>
        {children}
      </body>
    </html>
  )
}

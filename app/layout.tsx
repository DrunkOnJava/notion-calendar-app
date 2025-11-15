import type { Metadata } from 'next'
// Temporarily disabled Google Fonts due to build environment network restrictions
// Uncomment below when deploying to production:
// import { Geist, Geist_Mono } from 'next/font/google'
// const geist = Geist({
//   subsets: ["latin"],
//   variable: "--font-sans",
//   fallback: ['system-ui', 'arial']
// });
// const geistMono = Geist_Mono({
//   subsets: ["latin"],
//   variable: "--font-mono",
//   fallback: ['ui-monospace', 'monospace']
// });
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
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
    <html lang="en">
      <body className="font-sans antialiased m-0 p-0 overflow-hidden h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

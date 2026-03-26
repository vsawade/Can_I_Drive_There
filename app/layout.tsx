import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'Can I Drive There? | International Driving Requirements',
    template: '%s | Can I Drive There?',
  },
  description: 'Check what documents and permits you need to legally drive in another country. Get clear checklists for international driving requirements.',
  metadataBase: new URL('https://canidrivethere.com'),
  openGraph: {
    title: 'Can I Drive There? | International Driving Requirements',
    description: 'Check what documents and permits you need to legally drive in another country.',
    url: 'https://canidrivethere.com',
    siteName: 'Can I Drive There?',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Can I Drive There?',
    description: 'Check international driving requirements for your next trip.',
  },
  robots: {
    index: true,
    follow: true,
  },
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
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

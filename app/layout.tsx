import type { Metadata, Viewport } from 'next'
import { inter, jetbrainsMono } from '@/lib/fonts'
import { Providers } from '@/components/providers'
import { ScrollProgress } from '@/components/scroll-progress'
import { NetworkCanvas } from '@/components/network-canvas'
import { Loader } from '@/components/loader'
import { InteractionLock } from '@/components/interaction-lock'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Pavlo Popovych | Data Analyst',
  description:
    'Pavlo Popovych — Data Analyst specializing in Python, SQL, and Power BI. I turn data noise into clarity through analytics, automation, and clear communication.',
  metadataBase: new URL('https://zxrc0.dev'),
  openGraph: {
    title: 'Pavlo Popovych | Data Analyst',
    description:
      'Data Analyst specializing in Python, SQL, and Power BI. Turning data noise into clarity.',
    type: 'website',
    locale: 'en_US',
    url: 'https://zxrc0.dev',
    siteName: 'Pavlo Popovych',
    images: [
      {
        url: '/images/cw-meta.avif',
        width: 1200,
        height: 630,
        alt: 'Pavlo Popovych — Data Analyst',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pavlo Popovych | Data Analyst',
    description:
      'Data Analyst specializing in Python, SQL, and Power BI. Turning data noise into clarity.',
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>📊</text></svg>",
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
        <body className="flex min-h-svh flex-col bg-background font-sans text-foreground antialiased">
        <Providers>
          <InteractionLock />
          <Loader />
          <NetworkCanvas />
          <ScrollProgress />
          {children}
        </Providers>
      </body>
    </html>
  )
}

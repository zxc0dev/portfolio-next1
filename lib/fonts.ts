import { Inter, JetBrains_Mono } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  display: 'block',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'block',
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600', '700'],
})

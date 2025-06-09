import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Chess Game - 2 Player Hotseat",
  description:
    "A beautiful, responsive chess game built with Next.js, Chess.js, and React-Chessboard. Perfect for 2-player hotseat gameplay.",
  keywords: "chess, game, 2-player, hotseat, nextjs, react, chess game, online chess, multiplayer chess",
  generator: 'v0.dev',
  metadataBase: new URL('https://your-domain.com'),
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'Your Name',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      {
        url: '/favicon.png',
        type: 'image/png',
      }
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  openGraph: {
    title: 'Chess Game - 2 Player Hotseat',
    description: 'A beautiful, responsive chess game built with Next.js, Chess.js, and React-Chessboard. Perfect for 2-player hotseat gameplay.',
    type: 'website',
    images: [
      {
        url: '/favicon.png',
        width: 192,
        height: 192,
        alt: 'Chess Game Logo',
      }
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Chess Game - 2 Player Hotseat',
    description: 'A beautiful, responsive chess game built with Next.js, Chess.js, and React-Chessboard.',
    images: ['/favicon.png'],
  },
  manifest: '/manifest.json'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

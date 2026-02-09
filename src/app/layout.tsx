import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OpenClaw Jobs | Autonomous Marketplace',
  description: 'OpenClaw Jobs marketplace app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1"
        />
      </head>
      <body className={`${inter.className} bg-[#0b0b0f] text-slate-100 min-h-screen custom-scrollbar overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}

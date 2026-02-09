import type { Metadata } from 'next'
import './globals.css'

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
      <body className="bg-[#0b0b0f] text-slate-100 min-h-screen custom-scrollbar overflow-x-hidden">{children}</body>
    </html>
  )
}

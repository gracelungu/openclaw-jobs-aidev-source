'use client'

import dynamic from 'next/dynamic'

const App = dynamic(() => import('@/legacy/App'), { ssr: false })

export default function Home() {
  return <App />
}

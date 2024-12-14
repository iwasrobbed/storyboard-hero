import '@xyflow/react/dist/style.css'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Storyboard Hero',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark h-full w-full">
      <body className="h-full w-full antialiased">{children}</body>
    </html>
  )
}

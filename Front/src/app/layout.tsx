import type { Metadata } from 'next'
import { Sora } from 'next/font/google'
import './globals.css'

const sora = Sora({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Emotify - Descubra as emoções por trás da sua música',
  description: 'Analise suas músicas do Spotify e descubra o DNA emocional das suas faixas favoritas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={sora.className}>{children}</body>
    </html>
  )
}

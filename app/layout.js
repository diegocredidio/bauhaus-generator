import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: 'Supergráficos Bauhaus — p5.js + Next.js',
  description: 'Gerador Bauhaus/Ulm com p5.js em Next.js (App Router)',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        {/* p5.js removido - usando Canvas API nativo */}
      </head>
      <body>{children}</body>
    </html>
  )
}

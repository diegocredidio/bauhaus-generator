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
        {/* Removidas fontes externas para evitar problemas no build */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.3/p5.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

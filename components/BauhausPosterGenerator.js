'use client'
import { useEffect, useRef, useState } from 'react'

export default function BauhausPosterGenerator() {
  const canvasRef = useRef(null)
  const [paletteIdx, setPaletteIdx] = useState(0)
  const [seed, setSeed] = useState(12345)
  const [customText, setCustomText] = useState('BAUHAUS')

  // Effect para carregar texto do localStorage após componente montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedText = localStorage.getItem('bauhaus-custom-text')
      if (savedText) {
        setCustomText(savedText)
      }
    }
  }, [])

  // Paletas baseadas na imagem de referência do Bauhaus
  const PALETTES = [
    // Paleta 1 - Cores primárias clássicas
    {
      background: "#E8E8E8", // Cinza claro como na imagem
      colors: ["#FF0000", "#0066CC", "#FFD700", "#000000", "#FFFFFF", "#32CD32", "#FF7F00"]
    },
    // Paleta 2 - Azul e Roxo (baseada na imagem)
    {
      background: "#2E3A5F", // Azul escuro do fundo
      colors: ["#4A90E2", "#6A7FDB", "#8B5CF6", "#A855F7", "#3B82F6", "#60A5FA", "#FFFFFF"]
    },
    // Paleta 3 - Vibrante
    {
      background: "#FFFFFF",
      colors: ["#DC143C", "#1E90FF", "#32CD32", "#FFD700", "#FF7F00", "#9370DB", "#000000"]
    },
    // Paleta 4 - Minimalista
    {
      background: "#F8F8F8",
      colors: ["#000000", "#FF0000", "#0000FF", "#FFFF00", "#FFFFFF", "#808080", "#696969"]
    },
    // Paleta 5 - Oceano
    {
      background: "#E0F6FF",
      colors: ["#006994", "#87CEEB", "#4682B4", "#191970", "#FFFFFF", "#20B2AA", "#FFD700"]
    },
    // Paleta 6 - Outono
    {
      background: "#FFF8DC",
      colors: ["#FF7F00", "#DAA520", "#B22222", "#8B4513", "#FFFFFF", "#2F4F4F", "#32CD32"]
    },
    // Paleta 7 - Noturna
    {
      background: "#2C2C2C",
      colors: ["#FFD700", "#FF6347", "#87CEEB", "#9370DB", "#FFFFFF", "#32CD32", "#FF7F00"]
    },
    // Paleta 8 - Primavera
    {
      background: "#F0FFF0",
      colors: ["#32CD32", "#00CED1", "#FF69B4", "#FFD700", "#FFFFFF", "#9370DB", "#000000"]
    }
  ]

  // Função de random seeded
  let randomSeed = seed
  const seededRandom = () => {
    const x = Math.sin(randomSeed++) * 10000
    return x - Math.floor(x)
  }

  const drawComposition = (canvas, ctx, textToShow = customText) => {
    const width = canvas.width
    const height = canvas.height

    // Reset random seed
    randomSeed = seed

    const palette = PALETTES[paletteIdx % PALETTES.length] || PALETTES[0]

    // Background
    ctx.fillStyle = palette.background || "#E8E8E8"
    ctx.fillRect(0, 0, width, height)

    // pickCol function with current palette
    const pickCol = (k) => {
      if (!palette || !palette.colors || palette.colors.length === 0) {
        return "#000000" // fallback color
      }
      return palette.colors[k % palette.colors.length]
    }

    // Formas geométricas baseadas na imagem de referência
    const drawSquare = (x, y, size, color) => {
      ctx.fillStyle = color
      ctx.fillRect(x, y, size, size)
    }

    const drawTriangleTopLeft = (x, y, size, color) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + size, y)
      ctx.lineTo(x, y + size)
      ctx.closePath()
      ctx.fill()
    }

    const drawTriangleTopRight = (x, y, size, color) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + size, y)
      ctx.lineTo(x + size, y + size)
      ctx.closePath()
      ctx.fill()
    }

    const drawTriangleBottomLeft = (x, y, size, color) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y + size)
      ctx.lineTo(x + size, y + size)
      ctx.closePath()
      ctx.fill()
    }

    const drawTriangleBottomRight = (x, y, size, color) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(x + size, y)
      ctx.lineTo(x, y + size)
      ctx.lineTo(x + size, y + size)
      ctx.closePath()
      ctx.fill()
    }

    const drawSemicircleTop = (x, y, size, color) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x + size/2, y + size, size/2, Math.PI, 2 * Math.PI)
      ctx.fill()
    }

    const drawSemicircleBottom = (x, y, size, color) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x + size/2, y, size/2, 0, Math.PI)
      ctx.fill()
    }

    const drawSemicircleLeft = (x, y, size, color) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x + size, y + size/2, size/2, Math.PI/2, Math.PI + Math.PI/2)
      ctx.fill()
    }

    const drawSemicircleRight = (x, y, size, color) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y + size/2, size/2, -Math.PI/2, Math.PI/2)
      ctx.fill()
    }

    const drawQuarterCircleTopLeft = (x, y, size, color) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x + size, y + size, size, Math.PI, Math.PI + Math.PI/2)
      ctx.fill()
    }

    const drawQuarterCircleTopRight = (x, y, size, color) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y + size, size, Math.PI + Math.PI/2, 2 * Math.PI)
      ctx.fill()
    }

    const drawQuarterCircleBottomLeft = (x, y, size, color) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x + size, y, size, Math.PI/2, Math.PI)
      ctx.fill()
    }

    const drawQuarterCircleBottomRight = (x, y, size, color) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI/2)
      ctx.fill()
    }

    // Grid system uniforme como na imagem de referência
    const GRID_SIZE = 60 // Tamanho fixo para uniformidade
    const COLS = Math.floor(width / GRID_SIZE)
    const ROWS = Math.floor(height / GRID_SIZE)

    // Densidade mais alta para preencher melhor o espaço
    const DENSITY = 0.85

    // Generate composition similar to reference image
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = col * GRID_SIZE
        const y = row * GRID_SIZE

        // Alta chance de preencher cada célula
        if (seededRandom() < DENSITY) {
          const colorIdx = Math.floor(seededRandom() * palette.colors.length)
          const color = pickCol(colorIdx)

          // Array de todas as formas disponíveis
          const shapeTypes = [
            () => drawSquare(x, y, GRID_SIZE, color),
            () => drawTriangleTopLeft(x, y, GRID_SIZE, color),
            () => drawTriangleTopRight(x, y, GRID_SIZE, color),
            () => drawTriangleBottomLeft(x, y, GRID_SIZE, color),
            () => drawTriangleBottomRight(x, y, GRID_SIZE, color),
            () => drawSemicircleTop(x, y, GRID_SIZE, color),
            () => drawSemicircleBottom(x, y, GRID_SIZE, color),
            () => drawSemicircleLeft(x, y, GRID_SIZE, color),
            () => drawSemicircleRight(x, y, GRID_SIZE, color),
            () => drawQuarterCircleTopLeft(x, y, GRID_SIZE, color),
            () => drawQuarterCircleTopRight(x, y, GRID_SIZE, color),
            () => drawQuarterCircleBottomLeft(x, y, GRID_SIZE, color),
            () => drawQuarterCircleBottomRight(x, y, GRID_SIZE, color)
          ]

          // Escolher uma forma aleatoriamente
          const randomShape = shapeTypes[Math.floor(seededRandom() * shapeTypes.length)]
          randomShape()
        }
      }
    }

    // Texto "BAUHAUS" com especificações exatas
    if (seededRandom() < 0.9) { // 90% de chance de mostrar o texto
      // Posição aleatória mas com margens
      const margin = 100
      const textX = margin + seededRandom() * (width - margin * 2)
      const textY = margin + seededRandom() * (height - margin * 2)

      // Configurar fonte
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

      // Medir texto para criar fundo
      const metrics = ctx.measureText(textToShow)
      const textWidth = metrics.width
      const textHeight = 36
      const padding = 30

      // Fundo branco com padding de 30px
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(
        textX - textWidth/2 - padding,
        textY - textHeight/2 - padding,
        textWidth + padding * 2,
        textHeight + padding * 2
      )

      // Texto preto
      ctx.fillStyle = "#000000"
      ctx.fillText(textToShow, textX, textY)
    }
  }

  const resizeCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    drawComposition(canvas, ctx, customText)
  }

  useEffect(() => {
    resizeCanvas()

    const handleResize = () => {
      resizeCanvas()
    }

    const handleKeyPress = (e) => {
      if (e.key === 'r' || e.key === 'R') {
        const s = Math.floor(Math.random() * 1e7)
        setSeed(s)
      } else if (e.key === 's' || e.key === 'S') {
        savePng()
      } else if (e.key >= '1' && e.key <= '8') {
        const idx = parseInt(e.key, 10) - 1
        setPaletteIdx(idx)
      } else if (e.key === 't' || e.key === 'T') {
        const newText = prompt('Digite o texto (máx. 30 caracteres):', customText)
        if (newText !== null && newText.trim() !== '') {
          const limitedText = newText.substring(0, 30).toUpperCase()
          setCustomText(limitedText)
          if (typeof window !== 'undefined') {
            localStorage.setItem('bauhaus-custom-text', limitedText)
          }
        }
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [customText])

  // re-render composition when palette/seed/customText change
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      drawComposition(canvas, ctx, customText)
    }
  }, [paletteIdx, seed, customText])

  const onRegen = () => { setSeed(Math.floor(Math.random()*1e7)) }

  const savePng = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ts = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const name = `bauhaus_poster_${ts.getFullYear()}${pad(ts.getMonth()+1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}`

    const link = document.createElement('a')
    link.download = name + '.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const onSave = () => { savePng() }

  const onPalette = (idx) => { setPaletteIdx(idx) }

  const onEditText = () => {
    const newText = prompt('Digite o texto (máx. 30 caracteres):', customText)
    if (newText !== null && newText.trim() !== '') {
      const limitedText = newText.substring(0, 30).toUpperCase()
      setCustomText(limitedText)
      if (typeof window !== 'undefined') {
        localStorage.setItem('bauhaus-custom-text', limitedText)
      }
    }
  }

  return (
    <div className="fullscreen-container">
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh'
        }}
      />
      <div className="commands">
        <div className="command-item">R</div>
        <div className="command-item">S</div>
        <div className="command-item">T</div>
        <div className="command-item">1-8</div>
      </div>

      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        maxWidth: '200px'
      }}>
        <button onClick={onRegen} style={buttonStyle}>Regenerar</button>
        <button onClick={onSave} style={buttonStyle}>Salvar</button>
        <button onClick={onEditText} style={buttonStyle}>Editar Texto (T)</button>

      

        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {[0,1,2,3,4,5,6,7].map(idx => (
            <button
              key={idx}
              onClick={() => onPalette(idx)}
              style={{
                ...paletteButtonStyle,
                background: paletteIdx === idx ? '#007acc' : '#f0f0f0',
                color: paletteIdx === idx ? 'white' : 'black'
              }}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const buttonStyle = {
  padding: '8px 12px',
  border: 'none',
  borderRadius: '4px',
  background: '#007acc',
  color: 'white',
  cursor: 'pointer',
  fontSize: '12px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
}

const paletteButtonStyle = {
  padding: '6px 10px',
  border: '1px solid #ccc',
  borderRadius: '3px',
  cursor: 'pointer',
  fontSize: '11px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  minWidth: '25px'
}
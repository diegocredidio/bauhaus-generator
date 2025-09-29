'use client'
import { useEffect, useRef, useState } from 'react'

export default function BauhausPosterGenerator() {
  const holderRef = useRef(null)
  const p5ref = useRef(null)
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

  // Effect para garantir que a fonte Inter carregue
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Preload da fonte Inter
      const link = document.createElement('link')
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
      link.rel = 'stylesheet'
      if (!document.querySelector(`link[href="${link.href}"]`)) {
        document.head.appendChild(link)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !holderRef.current) return
    const P5 = window.p5
    if (!P5) return

    // Add resize listener
    const handleResize = () => {
      const p = p5ref.current
      if (p && p.resizeCanvas) {
        p.resizeCanvas(window.innerWidth, window.innerHeight)
        setTimeout(() => {
          if (p._composition) p._composition(seed)
        }, 50)
      }
    }
    
    window.addEventListener('resize', handleResize)

    // Paletas baseadas na imagem de referência do Bauhaus
    const PALETTES = [
      // Paleta 1 - Cores primárias clássicas
      {
        background: "#E8E8E8", // Cinza claro como na imagem
        colors: ["#FF0000", "#0066CC", "#FFD700", "#000000", "#FFFFFF", "#32CD32", "#FF7F00"]
      },
      // Paleta 2 - Tons terrosos
      {
        background: "#F5F5DC",
        colors: ["#8B4513", "#4682B4", "#DAA520", "#2F4F4F", "#FFFFFF", "#228B22", "#CD5C5C"]
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

    const sketch = (p) => {
      // helpers
      const bgcol = () => p.color(248)
      
      const composition = (rseed=1) => {
        p.randomSeed(rseed)
        p.background(bgcol())
        
        const palette = PALETTES[paletteIdx % PALETTES.length]
        p.background(palette.background)
        
        // pickCol function with current palette
        const pickCol = (k) => {
          const c = palette.colors[k % palette.colors.length]
          return p.color(c)
        }
        
        // Formas geométricas baseadas na imagem de referência
        const drawSquare = (x, y, size, color) => {
          p.fill(color)
          p.noStroke()
          p.rect(x, y, size, size)
        }

        const drawTriangleTopLeft = (x, y, size, color) => {
          p.fill(color)
          p.noStroke()
          p.triangle(x, y, x + size, y, x, y + size)
        }

        const drawTriangleTopRight = (x, y, size, color) => {
          p.fill(color)
          p.noStroke()
          p.triangle(x, y, x + size, y, x + size, y + size)
        }

        const drawTriangleBottomLeft = (x, y, size, color) => {
          p.fill(color)
          p.noStroke()
          p.triangle(x, y, x, y + size, x + size, y + size)
        }

        const drawTriangleBottomRight = (x, y, size, color) => {
          p.fill(color)
          p.noStroke()
          p.triangle(x + size, y, x, y + size, x + size, y + size)
        }

        const drawSemicircleTop = (x, y, size, color) => {
          p.fill(color)
          p.noStroke()
          p.arc(x + size/2, y + size, size, size, p.PI, p.TWO_PI)
        }

        const drawSemircleBottom = (x, y, size, color) => {
          p.fill(color)
          p.noStroke()
          p.arc(x + size/2, y, size, size, 0, p.PI)
        }

        const drawSemicircleLeft = (x, y, size, color) => {
          p.fill(color)
          p.noStroke()
          p.arc(x + size, y + size/2, size, size, p.PI/2, p.PI + p.PI/2)
        }

        const drawSemicircleRight = (x, y, size, color) => {
          p.fill(color)
          p.noStroke()
          p.arc(x, y + size/2, size, size, -p.PI/2, p.PI/2)
        }

        const drawQuarterCircleTopLeft = (x, y, size, color) => {
          p.fill(color)
          p.noStroke()
          p.arc(x + size, y + size, size * 2, size * 2, p.PI, p.PI + p.PI/2)
        }

        const drawQuarterCircleTopRight = (x, y, size, color) => {
          p.fill(color)
          p.noStroke()
          p.arc(x, y + size, size * 2, size * 2, p.PI + p.PI/2, p.TWO_PI)
        }

        const drawQuarterCircleBottomLeft = (x, y, size, color) => {
          p.fill(color)
          p.noStroke()
          p.arc(x + size, y, size * 2, size * 2, p.PI/2, p.PI)
        }

        const drawQuarterCircleBottomRight = (x, y, size, color) => {
          p.fill(color)
          p.noStroke()
          p.arc(x, y, size * 2, size * 2, 0, p.PI/2)
        }
        
        // Grid system uniforme como na imagem de referência
        const GRID_SIZE = 60 // Tamanho fixo para uniformidade
        const COLS = Math.floor(p.width / GRID_SIZE)
        const ROWS = Math.floor(p.height / GRID_SIZE)

        // Densidade mais alta para preencher melhor o espaço
        const DENSITY = 0.85

        // Generate composition similar to reference image
        for (let row = 0; row < ROWS; row++) {
          for (let col = 0; col < COLS; col++) {
            const x = col * GRID_SIZE
            const y = row * GRID_SIZE

            // Alta chance de preencher cada célula
            if (p.random(1) < DENSITY) {
              const colorIdx = Math.floor(p.random(palette.colors.length))
              const color = pickCol(colorIdx)

              // Array de todas as formas disponíveis
              const shapeTypes = [
                () => drawSquare(x, y, GRID_SIZE, color),
                () => drawTriangleTopLeft(x, y, GRID_SIZE, color),
                () => drawTriangleTopRight(x, y, GRID_SIZE, color),
                () => drawTriangleBottomLeft(x, y, GRID_SIZE, color),
                () => drawTriangleBottomRight(x, y, GRID_SIZE, color),
                () => drawSemicircleTop(x, y, GRID_SIZE, color),
                () => drawSemircleBottom(x, y, GRID_SIZE, color),
                () => drawSemicircleLeft(x, y, GRID_SIZE, color),
                () => drawSemicircleRight(x, y, GRID_SIZE, color),
                () => drawQuarterCircleTopLeft(x, y, GRID_SIZE, color),
                () => drawQuarterCircleTopRight(x, y, GRID_SIZE, color),
                () => drawQuarterCircleBottomLeft(x, y, GRID_SIZE, color),
                () => drawQuarterCircleBottomRight(x, y, GRID_SIZE, color)
              ]

              // Escolher uma forma aleatoriamente
              const randomShape = p.random(shapeTypes)
              randomShape()
            }
          }
        }
        
        // Texto "BAUHAUS" com especificações exatas
        if (p.random(1) < 0.9) { // 90% de chance de mostrar o texto
          // Posição aleatória mas com margens
          const margin = 100
          const textX = p.random(margin, p.width - margin)
          const textY = p.random(margin, p.height - margin)

          // Configurar fonte personalizada
          p.textAlign(p.CENTER, p.CENTER)
          p.textSize(36)
          // Usar uma lista de fontes como fallback
          p.textFont('Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif')
          p.textStyle(p.BOLD)

          // Medir texto para criar fundo
          const textWidth = p.textWidth(customText)
          const textHeight = 36
          const padding = 30

          // Fundo branco com padding de 30px
          p.fill("#FFFFFF")
          p.noStroke()
          p.rect(
            textX - textWidth/2 - padding,
            textY - textHeight/2 - padding,
            textWidth + padding * 2,
            textHeight + padding * 2
          )

          // Texto preto
          p.fill("#000000")
          p.text(customText, textX, textY)
        }
      }

      p.setup = () => {
        const c = p.createCanvas(window.innerWidth, window.innerHeight)
        c.parent(holderRef.current)
        p.noLoop()
        composition(seed)
      }

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight)
        setTimeout(() => {
          composition(seed)
        }, 10)
      }

      p.keyPressed = () => {
        if (p.key === 'r' || p.key === 'R') {
          const s = Math.floor(Math.random() * 1e7)
          setSeed(s)
        } else if (p.key === 's' || p.key === 'S') {
          savePng(p)
        } else if (p.key >= '1' && p.key <= '8') {
          const idx = parseInt(p.key, 10) - 1
          setPaletteIdx(idx)
        } else if (p.key === 't' || p.key === 'T') {
          // Abrir caixa de diálogo para editar texto
          const newText = prompt('Digite o texto (máx. 30 caracteres):', customText)
          if (newText !== null && newText.trim() !== '') {
            const limitedText = newText.substring(0, 30).toUpperCase()
            setCustomText(limitedText)
            // Salvar no localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('bauhaus-custom-text', limitedText)
            }
            // Forçar re-render imediatamente
            setTimeout(() => {
              if (p._composition) p._composition(seed)
            }, 100)
          }
        }
      }

      // expose to instance
      p._composition = composition
      p._savePng = () => savePng(p)
    }

    // instantiate
    const instance = new P5(sketch)
    p5ref.current = instance

    return () => {
      window.removeEventListener('resize', handleResize)
      try { instance.remove() } catch (_) {}
      p5ref.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holderRef])

  // re-render composition when palette/seed/customText change
  useEffect(() => {
    const p = p5ref.current
    if (p && p._composition) p._composition(seed)
  }, [paletteIdx, seed, customText])

  const onRegen = () => { setSeed(Math.floor(Math.random()*1e7)) }
  const onSave = () => { const p = p5ref.current; if (p && p._savePng) p._savePng() }
  const onPalette = (idx) => { setPaletteIdx(idx) }
  const onEditText = () => {
    const newText = prompt('Digite o texto (máx. 30 caracteres):', customText)
    if (newText !== null && newText.trim() !== '') {
      const limitedText = newText.substring(0, 30).toUpperCase()
      setCustomText(limitedText)
      if (typeof window !== 'undefined') {
        localStorage.setItem('bauhaus-custom-text', limitedText)
      }
      // Forçar re-render
      const p = p5ref.current
      if (p && p._composition) {
        setTimeout(() => p._composition(seed), 100)
      }
    }
  }

  return (
    <div className="fullscreen-container">
      <div id="canvas-holder" ref={holderRef} />
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

        <div style={{ width: '100%', fontSize: '12px', color: '#666', marginTop: '10px' }}>
          Paletas (ou teclas 1-8):
        </div>

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
  fontFamily: 'Inter, sans-serif'
}

const paletteButtonStyle = {
  padding: '6px 10px',
  border: '1px solid #ccc',
  borderRadius: '3px',
  cursor: 'pointer',
  fontSize: '11px',
  fontFamily: 'Inter, sans-serif',
  minWidth: '25px'
}

function savePng(p) {
  const ts = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const name = `bauhaus_poster_${ts.getFullYear()}${pad(ts.getMonth()+1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}`
  p.saveCanvas(name, 'png')
}

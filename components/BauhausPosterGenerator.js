'use client'
import { useEffect, useRef, useState } from 'react'

export default function BauhausPosterGenerator() {
  const holderRef = useRef(null)
  const p5ref = useRef(null)
  const [paletteIdx, setPaletteIdx] = useState(0)
  const [seed, setSeed] = useState(12345)

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

    // Paletas autênticamente inspiradas no Bauhaus
    const PALETTES = [
      // Paleta Bauhaus Clássica - Cores primárias + preto/branco
      {
        background: "#FFFFFF",
        colors: ["#FF0000", "#0000FF", "#FFFF00", "#000000", "#E5E5E5"]
      },
      // Paleta Kandinsky - Vermelho dominante
      {
        background: "#DC143C",
        colors: ["#FFFFFF", "#000000", "#FFD700", "#4169E1", "#228B22"]
      },
      // Paleta Paul Klee - Tons terrosos e vibrantes
      {
        background: "#F5F5DC", // Bege
        colors: ["#B22222", "#4682B4", "#DAA520", "#2F4F4F", "#8B4513"]
      },
      // Paleta De Stijl - Minimalista geométrica
      {
        background: "#000000",
        colors: ["#FF0000", "#0000FF", "#FFFF00", "#FFFFFF", "#808080"]
      },
      // Paleta Construtivista - Vermelho revolução
      {
        background: "#FFFFFF",
        colors: ["#DC143C", "#000000", "#FFD700", "#4A4A4A", "#8B0000"]
      },
      // Paleta Itten - Círculo cromático
      {
        background: "#2F2F2F",
        colors: ["#FF4500", "#1E90FF", "#32CD32", "#FFFFFF", "#9370DB"]
      },
      // Paleta Monocromática Industrial
      {
        background: "#F0F0F0",
        colors: ["#1C1C1C", "#404040", "#808080", "#B0B0B0", "#E0E0E0"]
      },
      // Paleta Expressionista
      {
        background: "#1A1A1A",
        colors: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFFFFF"]
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
        
        // Formas geométricas básicas
        const drawSquare = (x, y, size, color) => {
          p.fill(color)
          p.noStroke()
          p.rect(x, y, size, size)
        }
        
        const drawTriangle = (x, y, size, color) => {
          p.fill(color)
          p.noStroke()
          p.triangle(x, y, x + size, y, x + size/2, y + size)
        }
        
        const drawQuarterCircle = (x, y, size, color, corner = 0) => {
          p.fill(color)
          p.noStroke()
          // Ajuste na posição do arco baseado no canto
          let arcX = x, arcY = y
          switch(corner) {
            case 0: arcX = x; arcY = y; break  // Canto superior esquerdo
            case 1: arcX = x + size; arcY = y; break  // Canto superior direito
            case 2: arcX = x + size; arcY = y + size; break  // Canto inferior direito
            case 3: arcX = x; arcY = y + size; break  // Canto inferior esquerdo
          }
          p.arc(arcX, arcY, size * 2, size * 2, corner * p.PI/2, (corner + 1) * p.PI/2)
        }
        
        const drawRectangle = (x, y, w, h, color) => {
          p.fill(color)
          p.noStroke()
          p.rect(x, y, w, h)
        }
        
        // Grid system aprimorado
        const GRID_SIZE = p.random(30, 60) // Tamanho variável do grid
        const COLS = Math.floor(p.width / GRID_SIZE)
        const ROWS = Math.floor(p.height / GRID_SIZE)
        const DENSITY = p.random(0.3, 0.7) // Densidade variável de elementos

        // Generate random composition with improved grid logic
        for (let row = 0; row < ROWS; row++) {
          for (let col = 0; col < COLS; col++) {
            const gridX = col * GRID_SIZE
            const gridY = row * GRID_SIZE

            // Random chance to place a shape based on density
            if (p.random(1) < DENSITY) {
              const shapeType = Math.floor(p.random(5)) // Adicionado mais um tipo
              const colorIdx = Math.floor(p.random(palette.colors.length))
              const color = pickCol(colorIdx)

              // Aleatoriedade dentro da célula do grid
              const offsetX = p.random(-GRID_SIZE * 0.1, GRID_SIZE * 0.1)
              const offsetY = p.random(-GRID_SIZE * 0.1, GRID_SIZE * 0.1)
              const x = gridX + offsetX
              const y = gridY + offsetY

              // Variação no tamanho (80% a 120% do grid)
              const sizeVariation = p.random(0.8, 1.2)
              const shapeSize = GRID_SIZE * sizeVariation

              switch (shapeType) {
                case 0: // Square
                  drawSquare(x, y, shapeSize, color)
                  break
                case 1: // Triangle
                  drawTriangle(x, y, shapeSize, color)
                  break
                case 2: // Quarter Circle
                  const corner = Math.floor(p.random(4))
                  drawQuarterCircle(x, y, shapeSize/2, color, corner)
                  break
                case 3: // Rectangle (horizontal or vertical)
                  if (p.random(1) < 0.5) {
                    drawRectangle(x, y, shapeSize, shapeSize/2, color)
                  } else {
                    drawRectangle(x, y, shapeSize/2, shapeSize, color)
                  }
                  break
                case 4: // Círculo completo (novo)
                  p.fill(color)
                  p.noStroke()
                  p.ellipse(x + shapeSize/2, y + shapeSize/2, shapeSize * 0.8)
                  break
              }
            }
          }
        }
        
        // Elementos maiores organizados no grid principal
        const LARGE_GRID_COLS = 3
        const LARGE_GRID_ROWS = 2
        const LARGE_CELL_WIDTH = p.width / LARGE_GRID_COLS
        const LARGE_CELL_HEIGHT = p.height / LARGE_GRID_ROWS

        const numLargeShapes = Math.floor(2 + p.random(3))

        for (let i = 0; i < numLargeShapes; i++) {
          // Escolher célula aleatoriamente
          const cellCol = Math.floor(p.random(LARGE_GRID_COLS))
          const cellRow = Math.floor(p.random(LARGE_GRID_ROWS))

          const cellX = cellCol * LARGE_CELL_WIDTH
          const cellY = cellRow * LARGE_CELL_HEIGHT

          // Posição aleatória dentro da célula
          const size = p.random(80, Math.min(LARGE_CELL_WIDTH, LARGE_CELL_HEIGHT) * 0.6)
          const x = cellX + p.random(LARGE_CELL_WIDTH - size)
          const y = cellY + p.random(LARGE_CELL_HEIGHT - size)

          const colorIdx = Math.floor(p.random(palette.colors.length))
          const color = pickCol(colorIdx)

          // Adicionar transparência para sobreposição interessante
          color.setAlpha(180)

          const shapeType = Math.floor(p.random(4))
          switch (shapeType) {
            case 0:
              drawSquare(x, y, size, color)
              break
            case 1:
              drawTriangle(x, y, size, color)
              break
            case 2:
              const corner = Math.floor(p.random(4))
              drawQuarterCircle(x, y, size/2, color, corner)
              break
            case 3:
              p.fill(color)
              p.noStroke()
              p.ellipse(x + size/2, y + size/2, size)
              break
          }
        }
        
        // Texto "BAUHAUS" posicionado no grid
        if (p.random(1) < 0.8) { // 80% de chance de mostrar o texto
          // Escolher uma célula do grid para o texto
          const textCellCol = Math.floor(p.random(LARGE_GRID_COLS))
          const textCellRow = Math.floor(p.random(LARGE_GRID_ROWS))

          const textCellX = textCellCol * LARGE_CELL_WIDTH
          const textCellY = textCellRow * LARGE_CELL_HEIGHT

          const textX = textCellX + LARGE_CELL_WIDTH/2
          const textY = textCellY + LARGE_CELL_HEIGHT/2

          p.textAlign(p.CENTER, p.CENTER)
          p.textSize(p.random(24, 42))
          p.textFont('Arial, sans-serif')

          // Fundo do texto para contraste
          p.fill(palette.background)
          p.noStroke()
          p.rect(textX - 80, textY - 25, 160, 50)

          // Texto principal
          p.fill(palette.colors[0])
          p.text("BAUHAUS", textX, textY)
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
          composition(s)
        } else if (p.key === 's' || p.key === 'S') {
          savePng(p)
        } else if (p.key >= '1' && p.key <= '8') {
          const idx = parseInt(p.key, 10) - 1
          setPaletteIdx(idx)
          composition(seed)
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

  // re-render composition when palette/seed change
  useEffect(() => {
    const p = p5ref.current
    if (p && p._composition) p._composition(seed)
  }, [paletteIdx, seed])

  const onRegen = () => { setSeed(Math.floor(Math.random()*1e7)) }
  const onSave = () => { const p = p5ref.current; if (p && p._savePng) p._savePng() }

  return (
    <div className="fullscreen-container">
      <div id="canvas-holder" ref={holderRef} />
      <div className="commands">
        <div className="command-item">R</div>
        <div className="command-item">S</div>
        <div className="command-item">1-8</div>
      </div>
    </div>
  )
}

function savePng(p) {
  const ts = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const name = `bauhaus_poster_${ts.getFullYear()}${pad(ts.getMonth()+1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}`
  p.saveCanvas(name, 'png')
}

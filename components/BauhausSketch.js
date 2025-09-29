'use client'
import { useEffect, useRef, useState } from 'react'

export default function BauhausSketch() {
  const holderRef = useRef(null)
  const p5ref = useRef(null)
  const [paletteIdx, setPaletteIdx] = useState(0)
  const [multiplyMode, setMultiplyMode] = useState(false)
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

    // constants
    const MARGIN = 80
    const LINES = 6
    const BAND = 16
    const GAP = 10
    const STEP = BAND + GAP
    const ALPHA = 220

    const PALETTES = [
      // Paleta Bauhaus Clássica - Cores primárias + preto
      ["#FF0000", "#0000FF", "#FFFF00", "#000000", "#FFFFFF"],
      // Paleta Kandinsky - Inspirada nas obras de Wassily Kandinsky
      ["#DC143C", "#4169E1", "#FFD700", "#228B22", "#9370DB"],
      // Paleta Klee - Inspirada em Paul Klee
      ["#B22222", "#4682B4", "#DAA520", "#2F4F4F", "#DDA0DD"],
      // Paleta Itten - Baseada na teoria das cores de Johannes Itten
      ["#FF4500", "#1E90FF", "#32CD32", "#8B0000", "#4B0082"],
      // Paleta Construtivista - Vermelho, preto e branco dominantes
      ["#DC143C", "#000000", "#FFFFFF", "#696969", "#FF6347"],
      // Paleta De Stijl - Influência do movimento holandês
      ["#FF0000", "#0000FF", "#FFFF00", "#000000", "#C0C0C0"],
      // Paleta Minimalista Bauhaus
      ["#2F2F2F", "#E74C3C", "#F39C12", "#FFFFFF", "#95A5A6"],
      // Paleta Monocromática Industrial
      ["#1C1C1C", "#3D3D3D", "#5E5E5E", "#808080", "#A1A1A1"]
    ]

    const sketch = (p) => {
      // helpers
      const bgcol = () => p.color(248)
      const maskRect = (x, y, w, h) => { p.noStroke(); p.fill(bgcol()); p.rect(x, y, w, h) }
      const composition = (rseed=1) => {
        p.randomSeed(rseed); p.noiseSeed(rseed)
        p.background(bgcol())
        p.blendMode(multiplyMode ? p.MULTIPLY : p.BLEND)
        
        // pickCol function with current paletteIdx
        const pickCol = (k) => {
          const cols = PALETTES[paletteIdx % PALETTES.length]
          const c = cols[k % cols.length]
          const cc = p.color(c)
          cc.setAlpha(ALPHA)
          return cc
        }
        
        // Local functions with access to pickCol
        const racetrackStack = (x, y, w, h, lines=LINES, band=BAND, gap=GAP) => {
          p.strokeCap(p.ROUND)
          p.noFill()
          const radius = h / 2
          for (let i = 0; i < lines; i++) {
            const inset = i * (band + gap)
            if (w - 2*inset <= 0 || h - 2*inset <= 0) break
            p.strokeWeight(band)
            p.stroke(pickCol(i))
            p.rect(x + inset, y + inset, w - 2*inset, h - 2*inset, Math.max(0, radius - inset))
          }
        }
        
        const motif_U = (x, y, w, h, dir="down") => {
          racetrackStack(x, y, w, h)
          if (dir === "down") maskRect(x - w, -p.height, 3*w, y + h/2)
          else if (dir === "up") maskRect(x - w, y + h/2, 3*w, p.height)
          else if (dir === "right") maskRect(x - p.width, y - h, x + w/2 + p.width, 3*h)
          else if (dir === "left")  maskRect(x + w/2, y - h, p.width, 3*h)
        }
        
        const motif_D = (x, y, w, h, facing="right") => {
          racetrackStack(x, y, w, h)
          if (facing === "right") maskRect(x - p.width, y, w/2, h)
          else maskRect(x + w/2, y, p.width, h)
        }
        
        const motif_P = (x, y, w, h, facing="right") => {
          racetrackStack(x, y, w, h)
          if (facing === "right") {
            maskRect(x - p.width, y, w*0.35, h)
            maskRect(x + w*0.65, y, p.width, h)
            maskRect(x, y + h*0.55, w, h)
          } else {
            maskRect(x + w*0.65, y, p.width, h)
            maskRect(x - p.width, y, w*0.35, h)
            maskRect(x, y + h*0.55, w, h)
          }
        }
        
        const motif_J = (x, y, w, h, dir="left") => {
          motif_U(x, y, w, h, "down")
          if (dir === "left")  maskRect(x + w*0.55, y - h, p.width, 3*h)
          else                 maskRect(x - p.width, y - h, w*0.45 + p.width, 3*h)
        }
        
        const motifRibbonBar = (x, y, w, h, orient="h") => {
          p.noFill(); p.strokeCap(p.ROUND)
          for (let i = 0; i < LINES; i++) {
            p.strokeWeight(BAND); p.stroke(pickCol(i))
            if (orient === "h") {
              const y0 = y + i * STEP; p.line(x, y0, x + w, y0)
            } else {
              const x0 = x + i * STEP; p.line(x0, y, x0, y + h)
            }
          }
        }

        const gw = (p.width - 2*MARGIN)
        const gh = (p.height - 2*MARGIN)

        // Sistema de grid para organização dos elementos
        const GRID_COLS = 4
        const GRID_ROWS = 3
        const CELL_WIDTH = gw / GRID_COLS
        const CELL_HEIGHT = gh / GRID_ROWS

        const blocks = []
        const nMain = Math.floor(4 + p.random(3)) // Mais elementos para preencher o grid

        // Criar um array de células disponíveis
        const availableCells = []
        for (let row = 0; row < GRID_ROWS; row++) {
          for (let col = 0; col < GRID_COLS; col++) {
            availableCells.push({ row, col })
          }
        }
        p.shuffle(availableCells, true)

        for (let i = 0; i < nMain && i < availableCells.length; i++) {
          const cell = availableCells[i]
          const cellX = MARGIN + cell.col * CELL_WIDTH
          const cellY = MARGIN + cell.row * CELL_HEIGHT

          // Tamanho variável dentro da célula (60% a 90% do tamanho da célula)
          const sizeFactor = 0.6 + p.random(0.3)
          const w_ = CELL_WIDTH * sizeFactor
          const h_ = CELL_HEIGHT * sizeFactor

          // Posição aleatória dentro da célula
          const maxOffsetX = CELL_WIDTH - w_
          const maxOffsetY = CELL_HEIGHT - h_
          const x = cellX + p.random(maxOffsetX)
          const y = cellY + p.random(maxOffsetY)

          blocks.push([x, y, w_, h_])
        }

        for (const b of blocks) {
          const [x, y, w_, h_] = b
          const kind = Math.floor(p.random(4))
          const shouldRotate = p.random(1) < 0.4 // 40% chance of rotation
          
          if (shouldRotate) {
            p.push()
            p.translate(x + w_/2, y + h_/2)
            p.rotate(p.PI/4) // 45 degrees
            p.translate(-w_/2, -h_/2)
          }
          
          if (kind === 0) {
            const dirs = ["down","up","left","right"]
            motif_U(shouldRotate ? 0 : x, shouldRotate ? 0 : y, w_, h_, p.random(dirs))
          } else if (kind === 1) {
            motif_D(shouldRotate ? 0 : x, shouldRotate ? 0 : y, w_, h_, p.random(1) < 0.5 ? "right" : "left")
          } else if (kind === 2) {
            motif_P(shouldRotate ? 0 : x, shouldRotate ? 0 : y, w_, h_, p.random(1) < 0.5 ? "right" : "left")
          } else {
            motif_J(shouldRotate ? 0 : x, shouldRotate ? 0 : y, w_, h_, p.random(1) < 0.5 ? "left" : "right")
          }
          
          if (shouldRotate) {
            p.pop()
          }
        }

        // Barras organizadas no grid
        const nBars = Math.floor(1 + p.random(2))
        const barCells = availableCells.slice(nMain, nMain + nBars)

        for (let i = 0; i < barCells.length; i++) {
          const cell = barCells[i]
          const cellX = MARGIN + cell.col * CELL_WIDTH
          const cellY = MARGIN + cell.row * CELL_HEIGHT

          const shouldRotateBar = p.random(1) < 0.3

          if (shouldRotateBar) {
            p.push()
            p.translate(cellX + CELL_WIDTH/2, cellY + CELL_HEIGHT/2)
            p.rotate(p.PI/4)
            p.translate(-CELL_WIDTH/2, -CELL_HEIGHT/2)
          }

          // Barras que se adaptam ao tamanho da célula
          if (p.random(1) < 0.5) {
            // Barra horizontal
            const barY = shouldRotateBar ? CELL_HEIGHT * 0.2 + p.random(CELL_HEIGHT * 0.6) :
                        cellY + CELL_HEIGHT * 0.2 + p.random(CELL_HEIGHT * 0.6)
            const barX = shouldRotateBar ? 0 : cellX
            const barWidth = shouldRotateBar ? CELL_WIDTH : CELL_WIDTH * 0.9
            motifRibbonBar(barX, barY, barWidth, 0, "h")
          } else {
            // Barra vertical
            const barX = shouldRotateBar ? CELL_WIDTH * 0.2 + p.random(CELL_WIDTH * 0.6) :
                        cellX + CELL_WIDTH * 0.2 + p.random(CELL_WIDTH * 0.6)
            const barY = shouldRotateBar ? 0 : cellY
            const barHeight = shouldRotateBar ? CELL_HEIGHT : CELL_HEIGHT * 0.9
            motifRibbonBar(barX, barY, 0, barHeight, "v")
          }

          if (shouldRotateBar) {
            p.pop()
          }
        }

        // Borda externa
        p.noFill(); p.stroke(220); p.strokeWeight(2)
        p.rect(MARGIN/2, MARGIN/2, p.width - MARGIN, p.height - MARGIN)

        // Linhas de grid opcionais (sutil)
        if (p.random(1) < 0.3) { // 30% chance de mostrar o grid
          p.stroke(240); p.strokeWeight(0.5)
          for (let i = 1; i < GRID_COLS; i++) {
            const x = MARGIN + i * CELL_WIDTH
            p.line(x, MARGIN, x, p.height - MARGIN)
          }
          for (let i = 1; i < GRID_ROWS; i++) {
            const y = MARGIN + i * CELL_HEIGHT
            p.line(MARGIN, y, p.width - MARGIN, y)
          }
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
        // Small delay to ensure canvas is properly resized
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
        } else if (p.key === 'm' || p.key === 'M') {
          setMultiplyMode(v => !v)
        }
      }

      // expose to instance for buttons
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

  // re-render composition when palette/mode/seed change (after instance exists)
  useEffect(() => {
    const p = p5ref.current
    if (p && p._composition) p._composition(seed)
  }, [paletteIdx, multiplyMode, seed])

  const onRegen = () => { setSeed(Math.floor(Math.random()*1e7)) }
  const onSave = () => { const p = p5ref.current; if (p && p._savePng) p._savePng() }
  const onBlend = () => setMultiplyMode(v => !v)
  const onPalette = (idx) => { setPaletteIdx(idx) }

  return (
    <div className="fullscreen-container">
      <div id="canvas-holder" ref={holderRef} />
      <div className="commands">
        <div className="command-item">R</div>
        <div className="command-item">M</div>
        <div className="command-item">S</div>
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
        <button
          onClick={onBlend}
          style={{
            ...buttonStyle,
            background: multiplyMode ? '#ff6b35' : '#007acc'
          }}
        >
          {multiplyMode ? 'Blend Normal' : 'Blend Multiply'}
        </button>

        

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

function savePng(p) {
  const ts = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const name = `bauhaus_${ts.getFullYear()}${pad(ts.getMonth()+1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}`
  p.saveCanvas(name, 'png')
}

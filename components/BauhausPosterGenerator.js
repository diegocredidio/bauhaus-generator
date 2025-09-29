'use client'
import { useEffect, useRef, useState } from 'react'

export default function BauhausPosterGenerator() {
  const canvasRef = useRef(null)
  const [paletteIdx, setPaletteIdx] = useState(0)
  const [seed, setSeed] = useState(12345)
  const [customText, setCustomText] = useState('BAUHAUS')
  const [shapes, setShapes] = useState([]) // Array para armazenar todas as formas
  const [hoveredShape, setHoveredShape] = useState(null) // Forma sendo hovered
  const [hiddenShapes, setHiddenShapes] = useState(new Set()) // Formas clicadas (permanentemente ocultas)
  const [isDragging, setIsDragging] = useState(false) // Estado do drag
  const [fadingShapes, setFadingShapes] = useState(new Map()) // Formas em animação de fade

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

    // Array para armazenar as formas desta composição
    const currentShapes = []

    // pickCol function with current palette
    const pickCol = (k) => {
      if (!palette || !palette.colors || palette.colors.length === 0) {
        return "#000000" // fallback color
      }
      return palette.colors[k % palette.colors.length]
    }

    // Função para encontrar forma sob o cursor
    const getShapeAtPosition = (mouseX, mouseY) => {
      for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i]
        if (mouseX >= shape.x && mouseX <= shape.x + shape.size &&
            mouseY >= shape.y && mouseY <= shape.y + shape.size) {
          return shape
        }
      }
      return null
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

          // ID único para cada forma
          const shapeId = `${row}-${col}`

          // Verificar se esta forma está sendo hovered
          const isHovered = hoveredShape?.id === shapeId
          const fadeValue = hoveredShape?.fadeValue || 1

          // Escolher tipo de forma
          const shapeTypeIdx = Math.floor(seededRandom() * 13)

          // Armazenar informações da forma
          const shapeInfo = {
            id: shapeId,
            x, y,
            size: GRID_SIZE,
            color,
            type: shapeTypeIdx,
            bounds: { x, y, width: GRID_SIZE, height: GRID_SIZE }
          }
          currentShapes.push(shapeInfo)

          // Verificar se a forma está em animação de fade
          const fadeInfo = fadingShapes.get(shapeId)

          // Não desenhar se estiver permanentemente oculta
          if (hiddenShapes.has(shapeId) && (!fadeInfo || fadeInfo.type !== 'fadeIn')) continue

          // Aplicar transparência baseada no estado
          let alpha = 1
          if (isHovered) {
            alpha = fadeValue
          } else if (fadeInfo) {
            alpha = fadeInfo.alpha
            if (fadeInfo.alpha <= 0 && fadeInfo.type === 'fadeOut') {
              // Shape completamente invisível durante fade out
              continue
            }
          }

          ctx.globalAlpha = alpha

          // Desenhar a forma baseada no tipo
          ctx.fillStyle = color
          switch(shapeTypeIdx) {
            case 0: // Square
              ctx.fillRect(x, y, GRID_SIZE, GRID_SIZE)
              break
            case 1: // Triangle top left
              ctx.beginPath()
              ctx.moveTo(x, y)
              ctx.lineTo(x + GRID_SIZE, y)
              ctx.lineTo(x, y + GRID_SIZE)
              ctx.closePath()
              ctx.fill()
              break
            case 2: // Triangle top right
              ctx.beginPath()
              ctx.moveTo(x, y)
              ctx.lineTo(x + GRID_SIZE, y)
              ctx.lineTo(x + GRID_SIZE, y + GRID_SIZE)
              ctx.closePath()
              ctx.fill()
              break
            case 3: // Triangle bottom left
              ctx.beginPath()
              ctx.moveTo(x, y)
              ctx.lineTo(x, y + GRID_SIZE)
              ctx.lineTo(x + GRID_SIZE, y + GRID_SIZE)
              ctx.closePath()
              ctx.fill()
              break
            case 4: // Triangle bottom right
              ctx.beginPath()
              ctx.moveTo(x + GRID_SIZE, y)
              ctx.lineTo(x, y + GRID_SIZE)
              ctx.lineTo(x + GRID_SIZE, y + GRID_SIZE)
              ctx.closePath()
              ctx.fill()
              break
            case 5: // Semicircle top
              ctx.beginPath()
              ctx.arc(x + GRID_SIZE/2, y + GRID_SIZE, GRID_SIZE/2, Math.PI, 2 * Math.PI)
              ctx.fill()
              break
            case 6: // Semicircle bottom
              ctx.beginPath()
              ctx.arc(x + GRID_SIZE/2, y, GRID_SIZE/2, 0, Math.PI)
              ctx.fill()
              break
            case 7: // Semicircle left
              ctx.beginPath()
              ctx.arc(x + GRID_SIZE, y + GRID_SIZE/2, GRID_SIZE/2, Math.PI/2, Math.PI + Math.PI/2)
              ctx.fill()
              break
            case 8: // Semicircle right
              ctx.beginPath()
              ctx.arc(x, y + GRID_SIZE/2, GRID_SIZE/2, -Math.PI/2, Math.PI/2)
              ctx.fill()
              break
            case 9: // Quarter circle top left
              ctx.beginPath()
              ctx.arc(x + GRID_SIZE, y + GRID_SIZE, GRID_SIZE, Math.PI, Math.PI + Math.PI/2)
              ctx.fill()
              break
            case 10: // Quarter circle top right
              ctx.beginPath()
              ctx.arc(x, y + GRID_SIZE, GRID_SIZE, Math.PI + Math.PI/2, 2 * Math.PI)
              ctx.fill()
              break
            case 11: // Quarter circle bottom left
              ctx.beginPath()
              ctx.arc(x + GRID_SIZE, y, GRID_SIZE, Math.PI/2, Math.PI)
              ctx.fill()
              break
            case 12: // Quarter circle bottom right
              ctx.beginPath()
              ctx.arc(x, y, GRID_SIZE, 0, Math.PI/2)
              ctx.fill()
              break
          }

          // Resetar transparência
          ctx.globalAlpha = 1
        }
      }
    }

    // Atualizar array de formas
    setShapes(currentShapes)

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

  // Função para animar fade out de uma forma
  const animateFadeOut = (shapeId) => {
    const animate = () => {
      setFadingShapes(prev => {
        const current = prev.get(shapeId) || { alpha: 1, type: 'fadeOut' }
        const newAlpha = Math.max(0, current.alpha - 0.08)

        const newMap = new Map(prev)
        if (newAlpha <= 0) {
          newMap.delete(shapeId)
          // Adicionar à lista de ocultos após fade completo
          setHiddenShapes(prev => new Set(prev).add(shapeId))
        } else {
          newMap.set(shapeId, { alpha: newAlpha, type: 'fadeOut' })
          requestAnimationFrame(animate)
        }
        return newMap
      })
    }
    requestAnimationFrame(animate)
  }

  // Função para animar fade in de uma forma
  const animateFadeIn = (shapeId) => {
    // Remover da lista de ocultos imediatamente para começar a desenhar
    setHiddenShapes(prev => {
      const newSet = new Set(prev)
      newSet.delete(shapeId)
      return newSet
    })

    const animate = () => {
      setFadingShapes(prev => {
        const current = prev.get(shapeId) || { alpha: 0, type: 'fadeIn' }
        const newAlpha = Math.min(1, current.alpha + 0.08)

        const newMap = new Map(prev)
        if (newAlpha >= 1) {
          newMap.delete(shapeId)
        } else {
          newMap.set(shapeId, { alpha: newAlpha, type: 'fadeIn' })
          requestAnimationFrame(animate)
        }
        return newMap
      })
    }
    requestAnimationFrame(animate)
  }

  useEffect(() => {
    resizeCanvas()

    let hoverTimeout = null
    let fadeAnimation = null

    const handleResize = () => {
      resizeCanvas()
    }

    const handleMouseDown = (e) => {
      if (e.button === 0) { // Botão esquerdo
        setIsDragging(true)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const handleMouseMove = (e) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Encontrar forma sob o cursor
      let foundShape = null
      for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i]
        if (mouseX >= shape.x && mouseX <= shape.x + shape.size &&
            mouseY >= shape.y && mouseY <= shape.y + shape.size &&
            !hiddenShapes.has(shape.id)) {
          foundShape = shape
          break
        }
      }

      // Se está arrastando e há forma sob o cursor, desaparecer com fade
      if (isDragging && foundShape && !hiddenShapes.has(foundShape.id)) {
        animateFadeOut(foundShape.id)
        return
      }

      // Lógica de hover existente
      if (!isDragging && foundShape && (!hoveredShape || hoveredShape.id !== foundShape.id)) {
        // Iniciar fade out
        if (fadeAnimation) cancelAnimationFrame(fadeAnimation)
        if (hoverTimeout) clearTimeout(hoverTimeout)

        let fadeValue = 1
        const fadeOut = () => {
          fadeValue -= 0.05
          if (fadeValue <= 0) {
            fadeValue = 0
            // Após 3 segundos, fade in
            hoverTimeout = setTimeout(() => {
              const fadeIn = () => {
                fadeValue += 0.05
                if (fadeValue >= 1) {
                  fadeValue = 1
                  setHoveredShape(null)
                  return
                }
                setHoveredShape({ ...foundShape, fadeValue })
                fadeAnimation = requestAnimationFrame(fadeIn)
              }
              fadeAnimation = requestAnimationFrame(fadeIn)
            }, 3000)
          }
          setHoveredShape({ ...foundShape, fadeValue })
          if (fadeValue > 0) {
            fadeAnimation = requestAnimationFrame(fadeOut)
          }
        }
        fadeAnimation = requestAnimationFrame(fadeOut)

      } else if (!isDragging && !foundShape && hoveredShape) {
        // Mouse saiu de todas as formas
        if (fadeAnimation) cancelAnimationFrame(fadeAnimation)
        if (hoverTimeout) clearTimeout(hoverTimeout)
        setHoveredShape(null)
      }
    }

    const handleClick = (e) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Encontrar forma clicada
      for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i]
        if (mouseX >= shape.x && mouseX <= shape.x + shape.size &&
            mouseY >= shape.y && mouseY <= shape.y + shape.size) {

          // Toggle visibilidade com animação
          if (hiddenShapes.has(shape.id)) {
            animateFadeIn(shape.id)
          } else {
            animateFadeOut(shape.id)
          }
          break
        }
      }
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

    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('click', handleClick)
      canvas.addEventListener('mousedown', handleMouseDown)
      canvas.addEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('keydown', handleKeyPress)
    // Adicionar mouse up global para capturar quando solta fora do canvas
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('click', handleClick)
        canvas.removeEventListener('mousedown', handleMouseDown)
        canvas.removeEventListener('mouseup', handleMouseUp)
      }
      if (fadeAnimation) cancelAnimationFrame(fadeAnimation)
      if (hoverTimeout) clearTimeout(hoverTimeout)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [customText, shapes, hoveredShape, hiddenShapes, isDragging, fadingShapes])

  // re-render composition when palette/seed/customText change
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      drawComposition(canvas, ctx, customText)
    }
  }, [paletteIdx, seed, customText, hoveredShape, hiddenShapes, fadingShapes])

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
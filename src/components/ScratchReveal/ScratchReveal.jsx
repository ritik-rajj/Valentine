import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * ScratchReveal - Canvas Scratch Card Component
 *
 * INTERACTION DESIGN:
 * - User drags finger/mouse to "erase" silver overlay
 * - Uses Canvas compositing (destination-out) for erasing effect
 * - Tracks percentage revealed to trigger completion
 *
 * WHY CANVAS (not CSS mask):
 * - Natural, paintbrush-like erasing feel
 * - Works identically on mobile and desktop
 * - Can calculate exact percentage revealed
 *
 * VIRAL FACTOR: Physical "scratching" motion is satisfying
 * and makes users want to screen-record the reveal.
 */

const COMPLETION_THRESHOLD = 0.5 // 50% revealed = complete
const BRUSH_RADIUS = 30 // Size of erase brush

export default function ScratchReveal({ message, onComplete }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [isScratching, setIsScratching] = useState(false)
  const [percentRevealed, setPercentRevealed] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // Initialize canvas with silver scratch layer
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    // Set canvas size to match container
    const rect = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    // Draw silver scratch surface with shimmer gradient
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height)
    gradient.addColorStop(0, '#C0C0C0')
    gradient.addColorStop(0.3, '#E8E8E8')
    gradient.addColorStop(0.5, '#D4D4D4')
    gradient.addColorStop(0.7, '#E8E8E8')
    gradient.addColorStop(1, '#C0C0C0')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, rect.width, rect.height)

    // Add subtle noise texture for realism
    addNoiseTexture(ctx, rect.width, rect.height)

    // Draw "Scratch Here" text
    ctx.fillStyle = 'rgba(139, 0, 0, 0.3)'
    ctx.font = 'bold 14px Syne, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('✨ SCRATCH HERE ✨', rect.width / 2, rect.height / 2)

    setIsReady(true)
  }, [])

  // Calculate percentage of canvas that has been scratched
  const calculateRevealPercentage = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return 0

    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data

    let transparentPixels = 0
    const totalPixels = pixels.length / 4

    // Check alpha channel of each pixel
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) { // Pixel is mostly transparent
        transparentPixels++
      }
    }

    return transparentPixels / totalPixels
  }, [])

  // Handle scratch drawing
  const scratch = useCallback((x, y) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    // Adjust coordinates for DPR
    const canvasX = (x - rect.left) * dpr
    const canvasY = (y - rect.top) * dpr

    // Set composite operation to "erase"
    ctx.globalCompositeOperation = 'destination-out'

    // Draw circular "eraser" brush
    ctx.beginPath()
    ctx.arc(canvasX / dpr, canvasY / dpr, BRUSH_RADIUS, 0, Math.PI * 2)
    ctx.fill()

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over'
  }, [])

  // Mouse/Touch event handlers
  const handleStart = useCallback((e) => {
    e.preventDefault()
    setIsScratching(true)

    const { clientX, clientY } = e.touches ? e.touches[0] : e
    scratch(clientX, clientY)

    // Haptic feedback on scratch start
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
  }, [scratch])

  const handleMove = useCallback((e) => {
    if (!isScratching) return
    e.preventDefault()

    const { clientX, clientY } = e.touches ? e.touches[0] : e
    scratch(clientX, clientY)

    // Light haptic on each move (throttled by browser)
    if (navigator.vibrate) {
      navigator.vibrate(5)
    }
  }, [isScratching, scratch])

  const handleEnd = useCallback(() => {
    setIsScratching(false)

    // Calculate how much has been revealed
    const revealed = calculateRevealPercentage()
    setPercentRevealed(revealed)

    // Check if completion threshold reached
    if (revealed >= COMPLETION_THRESHOLD && !isComplete) {
      setIsComplete(true)
      onComplete?.()
    }
  }, [calculateRevealPercentage, isComplete, onComplete])

  return (
    <div className="relative">
      {/* Container with shadow */}
      <div
        ref={containerRef}
        className="relative w-full h-24 rounded-xl overflow-hidden shadow-brutal-sm border-2 border-[#8B0000]/20"
      >
        {/* Hidden message (underneath) */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-[#FFE4E9] via-[#FFF0F5] to-[#FFE4E9] p-4">
          <AnimatePresence>
            {isComplete ? (
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                className="font-display font-bold text-lg text-[#8B0000] text-center"
              >
                {message}
              </motion.p>
            ) : (
              <p className="font-display font-bold text-lg text-[#8B0000] text-center opacity-70">
                {message}
              </p>
            )}
          </AnimatePresence>
        </div>

        {/* Scratch layer (canvas) */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 touch-none ${isComplete ? 'pointer-events-none' : 'cursor-crosshair'}`}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          style={{
            opacity: isComplete ? 0 : 1,
            transition: 'opacity 0.5s ease-out'
          }}
        />

        {/* Shimmer overlay when not yet scratched */}
        {isReady && percentRevealed < 0.1 && (
          <div className="absolute inset-0 pointer-events-none animate-shimmer opacity-30" />
        )}
      </div>

      {/* Progress indicator */}
      <div className="mt-2 flex items-center justify-center gap-2">
        <div className="w-32 h-1 bg-[#FFB6C1] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#FF69B4]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentRevealed / COMPLETION_THRESHOLD * 100, 100)}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
        {isComplete && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            ✨
          </motion.span>
        )}
      </div>
    </div>
  )
}

/**
 * Add subtle noise texture to canvas for realism
 * Creates that metallic scratch card look
 */
function addNoiseTexture(ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height)
  const pixels = imageData.data

  for (let i = 0; i < pixels.length; i += 4) {
    // Add random noise to RGB channels
    const noise = Math.random() * 20 - 10
    pixels[i] = Math.max(0, Math.min(255, pixels[i] + noise))     // R
    pixels[i + 1] = Math.max(0, Math.min(255, pixels[i + 1] + noise)) // G
    pixels[i + 2] = Math.max(0, Math.min(255, pixels[i + 2] + noise)) // B
    // Alpha stays the same
  }

  ctx.putImageData(imageData, 0, 0)
}

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import html2canvas from 'html2canvas'

/**
 * ShareButton - Instagram Story Export
 *
 * VIRAL MECHANISM:
 * - One-tap export to Instagram Stories format (1080x1920)
 * - Adds watermark/branding for organic spread
 * - Clean PNG output optimized for social sharing
 *
 * WHY html2canvas: Works reliably across browsers,
 * captures CSS effects, and outputs directly to blob/download.
 */

export default function ShareButton({ elementId }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleShare = useCallback(async () => {
    setIsGenerating(true)

    try {
      const element = document.getElementById(elementId)
      if (!element) {
        throw new Error('Element not found')
      }

      // Capture element to canvas
      const canvas = await html2canvas(element, {
        backgroundColor: '#FFF0F5',
        scale: 2, // 2x for high DPI
        logging: false,
        useCORS: true,
        allowTaint: true
      })

      // Create Instagram Stories sized canvas (9:16 aspect ratio)
      const storyCanvas = document.createElement('canvas')
      const storyWidth = 1080
      const storyHeight = 1920
      storyCanvas.width = storyWidth
      storyCanvas.height = storyHeight

      const ctx = storyCanvas.getContext('2d')

      // Fill background with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, storyHeight)
      gradient.addColorStop(0, '#FFF0F5')
      gradient.addColorStop(0.5, '#FFE4E9')
      gradient.addColorStop(1, '#FFF0F5')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, storyWidth, storyHeight)

      // Calculate receipt positioning (centered)
      const receiptWidth = storyWidth * 0.85
      const receiptHeight = (canvas.height / canvas.width) * receiptWidth
      const receiptX = (storyWidth - receiptWidth) / 2
      const receiptY = (storyHeight - receiptHeight) / 2 - 50 // Slightly above center

      // Draw receipt
      ctx.drawImage(canvas, receiptX, receiptY, receiptWidth, receiptHeight)

      // Add decorative elements
      drawDecorations(ctx, storyWidth, storyHeight)

      // Add watermark
      ctx.fillStyle = 'rgba(139, 0, 0, 0.4)'
      ctx.font = '24px Syne, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('made with love.zip', storyWidth / 2, storyHeight - 60)

      // Convert to blob and download
      storyCanvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error('Failed to create image')
        }

        // Try Web Share API first (mobile)
        if (navigator.share && navigator.canShare) {
          const file = new File([blob], 'love-receipt.png', { type: 'image/png' })
          const shareData = {
            files: [file],
            title: 'My Love Receipt',
            text: 'Check out my relationship receipt! 💝'
          }

          if (navigator.canShare(shareData)) {
            try {
              await navigator.share(shareData)
              setShowSuccess(true)
              setTimeout(() => setShowSuccess(false), 2000)
              return
            } catch {
              // User cancelled or share failed, fall through to download
            }
          }
        }

        // Fallback: Download file
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'love-receipt.png'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
      }, 'image/png', 1.0)

    } catch (error) {
      console.error('Share error:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [elementId])

  return (
    <div className="relative">
      <motion.button
        onClick={handleShare}
        disabled={isGenerating}
        className={`
          relative px-8 py-4 bg-[#FF69B4] text-white font-display font-bold text-lg
          rounded-xl shadow-brutal-pink border-2 border-[#8B0000]/20
          transition-all active:translate-x-1 active:translate-y-1 active:shadow-none
          disabled:opacity-70 disabled:cursor-not-allowed
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <LoadingSpinner />
              Creating...
            </motion.span>
          ) : (
            <motion.span
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <span>📸</span>
              Save for Stories
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Success toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 px-4 py-2 bg-[#8B0000] text-white rounded-lg text-sm font-display whitespace-nowrap"
          >
            Saved! Share it! 💝
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Draw decorative elements on the story canvas
 */
function drawDecorations(ctx, width, height) {
  const decorations = [
    { emoji: '🎀', x: width * 0.15, y: height * 0.1, size: 60 },
    { emoji: '💝', x: width * 0.85, y: height * 0.15, size: 50 },
    { emoji: '✨', x: width * 0.1, y: height * 0.85, size: 40 },
    { emoji: '🎀', x: width * 0.9, y: height * 0.9, size: 55 },
    { emoji: '💕', x: width * 0.2, y: height * 0.25, size: 35 },
    { emoji: '💗', x: width * 0.8, y: height * 0.8, size: 45 }
  ]

  decorations.forEach(({ emoji, x, y, size }) => {
    ctx.font = `${size}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(emoji, x, y)
  })
}

/**
 * Simple loading spinner
 */
function LoadingSpinner() {
  return (
    <motion.div
      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  )
}

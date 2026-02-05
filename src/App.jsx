import { useState, useCallback, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ShakeToUnlock from './components/ShakeToUnlock/ShakeToUnlock'
import ReceiptCard from './components/Receipt/ReceiptCard'
import ScratchReveal from './components/ScratchReveal/ScratchReveal'
import TimeCounter from './components/TimeCounter/TimeCounter'
import ShareButton from './components/ShareButton/ShareButton'
import Confetti from './components/Confetti/Confetti'

/**
 * LOVE.ZIP - "Chaotic Cute" Edition
 *
 * THE VIBE: Windows 95 desktop meets coquette meets unhinged Gen Z humor
 * - Teal background with tiled pixel hearts
 * - Pixel font headers (VT323)
 * - Draggable stickers for chaos
 * - Roast receipt with funny stats
 */

// THE ROAST DATA - funny/chaotic relationship stats
const RELATIONSHIP_DATA = {
  partnerName: "Babe",
  startDate: new Date('2023-02-14'),
  stats: [
    { label: "Patience for ur drama", value: "1%", icon: "🙄" },
    { label: "Money stolen for food", value: "$4,200.50", icon: "💸" },
    { label: "Yap Session Duration", value: "48hrs/day", icon: "🗣️" },
    { label: "Arguments Won", value: "0", subtext: "(delulu)", icon: "🤡" },
    { label: "Times I've considered leaving", value: "847", icon: "🚪" },
    { label: "Times I stayed anyway", value: "848", icon: "🤪" },
  ],
  secretMessage: "ur annoying but ur MY annoying 💀❤️"
}

// Draggable sticker emojis - the chaos elements
const STICKER_EMOJIS = ['🎀', '💀', '🤡', '✨', '💅', '😭', '🚩', '💋']

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [scratchComplete, setScratchComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleUnlock = useCallback(() => {
    setIsUnlocked(true)
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 200])
    }
  }, [])

  const handleScratchComplete = useCallback(() => {
    setScratchComplete(true)
    setShowConfetti(true)
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50, 30, 100])
    }
  }, [])

  return (
    <div className="min-h-screen min-h-dvh relative overflow-hidden">
      {/* CHAOS BACKGROUND: Win95 Teal + Tiled Hearts Pattern */}
      <TiledBackground />

      {/* Draggable Stickers - THE CHAOS LAYER */}
      <DraggableStickers />

      {/* Confetti celebration */}
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>

      {/* Lock Screen */}
      <AnimatePresence mode="wait">
        {!isUnlocked && (
          <motion.div
            key="lock-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5, ease: [0.32, 0, 0.67, 0] }}
            className="fixed inset-0 z-50"
          >
            <ShakeToUnlock onUnlock={handleUnlock} partnerName={RELATIONSHIP_DATA.partnerName} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence>
        {isUnlocked && (
          <motion.main
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.3
            }}
            className="relative z-10 px-4 py-8 pb-32 flex flex-col items-center"
          >
            {/* Pixel Font Header */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", bounce: 0.5 }}
              className="mb-4 text-center"
            >
              <h1 className="font-pixel text-4xl md:text-5xl text-white drop-shadow-[3px_3px_0px_#000] tracking-wider">
                LOVE.ZIP
              </h1>
              <p className="font-pixel text-lg text-[#FF69B4] drop-shadow-[2px_2px_0px_#000] mt-1">
                💀 THE EXPOSÉ 💀
              </p>
            </motion.div>

            {/* Time Counter with pixel styling */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-6 text-center bg-black/50 px-4 py-2 border-2 border-white"
            >
              <p className="font-pixel text-sm text-[#00FF00]">TIME WASTED TOGETHER:</p>
              <TimeCounter startDate={RELATIONSHIP_DATA.startDate} />
            </motion.div>

            {/* The Receipt - wrapped in exportable container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ delay: 0.7, duration: 0.8, type: "spring", bounce: 0.3 }}
              id="receipt-for-export"
              className="relative"
            >
              <ReceiptCard
                partnerName={RELATIONSHIP_DATA.partnerName}
                startDate={RELATIONSHIP_DATA.startDate}
                stats={RELATIONSHIP_DATA.stats}
              />

              {/* Decorative tape strips on receipt */}
              <div className="absolute -top-3 left-1/4 w-16 h-6 bg-[#FFE4B5]/80 rotate-[-5deg] shadow-sm" />
              <div className="absolute -top-2 right-1/4 w-14 h-5 bg-[#FFB6C1]/80 rotate-[8deg] shadow-sm" />
            </motion.div>

            {/* Scratch Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-8 w-full max-w-sm"
            >
              <p className="font-pixel text-center text-white drop-shadow-[2px_2px_0px_#000] mb-3 text-sm">
                {scratchComplete ? "THE VERDICT:" : ">>> SCRATCH 4 TRUTH <<<"}
              </p>
              <ScratchReveal
                message={RELATIONSHIP_DATA.secretMessage}
                onComplete={handleScratchComplete}
              />
            </motion.div>

            {/* Share Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="mt-10"
            >
              <ShareButton elementId="receipt-for-export" />
            </motion.div>

            {/* Chaotic footer text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="mt-8 font-pixel text-xs text-white/60 text-center"
            >
              made with chaos & poor decisions 💀
            </motion.p>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * TiledBackground - Windows 95 teal with pixel heart pattern
 *
 * Creates that nostalgic desktop wallpaper vibe with
 * a repeating coquette bow/heart pattern overlay
 */
function TiledBackground() {
  return (
    <div
      className="fixed inset-0 z-0"
      style={{
        backgroundColor: '#008080', // Classic Win95 teal
        backgroundImage: `
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 8 C25 8 20 12 20 18 C20 28 30 35 30 35 C30 35 40 28 40 18 C40 12 35 8 30 8' fill='%23FF69B4' opacity='0.15'/%3E%3Cpath d='M30 45 L25 50 L30 48 L35 50 Z' fill='%23FFB6C1' opacity='0.2'/%3E%3C/svg%3E")
        `,
        backgroundSize: '60px 60px',
      }}
    >
      {/* Scanline overlay for retro CRT effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)',
        }}
      />
    </div>
  )
}

/**
 * DraggableStickers - Interactive chaos elements
 *
 * Users can pick up and throw these around the screen.
 * They persist in position, creating a "messy desktop" feel.
 *
 * WHY THIS IS VIRAL: People will screenshot their custom
 * sticker arrangements. Interactive = shareable.
 */
function DraggableStickers() {
  // Generate random initial positions for stickers
  const stickers = useMemo(() => {
    return STICKER_EMOJIS.map((emoji, i) => ({
      id: i,
      emoji,
      // Spread around the edges so they don't cover the receipt
      initialX: i % 2 === 0
        ? 20 + Math.random() * 60  // Left side
        : window.innerWidth - 80 - Math.random() * 60, // Right side
      initialY: 100 + (i * 80) + Math.random() * 40,
      rotation: Math.random() * 30 - 15,
      scale: 0.8 + Math.random() * 0.4,
    }))
  }, [])

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {stickers.map((sticker) => (
        <Sticker key={sticker.id} {...sticker} />
      ))}
    </div>
  )
}

/**
 * Individual Draggable Sticker
 *
 * Uses Framer Motion's drag with constraints.
 * Bouncy spring animation on drop for that "juicy" feel.
 */
function Sticker({ emoji, initialX, initialY, rotation, scale }) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      whileDrag={{
        scale: 1.2,
        rotate: rotation + 10,
        zIndex: 100,
        cursor: 'grabbing',
      }}
      whileHover={{
        scale: scale * 1.1,
        rotate: rotation + 5,
      }}
      whileTap={{
        scale: 1.3,
      }}
      initial={{
        x: initialX,
        y: initialY,
        rotate: rotation,
        scale: 0,
      }}
      animate={{
        scale: scale,
        rotate: rotation,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: Math.random() * 0.5,
      }}
      className="absolute text-4xl md:text-5xl cursor-grab pointer-events-auto select-none drop-shadow-lg"
      style={{
        filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.3))',
      }}
    >
      {emoji}
    </motion.div>
  )
}

export default App

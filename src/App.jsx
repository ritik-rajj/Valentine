import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ShakeToUnlock from './components/ShakeToUnlock/ShakeToUnlock'
import ReceiptCard from './components/Receipt/ReceiptCard'
import ScratchReveal from './components/ScratchReveal/ScratchReveal'
import TimeCounter from './components/TimeCounter/TimeCounter'
import ShareButton from './components/ShareButton/ShareButton'
import Confetti from './components/Confetti/Confetti'

/**
 * LOVE.ZIP - Main App Component
 *
 * Orchestrates the viral user journey:
 * 1. Lock Screen (Shake to Unlock)
 * 2. Receipt Reveal (Relationship Stats)
 * 3. Scratch Card (Secret Message)
 * 4. Share (Instagram Story Export)
 */

// Sample relationship data - in production, this would come from URL params or a database
const RELATIONSHIP_DATA = {
  partnerName: "Babe",
  startDate: new Date('2023-02-14'), // When the relationship started
  stats: [
    { label: "Hugs Given", value: "\u221E", icon: "\uD83E\uDD17" },
    { label: "Arguments Won", value: "0", subtext: "(you're always right)", icon: "\uD83D\uDE07" },
    { label: "Netflix Shows Binged", value: "47", icon: "\uD83C\uDFAC" },
    { label: "Midnight Snack Runs", value: "23", icon: "\uD83C\uDF55" },
    { label: "Times Said 'I Love You'", value: "9,847", icon: "\u2764\uFE0F" },
    { label: "Patience Level", value: "100%", icon: "\uD83E\uDDD8" },
  ],
  secretMessage: "You're my favorite notification \u2764\uFE0F"
}

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [scratchComplete, setScratchComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // Handle successful shake unlock
  const handleUnlock = useCallback(() => {
    setIsUnlocked(true)
    // Trigger haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 200])
    }
  }, [])

  // Handle scratch card completion
  const handleScratchComplete = useCallback(() => {
    setScratchComplete(true)
    setShowConfetti(true)
    // Trigger celebration haptics
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50, 30, 100])
    }
  }, [])

  return (
    <div className="min-h-screen min-h-dvh relative overflow-x-hidden">
      {/* Background floating hearts */}
      <BackgroundHearts />

      {/* Confetti celebration overlay */}
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

      {/* Main Content - Receipt */}
      <AnimatePresence>
        {isUnlocked && (
          <motion.main
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1], // Custom ease for "juicy" feel
              delay: 0.3
            }}
            className="relative z-10 px-4 py-8 pb-32 flex flex-col items-center"
          >
            {/* Time Together Counter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-8 text-center"
            >
              <p className="font-display text-lg text-[#8B0000]/70 mb-2">Time Together</p>
              <TimeCounter startDate={RELATIONSHIP_DATA.startDate} />
            </motion.div>

            {/* The Receipt */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ delay: 0.7, duration: 0.8, type: "spring", bounce: 0.3 }}
              id="receipt-for-export"
            >
              <ReceiptCard
                partnerName={RELATIONSHIP_DATA.partnerName}
                startDate={RELATIONSHIP_DATA.startDate}
                stats={RELATIONSHIP_DATA.stats}
              />
            </motion.div>

            {/* Scratch Card Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-8 w-full max-w-sm"
            >
              <p className="font-display text-center text-[#8B0000]/70 mb-3 text-sm">
                {scratchComplete ? "Your secret message:" : "Scratch to reveal your message"}
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
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Background floating hearts for ambient movement
 * Creates depth and keeps the screen visually interesting
 */
function BackgroundHearts() {
  const hearts = [
    { emoji: "\uD83E\uDD0D", size: "text-2xl", top: "10%", left: "5%", delay: 0 },
    { emoji: "\uD83D\uDC95", size: "text-xl", top: "20%", right: "10%", delay: 0.5 },
    { emoji: "\uD83C\uDF80", size: "text-3xl", top: "40%", left: "8%", delay: 1 },
    { emoji: "\u2764\uFE0F", size: "text-lg", top: "60%", right: "5%", delay: 1.5 },
    { emoji: "\uD83D\uDC97", size: "text-2xl", top: "75%", left: "12%", delay: 2 },
    { emoji: "\uD83C\uDF80", size: "text-xl", top: "85%", right: "15%", delay: 2.5 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart, i) => (
        <motion.span
          key={i}
          className={`absolute ${heart.size} opacity-30`}
          style={{ top: heart.top, left: heart.left, right: heart.right }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            delay: heart.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {heart.emoji}
        </motion.span>
      ))}
    </div>
  )
}

export default App

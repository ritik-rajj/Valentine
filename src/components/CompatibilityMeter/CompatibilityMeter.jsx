import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * CompatibilityMeter - Dramatic Name Compatibility Calculator
 *
 * VIRAL FACTOR: Everyone loves compatibility tests.
 * The fake algorithm + dramatic reveal creates shareable moments.
 * The results are always either "soulmates" or "chaotic but obsessed"
 * - never actually negative (we want shares, not sad users)
 *
 * Algorithm: Pure vibes (hash names, always land 69-100%)
 */

const RESULTS = [
  { min: 95, title: "LITERAL SOULMATES", emoji: "💫", color: "#FF69B4", desc: "The universe wrote your names together in the stars or whatever" },
  { min: 85, title: "DISGUSTINGLY CUTE", emoji: "🤮💕", color: "#EC4899", desc: "People are sick of how in love you are tbh" },
  { min: 75, title: "TOXIC BUT MAKE IT FASHION", emoji: "💀🎀", color: "#8B5CF6", desc: "Chaotic energy but you can't live without each other" },
  { min: 69, title: "NICE 😏", emoji: "😏", color: "#10B981", desc: "Nice." },
  { min: 0, title: "ENEMIES TO LOVERS ARC", emoji: "⚔️💋", color: "#F59E0B", desc: "The tension is just unresolved feelings bestie" },
]

export default function CompatibilityMeter({ name1: defaultName1 = "", name2: defaultName2 = "" }) {
  const [name1, setName1] = useState(defaultName1)
  const [name2, setName2] = useState(defaultName2)
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState(null)
  const [showResult, setShowResult] = useState(false)

  const calculateCompatibility = () => {
    if (!name1.trim() || !name2.trim()) return

    setIsCalculating(true)
    setShowResult(false)
    setResult(null)

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50, 50, 50])
    }

    // Fake dramatic calculation delay
    setTimeout(() => {
      // "Algorithm" - always returns 69-100 for positive vibes
      const hash = (name1 + name2).split('').reduce((a, c) => a + c.charCodeAt(0), 0)
      const percentage = 69 + (hash % 32) // 69-100 range

      const resultData = RESULTS.find(r => percentage >= r.min)

      setResult({
        percentage,
        ...resultData
      })
      setIsCalculating(false)

      // Dramatic reveal delay
      setTimeout(() => {
        setShowResult(true)
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100])
        }
      }, 500)
    }, 2000)
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="font-pixel text-2xl text-white drop-shadow-[2px_2px_0px_#000]">
          COMPATIBILITY CHECK
        </h2>
        <p className="font-pixel text-sm text-[#FF69B4] drop-shadow-[1px_1px_0px_#000]">
          the science is real trust me 🔬
        </p>
      </div>

      {/* Input Form */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <input
            type="text"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            placeholder="Your name..."
            className="w-full px-4 py-3 bg-white/10 border-2 border-[#FF69B4] rounded-lg font-pixel text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xl">💖</span>
        </div>

        <div className="flex justify-center">
          <motion.span
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-2xl"
          >
            ➕
          </motion.span>
        </div>

        <div className="relative">
          <input
            type="text"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            placeholder="Their name..."
            className="w-full px-4 py-3 bg-white/10 border-2 border-[#FF69B4] rounded-lg font-pixel text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xl">💝</span>
        </div>
      </div>

      {/* Calculate Button */}
      <motion.button
        onClick={calculateCompatibility}
        disabled={isCalculating || !name1.trim() || !name2.trim()}
        whileTap={{ scale: 0.95 }}
        className="w-full py-4 bg-[#FF69B4] text-white font-pixel text-lg rounded-lg shadow-brutal-sm disabled:opacity-50 disabled:cursor-not-allowed active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
      >
        {isCalculating ? "CALCULATING..." : "CHECK COMPATIBILITY 💕"}
      </motion.button>

      {/* Calculating Animation */}
      <AnimatePresence>
        {isCalculating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block text-4xl"
              >
                💫
              </motion.div>
              <p className="font-pixel text-sm text-white/60 mt-2">
                Analyzing vibes...
              </p>
              <LoadingBar />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="mt-6"
          >
            <div
              className="rounded-xl p-6 text-center relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${result.color}33 0%, ${result.color}66 100%)`,
                border: `2px solid ${result.color}`,
              }}
            >
              {/* Percentage */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
              >
                <span className="text-6xl">{result.emoji}</span>
                <div className="font-pixel text-5xl text-white drop-shadow-[3px_3px_0px_#000] my-3">
                  {result.percentage}%
                </div>
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-pixel text-xl text-white drop-shadow-[2px_2px_0px_#000] mb-2"
              >
                {result.title}
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="font-receipt text-sm text-white/80"
              >
                {result.desc}
              </motion.p>

              {/* Names */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-4 pt-4 border-t border-white/20"
              >
                <p className="font-pixel text-xs text-white/60">
                  {name1} 💕 {name2}
                </p>
              </motion.div>

              {/* Sparkles decoration */}
              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-lg"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: Math.cos(i * 60 * Math.PI / 180) * 80,
                    y: Math.sin(i * 60 * Math.PI / 180) * 80,
                  }}
                  transition={{
                    delay: 0.3 + i * 0.1,
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                >
                  ✨
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Fake loading bar for dramatic effect
 */
function LoadingBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100
        // Random jumps for that "scanning" effect
        return prev + Math.random() * 15
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden mt-3">
      <motion.div
        className="h-full bg-gradient-to-r from-[#FF69B4] via-[#8B5CF6] to-[#FF69B4]"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(progress, 100)}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  )
}

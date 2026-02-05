import { useState, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useShake, useDesktopShake } from '../../hooks/useShake'

/**
 * ShakeToUnlock - The Hero Lock Screen Component
 *
 * VIRAL PSYCHOLOGY:
 * - Physical interaction (shaking) creates emotional investment
 * - Progress indicator creates tension/anticipation
 * - Shattering animation provides satisfying payoff
 *
 * The heart "cracks" progressively with each shake, building tension.
 * Final shake triggers dramatic shatter with fragments flying outward.
 */

export default function ShakeToUnlock({ onUnlock, partnerName = "Someone" }) {
  const [progress, setProgress] = useState(0)
  const [isShattered, setIsShattered] = useState(false)
  const [needsPermission, setNeedsPermission] = useState(false)
  const heartControls = useAnimation()

  // Memoize shake callbacks
  const handleShake = useCallback(() => {
    // Shake the entire heart on each detected shake
    heartControls.start({
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4, ease: "easeOut" }
    })
  }, [heartControls])

  const handleProgress = useCallback((p) => {
    setProgress(p)
  }, [])

  const handleComplete = useCallback(() => {
    setIsShattered(true)
    // Delay unlock to allow shatter animation to play
    setTimeout(onUnlock, 800)
  }, [onUnlock])

  // Device shake detection (mobile)
  const {
    hasPermission,
    isSupported,
    requestPermission
  } = useShake({
    threshold: 12,        // Slightly lower for better sensitivity
    shakesToUnlock: 5,    // 5 shakes feels achievable but meaningful
    onShake: handleShake,
    onProgress: handleProgress,
    onComplete: handleComplete
  })

  // Desktop fallback (mouse movement)
  const { handlers: desktopHandlers } = useDesktopShake({
    shakesToUnlock: 5,
    onShake: handleShake,
    onProgress: handleProgress,
    onComplete: handleComplete
  })

  // Check if we need to request permission (iOS)
  useEffect(() => {
    if (isSupported && hasPermission === false) {
      setNeedsPermission(true)
    }
  }, [isSupported, hasPermission])

  // Handle permission request
  const handleRequestPermission = async () => {
    const granted = await requestPermission()
    if (granted) {
      setNeedsPermission(false)
    }
  }

  // Generate crack lines based on progress
  const crackLines = useMemo(() => {
    const cracks = []
    const numCracks = Math.floor(progress * 5)

    for (let i = 0; i < numCracks; i++) {
      cracks.push({
        id: i,
        // Random-ish but deterministic crack positions
        d: getCrackPath(i),
        delay: i * 0.1
      })
    }
    return cracks
  }, [progress])

  return (
    <div
      className="min-h-screen min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-[#FFF0F5] via-[#FFE4E9] to-[#FFF0F5] no-overscroll p-4"
      {...desktopHandlers}
    >
      {/* Permission Request Modal */}
      <AnimatePresence>
        {needsPermission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-brutal text-center"
            >
              <span className="text-5xl mb-4 block">📱</span>
              <h3 className="font-display font-bold text-xl text-[#8B0000] mb-2">
                Enable Motion
              </h3>
              <p className="text-[#8B0000]/70 text-sm mb-4">
                Shake your phone to unlock! We need permission to detect movement.
              </p>
              <button
                onClick={handleRequestPermission}
                className="w-full py-3 px-6 bg-[#FF69B4] text-white font-display font-bold rounded-xl shadow-brutal-sm active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              >
                Allow Motion
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="font-display font-extrabold text-3xl text-[#8B0000] mb-2">
          {partnerName},
        </h1>
        <p className="text-[#8B0000]/70 text-lg">
          you have a delivery...
        </p>
      </motion.div>

      {/* The Heart Lock */}
      <motion.div
        animate={heartControls}
        className="relative"
      >
        <AnimatePresence mode="wait">
          {!isShattered ? (
            <motion.div
              key="heart-intact"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            >
              <HeartLock progress={progress} crackLines={crackLines} />
            </motion.div>
          ) : (
            <motion.div
              key="heart-shattered"
              initial={{ scale: 1 }}
              animate={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ShatterEffect />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Progress indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 w-48"
      >
        <div className="h-2 bg-[#FFB6C1] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#FF69B4]"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        </div>
      </motion.div>

      {/* Instruction text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          x: progress === 0 ? [0, -3, 3, -3, 3, 0] : 0
        }}
        transition={{
          opacity: { delay: 0.6 },
          x: {
            delay: 1.5,
            duration: 0.5,
            repeat: progress === 0 ? Infinity : 0,
            repeatDelay: 2
          }
        }}
        className="mt-4 text-[#8B0000]/60 text-sm font-display"
      >
        {isSupported
          ? "Shake your phone to unlock 💗"
          : "Swipe rapidly to unlock 💗"}
      </motion.p>

      {/* Decorative bows */}
      <motion.span
        className="absolute top-8 left-8 text-4xl opacity-50"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        🎀
      </motion.span>
      <motion.span
        className="absolute bottom-8 right-8 text-4xl opacity-50"
        animate={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
      >
        🎀
      </motion.span>
    </div>
  )
}

/**
 * HeartLock - The main heart SVG with crack overlay
 *
 * Uses clip-path for crack effect visibility.
 * Cracks appear progressively based on shake progress.
 */
function HeartLock({ progress, crackLines }) {
  return (
    <div className="relative w-48 h-48">
      {/* Glow effect behind heart */}
      <motion.div
        className="absolute inset-0 bg-[#FF69B4] rounded-full blur-3xl opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main heart SVG */}
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full drop-shadow-lg ${progress === 0 ? 'animate-heartbeat' : ''}`}
      >
        {/* Heart shape */}
        <defs>
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF69B4" />
            <stop offset="50%" stopColor="#FF1493" />
            <stop offset="100%" stopColor="#8B0000" />
          </linearGradient>
          <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
            <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
          </filter>
        </defs>

        {/* Heart path - anatomically pleasing proportions */}
        <path
          d="M50 88 C20 65 5 45 5 30 C5 15 20 5 35 5 C45 5 50 15 50 15 C50 15 55 5 65 5 C80 5 95 15 95 30 C95 45 80 65 50 88 Z"
          fill="url(#heartGradient)"
          filter="url(#innerShadow)"
        />

        {/* Lock icon in center */}
        <g transform="translate(35, 35)">
          <rect
            x="5"
            y="12"
            width="20"
            height="15"
            rx="2"
            fill="#8B0000"
            opacity="0.8"
          />
          <path
            d="M10 12 V8 C10 4 12 2 15 2 C18 2 20 4 20 8 V12"
            fill="none"
            stroke="#8B0000"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />
          <circle cx="15" cy="20" r="2" fill="#FFF0F5" />
        </g>

        {/* Crack lines - appear based on progress */}
        {crackLines.map((crack) => (
          <motion.path
            key={crack.id}
            d={crack.d}
            fill="none"
            stroke="#8B0000"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{
              duration: 0.3,
              delay: crack.delay,
              ease: "easeOut"
            }}
          />
        ))}
      </svg>

      {/* Shake intensity indicator - wobble effect */}
      {progress > 0 && progress < 1 && (
        <motion.div
          className="absolute inset-0 border-4 border-[#FF69B4] rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity
          }}
        />
      )}
    </div>
  )
}

/**
 * ShatterEffect - Fragments flying outward animation
 *
 * Creates 12 heart fragments that explode outward.
 * Each fragment has unique trajectory for organic feel.
 *
 * WHY 12 FRAGMENTS: Odd number of fragments looks more
 * natural/chaotic. 12 gives good coverage without performance hit.
 */
function ShatterEffect() {
  const fragments = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2
      const distance = 150 + Math.random() * 100
      const rotation = Math.random() * 720 - 360

      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        rotation,
        scale: 0.3 + Math.random() * 0.4,
        delay: Math.random() * 0.1
      }
    })
  }, [])

  return (
    <div className="relative w-48 h-48">
      {fragments.map((frag) => (
        <motion.div
          key={frag.id}
          className="absolute top-1/2 left-1/2 w-8 h-8 -ml-4 -mt-4"
          initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
          animate={{
            x: frag.x,
            y: frag.y,
            rotate: frag.rotation,
            scale: frag.scale,
            opacity: 0
          }}
          transition={{
            duration: 0.8,
            delay: frag.delay,
            ease: [0.32, 0, 0.67, 0] // Fast start, gradual slow
          }}
        >
          <svg viewBox="0 0 20 20" className="w-full h-full">
            <path
              d="M10 18 L2 10 L6 2 L14 2 L18 10 Z"
              fill="#FF69B4"
              opacity="0.9"
            />
          </svg>
        </motion.div>
      ))}

      {/* Central flash */}
      <motion.div
        className="absolute inset-0 bg-white rounded-full"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  )
}

/**
 * Generate crack path based on index
 * Each crack has a unique but deterministic path
 */
function getCrackPath(index) {
  const paths = [
    "M50 40 L45 55 L40 60",
    "M50 40 L55 50 L60 55",
    "M45 55 L35 65 L30 75",
    "M55 50 L65 60 L70 70",
    "M40 60 L30 70 L25 80"
  ]
  return paths[index % paths.length]
}

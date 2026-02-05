import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * TimeCounter - High-Precision Relationship Timer
 *
 * VIRAL PSYCHOLOGY:
 * - Millisecond precision creates urgency and "realness"
 * - Large numbers are impressive and screenshot-worthy
 * - The constant ticking creates anxiety-relief when watching
 *
 * Updates every 50ms for smooth millisecond display without
 * excessive re-renders (60fps not needed for numbers).
 */

export default function TimeCounter({ startDate }) {
  const [now, setNow] = useState(new Date())

  // Update time every 50ms for smooth milliseconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // Calculate time components
  const timeComponents = useMemo(() => {
    const diff = now.getTime() - startDate.getTime()

    const milliseconds = Math.floor((diff % 1000) / 10) // Show centiseconds
    const seconds = Math.floor((diff / 1000) % 60)
    const minutes = Math.floor((diff / (1000 * 60)) % 60)
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    return {
      days,
      hours,
      minutes,
      seconds,
      milliseconds
    }
  }, [now, startDate])

  return (
    <motion.div
      className="font-receipt text-[#8B0000] text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Main time display */}
      <div className="flex items-baseline justify-center gap-1 flex-wrap">
        {/* Days - big and bold */}
        <TimeUnit value={timeComponents.days} label="days" large />

        <span className="text-[#FF69B4] mx-1">:</span>

        {/* Hours */}
        <TimeUnit value={timeComponents.hours} label="hrs" />

        <span className="text-[#FF69B4] mx-1">:</span>

        {/* Minutes */}
        <TimeUnit value={timeComponents.minutes} label="min" />

        <span className="text-[#FF69B4] mx-1">:</span>

        {/* Seconds */}
        <TimeUnit value={timeComponents.seconds} label="sec" />

        {/* Milliseconds - smaller, fast-updating */}
        <span className="text-[#8B0000]/50 text-sm ml-1">
          .{String(timeComponents.milliseconds).padStart(2, '0')}
        </span>
      </div>

      {/* Subtitle */}
      <p className="text-xs text-[#8B0000]/50 mt-2 tracking-wider">
        AND COUNTING...
      </p>
    </motion.div>
  )
}

/**
 * TimeUnit - Individual time component display
 *
 * Separates value and label for visual hierarchy.
 * Large variant for days (most impressive number).
 */
function TimeUnit({ value, label, large = false }) {
  const displayValue = String(value).padStart(2, '0')

  return (
    <div className="flex flex-col items-center">
      <motion.span
        className={`font-bold tabular-nums ${large ? 'text-4xl' : 'text-2xl'}`}
        key={displayValue}
        initial={{ y: -5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
        {displayValue}
      </motion.span>
      <span className="text-[10px] text-[#8B0000]/50 uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}

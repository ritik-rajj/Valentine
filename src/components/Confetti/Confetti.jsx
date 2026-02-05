import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * Confetti - Physics-based Celebration Effect
 *
 * VIRAL DOPAMINE:
 * - Triggers on scratch card completion
 * - Hearts and bows falling = pure serotonin
 * - Responds to device tilt for extra interactivity
 *
 * WHY CUSTOM (not a library):
 * - Smaller bundle size
 * - Full control over particle types (hearts, bows)
 * - Can integrate device orientation
 *
 * Creates 50 particles that fall with realistic physics
 * (gravity, air resistance, rotation).
 */

const PARTICLE_COUNT = 50
const GRAVITY = 0.5
const AIR_RESISTANCE = 0.98

export default function Confetti() {
  const [particles, setParticles] = useState([])
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  // Generate initial particles
  const initialParticles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      // Random emoji from our theme
      emoji: ['💝', '💕', '🎀', '✨', '💗', '🤍', '💖'][Math.floor(Math.random() * 7)],
      // Start position (spread across top)
      x: Math.random() * window.innerWidth,
      y: -50 - Math.random() * 100,
      // Initial velocity
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * 5 + 2,
      // Rotation
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
      // Size variation
      scale: 0.5 + Math.random() * 1,
      // Opacity
      opacity: 0.8 + Math.random() * 0.2
    }))
  }, [])

  // Device orientation for tilt effect
  useEffect(() => {
    const handleOrientation = (e) => {
      // gamma: left/right tilt (-90 to 90)
      // beta: front/back tilt (-180 to 180)
      setTilt({
        x: (e.gamma || 0) / 45, // Normalize to -2 to 2
        y: (e.beta || 0) / 90    // Normalize to -2 to 2
      })
    }

    window.addEventListener('deviceorientation', handleOrientation)
    return () => window.removeEventListener('deviceorientation', handleOrientation)
  }, [])

  // Physics simulation
  useEffect(() => {
    setParticles(initialParticles)

    const animate = () => {
      setParticles(prev => {
        return prev.map(p => {
          // Apply gravity
          let vy = p.vy + GRAVITY

          // Apply air resistance
          let vx = p.vx * AIR_RESISTANCE
          vy = vy * AIR_RESISTANCE

          // Apply tilt influence
          vx += tilt.x * 0.5
          vy += tilt.y * 0.2

          // Update position
          let x = p.x + vx
          let y = p.y + vy

          // Bounce off walls
          if (x < 0 || x > window.innerWidth) {
            vx *= -0.5
            x = Math.max(0, Math.min(window.innerWidth, x))
          }

          // Update rotation
          const rotation = (p.rotation + p.rotationSpeed) % 360

          // Fade out as it falls
          const opacity = Math.max(0, p.opacity - 0.003)

          return { ...p, x, y, vx, vy, rotation, opacity }
        }).filter(p => p.y < window.innerHeight + 100 && p.opacity > 0)
      })
    }

    const interval = setInterval(animate, 16) // ~60fps
    return () => clearInterval(interval)
  }, [initialParticles, tilt])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
    >
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute text-2xl select-none"
          style={{
            left: particle.x,
            top: particle.y,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
            opacity: particle.opacity,
            willChange: 'transform',
            transformOrigin: 'center center'
          }}
        >
          {particle.emoji}
        </motion.div>
      ))}
    </motion.div>
  )
}

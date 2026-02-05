import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * useShake - Custom hook for detecting device shake gestures
 *
 * Uses DeviceMotion API to detect shake intensity.
 * Falls back to touch/mouse drag for desktop testing.
 *
 * WHY THESE VALUES:
 * - threshold: 15 is sweet spot - not too sensitive (accidental triggers)
 *   but not too hard (frustrating). Tested on iPhone 14 & Pixel 7.
 * - timeout: 100ms between shake events prevents double-counting
 *
 * @param {Object} options
 * @param {number} options.threshold - Acceleration threshold (default: 15)
 * @param {number} options.shakesToUnlock - Number of shakes needed (default: 5)
 * @param {Function} options.onShake - Callback on each shake
 * @param {Function} options.onProgress - Callback with progress (0-1)
 * @param {Function} options.onComplete - Callback when shake count reached
 */
export function useShake({
  threshold = 15,
  shakesToUnlock = 5,
  onShake,
  onProgress,
  onComplete
} = {}) {
  const [shakeCount, setShakeCount] = useState(0)
  const [hasPermission, setHasPermission] = useState(null)
  const [isSupported, setIsSupported] = useState(true)
  const lastShakeTime = useRef(0)
  const lastAcceleration = useRef({ x: 0, y: 0, z: 0 })

  // Check if DeviceMotion is supported
  useEffect(() => {
    const supported = 'DeviceMotionEvent' in window
    setIsSupported(supported)

    // iOS 13+ requires permission
    if (supported && typeof DeviceMotionEvent.requestPermission === 'function') {
      setHasPermission(false)
    } else if (supported) {
      setHasPermission(true)
    }
  }, [])

  // Request permission (iOS 13+)
  const requestPermission = useCallback(async () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceMotionEvent.requestPermission()
        setHasPermission(permission === 'granted')
        return permission === 'granted'
      } catch {
        setHasPermission(false)
        return false
      }
    }
    return true
  }, [])

  // Handle device motion events
  const handleMotion = useCallback((event) => {
    const { accelerationIncludingGravity } = event
    if (!accelerationIncludingGravity) return

    const { x, y, z } = accelerationIncludingGravity
    const last = lastAcceleration.current

    // Calculate delta acceleration
    const deltaX = Math.abs(x - last.x)
    const deltaY = Math.abs(y - last.y)
    const deltaZ = Math.abs(z - last.z)
    const totalDelta = deltaX + deltaY + deltaZ

    // Update last values
    lastAcceleration.current = { x, y, z }

    // Check if shake threshold exceeded
    const now = Date.now()
    if (totalDelta > threshold && now - lastShakeTime.current > 100) {
      lastShakeTime.current = now

      setShakeCount(prev => {
        const newCount = prev + 1
        const progress = Math.min(newCount / shakesToUnlock, 1)

        // Trigger haptic on each shake
        if (navigator.vibrate) {
          navigator.vibrate(30)
        }

        onShake?.()
        onProgress?.(progress)

        if (newCount >= shakesToUnlock) {
          onComplete?.()
        }

        return newCount
      })
    }
  }, [threshold, shakesToUnlock, onShake, onProgress, onComplete])

  // Set up motion listener
  useEffect(() => {
    if (!hasPermission || !isSupported) return

    window.addEventListener('devicemotion', handleMotion)
    return () => window.removeEventListener('devicemotion', handleMotion)
  }, [hasPermission, isSupported, handleMotion])

  // Reset shake count
  const reset = useCallback(() => {
    setShakeCount(0)
    lastShakeTime.current = 0
  }, [])

  return {
    shakeCount,
    progress: Math.min(shakeCount / shakesToUnlock, 1),
    hasPermission,
    isSupported,
    requestPermission,
    reset
  }
}

/**
 * useDesktopShake - Fallback for desktop browsers
 *
 * Detects rapid mouse/touch movement as "shake" alternative.
 * Useful for development and desktop users.
 */
export function useDesktopShake({
  shakesToUnlock = 5,
  onShake,
  onProgress,
  onComplete
} = {}) {
  const [shakeCount, setShakeCount] = useState(0)
  const lastPosition = useRef({ x: 0, y: 0 })
  const lastMoveTime = useRef(0)
  const directionChanges = useRef(0)
  const lastDirection = useRef(null)

  const handleMove = useCallback((x, y) => {
    const last = lastPosition.current
    const deltaX = x - last.x
    const now = Date.now()

    // Determine direction
    const direction = deltaX > 0 ? 'right' : 'left'

    // Count rapid direction changes (shake simulation)
    if (lastDirection.current && direction !== lastDirection.current) {
      if (now - lastMoveTime.current < 150) {
        directionChanges.current++

        // Every 2 direction changes = 1 shake
        if (directionChanges.current >= 2) {
          directionChanges.current = 0

          setShakeCount(prev => {
            const newCount = prev + 1
            const progress = Math.min(newCount / shakesToUnlock, 1)

            onShake?.()
            onProgress?.(progress)

            if (newCount >= shakesToUnlock) {
              onComplete?.()
            }

            return newCount
          })
        }
      }
    }

    lastDirection.current = direction
    lastPosition.current = { x, y }
    lastMoveTime.current = now
  }, [shakesToUnlock, onShake, onProgress, onComplete])

  const handleMouseMove = useCallback((e) => {
    handleMove(e.clientX, e.clientY)
  }, [handleMove])

  const handleTouchMove = useCallback((e) => {
    const touch = e.touches[0]
    handleMove(touch.clientX, touch.clientY)
  }, [handleMove])

  const reset = useCallback(() => {
    setShakeCount(0)
    directionChanges.current = 0
  }, [])

  return {
    shakeCount,
    progress: Math.min(shakeCount / shakesToUnlock, 1),
    handlers: {
      onMouseMove: handleMouseMove,
      onTouchMove: handleTouchMove
    },
    reset
  }
}

export default useShake

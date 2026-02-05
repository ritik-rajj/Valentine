import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * MemoryJar - Tap to Reveal Love Notes
 *
 * VIRAL FACTOR: Mystery + reveal = dopamine.
 * Each tap opens a folded note with a cute/chaotic message.
 * Users can add their own notes (stored locally).
 *
 * The notes fly out of the jar with physics animation.
 */

const DEFAULT_NOTES = [
  { id: 1, text: "Remember when we stayed up til 4am talking about nothing? That was everything.", color: "#FF69B4" },
  { id: 2, text: "I still get butterflies when you text me first 🦋", color: "#8B5CF6" },
  { id: 3, text: "You're the only person whose yapping I actually enjoy", color: "#10B981" },
  { id: 4, text: "Thanks for pretending to like my cooking", color: "#F59E0B" },
  { id: 5, text: "You make my brain produce serotonin or whatever", color: "#EC4899" },
  { id: 6, text: "I would share my fries with you (this is a big deal)", color: "#3B82F6" },
  { id: 7, text: "You're my favorite notification 📱", color: "#8B0000" },
  { id: 8, text: "I love how weird we are together", color: "#6366F1" },
  { id: 9, text: "You're the 'you up?' I actually want to receive", color: "#14B8A6" },
  { id: 10, text: "Our chaos > everyone else's peace", color: "#F43F5E" },
]

export default function MemoryJar() {
  const [notes, setNotes] = useState(DEFAULT_NOTES)
  const [revealedNote, setRevealedNote] = useState(null)
  const [isShaking, setIsShaking] = useState(false)
  const [showAddNote, setShowAddNote] = useState(false)
  const [newNoteText, setNewNoteText] = useState("")

  // Shuffle notes for random reveal
  const shuffledNotes = useMemo(() => {
    return [...notes].sort(() => Math.random() - 0.5)
  }, [notes])

  const [currentIndex, setCurrentIndex] = useState(0)

  const revealNote = () => {
    if (revealedNote) return // Already showing a note

    setIsShaking(true)

    // Haptic feedback - jar shaking
    if (navigator.vibrate) {
      navigator.vibrate([30, 20, 30, 20, 30])
    }

    setTimeout(() => {
      setIsShaking(false)
      const note = shuffledNotes[currentIndex % shuffledNotes.length]
      setRevealedNote(note)
      setCurrentIndex(prev => prev + 1)

      // Haptic for note reveal
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    }, 500)
  }

  const closeNote = () => {
    setRevealedNote(null)
  }

  const addNote = () => {
    if (!newNoteText.trim()) return

    const colors = ["#FF69B4", "#8B5CF6", "#10B981", "#F59E0B", "#EC4899", "#3B82F6"]
    const newNote = {
      id: Date.now(),
      text: newNoteText,
      color: colors[Math.floor(Math.random() * colors.length)]
    }

    setNotes(prev => [...prev, newNote])
    setNewNoteText("")
    setShowAddNote(false)

    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50])
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="font-pixel text-2xl text-white drop-shadow-[2px_2px_0px_#000]">
          MEMORY JAR
        </h2>
        <p className="font-pixel text-sm text-[#FF69B4] drop-shadow-[1px_1px_0px_#000]">
          tap the jar for a surprise 💌
        </p>
      </div>

      {/* The Jar */}
      <div className="relative flex flex-col items-center">
        {/* Jar SVG */}
        <motion.div
          animate={isShaking ? {
            rotate: [-5, 5, -5, 5, 0],
            x: [-5, 5, -5, 5, 0]
          } : {}}
          transition={{ duration: 0.5 }}
          onClick={revealNote}
          className="cursor-pointer relative"
        >
          {/* Jar body */}
          <svg width="200" height="240" viewBox="0 0 200 240" className="drop-shadow-lg">
            {/* Jar lid */}
            <rect x="50" y="10" width="100" height="25" rx="5" fill="#8B4513" />
            <rect x="45" y="30" width="110" height="10" rx="3" fill="#A0522D" />

            {/* Jar glass */}
            <path
              d="M45 40 L45 200 Q45 230 100 230 Q155 230 155 200 L155 40 Z"
              fill="rgba(255, 255, 255, 0.2)"
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="2"
            />

            {/* Glass shine */}
            <path
              d="M55 50 L55 180"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Notes inside jar */}
            {[...Array(Math.min(notes.length, 8))].map((_, i) => (
              <motion.rect
                key={i}
                x={60 + (i % 4) * 20}
                y={100 + Math.floor(i / 4) * 40 + Math.random() * 20}
                width="30"
                height="20"
                rx="2"
                fill={notes[i % notes.length].color}
                opacity={0.8}
                animate={{
                  y: [0, -3, 0],
                  rotate: [-5 + Math.random() * 10, 5 - Math.random() * 10]
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                style={{
                  transformOrigin: 'center',
                }}
              />
            ))}

            {/* Hearts decoration */}
            <text x="100" y="80" textAnchor="middle" fontSize="24">💕</text>
          </svg>

          {/* Tap hint */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FF69B4] text-white font-pixel text-xs px-3 py-1 rounded-full"
          >
            TAP ME
          </motion.div>
        </motion.div>

        {/* Note count */}
        <p className="font-pixel text-xs text-white/60 mt-4">
          {notes.length} notes in jar
        </p>

        {/* Add note button */}
        <button
          onClick={() => setShowAddNote(true)}
          className="mt-2 font-pixel text-xs text-[#FF69B4] hover:text-white transition-colors"
        >
          + add your own note
        </button>
      </div>

      {/* Revealed Note Modal */}
      <AnimatePresence>
        {revealedNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeNote}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180, y: 100 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              exit={{ scale: 0, rotate: 180, y: -100 }}
              transition={{ type: "spring", bounce: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              {/* Folded note paper */}
              <div
                className="w-72 p-6 rounded-lg shadow-2xl relative"
                style={{
                  background: `linear-gradient(135deg, ${revealedNote.color}33 0%, ${revealedNote.color}66 100%)`,
                  border: `2px solid ${revealedNote.color}`,
                }}
              >
                {/* Paper fold effect */}
                <div
                  className="absolute top-0 right-0 w-12 h-12"
                  style={{
                    background: `linear-gradient(135deg, transparent 50%, ${revealedNote.color}44 50%)`,
                  }}
                />

                {/* Note content */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-receipt text-lg text-white text-center leading-relaxed"
                >
                  "{revealedNote.text}"
                </motion.p>

                {/* Hearts decoration */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center gap-2 mt-4"
                >
                  <span>💝</span>
                  <span>💝</span>
                  <span>💝</span>
                </motion.div>

                {/* Close hint */}
                <p className="text-center font-pixel text-xs text-white/50 mt-4">
                  tap anywhere to close
                </p>
              </div>

              {/* Flying hearts */}
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-2xl"
                  initial={{ opacity: 1, scale: 0 }}
                  animate={{
                    opacity: [1, 0],
                    scale: [0, 1],
                    x: (Math.random() - 0.5) * 200,
                    y: -100 - Math.random() * 100,
                  }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                  style={{ top: '50%', left: '50%' }}
                >
                  💕
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Note Modal */}
      <AnimatePresence>
        {showAddNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddNote(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#008080] border-2 border-[#FF69B4] rounded-xl p-6 w-full max-w-sm"
            >
              <h3 className="font-pixel text-xl text-white text-center mb-4">
                ADD A NOTE 💌
              </h3>

              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Write something sweet (or chaotic)..."
                className="w-full h-24 px-4 py-3 bg-white/10 border-2 border-[#FF69B4]/50 rounded-lg font-receipt text-white placeholder-white/50 focus:outline-none focus:border-[#FF69B4] resize-none"
                maxLength={150}
              />

              <p className="text-right font-pixel text-xs text-white/50 mt-1">
                {newNoteText.length}/150
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowAddNote(false)}
                  className="flex-1 py-2 bg-white/10 text-white font-pixel rounded-lg hover:bg-white/20 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={addNote}
                  disabled={!newNoteText.trim()}
                  className="flex-1 py-2 bg-[#FF69B4] text-white font-pixel rounded-lg disabled:opacity-50 active:translate-y-0.5 transition-all"
                >
                  ADD 💝
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

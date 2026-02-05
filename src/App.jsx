import { useState, useCallback, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ShakeToUnlock from './components/ShakeToUnlock/ShakeToUnlock'
import ReceiptCard from './components/Receipt/ReceiptCard'
import ScratchReveal from './components/ScratchReveal/ScratchReveal'
import TimeCounter from './components/TimeCounter/TimeCounter'
import ShareButton from './components/ShareButton/ShareButton'
import Confetti from './components/Confetti/Confetti'
import LoveCoupons from './components/LoveCoupons/LoveCoupons'
import CompatibilityMeter from './components/CompatibilityMeter/CompatibilityMeter'
import LoveQuiz from './components/LoveQuiz/LoveQuiz'
import MemoryJar from './components/MemoryJar/MemoryJar'

/**
 * LOVE.ZIP - "Chaotic Cute" Valentine's App
 *
 * THE VIBE: Windows 95 desktop meets coquette meets unhinged Gen Z humor
 *
 * FEATURES:
 * 1. Shake to Unlock - Physical interaction lock screen
 * 2. Roast Receipt - Funny relationship stats
 * 3. Love Coupons - Swipeable redeemable cards (Tinder-style)
 * 4. Compatibility Meter - Dramatic name calculator
 * 5. Love Quiz - "How well do you know me?"
 * 6. Memory Jar - Tap to reveal love notes
 * 7. Scratch Card - Reveal secret message
 */

// Relationship data - customizable
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

// Navigation sections with emoji icons
const SECTIONS = [
  { id: 'home', label: '🏠', title: 'HOME' },
  { id: 'coupons', label: '🎟️', title: 'COUPONS' },
  { id: 'compatibility', label: '💕', title: 'MATCH' },
  { id: 'quiz', label: '❓', title: 'QUIZ' },
  { id: 'jar', label: '🫙', title: 'JAR' },
]

// Draggable sticker emojis - the chaos elements
const STICKER_EMOJIS = ['🎀', '💀', '🤡', '✨', '💅', '😭', '🚩', '💋']

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [currentSection, setCurrentSection] = useState('home')
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

  const handleSectionChange = (sectionId) => {
    setCurrentSection(sectionId)
    if (navigator.vibrate) {
      navigator.vibrate(20)
    }
  }

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
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="relative z-10 px-4 py-6 pb-32 min-h-screen"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", bounce: 0.5 }}
              className="text-center mb-4"
            >
              <h1 className="font-pixel text-4xl md:text-5xl text-white drop-shadow-[3px_3px_0px_#000] tracking-wider">
                LOVE.ZIP
              </h1>
              <p className="font-pixel text-sm text-[#FF69B4] drop-shadow-[2px_2px_0px_#000]">
                💀 THE ULTIMATE VALENTINE 💀
              </p>
            </motion.div>

            {/* Section Navigation - Bottom Tab Style */}
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center gap-1 sm:gap-2 mb-6 bg-black/40 backdrop-blur-sm rounded-2xl p-2 mx-auto max-w-fit"
            >
              {SECTIONS.map((section) => (
                <motion.button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  whileTap={{ scale: 0.9 }}
                  className={`relative px-3 py-2 rounded-xl font-pixel text-xs transition-all ${
                    currentSection === section.id
                      ? 'bg-[#FF69B4] text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-xl block">{section.label}</span>
                  <span className="text-[10px] hidden sm:block">{section.title}</span>

                  {/* Active indicator dot */}
                  {currentSection === section.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                    />
                  )}
                </motion.button>
              ))}
            </motion.nav>

            {/* Section Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSection}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                {currentSection === 'home' && (
                  <HomeSection
                    data={RELATIONSHIP_DATA}
                    scratchComplete={scratchComplete}
                    onScratchComplete={handleScratchComplete}
                  />
                )}

                {currentSection === 'coupons' && <LoveCoupons />}

                {currentSection === 'compatibility' && (
                  <CompatibilityMeter name1="" name2="" />
                )}

                {currentSection === 'quiz' && (
                  <LoveQuiz partnerName={RELATIONSHIP_DATA.partnerName} />
                )}

                {currentSection === 'jar' && <MemoryJar />}
              </motion.div>
            </AnimatePresence>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-center font-pixel text-xs text-white/40 mt-12"
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
 * Home Section - Receipt + Time Counter + Scratch + Share
 */
function HomeSection({ data, scratchComplete, onScratchComplete }) {
  return (
    <>
      {/* Time Counter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 text-center bg-black/50 px-4 py-2 border-2 border-white rounded-lg"
      >
        <p className="font-pixel text-xs text-[#00FF00]">TIME WASTED TOGETHER:</p>
        <TimeCounter startDate={data.startDate} />
      </motion.div>

      {/* Receipt */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ delay: 0.2, type: "spring", bounce: 0.3 }}
        id="receipt-for-export"
        className="relative"
      >
        <ReceiptCard
          partnerName={data.partnerName}
          startDate={data.startDate}
          stats={data.stats}
        />
        {/* Tape strips */}
        <div className="absolute -top-3 left-1/4 w-16 h-6 bg-[#FFE4B5]/80 rotate-[-5deg] shadow-sm" />
        <div className="absolute -top-2 right-1/4 w-14 h-5 bg-[#FFB6C1]/80 rotate-[8deg] shadow-sm" />
      </motion.div>

      {/* Scratch Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 w-full max-w-sm"
      >
        <p className="font-pixel text-center text-white drop-shadow-[2px_2px_0px_#000] mb-3 text-sm">
          {scratchComplete ? "THE VERDICT:" : ">>> SCRATCH 4 TRUTH <<<"}
        </p>
        <ScratchReveal
          message={data.secretMessage}
          onComplete={onScratchComplete}
        />
      </motion.div>

      {/* Share Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <ShareButton elementId="receipt-for-export" />
      </motion.div>
    </>
  )
}

/**
 * TiledBackground - Windows 95 teal with pixel heart pattern
 */
function TiledBackground() {
  return (
    <div
      className="fixed inset-0 z-0"
      style={{
        backgroundColor: '#008080',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 8 C25 8 20 12 20 18 C20 28 30 35 30 35 C30 35 40 28 40 18 C40 12 35 8 30 8' fill='%23FF69B4' opacity='0.15'/%3E%3Cpath d='M30 45 L25 50 L30 48 L35 50 Z' fill='%23FFB6C1' opacity='0.2'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />
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
 */
function DraggableStickers() {
  const stickers = useMemo(() => {
    return STICKER_EMOJIS.map((emoji, i) => ({
      id: i,
      emoji,
      initialX: i % 2 === 0 ? 10 + Math.random() * 30 : window.innerWidth - 50 - Math.random() * 30,
      initialY: 60 + (i * 70) + Math.random() * 20,
      rotation: Math.random() * 30 - 15,
      scale: 0.7 + Math.random() * 0.3,
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
 */
function Sticker({ emoji, initialX, initialY, rotation, scale }) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      whileDrag={{ scale: 1.2, rotate: rotation + 10, zIndex: 100 }}
      whileHover={{ scale: scale * 1.1, rotate: rotation + 5 }}
      whileTap={{ scale: 1.3 }}
      initial={{ x: initialX, y: initialY, rotate: rotation, scale: 0 }}
      animate={{ scale: scale, rotate: rotation }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay: Math.random() * 0.5 }}
      className="absolute text-3xl md:text-4xl cursor-grab pointer-events-auto select-none"
      style={{ filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.3))' }}
    >
      {emoji}
    </motion.div>
  )
}

export default App

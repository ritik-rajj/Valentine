import { useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'

/**
 * LoveCoupons - Swipeable Coupon Cards
 *
 * VIRAL FACTOR: Tinder-style swiping is addictive AF.
 * Each coupon is a "redeemable" promise - funny/chaotic ones
 * that people will screenshot and send to their partner.
 *
 * Swipe right = "Redeem" (saved)
 * Swipe left = "Save for later"
 */

const COUPONS = [
  {
    id: 1,
    title: "1 FREE ARGUMENT WIN",
    description: "Use this when ur losing badly",
    emoji: "🏆",
    color: "#FF69B4",
    terms: "Cannot be used during actual serious fights lol"
  },
  {
    id: 2,
    title: "SKIP 1 FAMILY EVENT",
    description: "No questions asked",
    emoji: "🏃",
    color: "#8B5CF6",
    terms: "Valid for boring ones only. Holidays excluded."
  },
  {
    id: 3,
    title: "BREAKFAST IN BED",
    description: "I'll even make it edible (maybe)",
    emoji: "🍳",
    color: "#F59E0B",
    terms: "Don't blame me if it's just cereal"
  },
  {
    id: 4,
    title: "24HR NO NAGGING",
    description: "I'll pretend everything is fine",
    emoji: "🤐",
    color: "#10B981",
    terms: "Timer starts when you wake up"
  },
  {
    id: 5,
    title: "PICK THE MOVIE",
    description: "Even if it's that one again",
    emoji: "🎬",
    color: "#3B82F6",
    terms: "I reserve the right to fall asleep"
  },
  {
    id: 6,
    title: "INFINITE HUGS",
    description: "No cooldown period",
    emoji: "🤗",
    color: "#EC4899",
    terms: "May include aggressive squeezing"
  },
  {
    id: 7,
    title: "ADMIT I WAS WRONG",
    description: "(Even if I wasn't)",
    emoji: "😇",
    color: "#6366F1",
    terms: "One time use. Don't push it."
  },
  {
    id: 8,
    title: "MIDNIGHT SNACK RUN",
    description: "I'll get whatever u want",
    emoji: "🌙",
    color: "#8B0000",
    terms: "Within 10 mile radius pls"
  },
]

export default function LoveCoupons() {
  const [cards, setCards] = useState(COUPONS)
  const [redeemed, setRedeemed] = useState([])
  const [lastAction, setLastAction] = useState(null)

  const removeCard = (id, action) => {
    setLastAction(action)
    if (action === 'redeem') {
      setRedeemed(prev => [...prev, cards.find(c => c.id === id)])
    }
    setCards(prev => prev.filter(card => card.id !== id))

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(action === 'redeem' ? [50, 30, 50] : 30)
    }
  }

  const resetCards = () => {
    setCards(COUPONS)
    setRedeemed([])
    setLastAction(null)
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="font-pixel text-2xl text-white drop-shadow-[2px_2px_0px_#000]">
          LOVE COUPONS
        </h2>
        <p className="font-pixel text-sm text-[#FF69B4] drop-shadow-[1px_1px_0px_#000]">
          swipe right to redeem 💅
        </p>
      </div>

      {/* Card Stack */}
      <div className="relative h-80 w-full">
        <AnimatePresence>
          {cards.length > 0 ? (
            cards.map((card, index) => (
              <CouponCard
                key={card.id}
                card={card}
                index={index}
                totalCards={cards.length}
                onRemove={removeCard}
              />
            )).reverse()
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <span className="text-6xl mb-4">💝</span>
              <p className="font-pixel text-white text-center">
                All coupons revealed!
              </p>
              <p className="font-pixel text-sm text-[#00FF00] mt-2">
                {redeemed.length} redeemed
              </p>
              <button
                onClick={resetCards}
                className="mt-4 px-6 py-2 bg-[#FF69B4] text-white font-pixel rounded-lg shadow-brutal-sm active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              >
                SHUFFLE AGAIN
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action indicators */}
      <div className="flex justify-between px-8 mt-4">
        <div className="text-center">
          <span className="text-2xl">👈</span>
          <p className="font-pixel text-xs text-white/60">save</p>
        </div>
        <div className="text-center">
          <span className="text-2xl">👉</span>
          <p className="font-pixel text-xs text-[#00FF00]">REDEEM</p>
        </div>
      </div>

      {/* Redeemed counter */}
      {redeemed.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <p className="font-pixel text-xs text-white/60">
            Coupons redeemed: <span className="text-[#FF69B4]">{redeemed.length}</span>
          </p>
        </motion.div>
      )}
    </div>
  )
}

/**
 * Individual Coupon Card with Tinder-style swipe
 */
function CouponCard({ card, index, totalCards, onRemove }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5])

  // Swipe direction indicators
  const redeemOpacity = useTransform(x, [0, 100], [0, 1])
  const saveOpacity = useTransform(x, [-100, 0], [1, 0])

  const handleDragEnd = (_, info) => {
    const swipeThreshold = 100
    if (info.offset.x > swipeThreshold) {
      onRemove(card.id, 'redeem')
    } else if (info.offset.x < -swipeThreshold) {
      onRemove(card.id, 'save')
    }
  }

  // Only the top card is draggable
  const isTop = index === totalCards - 1

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        opacity,
        zIndex: index,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, y: 10 }}
      animate={{
        scale: 1 - (totalCards - 1 - index) * 0.05,
        y: (totalCards - 1 - index) * 8,
      }}
      exit={{
        x: x.get() > 0 ? 300 : -300,
        opacity: 0,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 1.02 }}
    >
      {/* Card content */}
      <div
        className="w-full h-full rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${card.color}22 0%, ${card.color}44 100%)`,
          border: `3px dashed ${card.color}`,
          boxShadow: `4px 4px 0 0 ${card.color}66`,
        }}
      >
        {/* Redeem indicator */}
        <motion.div
          className="absolute top-4 right-4 bg-[#00FF00] text-black font-pixel text-xs px-2 py-1 rounded rotate-12"
          style={{ opacity: redeemOpacity }}
        >
          REDEEMED!
        </motion.div>

        {/* Save indicator */}
        <motion.div
          className="absolute top-4 left-4 bg-white/80 text-black font-pixel text-xs px-2 py-1 rounded -rotate-12"
          style={{ opacity: saveOpacity }}
        >
          SAVED
        </motion.div>

        {/* Coupon content */}
        <span className="text-5xl mb-3">{card.emoji}</span>
        <h3 className="font-pixel text-xl text-white drop-shadow-[2px_2px_0px_#000] mb-2">
          {card.title}
        </h3>
        <p className="font-receipt text-sm text-white/80 mb-4">
          {card.description}
        </p>

        {/* Terms */}
        <div className="absolute bottom-4 left-4 right-4">
          <p className="font-receipt text-[10px] text-white/50 italic">
            *{card.terms}
          </p>
        </div>

        {/* Decorative corners */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white/30" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white/30" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white/30" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white/30" />
      </div>
    </motion.div>
  )
}

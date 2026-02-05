import { motion } from 'framer-motion'

/**
 * ReceiptCard - "The Roast Receipt" Edition
 *
 * DESIGN: Same thermal paper aesthetic but with CHAOTIC energy
 * - Funny/roasting stats instead of generic romantic
 * - "Toxic but obsessed" love level
 * - Gen Z humor throughout
 *
 * This is THE shareable element. The roast factor = virality.
 */

export default function ReceiptCard({ partnerName, startDate, stats }) {
  const formattedDate = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  const receiptNumber = generateReceiptNumber(startDate)

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Top serrated edge */}
      <SerratedEdge position="top" />

      {/* Main receipt body */}
      <div className="receipt-paper px-6 py-8 border-l-2 border-r-2 border-[#8B0000]/10">
        {/* Header */}
        <header className="text-center border-b-2 border-dashed border-[#8B0000]/30 pb-4 mb-4">
          {/* Logo/Title - more chaotic */}
          <motion.h1
            className="font-display font-extrabold text-3xl text-[#8B0000] tracking-tight"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            LOVE.ZIP
          </motion.h1>
          <p className="text-[#8B0000]/60 text-xs mt-1 tracking-widest">
            ✨ THE EXPOSÉ ✨
          </p>

          {/* Chaos emojis */}
          <motion.div
            className="flex justify-center gap-2 mt-2 text-xl"
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span>🎀</span>
            <span>💀</span>
            <span>🎀</span>
          </motion.div>
        </header>

        {/* Receipt metadata */}
        <div className="font-receipt text-xs text-[#8B0000]/70 space-y-1 mb-6">
          <div className="flex justify-between">
            <span>DATE:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>CASE #:</span>
            <span>{receiptNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>SUSPECT:</span>
            <span className="font-bold">{partnerName.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span>CRIME STARTED:</span>
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-[#8B0000]/30 my-4" />

        {/* Stats items - THE ROAST */}
        <div className="space-y-3">
          <p className="text-[#8B0000]/60 text-xs tracking-widest text-center mb-3">
            -- CHARGES FILED --
          </p>

          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.1 + index * 0.1,
                type: "spring",
                stiffness: 100
              }}
            >
              <ReceiptLineItem stat={stat} />
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-[#8B0000]/30 my-4" />

        {/* Total section - THE VERDICT */}
        <div className="font-receipt">
          <div className="flex justify-between text-sm font-bold text-[#8B0000]">
            <span>LOVE LEVEL:</span>
            <motion.span
              className="text-[#FF69B4]"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Toxic but obsessed 🎀
            </motion.span>
          </div>
          <div className="flex justify-between text-xs text-[#8B0000]/70 mt-2">
            <span>VERDICT:</span>
            <span className="text-[#FF69B4] font-bold">GUILTY of being cute</span>
          </div>
          <div className="flex justify-between text-xs text-[#8B0000]/70 mt-1">
            <span>SENTENCE:</span>
            <span className="font-bold">LIFE (no parole)</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#8B0000]/20 my-4" />

        {/* Footer message - chaotic */}
        <footer className="text-center">
          <p className="text-[#8B0000]/60 text-xs italic mb-1">
            "I hate how much I love u"
          </p>
          <p className="text-[#8B0000]/40 text-[10px] mb-3">
            - the management
          </p>

          {/* Barcode */}
          <Barcode data={receiptNumber} />

          {/* Receipt number under barcode */}
          <p className="text-[#8B0000]/40 text-[10px] mt-2 tracking-[0.3em]">
            {receiptNumber}
          </p>

          {/* Extra chaotic detail */}
          <p className="text-[#FF69B4]/60 text-[8px] mt-2 font-bold">
            NO REFUNDS • NO EXCHANGES • UR STUCK W ME
          </p>
        </footer>
      </div>

      {/* Bottom serrated edge */}
      <SerratedEdge position="bottom" />

      {/* Paper shadow */}
      <div
        className="absolute -z-10 inset-x-2 bottom-0 h-4 bg-[#8B0000]/10 blur-md rounded-b-lg"
        style={{ transform: 'translateY(8px)' }}
      />
    </div>
  )
}

/**
 * ReceiptLineItem - Individual stat row with roast styling
 */
function ReceiptLineItem({ stat }) {
  return (
    <div className="font-receipt text-sm text-[#8B0000] flex items-center gap-2">
      {/* Icon */}
      <span className="text-base flex-shrink-0">{stat.icon}</span>

      {/* Label with dot leaders */}
      <span className="flex-grow flex items-baseline">
        <span className="whitespace-nowrap">{stat.label}</span>
        <span className="flex-grow border-b border-dotted border-[#8B0000]/30 mx-1" />
      </span>

      {/* Value */}
      <span className="font-bold text-[#FF69B4] flex-shrink-0">{stat.value}</span>

      {/* Subtext if exists */}
      {stat.subtext && (
        <span className="text-[10px] text-[#8B0000]/50 whitespace-nowrap">
          {stat.subtext}
        </span>
      )}
    </div>
  )
}

/**
 * SerratedEdge - Torn paper edge
 */
function SerratedEdge({ position }) {
  const isTop = position === 'top'

  return (
    <svg
      className="w-full h-4"
      viewBox="0 0 320 16"
      preserveAspectRatio="none"
      style={{
        transform: isTop ? 'rotate(180deg)' : 'none'
      }}
    >
      <defs>
        <linearGradient id={`paperGrad-${position}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF5EE" />
          <stop offset="100%" stopColor="#FFFAF5" />
        </linearGradient>
      </defs>

      <path
        d={generateSerratedPath(320, 16, 8)}
        fill={`url(#paperGrad-${position})`}
        stroke="rgba(139, 0, 0, 0.1)"
        strokeWidth="1"
      />
    </svg>
  )
}

/**
 * Barcode - Decorative receipt barcode
 */
function Barcode({ data }) {
  const bars = data.split('').map((char, i) => {
    const code = char.charCodeAt(0)
    return {
      id: i,
      width: (code % 3) + 1,
      gap: (code % 2) + 1
    }
  })

  return (
    <div className="flex justify-center items-end h-10 gap-px">
      {bars.map((bar) => (
        <div
          key={bar.id}
          className="bg-[#8B0000]"
          style={{
            width: `${bar.width}px`,
            height: `${20 + (bar.width * 5)}px`,
            marginRight: `${bar.gap}px`
          }}
        />
      ))}
    </div>
  )
}

/**
 * Generate receipt number from start date
 * Format: LZ-YYYYMMDD-XXXX
 */
function generateReceiptNumber(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')

  return `LZ-${year}${month}${day}-${random}`
}

/**
 * Generate serrated edge SVG path
 */
function generateSerratedPath(width, height, teeth) {
  const toothWidth = width / teeth
  let path = `M 0 ${height}`

  for (let i = 0; i < teeth; i++) {
    const x1 = i * toothWidth + toothWidth / 2
    const x2 = (i + 1) * toothWidth
    path += ` L ${x1} 0 L ${x2} ${height}`
  }

  path += ` L ${width} ${height} Z`
  return path
}

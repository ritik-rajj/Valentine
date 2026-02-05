import { motion } from 'framer-motion'

/**
 * ReceiptCard - Thermal Paper Receipt Component
 *
 * DESIGN PHILOSOPHY:
 * - Mimics actual thermal paper receipts (slightly off-white, thin lines)
 * - Serrated edges at top/bottom for authentic "tear-off" look
 * - Monospace font for that POS printer aesthetic
 * - Subtle paper texture effect
 *
 * This is the core "shareable" element - must look perfect in screenshots.
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
          {/* Logo/Title */}
          <motion.h1
            className="font-display font-extrabold text-3xl text-[#8B0000] tracking-tight"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            LOVE.ZIP
          </motion.h1>
          <p className="text-[#8B0000]/60 text-xs mt-1 tracking-widest">
            RELATIONSHIP RECEIPT
          </p>

          {/* Decorative bow */}
          <motion.span
            className="inline-block text-2xl mt-2"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🎀
          </motion.span>
        </header>

        {/* Receipt metadata */}
        <div className="font-receipt text-xs text-[#8B0000]/70 space-y-1 mb-6">
          <div className="flex justify-between">
            <span>DATE:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>RECEIPT #:</span>
            <span>{receiptNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>CUSTOMER:</span>
            <span className="font-bold">{partnerName.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span>SINCE:</span>
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-[#8B0000]/30 my-4" />

        {/* Stats items */}
        <div className="space-y-3">
          <p className="text-[#8B0000]/60 text-xs tracking-widest text-center mb-3">
            -- RELATIONSHIP STATS --
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

        {/* Total section */}
        <div className="font-receipt">
          <div className="flex justify-between text-sm font-bold text-[#8B0000]">
            <span>LOVE LEVEL:</span>
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ∞ / ∞
            </motion.span>
          </div>
          <div className="flex justify-between text-xs text-[#8B0000]/70 mt-1">
            <span>STATUS:</span>
            <span className="text-[#FF69B4] font-bold">FOREVER</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#8B0000]/20 my-4" />

        {/* Footer message */}
        <footer className="text-center">
          <p className="text-[#8B0000]/60 text-xs italic mb-3">
            "Thank you for choosing me."
          </p>

          {/* Barcode */}
          <Barcode data={receiptNumber} />

          {/* Receipt number under barcode */}
          <p className="text-[#8B0000]/40 text-[10px] mt-2 tracking-[0.3em]">
            {receiptNumber}
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
 * ReceiptLineItem - Individual stat row
 *
 * Styled like actual receipt items with dots between label and value.
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
 * SerratedEdge - Realistic torn paper edge
 *
 * Creates the characteristic zig-zag pattern of thermal paper.
 * Uses SVG for crisp rendering at any scale.
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
        {/* Paper gradient to match receipt body */}
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
 *
 * Generates pseudo-random bars based on receipt number for visual consistency.
 * Not a real scannable barcode, just for aesthetic.
 */
function Barcode({ data }) {
  // Generate bar widths from data string
  const bars = data.split('').map((char, i) => {
    const code = char.charCodeAt(0)
    return {
      id: i,
      width: (code % 3) + 1, // 1-3 width
      gap: (code % 2) + 1    // 1-2 gap
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

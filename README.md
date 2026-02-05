# Love.zip 💝

A viral Valentine's Day web app that generates "Relationship Receipts" — shareable, Instagram-ready digital love letters with a twist.

## The Concept

**"Soft Neo-Brutalism" meets "Coquette" meets "Y2K aesthetics"**

Send your partner a link. They shake their phone to unlock a personalized receipt of your relationship stats, scratch to reveal a secret message, and export it directly to Instagram Stories.

## Features

### 🔐 Shake to Unlock
- Physical interaction using DeviceMotion API
- Heart "cracks" progressively with each shake
- Dramatic shatter animation on unlock
- Desktop fallback with rapid mouse movement

### 🧾 Relationship Receipt
- Thermal paper aesthetic with serrated edges
- Customizable relationship stats
- Real-time "Time Together" counter (down to milliseconds)
- Decorative barcode generation

### ✨ Scratch Card
- Canvas-based scratch-off overlay
- Haptic feedback on touch
- Progress tracking with completion trigger
- Physics-based confetti celebration

### 📸 Instagram Stories Export
- One-tap export to 9:16 format (1080x1920)
- Web Share API support on mobile
- Automatic fallback to download
- Branded watermark for organic spread

## Tech Stack

- **React 19** - UI components
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **html2canvas** - Screenshot generation

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── ShakeToUnlock/    # Lock screen with shake detection
│   ├── Receipt/          # Thermal paper receipt card
│   ├── ScratchReveal/    # Canvas scratch card
│   ├── TimeCounter/      # Millisecond precision timer
│   ├── ShareButton/      # Instagram export
│   └── Confetti/         # Physics celebration
├── hooks/
│   └── useShake.js       # DeviceMotion detection
├── App.jsx               # Main orchestrator
└── index.css             # Global styles + animations
```

## Customization

Edit the `RELATIONSHIP_DATA` object in `src/App.jsx`:

```javascript
const RELATIONSHIP_DATA = {
  partnerName: "Babe",
  startDate: new Date('2023-02-14'),
  stats: [
    { label: "Hugs Given", value: "∞", icon: "🤗" },
    // ... more stats
  ],
  secretMessage: "You're my favorite notification ❤️"
}
```

## Design System

| Element | Value |
|---------|-------|
| Background | `#FFF0F5` (Lavender Blush) |
| Primary Text | `#8B0000` (Dark Red) |
| Accent | `#FF69B4` (Hot Pink) |
| Display Font | Syne |
| Receipt Font | Courier Prime |

## Mobile Testing

The shake detection requires HTTPS on mobile. For local testing:

```bash
# Use ngrok or similar to expose local server
npx ngrok http 5173
```

Then open the ngrok URL on your phone.

## License

MIT

---

*Made with 💝 for Valentine's Day*

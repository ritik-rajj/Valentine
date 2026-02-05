import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * LoveQuiz - "How Well Do You Know Me?" Quiz
 *
 * VIRAL FACTOR: Couples LOVE testing each other.
 * The questions are funny/unhinged, and the scoring
 * is roast-y enough to screenshot and share.
 *
 * Partner fills this out about you, gets roasted based on score.
 */

const QUESTIONS = [
  {
    id: 1,
    question: "What's my go-to comfort food when I'm sad?",
    options: ["Pizza", "Ice cream", "Anything with cheese", "Your cooking (lie)"],
    correct: 2, // "Anything with cheese" is always right
    points: 10
  },
  {
    id: 2,
    question: "What do I do when I'm mad at you?",
    options: ["Silent treatment", "Aggressive texting", "Eat your snacks", "All of the above"],
    correct: 3,
    points: 15
  },
  {
    id: 3,
    question: "What's my toxic trait?",
    options: ["Overthinking texts", "Starting fights for fun", "Being always right", "All of them tbh"],
    correct: 3,
    points: 20
  },
  {
    id: 4,
    question: "How many times have I almost broken up over something dumb?",
    options: ["0 (we're healthy)", "1-3 times", "Lost count", "Currently considering it"],
    correct: 2,
    points: 15
  },
  {
    id: 5,
    question: "What's my love language?",
    options: ["Quality time", "Acts of service", "Buying me food", "Attention 24/7"],
    correct: 2,
    points: 20
  },
  {
    id: 6,
    question: "What would I choose?",
    options: ["You or my phone", "You or sleep", "You or food", "Trick question - I want it all"],
    correct: 3,
    points: 20
  },
]

const RESULTS = [
  { min: 90, title: "SOULMATE CERTIFIED", emoji: "💫", roast: "Ok you actually know me... suspicious. Are you stalking me?" },
  { min: 70, title: "PRETTY GOOD BESTIE", emoji: "💅", roast: "You passed but like... barely. Study harder next time." },
  { min: 50, title: "MID PERFORMANCE", emoji: "😬", roast: "Do you even listen when I talk? Be honest." },
  { min: 0, title: "WHO ARE YOU", emoji: "💀", roast: "At this point we're just two strangers who kiss sometimes" },
]

export default function LoveQuiz({ partnerName = "Babe" }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const question = QUESTIONS[currentQuestion]
  const progress = ((currentQuestion) / QUESTIONS.length) * 100

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex)

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(30)
    }

    // Delay before moving to next question
    setTimeout(() => {
      const isCorrect = answerIndex === question.correct
      setAnswers(prev => [...prev, { questionId: question.id, answer: answerIndex, isCorrect, points: isCorrect ? question.points : 0 }])

      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1)
        setSelectedAnswer(null)
      } else {
        setShowResult(true)
        if (navigator.vibrate) {
          navigator.vibrate([50, 30, 50, 30, 100])
        }
      }
    }, 500)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResult(false)
    setSelectedAnswer(null)
  }

  const totalScore = answers.reduce((sum, a) => sum + a.points, 0)
  const maxScore = QUESTIONS.reduce((sum, q) => sum + q.points, 0)
  const percentage = Math.round((totalScore / maxScore) * 100)
  const result = RESULTS.find(r => percentage >= r.min)

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="font-pixel text-2xl text-white drop-shadow-[2px_2px_0px_#000]">
          DO YOU KNOW ME?
        </h2>
        <p className="font-pixel text-sm text-[#FF69B4] drop-shadow-[1px_1px_0px_#000]">
          let's find out bestie 🔍
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key={`question-${currentQuestion}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-pixel text-white/60 mb-1">
                <span>Q{currentQuestion + 1}/{QUESTIONS.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#FF69B4]"
                  initial={{ width: `${progress}%` }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Question card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-[#FF69B4]/50">
              <p className="font-pixel text-lg text-white text-center mb-6">
                {question.question}
              </p>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 px-4 rounded-lg font-receipt text-sm text-left transition-all ${
                      selectedAnswer === index
                        ? index === question.correct
                          ? 'bg-green-500/50 border-2 border-green-400'
                          : 'bg-red-500/50 border-2 border-red-400'
                        : selectedAnswer !== null && index === question.correct
                          ? 'bg-green-500/30 border-2 border-green-400/50'
                          : 'bg-white/10 border-2 border-white/20 hover:border-[#FF69B4] hover:bg-white/20'
                    }`}
                  >
                    <span className="text-white/60 mr-2">{String.fromCharCode(65 + index)}.</span>
                    <span className="text-white">{option}</span>

                    {selectedAnswer !== null && index === question.correct && (
                      <span className="float-right">✓</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="text-center"
          >
            {/* Result card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-[#FF69B4]">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-6xl block mb-4"
              >
                {result.emoji}
              </motion.span>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="font-pixel text-5xl text-white drop-shadow-[3px_3px_0px_#000] mb-2">
                  {percentage}%
                </div>
                <h3 className="font-pixel text-xl text-[#FF69B4] mb-3">
                  {result.title}
                </h3>
              </motion.div>

              {/* Score breakdown */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-black/20 rounded-lg p-3 mb-4"
              >
                <p className="font-receipt text-sm text-white/80">
                  {result.roast}
                </p>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex justify-around text-center border-t border-white/20 pt-4"
              >
                <div>
                  <p className="font-pixel text-2xl text-[#00FF00]">
                    {answers.filter(a => a.isCorrect).length}
                  </p>
                  <p className="font-pixel text-xs text-white/60">CORRECT</p>
                </div>
                <div>
                  <p className="font-pixel text-2xl text-[#FF6B6B]">
                    {answers.filter(a => !a.isCorrect).length}
                  </p>
                  <p className="font-pixel text-xs text-white/60">WRONG</p>
                </div>
                <div>
                  <p className="font-pixel text-2xl text-white">
                    {totalScore}
                  </p>
                  <p className="font-pixel text-xs text-white/60">POINTS</p>
                </div>
              </motion.div>
            </div>

            {/* Retry button */}
            <motion.button
              onClick={resetQuiz}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 px-8 py-3 bg-[#FF69B4] text-white font-pixel rounded-lg shadow-brutal-sm active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            >
              TRY AGAIN 🔄
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

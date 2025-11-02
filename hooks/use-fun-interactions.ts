import { useEffect, useState, useCallback } from 'react'

interface FunInteractionConfig {
  onKonamiCode?: () => void
  onTripleClick?: () => void
  onLongHover?: (element: string) => void
}

// Classic Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a'
]

export function useFunInteractions(config: FunInteractionConfig) {
  const [konamiProgress, setKonamiProgress] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null)

  // Konami Code detector
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key

      if (key === KONAMI_CODE[konamiProgress]) {
        const newProgress = konamiProgress + 1
        setKonamiProgress(newProgress)

        if (newProgress === KONAMI_CODE.length) {
          config.onKonamiCode?.()
          setKonamiProgress(0)
        }
      } else {
        setKonamiProgress(0)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [konamiProgress, config])

  // Triple click detector
  const handleClick = useCallback(() => {
    if (clickTimer) {
      clearTimeout(clickTimer)
    }

    const newCount = clickCount + 1
    setClickCount(newCount)

    if (newCount === 3) {
      config.onTripleClick?.()
      setClickCount(0)
      return
    }

    const timer = setTimeout(() => {
      setClickCount(0)
    }, 500)
    setClickTimer(timer)
  }, [clickCount, clickTimer, config])

  return {
    handleTripleClick: handleClick,
    konamiProgress
  }
}

// Fun random messages
export function useRandomFunFact() {
  const funFacts = [
    "💡 Did you know? AI can't actually read minds... yet!",
    "🚀 Fun fact: You're using cutting-edge AI readiness tech!",
    "🎯 Pro tip: Use keyboard shortcuts to work 10x faster!",
    "☕ Remember: Great insights require great coffee!",
    "🧠 Brain teaser: AI stands for... you know this!",
    "⚡ Speed run: Try navigating using only your keyboard!",
    "🎨 Design tip: Dark mode is easier on the eyes at night!",
    "📊 Data wisdom: The best insights come from asking questions!",
    "🎪 Easter egg: Try the Konami code... 👀",
    "🌟 You're doing great! Keep exploring!"
  ]

  const [fact] = useState(() => 
    funFacts[Math.floor(Math.random() * funFacts.length)]
  )

  return fact
}



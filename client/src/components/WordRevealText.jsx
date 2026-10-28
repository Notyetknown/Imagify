import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'

const wordVariants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: ({ duration }) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const WordRevealText = ({
  text,
  as = 'p',
  className = '',
  delay = 0,
  stagger = 0.055,
  duration = 0.48,
  once = true,
  accentWords = [],
  replayKey,
}) => {
  const reduceMotion = useReducedMotion()
  const motionEnabled = reduceMotion === false && typeof IntersectionObserver !== 'undefined'
  const elementRef = useRef(null)
  const hasCompletedRef = useRef(false)
  const [fallbackVisible, setFallbackVisible] = useState(false)
  const inView = useInView(elementRef, {
    once,
    amount: 0.18,
    margin: '0px 0px -40px 0px',
  })
  const MotionTag = motion[as] || motion.div
  const accents = new Set(accentWords.map((word) => word.toLowerCase()))
  const tokens = text.split(/(\s+)/)

  useEffect(() => {
    if (!motionEnabled || !inView || hasCompletedRef.current) return undefined

    const timeout = window.setTimeout(() => setFallbackVisible(true), 1800)
    return () => window.clearTimeout(timeout)
  }, [inView, motionEnabled])

  return (
    <MotionTag
      ref={elementRef}
      key={replayKey}
      className={className}
      aria-label={text}
      initial={motionEnabled ? 'hidden' : false}
      animate={motionEnabled ? (inView || fallbackVisible ? 'visible' : 'hidden') : undefined}
      onAnimationComplete={(definition) => {
        if (definition === 'visible') hasCompletedRef.current = true
      }}
      variants={{
        hidden: {},
        visible: { transition: { delayChildren: delay, staggerChildren: stagger } },
      }}
    >
      {tokens.map((token, index) => {
        if (!token.trim()) return token
        const normalized = token.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')

        return (
          <motion.span
            key={`${token}-${index}`}
            className={`word-reveal__word${accents.has(normalized) ? ' word-reveal__word--accent' : ''}`}
            aria-hidden="true"
            variants={wordVariants}
            custom={{ duration }}
          >
            {token}
          </motion.span>
        )
      })}
    </MotionTag>
  )
}

export default WordRevealText

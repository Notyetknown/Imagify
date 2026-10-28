import { useEffect, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'motion/react'

const KineticReelText = ({
  prefix = 'Create',
  items,
  interval = 2000,
  className = '',
}) => {
  const reduceMotion = useReducedMotion()
  const motionEnabled = reduceMotion === false
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!motionEnabled || items.length < 2) return undefined

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % items.length)
    }, interval)

    return () => window.clearInterval(timer)
  }, [interval, items.length, motionEnabled])

  if (!items.length) return null

  const longestItem = items.reduce((longest, item) => (
    item.length > longest.length ? item : longest
  ), '')
  const item = motionEnabled ? items[activeIndex % items.length] : items[0]

  return (
    <div className={`kinetic-lockup ${className}`}>
      <span className="kinetic-prefix">{prefix}</span>
      <span className="kinetic-reel" aria-hidden="true">
        <span className="kinetic-reel__sizer">{longestItem}</span>
        {!motionEnabled ? (
          <span className="kinetic-reel__static">{item}</span>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              className="kinetic-reel__active"
              key={item}
              initial={{ opacity: 0, y: '70%', rotateX: -22, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: '-70%', rotateX: 22, filter: 'blur(4px)' }}
              transition={{ type: 'spring', stiffness: 150, damping: 22, mass: 0.8 }}
            >
              {item}
            </motion.span>
          </AnimatePresence>
        )}
      </span>
      <span className="sr-only">
        {prefix} {items.join(', ')}
      </span>
    </div>
  )
}

export default KineticReelText

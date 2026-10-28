import { useEffect, useRef } from 'react'
import { motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion } from 'motion/react'

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value))

const normalizePosition = (position, width) => {
  if (!width) return 0
  return ((position % width) + width) % width - width
}

const MarqueeRow = ({ text, direction, tone, speed, reducedMotion }) => {
  const viewportRef = useRef(null)
  const groupRef = useRef(null)
  const widthRef = useRef(0)
  const dragRef = useRef(null)
  const velocityRef = useRef(0)
  const x = useMotionValue(0)
  const inView = useInView(viewportRef, { amount: 0.05 })

  useAnimationFrame((_time, delta) => {
    if (reducedMotion || !inView || dragRef.current || !widthRef.current) return

    const elapsed = Math.min(delta, 48) / 1000
    const inertialSpeed = velocityRef.current
    const nextPosition = x.get() + (direction * speed + inertialSpeed) * elapsed
    x.set(normalizePosition(nextPosition, widthRef.current))
    velocityRef.current *= Math.exp(-delta / 420)
  })

  useEffect(() => {
    const node = groupRef.current
    if (!node) return undefined

    const measure = () => {
      widthRef.current = node.offsetWidth
      x.set(normalizePosition(x.get(), widthRef.current))
    }

    measure()
    if (typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [x])

  const startDrag = (event) => {
    if (reducedMotion || event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, time: event.timeStamp }
    velocityRef.current = 0
  }

  const moveDrag = (event) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const distance = event.clientX - drag.x
    const elapsed = Math.max(1, event.timeStamp - drag.time)
    x.set(normalizePosition(x.get() + distance, widthRef.current))
    velocityRef.current = clamp((distance / elapsed) * 1000, -1100, 1100)
    dragRef.current = { ...drag, x: event.clientX, time: event.timeStamp }
  }

  const endDrag = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return
    dragRef.current = null
  }

  return (
    <div
      ref={viewportRef}
      className={`velocity-marquee__viewport velocity-marquee__viewport--${tone}`}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
    >
      <motion.div
        className="velocity-marquee__track"
        style={{ x }}
        aria-hidden="true"
      >
        <span className="velocity-marquee__group" ref={groupRef}>
          {text}
          <span className="velocity-marquee__separator">✦</span>
          {text}
          <span className="velocity-marquee__separator">✦</span>
        </span>
        <span className="velocity-marquee__group" aria-hidden="true">
          {text}
          <span className="velocity-marquee__separator">✦</span>
          {text}
          <span className="velocity-marquee__separator">✦</span>
        </span>
      </motion.div>
    </div>
  )
}

const VelocityMarquee = () => {
  const reduceMotion = useReducedMotion()
  const motionEnabled = reduceMotion === false

  return (
    <section className="velocity-marquee" aria-label="Creative possibilities">
      <p className="sr-only">Dream it. Generate it. Visualize the impossible.</p>
      {!motionEnabled ? (
        <div className="velocity-marquee__static" aria-hidden="true">
          <span>CREATE WITHOUT LIMITS</span>
          <span>IMAGINATION IN MOTION</span>
        </div>
      ) : (
        <>
          <MarqueeRow
            text="CREATE WITHOUT LIMITS"
            direction={-1}
            tone="light"
            speed={46}
            reducedMotion={!motionEnabled}
          />
          <MarqueeRow
            text="IMAGINATION IN MOTION"
            direction={1}
            tone="lavender"
            speed={34}
            reducedMotion={!motionEnabled}
          />
        </>
      )}
    </section>
  )
}

export default VelocityMarquee

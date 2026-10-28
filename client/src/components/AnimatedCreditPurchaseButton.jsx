import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const ANIMATION_DURATION = 1050
const RESET_DELAY = 2400

const AnimatedCreditPurchaseButton = ({
  planId,
  onStart,
  onConfirm,
  onSignIn,
  authenticated,
  disabled = false,
}) => {
  const [phase, setPhase] = useState('idle')
  const [progress, setProgress] = useState(0)
  const phaseRef = useRef('idle')
  const frameRef = useRef(0)
  const resetTimeoutRef = useRef(0)
  const mountedRef = useRef(false)
  const confirmRef = useRef(onConfirm)
  const startRef = useRef(onStart)
  const signInRef = useRef(onSignIn)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    confirmRef.current = onConfirm
    startRef.current = onStart
    signInRef.current = onSignIn
  }, [onConfirm, onSignIn, onStart])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      cancelAnimationFrame(frameRef.current)
      window.clearTimeout(resetTimeoutRef.current)
    }
  }, [])

  const updatePhase = (nextPhase) => {
    phaseRef.current = nextPhase
    if (mountedRef.current) setPhase(nextPhase)
  }

  const resetPhaseLater = (delay = RESET_DELAY) => {
    resetTimeoutRef.current = window.setTimeout(() => {
      if (!mountedRef.current) return
      setProgress(0)
      updatePhase('idle')
    }, delay)
  }

  const confirmPurchase = async () => {
    updatePhase('processing')

    try {
      const result = await confirmRef.current(planId)
      if (!mountedRef.current) return

      if (result?.success) {
        setProgress(1)
        updatePhase('success')
      } else {
        updatePhase(result?.cancelled ? 'cancelled' : 'error')
      }
      resetPhaseLater()
    } catch {
      if (!mountedRef.current) return
      updatePhase('error')
      resetPhaseLater()
    }
  }

  const runAnimation = () => {
    const startedAt = performance.now()
    const tick = (now) => {
      if (!mountedRef.current) return
      const elapsed = Math.min(1, (now - startedAt) / ANIMATION_DURATION)
      const eased = elapsed < 0.72
        ? 1 - ((1 - elapsed) ** 2)
        : 0.92 + ((elapsed - 0.72) / 0.28) * 0.08
      setProgress(Math.min(1, eased))

      if (elapsed < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        void confirmPurchase()
      }
    }
    frameRef.current = requestAnimationFrame(tick)
  }

  const handleClick = () => {
    if (disabled || phaseRef.current !== 'idle') return

    if (!authenticated) {
      signInRef.current?.()
      return
    }

    if (startRef.current?.(planId) === false) return
    setProgress(0)
    updatePhase('animating')

    if (reduceMotion) {
      void confirmPurchase()
      return
    }

    runAnimation()
  }

  const isPending = phase === 'animating' || phase === 'processing'
  const truckOpacity = progress > 0.86 ? Math.max(0, 1 - (progress - 0.86) / 0.14) : 1
  const packageOpacity = progress < 0.12
    ? Math.min(1, progress / 0.08)
    : progress < 0.28
      ? 1 - ((progress - 0.12) / 0.16)
      : 0
  const roadWidth = Math.max(0, Math.min(83, progress * 92 - 7))
  const headlightOpacity = progress > 0.64 ? Math.min(1, (progress - 0.64) / 0.2) : 0
  const label = {
    idle: authenticated ? 'Purchase Credits' : 'Sign in to purchase',
    animating: 'Complete Order',
    processing: 'Processing Payment',
    success: 'Order Placed',
    error: 'Payment Failed · Retry',
    cancelled: 'Payment Cancelled · Retry',
  }[phase]

  return (
    <button
      className={`purchase-confirm-button purchase-confirm-button--${phase}`}
      type="button"
      onClick={handleClick}
      disabled={disabled || isPending || (!authenticated && phase !== 'idle')}
      aria-label={`${phase === 'animating' ? 'Completing order' : label} — ${planId} credit package`}
      aria-busy={isPending}
    >
      {phase === 'animating' && (
        <>
          <span className="purchase-road" style={{ width: `${roadWidth}%` }} aria-hidden="true" />
          <span className="purchase-package" style={{ opacity: packageOpacity }} aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M3 6.5 10 3l7 3.5v8L10 18l-7-3.5v-8Z" fill="#D4A95C" stroke="#E8C77F" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="m3.3 6.7 6.7 3.5 6.7-3.5M10 10.2V18M7 4.5l7 3.6" stroke="#72572C" strokeWidth="1" strokeLinejoin="round" />
            </svg>
          </span>
          <motion.span
            className="purchase-truck"
            style={{
              left: `${progress * 111 - 7}%`,
              opacity: truckOpacity,
            }}
            aria-hidden="true"
          >
            <span className="truck-headlight" style={{ opacity: headlightOpacity }} />
            <span className="truck-trailer" />
            <span className="truck-cab"><span className="truck-window" /></span>
            <span className="truck-wheel truck-wheel--one" />
            <span className="truck-wheel truck-wheel--two" />
            <span className="truck-wheel truck-wheel--three" />
          </motion.span>
        </>
      )}
      <span
        className={`purchase-button-label${isPending ? ' purchase-button-label--pending' : ''}${phase === 'animating' ? ' purchase-button-label--sliding' : ''}`}
        style={phase === 'animating' ? { opacity: Math.max(0, 1 - progress / 0.12) } : undefined}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={phase === 'animating' ? 'animating' : phase === 'processing' ? 'processing' : phase}
            className="purchase-button-label__content"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.14 }}
          >
            {phase === 'success' && (
              <svg className="purchase-success-check" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="m4 9 3.2 3.2L14 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {phase === 'processing' && <span className="purchase-spinner" aria-hidden="true" />}
            {label}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="sr-only" aria-live="polite">
        {phase === 'processing' ? 'Payment checkout is opening. Complete payment in the secure Razorpay window.' : ''}
        {phase === 'success' ? 'Payment verified. Your credits have been added.' : ''}
      </span>
    </button>
  )
}

export default AnimatedCreditPurchaseButton

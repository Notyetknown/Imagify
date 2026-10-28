import { motion } from 'motion/react'

const GenerateImageButton = ({ loading, disabled = false, className = '' }) => (
  <motion.button
    type="submit"
    className={`generate-button ${className}`}
    disabled={disabled || loading}
    whileHover={disabled || loading ? undefined : { y: -2 }}
    whileTap={disabled || loading ? undefined : { scale: 0.98 }}
    transition={{ duration: 0.18 }}
    aria-live="polite"
  >
    <span className="generate-button__sheen" aria-hidden="true" />
    {loading ? (
      <>
        <span className="loading-spinner" aria-hidden="true" />
        <span>Generating your image...</span>
      </>
    ) : (
      <>
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="m10 1.8 1.55 5.02L16.6 8.4l-5.05 1.56L10 15l-1.55-5.04L3.4 8.4l5.05-1.58L10 1.8Z" fill="currentColor" />
          <path d="m15.7 12.5.72 2.1 2.08.7-2.08.72-.72 2.08-.7-2.08-2.1-.72 2.1-.7.7-2.1Z" fill="currentColor" />
        </svg>
        <span>Generate Image</span>
      </>
    )}
  </motion.button>
)

export default GenerateImageButton

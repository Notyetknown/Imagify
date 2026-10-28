import { useContext, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { toast } from 'react-toastify'
import { AppContext } from '../context/context'
import GenerateImageButton from './GenerateImageButton'

const ImageGenerator = ({ studio = false }) => {
  const { user, credit, generateImage, setShowLogin } = useContext(AppContext)
  const [prompt, setPrompt] = useState('')
  const [image, setImage] = useState('')
  const [imagePrompt, setImagePrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const promptInputRef = useRef(null)
  const inputId = studio ? 'studio-prompt' : 'home-prompt'
  const promptHelpId = `${studio ? 'studio' : 'home'}-prompt-help`
  const promptErrorId = `${studio ? 'studio' : 'home'}-prompt-error`

  useLayoutEffect(() => {
    const textarea = promptInputRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    const maxHeight = 220
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }, [prompt])

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    const trimmedPrompt = prompt.trim()

    if (!trimmedPrompt) {
      setError('Add a description of the image you want to create.')
      return
    }

    setError('')
    if (!user) {
      setShowLogin(true)
      return
    }

    setLoading(true)
    try {
      const generatedImage = await generateImage(trimmedPrompt)
      if (generatedImage) {
        setImage(generatedImage)
        setImagePrompt(trimmedPrompt)
      } else {
        setError("We couldn't complete that generation. Your prompt is saved—please try again.")
      }
    } catch (generationError) {
      toast.error(generationError.message || 'Image generation failed. Please try again.')
      setError("We couldn't complete that generation. Your prompt is saved—please try again.")
    } finally {
      setLoading(false)
    }
  }

  const promptExamples = [
    'Cinematic futuristic architecture at golden hour',
    'Luxury skincare photographed on translucent glass',
    'Dreamlike alpine mountains beneath a violet night sky',
    'Editorial portrait with dramatic studio lighting',
  ]

  return (
    <div className={`generator-layout${studio ? ' generator-layout--studio' : ''}`}>
      <form className="prompt-panel glass-panel" onSubmit={onSubmitHandler}>
        <div className="prompt-panel__heading">
          <label className="prompt-label" htmlFor={inputId}>
          <span className="prompt-label__icon" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M3 4.5h14v11H3v-11Z" stroke="currentColor" strokeWidth="1.4" />
              <path d="m4.2 14 4.1-4.1 2.4 2.4 2.2-2.2 3.1 3.1M6.5 7.5h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          Describe your image
          </label>
          {prompt && (
            <button
              type="button"
              className="prompt-clear-button"
              onClick={() => {
                setPrompt('')
                setError('')
                promptInputRef.current?.focus()
              }}
              aria-label="Clear prompt"
              disabled={loading}
            >
              <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="m5 5 8 8m0-8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Clear
            </button>
          )}
        </div>
        <textarea
          ref={promptInputRef}
          id={inputId}
          value={prompt}
          onChange={(event) => {
            setPrompt(event.target.value)
            if (error) setError('')
          }}
          placeholder="A cinematic photograph of a quiet city floating above the clouds at golden hour..."
          rows={2}
          aria-describedby={`${promptHelpId}${error ? ` ${promptErrorId}` : ''}`}
          disabled={loading}
          onKeyDown={(event) => {
            if (
              event.key === 'Enter'
              && (event.ctrlKey || event.metaKey)
              && !event.nativeEvent.isComposing
            ) {
              event.preventDefault()
              event.currentTarget.form?.requestSubmit()
            }
          }}
        />
        <div className="prompt-panel__footer">
          <span id={promptHelpId} className="prompt-hint">
            Be specific about the subject, mood, light, and style.
          </span>
          <span className="prompt-character-count" aria-live="polite">
            {prompt.length} characters
          </span>
          {user && (
            <span className="prompt-credit">
              <span className="credit-spark" aria-hidden="true">✦</span>
              {credit} credits
            </span>
          )}
        </div>
        <div className="prompt-examples" aria-label="Prompt examples">
          <span className="prompt-examples__label">TRY A STARTING POINT</span>
          <div className="prompt-examples__list">
            {promptExamples.map((example) => (
              <button
                type="button"
                className="prompt-example"
                key={example}
                onClick={() => {
                  setPrompt(example)
                  setError('')
                  promptInputRef.current?.focus()
                }}
                disabled={loading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
        {error && (
          <p id={promptErrorId} className="form-message form-message--error" role="alert">
            {error}
          </p>
        )}
        <div className="prompt-panel__action">
          <span className="generation-note">Your prompt is only used to create your image.</span>
          <GenerateImageButton loading={loading} />
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {loading ? 'Generating your image. This may take a moment.' : ''}
        </p>
      </form>

      {image && (
        <motion.section
          className="generated-result glass-panel"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          aria-label="Generated image"
        >
          <div className="generated-result__heading">
            <div>
              <span className="eyebrow">YOUR CREATION</span>
              <h2>Made from your words.</h2>
            </div>
            <a className="secondary-button" href={image} download>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 2.5v9m0 0 3.5-3.5M10 11.5 6.5 8M3.5 13v3.5h13V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download
            </a>
          </div>
          <img className="generated-result__image" src={image} alt={`AI-generated image for: ${imagePrompt}`} />
        </motion.section>
      )}
    </div>
  )
}

export default ImageGenerator

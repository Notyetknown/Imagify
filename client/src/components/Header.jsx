import { motion, useReducedMotion } from 'motion/react'
import { assets } from '../assets/assets'
import ImageGenerator from './ImageGenerator'
import KineticReelText from './KineticReelText'
import WordRevealText from './WordRevealText'

const imageConcepts = [
  'cinematic worlds',
  'dreamlike landscapes',
  'stunning portraits',
  'surreal artwork',
  'product imagery',
  'fantasy characters',
  'architectural visions',
  'editorial visuals',
  'imaginative concepts',
]

const Header = () => {
  const reduceMotion = useReducedMotion()

  return (
    <section className="hero-section">
      <div className="hero-copy">
        <motion.div
          className="eyebrow-pill"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <span className="status-dot" />
          YOUR IMAGINATION, RENDERED
        </motion.div>
        <WordRevealText
          as="h1"
          className="hero-title"
          text="Turn your ideas into extraordinary visuals."
          accentWords={['ideas', 'extraordinary']}
          stagger={0.075}
        />
        <KineticReelText
          className="hero-kinetic-reel"
          prefix="Imagine"
          items={imageConcepts}
        />
        <WordRevealText
          as="p"
          className="hero-description"
          text="Describe the image you imagine. Let AI transform your words into visuals worth creating."
          delay={0.25}
          stagger={0.025}
        />
      </div>

      <ImageGenerator />

      <div className="hero-trust" aria-label="Imagify image examples">
        <div className="hero-trust__images">
          <img src={assets.sample_img_1} alt="" width="44" height="44" />
          <img src={assets.sample_img_2} alt="" width="44" height="44" />
          <span className="hero-trust__spark" aria-hidden="true">✦</span>
        </div>
        <p>Every creation begins with an idea.</p>
        <span className="hero-trust__divider" />
        <p>Made for curious minds</p>
      </div>
    </section>
  )
}

export default Header

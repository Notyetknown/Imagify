import { motion } from 'motion/react'
import { assets } from '../assets/assets'
import WordRevealText from './WordRevealText'

const Description = () => (
  <motion.section
    className="showcase-section"
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45 }}
    viewport={{ once: true, amount: 0.15 }}
  >
    <div className="section-heading section-heading--left">
      <span className="eyebrow">A LITTLE LOOK AT WHAT'S POSSIBLE</span>
      <WordRevealText
        as="h2"
        text="Imagination has no preset."
        accentWords={['preset.']}
      />
      <WordRevealText
        text="From storybook worlds to quiet moments of inspiration, start with a sentence and see where it takes you."
        stagger={0.022}
      />
    </div>
    <div className="showcase-grid">
      <article className="showcase-card showcase-card--feature">
        <img
          src={assets.sample_img_1}
          alt="A cheerful turquoise monster in a chef's hat beside a colorful celebration cake"
          loading="lazy"
          width="590"
          height="590"
        />
        <div className="showcase-card__caption">
          <span>Whimsical worlds</span>
          <span>Illustration · Imagination</span>
        </div>
        <span className="showcase-card__index">01 / 02</span>
      </article>
      <article className="showcase-card showcase-card--secondary">
        <img
          src={assets.sample_img_2}
          alt="A curious one-eyed creature sketching ideas at a warmly lit desk"
          loading="lazy"
          width="590"
          height="590"
        />
        <div className="showcase-card__caption">
          <span>Ideas in progress</span>
          <span>Creative scene · Storytelling</span>
        </div>
        <span className="showcase-card__index">02 / 02</span>
      </article>
      <div className="showcase-note glass-panel">
        <span className="showcase-note__mark" aria-hidden="true">✦</span>
        <WordRevealText
          text="Give a thought a little detail. Let the image surprise you."
          stagger={0.025}
          duration={0.38}
        />
        <span>YOUR CANVAS IS A PROMPT</span>
      </div>
    </div>
  </motion.section>
)

export default Description

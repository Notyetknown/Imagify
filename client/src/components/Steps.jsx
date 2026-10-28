import { motion } from 'motion/react'
import { stepsData } from '../assets/assets'
import WordRevealText from './WordRevealText'

const Steps = () => (
  <motion.section
    className="steps-section"
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45 }}
    viewport={{ once: true, amount: 0.2 }}
  >
    <div className="section-heading">
      <span className="eyebrow">A SIMPLE CREATIVE FLOW</span>
      <WordRevealText
        as="h2"
        text="From thought to frame."
        accentWords={['frame.']}
      />
      <WordRevealText
        text="Three simple steps between the idea in your head and the image on your screen."
        stagger={0.025}
      />
    </div>
    <div className="steps-grid">
      {stepsData.map((item, index) => (
        <article className="step-card glass-panel" key={item.title}>
          <div className="step-card__top">
            <span className="step-number">0{index + 1}</span>
            <span className="step-icon">
              <img src={item.icon} alt="" width="26" height="26" loading="lazy" />
            </span>
          </div>
          <WordRevealText as="h3" text={item.title} stagger={0.035} duration={0.38} />
          <WordRevealText as="p" text={item.description} stagger={0.018} duration={0.34} />
        </article>
      ))}
    </div>
  </motion.section>
)

export default Steps

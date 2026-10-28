import { motion } from 'motion/react'
import ImageGenerator from '../components/ImageGenerator'
import WordRevealText from '../components/WordRevealText'

const Result = () => (
  <motion.main
    className="studio-page"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className="section-heading studio-heading">
      <span className="eyebrow">THE IMAGIFY STUDIO</span>
      <WordRevealText
        as="h1"
        text="Your next idea, in focus."
        accentWords={['focus.']}
      />
      <WordRevealText
        text="Write a prompt, shape the details, and create something unmistakably yours."
        stagger={0.025}
      />
    </div>
    <ImageGenerator studio />
  </motion.main>
)

export default Result

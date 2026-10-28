import { motion } from 'motion/react'
import { assets, testimonialsData } from '../assets/assets'
import WordRevealText from './WordRevealText'

const Testimonials = () => (
  <motion.section
    className="testimonials-section"
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45 }}
    viewport={{ once: true, amount: 0.15 }}
  >
    <div className="section-heading">
      <span className="eyebrow">CREATIVE PEOPLE, REAL IDEAS</span>
      <WordRevealText
        as="h2"
        text="Made for the makers."
        accentWords={['makers.']}
      />
      <WordRevealText
        text="See how creators bring their ideas into focus with Imagify."
        stagger={0.03}
      />
    </div>
    <div className="testimonials-grid">
      {testimonialsData.map((testimonial, index) => (
        <article className="testimonial-card glass-panel" key={`${testimonial.name}-${index}`}>
          <div className="testimonial-stars" aria-label={`${testimonial.stars} out of 5 stars`}>
            {Array.from({ length: testimonial.stars }, (_, starIndex) => (
              <img key={starIndex} src={assets.rating_star} alt="" width="15" height="15" loading="lazy" />
            ))}
          </div>
          <p className="testimonial-quote">“{testimonial.text}”</p>
          <div className="testimonial-author">
            <img src={testimonial.image} alt="" width="44" height="44" loading="lazy" />
            <div>
              <h3>{testimonial.name}</h3>
              <p>{testimonial.role}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  </motion.section>
)

export default Testimonials

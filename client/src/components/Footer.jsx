import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import BrandMark from './BrandMark'
import WordRevealText from './WordRevealText'

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-main">
      <Link to="/" className="footer-brand" aria-label="Imagify home">
        <BrandMark />
      </Link>
      <WordRevealText as="p" text="Make room for the ideas you haven’t had yet." stagger={0.03} />
      <div className="footer-socials" aria-label="Social media">
        <a href="https://www.facebook.com/rajkaran.sharma.5245" target="_blank" rel="noopener noreferrer" aria-label="Imagify on Facebook">
          <img src={assets.facebook_icon} alt="" width="20" height="20" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Imagify on X">
          <img src={assets.twitter_icon} alt="" width="20" height="20" />
        </a>
        <a href="https://www.instagram.com/egoistic__20x/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Imagify on Instagram">
          <img src={assets.instagram_icon} alt="" width="20" height="20" />
        </a>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} Rajkaran.dev. All rights reserved.</span>
      <span>Thoughtfully imagined with Imagify.</span>
    </div>
  </footer>
)

export default Footer

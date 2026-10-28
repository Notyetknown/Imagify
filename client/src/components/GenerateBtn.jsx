import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/context'
import GenerateImageButton from './GenerateImageButton'
import WordRevealText from './WordRevealText'

const GenerateBtn = () => {
  const { user, setShowLogin } = useContext(AppContext)
  const navigate = useNavigate()

  const onClickHandler = (event) => {
    event.preventDefault()
    if (user) navigate('/result')
    else setShowLogin(true)
  }

  return (
    <section className="closing-cta glass-panel">
      <span className="eyebrow">WHENEVER YOU'RE READY</span>
      <WordRevealText
        as="h2"
        text="What will you imagine?"
        accentWords={['imagine?']}
      />
      <WordRevealText text="Your next favorite image might be one prompt away." stagger={0.03} />
      <form onSubmit={onClickHandler}>
        <GenerateImageButton loading={false} />
      </form>
    </section>
  )
}

export default GenerateBtn

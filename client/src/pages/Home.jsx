import Header from '../components/Header';
import Steps from '../components/Steps';
import Description from '../components/Description';
import Testimonials from '../components/Testimonials';
import GenerateBtn from '../components/GenerateBtn';
import VelocityMarquee from '../components/VelocityMarquee'

const Home = () => {
  return (
    <main className="home-page">
     <Header />
     <Steps />
     <VelocityMarquee />
     <Description />
     <Testimonials />
     <GenerateBtn />
    </main>
  )
}

export default Home

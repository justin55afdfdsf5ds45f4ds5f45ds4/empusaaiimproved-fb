import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Problem from './components/Problem'
import HowItWorks from './components/HowItWorks'
import SocialProof from './components/SocialProof'
import Pricing from './components/Pricing'
import Footer from './components/Footer'
import DownloadPage from './pages/Download'

function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <SocialProof />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/payment/asf454fialfiqifqeifuejnfelwefbelkjfbkjbwejbew65465f1e65w1f" element={<DownloadPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

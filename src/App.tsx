import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import FlowDiagram from './components/FlowDiagram'
import Problem from './components/Problem'
import TestimonialMarquee from './components/TestimonialMarquee'
import FAQ from './components/FAQ'
import Pricing from './components/Pricing'
import Footer from './components/Footer'
import DownloadPage from './pages/Download'
import DocsPage from './pages/Docs'

function LandingPage() {
  return (
    <MotionConfig transition={{ type: "spring", stiffness: 250, damping: 25 }}>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-hidden">
        {/* CINEMATIC FILM GRAIN */}
        <div className="z-0 fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />
        
        <div className="relative z-10">
          <Navbar />
          <main>
            <Hero />
            <Features />
            <FlowDiagram />
            <Problem />
            <TestimonialMarquee />
            <FAQ />
            <Pricing />
          </main>
          <Footer />
        </div>
      </div>
    </MotionConfig>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/payment/asf454fialfiqifqeifuejnfelwefbelkjfbkjbwejbew65465f1e65w1f" element={<DownloadPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

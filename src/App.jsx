import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LandingPage    from './components/LandingPage'
import FilmGallery    from './components/FilmGallery'
import DigitalGallery from './components/DigitalGallery'
import Navigation     from './components/Navigation'
import { AdminProvider, AdminLogin, AdminPanel } from './components/AdminPanel'

const pageVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0,   transition: { type: 'spring', stiffness: 80, damping: 20 } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.3, ease: 'easeInOut' } },
}

function PortfolioApp() {
  const [section, setSection] = useState('landing')

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {section === 'landing' && (
          <motion.div key="landing" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
            <LandingPage onEnter={setSection} />
          </motion.div>
        )}
        {section === 'film' && (
          <motion.div key="film" variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="bg-film-bg min-h-screen">
            <Navigation current="film" onNavigate={setSection} />
            <FilmGallery />
          </motion.div>
        )}
        {section === 'digital' && (
          <motion.div key="digital" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
            <DigitalGallery onNavigate={setSection} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <AdminProvider>
      <AdminLogin />
      <AdminPanel />
      <PortfolioApp />
    </AdminProvider>
  )
}

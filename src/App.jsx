import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Digital from './pages/Digital'
import FilmLog from './pages/FilmLog'
import About from './pages/About'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

const page = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

export default function App() {
  const location = useLocation()
  const dark = ['/film', '/digital'].some((p) => location.pathname.startsWith(p))

  return (
    <div className={`grain flex min-h-screen flex-col ${dark ? 'bg-dark' : 'bg-paper'}`}>
      <ScrollToTop />
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={page}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1"
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/digital" element={<Digital />} />
            <Route path="/specimens" element={<Navigate to="/digital" replace />} />
            <Route path="/film" element={<FilmLog />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import { AdminProvider, AdminLogin, AdminPanel } from './components/AdminPanel'
import useScrollSnap from './hooks/useScrollSnap'
import Home from './pages/Home'
import Digital from './pages/Digital'
import FilmLog from './pages/FilmLog'
import About from './pages/About'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    // Instant, not smooth: html has scroll-behavior smooth, and an animated
    // scroll-to-top gets stranded partway when the page transition swaps
    // content mid-animation.
    window.scrollTo({ top: 0, behavior: 'instant' })
    const id = requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    return () => cancelAnimationFrame(id)
  }, [pathname])
  return null
}

const page = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] },
  },
}

export default function App() {
  return (
    <AdminProvider>
      <AdminLogin />
      <AdminPanel />
      <Site />
    </AdminProvider>
  )
}

function Site() {
  const location = useLocation()
  const dark = ['/film', '/digital'].some((p) => location.pathname.startsWith(p))
  useScrollSnap(dark)

  return (
    <div
      className={`grain flex min-h-screen flex-col transition-colors duration-700 ease-out ${
        dark ? 'bg-dark' : 'bg-paper'
      }`}
    >
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

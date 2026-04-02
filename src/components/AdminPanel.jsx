import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { filmPhotos as defaultFilm, digitalPhotos as defaultDigital } from '../data/photos'

// ─── Storage ──────────────────────────────────────────────────────────────────
const FILM_KEY    = 'portfolio_admin_film_v1'
const DIGITAL_KEY = 'portfolio_admin_digital_v1'

function readStorage(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback }
  catch { return fallback }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AdminCtx = createContext(null)

export function AdminProvider({ children }) {
  const [showLogin,   setShowLogin]   = useState(false)
  const [loggedIn,    setLoggedIn]    = useState(false)
  const [showPanel,   setShowPanel]   = useState(false)
  const [filmData,    setFilmData]    = useState(() => readStorage(FILM_KEY,    defaultFilm))
  const [digitalData, setDigitalData] = useState(() => readStorage(DIGITAL_KEY, defaultDigital))

  // Secret: type "admin" anywhere (ignores keypresses inside inputs)
  const seqRef   = useRef('')
  const timerRef = useRef(null)
  useEffect(() => {
    const handler = (e) => {
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      seqRef.current = (seqRef.current + e.key.toLowerCase()).slice(-5)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => { seqRef.current = '' }, 3000)
      if (seqRef.current === 'admin') {
        seqRef.current = ''
        if (loggedIn) setShowPanel(true)
        else          setShowLogin(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [loggedIn])

  const login = (user, pass) => {
    if (user.trim() === 'admin' && pass === 'admin') {
      setLoggedIn(true); setShowLogin(false); setShowPanel(true); return true
    }
    return false
  }
  const logout = () => { setLoggedIn(false); setShowPanel(false) }

  const persistFilm    = (d) => { setFilmData(d);    localStorage.setItem(FILM_KEY,    JSON.stringify(d)) }
  const persistDigital = (d) => { setDigitalData(d); localStorage.setItem(DIGITAL_KEY, JSON.stringify(d)) }
  const resetAll = () => {
    localStorage.removeItem(FILM_KEY); localStorage.removeItem(DIGITAL_KEY)
    setFilmData(defaultFilm); setDigitalData(defaultDigital)
  }

  return (
    <AdminCtx.Provider value={{ showLogin, setShowLogin, loggedIn, login, logout,
      showPanel, setShowPanel, filmData, digitalData, persistFilm, persistDigital, resetAll }}>
      {children}
    </AdminCtx.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminCtx)
  if (!ctx) throw new Error('useAdmin must be inside AdminProvider')
  return ctx
}

// ─── Small shared button ──────────────────────────────────────────────────────
function AdminBtn({ label, onClick, accent, danger, disabled }) {
  const base = accent ? 'rgba(0,229,255,' : danger ? 'rgba(255,80,80,' : 'rgba(255,255,255,'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 transition-all duration-150"
      style={{
        border:     `1px solid ${base}${disabled ? '0.1)' : '0.25)'}`,
        color:      `${base}${disabled ? '0.2)' : '0.65)'}`,
        background: 'transparent',
        cursor:     disabled ? 'default' : 'pointer',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = `${base}0.08)` }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
    >
      {label}
    </button>
  )
}

// ─── Shared text field ────────────────────────────────────────────────────────
function Field({ label, value, onChange, colSpan }) {
  return (
    <div style={colSpan ? { gridColumn: `span ${colSpan}` } : {}}>
      <label className="font-mono text-[8px] tracking-widest block mb-1" style={{ color: 'rgba(255,255,255,0.22)' }}>
        {label}
      </label>
      <input
        type="text"
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-transparent font-mono text-[11px] px-2 py-1.5 outline-none"
        style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
        onFocus={e  => (e.target.style.borderColor = 'rgba(0,229,255,0.35)')}
        onBlur={e   => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
      />
    </div>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="font-mono text-[8px] tracking-widest block mb-1" style={{ color: 'rgba(255,255,255,0.22)' }}>
        {label}
      </label>
      <select
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-transparent font-mono text-[11px] px-2 py-1.5 outline-none"
        style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', background: '#111' }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

// ─── Film edit fields ─────────────────────────────────────────────────────────
function FilmFields({ photo, onUpdate }) {
  return (
    <div className="grid grid-cols-4 gap-2 mt-2">
      <Field label="TITLE"  value={photo.title}  onChange={v => onUpdate('title',  v)} colSpan={4} />
      <Field label="FORMAT" value={photo.format} onChange={v => onUpdate('format', v)} colSpan={2} />
      <Field label="YEAR"   value={photo.year}   onChange={v => onUpdate('year',   v)} />
      <SelectField label="ASPECT" value={photo.aspect} onChange={v => onUpdate('aspect', v)} options={['portrait', 'landscape']} />
    </div>
  )
}

// ─── Digital edit fields ──────────────────────────────────────────────────────
function DigitalFields({ photo, onUpdate }) {
  return (
    <div className="grid grid-cols-4 gap-2 mt-2">
      <Field label="TITLE"    value={photo.title}    onChange={v => onUpdate('title',    v)} colSpan={2} />
      <Field label="SUBJECT"  value={photo.subject}  onChange={v => onUpdate('subject',  v)} colSpan={2} />
      <SelectField label="CATEGORY" value={photo.category} onChange={v => onUpdate('category', v)} options={['Macro', 'Nature', 'Crystal']} />
      <Field label="LENS"     value={photo.lens}     onChange={v => onUpdate('lens',     v)} />
      <Field label="SHUTTER"  value={photo.shutter}  onChange={v => onUpdate('shutter',  v)} />
      <Field label="APERTURE" value={photo.aperture} onChange={v => onUpdate('aperture', v)} />
      <Field label="ISO"      value={photo.iso}      onChange={v => onUpdate('iso',      v)} />
      <Field label="STACK"    value={photo.stack}    onChange={v => onUpdate('stack',    v)} colSpan={2} />
    </div>
  )
}

// ─── Photo row ────────────────────────────────────────────────────────────────
function PhotoRow({ photo, idx, type, expanded, isDragOver, onToggle, onUpdate, onRemove,
                    onDragStart, onDragOver, onDrop, onDragEnd }) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        borderTop:    isDragOver ? '2px solid rgba(0,229,255,0.5)' : '2px solid transparent',
        background:   expanded   ? 'rgba(0,229,255,0.025)' : 'transparent',
        transition:   'background 0.15s',
      }}
    >
      {/* ── Collapsed row ── */}
      <div className="flex items-center gap-3 px-4 py-2.5">
        {/* Drag handle */}
        <div
          draggable
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          className="select-none flex-shrink-0 text-lg leading-none px-1"
          style={{ color: 'rgba(255,255,255,0.15)', cursor: 'grab' }}
          title="Drag to reorder"
        >
          ⠿
        </div>

        {/* Index */}
        <span className="font-mono text-[9px] w-4 text-right flex-shrink-0" style={{ color: 'rgba(255,255,255,0.18)' }}>
          {idx + 1}
        </span>

        {/* Thumbnail */}
        <img
          src={photo.src}
          alt=""
          className="flex-shrink-0 object-cover"
          style={{ width: 48, height: 48, border: '1px solid rgba(255,255,255,0.07)' }}
        />

        {/* Summary */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onToggle}>
          <p className="font-mono text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.72)' }}>
            {photo.title}
          </p>
          <p className="font-mono text-[9px] truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {type === 'film'
              ? `${photo.format} — ${photo.year} — ${photo.aspect}`
              : `${photo.category} · ${photo.subject}`}
          </p>
        </div>

        {/* Controls */}
        <button
          onClick={onToggle}
          className="font-mono text-[13px] w-7 h-7 flex items-center justify-center flex-shrink-0 transition-colors duration-150"
          style={{ color: expanded ? 'rgba(0,229,255,0.7)' : 'rgba(255,255,255,0.25)' }}
          title={expanded ? 'Collapse' : 'Edit'}
        >
          {expanded ? '−' : '+'}
        </button>
        <button
          onClick={e => { e.stopPropagation(); onRemove() }}
          className="font-mono text-[13px] w-7 h-7 flex items-center justify-center flex-shrink-0 transition-colors duration-150"
          style={{ color: 'rgba(255,80,80,0.35)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,80,80,0.8)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,80,80,0.35)')}
          title="Remove"
        >
          ×
        </button>
      </div>

      {/* ── Expanded edit fields ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-4 pb-4" style={{ paddingLeft: 'calc(1rem + 28px + 16px + 48px + 12px)' }}>
              {type === 'film'
                ? <FilmFields    photo={photo} onUpdate={onUpdate} />
                : <DigitalFields photo={photo} onUpdate={onUpdate} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Export modal ─────────────────────────────────────────────────────────────
function ExportModal({ data, onClose }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(data).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }

  // Downloads the file directly — user can then drop it into the project and push
  const download = () => {
    const blob = new Blob([data], { type: 'text/javascript' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'photos.js'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      className="absolute inset-0 z-10 flex items-center justify-center p-8"
      style={{ background: 'rgba(0,0,0,0.92)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl flex flex-col"
        style={{ maxHeight: '80vh', background: '#0d0d0d', border: '1px solid rgba(0,229,255,0.15)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] tracking-widest" style={{ color: 'rgba(0,229,255,0.6)' }}>
                EXPORT DATA — SYNC TO ALL DEVICES
              </p>
              {/* Step-by-step sync instructions */}
              <div className="mt-2 space-y-0.5">
                {[
                  '1. Click DOWNLOAD — saves photos.js to your computer',
                  '2. Replace  src/data/photos.js  in your project with the downloaded file',
                  '3. git add . → git commit → git push',
                  '4. Vercel auto-deploys → changes appear on every device',
                ].map(step => (
                  <p key={step} className="font-mono text-[8px] tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {step}
                  </p>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <AdminBtn label="DOWNLOAD" onClick={download} accent />
              <AdminBtn label={copied ? '✓ COPIED' : 'COPY ALL'} onClick={copy} />
              <AdminBtn label="CLOSE" onClick={onClose} />
            </div>
          </div>
        </div>

        {/* Preview of the file content */}
        <textarea
          readOnly
          value={data}
          className="flex-1 font-mono text-[10px] p-4 outline-none resize-none"
          style={{ background: 'transparent', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}
        />
      </div>
    </motion.div>
  )
}

// ─── Confirm modal ────────────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <motion.div
      className="absolute inset-0 z-10 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.88)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="p-8" style={{ background: '#0d0d0d', border: '1px solid rgba(255,80,80,0.25)' }}>
        <p className="font-mono text-[11px] tracking-widest mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>
          {message}
        </p>
        <p className="font-mono text-[9px] tracking-widest mb-6" style={{ color: 'rgba(255,80,80,0.5)' }}>
          THIS WILL CLEAR ALL SAVED EDITS AND REVERT TO DEFAULTS.
        </p>
        <div className="flex gap-3">
          <AdminBtn label="YES, RESET" onClick={onConfirm} danger />
          <AdminBtn label="CANCEL"     onClick={onCancel} />
        </div>
      </div>
    </motion.div>
  )
}

// ─── Login modal ──────────────────────────────────────────────────────────────
export function AdminLogin() {
  const { showLogin, setShowLogin, login } = useAdmin()
  const [user,  setUser]  = useState('')
  const [pass,  setPass]  = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const attempt = () => {
    if (!login(user, pass)) {
      setError(true); setShake(true)
      setTimeout(() => setShake(false), 450)
    }
  }
  const close = () => { setShowLogin(false); setUser(''); setPass(''); setError(false) }

  return (
    <AnimatePresence>
      {showLogin && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className="w-80 p-8"
            style={{ background: '#0c0c0c', border: '1px solid rgba(0,229,255,0.18)' }}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={shake ? { x: [-10, 10, -10, 10, 0], scale: 1, opacity: 1 } : { scale: 1, opacity: 1, x: 0 }}
            transition={shake ? { duration: 0.4 } : { type: 'spring', stiffness: 260, damping: 22 }}
            onClick={e => e.stopPropagation()}
          >
            <p className="font-mono text-[9px] tracking-widest uppercase mb-1" style={{ color: 'rgba(0,229,255,0.45)' }}>
              ◆ PORTFOLIO ADMIN
            </p>
            <p className="font-mono text-[8px] tracking-widest mb-8" style={{ color: 'rgba(255,255,255,0.18)' }}>
              AUTHENTICATION REQUIRED
            </p>

            <input
              autoFocus
              type="text"
              placeholder="USERNAME"
              value={user}
              onChange={e => { setUser(e.target.value); setError(false) }}
              onKeyDown={e => e.key === 'Enter' && attempt()}
              className="w-full mb-3 bg-transparent font-mono text-[11px] tracking-widest px-3 py-2 outline-none placeholder-white/20"
              style={{ border: `1px solid ${error ? 'rgba(255,80,80,0.4)' : 'rgba(255,255,255,0.12)'}`, color: 'rgba(255,255,255,0.75)' }}
            />
            <input
              type="password"
              placeholder="PASSWORD"
              value={pass}
              onChange={e => { setPass(e.target.value); setError(false) }}
              onKeyDown={e => e.key === 'Enter' && attempt()}
              className="w-full mb-5 bg-transparent font-mono text-[11px] tracking-widest px-3 py-2 outline-none placeholder-white/20"
              style={{ border: `1px solid ${error ? 'rgba(255,80,80,0.4)' : 'rgba(255,255,255,0.12)'}`, color: 'rgba(255,255,255,0.75)' }}
            />

            {error && (
              <p className="font-mono text-[9px] tracking-widest mb-4" style={{ color: 'rgba(255,80,80,0.65)' }}>
                INVALID CREDENTIALS
              </p>
            )}

            <button
              onClick={attempt}
              className="w-full font-mono text-[10px] tracking-widest uppercase py-2.5 transition-all duration-150"
              style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.28)', color: 'rgba(0,229,255,0.8)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,229,255,0.16)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,229,255,0.08)')}
            >
              AUTHENTICATE
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Main admin panel ─────────────────────────────────────────────────────────
export function AdminPanel() {
  const { showPanel, setShowPanel, filmData, digitalData, persistFilm, persistDigital, resetAll, logout } = useAdmin()

  const [tab,          setTab]          = useState('film')
  const [localFilm,    setLocalFilm]    = useState(filmData)
  const [localDigital, setLocalDigital] = useState(digitalData)
  const [expandedId,   setExpandedId]   = useState(null)
  const [dirty,        setDirty]        = useState(false)
  const [showExport,   setShowExport]   = useState(false)
  const [showConfirm,  setShowConfirm]  = useState(false)

  // Keep local copies in sync when context data changes externally
  useEffect(() => setLocalFilm(filmData),    [filmData])
  useEffect(() => setLocalDigital(digitalData), [digitalData])

  const items    = tab === 'film' ? localFilm    : localDigital
  const setItems = tab === 'film'
    ? (d) => { setLocalFilm(d);    setDirty(true) }
    : (d) => { setLocalDigital(d); setDirty(true) }

  // Drag state
  const dragIdxRef  = useRef(null)
  const [dragOverIdx, setDragOverIdx] = useState(null)

  const updateField = (id, field, value) =>
    setItems(items.map(p => p.id === id ? { ...p, [field]: value } : p))

  const removeItem = (id) => {
    if (expandedId === id) setExpandedId(null)
    setItems(items.filter(p => p.id !== id))
  }

  const handleDragStart = (e, idx) => {
    dragIdxRef.current = idx
    e.dataTransfer.effectAllowed = 'move'
  }
  const handleDragOver  = (e, idx) => { e.preventDefault(); setDragOverIdx(idx) }
  const handleDrop      = (e, idx) => {
    e.preventDefault()
    const from = dragIdxRef.current
    if (from === null || from === idx) { setDragOverIdx(null); return }
    const next = [...items]
    const [moved] = next.splice(from, 1)
    next.splice(idx, 0, moved)
    setItems(next)
    dragIdxRef.current = null
    setDragOverIdx(null)
  }
  const handleDragEnd = () => { dragIdxRef.current = null; setDragOverIdx(null) }

  const handleSave = () => {
    persistFilm(localFilm); persistDigital(localDigital); setDirty(false)
  }

  const handleReset = () => {
    resetAll(); setDirty(false); setShowConfirm(false)
  }

  const exportText = () => {
    const f = JSON.stringify(localFilm,    null, 2)
    const d = JSON.stringify(localDigital, null, 2)
    return `export const filmPhotos = ${f}\n\nexport const digitalPhotos = ${d}\n`
  }

  return (
    <AnimatePresence>
      {showPanel && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col"
          style={{ background: '#080808' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        >
          {/* ── Top bar ── */}
          <div
            className="flex items-center justify-between px-5 py-3 flex-shrink-0"
            style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(0,229,255,0.1)' }}
          >
            {/* Left: title + tabs */}
            <div className="flex items-center gap-5">
              <span className="font-mono text-[10px] tracking-widest" style={{ color: 'rgba(0,229,255,0.5)' }}>
                ◆ ADMIN
              </span>
              <div className="flex items-center gap-1">
                {['film', 'digital'].map(t => (
                  <button
                    key={t}
                    onClick={() => { setTab(t); setExpandedId(null) }}
                    className="font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 transition-all duration-150"
                    style={{
                      color:      tab === t ? 'rgba(0,229,255,0.9)'    : 'rgba(255,255,255,0.3)',
                      background: tab === t ? 'rgba(0,229,255,0.08)'   : 'transparent',
                      border:     tab === t ? '1px solid rgba(0,229,255,0.22)' : '1px solid transparent',
                    }}
                  >
                    {t} · {(t === 'film' ? localFilm : localDigital).length}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2">
              {dirty && (
                <span className="font-mono text-[8px] tracking-widest mr-1" style={{ color: 'rgba(255,200,0,0.55)' }}>
                  ● UNSAVED
                </span>
              )}
              <AdminBtn label="SAVE ALL"  onClick={handleSave}              accent   disabled={!dirty} />
              <AdminBtn label="EXPORT JS" onClick={() => setShowExport(true)} />
              <AdminBtn label="RESET"     onClick={() => setShowConfirm(true)} danger />
              <AdminBtn label="EXIT"      onClick={() => { setShowPanel(false); logout() }} />
            </div>
          </div>

          {/* ── Sub-header ── */}
          <div
            className="flex items-center gap-3 px-5 py-2 flex-shrink-0"
            style={{ background: '#0c0c0c', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          >
            <span className="font-mono text-[8px] tracking-widest" style={{ color: 'rgba(255,255,255,0.18)' }}>
              {items.length} ITEMS
            </span>
            <span className="font-mono text-[8px]" style={{ color: 'rgba(255,255,255,0.08)' }}>·</span>
            <span className="font-mono text-[8px] tracking-widest" style={{ color: 'rgba(255,255,255,0.18)' }}>
              DRAG ⠿ TO REORDER
            </span>
            <span className="font-mono text-[8px]" style={{ color: 'rgba(255,255,255,0.08)' }}>·</span>
            <span className="font-mono text-[8px] tracking-widest" style={{ color: 'rgba(255,255,255,0.18)' }}>
              CLICK + TO EDIT FIELDS
            </span>
            <span className="font-mono text-[8px]" style={{ color: 'rgba(255,255,255,0.08)' }}>·</span>
            <span className="font-mono text-[8px] tracking-widest" style={{ color: 'rgba(255,200,0,0.3)' }}>
              SAVE ALL TO APPLY CHANGES TO GALLERY
            </span>
          </div>

          {/* ── Scrollable photo list ── */}
          <div className="flex-1 overflow-y-auto">
            {items.map((photo, idx) => (
              <PhotoRow
                key={photo.id}
                photo={photo}
                idx={idx}
                type={tab}
                expanded={expandedId === photo.id}
                isDragOver={dragOverIdx === idx}
                onToggle={() => setExpandedId(expandedId === photo.id ? null : photo.id)}
                onUpdate={(field, val) => updateField(photo.id, field, val)}
                onRemove={() => removeItem(photo.id)}
                onDragStart={e => handleDragStart(e, idx)}
                onDragOver={e  => handleDragOver(e,  idx)}
                onDrop={e      => handleDrop(e,      idx)}
                onDragEnd={handleDragEnd}
              />
            ))}

            {/* Drop zone at the very end of the list */}
            <div
              className="h-16"
              onDragOver={e => handleDragOver(e, items.length)}
              onDrop={e     => handleDrop(e,     items.length)}
              style={{ borderTop: dragOverIdx === items.length ? '2px solid rgba(0,229,255,0.5)' : '2px solid transparent' }}
            />
          </div>

          {/* ── Overlays ── */}
          <AnimatePresence>
            {showExport  && <ExportModal  data={exportText()} onClose={() => setShowExport(false)} />}
            {showConfirm && <ConfirmModal message="RESET ALL GALLERY DATA?" onConfirm={handleReset} onCancel={() => setShowConfirm(false)} />}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

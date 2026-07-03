import { useEffect } from 'react'

// Sticky header height; snap targets offset by this so rows centre in the
// visible area below the header (same approach as the master-branch galleries).
export const SNAP_MARGIN = 69

export const snapTarget = {
  scrollSnapAlign: 'center',
  scrollSnapStop: 'always',
  scrollMarginTop: `${SNAP_MARGIN}px`,
}

// Enables y-mandatory scroll snapping on <html> while the page is mounted.
export default function useScrollSnap() {
  useEffect(() => {
    const el = document.documentElement
    el.style.scrollSnapType = 'y mandatory'
    return () => {
      el.style.scrollSnapType = ''
    }
  }, [])
}

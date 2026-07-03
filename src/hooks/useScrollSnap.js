import { useEffect } from 'react'

// Sticky header height; snap targets offset by this so rows centre in the
// visible area below the header (same approach as the master-branch galleries).
export const SNAP_MARGIN = 69

export const snapTarget = {
  scrollSnapAlign: 'center',
  scrollSnapStop: 'always',
  scrollMarginTop: `${SNAP_MARGIN}px`,
}

// The intro/header is a snap point too, aligned to the very top. Without this,
// mandatory snapping has no valid rest at scroll=0 and jumps to the first
// image on load, hiding the page header.
export const snapStart = {
  scrollSnapAlign: 'start',
  // Offset by the sticky header so this snap point rests at scroll=0,
  // keeping the header visible instead of tucking the intro under it.
  scrollMarginTop: `${SNAP_MARGIN}px`,
}

// Route-driven snap toggle, called once from App. Keyed to the pathname so
// snapping turns off the moment navigation starts - a per-page unmount
// cleanup would only run after the exit animation, leaving mandatory snap
// active while the next page settles and nudging it off scroll=0.
export default function useScrollSnap(enabled) {
  useEffect(() => {
    document.documentElement.style.scrollSnapType = enabled ? 'y mandatory' : ''
    return () => {
      document.documentElement.style.scrollSnapType = ''
    }
  }, [enabled])
}

import { useEffect, useRef } from 'react'

export function useDialogA11y<T extends HTMLElement>(isOpen: boolean, onClose: () => void) {
  const dialogRef = useRef<T>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  // Keep the latest onClose available to the effect below without it
  // being a dependency — onClose is an inline arrow function at every
  // call site (`() => setMobileMenuOpen(false)`), a new identity on every
  // render. If the effect depended on it directly, its cleanup (which
  // restores focus to whatever was focused before opening) would fire on
  // every re-render while the dialog is still open, repeatedly yanking
  // focus back out of the dialog the instant anything inside it re-rendered.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!isOpen) return

    // Remember what had focus before opening, so it can be restored —
    // otherwise closing the dialog silently drops keyboard focus back to
    // <body>, forcing a keyboard user to tab through the page from
    // scratch to find where they were.
    previouslyFocused.current = document.activeElement as HTMLElement | null

    // Move focus into the dialog. A short timeout lets the open
    // transition's initial render complete first — focusing an element
    // still at `translate-x-full` (off-screen) works, but focusing after
    // paint is more robust across browsers.
    const focusTimeout = setTimeout(() => {
      const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      firstFocusable?.focus()
    }, 0)

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCloseRef.current()
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(focusTimeout)
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused.current?.focus()
    }
    // Deliberately depends only on `isOpen` — see onCloseRef comment above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  return dialogRef
}

import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import { useState } from 'react'
import { useDialogA11y } from './useDialogA11y'

afterEach(() => {
  cleanup()
})

function TestDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  // Lives in TestDrawer itself (not a child component) specifically so
  // that incrementing it forces TestDrawer to re-render and recreate the
  // inline onClose below. A child component's own local state re-render
  // would NOT do this — React re-renders only that child, not its
  // parent. This must live here for the test to actually exercise what
  // every real call site (PublicLayout, AdminLayout, FilterPanel) does:
  // `onClose={() => setMobileMenuOpen(false)}`, a fresh closure every
  // parent render.
  const [rerenderTick, setRerenderTick] = useState(0)

  const dialogRef = useDialogA11y<HTMLDivElement>(isOpen, () => setIsOpen(false))

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open trigger</button>
      {isOpen && (
        <div ref={dialogRef} data-testid="dialog">
          <button data-testid="dialog-button">Inside dialog</button>
        </div>
      )}
      <button data-testid="force-rerender" onClick={() => setRerenderTick((n) => n + 1)}>
        Force re-render {rerenderTick}
      </button>
    </div>
  )
}

describe('useDialogA11y', () => {
  it('moves focus into the dialog when opened', async () => {
    render(<TestDrawer />)
    fireEvent.click(screen.getByText('Open trigger'))

    // The hook focuses asynchronously (setTimeout 0) to let the open
    // transition's first paint happen — advance past that.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
    })

    expect(document.activeElement).toBe(screen.getByTestId('dialog-button'))
  })

  it('closes on Escape', async () => {
    render(<TestDrawer />)
    fireEvent.click(screen.getByText('Open trigger'))
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
    })

    expect(screen.queryByTestId('dialog')).not.toBeNull()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByTestId('dialog')).toBeNull()
  })

  it('restores focus to the trigger after closing', async () => {
    render(<TestDrawer />)
    const trigger = screen.getByText('Open trigger')
    trigger.focus()
    fireEvent.click(trigger)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
    })

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(document.activeElement).toBe(trigger)
  })

  it('THE ACTUAL BUG SCENARIO: does not steal focus back on unrelated re-renders while open', async () => {
    render(<TestDrawer />)
    const openTrigger = screen.getByText('Open trigger')
    // Focus it explicitly before clicking — jsdom's fireEvent.click does
    // NOT auto-focus the clicked element the way real browsers do, so
    // without this, the hook's "previously focused" capture would be
    // document.body, which silently no-ops on .focus() (it's not
    // focusable without an explicit tabindex) and would mask this bug
    // regardless of which hook version is installed.
    openTrigger.focus()
    fireEvent.click(openTrigger)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
    })

    const dialogButton = screen.getByTestId('dialog-button')
    expect(document.activeElement).toBe(dialogButton)

    // Manually focus something else inside the dialog, simulating a user
    // tabbing around — then force several unrelated re-renders (each
    // creating a fresh onClose closure) and confirm focus ISN'T yanked
    // back by the effect re-running its cleanup.
    const forceRerender = screen.getByTestId('force-rerender')
    forceRerender.focus()
    expect(document.activeElement).toBe(forceRerender)

    fireEvent.click(forceRerender)
    fireEvent.click(forceRerender)
    fireEvent.click(forceRerender)

    // If the bug were present, each re-render's cleanup would have called
    // previouslyFocused.current?.focus() — previouslyFocused.current is
    // openTrigger (a real focusable button, this time), so the bug would
    // observably steal focus away from forceRerender back to openTrigger,
    // while the dialog is still open, which is wrong either way.
    expect(document.activeElement).toBe(forceRerender)
    expect(screen.queryByTestId('dialog')).not.toBeNull() // still open
  })
})


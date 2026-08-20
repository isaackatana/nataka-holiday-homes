import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

/**
 * Class component because React error boundaries require the
 * componentDidCatch/getDerivedStateFromError lifecycle — there's no hook
 * equivalent. Without this, ANY uncaught render error anywhere in the
 * tree — including src/lib/supabase.ts's intentional fail-fast throw when
 * env vars are missing — blanks the entire page to white with nothing
 * but a console error, which is a bad failure mode for a business's
 * live booking site.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In a real deployment this is the hook point for an error-tracking
    // service (Sentry, etc.) — logged to console for now since none is
    // wired up.
    console.error('Uncaught error in app tree:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-sand-50 px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-coral-500/10">
            <AlertTriangle className="h-6 w-6 text-coral-500" />
          </div>
          <h1 className="font-display text-2xl font-medium text-teal-900">
            Something went wrong
          </h1>
          <p className="max-w-md text-sm text-charcoal-500">
            We hit an unexpected error loading this page. Try refreshing — if it keeps
            happening, please let us know.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 rounded-full bg-teal-900 px-6 py-2.5 text-sm font-medium text-sand-50 hover:bg-teal-800"
          >
            Refresh the page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

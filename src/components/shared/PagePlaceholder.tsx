interface PagePlaceholderProps {
  title: string
  note?: string
}

/**
 * Temporary stand-in used while scaffolding routes (Step 4). Each route
 * below gets replaced with its real page component in later steps
 * (public site, auth, account, admin) — this just proves the route tree,
 * layouts, and build pipeline all work end-to-end today.
 */
export function PagePlaceholder({ title, note }: PagePlaceholderProps) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-start justify-center gap-3 px-6 py-24">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold-600">
        Coming in a later step
      </span>
      <h1 className="font-display text-4xl font-medium text-teal-900">{title}</h1>
      {note && <p className="text-charcoal-500">{note}</p>}
    </div>
  )
}

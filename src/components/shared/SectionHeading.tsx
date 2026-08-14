interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ eyebrow, title, description, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={`flex flex-col gap-2 ${align === 'center' ? 'items-center text-center' : ''}`}>
      {eyebrow && (
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold-600">{eyebrow}</span>
      )}
      <h2 className="font-display text-3xl font-medium text-teal-900 md:text-4xl">{title}</h2>
      {description && (
        <p className={`text-charcoal-500 ${align === 'center' ? 'max-w-2xl' : 'max-w-xl'}`}>
          {description}
        </p>
      )}
    </div>
  )
}

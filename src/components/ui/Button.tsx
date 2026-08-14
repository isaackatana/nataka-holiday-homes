import { type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  variant?: 'primary' | 'secondary'
}

export function Button({
  loading,
  variant = 'primary',
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60'
  const variants = {
    primary: 'bg-teal-900 text-sand-50 hover:bg-teal-800',
    secondary: 'border border-teal-900 text-teal-900 hover:bg-teal-900 hover:text-sand-50',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

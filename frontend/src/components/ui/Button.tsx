import type { ButtonHTMLAttributes } from 'react'
import Spinner from './Spinner'

type Variante = 'primary' | 'secondary' | 'danger' | 'ghost'

const VARIANTES: Record<Variante, string> = {
  primary: 'bg-orange-600 text-white hover:bg-orange-700 focus-visible:outline-orange-600',
  secondary: 'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:outline-slate-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600',
  ghost: 'text-slate-600 hover:bg-slate-100 focus-visible:outline-slate-400',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variante
  loading?: boolean
}

export default function Button({
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  type = 'button',
  children,
  ...rest
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTES[variant]} ${className}`}
      {...rest}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}

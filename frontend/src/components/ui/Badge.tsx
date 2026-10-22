import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

export default function Badge({ children, className = 'bg-slate-100 text-slate-700' }: Props) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {children}
    </span>
  )
}

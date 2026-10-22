import type { ReactNode } from 'react'

interface Props {
  titulo: string
  children: ReactNode
  className?: string
}

// Tarjeta base para cada sección del plan generado por la IA.
export default function SeccionCard({ titulo, children, className = '' }: Props) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm break-inside-avoid ${className}`}>
      <h2 className="mb-3 text-base font-semibold text-slate-900">{titulo}</h2>
      <div className="text-sm text-slate-700">{children}</div>
    </section>
  )
}

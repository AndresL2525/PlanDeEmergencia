import type { PasoAccion } from '../../types/planIA'

// Lista numerada de pasos (acciones durante y después de la emergencia).
export default function PasosLista({ pasos }: { pasos: PasoAccion[] }) {
  if (pasos.length === 0) return <p className="text-slate-500">Sin acciones registradas.</p>

  const ordenados = [...pasos].sort((a, b) => a.paso - b.paso)
  return (
    <ol className="space-y-2">
      {ordenados.map((p) => (
        <li key={p.paso} className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
            {p.paso}
          </span>
          <span className="pt-0.5">{p.accion}</span>
        </li>
      ))}
    </ol>
  )
}

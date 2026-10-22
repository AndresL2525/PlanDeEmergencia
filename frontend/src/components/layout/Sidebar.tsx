import { NavLink } from 'react-router-dom'

const ENLACES = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/tipos-riesgo', label: 'Tipos de riesgo' },
  { to: '/protocolos', label: 'Protocolos' },
  { to: '/elementos-kit', label: 'Elementos del kit' },
  { to: '/planes', label: 'Planes familiares' },
]

interface Props {
  open: boolean
  onClose: () => void
}

// En móvil es un menú lateral desplegable; en pantallas grandes queda fijo.
export default function Sidebar({ open, onClose }: Props) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={onClose} aria-hidden="true" />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 bg-slate-900 text-slate-100 transition-transform duration-200 print:hidden lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">Prevención</p>
            <p className="text-lg font-bold leading-tight">Plan de Emergencia</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="rounded p-1 text-2xl leading-none text-slate-400 hover:bg-slate-800 lg:hidden"
          >
            ×
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {ENLACES.map((enlace) => (
            <NavLink
              key={enlace.to}
              to={enlace.to}
              end={enlace.end}
              onClick={onClose}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {enlace.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

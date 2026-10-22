import { Link } from 'react-router-dom'

const RECURSOS = [
  {
    to: '/tipos-riesgo',
    titulo: 'Tipos de riesgo',
    descripcion: 'Sismos, inundaciones, incendios y otras amenazas.',
  },
  {
    to: '/protocolos',
    titulo: 'Protocolos',
    descripcion: 'Qué hacer antes, durante y después de cada riesgo.',
  },
  {
    to: '/elementos-kit',
    titulo: 'Elementos del kit',
    descripcion: 'Lo que debe tener el kit de emergencia.',
  },
  {
    to: '/planes',
    titulo: 'Planes familiares',
    descripcion: 'Datos de cada familia y su plan personalizado.',
  },
]

const PASOS = [
  'Registra los tipos de riesgo, protocolos y elementos del kit.',
  'Crea el plan familiar con los datos y riesgos de la familia.',
  'Pulsa "Generar plan con IA": Django consulta a la IA y valida la respuesta.',
  'Revisa, imprime y comparte el plan de emergencia personalizado.',
]

export default function Inicio() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-br from-orange-600 to-red-700 p-6 text-white shadow-lg sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-orange-100">Prevención y Plan de Emergencia</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Prepárate antes de que ocurra</h1>
        <p className="mt-3 max-w-2xl text-orange-50">
          Organiza la información de prevención de tu familia y genera un plan de emergencia personalizado con apoyo de
          Inteligencia Artificial.
        </p>
        <Link
          to="/planes/nuevo"
          className="mt-6 inline-flex items-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-orange-700 shadow hover:bg-orange-50"
        >
          Crear un plan familiar
        </Link>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Módulos</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RECURSOS.map((r) => (
            <li key={r.to}>
              <Link
                to={r.to}
                className="block h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-orange-300 hover:shadow-md"
              >
                <p className="font-semibold text-slate-900">{r.titulo}</p>
                <p className="mt-1 text-sm text-slate-600">{r.descripcion}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">¿Cómo funciona?</h2>
        <ol className="space-y-3">
          {PASOS.map((paso, i) => (
            <li key={paso} className="flex gap-3 text-sm text-slate-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
                {i + 1}
              </span>
              <span className="pt-0.5">{paso}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

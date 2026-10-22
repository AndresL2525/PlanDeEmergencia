import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/layout/PageHeader'
import Alert from '../../components/ui/Alert'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import { inputClass } from '../../utils/styles'
import LoadingState from '../../components/ui/LoadingState'
import { planesApi } from '../../api/planes'
import { tiposRiesgoApi } from '../../api/tiposRiesgo'
import { useCrud } from '../../hooks/useCrud'
import { useFetch } from '../../hooks/useFetch'
import { getErrorMessage } from '../../utils/errors'
import type { PlanFamiliar } from '../../types/models'

const BOTON_LINK =
  'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition'

export default function PlanesLista() {
  const { items, loading, error, reload, remove } = useCrud(planesApi)
  const tipos = useFetch(() => tiposRiesgoApi.list())
  const tiposRiesgo = tipos.data ?? []

  const [busqueda, setBusqueda] = useState('')
  const [aEliminar, setAEliminar] = useState<PlanFamiliar | null>(null)
  const [eliminando, setEliminando] = useState(false)
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null)
  const [exito, setExito] = useState<string | null>(null)

  const texto = busqueda.trim().toLowerCase()
  const filtrados = items.filter(
    (p) =>
      p.nombre_familia.toLowerCase().includes(texto) ||
      p.responsable.toLowerCase().includes(texto) ||
      p.ciudad.toLowerCase().includes(texto),
  )

  const confirmarEliminar = async () => {
    if (!aEliminar) return
    setEliminando(true)
    setErrorEliminar(null)
    try {
      await remove(aEliminar.id)
      setExito(`El plan de "${aEliminar.nombre_familia}" fue eliminado.`)
      setAEliminar(null)
    } catch (err) {
      setErrorEliminar(getErrorMessage(err))
    } finally {
      setEliminando(false)
    }
  }

  const cargando = loading || tipos.loading
  const errorCarga = error ?? tipos.error

  return (
    <>
      <PageHeader
        title="Planes familiares"
        description="Información de cada familia y su plan de emergencia."
        actions={
          <Link to="/planes/nuevo" className={`${BOTON_LINK} bg-orange-600 text-white hover:bg-orange-700`}>
            + Nuevo plan
          </Link>
        }
      />

      <div className="space-y-4">
        {exito && <Alert type="success" message={exito} onClose={() => setExito(null)} />}

        <input
          type="search"
          aria-label="Buscar plan"
          placeholder="Buscar por familia, responsable o ciudad…"
          className={`${inputClass()} sm:max-w-sm`}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {cargando ? (
          <LoadingState />
        ) : errorCarga ? (
          <Alert
            message={errorCarga}
            onRetry={() => {
              void reload()
              void tipos.reload()
            }}
          />
        ) : filtrados.length === 0 ? (
          <EmptyState
            title={busqueda ? 'Sin resultados' : 'Aún no hay planes familiares'}
            description={busqueda ? 'Prueba con otra búsqueda.' : 'Registra una familia para generar su plan de emergencia.'}
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtrados.map((p) => (
              <li key={p.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-slate-900">{p.nombre_familia}</h2>
                  {p.plan_ia ? (
                    <Badge className="bg-green-100 text-green-800">Plan IA listo</Badge>
                  ) : (
                    <Badge>Sin plan IA</Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {p.responsable} · {p.ciudad}
                </p>
                <p className="text-sm text-slate-500">{p.numero_integrantes} integrante(s)</p>
                <div className="mt-3 flex flex-1 flex-wrap content-start gap-1">
                  {p.riesgos.map((id) => (
                    <Badge key={id} className="bg-orange-100 text-orange-800">
                      {tiposRiesgo.find((t) => t.id === id)?.nombre ?? `Riesgo ${id}`}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Link to={`/planes/${p.id}`} className={`${BOTON_LINK} bg-slate-900 text-white hover:bg-slate-700`}>
                    Ver
                  </Link>
                  <Link
                    to={`/planes/${p.id}/editar`}
                    className={`${BOTON_LINK} bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50`}
                  >
                    Editar
                  </Link>
                  <Button
                    variant="ghost"
                    className="text-red-600"
                    onClick={() => {
                      setErrorEliminar(null)
                      setAEliminar(p)
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={aEliminar !== null}
        title="Eliminar plan familiar"
        message={`¿Seguro que deseas eliminar el plan de "${aEliminar?.nombre_familia}"? También se perderá el plan generado por la IA.`}
        loading={eliminando}
        error={errorEliminar}
        onConfirm={confirmarEliminar}
        onCancel={() => setAEliminar(null)}
      />
    </>
  )
}

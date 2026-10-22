import { useState } from 'react'
import PageHeader from '../../components/layout/PageHeader'
import Alert from '../../components/ui/Alert'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import { inputClass } from '../../utils/styles'
import LoadingState from '../../components/ui/LoadingState'
import Modal from '../../components/ui/Modal'
import { protocolosApi } from '../../api/protocolos'
import { tiposRiesgoApi } from '../../api/tiposRiesgo'
import { useCrud } from '../../hooks/useCrud'
import { useFetch } from '../../hooks/useFetch'
import { getErrorMessage } from '../../utils/errors'
import type { Protocolo, ProtocoloInput } from '../../types/models'
import ProtocoloFormulario from './ProtocoloFormulario'

const FASES = [
  { campo: 'acciones_antes', label: 'Antes' },
  { campo: 'acciones_durante', label: 'Durante' },
  { campo: 'acciones_despues', label: 'Después' },
] as const

export default function ProtocolosLista() {
  const { items, loading, error, reload, create, update, remove } = useCrud(protocolosApi)
  const tipos = useFetch(() => tiposRiesgoApi.list())
  const tiposRiesgo = tipos.data ?? []

  const [filtroTipo, setFiltroTipo] = useState(0)
  const [formAbierto, setFormAbierto] = useState(false)
  const [editando, setEditando] = useState<Protocolo | null>(null)
  const [aEliminar, setAEliminar] = useState<Protocolo | null>(null)
  const [eliminando, setEliminando] = useState(false)
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null)
  const [exito, setExito] = useState<string | null>(null)

  const nombreTipo = (id: number) => tiposRiesgo.find((t) => t.id === id)?.nombre ?? 'Sin tipo'
  const filtrados = filtroTipo ? items.filter((p) => p.tipo_riesgo === filtroTipo) : items

  const abrirFormulario = (protocolo: Protocolo | null) => {
    setEditando(protocolo)
    setFormAbierto(true)
  }

  const guardar = async (datos: ProtocoloInput) => {
    if (editando) await update(editando.id, datos)
    else await create(datos)
    setExito(editando ? 'Protocolo actualizado.' : 'Protocolo creado.')
    setFormAbierto(false)
  }

  const confirmarEliminar = async () => {
    if (!aEliminar) return
    setEliminando(true)
    setErrorEliminar(null)
    try {
      await remove(aEliminar.id)
      setExito(`"${aEliminar.titulo}" fue eliminado.`)
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
        title="Protocolos"
        description="Qué hacer antes, durante y después de cada tipo de riesgo."
        actions={
          <Button onClick={() => abrirFormulario(null)} disabled={tiposRiesgo.length === 0}>
            + Nuevo protocolo
          </Button>
        }
      />

      <div className="space-y-4">
        {exito && <Alert type="success" message={exito} onClose={() => setExito(null)} />}
        {!cargando && !errorCarga && tiposRiesgo.length === 0 && (
          <Alert type="info" message="Primero debes crear al menos un tipo de riesgo para poder registrar protocolos." />
        )}

        <select
          aria-label="Filtrar por tipo de riesgo"
          className={`${inputClass()} sm:max-w-xs`}
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(Number(e.target.value))}
        >
          <option value={0}>Todos los tipos de riesgo</option>
          {tiposRiesgo.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </select>

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
            title="No hay protocolos"
            description={filtroTipo ? 'Este tipo de riesgo aún no tiene protocolos.' : 'Crea el primer protocolo.'}
          />
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            {filtrados.map((p) => (
              <li key={p.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-orange-100 text-orange-800">{nombreTipo(p.tipo_riesgo)}</Badge>
                  {p.linea_emergencia && <Badge>Línea: {p.linea_emergencia}</Badge>}
                </div>
                <h2 className="mt-2 font-semibold text-slate-900">{p.titulo}</h2>
                <p className="mt-1 text-sm text-slate-600">{p.objetivo}</p>

                <details className="mt-3 flex-1 text-sm">
                  <summary className="cursor-pointer font-medium text-orange-700">Ver acciones</summary>
                  <dl className="mt-2 space-y-2">
                    {FASES.map(({ campo, label }) => (
                      <div key={campo}>
                        <dt className="font-medium text-slate-900">{label}</dt>
                        <dd className="whitespace-pre-line text-slate-600">{p[campo]}</dd>
                      </div>
                    ))}
                  </dl>
                </details>

                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" className="flex-1" onClick={() => abrirFormulario(p)}>
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1 text-red-600"
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

      <Modal
        open={formAbierto}
        title={editando ? 'Editar protocolo' : 'Nuevo protocolo'}
        onClose={() => setFormAbierto(false)}
        size="lg"
      >
        <ProtocoloFormulario
          key={editando?.id ?? 'nuevo'}
          inicial={editando}
          tiposRiesgo={tiposRiesgo}
          onSubmit={guardar}
          onCancel={() => setFormAbierto(false)}
        />
      </Modal>

      <ConfirmDialog
        open={aEliminar !== null}
        title="Eliminar protocolo"
        message={`¿Seguro que deseas eliminar "${aEliminar?.titulo}"?`}
        loading={eliminando}
        error={errorEliminar}
        onConfirm={confirmarEliminar}
        onCancel={() => setAEliminar(null)}
      />
    </>
  )
}

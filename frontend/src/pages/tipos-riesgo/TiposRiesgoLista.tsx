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
import { tiposRiesgoApi } from '../../api/tiposRiesgo'
import { useCrud } from '../../hooks/useCrud'
import { CATEGORIAS_RIESGO, NIVELES, NIVEL_ESTILOS } from '../../utils/constants'
import { getErrorMessage } from '../../utils/errors'
import type { TipoRiesgo, TipoRiesgoInput } from '../../types/models'
import TipoRiesgoFormulario from './TipoRiesgoFormulario'

export default function TiposRiesgoLista() {
  const { items, loading, error, reload, create, update, remove } = useCrud(tiposRiesgoApi)
  const [busqueda, setBusqueda] = useState('')
  const [formAbierto, setFormAbierto] = useState(false)
  const [editando, setEditando] = useState<TipoRiesgo | null>(null)
  const [aEliminar, setAEliminar] = useState<TipoRiesgo | null>(null)
  const [eliminando, setEliminando] = useState(false)
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null)
  const [exito, setExito] = useState<string | null>(null)

  const filtrados = items.filter((t) => t.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()))

  const abrirFormulario = (tipo: TipoRiesgo | null) => {
    setEditando(tipo)
    setFormAbierto(true)
  }

  const guardar = async (datos: TipoRiesgoInput) => {
    if (editando) await update(editando.id, datos)
    else await create(datos)
    setExito(editando ? 'Tipo de riesgo actualizado.' : 'Tipo de riesgo creado.')
    setFormAbierto(false)
  }

  const confirmarEliminar = async () => {
    if (!aEliminar) return
    setEliminando(true)
    setErrorEliminar(null)
    try {
      await remove(aEliminar.id)
      setExito(`"${aEliminar.nombre}" fue eliminado.`)
      setAEliminar(null)
    } catch (err) {
      setErrorEliminar(getErrorMessage(err))
    } finally {
      setEliminando(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Tipos de riesgo"
        description="Amenazas a las que puede estar expuesta una familia."
        actions={<Button onClick={() => abrirFormulario(null)}>+ Nuevo tipo de riesgo</Button>}
      />

      <div className="space-y-4">
        {exito && <Alert type="success" message={exito} onClose={() => setExito(null)} />}

        <input
          type="search"
          aria-label="Buscar tipo de riesgo"
          placeholder="Buscar por nombre…"
          className={`${inputClass()} sm:max-w-xs`}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {loading ? (
          <LoadingState />
        ) : error ? (
          <Alert message={error} onRetry={reload} />
        ) : filtrados.length === 0 ? (
          <EmptyState
            title={busqueda ? 'Sin resultados' : 'Aún no hay tipos de riesgo'}
            description={busqueda ? 'Prueba con otro nombre.' : 'Crea el primero para empezar a construir el catálogo.'}
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtrados.map((t) => (
              <li key={t.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-slate-900">{t.nombre}</h2>
                  <Badge className={NIVEL_ESTILOS[t.nivel_peligrosidad]}>{NIVELES[t.nivel_peligrosidad]}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge>{CATEGORIAS_RIESGO[t.categoria]}</Badge>
                  {!t.activo && <Badge className="bg-slate-200 text-slate-600">Inactivo</Badge>}
                </div>
                <p className="mt-3 flex-1 text-sm text-slate-600">{t.descripcion}</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" className="flex-1" onClick={() => abrirFormulario(t)}>
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1 text-red-600"
                    onClick={() => {
                      setErrorEliminar(null)
                      setAEliminar(t)
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
        title={editando ? 'Editar tipo de riesgo' : 'Nuevo tipo de riesgo'}
        onClose={() => setFormAbierto(false)}
      >
        <TipoRiesgoFormulario
          key={editando?.id ?? 'nuevo'}
          inicial={editando}
          onSubmit={guardar}
          onCancel={() => setFormAbierto(false)}
        />
      </Modal>

      <ConfirmDialog
        open={aEliminar !== null}
        title="Eliminar tipo de riesgo"
        message={`¿Seguro que deseas eliminar "${aEliminar?.nombre}"? Si tiene protocolos asociados, el servidor no permitirá eliminarlo.`}
        loading={eliminando}
        error={errorEliminar}
        onConfirm={confirmarEliminar}
        onCancel={() => setAEliminar(null)}
      />
    </>
  )
}

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
import { elementosKitApi } from '../../api/elementosKit'
import { tiposRiesgoApi } from '../../api/tiposRiesgo'
import { useCrud } from '../../hooks/useCrud'
import { useFetch } from '../../hooks/useFetch'
import { CATEGORIAS_KIT, opciones } from '../../utils/constants'
import { getErrorMessage } from '../../utils/errors'
import type { CategoriaKit, ElementoKit, ElementoKitInput } from '../../types/models'
import ElementoKitFormulario from './ElementoKitFormulario'

export default function ElementosKitLista() {
  const { items, loading, error, reload, create, update, remove } = useCrud(elementosKitApi)
  const tipos = useFetch(() => tiposRiesgoApi.list())
  const tiposRiesgo = tipos.data ?? []

  const [busqueda, setBusqueda] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState<CategoriaKit | ''>('')
  const [formAbierto, setFormAbierto] = useState(false)
  const [editando, setEditando] = useState<ElementoKit | null>(null)
  const [aEliminar, setAEliminar] = useState<ElementoKit | null>(null)
  const [eliminando, setEliminando] = useState(false)
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null)
  const [exito, setExito] = useState<string | null>(null)

  const nombresTipos = (ids: number[]) =>
    ids.map((id) => tiposRiesgo.find((t) => t.id === id)?.nombre).filter((n): n is string => Boolean(n))

  const filtrados = items.filter(
    (e) =>
      e.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()) &&
      (!filtroCategoria || e.categoria === filtroCategoria),
  )

  const abrirFormulario = (elemento: ElementoKit | null) => {
    setEditando(elemento)
    setFormAbierto(true)
  }

  const guardar = async (datos: ElementoKitInput) => {
    if (editando) await update(editando.id, datos)
    else await create(datos)
    setExito(editando ? 'Elemento actualizado.' : 'Elemento creado.')
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

  const cargando = loading || tipos.loading
  const errorCarga = error ?? tipos.error

  return (
    <>
      <PageHeader
        title="Elementos del kit"
        description="Artículos recomendados para el kit de emergencia."
        actions={<Button onClick={() => abrirFormulario(null)}>+ Nuevo elemento</Button>}
      />

      <div className="space-y-4">
        {exito && <Alert type="success" message={exito} onClose={() => setExito(null)} />}

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="search"
            aria-label="Buscar elemento"
            placeholder="Buscar por nombre…"
            className={`${inputClass()} sm:max-w-xs`}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <select
            aria-label="Filtrar por categoría"
            className={`${inputClass()} sm:max-w-xs`}
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value as CategoriaKit | '')}
          >
            <option value="">Todas las categorías</option>
            {opciones(CATEGORIAS_KIT).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

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
          <EmptyState title="No hay elementos" description="Ajusta los filtros o crea un nuevo elemento del kit." />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtrados.map((e) => (
              <li key={e.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-slate-900">{e.nombre}</h2>
                  <span className="shrink-0 text-sm font-semibold text-orange-700">
                    {e.cantidad_sugerida} {e.unidad}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge>{CATEGORIAS_KIT[e.categoria]}</Badge>
                  {e.es_esencial && <Badge className="bg-red-100 text-red-800">Esencial</Badge>}
                </div>
                <p className="mt-3 text-sm text-slate-600">{e.descripcion}</p>
                {e.tipos_riesgo.length > 0 && (
                  <p className="mt-2 flex-1 text-xs text-slate-500">Útil para: {nombresTipos(e.tipos_riesgo).join(', ')}</p>
                )}
                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" className="flex-1" onClick={() => abrirFormulario(e)}>
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1 text-red-600"
                    onClick={() => {
                      setErrorEliminar(null)
                      setAEliminar(e)
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
        title={editando ? 'Editar elemento del kit' : 'Nuevo elemento del kit'}
        onClose={() => setFormAbierto(false)}
        size="lg"
      >
        <ElementoKitFormulario
          key={editando?.id ?? 'nuevo'}
          inicial={editando}
          tiposRiesgo={tiposRiesgo}
          onSubmit={guardar}
          onCancel={() => setFormAbierto(false)}
        />
      </Modal>

      <ConfirmDialog
        open={aEliminar !== null}
        title="Eliminar elemento"
        message={`¿Seguro que deseas eliminar "${aEliminar?.nombre}"?`}
        loading={eliminando}
        error={errorEliminar}
        onConfirm={confirmarEliminar}
        onCancel={() => setAEliminar(null)}
      />
    </>
  )
}

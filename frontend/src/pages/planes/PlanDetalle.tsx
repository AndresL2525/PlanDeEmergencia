import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/layout/PageHeader'
import Alert from '../../components/ui/Alert'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import LoadingState from '../../components/ui/LoadingState'
import { planesApi } from '../../api/planes'
import { useCatalogos } from '../../hooks/useCatalogos'
import { useFetch } from '../../hooks/useFetch'
import { TIPOS_VIVIENDA, formatearFecha } from '../../utils/constants'
import { getErrorMessage } from '../../utils/errors'

function Tarjeta({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-base font-semibold text-slate-900">{titulo}</h2>
      <div className="space-y-1 text-sm text-slate-700">{children}</div>
    </section>
  )
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: ReactNode }) {
  return (
    <p>
      <span className="font-medium text-slate-900">{etiqueta}: </span>
      {valor || '—'}
    </p>
  )
}

export default function PlanDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const planFetch = useFetch(() => planesApi.get(Number(id)), [id])
  const catalogos = useCatalogos()

  const [confirmar, setConfirmar] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null)

  if (planFetch.loading || catalogos.loading) return <LoadingState />

  const error = planFetch.error ?? catalogos.error
  if (error || !planFetch.data || !catalogos.data) {
    return (
      <div className="space-y-4">
        <Alert
          message={error ?? 'No se encontró el plan.'}
          onRetry={() => {
            void planFetch.reload()
            void catalogos.reload()
          }}
        />
        <Link to="/planes" className="text-sm font-medium text-orange-700 underline">
          ← Volver a planes familiares
        </Link>
      </div>
    )
  }

  const plan = planFetch.data
  const { tiposRiesgo, protocolos, elementosKit } = catalogos.data
  const riesgos = tiposRiesgo.filter((t) => plan.riesgos.includes(t.id))
  const kit = elementosKit.filter((e) => plan.elementos_kit.includes(e.id))
  const protocolo = protocolos.find((p) => p.id === plan.protocolo_recomendado)

  const caracteristicas = [
    plan.tiene_ninos && 'Niños',
    plan.tiene_adultos_mayores && 'Adultos mayores',
    plan.tiene_personas_discapacidad && 'Personas con discapacidad',
    plan.tiene_mascotas && 'Mascotas',
  ].filter((c): c is string => Boolean(c))

  const eliminar = async () => {
    setEliminando(true)
    setErrorEliminar(null)
    try {
      await planesApi.remove(plan.id)
      navigate('/planes')
    } catch (err) {
      setErrorEliminar(getErrorMessage(err))
      setEliminando(false)
    }
  }

  return (
    <>
      <PageHeader
        title={plan.nombre_familia}
        description={`Responsable: ${plan.responsable} · ${plan.ciudad}`}
        actions={
          <>
            <Link
              to={`/planes/${plan.id}/plan-ia`}
              className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
            >
              {plan.plan_ia ? 'Ver plan con IA' : 'Generar plan con IA'}
            </Link>
            <Link
              to={`/planes/${plan.id}/editar`}
              className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
            >
              Editar
            </Link>
            <Button variant="ghost" className="text-red-600" onClick={() => setConfirmar(true)}>
              Eliminar
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Tarjeta titulo="Datos de la familia">
          <Dato etiqueta="Teléfono" valor={plan.telefono_responsable} />
          <Dato etiqueta="Dirección" valor={plan.direccion} />
          <Dato etiqueta="Vivienda" valor={TIPOS_VIVIENDA[plan.tipo_vivienda]} />
          <Dato etiqueta="Integrantes" valor={plan.numero_integrantes} />
          <Dato etiqueta="Incluye" valor={caracteristicas.join(', ')} />
          <Dato etiqueta="Condiciones médicas" valor={plan.condiciones_medicas} />
        </Tarjeta>

        <Tarjeta titulo="Punto de encuentro y comunicación">
          <Dato etiqueta="Punto de encuentro" valor={plan.punto_encuentro} />
          <Dato etiqueta="Medio de comunicación" valor={plan.medio_comunicacion} />
          <Dato
            etiqueta="Contacto de emergencia"
            valor={`${plan.contacto_emergencia_nombre} (${plan.contacto_emergencia_telefono})`}
          />
        </Tarjeta>

        <Tarjeta titulo="Riesgos y protocolo">
          <div className="flex flex-wrap gap-1 pb-2">
            {riesgos.length > 0 ? (
              riesgos.map((r) => (
                <Badge key={r.id} className="bg-orange-100 text-orange-800">
                  {r.nombre}
                </Badge>
              ))
            ) : (
              <span className="text-slate-500">Sin riesgos seleccionados.</span>
            )}
          </div>
          <Dato etiqueta="Protocolo recomendado" valor={protocolo?.titulo} />
        </Tarjeta>

        <Tarjeta titulo="Kit de emergencia">
          {kit.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5">
              {kit.map((e) => (
                <li key={e.id}>
                  {e.nombre} — {e.cantidad_sugerida} {e.unidad}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500">No se han seleccionado elementos.</p>
          )}
        </Tarjeta>

        <Tarjeta titulo="Plan generado por IA">
          <Dato etiqueta="Estado" valor={plan.plan_ia ? 'Generado' : 'Pendiente'} />
          <Dato etiqueta="Última generación" valor={formatearFecha(plan.fecha_generacion_ia)} />
        </Tarjeta>
      </div>

      <ConfirmDialog
        open={confirmar}
        title="Eliminar plan familiar"
        message={`¿Seguro que deseas eliminar el plan de "${plan.nombre_familia}"?`}
        loading={eliminando}
        error={errorEliminar}
        onConfirm={eliminar}
        onCancel={() => setConfirmar(false)}
      />
    </>
  )
}

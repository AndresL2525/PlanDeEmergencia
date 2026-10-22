import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHeader from '../components/layout/PageHeader'
import PlanIAView from '../components/plan-ia/PlanIAView'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import LoadingState from '../components/ui/LoadingState'
import Spinner from '../components/ui/Spinner'
import { iaApi } from '../api/ia'
import { planesApi } from '../api/planes'
import { useFetch } from '../hooks/useFetch'
import { formatearFecha } from '../utils/constants'
import { getErrorMessage } from '../utils/errors'
import type { PlanIA } from '../types/planIA'

// Flujo: React -> Django (POST /planes/:id/generar-plan-ia/) -> API de IA -> Django -> React.
export default function GenerarPlanIA() {
  const { id } = useParams()
  const planFetch = useFetch(() => planesApi.get(Number(id)), [id])

  const [generado, setGenerado] = useState<{ plan: PlanIA; fecha: string } | null>(null)
  const [generando, setGenerando] = useState(false)
  const [errorIA, setErrorIA] = useState<string | null>(null)

  if (planFetch.loading) return <LoadingState />
  if (planFetch.error || !planFetch.data) {
    return (
      <div className="space-y-4">
        <Alert message={planFetch.error ?? 'No se encontró el plan.'} onRetry={planFetch.reload} />
        <Link to="/planes" className="text-sm font-medium text-orange-700 underline">
          ← Volver a planes familiares
        </Link>
      </div>
    )
  }

  const plan = planFetch.data
  const planIA = generado?.plan ?? plan.plan_ia
  const fecha = generado?.fecha ?? plan.fecha_generacion_ia
  const sinRiesgos = plan.riesgos.length === 0

  const generar = async () => {
    setGenerando(true)
    setErrorIA(null)
    try {
      const resultado = await iaApi.generarPlan(plan.id)
      setGenerado({ plan: resultado, fecha: new Date().toISOString() })
    } catch (err) {
      setErrorIA(getErrorMessage(err))
    } finally {
      setGenerando(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Plan de emergencia con IA"
        description={`${plan.nombre_familia} · ${plan.ciudad}`}
        actions={
          <>
            <Link
              to={`/planes/${plan.id}`}
              className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
            >
              ← Volver al plan
            </Link>
            {planIA && !generando && (
              <Button variant="secondary" onClick={() => window.print()}>
                Imprimir
              </Button>
            )}
            <Button onClick={generar} loading={generando} disabled={sinRiesgos}>
              {planIA ? 'Volver a generar' : 'Generar plan'}
            </Button>
          </>
        }
      />

      <div className="space-y-4">
        {sinRiesgos && (
          <Alert
            type="warning"
            message="Este plan no tiene tipos de riesgo seleccionados. Edítalo y agrega al menos uno para poder generar el plan con IA."
          />
        )}

        {errorIA && !generando && <Alert title="No se pudo generar el plan" message={errorIA} onRetry={generar} />}

        {generando ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-16 text-center text-orange-600">
            <Spinner size="lg" />
            <p className="mt-2 font-medium text-slate-800">La IA está elaborando el plan de emergencia…</p>
            <p className="text-sm text-slate-500">Esto puede tardar hasta un minuto. No cierres esta página.</p>
          </div>
        ) : planIA ? (
          <>
            <p className="text-xs text-slate-500">Generado el {formatearFecha(fecha)}</p>
            <PlanIAView plan={planIA} />
          </>
        ) : (
          !sinRiesgos && (
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white px-6 py-12 text-center">
              <p className="font-semibold text-slate-800">Aún no hay un plan generado</p>
              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                La IA analizará los datos de la familia, sus riesgos, los protocolos y el kit registrados para crear un plan
                personalizado.
              </p>
            </div>
          )
        )}
      </div>
    </>
  )
}

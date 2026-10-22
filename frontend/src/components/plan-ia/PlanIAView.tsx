import Badge from '../ui/Badge'
import PasosLista from './PasosLista'
import SeccionCard from './SeccionCard'
import { NIVELES, NIVEL_ESTILOS } from '../../utils/constants'
import type { PlanIA } from '../../types/planIA'
import type { NivelPeligrosidad } from '../../types/models'

function NivelBadge({ nivel, prefijo = '' }: { nivel: NivelPeligrosidad; prefijo?: string }) {
  return (
    <Badge className={NIVEL_ESTILOS[nivel] ?? undefined}>
      {prefijo}
      {NIVELES[nivel] ?? nivel}
    </Badge>
  )
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor?: string }) {
  if (!valor) return null
  return (
    <p>
      <span className="font-medium text-slate-900">{etiqueta}: </span>
      {valor}
    </p>
  )
}

// Muestra todas las secciones del plan de emergencia generado por la IA.
export default function PlanIAView({ plan }: { plan: PlanIA }) {
  const info = plan.informacion_general
  const riesgos = plan.riesgos_identificados ?? []
  const preventivas = plan.acciones_preventivas ?? []
  const kit = plan.kit_emergencia ?? []
  const contactos = plan.medio_comunicacion?.contactos ?? []
  const recomendaciones = plan.recomendaciones_adicionales ?? []

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SeccionCard titulo="Información general" className="md:col-span-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <p className="text-lg font-semibold text-slate-900">{info?.titulo}</p>
          {info?.nivel_riesgo_general && <NivelBadge nivel={info.nivel_riesgo_general} prefijo="Riesgo general: " />}
        </div>
        <p className="mt-2">{info?.resumen}</p>
      </SeccionCard>

      <SeccionCard titulo="Riesgos identificados">
        <ul className="space-y-3">
          {riesgos.map((r, i) => (
            <li key={i}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-slate-900">{r.nombre}</span>
                <NivelBadge nivel={r.nivel} />
              </div>
              <p className="mt-1 text-slate-600">{r.justificacion}</p>
            </li>
          ))}
        </ul>
      </SeccionCard>

      <SeccionCard titulo="Acciones preventivas (antes)">
        <ul className="space-y-3">
          {preventivas.map((a, i) => (
            <li key={i} className="border-l-2 border-orange-300 pl-3">
              <p>{a.accion}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <NivelBadge nivel={a.prioridad} prefijo="Prioridad " />
                {a.responsable && <span>Responsable: {a.responsable}</span>}
              </div>
            </li>
          ))}
        </ul>
      </SeccionCard>

      <SeccionCard titulo="Durante la emergencia">
        <PasosLista pasos={plan.acciones_durante ?? []} />
      </SeccionCard>

      <SeccionCard titulo="Después de la emergencia">
        <PasosLista pasos={plan.acciones_despues ?? []} />
      </SeccionCard>

      <SeccionCard titulo="Kit de emergencia" className="md:col-span-2">
        <ul className="grid gap-3 sm:grid-cols-2">
          {kit.map((e, i) => (
            <li key={i} className="rounded-lg bg-slate-50 p-3">
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-slate-900">{e.nombre}</span>
                <span className="shrink-0 text-xs font-semibold text-orange-700">
                  {e.cantidad} {e.unidad}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600">{e.motivo}</p>
            </li>
          ))}
        </ul>
      </SeccionCard>

      <SeccionCard titulo="Protocolo recomendado">
        <p className="font-medium text-slate-900">{plan.protocolo_recomendado?.titulo}</p>
        <p className="mt-1">{plan.protocolo_recomendado?.motivo}</p>
      </SeccionCard>

      <SeccionCard titulo="Punto de encuentro">
        <div className="space-y-1">
          <Dato etiqueta="Principal" valor={plan.punto_encuentro?.principal} />
          <Dato etiqueta="Alternativo" valor={plan.punto_encuentro?.alternativo} />
          <Dato etiqueta="Indicaciones" valor={plan.punto_encuentro?.indicaciones} />
        </div>
      </SeccionCard>

      <SeccionCard titulo="Medio de comunicación" className="md:col-span-2">
        <div className="space-y-1">
          <Dato etiqueta="Principal" valor={plan.medio_comunicacion?.principal} />
          <Dato etiqueta="Alternativo" valor={plan.medio_comunicacion?.alternativo} />
        </div>
        {contactos.length > 0 && (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {contactos.map((c, i) => (
              <li key={i} className="rounded-lg bg-slate-50 p-3">
                <p className="font-medium text-slate-900">{c.nombre}</p>
                <p className="text-xs text-slate-600">
                  {c.relacion} · {c.telefono}
                </p>
              </li>
            ))}
          </ul>
        )}
      </SeccionCard>

      <SeccionCard titulo="Recomendaciones adicionales" className="md:col-span-2">
        <ul className="list-disc space-y-1 pl-5">
          {recomendaciones.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </SeccionCard>
    </div>
  )
}

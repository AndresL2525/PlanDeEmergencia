import type { ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/layout/PageHeader'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import { Checkbox, CheckboxGroup, Field } from '../../components/ui/FormField'
import { inputClass } from '../../utils/styles'
import LoadingState from '../../components/ui/LoadingState'
import { planesApi } from '../../api/planes'
import { useCatalogos } from '../../hooks/useCatalogos'
import { useFetch } from '../../hooks/useFetch'
import { useFormulario } from '../../hooks/useFormulario'
import type { Errores } from '../../hooks/useFormulario'
import { TELEFONO_REGEX, TIPOS_VIVIENDA, opciones } from '../../utils/constants'
import type { ElementoKit, PlanFamiliar, PlanFamiliarInput, Protocolo, TipoRiesgo } from '../../types/models'

const VACIO: PlanFamiliarInput = {
  nombre_familia: '',
  responsable: '',
  telefono_responsable: '',
  direccion: '',
  ciudad: '',
  tipo_vivienda: 'casa',
  numero_integrantes: 1,
  tiene_ninos: false,
  tiene_adultos_mayores: false,
  tiene_personas_discapacidad: false,
  tiene_mascotas: false,
  condiciones_medicas: '',
  punto_encuentro: '',
  medio_comunicacion: '',
  contacto_emergencia_nombre: '',
  contacto_emergencia_telefono: '',
  riesgos: [],
  protocolo_recomendado: null,
  elementos_kit: [],
}

// Toma solo los campos editables de un plan existente.
function aInput(plan: PlanFamiliar): PlanFamiliarInput {
  const resultado = { ...VACIO }
  for (const campo of Object.keys(VACIO) as (keyof PlanFamiliarInput)[]) {
    ;(resultado as Record<string, unknown>)[campo] = plan[campo]
  }
  return resultado
}

function crearValidador(protocolos: Protocolo[]) {
  return (v: PlanFamiliarInput): Errores => {
    const errores: Errores = {}
    const obligatorio = (campo: keyof PlanFamiliarInput, mensaje: string) => {
      if (!String(v[campo]).trim()) errores[campo] = mensaje
    }
    obligatorio('nombre_familia', 'El nombre de la familia es obligatorio.')
    obligatorio('responsable', 'El responsable es obligatorio.')
    obligatorio('direccion', 'La dirección es obligatoria.')
    obligatorio('ciudad', 'La ciudad es obligatoria.')
    obligatorio('punto_encuentro', 'Indica un punto de encuentro.')
    obligatorio('medio_comunicacion', 'Indica un medio de comunicación.')
    obligatorio('contacto_emergencia_nombre', 'Indica el nombre del contacto de emergencia.')

    if (!TELEFONO_REGEX.test(v.telefono_responsable)) {
      errores.telefono_responsable = 'Teléfono inválido: solo números (7 a 15 dígitos).'
    }
    if (!TELEFONO_REGEX.test(v.contacto_emergencia_telefono)) {
      errores.contacto_emergencia_telefono = 'Teléfono inválido: solo números (7 a 15 dígitos).'
    }
    if (!Number.isInteger(v.numero_integrantes) || v.numero_integrantes < 1 || v.numero_integrantes > 20) {
      errores.numero_integrantes = 'Debe ser un número entre 1 y 20.'
    }
    if (v.riesgos.length === 0) errores.riesgos = 'Selecciona al menos un tipo de riesgo.'

    // Validación cruzada: el protocolo debe corresponder a uno de los riesgos elegidos.
    if (v.protocolo_recomendado) {
      const protocolo = protocolos.find((p) => p.id === v.protocolo_recomendado)
      if (protocolo && !v.riesgos.includes(protocolo.tipo_riesgo)) {
        errores.protocolo_recomendado = 'El protocolo debe pertenecer a uno de los riesgos seleccionados.'
      }
    }
    return errores
  }
}

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-slate-900">{titulo}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

interface FormProps {
  plan: PlanFamiliar | null
  tiposRiesgo: TipoRiesgo[]
  protocolos: Protocolo[]
  elementosKit: ElementoKit[]
}

function FormularioPlan({ plan, tiposRiesgo, protocolos, elementosKit }: FormProps) {
  const navigate = useNavigate()
  const { valores, setCampo, errores, errorGeneral, enviando, handleSubmit } = useFormulario<PlanFamiliarInput>(
    plan ? aInput(plan) : VACIO,
    crearValidador(protocolos),
  )

  // Solo se ofrecen protocolos de los riesgos seleccionados.
  const protocolosDisponibles = protocolos.filter((p) => valores.riesgos.includes(p.tipo_riesgo))

  const cambiarRiesgos = (riesgos: number[]) => {
    setCampo('riesgos', riesgos)
    const actual = protocolos.find((p) => p.id === valores.protocolo_recomendado)
    if (actual && !riesgos.includes(actual.tipo_riesgo)) setCampo('protocolo_recomendado', null)
  }

  const enviar = async (datos: PlanFamiliarInput) => {
    const guardado = plan ? await planesApi.update(plan.id, datos) : await planesApi.create(datos)
    navigate(`/planes/${guardado.id}`)
  }

  const texto = (campo: keyof PlanFamiliarInput, label: string, opts: { required?: boolean; placeholder?: string; hint?: string } = {}) => (
    <Field label={label} htmlFor={`pf-${campo}`} required={opts.required} error={errores[campo]} hint={opts.hint}>
      <input
        id={`pf-${campo}`}
        className={inputClass(errores[campo])}
        value={String(valores[campo] ?? '')}
        placeholder={opts.placeholder}
        onChange={(e) => setCampo(campo, e.target.value as never)}
      />
    </Field>
  )

  return (
    <form onSubmit={handleSubmit(enviar)} noValidate className="space-y-5">
      {errorGeneral && <Alert message={errorGeneral} />}

      <Seccion titulo="Datos de la familia">
        <div className="grid gap-4 sm:grid-cols-2">
          {texto('nombre_familia', 'Nombre de la familia', { required: true, placeholder: 'Ej. Familia Pérez' })}
          {texto('responsable', 'Responsable', { required: true })}
          {texto('telefono_responsable', 'Teléfono del responsable', { required: true, placeholder: '3001234567' })}
          {texto('ciudad', 'Ciudad', { required: true })}
          {texto('direccion', 'Dirección', { required: true })}
          <Field label="Tipo de vivienda" htmlFor="pf-tipo_vivienda" required error={errores.tipo_vivienda}>
            <select
              id="pf-tipo_vivienda"
              className={inputClass(errores.tipo_vivienda)}
              value={valores.tipo_vivienda}
              onChange={(e) => setCampo('tipo_vivienda', e.target.value as PlanFamiliarInput['tipo_vivienda'])}
            >
              {opciones(TIPOS_VIVIENDA).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Seccion>

      <Seccion titulo="Características del hogar">
        <Field label="Número de integrantes" htmlFor="pf-integrantes" required error={errores.numero_integrantes}>
          <input
            id="pf-integrantes"
            type="number"
            min={1}
            max={20}
            className={`${inputClass(errores.numero_integrantes)} sm:max-w-40`}
            value={valores.numero_integrantes}
            onChange={(e) => setCampo('numero_integrantes', Number(e.target.value))}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Checkbox id="pf-ninos" label="Hay niños" checked={valores.tiene_ninos} onChange={(v) => setCampo('tiene_ninos', v)} />
          <Checkbox
            id="pf-mayores"
            label="Hay adultos mayores"
            checked={valores.tiene_adultos_mayores}
            onChange={(v) => setCampo('tiene_adultos_mayores', v)}
          />
          <Checkbox
            id="pf-discapacidad"
            label="Hay personas con discapacidad"
            checked={valores.tiene_personas_discapacidad}
            onChange={(v) => setCampo('tiene_personas_discapacidad', v)}
          />
          <Checkbox id="pf-mascotas" label="Hay mascotas" checked={valores.tiene_mascotas} onChange={(v) => setCampo('tiene_mascotas', v)} />
        </div>
        <Field
          label="Condiciones médicas"
          htmlFor="pf-condiciones"
          error={errores.condiciones_medicas}
          hint="Opcional. Ej. asma, diabetes, medicamentos permanentes."
        >
          <textarea
            id="pf-condiciones"
            rows={2}
            className={inputClass(errores.condiciones_medicas)}
            value={valores.condiciones_medicas}
            onChange={(e) => setCampo('condiciones_medicas', e.target.value)}
          />
        </Field>
      </Seccion>

      <Seccion titulo="Riesgos y protocolo">
        <CheckboxGroup
          legend="Riesgos a los que está expuesta la familia"
          name="pf-riesgos"
          required
          options={tiposRiesgo.map((t) => ({ value: t.id, label: t.nombre }))}
          selected={valores.riesgos}
          onChange={cambiarRiesgos}
          error={errores.riesgos}
          emptyMessage="No hay tipos de riesgo registrados. Créalos primero."
        />
        <Field
          label="Protocolo recomendado"
          htmlFor="pf-protocolo"
          error={errores.protocolo_recomendado}
          hint="Opcional. Solo se muestran protocolos de los riesgos seleccionados."
        >
          <select
            id="pf-protocolo"
            className={inputClass(errores.protocolo_recomendado)}
            value={valores.protocolo_recomendado ?? 0}
            onChange={(e) => setCampo('protocolo_recomendado', Number(e.target.value) || null)}
          >
            <option value={0}>Sin protocolo</option>
            {protocolosDisponibles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.titulo}
              </option>
            ))}
          </select>
        </Field>
      </Seccion>

      <Seccion titulo="Kit de emergencia">
        <CheckboxGroup
          legend="Elementos con los que cuenta o debe tener la familia"
          name="pf-kit"
          options={elementosKit.map((e) => ({ value: e.id, label: `${e.nombre} (${e.cantidad_sugerida} ${e.unidad})` }))}
          selected={valores.elementos_kit}
          onChange={(v) => setCampo('elementos_kit', v)}
          error={errores.elementos_kit}
          emptyMessage="No hay elementos del kit registrados."
        />
      </Seccion>

      <Seccion titulo="Punto de encuentro y comunicación">
        <div className="grid gap-4 sm:grid-cols-2">
          {texto('punto_encuentro', 'Punto de encuentro', { required: true, placeholder: 'Ej. Parque principal del barrio' })}
          {texto('medio_comunicacion', 'Medio de comunicación', { required: true, placeholder: 'Ej. Grupo de WhatsApp familiar' })}
          {texto('contacto_emergencia_nombre', 'Contacto de emergencia', { required: true })}
          {texto('contacto_emergencia_telefono', 'Teléfono del contacto', { required: true })}
        </div>
      </Seccion>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Link
          to={plan ? `/planes/${plan.id}` : '/planes'}
          className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
        >
          Cancelar
        </Link>
        <Button type="submit" loading={enviando}>
          {plan ? 'Guardar cambios' : 'Crear plan familiar'}
        </Button>
      </div>
    </form>
  )
}

// Página para crear (/planes/nuevo) o editar (/planes/:id/editar) un plan familiar.
export default function PlanFormulario() {
  const { id } = useParams()
  const catalogos = useCatalogos()
  const planActual = useFetch(() => (id ? planesApi.get(Number(id)) : Promise.resolve(null)), [id])

  // Evita mostrar por un instante datos de otro plan al cambiar de ruta.
  const plan = id && planActual.data?.id === Number(id) ? planActual.data : null
  const cargando = catalogos.loading || planActual.loading || (Boolean(id) && !plan && !planActual.error)
  const error = catalogos.error ?? planActual.error

  return (
    <>
      <PageHeader
        title={id ? 'Editar plan familiar' : 'Nuevo plan familiar'}
        description="Completa la información de la familia. Los campos con * son obligatorios."
      />
      {cargando ? (
        <LoadingState />
      ) : error ? (
        <Alert
          message={error}
          onRetry={() => {
            void catalogos.reload()
            void planActual.reload()
          }}
        />
      ) : (
        catalogos.data && (
          <FormularioPlan key={id ?? 'nuevo'} plan={plan} {...catalogos.data} />
        )
      )}
    </>
  )
}

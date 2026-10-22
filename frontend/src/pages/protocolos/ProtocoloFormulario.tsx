import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import { Field } from '../../components/ui/FormField'
import { inputClass } from '../../utils/styles'
import { useFormulario } from '../../hooks/useFormulario'
import type { Errores } from '../../hooks/useFormulario'
import type { Protocolo, ProtocoloInput, TipoRiesgo } from '../../types/models'

function validar(v: ProtocoloInput): Errores {
  const errores: Errores = {}
  if (!v.tipo_riesgo) errores.tipo_riesgo = 'Selecciona un tipo de riesgo.'
  if (!v.titulo.trim()) errores.titulo = 'El título es obligatorio.'
  if (!v.objetivo.trim()) errores.objetivo = 'El objetivo es obligatorio.'
  if (!v.acciones_antes.trim()) errores.acciones_antes = 'Describe las acciones antes de la emergencia.'
  if (!v.acciones_durante.trim()) errores.acciones_durante = 'Describe las acciones durante la emergencia.'
  if (!v.acciones_despues.trim()) errores.acciones_despues = 'Describe las acciones después de la emergencia.'
  return errores
}

interface Props {
  inicial: Protocolo | null
  tiposRiesgo: TipoRiesgo[]
  onSubmit: (datos: ProtocoloInput) => Promise<void>
  onCancel: () => void
}

const CAMPOS_ACCIONES = [
  { campo: 'acciones_antes', label: 'Acciones antes' },
  { campo: 'acciones_durante', label: 'Acciones durante' },
  { campo: 'acciones_despues', label: 'Acciones después' },
] as const

export default function ProtocoloFormulario({ inicial, tiposRiesgo, onSubmit, onCancel }: Props) {
  const { valores, setCampo, errores, errorGeneral, enviando, handleSubmit } = useFormulario<ProtocoloInput>(
    {
      tipo_riesgo: inicial?.tipo_riesgo ?? 0,
      titulo: inicial?.titulo ?? '',
      objetivo: inicial?.objetivo ?? '',
      acciones_antes: inicial?.acciones_antes ?? '',
      acciones_durante: inicial?.acciones_durante ?? '',
      acciones_despues: inicial?.acciones_despues ?? '',
      linea_emergencia: inicial?.linea_emergencia ?? '',
    },
    validar,
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {errorGeneral && <Alert message={errorGeneral} />}

      <Field label="Tipo de riesgo" htmlFor="pr-tipo" required error={errores.tipo_riesgo}>
        <select
          id="pr-tipo"
          className={inputClass(errores.tipo_riesgo)}
          value={valores.tipo_riesgo}
          onChange={(e) => setCampo('tipo_riesgo', Number(e.target.value))}
        >
          <option value={0}>Selecciona…</option>
          {tiposRiesgo.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Título" htmlFor="pr-titulo" required error={errores.titulo}>
        <input
          id="pr-titulo"
          className={inputClass(errores.titulo)}
          value={valores.titulo}
          onChange={(e) => setCampo('titulo', e.target.value)}
          placeholder="Ej. Protocolo de evacuación por sismo"
        />
      </Field>

      <Field label="Objetivo" htmlFor="pr-objetivo" required error={errores.objetivo}>
        <textarea
          id="pr-objetivo"
          rows={2}
          className={inputClass(errores.objetivo)}
          value={valores.objetivo}
          onChange={(e) => setCampo('objetivo', e.target.value)}
        />
      </Field>

      {CAMPOS_ACCIONES.map(({ campo, label }) => (
        <Field key={campo} label={label} htmlFor={`pr-${campo}`} required error={errores[campo]}>
          <textarea
            id={`pr-${campo}`}
            rows={3}
            className={inputClass(errores[campo])}
            value={valores[campo]}
            onChange={(e) => setCampo(campo, e.target.value)}
          />
        </Field>
      ))}

      <Field
        label="Línea de emergencia"
        htmlFor="pr-linea"
        error={errores.linea_emergencia}
        hint="Opcional. Ej. 123"
      >
        <input
          id="pr-linea"
          className={inputClass(errores.linea_emergencia)}
          value={valores.linea_emergencia}
          onChange={(e) => setCampo('linea_emergencia', e.target.value)}
        />
      </Field>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={enviando}>
          Cancelar
        </Button>
        <Button type="submit" loading={enviando}>
          {inicial ? 'Guardar cambios' : 'Crear protocolo'}
        </Button>
      </div>
    </form>
  )
}

import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import { Checkbox, Field } from '../../components/ui/FormField'
import { inputClass } from '../../utils/styles'
import { useFormulario } from '../../hooks/useFormulario'
import type { Errores } from '../../hooks/useFormulario'
import { CATEGORIAS_RIESGO, NIVELES, opciones } from '../../utils/constants'
import type { TipoRiesgo, TipoRiesgoInput } from '../../types/models'

const VACIO: TipoRiesgoInput = {
  nombre: '',
  descripcion: '',
  categoria: 'natural',
  nivel_peligrosidad: 'medio',
  activo: true,
}

function validar(v: TipoRiesgoInput): Errores {
  const errores: Errores = {}
  if (!v.nombre.trim()) errores.nombre = 'El nombre es obligatorio.'
  else if (v.nombre.trim().length > 100) errores.nombre = 'Máximo 100 caracteres.'
  if (!v.descripcion.trim()) errores.descripcion = 'La descripción es obligatoria.'
  return errores
}

interface Props {
  inicial: TipoRiesgo | null
  onSubmit: (datos: TipoRiesgoInput) => Promise<void>
  onCancel: () => void
}

export default function TipoRiesgoFormulario({ inicial, onSubmit, onCancel }: Props) {
  const { valores, setCampo, errores, errorGeneral, enviando, handleSubmit } = useFormulario<TipoRiesgoInput>(
    inicial
      ? {
          nombre: inicial.nombre,
          descripcion: inicial.descripcion,
          categoria: inicial.categoria,
          nivel_peligrosidad: inicial.nivel_peligrosidad,
          activo: inicial.activo,
        }
      : VACIO,
    validar,
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {errorGeneral && <Alert message={errorGeneral} />}

      <Field label="Nombre" htmlFor="tr-nombre" required error={errores.nombre}>
        <input
          id="tr-nombre"
          className={inputClass(errores.nombre)}
          value={valores.nombre}
          onChange={(e) => setCampo('nombre', e.target.value)}
          placeholder="Ej. Sismo"
        />
      </Field>

      <Field label="Descripción" htmlFor="tr-descripcion" required error={errores.descripcion}>
        <textarea
          id="tr-descripcion"
          rows={3}
          className={inputClass(errores.descripcion)}
          value={valores.descripcion}
          onChange={(e) => setCampo('descripcion', e.target.value)}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Categoría" htmlFor="tr-categoria" required error={errores.categoria}>
          <select
            id="tr-categoria"
            className={inputClass(errores.categoria)}
            value={valores.categoria}
            onChange={(e) => setCampo('categoria', e.target.value as TipoRiesgoInput['categoria'])}
          >
            {opciones(CATEGORIAS_RIESGO).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Nivel de peligrosidad" htmlFor="tr-nivel" required error={errores.nivel_peligrosidad}>
          <select
            id="tr-nivel"
            className={inputClass(errores.nivel_peligrosidad)}
            value={valores.nivel_peligrosidad}
            onChange={(e) => setCampo('nivel_peligrosidad', e.target.value as TipoRiesgoInput['nivel_peligrosidad'])}
          >
            {opciones(NIVELES).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Checkbox id="tr-activo" label="Activo" checked={valores.activo} onChange={(v) => setCampo('activo', v)} />

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={enviando}>
          Cancelar
        </Button>
        <Button type="submit" loading={enviando}>
          {inicial ? 'Guardar cambios' : 'Crear tipo de riesgo'}
        </Button>
      </div>
    </form>
  )
}

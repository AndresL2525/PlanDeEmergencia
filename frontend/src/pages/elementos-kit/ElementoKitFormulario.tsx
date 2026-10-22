import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import { Checkbox, CheckboxGroup, Field } from '../../components/ui/FormField'
import { inputClass } from '../../utils/styles'
import { useFormulario } from '../../hooks/useFormulario'
import type { Errores } from '../../hooks/useFormulario'
import { CATEGORIAS_KIT, opciones } from '../../utils/constants'
import type { ElementoKit, ElementoKitInput, TipoRiesgo } from '../../types/models'

function validar(v: ElementoKitInput): Errores {
  const errores: Errores = {}
  if (!v.nombre.trim()) errores.nombre = 'El nombre es obligatorio.'
  if (!v.descripcion.trim()) errores.descripcion = 'La descripción es obligatoria.'
  if (!Number.isInteger(v.cantidad_sugerida) || v.cantidad_sugerida < 1) {
    errores.cantidad_sugerida = 'Debe ser un número entero mayor que 0.'
  }
  if (!v.unidad.trim()) errores.unidad = 'La unidad es obligatoria.'
  return errores
}

interface Props {
  inicial: ElementoKit | null
  tiposRiesgo: TipoRiesgo[]
  onSubmit: (datos: ElementoKitInput) => Promise<void>
  onCancel: () => void
}

export default function ElementoKitFormulario({ inicial, tiposRiesgo, onSubmit, onCancel }: Props) {
  const { valores, setCampo, errores, errorGeneral, enviando, handleSubmit } = useFormulario<ElementoKitInput>(
    {
      nombre: inicial?.nombre ?? '',
      descripcion: inicial?.descripcion ?? '',
      categoria: inicial?.categoria ?? 'agua_alimentos',
      cantidad_sugerida: inicial?.cantidad_sugerida ?? 1,
      unidad: inicial?.unidad ?? 'unidades',
      es_esencial: inicial?.es_esencial ?? false,
      tipos_riesgo: inicial?.tipos_riesgo ?? [],
    },
    validar,
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {errorGeneral && <Alert message={errorGeneral} />}

      <Field label="Nombre" htmlFor="ek-nombre" required error={errores.nombre}>
        <input
          id="ek-nombre"
          className={inputClass(errores.nombre)}
          value={valores.nombre}
          onChange={(e) => setCampo('nombre', e.target.value)}
          placeholder="Ej. Agua potable"
        />
      </Field>

      <Field label="Descripción" htmlFor="ek-descripcion" required error={errores.descripcion}>
        <textarea
          id="ek-descripcion"
          rows={2}
          className={inputClass(errores.descripcion)}
          value={valores.descripcion}
          onChange={(e) => setCampo('descripcion', e.target.value)}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Categoría" htmlFor="ek-categoria" required error={errores.categoria}>
          <select
            id="ek-categoria"
            className={inputClass(errores.categoria)}
            value={valores.categoria}
            onChange={(e) => setCampo('categoria', e.target.value as ElementoKitInput['categoria'])}
          >
            {opciones(CATEGORIAS_KIT).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Cantidad sugerida" htmlFor="ek-cantidad" required error={errores.cantidad_sugerida}>
          <input
            id="ek-cantidad"
            type="number"
            min={1}
            className={inputClass(errores.cantidad_sugerida)}
            value={valores.cantidad_sugerida}
            onChange={(e) => setCampo('cantidad_sugerida', Number(e.target.value))}
          />
        </Field>

        <Field label="Unidad" htmlFor="ek-unidad" required error={errores.unidad}>
          <input
            id="ek-unidad"
            className={inputClass(errores.unidad)}
            value={valores.unidad}
            onChange={(e) => setCampo('unidad', e.target.value)}
            placeholder="litros, unidades…"
          />
        </Field>
      </div>

      <Checkbox
        id="ek-esencial"
        label="Es un elemento esencial"
        checked={valores.es_esencial}
        onChange={(v) => setCampo('es_esencial', v)}
      />

      <CheckboxGroup
        legend="Tipos de riesgo para los que sirve"
        name="ek-riesgos"
        options={tiposRiesgo.map((t) => ({ value: t.id, label: t.nombre }))}
        selected={valores.tipos_riesgo}
        onChange={(v) => setCampo('tipos_riesgo', v)}
        error={errores.tipos_riesgo}
        emptyMessage="No hay tipos de riesgo registrados."
      />

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={enviando}>
          Cancelar
        </Button>
        <Button type="submit" loading={enviando}>
          {inicial ? 'Guardar cambios' : 'Crear elemento'}
        </Button>
      </div>
    </form>
  )
}

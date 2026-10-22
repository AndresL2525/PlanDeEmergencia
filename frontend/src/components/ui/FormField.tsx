import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  required?: boolean
  hint?: string
  className?: string
  children: ReactNode
}

// Etiqueta + control + mensaje de ayuda o de error.
export function Field({ label, htmlFor, error, required, hint, className = '', children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

interface CheckboxProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Checkbox({ id, label, checked, onChange }: CheckboxProps) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 accent-orange-600"
      />
      {label}
    </label>
  )
}

interface CheckboxGroupProps {
  legend: string
  name: string
  options: { value: number; label: string }[]
  selected: number[]
  onChange: (selected: number[]) => void
  error?: string
  required?: boolean
  emptyMessage?: string
}

// Lista de casillas para elegir varios registros relacionados (relaciones muchos a muchos).
export function CheckboxGroup({
  legend,
  name,
  options,
  selected,
  onChange,
  error,
  required,
  emptyMessage = 'No hay opciones disponibles.',
}: CheckboxGroupProps) {
  const alternar = (value: number) =>
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value])

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-slate-700">
        {legend}
        {required && <span className="text-red-600"> *</span>}
      </legend>
      {options.length === 0 ? (
        <p className="text-sm text-slate-500">{emptyMessage}</p>
      ) : (
        <div
          className={`grid max-h-56 gap-2 overflow-y-auto rounded-lg border p-3 sm:grid-cols-2 ${error ? 'border-red-400' : 'border-slate-200'}`}
        >
          {options.map((op) => (
            <Checkbox
              key={op.value}
              id={`${name}-${op.value}`}
              label={op.label}
              checked={selected.includes(op.value)}
              onChange={() => alternar(op.value)}
            />
          ))}
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </fieldset>
  )
}

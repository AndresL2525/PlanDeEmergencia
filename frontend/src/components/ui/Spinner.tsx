interface Props {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const TAMANOS = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-[3px]',
  lg: 'h-12 w-12 border-4',
}

export default function Spinner({ size = 'md', label }: Props) {
  return (
    <span role="status" className="inline-flex flex-col items-center justify-center gap-3">
      <span
        aria-hidden="true"
        className={`${TAMANOS[size]} animate-spin rounded-full border-current border-t-transparent`}
      />
      {label ? <span className="text-sm text-slate-600">{label}</span> : <span className="sr-only">Cargando…</span>}
    </span>
  )
}

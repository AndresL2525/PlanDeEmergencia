type Tipo = 'error' | 'success' | 'warning' | 'info'

const ESTILOS: Record<Tipo, string> = {
  error: 'border-red-200 bg-red-50 text-red-800',
  success: 'border-green-200 bg-green-50 text-green-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  info: 'border-sky-200 bg-sky-50 text-sky-800',
}

const TITULOS: Record<Tipo, string> = {
  error: 'Ocurrió un error',
  success: 'Listo',
  warning: 'Atención',
  info: 'Información',
}

interface Props {
  type?: Tipo
  title?: string
  message: string
  onRetry?: () => void
  onClose?: () => void
}

export default function Alert({ type = 'error', title, message, onRetry, onClose }: Props) {
  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`flex flex-col gap-3 rounded-lg border p-4 text-sm sm:flex-row sm:items-start sm:justify-between ${ESTILOS[type]}`}
    >
      <div>
        <p className="font-semibold">{title ?? TITULOS[type]}</p>
        <p className="mt-1">{message}</p>
      </div>
      {(onRetry || onClose) && (
        <div className="flex shrink-0 items-center gap-3">
          {onRetry && (
            <button type="button" onClick={onRetry} className="font-medium underline underline-offset-2">
              Reintentar
            </button>
          )}
          {onClose && (
            <button type="button" onClick={onClose} aria-label="Cerrar mensaje" className="px-1 text-lg leading-none">
              ×
            </button>
          )}
        </div>
      )}
    </div>
  )
}

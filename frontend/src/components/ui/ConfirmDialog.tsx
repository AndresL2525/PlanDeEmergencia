import Alert from './Alert'
import Button from './Button'
import Modal from './Modal'

interface Props {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  loading?: boolean
  error?: string | null
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Eliminar',
  loading = false,
  error,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal open={open} title={title} onClose={loading ? () => {} : onCancel}>
      <p className="text-sm text-slate-600">{message}</p>
      {error && (
        <div className="mt-4">
          <Alert message={error} />
        </div>
      )}
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}

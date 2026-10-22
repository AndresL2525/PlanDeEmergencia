import Spinner from './Spinner'

export default function LoadingState({ label = 'Cargando información…' }: { label?: string }) {
  return (
    <div className="flex justify-center py-16 text-orange-600">
      <Spinner size="lg" label={label} />
    </div>
  )
}

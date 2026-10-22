// Clases comunes para input, select y textarea (borde rojo si hay error).
export function inputClass(error?: string) {
  return `w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 ${
    error ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:border-orange-500 focus:ring-orange-200'
  }`
}

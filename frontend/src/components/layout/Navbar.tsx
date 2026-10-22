// Barra superior que solo se muestra en móvil y tablet, con el botón del menú.
export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 print:hidden lg:hidden">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Abrir menú"
        className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
        </svg>
      </button>
      <p className="font-semibold text-slate-900">Plan de Emergencia</p>
    </header>
  )
}

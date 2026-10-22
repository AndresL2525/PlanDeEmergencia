import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ElementosKitLista from './pages/elementos-kit/ElementosKitLista'
import GenerarPlanIA from './pages/GenerarPlanIA'
import Inicio from './pages/Inicio'
import PlanDetalle from './pages/planes/PlanDetalle'
import PlanFormulario from './pages/planes/PlanFormulario'
import PlanesLista from './pages/planes/PlanesLista'
import ProtocolosLista from './pages/protocolos/ProtocolosLista'
import TiposRiesgoLista from './pages/tipos-riesgo/TiposRiesgoLista'

function NoEncontrada() {
  return (
    <div className="py-16 text-center">
      <p className="text-5xl font-bold text-slate-300">404</p>
      <p className="mt-2 text-slate-700">La página que buscas no existe.</p>
      <Link to="/" className="mt-4 inline-block text-sm font-medium text-orange-700 underline">
        Volver al inicio
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="tipos-riesgo" element={<TiposRiesgoLista />} />
          <Route path="protocolos" element={<ProtocolosLista />} />
          <Route path="elementos-kit" element={<ElementosKitLista />} />
          <Route path="planes" element={<PlanesLista />} />
          <Route path="planes/nuevo" element={<PlanFormulario />} />
          <Route path="planes/:id" element={<PlanDetalle />} />
          <Route path="planes/:id/editar" element={<PlanFormulario />} />
          <Route path="planes/:id/plan-ia" element={<GenerarPlanIA />} />
          <Route path="*" element={<NoEncontrada />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Vacantes } from './pages/Vacantes'
import { Candidatos } from './pages/Candidatos'
import { CargaMasiva } from './pages/CargaMasiva'
import { Pipeline } from './pages/Pipeline'
import { Taxonomia } from './pages/Taxonomia'
import { BolsaPublica } from './pages/BolsaPublica'
import { Postulaciones } from './pages/Postulaciones'
import { Atribucion } from './pages/Atribucion'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="vacantes" element={<Vacantes />} />
          <Route path="candidatos" element={<Candidatos />} />
          <Route path="carga" element={<CargaMasiva />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="taxonomia" element={<Taxonomia />} />
          <Route path="bolsa" element={<BolsaPublica />} />
          <Route path="postular" element={<Postulaciones />} />
          <Route path="atribucion" element={<Atribucion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

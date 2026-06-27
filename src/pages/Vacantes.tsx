import { Link } from 'react-router-dom'
import { useAsync } from '../lib/useAsync'
import { listVacantes } from '../lib/data'

export function Vacantes() {
  const { data, loading } = useAsync(() => listVacantes(), [])
  const vacantes = data ?? []

  return (
    <div className="view">
      <p className="lede">Las vacantes del workspace. Cada una agrupa candidatos y se puede evaluar con IA.</p>
      {loading ? <p className="muted">Cargando…</p> : (
        <div className="tablewrap">
          <table>
            <thead><tr><th>Puesto</th><th>Ubicación</th><th>Skills</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {vacantes.map((v) => (
                <tr key={v.id}>
                  <td><b>{v.titulo}</b></td>
                  <td className="muted">{v.ubicacion} · {v.modalidad}</td>
                  <td className="muted">{v.skills.join(', ')}</td>
                  <td><span className={'pill ' + (v.estado === 'activa' ? 'oferta' : v.estado === 'cerrada' ? 'rechazado' : 'nuevo')}>{v.estado}</span></td>
                  <td><Link to={'/candidatos?vacante=' + v.id}>Ver candidatos →</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="callout tip"><div className="lbl">Patrón</div><p>Toda query lleva el <code>workspace_id</code> y la base lo refuerza con RLS (ver <code>supabase/migrations/0001_init.sql</code>). Aquí corre en mock, pero el patrón es el mismo.</p></div>
    </div>
  )
}

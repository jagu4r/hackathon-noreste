import { Link } from 'react-router-dom'
import { useAsync } from '../lib/useAsync'
import { listVacantes } from '../lib/data'
import { Logo } from '../brand/Logo'

/** Bolsa de trabajo PÚBLICA. En un proyecto real sería una ruta sin auth
 *  (/b/:slug) por empresa, generada estática/SSR para SEO. */
export function BolsaPublica() {
  const { data } = useAsync(() => listVacantes(), [])
  const vacantes = (data ?? []).filter((v) => v.estado === 'activa')

  return (
    <div className="view">
      <div className="panel" style={{ background: 'linear-gradient(135deg,#f3f1ff,#fff)' }}>
        <Logo height={26} />
        <h2 style={{ marginTop: 12 }}>Únete a nuestro equipo</h2>
        <p className="muted" style={{ margin: '6px 0 0' }}>Página pública de empleos (demo). Sin login, indexable por Google.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14, marginTop: 16 }}>
        {vacantes.map((v) => (
          <div className="panel" key={v.id} style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
            <h3>{v.titulo}</h3>
            <div className="muted" style={{ fontSize: 13, marginBottom: 10 }}>{v.ubicacion} · {v.modalidad}</div>
            <div className="chipset" style={{ marginBottom: 14 }}>{v.skills.map((s) => <span className="chip" key={s} style={{ fontSize: 12 }}>{s}</span>)}</div>
            <Link className="btn ghost sm" to="/postular" style={{ marginTop: 'auto', justifyContent: 'center' }}>Postularme →</Link>
          </div>
        ))}
      </div>
      <div className="callout tip"><div className="lbl">Consejo</div><p>Las páginas públicas son solo lectura y no necesitan la sesión del usuario. Sepáralas de la app privada y genéralas estáticas/SSR: cargan rápido y Google las indexa (tráfico orgánico gratis).</p></div>
    </div>
  )
}

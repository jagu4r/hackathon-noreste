import { useAsync } from '../lib/useAsync'
import { listVacantes, listCandidatos } from '../lib/data'

export function Dashboard() {
  const vac = useAsync(() => listVacantes(), [])
  const cand = useAsync(() => listCandidatos(), [])

  const vacantes = vac.data ?? []
  const candidatos = cand.data ?? []
  const conScore = candidatos.filter((c) => c.ai_score != null)
  const prom = conScore.length
    ? Math.round(conScore.reduce((s, c) => s + (c.ai_score ?? 0), 0) / conScore.length)
    : 0

  return (
    <div className="view">
      <p className="lede">
        Panel de tu ATS. Todo corre con datos de ejemplo (mock); puedes navegar,
        cargar candidatos, evaluarlos con IA y moverlos por el pipeline sin configurar nada.
      </p>
      <div className="stats">
        <Stat k="Vacantes" v={vacantes.filter((v) => v.estado === 'activa').length} d="activas" />
        <Stat k="Candidatos" v={candidatos.length} d="en total" />
        <Stat k="Evaluados con IA" v={conScore.length} d={`${candidatos.length - conScore.length} pendientes`} />
        <Stat k="Score promedio" v={prom} d="de 0 a 100" />
      </div>

      <div className="panel">
        <h3>Por dónde empezar</h3>
        <p className="sub">Este MVP es un template: copia lo que sirva, borra lo que no.</p>
        <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--muted)', lineHeight: 1.9 }}>
          <li><b>Carga masiva</b> — sube muchos CVs y míralos procesarse en lotes.</li>
          <li><b>Candidatos</b> — evalúa con IA (map-reduce) y revisa el ranking.</li>
          <li><b>Pipeline</b> — mueve candidatos por etapas (Kanban).</li>
          <li><b>Taxonomía</b> — normaliza skills sueltos a un árbol consistente.</li>
          <li><b>Bolsa / Postulaciones / Atribución</b> — el lado de captación.</li>
        </ul>
      </div>

      <div className="callout tip">
        <div className="lbl">Cómo está hecho</div>
        <p>UI → <code>services/</code> (negocio) → <code>data.ts</code> (mock o Supabase) y <code>ai/</code> (IA mockeable).
          Lee el <code>README.md</code> para el recorrido completo.</p>
      </div>
    </div>
  )
}

function Stat({ k, v, d }: { k: string; v: number; d: string }) {
  return (
    <div className="stat"><div className="k">{k}</div><div className="v">{v}</div><div className="d">{d}</div></div>
  )
}

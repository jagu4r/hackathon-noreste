import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAsync } from '../lib/useAsync'
import { listVacantes } from '../lib/data'
import { listCandidatos, evaluarVacante } from '../lib/services/candidatos'
import type { Candidato } from '../types'

export function Candidatos() {
  const [params] = useSearchParams()
  const vacanteId = params.get('vacante') ?? undefined
  const vac = useAsync(() => listVacantes(), [])
  const { data, loading, reload } = useAsync(() => listCandidatos(vacanteId), [vacanteId])
  const [msg, setMsg] = useState('')
  const [running, setRunning] = useState(false)

  const vacante = (vac.data ?? []).find((v) => v.id === (vacanteId ?? (vac.data ?? [])[0]?.id))
  const candidatos = data ?? []

  async function evaluar() {
    if (!vacante) return
    setRunning(true); setMsg('MAP: evaluando cada candidato (5 en paralelo)…')
    const r = await evaluarVacante(vacante)
    setMsg(`REDUCE: ranking ordenado en código. ${r.evaluados} evaluados${r.fallidos ? `, ${r.fallidos} fallidos` : ''}.`)
    setRunning(false); reload()
  }

  return (
    <div className="view">
      <p className="lede">Candidatos {vacante ? <>de <b>{vacante.titulo}</b></> : 'del workspace'}. Evalúalos con IA usando map-reduce: cada uno se puntúa por separado y el ranking se arma en código.</p>
      <div className="panel">
        <div className="row spread" style={{ marginBottom: 14 }}>
          <h3 style={{ margin: 0 }}>{candidatos.length} candidatos</h3>
          <button className="btn brand" onClick={evaluar} disabled={running || !vacante}>
            {running ? 'Evaluando…' : 'Evaluar con IA (map-reduce)'}
          </button>
        </div>
        {loading ? <p className="muted">Cargando…</p> : (
          <div className="tablewrap">
            <table>
              <thead><tr><th>Candidato</th><th>Skills</th><th>Exp.</th><th>Score IA</th><th>Estado</th><th>Origen</th></tr></thead>
              <tbody>{candidatos.map((c) => <Row key={c.id} c={c} />)}</tbody>
            </table>
          </div>
        )}
        {msg && <p className="muted" style={{ fontSize: 13, marginTop: 10 }}>{msg}</p>}
      </div>
      <div className="callout tip"><div className="lbl">Consejo</div><p>La IA solo entiende el CV; ordenar/filtrar es trabajo del código. Mira <code>src/lib/ai/score.ts</code> para el map-reduce y <code>src/lib/services/candidatos.ts</code> para la orquestación.</p></div>
    </div>
  )
}

function Row({ c }: { c: Candidato }) {
  const skills = c.perfil?.skills?.join(', ') ?? '—'
  const exp = c.perfil ? `${c.perfil.anios_experiencia} años` : '—'
  return (
    <tr>
      <td><b>{c.nombre}</b></td>
      <td className="muted">{skills}</td>
      <td>{exp}</td>
      <td>{c.ai_score != null ? (
        <span className="score">{c.ai_score}<span className="track"><span className="fill" style={{ width: c.ai_score + '%' }} /></span></span>
      ) : <span className="muted">—</span>}</td>
      <td><span className={'pill ' + c.estado}>{c.estado}</span></td>
      <td className="muted">{c.origen ?? '—'}</td>
    </tr>
  )
}

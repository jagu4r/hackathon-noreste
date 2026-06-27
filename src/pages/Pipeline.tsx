import { useState, useEffect } from 'react'
import { listCandidatos, moverEtapa } from '../lib/services/candidatos'
import { ESTADOS, type Candidato, type EstadoCandidato } from '../types'

/** Pipeline tipo Kanban. Mueve candidatos entre etapas con los botones
 *  (drag & drop se deja como ejercicio). Persiste vía el service. */
export function Pipeline() {
  const [rows, setRows] = useState<Candidato[]>([])
  useEffect(() => { listCandidatos().then(setRows) }, [])

  async function mover(c: Candidato, dir: 1 | -1) {
    const i = ESTADOS.indexOf(c.estado)
    const next = ESTADOS[Math.max(0, Math.min(ESTADOS.length - 1, i + dir))]
    if (next === c.estado) return
    await moverEtapa(c.id, next as EstadoCandidato)
    setRows((rs) => rs.map((r) => (r.id === c.id ? { ...r, estado: next } : r)))
  }

  // Mostramos solo las 5 etapas principales en columnas.
  const cols: EstadoCandidato[] = ['nuevo', 'entrevista', 'evaluacion', 'oferta', 'contratado']

  return (
    <div className="view">
      <p className="lede">El embudo de selección. Cada candidato avanza por etapas. Usa ◀ ▶ para moverlo (el cambio se guarda en el service).</p>
      <div className="kanban">
        {cols.map((estado) => {
          const items = rows.filter((r) => r.estado === estado)
          return (
            <div className="kcol" key={estado}>
              <h4>{estado} · {items.length}</h4>
              {items.map((c) => (
                <div className="kcard" key={c.id}>
                  <b>{c.nombre}</b>
                  <div className="muted" style={{ fontSize: 12 }}>{c.ai_score != null ? `score ${c.ai_score}` : 'sin evaluar'}</div>
                  <div className="row" style={{ gap: 6, marginTop: 6 }}>
                    <button className="btn ghost sm" onClick={() => mover(c, -1)} aria-label="atrás">◀</button>
                    <button className="btn ghost sm" onClick={() => mover(c, 1)} aria-label="avanzar">▶</button>
                  </div>
                </div>
              ))}
              {items.length === 0 && <div className="muted" style={{ fontSize: 12 }}>—</div>}
            </div>
          )
        })}
      </div>
      <div className="callout tip"><div className="lbl">Consejo</div><p>El estado del candidato es un dato más en la base. Para drag & drop real, usa una librería como dnd-kit y llama al mismo service <code>moverEtapa()</code>.</p></div>
    </div>
  )
}

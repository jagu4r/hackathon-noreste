import { useState } from 'react'
import { construirTaxonomia } from '../lib/ai/taxonomy'

const RAW = ['ReactJS', 'react.js', 'REACT', 'TypeScript', 'ts', 'Node', 'nodejs',
  'JavaScript', 'js', 'Python', 'PostgreSQL', 'postgres', 'Figma', 'UI/UX', 'aws',
  'Amazon Web Services', 'HTML', 'CSS']

export function Taxonomia() {
  const [tree, setTree] = useState<Record<string, string[]> | null>(null)

  return (
    <div className="view">
      <p className="lede">"React", "ReactJS", "react.js" son lo mismo. La taxonomía normaliza los skills sueltos a un árbol canónico para que el matching y los filtros funcionen.</p>
      <div className="panel">
        <div className="grid2">
          <div>
            <h3>Skills crudos</h3>
            <div className="sub">como llegan en los CVs</div>
            <div className="chipset">{RAW.map((s, i) => <span className="chip" key={i} style={{ borderStyle: 'dashed', color: 'var(--muted)' }}>{s}</span>)}</div>
            <button className="btn brand" style={{ marginTop: 16 }} onClick={() => setTree(construirTaxonomia(RAW))}>Normalizar en taxonomía</button>
          </div>
          <div>
            <h3>Taxonomía canónica</h3>
            <div className="sub">listo para filtrar y matchear</div>
            {!tree ? <p className="muted" style={{ fontSize: 13 }}>pulsa "Normalizar"…</p> : (
              <div>
                {Object.entries(tree).map(([cat, kids]) => (
                  <div key={cat} style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, color: 'var(--ink-strong)', display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ width: 9, height: 9, borderRadius: 3, background: 'var(--accent)', display: 'inline-block' }} />{cat}
                    </div>
                    <div className="chipset" style={{ paddingLeft: 16, marginTop: 6 }}>
                      {kids.map((k) => <span className="chip" key={k} style={{ background: 'var(--accent-weak)', color: 'var(--accent)', border: 'none' }}>{k}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="callout tip"><div className="lbl">¿IA o algoritmo?</div><p>La normalización (sinónimos, minúsculas, quitar ".js") es un <b>diccionario en código</b> — barato y exacto. Reserva la IA solo para skills nuevos que el diccionario no conozca. Código en <code>src/lib/ai/taxonomy.ts</code>.</p></div>
    </div>
  )
}

import { useAsync } from '../lib/useAsync'
import { attributionByOrigin } from '../lib/data'

/** Atribución: contrataciones por canal de origen. */
export function Atribucion() {
  const { data } = useAsync(() => attributionByOrigin(), [])
  const rows = data ?? []
  const max = Math.max(1, ...rows.map((r) => r.count))

  return (
    <div className="view">
      <p className="lede">¿De dónde vienen tus mejores candidatos? La atribución conecta cada contratación con su origen, para que sepas en qué canal invertir.</p>
      <div className="panel">
        <div className="row spread" style={{ marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Contrataciones por canal</h3>
          <span className="muted" style={{ fontSize: 13 }}>últimos 90 días</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rows.map((r) => (
            <div key={r.origen} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 40px', alignItems: 'center', gap: 12 }}>
              <span style={{ fontWeight: 600, color: 'var(--ink-strong)', fontSize: 14 }}>{r.origen}</span>
              <span style={{ height: 18, background: 'var(--accent-weak)', borderRadius: 6, overflow: 'hidden' }}>
                <span style={{ display: 'block', height: '100%', width: (r.count / max * 100) + '%', background: 'linear-gradient(90deg,var(--brand-mid),var(--brand-to))', borderRadius: 6, transition: 'width .6s' }} />
              </span>
              <span style={{ textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{r.count}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="callout tip"><div className="lbl">Consejo</div><p>Conecta Orwel para esto sin esfuerzo: ya captura first/last-touch automáticamente. Mide qué canal trae a quien <b>realmente contratas</b>, no solo a quien se postula — son métricas muy distintas.</p></div>
    </div>
  )
}

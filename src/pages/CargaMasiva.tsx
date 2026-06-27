import { useState, useRef } from 'react'

/**
 * Carga masiva: simula procesar N CVs en lotes con concurrencia limitada.
 * El código real de la cola está en src/lib/ai/mapLimit.ts.
 */
export function CargaMasiva() {
  const [running, setRunning] = useState(false)
  const [pct, setPct] = useState(0)
  const [msg, setMsg] = useState('')
  const logRef = useRef<HTMLDivElement>(null)

  function simular() {
    setRunning(true); setPct(0); setMsg('Procesando en lotes de 5 (concurrencia limitada)…')
    if (logRef.current) logRef.current.innerHTML = ''
    const total = 200, lote = 5
    let done = 0, batch = 0
    const t = setInterval(() => {
      batch++; done = Math.min(total, done + lote)
      setPct(Math.round((done / total) * 100))
      const fails = batch % 7 === 0 ? 1 : 0
      if (logRef.current) {
        const line = document.createElement('div')
        line.className = 'l'
        line.innerHTML = `lote #${batch} · extraídos <b>${lote - fails}/${lote}</b>${fails ? ' · 1 reintento' : ''} · total ${done}/${total}`
        logRef.current.appendChild(line)
        logRef.current.scrollTop = logRef.current.scrollHeight
      }
      if (done >= total) { clearInterval(t); setRunning(false); setMsg('Listo: 200 CVs procesados, perfiles extraídos.') }
    }, 110)
  }

  return (
    <div className="view">
      <p className="lede">Sube cientos de CVs de golpe. Se procesan en <b>lotes con concurrencia limitada</b> (mapLimit), con reintentos y degradación elegante, para no saturar al proveedor de IA ni bloquear la interfaz.</p>
      <div className="panel">
        <div className="drop">Suelta tus CVs aquí · <span className="muted">(demo: pulsa el botón para simular 200 archivos)</span></div>
        <div className="row" style={{ marginTop: 14 }}>
          <button className="btn brand" onClick={simular} disabled={running}>Simular carga de 200 CVs</button>
          <span className="muted" style={{ fontSize: 13 }}>{msg}</span>
        </div>
        <div className="prog"><div className="pf" style={{ width: pct + '%' }} /></div>
        <div className="log" ref={logRef}><div className="l">La cola de procesamiento aparecerá aquí…</div></div>
      </div>
      <div className="callout tip"><div className="lbl">Consejo</div><p>Nunca lances 200 llamadas a la IA a la vez: revientas el rate limit. Tope de concurrencia (5), reintentos con backoff, y si una falla la marcas y sigues. Código en <code>src/lib/ai/mapLimit.ts</code>.</p></div>
    </div>
  )
}

import { useState } from 'react'
import { crearCandidato } from '../lib/services/candidatos'

/** Formulario público de postulación. Captura el ORIGEN al enviar (alimenta
 *  la atribución) y crea el candidato vía el service (que extrae el perfil). */
export function Postulaciones() {
  const [nombre, setNombre] = useState('Diego Sosa')
  const [email, setEmail] = useState('diego@example.com')
  const [origen, setOrigen] = useState('LinkedIn')
  const [cv, setCv] = useState('Diego Sosa. Frontend con 4 años en React y JavaScript. Bootcamp. Busca crecer en TypeScript.')
  const [done, setDone] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    const c = await crearCandidato({ vacanteId: 'v1', nombre, email, cvRaw: cv, origen })
    setSending(false)
    setDone(`Postulación recibida. Origen "${origen}" guardado para atribución. Perfil extraído por IA: ${c.perfil?.skills?.join(', ') || '—'}. Ya aparece como "nuevo" en el pipeline.`)
  }

  return (
    <div className="view">
      <p className="lede">Cuando alguien se postula, su <b>origen</b> se captura en ese momento (alimenta la atribución) y la IA le extrae el perfil. En producción, el formulario se procesa en el servidor.</p>
      <div className="panel" style={{ maxWidth: 540 }}>
        <h3>Postúlate: Frontend Senior</h3>
        <div className="sub">formulario público (demo)</div>
        <form onSubmit={submit}>
          <div className="field"><label>Nombre</label><input value={nombre} onChange={(e) => setNombre(e.target.value)} required /></div>
          <div className="field"><label>Correo</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="field"><label>¿Cómo te enteraste? (origen)</label>
            <select value={origen} onChange={(e) => setOrigen(e.target.value)}>
              <option>LinkedIn</option><option>Bolsa propia</option><option>Referido</option><option>OCC</option><option>Google</option>
            </select>
          </div>
          <div className="field"><label>Pega tu CV</label><textarea rows={4} value={cv} onChange={(e) => setCv(e.target.value)} /></div>
          <button className="btn brand" type="submit" disabled={sending}>{sending ? 'Enviando…' : 'Enviar postulación'}</button>
        </form>
        {done && <div className="callout tip" style={{ marginTop: 16 }}><div className="lbl">Enviada</div><p>{done}</p></div>}
      </div>
      <div className="callout tip"><div className="lbl">Consejo</div><p>Procesa el form en tu <b>backend</b>, nunca con el token secreto en el navegador. Y captura el origen al postularse: si esperas, lo pierdes.</p></div>
    </div>
  )
}

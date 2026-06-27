/** Logo de TeamUp: rombo con gradiente cian→azul→morado + wordmark.
 *  Reutilizable a cualquier tamaño. Cambia `height` para escalarlo. */

export function Logo({ height = 28, mark = true, text = true }: {
  height?: number
  mark?: boolean
  text?: boolean
}) {
  const id = 'tg-' + (mark ? 'm' : '') + (text ? 't' : '')
  return (
    <svg height={height} viewBox="0 0 214 52" fill="none" role="img" aria-label="TeamUp"
      style={{ display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1FD3E0" />
          <stop offset="0.5" stopColor="#3B5BFF" />
          <stop offset="1" stopColor="#6B2EFF" />
        </linearGradient>
      </defs>
      {mark && (
        <rect x="8" y="8" width="32" height="32" rx="6"
          transform="rotate(45 24 24)" fill={`url(#${id})`} />
      )}
      {text && (
        <text x={mark ? 56 : 0} y="37" fontSize="34" fontWeight="800"
          letterSpacing="-1.5" fill="#0B0B0F"
          fontFamily="system-ui,-apple-system,Segoe UI,Roboto,sans-serif">TeamUp</text>
      )}
    </svg>
  )
}

/** Solo el rombo (para favicons, avatares, etc.). */
export function LogoMark({ size = 28 }: { size?: number }) {
  return <Logo height={size} mark text={false} />
}

/** Shell de la app: sidebar de navegación + topbar + contenido.
 *  Sin auth: es un template, entra directo. */

import type { ReactNode } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { isSupabaseConfigured } from '../lib/supabase'

const NAV = [
  { to: '/', label: 'Resumen', end: true, icon: 'grid' },
  { to: '/vacantes', label: 'Vacantes', icon: 'briefcase' },
  { to: '/candidatos', label: 'Candidatos', icon: 'users' },
  { to: '/carga', label: 'Carga masiva', icon: 'upload' },
  { to: '/pipeline', label: 'Pipeline', icon: 'columns' },
  { to: '/taxonomia', label: 'Taxonomía', icon: 'share' },
]
const NAV2 = [
  { to: '/bolsa', label: 'Bolsa de trabajo', icon: 'globe' },
  { to: '/postular', label: 'Postulaciones', icon: 'check' },
  { to: '/atribucion', label: 'Atribución', icon: 'chart' },
]

const TITLES: Record<string, string> = {
  '/': 'Resumen', '/vacantes': 'Vacantes', '/candidatos': 'Candidatos',
  '/carga': 'Carga masiva', '/pipeline': 'Pipeline', '/taxonomia': 'Taxonomía de habilidades',
  '/bolsa': 'Bolsa de trabajo', '/postular': 'Postulaciones', '/atribucion': 'Atribución',
}

export function Layout() {
  const loc = useLocation()
  const title = TITLES[loc.pathname] ?? 'TeamUp'
  return (
    <div className="app">
      <aside className="side">
        <div className="brandbox"><Logo height={24} /></div>
        <div className="navlabel">Reclutamiento</div>
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end}
            className={({ isActive }) => 'navlink' + (isActive ? ' active' : '')}>
            <Icon name={n.icon} /> {n.label}
          </NavLink>
        ))}
        <div className="navlabel">Captación</div>
        {NAV2.map((n) => (
          <NavLink key={n.to} to={n.to}
            className={({ isActive }) => 'navlink' + (isActive ? ' active' : '')}>
            <Icon name={n.icon} /> {n.label}
          </NavLink>
        ))}
        <div style={{ marginTop: 18, padding: '12px 10px', borderTop: '1px solid var(--line)', fontSize: 12, color: 'var(--muted)' }}>
          {isSupabaseConfigured ? 'Conectado a Supabase' : 'Modo mock · sin backend'}
        </div>
      </aside>
      <div className="main">
        <div className="topbar">
          <h1>{title}</h1>
          <span className="crumb">TeamUp MVP · template del hackathon</span>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

function Icon({ name }: { name: string }) {
  const p: Record<string, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></>,
    users: <><circle cx="9" cy="8" r="3.5" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 11l2 2 4-4" /></>,
    upload: <><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 20h16" /></>,
    columns: <><rect x="3" y="4" width="5" height="16" rx="1" /><rect x="10" y="4" width="5" height="16" rx="1" /><rect x="17" y="4" width="4" height="16" rx="1" /></>,
    share: <><circle cx="12" cy="5" r="2.5" /><circle cx="5" cy="19" r="2.5" /><circle cx="19" cy="19" r="2.5" /><path d="M12 7.5v4M12 11.5L5.5 16.5M12 11.5l6.5 5" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
    check: <><path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></>,
    chart: <><path d="M3 3v18h18" /><path d="M7 15l4-4 3 3 5-6" /></>,
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{p[name]}</svg>
}

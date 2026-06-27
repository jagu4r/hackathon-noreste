/**
 * Taxonomía de habilidades: normaliza skills sueltos a términos canónicos
 * y los agrupa en categorías.
 *
 * Lección "¿IA o algoritmo?": la mayoría se resuelve con un DICCIONARIO en
 * código (barato, exacto, instantáneo). Reserva la IA solo para skills nuevos
 * que el diccionario no conozca.
 */

const ALIAS: Record<string, string> = {
  'reactjs': 'react', 'react.js': 'react', 'react': 'react',
  'typescript': 'typescript', 'ts': 'typescript',
  'javascript': 'javascript', 'js': 'javascript',
  'nodejs': 'node', 'node.js': 'node', 'node': 'node',
  'python': 'python', 'py': 'python',
  'postgresql': 'postgres', 'postgres': 'postgres', 'sql': 'sql',
  'figma': 'figma', 'ui/ux': 'diseño ux', 'ux': 'diseño ux', 'diseño ux': 'diseño ux',
  'aws': 'aws', 'amazon web services': 'aws', 'docker': 'docker',
  'html': 'html', 'css': 'css',
}

const CATEGORIAS: Record<string, string[]> = {
  Frontend: ['react', 'javascript', 'typescript', 'html', 'css', 'diseño ux', 'figma'],
  Backend: ['node', 'python'],
  Datos: ['postgres', 'sql'],
  Infraestructura: ['aws', 'docker'],
}

/** Normaliza un skill suelto a su término canónico. */
export function normalizar(skill: string): string {
  const s = skill.toLowerCase().trim()
  return ALIAS[s] ?? s
}

/** Toma skills crudos y devuelve un árbol { categoría: [skills] }. */
export function construirTaxonomia(rawSkills: string[]): Record<string, string[]> {
  const canon = new Set(rawSkills.map(normalizar))
  const tree: Record<string, string[]> = {}
  for (const [cat, members] of Object.entries(CATEGORIAS)) {
    const hits = members.filter((m) => canon.has(m))
    if (hits.length) tree[cat] = hits
  }
  return tree
}

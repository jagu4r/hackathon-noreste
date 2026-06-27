# Web — Último Recurso (mapa colaborativo)

La cara pública del producto: un mapa tipo **Waze / downdetector** del Noreste con
los reportes de riesgo (💧 agua, 🌫️ aire, ⚠️ otro) en vivo. Aquí trabaja **Dante**.

> **Es un solo archivo:** [`mapa.html`](mapa.html). No necesita instalar nada, ni
> Node, ni build. Se abre en el navegador y ya.

---

## 1. Verla (sin instalar nada)

Doble clic en `web/mapa.html` y se abre en tu navegador. Funciona sola, con datos
de ejemplo. Necesita internet (carga el mapa de Leaflet desde un CDN).

Qué hace hoy:
- Pinta los reportes en el mapa del Noreste (Monterrey, Tamaulipas, Coahuila…).
- **Efecto en vivo:** cada pocos segundos "entra" un reporte nuevo y aparece animado.
- **Filtros** por tipo y severidad, y un **mapa de calor** (botón 🔥).
- Click en un pin → ficha con la interpretación de la IA y "N vecinos confirman".
- **Colabora:** botón *Reportar un problema* → describe y coloca un pin en el mapa.

## 2. Trabajarla (tu propia rama)

Tú editas en tu rama y, cuando esté listo, abres un **Pull Request**. Nadie empuja
directo a `main`. Pasos (cópialos tal cual):

```bash
# una sola vez: clona el repo
git clone git@github.com:jagu4r/hackathon-noreste.git
cd hackathon-noreste

# parte siempre de lo último de main
git checkout main
git pull

# crea TU rama
git checkout -b dante/web

# …edita web/mapa.html y ve el resultado abriéndolo en el navegador…

# guarda y sube tu trabajo
git add web/mapa.html
git commit -m "Web: <qué cambiaste>"
git push -u origin dante/web
```

Después abre el Pull Request en GitHub (botón *Compare & pull request*) o con:

```bash
gh pr create --base main --head dante/web --fill
```

Cuando el PR se apruebe, tus cambios entran al producto. Para seguir trabajando,
vuelve a `git checkout main && git pull` y crea otra rama.

## 3. Qué puedes editar (todo está en `mapa.html`)

| Quieres cambiar… | Busca en el archivo |
|---|---|
| Colores / marca | el bloque `:root { --from … }` al inicio del `<style>` |
| Los reportes de ejemplo | el arreglo `const SEED = [ … ]` |
| Las ciudades del "efecto en vivo" | `const CIUDADES` y `const EVENTOS` |
| Cada cuánto entra un reporte | el `setInterval( … , 7000)` del final (ms) |
| El estilo del mapa | la URL de `L.tileLayer(...)` (CARTO claro/oscuro) |

Edita con confianza: si algo se rompe, `git checkout web/mapa.html` lo regresa.

## 4. El "contrato" con el Agente (no romper)

El **Agente de Telegram** (lo trabaja Omar) y esta web hablan el mismo idioma: el
**reporte**. Mientras tu web entienda esta forma, ambos encajan sin tocarse:

| Campo | Tipo / valores |
|---|---|
| `id` | texto único |
| `tipo` | `agua` · `aire` · `otro` |
| `subtipo` | texto (turbia, exceso de cloro, corte, humo, mal olor, espuma…) |
| `severidad` | `baja` · `media` · `alta` |
| `desc` (descripción IA) | texto que escribió la IA |
| `lat`, `lng` | coordenadas |
| `colonia`, `ciudad` | texto |
| `confirmaciones` | número (sube con cada "yo también lo veo") |

Puedes cambiar **cómo se ve** todo lo que quieras. Solo conserva **estos nombres
de campo** para que el día que conectemos el agente real, sus reportes se pinten
sin cambios. Dudas de integración → Omar.

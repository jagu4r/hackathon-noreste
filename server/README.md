# Backend — Último Recurso (API de reportes)

El **almacén compartido** que conecta los dos productos. Es lo más simple que
funciona: Express + un archivo JSON. Sin base de datos que instalar.

```
   Bot de Telegram  ──POST /api/reportes──►  [ backend ]  ◄──GET /api/reportes──  Web (mapa)
   (OpenClaw/Hermes)                          reportes.json   ◄──POST .../confirmar──
```

## Correrlo

```bash
cd server
npm install
npm start        # http://localhost:3001  (npm run dev = recarga al guardar)
```

Arranca sembrado con 3 reportes de ejemplo. Los nuevos se guardan en
`reportes.json` (ignorado por git; bórralo para volver a sembrar).

## API

| Método | Ruta | Quién | Qué hace |
|---|---|---|---|
| `GET`  | `/api/health` | — | Estado y total de reportes |
| `GET`  | `/api/reportes` | la **web** | Lista todos (más nuevo primero) |
| `POST` | `/api/reportes` | el **bot** | Crea un reporte |
| `POST` | `/api/reportes/:id/confirmar` | la **web** | +1 confirmación (y escala severidad) |

### Crear un reporte (lo que hace el bot)

```bash
curl -X POST http://localhost:3001/api/reportes \
  -H 'Content-Type: application/json' \
  -d '{
    "tipo": "agua",
    "subtipo": "turbia",
    "severidad": "alta",
    "desc": "Salió el agua café y con sedimento",
    "lat": 25.6789, "lng": -100.3098,
    "colonia": "Obispado", "ciudad": "Monterrey",
    "origen": "agente"
  }'
```

Devuelve el reporte ya guardado (con `id` y `created_at`).

## El "contrato" (esquema del reporte)

| Campo | Tipo / valores | Notas |
|---|---|---|
| `tipo` | `agua` · `aire` · `otro` | default `otro` si no es válido |
| `subtipo` | texto | turbia, exceso de cloro, corte, humo, mal olor, espuma… |
| `severidad` | `baja` · `media` · `alta` | default `media`; sube con confirmaciones |
| `desc` | texto | lo que entendió la IA, en lenguaje claro |
| `foto` | URL o base64 (opcional) | |
| `lat`, `lng` | número | **se redondean a ~100 m** al guardar (privacidad) |
| `colonia`, `ciudad` | texto | |
| `confirmaciones` | entero | arranca en 1 |
| `origen` | `agente` · `web` | de dónde vino |

Es el mismo esquema que usa el mapa (`web/mapa.html`) y la skill del bot
(`bot/`). Mientras los tres respeten estos nombres, encajan sin tocarse.

## Privacidad y seguridad

- Los reportes son de ciudadanos: la ubicación exacta puede delatar un domicilio.
  Por eso el backend **redondea `lat`/`lng` a 3 decimales (~100 m)** antes de guardar.
- CORS está **abierto** para la demo; en producción restringe el origen.
- **Nunca** pongas tokens ni llaves en el código: van en `.env` (ya ignorado).

## Llevarlo a la nube (para que el bot y la web pública lo alcancen)

En local todo corre en `localhost`. Para la demo end-to-end (bot en Telegram →
backend → web en GitHub Pages) el backend necesita una URL **https** pública.
Opciones gratis y rápidas: Render, Railway, Fly.io o Deno Deploy. Es un Node
estándar (`npm start`); solo expón el puerto. Ojo: la web en Pages (https) **no**
puede llamar a `http://localhost` por *mixed content* — usa la URL https del host.

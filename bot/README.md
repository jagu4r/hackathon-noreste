# Bot de Telegram — Agente "Último Recurso"

El **canal de captación**: un agente conversacional en Telegram (sobre
**OpenClaw** o **Hermes**) que recibe foto/texto de un vecino, lo interpreta y
crea un reporte en el mapa. Lo trabaja **Omar**.

> El agente (el LLM del framework) hace la **interpretación**. Tú solo enchufas
> una **skill** que **persiste** el reporte. Aquí están las dos piezas listas:
>
> - [`crear-reporte.ts`](crear-reporte.ts) — la skill (handler + tool spec).
> - [`system-prompt.md`](system-prompt.md) — las instrucciones del agente.

## Flujo

```
Vecino (Telegram)
   │  foto / "salió el agua café"
   ▼
Agente OpenClaw·Hermes  ── interpreta (visión + texto) ──► decide tipo/subtipo/severidad
   │  llama skill crear_reporte({...})
   ▼
crear-reporte.ts  ── POST /api/reportes ──►  backend (server/)
   │                                              │ guarda
   ▼                                              ▼
Responde al vecino en lenguaje natural        Mapa de Dante lo pinta
```

## Pasos para conectarlo

1. **Levanta el backend** primero (ver [`../server`](../server/README.md)):
   `cd server && npm install && npm start`.
2. **Crea el bot en Telegram** con [@BotFather](https://t.me/BotFather) y guarda
   el token. **Ese token va en `.env`, nunca en el código ni en el chat.**
3. **Configura el framework** (OpenClaw o Hermes) en modo *gateway* de Telegram
   con tu token (sigue su guía de setup).
4. **Pon el system prompt:** copia el contenido de `system-prompt.md` como
   instrucción de sistema del agente.
5. **Registra la skill:** importa `crearReporte` y `crearReporteTool` de
   `crear-reporte.ts` y enchúfalos como herramienta del agente.
   - **OpenClaw:** registra `crearReporteTool` (su esquema JSON valida los args)
     y enruta la llamada al handler `crearReporte`.
   - **Hermes:** decláralo como *tool* del agente con el mismo esquema y handler.
6. **Variables de entorno** (`.env`, copia de `.env.example`):
   `BACKEND_URL` (tu backend) y `TELEGRAM_BOT_TOKEN` (de BotFather).

## Probar la skill sin Telegram

Mientras conectas el framework, puedes verificar el camino skill→backend:

```bash
cd server && npm start          # en otra terminal
# luego, contra el backend:
curl -X POST http://localhost:3001/api/reportes \
  -H 'Content-Type: application/json' \
  -d '{"tipo":"agua","subtipo":"turbia","severidad":"alta","desc":"prueba","ciudad":"Monterrey","origen":"agente"}'
```

Si aparece en `GET /api/reportes`, el contrato funciona y el agente solo tiene
que llamar a `crear_reporte` con esos campos.

## ¿Y si tu framework no interpreta imágenes?

El diseño asume que el agente (LLM multimodal) ve la foto. Si en tu setup la
visión no está disponible, llama a Gemini Vision **dentro** de la skill antes del
POST (el hackathon es de Google → Gemini encaja). La llave de Gemini iría en
`.env` como `GEMINI_API_KEY`, nunca en el código.

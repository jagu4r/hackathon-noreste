# Último Recurso — contexto del proyecto

> Contexto para Claude Code. Lee esto antes de tocar código.
> Repo base: `jagu4r/hackathon-noreste` (Hackathon Hyperdigital × Google, Noreste de México, 27-jun-2026).
> Criterio que decide el hackathon: **creatividad** y una solución para la región Noreste (NL, Coahuila, Tamaulipas).

---

## Qué es Último Recurso

El **Waze de los riesgos ambientales**. Cuando las autoridades no avisan y no hay datos abiertos de calidad de agua/aire, **la gente es el sensor**: reporta (con foto o texto), una IA lo interpreta, se vuelve un mapa colaborativo en tiempo real, y el sistema **alerta de vuelta** a quien vive en la zona de riesgo para que confirme.

**El nombre es definitivo: Último Recurso.** ("Cuando nadie te avisa, este lo hace.")

---

## El ciclo cerrado (la idea central)

```
Vecino     →  manda foto/texto al Agente  (o reporta desde la web)
Agente     →  IA interpreta (visión + lenguaje natural)  →  crea un "reporte"
Reporte    →  se guarda en la Base de Datos
Mapa/Web   →  lee la base y pinta el pin en vivo (tiempo real)
Sistema    →  AGREGA la inteligencia colectiva de la zona
           →  emite ALERTA PERSONALIZADA (geo-dirigida) a quien vive ahí
Vecinos    →  reciben la alerta y CONFIRMAN ("sí, aquí también")
Alerta     →  sube de severidad y precisión → se reenvía mejor dirigida
```

El dato no solo fluye hacia el mapa: **regresa a la gente** como alerta útil. Ese ciclo es el producto.

---

## Los dos productos

**1. El Agente — capta la información**
- Chat en WhatsApp / web. **Lenguaje natural, NO menús de botones.**
- El usuario manda una **foto** (agua turbia, mancha, humo, espuma) → la IA **"ve" la imagen**, la interpreta, dice qué problema hay y qué hacer.
- También entiende texto suelto: *"salió el agua café y huele raro"*.
- Captura tipo de riesgo, severidad y ubicación → crea un reporte → lo guarda en la base.

**2. La Web — muestra Y colabora**
- Página tipo *downdetector* / **Waze**: mapa del Noreste con pines de riesgo por colonia/zona (💧 agua, 🌫️ aire, ⚠️ otro).
- Se actualiza en vivo (efecto Waze): los reportes aparecen animados.
- **También se colabora desde la web**: crear y **confirmar** reportes cercanos sin pasar por el agente.
- Heatmap + filtros por tipo/severidad + click en pin = foto + interpretación IA + "N vecinos confirman".

**Dos canales, una misma inteligencia colectiva.** Ambos leen y escriben sobre la misma base de datos.

---

## Alertas personalizadas + círculo de confirmación

- Cuando varios reportes coinciden en una zona, el sistema **emite alerta geo-dirigida** a los que viven ahí.
  *"⚠️ 8 vecinos cerca de ti reportan agua turbia en las últimas 2h. ¿Tu agua también salió mal?"*
- Confirmar **refuerza** la alerta: sube severidad, radio y prioridad. Sin confirmaciones, se enfría sola (evita falsas alarmas).
- Cada usuario define su(s) zona(s) de interés (su casa, la escuela de los hijos) y solo recibe lo relevante.
- Cada vecino es **sensor y validador** a la vez.

---

## Modelo de dato: el "reporte"

| Campo | Ejemplo |
|---|---|
| id | uuid |
| tipo | `agua` \| `aire` \| `otro` |
| subtipo | turbia · exceso de cloro · corte · humo · mal olor · espuma |
| severidad | `baja` \| `media` \| `alta` (sube con confirmaciones) |
| descripcion_ia | "Agua con alta turbidez, posible sedimento" |
| foto_url | URL en storage |
| lat / lng | coordenadas |
| colonia / ciudad | texto |
| confirmaciones | entero |
| estado | `activo` \| `enfriando` \| `resuelto` |
| created_at | timestamp |

---

## Stack y base de código

- Partimos del **template TeamUp MVP** del repo: React + Vite + TypeScript, Supabase opcional, **capa de IA mockeable**.
- Patrones del template que SÍ reutilizamos:
  - **Capa de datos** (`lib/data.ts`): mock en memoria por defecto, Supabase si hay `.env`.
  - **Service layer** (`lib/services/`): la lógica de negocio (crear reporte, confirmar, agregar zona).
  - **Capa de IA mockeable** (`lib/ai/`): cliente LLM que funciona en modo mock (gratis) o real.
  - Esquema SQL con RLS en `supabase/migrations/`.
- **Visión:** preferimos **Gemini** (es hackathon Google) para interpretar la foto. Debe ser **mockeable**: si no hay llave, el agente responde con interpretación simulada para que la demo nunca se rompa.
- **Mapa:** Leaflet (gratis, open source) sobre el Noreste, énfasis Tamaulipas/Monterrey.
- **Tiempo real:** para la demo se simula con un motor que va soltando/animando reportes; en real, suscripción a la base.
- **Secretos:** nunca en código. Llaves de Gemini/Supabase van en `.env` (ya está en `.gitignore`). Gestionar fuera del repo.

---

## FASE 1 — EL AGENTE (lo que construimos primero)

Objetivo: un agente conversacional que recibe **foto o texto en lenguaje natural**, lo interpreta con IA (mock o Gemini), genera un **reporte** y lo persiste.

Alcance de esta fase:
1. UI de chat (web) que acepta texto libre **y subida de foto**.
2. Capa de IA `interpretarReporte(input: texto | imagen)` → devuelve `{tipo, subtipo, severidad, descripcion_ia}`. Modo mock + modo Gemini detrás de la misma interfaz.
3. Respuesta del agente en **lenguaje natural**: confirma qué entendió, da el consejo accionable y avisa que ya está en el mapa.
4. `crearReporte()` en el service layer → guarda en la capa de datos (mock primero).
5. Capturar ubicación (mock/preguntada) para poder ubicar el pin después.

Fuera de alcance de la Fase 1 (vienen después): el mapa, las alertas geo-dirigidas y el círculo de confirmación.

---

## Convenciones

- TypeScript estricto; las páginas no saben de Supabase ni del LLM (solo llaman a servicios).
- IA siempre detrás de una interfaz mockeable; nada de llamadas directas al proveedor desde las páginas.
- Texto de cara al usuario en **español**, tono claro y humano (es para ciudadanos, no técnicos).
- Commits y nombres de archivo descriptivos; sin secretos en el repo.

---

## Decisiones pendientes (confirmar al arrancar)

1. **Visión:** ¿Gemini real (requiere llave) o mock para la demo? — *default sugerido: construir mock primero, enchufar Gemini si hay tiempo/llave.*
2. **Base de datos:** ¿mock en memoria (rápido) o Supabase desde ya? — *default sugerido: mock para Fase 1.*

---

## Roadmap

1. **Agente** (Fase 1, en curso) — captura foto/texto → interpreta → reporte.
2. **Web / mapa colaborativo** — visualizar + colaborar (Waze de riesgos).
3. **Conexión + alertas** — lo que capta el agente aparece en el mapa; alertas geo-dirigidas + confirmación.

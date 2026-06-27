---
name: hyper-papers
description: Genera un "paper" técnico de un proyecto ya implementado — un documento narrativo que explica qué se construyó, cómo, qué decisiones se tomaron y qué se aprendió. Úsala para case studies, papers de arquitectura, post-mortems o documentos para compartir conocimiento. Se dispara con "haz un paper de", "case study", "documento técnico del proyecto", "post-mortem".
disable-model-invocation: false
---

# Hyper Papers — Convierte un proyecto en conocimiento que se comparte

Un "paper" de Hyperdigital no es un README: es un documento narrativo que enseña. Cuenta la historia de un proyecto real para que otros aprendan los patrones y eviten los errores. Modelo: los Papers de TeamUp del hackathon.

## Regla 0 — Basado en hechos del proyecto real

Lee el código, los commits, las migraciones y la documentación existente. Un paper inventado no sirve. Si no sabes por qué se tomó una decisión, márcalo como pregunta abierta en vez de inventar la razón.

## Estructura de un paper

1. **Resumen (TL;DR)** — 3-5 frases: qué es, qué problema resuelve, el resultado.
2. **Contexto y problema** — ¿por qué se construyó? ¿qué dolía antes?
3. **Arquitectura** — el cómo. Diagrama de capas/servicios, stack, flujo principal. Modelo de datos.
4. **Decisiones clave** — las 3-5 bifurcaciones importantes y por qué se eligió cada camino (con las alternativas descartadas).
5. **Lecciones de producción** — lo que se rompió y cómo se arregló. Esta es la sección más valiosa. Ejemplo real: en TeamUp, las peticiones grandes a LLMs reventaban el contexto → se resolvió con extracción + map-reduce (ver `[[hyper-llm]]`).
6. **Patrones replicables** — qué puede robarse alguien que lea esto para su propio proyecto.
7. **Qué falta / siguiente** — honesto sobre la madurez.

## Cómo escribir para audiencia mixta

Si el paper lo leerá gente técnica y no técnica (común en demos y hackathons):
- Abre cada sección compleja con un bloque **"En simple"** (analogía entendible por cualquiera).
- Luego el detalle técnico para quien construye.
- Usa diagramas y tablas; reserva el código para apéndices o bloques marcados.

## Principios

- **Enseña, no presumas.** El valor está en el "por qué" y en los errores, no en la lista de features.
- **Específico > genérico.** "Bajamos la latencia de 8s a 1.2s con map-reduce" vale más que "optimizamos el rendimiento".
- **Muestra el antes/después** cuando expliques un fix.
- **Cita el origen:** archivo, commit o métrica real.

## Formato de salida

- Markdown por defecto. Si piden algo presentable/compartible, considera HTML (bonito, formal, con bloques de código copiables) o PDF.
- Para HTML/PDF de marca Hyperdigital: índigo `#12017A`, acento violeta `#4B0FFF`, fondo claro.

## Checklist
- [ ] El TL;DR se entiende sin leer el resto.
- [ ] Hay al menos una lección de producción real (no teórica).
- [ ] Cada decisión clave menciona la alternativa descartada.
- [ ] Un lector puede extraer un patrón aplicable a su proyecto.
- [ ] Lo que no está hecho se dice claramente.

## Relacionadas
- `[[hyper-doc]]` — documentación de referencia (complementa, no sustituye).
- `[[hyper-llm]]` · `[[hyper-core]]` · `[[hyper-sdk]]` — fuentes de patrones a narrar.

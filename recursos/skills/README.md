# Hyper Skills

Colección de skills de Hyperdigital para asistentes de IA (Claude Code, Cursor, etc.). Cada carpeta es una skill independiente con un archivo `SKILL.md`. Instala solo las que necesites copiándolas a la carpeta de skills de tu proyecto (p. ej. `.claude/skills/`).

## Instalación rápida

```bash
# Copia la carpeta de la skill que quieras a tu proyecto:
#   .claude/skills/<skill>/SKILL.md
```

El asistente detecta la skill por su `description` y la usa cuando aplica.

## Catálogo

| Skill | Para qué sirve | Estado |
|---|---|---|
| **orwel** | Instalar e integrar el SDK de analítica Orwel en cualquier framework. | ✅ Completa |
| **roz-intake** | Enviar tickets/feature requests desde una app a roz (auto-documenta y crea issues en Linear). | ✅ Completa |
| **svelte-loading** | Patrones de carga de datos en SvelteKit 2 + Svelte 5 (streaming, skeletons, gotchas). | ✅ Completa |
| **hyper-core** | Arquitectura para levantar un backend nuevo multi-tenant (API + BD + auth + service layer). | ✅ Completa |
| **hyper-sdk** | Arquitectura para crear un SDK cliente nuevo con buena DX. | ✅ Completa |
| **hyper-doc** | Generar documentación completa del proyecto donde se ejecuta. | ✅ Completa |
| **hyper-papers** | Generar un "paper" técnico/case study de un proyecto implementado. | ✅ Completa |
| **hyper-llm** | Patrones de IA en producción: RAG, agentes y manejo de contexto grande. | ✅ Completa |
| **hyper-env** | Entornos de prueba para testear features de IA de forma confiable. | ✅ Completa |

## Cómo se relacionan

- Construyes un backend con **hyper-core** → lo expones como SDK con **hyper-sdk** (ejemplo vivo: **orwel**).
- Le agregas IA con **hyper-llm** → la pruebas con **hyper-env**.
- Documentas todo con **hyper-doc** y narras lo aprendido con **hyper-papers**.

## Para el Hackathon Hyperdigital × Google

Este pack se entrega a los equipos como acelerador. Las skills `hyper-llm` (manejo de contexto grande), `orwel` (analítica) y `hyper-core` (backend) son las más útiles para construir rápido durante el evento.

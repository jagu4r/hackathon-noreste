---
name: hyper-doc
description: Genera documentación completa del proyecto donde se ejecuta — README, arquitectura, guía de setup y referencia. Úsala cuando el usuario quiera documentar un repo, crear o mejorar un README, escribir una guía de onboarding, o explicar cómo funciona el código. Se dispara con "documenta este proyecto", "crea un README", "guía de setup", "explica la arquitectura".
disable-model-invocation: false
---

# Hyper Doc — Documentación que alguien sí leerá

Genera documentación útil del proyecto actual leyendo el código real, no inventando. Estándar de Hyperdigital: precisa, escaneable y con ejemplos copiables.

## Regla 0 — Lee antes de escribir

Nunca documentes de memoria. Primero explora: `package.json`/`pyproject.toml`, estructura de carpetas, scripts, variables de entorno, endpoints/rutas, migraciones y los puntos de entrada. La documentación describe lo que el código **hace hoy**, no lo que debería hacer.

## Qué generar (según lo que falte)

### 1. README.md — la puerta de entrada
- **Qué es** en 1-2 frases (problema que resuelve, para quién).
- **Stack** en una línea.
- **Setup**: requisitos → instalar → variables de entorno → correr en local. Comandos copy-paste exactos.
- **Estructura** de carpetas anotada (solo las que importan).
- **Scripts** disponibles y qué hace cada uno.
- **Deploy** (cómo y a dónde).

### 2. ARCHITECTURE.md — el mapa (si el proyecto es no trivial)
- Diagrama de capas o de servicios (texto/mermaid).
- Flujo de una petición típica de inicio a fin.
- Decisiones clave y por qué (multi-tenant, service layer, etc.).
- Modelo de datos: entidades principales y relaciones.

### 3. Referencia (si expone API o SDK)
- Tabla de endpoints/métodos: firma, qué hace, ejemplo, errores.
- Autenticación y límites.

## Principios de escritura

- **Escaneable:** títulos claros, tablas, listas. Nadie lee párrafos largos en un README.
- **Ejemplos reales** sacados del código, no genéricos.
- **Comandos verificados:** si dices `npm run dev`, confirma que existe en `package.json`.
- **Variables de entorno** documentadas con `.env.example` (nombres, sin valores reales).
- **Voz activa y directa.** "Corre `x`", no "se podría correr `x`".
- Marca lo que **no** está hecho o es frágil (sección "Limitaciones conocidas") — honestidad > marketing.

## Anti-patrones a evitar

- Documentar funciones que ya no existen (verifica nombres antes de mencionarlos).
- Copiar el template genérico de "Awesome README" sin contenido real.
- Capturas que se desactualizan; prefiere texto y comandos.
- Repetir lo que el código ya dice claro; documenta el *por qué*, no cada línea.

## Checklist
- [ ] El setup funciona siguiéndolo al pie de la letra desde cero.
- [ ] Toda variable de entorno usada está en `.env.example`.
- [ ] Los comandos mencionados existen.
- [ ] Hay un diagrama o flujo si el proyecto tiene más de 2 piezas.
- [ ] Sección de limitaciones conocidas.

## Relacionadas
- `[[hyper-papers]]` — si quieres un documento narrativo/técnico más allá del README.
- `[[hyper-core]]` · `[[hyper-sdk]]` — para documentar backends y SDKs.

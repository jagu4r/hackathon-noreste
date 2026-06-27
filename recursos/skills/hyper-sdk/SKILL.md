---
name: hyper-sdk
description: Arquitectura de Hyperdigital para crear un SDK cliente nuevo (paquete npm/PyPI que envuelve una API) con buena DX. Úsala cuando el usuario quiera empaquetar una API como SDK, crear un cliente reutilizable, o diseñar la superficie pública de una librería. Se dispara con "crear SDK", "librería cliente", "envolver mi API", "publicar paquete".
disable-model-invocation: false
---

# Hyper SDK — Cómo se construye un SDK que la gente quiere usar

Guía para convertir una API en un SDK con la DX que usamos en Orwel. El SDK es la cara de tu producto para developers: si es confuso, la API se vuelve invisible.

## Regla 0 — Diseña la superficie pública primero

Antes de escribir implementación, escribe el ejemplo de uso ideal. Si el "hola mundo" no cabe en 3 líneas, rediséñalo.

```ts
import { miSdk } from 'mi-sdk';
miSdk.init({ apiKey });          // una vez
miSdk.track('evento', { ... });  // en cualquier parte
```

## Principios de diseño

1. **Singleton inicializable una vez.** `init()` configura; el resto importa la misma instancia. Falla claro si se usa antes de `init`.
2. **API key desde entorno, jamás hardcodeada.** Documenta la convención por framework (ver `[[orwel]]`). Valida el formato de la key al iniciar (`prefijo_` + longitud mínima).
3. **Métodos verbo-objeto, pocos y memorables.** Orwel expone 7: `init/track/identify/conversion/session/monitor/flush`. Si tienes 30 métodos, agrupa.
4. **Validación con mensajes accionables.** Lanza errores que digan qué arreglar, no códigos crípticos. Valida nombres de eventos con regex (`^[a-z0-9_]{1,50}$`).
5. **Resiliencia invisible.** Cola local (localStorage/memoria), envío por lotes con fallback a individual, reintentos con backoff, flush automático al cerrar. El usuario no debería pensar en la red.
6. **Cero (o casi cero) dependencias.** Cada dependencia es peso y riesgo en el bundle del cliente.

## Estructura del paquete

```
mi-sdk/
  src/
    index.ts        # superficie pública (re-exporta la instancia)
    core/           # cliente, cola, transporte, validación
    types.ts        # tipos públicos (Config, opciones)
  examples/         # usage_example.ts ejecutable, por framework
  README.md         # quickstart copy-paste
  package.json      # "exports", build ESM + types
```

## Empaquetado

- Build dual **ESM + tipos** (`.d.ts`). UMD/IIFE solo si necesitas CDN.
- `package.json`: `main`, `module`, `types`, `exports`, `sideEffects: false`.
- Versionado **semver** estricto. Cambios incompatibles = major. Documenta el CHANGELOG.
- Si rompes una firma (ej. un método pasa a ser `async`), márcalo y deja un alias temporal.

## Documentación que sí se usa

- Un **quickstart** de 5 minutos: instalar → init → primer método → ver resultado.
- **Snippets por framework** (React, Next, Vue, Svelte, Astro, HTML/CDN).
- Tabla de métodos con firma + qué hace + ejemplo.
- Sección de troubleshooting con los 3-5 errores reales más comunes.
- Acompaña el SDK con una **skill** de instalación (como `[[orwel]]`) para instalación asistida por IA.

## Checklist de release

- [ ] El "hola mundo" cabe en 3 líneas y funciona.
- [ ] `init` valida la key y falla claro si falta.
- [ ] Cola + reintentos + flush automático probados offline.
- [ ] Tipos exportados; build ESM verificado en un proyecto real.
- [ ] README con quickstart y snippets por framework.
- [ ] Ejemplos en `examples/` que corren sin tocar nada.

## Relacionadas
- `[[orwel]]` — SDK de referencia, úsalo como ejemplo vivo.
- `[[hyper-core]]` — el backend que el SDK consume.
- `[[hyper-doc]]` — para generar la documentación del SDK.

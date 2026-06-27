---
name: hyper-env
description: Cómo montar entornos de prueba para testear features de IA de forma confiable y barata. Úsala cuando el usuario quiera probar/evaluar salidas de un LLM, crear datasets de prueba, evitar gastar tokens en cada corrida, o hacer que resultados no deterministas sean testeables. Se dispara con "testear IA", "evaluar el modelo", "mockear el LLM", "dataset de prueba", "evals".
disable-model-invocation: false
---

# Hyper Env — Probar IA sin volverte loco (ni quebrar)

Testear features con LLMs es distinto a testear código normal: las salidas no son deterministas, cuestan dinero y son lentas. Estos son los patrones de Hyperdigital para hacerlo confiable.

## Regla 0 — Separa el código de la llamada al modelo

Aísla toda interacción con el LLM detrás de una interfaz (`services/ai.ts`). Así puedes **mockearla** en tests y **cambiar de proveedor** sin tocar la lógica. Si tu código llama a la API del modelo directo en medio de la lógica de negocio, no es testeable.

## Tres niveles de prueba

### 1. Unit — mockea el modelo (rápido, gratis, en cada commit)
Prueba tu lógica (parsing, map-reduce, manejo de errores) con respuestas del LLM simuladas. No llames a la API real aquí.

```ts
const fakeLlm = { json: async () => ({ score: 87, motivo: 'match fuerte' }) };
// inyecta fakeLlm y verifica que tu reduce ordena y corta bien
```

Incluye casos feos: respuesta vacía, JSON malformado, timeout, rate limit. Tu código debe sobrevivir a todos.

### 2. Eval — mide la calidad real (periódico, con dataset fijo)
Crea un **dataset dorado**: entradas representativas + la salida esperada (o criterios). Corre el modelo real contra él y mide aciertos. Úsalo para comparar prompts, modelos o versiones — no en cada commit (cuesta).

- Guarda el dataset en el repo (`evals/dataset.jsonl`).
- Métricas simples primero: % correcto, % de formato válido, costo y latencia por caso.
- Para juicios subjetivos, usa un LLM-as-judge con criterios explícitos — pero verifica el juez contra ejemplos humanos.

### 3. Smoke — una corrida real antes de soltar (manual o pre-deploy)
Un puñado de casos end-to-end contra el modelo real para detectar que la integración vive.

## Hacer lo no determinista, testeable

- **Fija lo que puedas:** `temperature: 0` para tareas con una respuesta correcta.
- **Pide formato estructurado** (JSON con esquema) y valida; testea el esquema, no el texto exacto.
- **Assert sobre propiedades, no sobre strings:** "el score está entre 0-100 y hay un motivo no vacío", no "el texto es igual a X".
- **Cachea respuestas** por hash del input para que los tests repetidos no gasten tokens.

## Entorno y secretos

- API keys de prueba en `.env.test`, nunca en el repo.
- Un flag `AI_MODE=mock|real` para alternar sin cambiar código.
- Límite de gasto/concurrencia en el entorno de pruebas para no llevarte una sorpresa en la factura.

## Checklist
- [ ] Toda llamada al LLM está detrás de una interfaz mockeable.
- [ ] Unit tests cubren respuestas malformadas, vacías y timeouts.
- [ ] Existe un dataset dorado versionado para evals.
- [ ] Las aserciones validan propiedades/esquema, no strings exactos.
- [ ] Las respuestas se cachean por hash en pruebas.
- [ ] Hay tope de gasto en el entorno de prueba.

## Relacionadas
- `[[hyper-llm]]` — los patrones de IA que aquí pruebas.
- `[[hyper-core]]` — estructura del backend y su service layer.

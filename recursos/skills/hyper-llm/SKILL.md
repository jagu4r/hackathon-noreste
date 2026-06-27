---
name: hyper-llm
description: Patrones de Hyperdigital para implementar IA en producción — RAG, agentes, y sobre todo cómo manejar peticiones grandes a LLMs sin reventar el contexto. Úsala cuando el usuario construya features con LLMs, procese muchos documentos/registros con IA, monte RAG o agentes, o cuando un LLM falle/se trabe con demasiados datos. Se dispara con "RAG", "agente de IA", "el LLM no responde", "excede el contexto", "procesar muchos con IA".
disable-model-invocation: false
---

# Hyper LLM — IA que aguanta producción

Patrones para usar LLMs sin los tres dolores clásicos: que se rompan con muchos datos, que cuesten una fortuna, y que respondan mal. Basado en lo aprendido en TeamUp y Orwel.

## Regla 0 — El LLM hace lo único que solo él puede hacer

Entender lenguaje. Todo lo demás —ordenar, filtrar, contar, paginar, deduplicar— hazlo en código normal: es exacto, gratis e instantáneo. La mayoría de los bugs de IA vienen de pedirle al modelo tareas que el código resuelve mejor.

## El problema #1: peticiones grandes que revientan el contexto

**Síntoma real (TeamUp):** con pocos candidatos el LLM respondía; con cientos, dejaba de responder.

**Por qué pasa:**
- La **ventana de contexto es finita** (un máximo de tokens). Meter N documentos completos crece lineal; al rebasar, la petición falla o se trunca.
- **"Lost in the middle":** aunque quepa, el modelo atiende peor lo que está a la mitad de un prompt enorme. Más texto suele ser peor respuesta.
- **Costo y latencia** crecen por token → lento, caro y con timeouts.

### Las 6 técnicas (de simple a potente)

1. **Presupuesto de tokens.** Mide cuánto vas a enviar *antes* de llamar. Conoce el límite del modelo. Es tu red de seguridad.
2. **Extraer, no pegar.** Un modelo barato convierte cada documento largo en JSON compacto (campos clave). Razonas sobre el JSON, no sobre el PDF crudo del OCR.
3. **Map-Reduce.** Procesa cada ítem por separado (map, paralelizable) y combina resultados en código (reduce). Solo lo agregado/top-K va a un segundo prompt.
4. **Pre-filtro + Top-K (RAG).** Filtra con reglas o búsqueda vectorial y manda al LLM solo lo relevante. Ver sección RAG.
5. **Lotes + concurrencia.** Procesa en páginas de tamaño fijo, con `mapLimit` (tope de llamadas en paralelo), reintentos y backoff. Respeta rate limits.
6. **Caché + streaming.** Guarda extracciones/embeddings (por hash del input) para no recalcular. Responde en streaming para mejor UX y evitar timeouts.

### Map-Reduce de referencia

```ts
// MAP: cada ítem, prompt pequeño, JSON compacto, concurrencia limitada
const scored = await mapLimit(items, 5, (it) =>
  withRetry(() => llm.json({
    system: 'Devuelve {score:0-100, motivo}.',
    input: pickFields(it, ['skills','experiencia'])
  }))
);
// REDUCE: ordena/filtra en código; solo el top-K va al LLM final
const top = scored.sort((a,b)=>b.score-a.score).slice(0,10);
return llm.text({ system: 'Resume a los finalistas.', input: top });
```

### Degradación elegante (no opcional)

Si una llamada falla tras los reintentos, devuelve **resultado parcial con una marca** ("3 ítems no se pudieron procesar"), no un error total. Para el usuario, 95% > error.

## RAG en 4 pasos

1. **Ingesta:** parte los documentos en chunks (~200-500 tokens, con solape). Limpia el ruido.
2. **Indexa:** genera embeddings y guárdalos (pgvector, etc.). Cachea por hash.
3. **Recupera:** ante una pregunta, trae el top-K por similitud + filtros de metadata. No mandes todo.
4. **Genera:** pasa solo esos chunks como contexto, con instrucciones de citar la fuente y de decir "no sé" si no está.

## Agentes — manténlos a raya

- **Herramientas pocas y claras**, cada una con descripción precisa de cuándo usarla.
- **Límite de pasos** y de costo por corrida; corta los loops infinitos.
- **Valida las salidas** del modelo (esquema) antes de actuar sobre ellas.
- Empieza con un flujo determinista; añade autonomía solo donde aporte.

## Checklist
- [ ] Mides tokens antes de enviar y conoces el límite del modelo.
- [ ] Documentos largos se extraen a JSON antes de razonar.
- [ ] Operaciones sobre N ítems usan map-reduce con concurrencia limitada.
- [ ] Hay reintentos con backoff y degradación parcial ante fallos.
- [ ] Cacheas extracciones/embeddings por hash.
- [ ] El modelo solo hace lenguaje; el resto es código.

## Relacionadas
- `[[hyper-core]]` — el backend que orquesta estas llamadas.
- `[[hyper-env]]` — cómo probar features de IA de forma confiable.
- `[[hyper-papers]]` — para narrar la lección si la documentas.

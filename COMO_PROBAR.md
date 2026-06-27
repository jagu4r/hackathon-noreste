# Cómo probar el TeamUp MVP

Guía paso a paso para correr y probar este template, incluso si tienes poca experiencia. Tiempo estimado: 5 minutos.

---

## 1. Requisitos (instalar una vez)

- **Node.js 18 o superior** — descárgalo de [nodejs.org](https://nodejs.org) (botón "LTS").
  Para verificar que quedó instalado, abre una terminal y escribe:
  ```bash
  node -v
  ```
  Debe responder algo como `v20.x`. Si dice "command not found", reinstala Node y reinicia la terminal.
- **Un editor** (recomendado: VS Code) — opcional para ver/editar el código.

> No necesitas cuenta de Supabase ni llaves de IA para probarlo. Corre en **modo mock**.

---

## 2. Instalar las dependencias

Abre una terminal **dentro de la carpeta `teamup-mvp`** y corre:

```bash
npm install
```

Esto descarga las piezas que el proyecto necesita (crea la carpeta `node_modules`). Tarda unos segundos. Solo se hace una vez.

---

## 3. Arrancar la app

```bash
npm run dev
```

Verás algo como:

```
VITE v5  ready in 350 ms
➜  Local:   http://localhost:5173/
```

Abre **http://localhost:5173** en tu navegador. Listo: la app ya está corriendo con datos de ejemplo.

Para detenerla, vuelve a la terminal y presiona `Ctrl + C`.

---

## 4. Qué probar (recorrido sugerido)

Usa el menú de la izquierda. Todo funciona con datos simulados, juega sin miedo:

| Sección | Qué hacer | Qué deberías ver |
|---|---|---|
| **Resumen** | Solo míralo | Métricas calculadas en vivo desde los datos. |
| **Candidatos** | Pulsa **"Evaluar con IA (map-reduce)"** | Los candidatos reciben un score y la tabla **se reordena** por ranking. |
| **Carga masiva** | Pulsa **"Simular carga de 200 CVs"** | Barra de progreso + log procesando en **lotes de 5**. |
| **Pipeline** | Usa los botones ◀ ▶ en una tarjeta | El candidato **cambia de columna** (etapa) y se guarda. |
| **Taxonomía** | Pulsa **"Normalizar en taxonomía"** | Los skills sueltos se agrupan en un **árbol canónico**. |
| **Bolsa de trabajo** | Mírala / pulsa "Postularme" | Página pública de empleos; te lleva al formulario. |
| **Postulaciones** | Llena y envía el formulario | Confirma el **origen guardado** y el **perfil extraído por IA**. |
| **Atribución** | Solo míralo | Gráfica de contrataciones por canal. |

---

## 5. Modo mock vs. modo real

Por defecto corre en **modo mock**: datos en memoria + IA simulada (sin gastar tokens). Es ideal para desarrollar y demostrar.

Cuando quieras datos reales:

1. Copia el archivo de variables:
   ```bash
   cp .env.example .env
   ```
2. Rellena en `.env`:
   - `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (de tu proyecto en supabase.com)
   - Aplica el esquema `supabase/migrations/0001_init.sql` en el SQL Editor de Supabase.
   - Para IA real: `VITE_AI_MODE=real` y `VITE_AI_API_KEY` (tu proveedor).
3. Recarga la app. La misma interfaz ahora lee/escribe en Postgres.

> Mientras `.env` no tenga las llaves de Supabase, la app seguía en modo mock automáticamente. No truena.

---

## 6. Si algo falla

| Síntoma | Solución |
|---|---|
| `npm: command not found` | Node no está instalado o no reiniciaste la terminal. Instala Node LTS. |
| `npm install` falla | Revisa tu conexión a internet. Borra `node_modules` y reintenta. |
| La página sale en blanco | Mira la consola del navegador (F12). Asegúrate de abrir la URL que imprime `npm run dev`. |
| Puerto 5173 ocupado | Vite usará otro puerto automáticamente; usa el que aparezca en la terminal. |
| "supabaseUrl is required" | No debería pasar (modo mock lo evita). Si configuraste `.env` a medias, déjalo vacío para volver a mock. |

---

## 7. Entender el código

Lee el `README.md` para el recorrido por capas (páginas → servicios → datos / IA). Empieza por:

1. `supabase/migrations/0001_init.sql` — los datos y el aislamiento multi-tenant.
2. `src/lib/ai/score.ts` — el map-reduce (lo más valioso).
3. `src/lib/services/candidatos.ts` — cómo se orquesta todo.

Cada archivo está comentado explicando el *por qué*.

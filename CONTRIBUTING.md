# Guía de colaboración

Cómo trabajamos en este repo durante el hackathon. La idea es simple: **nadie empuja directo a `main`; todo entra por ramas y Pull Requests.**

## Flujo de trabajo

1. **Actualiza tu copia local** de `main`:
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Crea una rama** para lo que vas a hacer (ver convención abajo):
   ```bash
   git checkout -b feat/carga-masiva
   ```
3. **Trabaja y haz commits** pequeños y descriptivos:
   ```bash
   git add -A
   git commit -m "Agrega validación al formulario de postulación"
   ```
4. **Sube tu rama**:
   ```bash
   git push -u origin feat/carga-masiva
   ```
5. **Abre un Pull Request** contra `main` desde GitHub (o con `gh pr create`).
6. Se revisa, se comenta si hace falta, y al aprobarse **se fusiona a `main`**.
7. Borra la rama después de fusionar.

## Convención de nombres de ramas

Usa un prefijo según el tipo de trabajo, en minúsculas y con guiones:

| Prefijo | Para | Ejemplo |
|---|---|---|
| `feat/` | Nueva funcionalidad | `feat/scoring-candidatos` |
| `fix/` | Corrección de bug | `fix/error-carga-csv` |
| `docs/` | Documentación | `docs/actualiza-readme` |
| `refactor/` | Reorganizar código sin cambiar comportamiento | `refactor/service-layer` |
| `chore/` | Mantenimiento (deps, config) | `chore/actualiza-vite` |

Si prefieren separar el trabajo por persona, también vale prefijar con el nombre: `dante/feat-pipeline`.

## Antes de abrir un PR

Verifica que el proyecto sigue compilando:

```bash
npm run type-check    # tsc --noEmit
npm run build         # tsc -b && vite build
```

Si ambos pasan, estás listo para abrir el PR.

## Reglas básicas

- **No empujes a `main` directamente.** Siempre por rama + PR.
- **No subas secretos.** El `.env` real está en `.gitignore`; usa `.env.example` como referencia.
- **No subas `node_modules` ni `dist`** (ya están ignorados).
- Commits y descripciones de PR en español, claros y al grano.

## Pull Requests

Al abrir un PR se carga automáticamente una plantilla ([`.github/pull_request_template.md`](.github/pull_request_template.md)). Llénala: qué cambia, por qué, y cómo probarlo.

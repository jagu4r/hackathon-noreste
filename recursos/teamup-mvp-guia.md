# Cómo usar y probar los recursos de TeamUp

Hay **dos formatos** de TeamUp, para usos distintos. Aquí qué es cada uno y cómo probarlo.

---

## 1. Demo Interactivo (`teamup-demo.html`)

**Qué es:** una página web única que simula el ATS completo (carga masiva, análisis de CV, taxonomía, scoring, bolsa, postulaciones, atribución), con cada sección explicada en pantalla como un cómic. Todo es mock.

**Para qué sirve:** entender el producto de un vistazo, proyectarlo en el evento, o que cualquiera (sin saber programar) lo explore.

**Cómo probarlo:** no necesita instalar **nada**.
- **Opción A — link:** abre [el demo](https://claude.ai/code/artifact/7a695b00-91d7-4d5d-b1b8-1e03f905b38c) en cualquier navegador.
- **Opción B — archivo:** haz doble clic en `teamup-demo.html`. Se abre en tu navegador.

**Qué hacer dentro:** navega con el menú lateral. Pulsa los botones — funcionan de verdad:
- *Carga masiva* → "Simular carga de 200 CVs"
- *Análisis de CV* → "Analizar CV con IA"
- *Taxonomía* → "Normalizar"
- *Candidatos* → "Evaluar con IA (map-reduce)"
- *Postulaciones* → enviar el formulario

> Es un solo archivo HTML autocontenido. Puedes compartirlo por correo o ponerlo en cualquier servidor estático.

---

## 2. MVP Template (`teamup-mvp/`)

**Qué es:** un proyecto de código real (React + Vite + TypeScript) que aplica los mismos patrones, listo para usar como **base de un producto**. Corre con datos mock sin configurar nada, y se conecta a Supabase cuando quieras.

**Para qué sirve:** clonar y construir encima — el punto de partida para un equipo que va a programar.

**Cómo probarlo:** necesita Node.js. El paso a paso completo está en **[`teamup-mvp/COMO_PROBAR.md`](teamup-mvp/COMO_PROBAR.md)**. En resumen:

```bash
cd teamup-mvp
npm install
npm run dev      # abre http://localhost:5173
```

---

## Cómo entregar esto a los equipos

- **Demo:** comparte el link, o el archivo `teamup-demo.html` solo. Nada que instalar.
- **MVP:** entrega la carpeta `teamup-mvp/` **sin** `node_modules`, `dist` ni `.env` (ya están excluidos). Cada equipo corre `npm install`.
  - **No incluyas `node_modules`**: pesa cientos de MB, es específico de cada sistema y `npm install` lo reconstruye exacto desde `package.json`.
  - Si vas a hacer un ZIP, comprime la carpeta tal como está ahora (ya está limpia).

```bash
# Ejemplo para empaquetar el MVP limpio (desde la carpeta hackathon):
zip -r teamup-mvp.zip teamup-mvp -x "*/node_modules/*" "*/dist/*" "*/.env"
```

---

## ¿Cuál uso?

| Quiero… | Usa |
|---|---|
| Enseñar el producto rápido / proyectar | **Demo interactivo** |
| Que un no-programador lo explore | **Demo interactivo** |
| Arrancar a construir código | **MVP template** |
| Aprender los patrones (arquitectura, IA) | Ambos + el [Playbook](https://claude.ai/code/artifact/2e7a8003-00d9-45bc-95c5-c84faef7d83b) |

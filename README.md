# 🧠 WASM Image & Video Processor (PWA)

Este proyecto es una aplicación web progresiva (PWA) que permite **procesamiento de imágenes y videos** en el navegador usando **WebAssembly (WASM)** compilado desde **Rust**, integrando filtros como escala de grises, inversión de color y detección de movimiento por diferencia de frames. Desarrollado con **Vite**, usando **Service Workers** y almacenamiento local con **IndexedDB**.

---

## 🚀 Funcionalidades

### 🔧 Imagen
- Cargar imágenes locales (`input[type="file"]`)
- Aplicar filtros `grayscale` e `invert` compilados desde Rust vía WASM
- Ver imagen original y procesada lado a lado
- Guardar el resultado en IndexedDB
- Recuperar la última imagen procesada
- Notificación visual al aplicar un filtro

### 🎥 Video
- Cargar video local y procesarlo en tiempo real
- Convertir frames a escala de grises (WASM)
- Aplicar diferencia entre frames (`frame differencing`)
- Usar `threshold` y `clean_noise` para detección binaria
- Slider interactivo para ajustar el umbral entre 0–100
- Botón de reinicio para repetir el análisis
- Video y canvas responsivos (adaptativos a pantallas móviles)

### 📦 PWA (Progressive Web App)
- Funciona offline gracias a Service Worker (generado por `vite-plugin-pwa`)
- Instalable en escritorio o móvil
- Splash screen, ícono personalizado, manifest configurado

---

## 📁 Estructura del proyecto

```
wasm-image-pwa/
├── dist/                   # Carpeta de build (Render usa esto)
├── public/                 # Assets como sw.js o íconos
├── rust-image/             # Código Rust compilado a WASM
│   └── rust-image-filters/
│       ├── src/lib.rs
│       ├── pkg/            # Generado por wasm-pack
├── src/
│   ├── main.ts             # Lógica principal + integración
│   ├── video-tracker.ts    # Análisis de video con WASM
│   ├── db.ts               # Almacenamiento IndexedDB
│   └── style.css           # Estilos responsivos
├── index.html
├── vite.config.ts
├── package.json
└── README.md
```

---

## ⚙️ Requisitos

- Node.js `>= 18`
- Rust y wasm-pack instalados globalmente:
  ```bash
  curl https://sh.rustup.rs -sSf | sh
  cargo install wasm-pack
  ```

---

## 🛠️ Instalación y uso local

```bash
# 1. Instalar dependencias
npm install

# 2. Compilar WASM desde Rust
cd rust-image/rust-image-filters
wasm-pack build --target web
cd ../../

# 3. Build y preview con SW habilitado
npm run build
npm run preview

# Ir a http://localhost:4173
```

---

## 🌐 Despliegue en Render

Este proyecto está listo para ser desplegado como sitio estático en [Render](https://render.com).

### Configuración:

- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Environment:** Node 18+
- **Repo conectado:** GitHub → `wasm-image-pwa`

El Service Worker y los archivos `.wasm` se generan y sirven automáticamente desde `/dist`.

---

## 📦 Dependencias clave

- [Vite](https://vitejs.dev/)
- [vite-plugin-wasm](https://www.npmjs.com/package/vite-plugin-wasm)
- [vite-plugin-top-level-await](https://www.npmjs.com/package/vite-plugin-top-level-await)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- [wasm-bindgen](https://rustwasm.github.io/wasm-bindgen/)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)


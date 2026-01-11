const CACHE_NAME = "Generador de tareas-cache-v1";
const urlsToCache = [
  "/",              // raíz
  "/index.html",    // tu página principal
  "/manifest.json", // manifest
 // "/assets/logo.svg",
  "/assets/favicon-32.png",
  "/assets/favicon-192.png",
  "/assets/favicon-512.png",
  "/assets/styles.css",
  "/assets/app.js"
];

// Instalación: cachea los archivos base
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activación: limpia caches viejos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
});

// Fetch: responde desde cache primero, luego red
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((res) => {
          // opcional: cachear nuevas respuestas
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, res.clone());
            return res;
          });
        })
      );
    })
  );
});
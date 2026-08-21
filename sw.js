const CACHE_NAME = "bunker-rondas-v" + 32;
const BUILD_TS = "2026-08-21T08-45-00";

self.addEventListener("install", (event)=>{
  self.skipWaiting();
});

self.addEventListener("activate", (event)=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))
    )).then(()=>self.clients.claim())
  );
});

// Estrategia network-first: siempre intenta traer la version mas nueva de la red,
// y solo usa el cache si no hay conexion.
self.addEventListener("fetch", (event)=>{
  event.respondWith(
    fetch(event.request)
      .then(res=>{
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(cache=>cache.put(event.request, resClone));
        return res;
      })
      .catch(()=>caches.match(event.request))
  );
});

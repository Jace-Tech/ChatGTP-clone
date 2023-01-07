//This is a service worker file for Progressive Web App
//This service worker will cache the application resources and ensure that the app can be used offline
//Install the service worker
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing Service Worker ...");
  event.waitUntil(
    caches.open("static").then((cache) => {
      console.log("[Service Worker] Precaching App Shell");
      cache.addAll([
        "/",
        "assets/*",
        "bot-61bdb6bf.svg",
        "index-c1f31eb9.js",
        "index-ffd30c3b.css",
        "user-bcdeb18e.svg",
        "https://fonts.googleapis.com/css2?family=Work+Sans:wght@100;300;400;500;700;800;900&display=swap",
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
        "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js",
        "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js",
      ]);
    })
  );
});
// bot-61bdb6bf.svg

//Activate the service worker
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating Service Worker ...");
  return self.clients.claim();
});

//Fetch the cached resources
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      } else {
        return fetch(event.request).then((res) => {
          return caches.open("dynamic").then((cache) => {
            cache.put(event.request.url, res.clone());
            return res;
          });
        });
      }
    })
  );
});

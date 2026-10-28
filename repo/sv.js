const cacheName = "elprisen-nu-v1";

const files = [
    "./",
    "./index.html",
    "./manifest.json",
    "./assets/css/site.css",
    "./assets/java/side.js",
    "./assets/java/controller/pageController.js",
    "./assets/java/model/pageModel.js",
    "./assets/java/model/priceModel.js",
    "./assets/java/view/historikpage.js",
    "./assets/java/view/ligenupage.js",
    "./assets/java/view/modulus/nav.js",
    "./assets/java/view/modulus/priceDisplay.js",
    "./assets/java/view/modulus/settings.js",
    "./assets/java/view/oversigtpage.js",
    "./assets/img/mainIcon.svg",
    "./assets/img/Square44x44Logo.targetsize-24.png",
    "./assets/img/android-launchericon-192-192.png",
    "./assets/img/android-launchericon-512-512.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheName)
            .then((storage) => storage.addAll(files))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(
            keys
                .filter((key) => key.startsWith("elprisen-nu-") && key !== cacheName)
                .map((key) => caches.delete(key))
        )).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const request = event.request;

    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);
    const isPriceApi = url.hostname === "www.elprisenligenu.dk" &&
        url.pathname.includes("/api/v1/prices/");

    if (isPriceApi) {
        event.respondWith(networkFirst(request));
        return;
    }

    if (url.origin === self.location.origin) {
        event.respondWith(cacheFirst(request));
    }
});

function cacheFirst(request) {
    return caches.match(request).then((response) => {
        if (response) {
            return response;
        }

        return fetch(request).then((networkResponse) => {
            if (!networkResponse || !networkResponse.ok) {
                return networkResponse;
            }

            return caches.open(cacheName).then((storage) => {
                storage.put(request, networkResponse.clone());
                return networkResponse;
            });
        }).catch(() => caches.match(request));
    });
}

function networkFirst(request) {
    return fetch(request).then((response) => {
        if (!response || !response.ok) {
            return response;
        }

        return caches.open(cacheName).then((storage) => {
            storage.put(request, response.clone());
            return response;
        });
    }).catch(() => caches.match(request).then((response) =>
        response || new Response(
            JSON.stringify({ error: true, reason: "Du er offline, og der er ingen gemte priser tilgængelige." }),
            { status: 503, headers: { "Content-Type": "application/json" } }
        )
    ));
}

self.addEventListener("push", (event) => {
    const text = event.data ? event.data.text() : "Ingen data modtaget";
    event.waitUntil(
        self.registration.showNotification("Elprisen.nu", {
            body: text,
            icon: "./assets/img/Square44x44Logo.targetsize-24.png"
        })
    );
});
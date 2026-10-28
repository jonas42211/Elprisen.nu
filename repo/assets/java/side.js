import { startPageController } from "./controller/pageController.js";

const app = document.querySelector("#app");

if (!app) {
    throw new Error('Missing "#app" element for the page layout.');
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sv.js").catch((error) => {
            console.warn("Service worker registration failed:", error);
        });
    });
}

startPageController(app);

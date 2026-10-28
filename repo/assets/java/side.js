import { startPageController } from "./controller/pageController.js";

const app = document.querySelector("#app");

if (!app) {
    throw new Error('Missing "#app" element for the page layout.');
}

startPageController(app);

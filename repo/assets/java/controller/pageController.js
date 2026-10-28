import { defaultPage, pages } from "../model/pageModel.js";
import { fetchTodayPrices } from "../model/priceModel.js";
import renderLigeNuPage from "../view/ligenupage.js";
import { createNav } from "../view/modulus/nav.js";

let selectedArea = "DK1";

export function startPageController(app) {
    if (!app) {
        throw new Error("Missing app element for the page controller.");
    }

    const nav = createNav();
    const main = document.createElement("main");
    app.replaceChildren(nav, main);
    let prices;
    let priceError;

    const renderPage = () => {
        const requestedPage = window.location.hash.slice(1);
        const pageId = pages.some(({ id }) => id === requestedPage) ? requestedPage : defaultPage;

        if (pageId !== requestedPage) {
            window.history.replaceState(null, "", `#${pageId}`);
        }

        nav.querySelectorAll(".site-nav__link").forEach((link) => {
            const isActive = link.hash === `#${pageId}`;
            link.classList.toggle("site-nav__link--active", isActive);
            if (isActive) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
        });

        if (pageId === "lige-nu") {
            main.replaceChildren(renderLigeNuPage(prices, selectedArea, (area) => {
                selectedArea = area;
                renderPage();
            }, priceError));
        } else {
            main.replaceChildren();
        }
    };

    window.addEventListener("hashchange", renderPage);
    renderPage();
    fetchTodayPrices().then((data) => {
        prices = data;
        renderPage();
    }).catch((error) => {
        console.error("Kunne ikke hente elpriser:", error);
        priceError = error instanceof Error ? error.message : String(error);
        renderPage();
    });
}

import { defaultPage, pages } from "../model/pageModel.js";
import { fetchPricesForDate } from "../model/priceModel.js";
import renderDesktopDashboard from "../view/desktopDashboard.js";
import renderHistoryPage from "../view/historikpage.js";
import renderLigeNuPage from "../view/ligenupage.js";
import renderOverviewPage from "../view/oversigtpage.js";
import { createNav } from "../view/modulus/nav.js";

let selectedArea = "DK1";

function getTodayDateValue() {
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Copenhagen",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(new Date()).map(({ type, value }) => [type, value]));

    return `${parts.year}-${parts.month}-${parts.day}`;
}

export function startPageController(app) {
    if (!app) {
        throw new Error("Missing app element for the page controller.");
    }

    const nav = createNav();
    const main = document.createElement("main");
    app.replaceChildren(nav, main);
    const pricesByDate = new Map();
    const errorsByDate = new Map();
    const requestedDates = new Set();
    const todayDate = getTodayDateValue();
    let selectedHistoryDate = todayDate;

    const loadPrices = (date) => {
        if (requestedDates.has(date)) return;
        requestedDates.add(date);
        fetchPricesForDate(date).then((data) => {
            pricesByDate.set(date, data);
            renderPage();
        }).catch((error) => {
            console.error("Kunne ikke hente elpriser:", error);
            errorsByDate.set(date, error instanceof Error ? error.message : String(error));
            renderPage();
        });
    };

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

        const areaChanged = (area) => {
            selectedArea = area;
            renderPage();
        };
        const dateChanged = (date) => {
            selectedHistoryDate = date;
            renderPage();
        };
        const desktop = window.matchMedia("(min-width: 70rem)").matches;

        if (desktop) {
            main.replaceChildren(renderDesktopDashboard({
                todayPrices: pricesByDate.get(todayDate),
                historyPrices: pricesByDate.get(selectedHistoryDate),
                selectedArea,
                selectedDate: selectedHistoryDate,
                onDateChange: dateChanged,
                onAreaChange: areaChanged,
                todayError: errorsByDate.get(todayDate),
                historyError: errorsByDate.get(selectedHistoryDate)
            }));
        } else if (pageId === "oversigt") {
            main.replaceChildren(renderOverviewPage(
                pricesByDate.get(todayDate),
                selectedArea,
                areaChanged,
                errorsByDate.get(todayDate)
            ));
        } else if (pageId === "historik") {
            main.replaceChildren(renderHistoryPage(
                pricesByDate.get(selectedHistoryDate),
                selectedArea,
                selectedHistoryDate,
                dateChanged,
                areaChanged,
                errorsByDate.get(selectedHistoryDate)
            ));
        } else {
            main.replaceChildren(renderLigeNuPage(
                pricesByDate.get(todayDate),
                selectedArea,
                areaChanged,
                errorsByDate.get(todayDate)
            ));
        }

        loadPrices(todayDate);
        if (desktop || pageId === "historik") loadPrices(selectedHistoryDate);
    };

    window.addEventListener("hashchange", renderPage);
    window.addEventListener("resize", renderPage);
    renderPage();
}

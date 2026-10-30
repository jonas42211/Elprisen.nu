import { createPriceRows } from "./modulus/priceRows.js";
import { createPageFooter } from "./modulus/pageFooter.js";
import { createSettings } from "./modulus/settings.js";

function createSummary(label, price) {
    const item = document.createElement("div");
    const circle = document.createElement("div");
    const amount = document.createElement("p");
    const unit = document.createElement("p");
    const caption = document.createElement("p");

    item.className = "overview-summary__item";
    circle.className = "overview-summary__circle";
    amount.className = "overview-summary__amount";
    unit.className = "overview-summary__unit";
    caption.className = "overview-summary__caption";

    amount.textContent = price ? price.DKK_per_kWh.toFixed(3) : "--";
    unit.textContent = "KR. PR. KWH";
    caption.textContent = label;

    circle.append(amount, unit);
    item.append(circle, caption);
    return item;
}

export default function renderOverviewPage(prices, selectedArea, onAreaChange, error, showSettings = true) {
    const page = document.createElement("section");
    const heading = document.createElement("h1");
    const content = document.createElement("div");
    const summary = document.createElement("div");
    const zone = prices?.zones.find(({ id }) => id === selectedArea);
    const dayPrices = zone?.prices ?? [];

    page.className = "data-page overview-page";
    heading.className = "data-page__heading";
    heading.textContent = "OVERSIGT";
    content.className = "data-page__content";
    summary.className = "overview-summary";

    const orderedPrices = [...dayPrices].sort((a, b) => a.DKK_per_kWh - b.DKK_per_kWh);
    summary.append(
        createSummary("LAVESTE PRIS", orderedPrices[0]),
        createSummary("HØJESTE PRIS", orderedPrices.at(-1))
    );
    content.append(summary);

    if (error) {
        const message = document.createElement("p");
        message.className = "data-page__message";
        message.textContent = `Priserne kunne ikke hentes: ${error}`;
        content.append(message);
    } else if (dayPrices.length) {
        content.append(createPriceRows(dayPrices));
    } else {
        const message = document.createElement("p");
        message.className = "data-page__message";
        message.textContent = "Henter priser…";
        content.append(message);
    }

    if (showSettings) {
        const settings = createSettings(selectedArea, onAreaChange);
        page.append(settings.button, settings.panel);
    }

    page.append(heading, content, createPageFooter(selectedArea));
    return page;
}

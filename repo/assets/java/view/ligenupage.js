import { createPriceDisplay } from "./modulus/priceDisplay.js";
import { createPageFooter } from "./modulus/pageFooter.js";
import { createSettings } from "./modulus/settings.js";

export default function renderLigeNuPage(prices, selectedArea, onAreaChange, error, showSettings = true) {
    const page = document.createElement("section");
    const heading = document.createElement("h1");

    page.className = "lige-nu-page";

    heading.textContent = "ELPRISEN LIGE NU";

    const { circle, time } = createPriceDisplay(prices, selectedArea, error);

    if (showSettings) {
        const { button, panel } = createSettings(selectedArea, onAreaChange);
        page.append(button, panel);
    }

    page.append(heading, circle, time, createPageFooter(selectedArea));

    return page;
}
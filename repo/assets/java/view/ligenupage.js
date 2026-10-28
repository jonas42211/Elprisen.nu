import { createPriceDisplay } from "./modulus/priceDisplay.js";
import { createSettings } from "./modulus/settings.js";

export default function renderLigeNuPage(prices, selectedArea, onAreaChange, error) {
    const page = document.createElement("section");
    const heading = document.createElement("h1");
    const footer = document.createElement("footer");
    const priceNote = document.createElement("p");
    const areaNote = document.createElement("p");
    const areaName = document.createElement("span");

    page.className = "lige-nu-page";

    heading.textContent = "ELPRISEN LIGE NU";
    footer.className = "lige-nu-footer";
    priceNote.textContent = "Priserne er ex. moms og afgifter";
    areaNote.append("Du vises lige nu priserne for ", areaName);
    areaName.textContent = selectedArea === "DK1" ? "Vest Danmark" : "Øst Danmark";

    const { button, panel } = createSettings(selectedArea, onAreaChange);
    const { circle, time } = createPriceDisplay(prices, selectedArea, error);

    footer.append(priceNote, areaNote);
    page.append(button, panel, heading, circle, time, footer);

    return page;
}
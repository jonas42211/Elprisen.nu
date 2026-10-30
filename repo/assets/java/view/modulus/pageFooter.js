export function createPageFooter(selectedArea) {
    const footer = document.createElement("footer");
    const priceNote = document.createElement("p");
    const areaNote = document.createElement("p");
    const areaName = document.createElement("span");

    footer.className = "lige-nu-footer";
    priceNote.textContent = "Priserne er ex. moms og afgifter";
    areaNote.append("Du vises lige nu priserne for ", areaName);
    areaName.textContent = selectedArea === "DK1" ? "Vest Danmark" : "Øst Danmark";
    footer.append(priceNote, areaNote);

    return footer;
}

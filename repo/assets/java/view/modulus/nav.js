import { pages } from "../../model/pageModel.js";

export function createNav() {
    const header = document.createElement("header");
    header.className = "site-header";

    const brand = document.createElement("a");
    brand.className = "site-header__brand";
    brand.href = "#oversigt";

    const logo = document.createElement("img");
    logo.src = "assets/img/Square44x44Logo.targetsize-24.png";
    logo.alt = "Elprisen.nu";
    brand.append(logo);

    const nav = document.createElement("nav");
    nav.className = "site-nav";

    for (const { id, label } of pages) {
        const link = document.createElement("a");
        link.className = "site-nav__link";
        link.href = `#${id}`;
        link.textContent = label;
        nav.append(link);
    }

    header.append(brand, nav);
    return header;
}

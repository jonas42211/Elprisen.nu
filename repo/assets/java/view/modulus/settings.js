export function createSettings(selectedArea, onAreaChange) {
    const button = document.createElement("button");
    const icon = document.createElement("img");
    const panel = document.createElement("div");
    const label = document.createElement("label");
    const select = document.createElement("select");

    button.className = "lige-nu-settings";
    button.type = "button";
    button.setAttribute("aria-label", "Vælg prisområde");
    button.title = "Vælg prisområde";
    button.setAttribute("aria-expanded", "false");

    icon.src = "assets/img/settings.svg";
    icon.alt = "";
    button.append(icon);

    panel.className = "lige-nu-settings-panel";
    panel.hidden = true;
    label.htmlFor = "price-area";
    label.textContent = "Prisområde";

    for (const [id, name] of [["DK1", "Vestdanmark"], ["DK2", "Østdanmark"]]) {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = `${id} · ${name}`;
        select.append(option);
    }

    select.id = "price-area";
    select.value = selectedArea;
    select.addEventListener("change", () => onAreaChange(select.value));
    button.addEventListener("click", () => {
        panel.hidden = !panel.hidden;
        button.setAttribute("aria-expanded", String(!panel.hidden));
    });

    panel.append(label, select);
    return { button, panel };
}

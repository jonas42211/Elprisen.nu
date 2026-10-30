export function createSettings(selectedArea, onAreaChange) {
    const button = document.createElement("button");
    const icon = document.createElement("img");
    const panel = document.createElement("section");
    const heading = document.createElement("h2");
    const vatSetting = createSwitch("prices-include-vat", "PRISER INKL. MOMS");
    const alarmSetting = createSwitch("lowest-price-alarm", "LAVESTE PRIS ALARM", true);
    const regionSetting = document.createElement("div");
    const regionLabel = document.createElement("label");
    const regionSelect = document.createElement("select");

    button.className = "lige-nu-settings";
    button.type = "button";
    button.setAttribute("aria-label", "Åbn indstillinger");
    button.title = "Indstillinger";
    button.setAttribute("aria-expanded", "false");

    icon.src = "assets/img/settings.svg";
    icon.alt = "";
    button.append(icon);

    panel.className = "lige-nu-settings-panel";
    panel.setAttribute("aria-label", "Indstillinger");
    panel.hidden = true;
    heading.className = "settings-panel__heading";
    heading.textContent = "INDSTILLINGER";

    for (const [id, name] of [["DK2", "REGION ØST"], ["DK1", "REGION VEST"]]) {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = name;
        regionSelect.append(option);
    }

    regionSetting.className = "settings-panel__setting settings-panel__region";
    regionLabel.htmlFor = "price-area";
    regionLabel.textContent = "VÆLG REGION";
    regionSelect.id = "price-area";
    regionSelect.value = selectedArea;
    regionSelect.addEventListener("change", () => onAreaChange(regionSelect.value));

    button.addEventListener("click", () => {
        panel.hidden = !panel.hidden;
        button.setAttribute("aria-expanded", String(!panel.hidden));
        button.setAttribute("aria-label", panel.hidden ? "Åbn indstillinger" : "Luk indstillinger");
    });

    regionSetting.append(regionLabel, regionSelect);
    panel.append(heading, vatSetting, alarmSetting, regionSetting);
    return { button, panel };
}

function createSwitch(id, labelText, checked = false) {
    const setting = document.createElement("div");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const track = document.createElement("span");

    setting.className = "settings-panel__setting";
    label.className = "settings-switch";
    label.htmlFor = id;
    label.append(document.createTextNode(labelText));
    input.id = id;
    input.className = "settings-switch__input";
    input.type = "checkbox";
    input.checked = checked;
    track.className = "settings-switch__track";
    track.setAttribute("aria-hidden", "true");

    label.append(input, track);
    setting.append(label);
    return setting;
}

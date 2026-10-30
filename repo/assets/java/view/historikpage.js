import { createPriceRows } from "./modulus/priceRows.js";
import { createPageFooter } from "./modulus/pageFooter.js";
import { createSettings } from "./modulus/settings.js";

function formatDate(date) {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
}

export default function renderHistoryPage(prices, selectedArea, selectedDate, onDateChange, onAreaChange, error, showSettings = true) {
    const page = document.createElement("section");
    const heading = document.createElement("h1");
    const content = document.createElement("div");
    const datePicker = document.createElement("div");
    const dateField = document.createElement("button");
    const dateValue = document.createElement("span");
    const calendarIcon = document.createElement("img");
    const dateInput = document.createElement("input");
    const dateLabel = document.createElement("label");
    const priceHeading = document.createElement("h2");
    const zone = prices?.zones.find(({ id }) => id === selectedArea);

    page.className = "data-page history-page";
    heading.className = "data-page__heading";
    heading.textContent = "HISTORIK";
    content.className = "data-page__content";
    dateLabel.className = "visually-hidden";
    dateLabel.htmlFor = "history-date";
    dateLabel.textContent = "Vælg dato";
    dateInput.id = "history-date";
    dateInput.className = "history-date-field__input";
    dateInput.type = "date";
    dateInput.value = selectedDate;
    dateInput.title = "Vælg en dato for historikken";
    dateInput.tabIndex = -1;
    dateInput.setAttribute("aria-hidden", "true");
    datePicker.className = "history-date-picker";
    dateField.className = "history-date-field";
    dateField.type = "button";
    dateField.setAttribute("aria-label", `Vælg dato for historikken. Valgt dato: ${formatDate(selectedDate)}`);
    dateValue.className = "history-date-field__value";
    dateValue.textContent = formatDate(selectedDate);
    calendarIcon.className = "history-date-field__icon";
    calendarIcon.src = "assets/img/calendar.svg";
    calendarIcon.alt = "";
    dateInput.addEventListener("change", () => {
        if (dateInput.value) onDateChange(dateInput.value);
        else dateInput.value = selectedDate;
    });
    dateField.addEventListener("click", () => {
        if (typeof dateInput.showPicker === "function") {
            dateInput.showPicker();
        } else {
            dateInput.focus();
            dateInput.click();
        }
    });
    dateField.append(dateValue, calendarIcon);
    datePicker.append(dateField, dateInput);
    priceHeading.className = "history-page__subheading";
    priceHeading.textContent = `ELPRISERNE D. ${formatDate(selectedDate)}`;

    content.append(dateLabel, datePicker, priceHeading);
    if (error) {
        const message = document.createElement("p");
        message.className = "data-page__message";
        message.textContent = `Priserne kunne ikke hentes: ${error}`;
        content.append(message);
    } else if (zone?.prices.length) {
        content.append(createPriceRows(zone.prices));
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

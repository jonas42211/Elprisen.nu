function formatTime(date) {
    return new Intl.DateTimeFormat("da-DK", {
        timeZone: "Europe/Copenhagen",
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
}

export function createPriceDisplay(prices, selectedArea, error) {
    const circle = document.createElement("div");
    const price = document.createElement("p");
    const unit = document.createElement("p");
    const time = document.createElement("p");

    circle.className = "lige-nu-price-circle";
    price.className = "lige-nu-price";
    unit.className = "lige-nu-unit";
    time.className = "lige-nu-time";

    if (error) {
        price.textContent = "Prisen kunne ikke hentes";
        time.textContent = error;
    } else {
        const zone = prices?.zones.find(({ id }) => id === selectedArea);
        const now = Date.now();
        const currentPrice = zone?.prices.find(({ time_start, time_end }) =>
            now >= Date.parse(time_start) && now < Date.parse(time_end)
        );

        if (currentPrice) {
            price.textContent = currentPrice.DKK_per_kWh.toFixed(3);
            unit.textContent = "KR. PR. KWH";
            time.textContent = `${formatTime(new Date(currentPrice.time_start))} - ${formatTime(new Date(currentPrice.time_end))}`;
        } else {
            price.textContent = prices ? "Ingen pris lige nu" : "Henter pris…";
        }
    }

    circle.append(price, unit);
    return { circle, time };
}

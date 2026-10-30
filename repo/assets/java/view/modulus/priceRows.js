function formatTime(date) {
    return new Intl.DateTimeFormat("da-DK", {
        timeZone: "Europe/Copenhagen",
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
}

function getPriceLevel(price) {
    if (price <= 0.4) return "low";
    if (price <= 0.6) return "mid";
    if (price <= 0.75) return "high";
    return "peak";
}

export function createPriceRows(prices) {
    const list = document.createElement("div");
    list.className = "price-list";

    for (const item of [...prices].sort((a, b) => Date.parse(a.time_start) - Date.parse(b.time_start))) {
        const row = document.createElement("div");
        const hour = document.createElement("span");
        const amount = document.createElement("span");

        row.className = "price-row";
        hour.className = "price-row__hour";
        amount.className = `price-row__amount price-row__amount--${getPriceLevel(item.DKK_per_kWh)}`;
        hour.textContent = `kl. ${formatTime(new Date(item.time_start))}`;
        amount.textContent = `${item.DKK_per_kWh.toFixed(3)} kr`;

        row.append(hour, amount);
        list.append(row);
    }

    return list;
}

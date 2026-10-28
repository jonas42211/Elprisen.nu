const priceAreas = ["DK1", "DK2"];
let todayPrices;

function getDatePath(date) {
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Copenhagen",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(date).map(({ type, value }) => [type, value]));

    return `${parts.year}/${parts.month}-${parts.day}`;
}

export async function fetchTodayPrices(date = new Date()) {
    const datePath = getDatePath(date);
    const zones = await Promise.all(priceAreas.map(async (area) => {
        const response = await fetch(`https://www.elprisenligenu.dk/api/v1/prices/${datePath}_${area}.json`);

        if (!response.ok) {
            throw new Error(`Kunne ikke hente priser for ${area} (HTTP ${response.status}).`);
        }

        const prices = await response.json();
        if (!Array.isArray(prices) || prices.some((price) =>
            !price ||
            !Number.isFinite(price.DKK_per_kWh) ||
            typeof price.time_start !== "string" ||
            typeof price.time_end !== "string"
        )) {
            throw new Error(`API'et returnerede ugyldige prisdata for ${area}.`);
        }

        return { id: area, prices };
    }));

    todayPrices = { dayLabel: datePath.replace("/", "-"), zones };
    return todayPrices;
}

export function getTodayPrices() {
    return todayPrices;
}

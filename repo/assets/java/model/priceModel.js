const priceAreas = ["DK1", "DK2"];

function getDatePath(date) {
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Copenhagen",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(date).map(({ type, value }) => [type, value]));

    return `${parts.year}/${parts.month}-${parts.day}`;
}

function toDate(value) {
    if (value instanceof Date) return value;

    const date = new Date(`${value}T12:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
        throw new Error("Vælg en gyldig dato for prisopslaget.");
    }

    return date;
}

export async function fetchPricesForDate(value = new Date()) {
    const datePath = getDatePath(toDate(value));
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

    return { dayLabel: datePath.replace("/", "-"), zones };
}

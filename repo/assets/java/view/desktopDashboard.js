import renderHistoryPage from "./historikpage.js";
import renderLigeNuPage from "./ligenupage.js";
import renderOverviewPage from "./oversigtpage.js";
import { createSettings } from "./modulus/settings.js";

export default function renderDesktopDashboard({
    todayPrices,
    historyPrices,
    selectedArea,
    selectedDate,
    onDateChange,
    onAreaChange,
    todayError,
    historyError
}) {
    const dashboard = document.createElement("div");
    const columns = document.createElement("div");
    const settings = createSettings(selectedArea, onAreaChange);
    const currentPage = renderLigeNuPage(todayPrices, selectedArea, onAreaChange, todayError, false);
    const overviewPage = renderOverviewPage(todayPrices, selectedArea, onAreaChange, todayError, false);
    const historyPage = renderHistoryPage(
        historyPrices,
        selectedArea,
        selectedDate,
        onDateChange,
        onAreaChange,
        historyError,
        false
    );
    const summary = overviewPage.querySelector(".overview-summary");

    dashboard.className = "desktop-dashboard";
    columns.className = "desktop-dashboard__columns";
    currentPage.insertBefore(summary, currentPage.querySelector(".lige-nu-footer"));
    columns.append(currentPage, overviewPage, historyPage);
    dashboard.append(settings.button, settings.panel, columns);

    return dashboard;
}

function getDateRange(yearsBack) {
    let endDate = new Date(); // Today
    let startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - yearsBack); // One year back

    // Format to YYYY-MM-DD
    let formatDate = (date) => date.toISOString().split("T")[0];

    return {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate)
    };
}

// // Example usage
// let dateRange = getDateRange();
// console.log("Start Date:", dateRange.startDate);
// console.log("End Date:", dateRange.endDate);

$(document).ready(function () {
    let { startDate, endDate } = getDateRange();

    function fetchCompanies() {
        $.getJSON(`${CONFIG.BASE_URL}/financials/companies?c=${CONFIG.API_KEY}`, function (data) {
            let companyList = $("#CompanyList");
            companyList.empty();

            data.forEach(company => {
                companyList.append(
                    `<li><a class="dropdown-item company-item" href="#" data-symbol="${company.Symbol}">${company.Symbol} - ${company.Name}</a></li>`
                );
            });

            // if (data.length > 0) {
            //     fetchDividends(data[0].Symbol);
            // }

        }).fail(function () {
            alert("Error fetching company data.");
        });
    }

    let ctx = document.getElementById("financialChart").getContext("2d");

    // Initialize Chart
    let financialChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [], // Dates
            datasets: [{
                label: "Dividends",
                data: [], // Dividend values
                borderColor: "#007bff",
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            }
        }
    });

    //Function to Fetch & Update Dividends
    function fetchDividends(companySymbol) {    
        console.log("Fetching Dividends for " + companySymbol);

        $.getJSON(`${CONFIG.BASE_URL}/dividends/symbol/${companySymbol}?d1=${startDate}&d2=${endDate}&c=${CONFIG.API_KEY}`, function (data) {
            console.log("data fetch sucessfully", data);
            let dates = data.map(item => item.DatePayment);
            let dividends = data.map(item => item.Actual);

            updateChart(dates, dividends);

        }).fail(function () {
            console.log("Error fetching dividend data.");
            alert("Error fetching dividend data.");
        });
    }

    // Function to Update Chart
    function updateChart(labels, values) {
        financialChart.data.labels = labels;
        financialChart.data.datasets[0].data = values;
        financialChart.update();
    }

    $(document).on("click", ".company-item", function () {
        let selectedCompany = $(this).text();
        let selectedSymbol = $(this).data("symbol");
    
        $("#selectedCompany").text(selectedCompany); // Update button text
        fetchDividends(selectedSymbol); // Load dividends for selected company
    });

    $("#companySearch").on("keyup", function () {
        let searchText = $(this).val().toLowerCase();
        $(".company-item").each(function () {
            let text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(searchText)); // Show/hide based on search
        });
    });


    fetchCompanies();
});

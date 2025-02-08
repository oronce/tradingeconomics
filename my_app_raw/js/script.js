    $(document).ready(function () {
        let { startDate, endDate } = getDateRange();
        let chartContainer = $("#chartContainer");

        function showError(message) {
            let errorBox = $("#errorMessage");
            errorBox.text(message).removeClass("d-none");
        
            setTimeout(function () {
                errorBox.addClass("d-none");
            }, 3000);
        }

        function showLoading(message = "Loading data, please wait...") {
            $("#loadingMessage").text(message); // Set the custom message
            $("#loadingSpinner").removeClass("d-none"); // Show loading overlay
        }
        
        function hideLoading() {
            $("#loadingSpinner").addClass("d-none"); // Hide loading overlay
        }
        

        function fetchCompanies() {
            showLoading("Loading Companies Data, please wait...")

            $.getJSON(`${CONFIG.BASE_URL}/financials/companies?c=${CONFIG.API_KEY}`, function (data) {
                let companyList = $("#CompanyList");
                companyList.empty();

                data.forEach(company => {
                    companyList.append(
                        `<li><a class="dropdown-item company-item" href="#" data-symbol="${company.Symbol}">${company.Symbol} - ${company.Name}</a></li>`
                    );
                });

                if (data.length > 0) {
                    fetchDividends("AAPL:US");
                }

            }).fail(function () {
                showError("Something went Wrong fetching available companies  , Try again later" )
            }).always(function () {
                // Hide loading spinner after fetching is complete (success or fail)
                hideLoading()
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
                    legend: { display: true },
                    title: {
                        display: false,
                        text: "Dividend History", // Chart title
                        font: { size: 18 }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Payment Date", // X-axis title
                            font: { size: 14 }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Dividend Amount", // Y-axis title
                            font: { size: 14 }
                        }
                    }
                }
            }
        });

        //Function to Fetch & Update Dividends
        function fetchDividends(companySymbol) {    
            console.log("Fetching Dividends for " + companySymbol);
            showLoading("Loading data, please wait...");

            $.getJSON(`${CONFIG.BASE_URL}/dividends/symbol/${companySymbol}?d1=${startDate}&d2=${endDate}&c=${CONFIG.API_KEY}`, function (data) {
                console.log("data fetch sucessfully", data);

                
                if (!data || data.length === 0) {
                    showError("No dividend data available for " + companySymbol)
                    //alert("No dividend data available for this company.");
                    updateChart([], [],'','',false); // Clear chart if no data
                    //chartContainer.hide();
                    return;
                }

                let dates = data.map(item => item.DatePayment);
                let dividends = data.map(item => item.Actual);
                let currency = data[0].Currency;

                updateChart(dates, dividends,companySymbol , currency,istitleDisplay=true);

            }).fail(function () {
                console.log("Error fetching dividend data.");
                showError("Something went Wrong  , Try again later" )
            }).always(function () {
                // Hide loading spinner after fetching is complete (success or fail)
                hideLoading()
            });
        }

        // Function to Update Chart
        function updateChart(labels, values,companySymbol, currency , istitleDisplay=false) {
            financialChart.data.labels = labels;
            financialChart.data.datasets[0].data = values;

            financialChart.options.plugins.title.text = `Dividend History - ${companySymbol}`;
            financialChart.options.plugins.title.display = istitleDisplay;

            financialChart.options.scales.y.title.text = `Dividend Value (${currency})`;

            financialChart.update();
        }

        $(document).on("click", ".company-item", function () {
            let selectedCompany = $(this).text();
            let selectedSymbol = $(this).data("symbol");
        
            $("#selectedCompany").text(selectedCompany); // Update button text
            $("#companySearch").val(''); 
            $(".company-item").toggle(true);
            fetchDividends(selectedSymbol); // Load dividends for selected company
        });

        //implement the search feature
        $("#companySearch").on("keyup", function () {
            let searchText = $(this).val().toLowerCase();
            $(".company-item").each(function () {
                let text = $(this).text().toLowerCase();
                $(this).toggle(text.includes(searchText)); // Show/hide based on search
            });
        });


        fetchCompanies();
    });

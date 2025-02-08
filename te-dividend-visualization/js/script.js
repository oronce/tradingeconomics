    $(document).ready(function () {

        const BASE_URL = "https://api.tradingeconomics.com"

        //stop execution if no config file
        if (typeof CONFIG === "undefined") {
            alert("Config file  is missing. Please check your configuration.");
            return; 
        }else if (!CONFIG.API_KEY){
            alert("API key is required. Please check your configuration.");
            return;
        }
    

        let { startDate, endDate } = getDateRange(yearsBack = 1);
        let chartContainer = $("#chartContainer");

        //UTILS FUNCS

        function showError(message) {
            let errorBox = $("#errorMessage");
            errorBox.text(message).removeClass("d-none");
        
            setTimeout(function () {
                errorBox.addClass("d-none");
            }, 3000);
        }

        function showLoading(message = "Loading data, please wait...") {
            $("#loadingMessage").text(message); 
            $("#loadingSpinner").removeClass("d-none"); 
        }
        
        function hideLoading() {
            $("#loadingSpinner").addClass("d-none"); 
        }

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
        
        //API FUNCS

        function fetchCompanies() {
            showLoading("Loading Companies Data, please wait...")

            $.getJSON(`${BASE_URL}/dividends/?d1=${startDate}&d2=${endDate}&c=${CONFIG.API_KEY}`, function (data) {
                
                let companyList = $("#CompanyList");
                companyList.empty();

                data.forEach(company => {
                    companyList.append(
                        `<li><a class="dropdown-item company-item" href="#" data-symbol="${company.Symbol}">${company.Symbol} - ${company.Name}</a></li>`
                    );
                });

                if (data.length > 0) {
                    // Fetch dividends for the first company by default
                    fetchDividends(data[0].Symbol);
                }

            }).fail(function () {
                showError("Something went Wrong fetching available companies  , Try again later" )
            }).always(function () {
                hideLoading()
            });
        }

        function fetchDividends(companySymbol) {    
            let { startDate, endDate } = getDateRange(yearsBack = 10);
            showLoading("Loading data, please wait...");

            $.getJSON(`${BASE_URL}/dividends/symbol/${companySymbol}?d1=${startDate}&d2=${endDate}&c=${CONFIG.API_KEY}`, function (data) {

                
                if (!data || data.length === 0) {
                    showError("No dividend data available for " + companySymbol)
                    updateChart([], [],'','',false); // Clear chart if no data
                    return;
                }

                let dates = data.map(item => item.DatePayment);
                let dividends = data.map(item => item.Actual);
                let currency = data[0].Currency;

                updateChart(dates, dividends,companySymbol , currency,istitleDisplay=true);

            }).fail(function () {
                showError("Something went Wrong  , Try again later" )
            }).always(function () {
                hideLoading()
            });
        }

        //CHARTS 
        let ctx = document.getElementById("financialChart").getContext("2d");

        // Initialize Chart
        let financialChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: [], 
                datasets: [{
                    label: "Dividends",
                    data: [], 
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
                        text: "Dividend History", 
                        font: { size: 18 }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Payment Date", 
                            font: { size: 14 }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Dividend Amount", 
                            font: { size: 14 }
                        }
                    }
                }
            }
        });

        

        function updateChart(labels, values,companySymbol, currency , istitleDisplay=false) {
            financialChart.data.labels = labels;
            financialChart.data.datasets[0].data = values;

            financialChart.options.plugins.title.text = `Dividend History - ${companySymbol}`;
            financialChart.options.plugins.title.display = istitleDisplay;

            financialChart.options.scales.y.title.text = `Dividend Value (${currency})`;

            financialChart.update();
        }

        //LISTENERS

        // Toggle company list on/off
        $(document).on("click", ".company-item", function () {
            let selectedCompany = $(this).text();
            let selectedSymbol = $(this).data("symbol");
        
            $("#selectedCompany").text(selectedCompany); 
            $("#companySearch").val(''); 
            $(".company-item").toggle(true);
            fetchDividends(selectedSymbol); 
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

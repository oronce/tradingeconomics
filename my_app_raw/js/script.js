$(document).ready(function () {
    function fetchCompanies() {
        $.getJSON(`${CONFIG.BASE_URL}/companies?c=${CONFIG.API_KEY}`, function (data) {
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

    $("#companySearch").on("keyup", function () {
        let searchText = $(this).val().toLowerCase();
        $(".company-item").each(function () {
            let text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(searchText)); // Show/hide based on search
        });
    });

    $(document).on("click", ".company-item", function () {
        let selectedCompany = $(this).text();
        let selectedSymbol = $(this).data("symbol");

        $("#selectedCompany").text(selectedCompany); // Update button text
        // fetchDividends(selectedSymbol); // Load dividends for selected company
    });

    fetchCompanies();
});

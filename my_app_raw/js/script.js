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


    fetchCompanies();
});

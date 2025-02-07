


$(document).ready(function () {
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
});
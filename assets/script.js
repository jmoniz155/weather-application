// need a section with input, a search button, and a list below showing the recent searches stored in localStorage
// To the right want details for today and under, a 5 card weather forecast, both with aforementioned details


// jQuery initiator
$(document).ready(function () {
    $("#search-button").on("click", function () {
        var searchValue = $("#search-value").val();

        // erase input box
        $("#search-value").val("");

        searchWheather(searchValuealue);
    });
























});
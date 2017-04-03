$(document).ready(function() {
    $('#idate, #fdate').datepicker({
        format: "yyyy-mm-dd",
        weekStart: 1,
        maxViewMode: 2,
        language: "es",
        daysOfWeekHighlighted: "0",
        autoclose: true
    });
    $('#idate').datepicker('setDate', moment().subtract(7, 'd').format('YYYY-MM-DD'));
    $('#fdate').datepicker('setDate', moment().format('YYYY-MM-DD'));
    $('#search').click(function(event) {
        controller.searchDatatable();
    });
    $('#dTable tbody').on('dblclick', 'tr', function() {
        console.log('You clicked on ' + $(this).children().first().text() + '\'s row');
    });
});

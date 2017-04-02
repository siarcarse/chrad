$(document).ready(function() {
    //controller.loadSelectRole();
    $('#idate, #fdate').datepicker({
        format: "dd-mm-yyyy",
        weekStart: 1,
        maxViewMode: 2,
        language: "es",
        daysOfWeekHighlighted: "0",
        autoclose: true
    });
});

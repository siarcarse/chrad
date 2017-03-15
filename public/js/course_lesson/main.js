$(document).ready(function() {
    controller.loadSelectCourse();

    $('#year').val(parseInt(moment().format('YYYY'))); // Seteo año actual por defecto
    $('#year-search').val(parseInt(moment().format('YYYY'))); // Seteo año actual por defecto

    //Reset state error un click inputs
    $('#crudForm :input').click(function(event) {
        $(this).parent().removeClass('has-error');
    });
    $('#ihour, #ehour').timepicker({
        minuteStep: 5,
        showSeconds: false,
        showMeridian: false
    });
    $('#day').click(function(event) {
        $(this).parent().removeClass('has-error');
    });
    $('#add').click(function(event) {
        var day = $('#day').val();
        if (parseInt(day) !== 0) {
            var course_lesson = $(this).attr('data-id');
            var ihour = $('#ihour').val();
            var ehour = $('#ehour').val();
            $.post('/api/course_lesson_schedule', { course_lesson, day, ihour, ehour }, function(data, textStatus, xhr) {
                controller.makeTableSchedules(course_lesson);
            });
        }else {
            $('#day').parent().addClass('has-error');
        }
    });
    $('#schedule-modal').on('hidden.bs.modal', () => { //Modal on Hide, reset inputs
        datatable.ajax.reload();
    });
    $('#courses').change(function(event) {
        let course = parseInt($(this).val());
        datatable.ajax.url('/api/course_lesson/' + course + '/course/').load(); //Reload DataTables :)
    });
    $('#search').click((event) => {
        let course = parseInt($('#courses').val());
        datatable.ajax.url('/api/course_lesson/' + course + '/course/').load(); //Reload DataTables :)
    });
});

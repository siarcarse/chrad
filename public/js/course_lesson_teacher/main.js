$(document).ready(function() {
    controller.loadSelectCourse();

    $('#year').val(parseInt(moment().format('YYYY'))); // Seteo año actual por defecto
    $('#year-search').val(parseInt(moment().format('YYYY'))); // Seteo año actual por defecto

    //Reset state error un click inputs
    $('#crudForm :input').click(function(event) {
        $(this).parent().removeClass('has-error');
    });
    $('#crud-modal').on('hidden.bs.modal', () => { //Modal on Hide, reset inputs
        controller.resetFormInputs();
    });
    $('#delete-crud').click((event) => {
        let rowSelected = datatable.rows('.selected').data();
        let id = rowSelected[0].id;
        $.ajax({
            url: '/api/courses/' + id,
            type: 'DELETE',
        }).done((data) => {
            datatable.ajax.reload();
        });
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

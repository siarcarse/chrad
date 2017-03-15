$(document).ready(function() {
    controller.loadSelectLevel();

    $('#year').val(parseInt(moment().format('YYYY'))); // Seteo año actual por defecto
    $('#year-search').val(parseInt(moment().format('YYYY'))); // Seteo año actual por defecto

    //Reset state error un click inputs
    $('#crudForm :input').click(function(event) {
        $(this).parent().removeClass('has-error');
    });
    $('#crud-modal').on('hidden.bs.modal', () => { //Modal on Hide, reset inputs
        controller.resetFormInputs();
    });

    $('#edit-crud').click(function(event) {
        let rowSelected = datatable.rows('.selected').data();
        if (rowSelected.length === 1) {
            controller.editFormData(rowSelected[0]); // Lleno el formulario y abro el Modal
            $('#crud-modal').modal('show');
            $('#saveButton').attr('data-update', rowSelected[0].id);
        } else if (rowSelected.length === 0) {
            global.sendMessage('info', 'Debes Seleccionar almenos un registro!');
        } else if (rowSelected.length > 1) {
            global.sendMessage('danger', 'Solo puedes editar 1 registro a la vez!');
        }

    });
    $('#saveButton').click(function(event) {
        let level = $('#level').val();
        let year = $('#year').val();
        controller.validate((err) => {
            if (!err) {
                let id = $(this).attr('data-update');
                $(this).attr('data-update', '');
                let method = 'POST';
                let url = '/api/courses';
                if (id) {
                    method = 'PUT';
                    url = '/api/courses/' + id;
                } else {
                    method = 'POST';
                    url = '/api/courses';
                }
                $('#crud-modal').modal('hide');
                $.ajax({
                    url: url,
                    type: method,
                    data: { level, year },
                }).done(function(data) {
                    datatable.ajax.reload();
                });
            }
        });
    });
    $('#delete-crud').click(function(event) {
        let rowSelected = datatable.rows('.selected').data();
        let id = rowSelected[0].id;
        $.ajax({
            url: '/api/courses/' + id,
            type: 'DELETE',
        }).done(function(data) {
            datatable.ajax.reload();
        });
    });
    $('#search').click(function(event) {
        let year = parseInt($('#year-search').val());
        datatable.ajax.url("/api/courses/" + year + "/year").load(); //Reload DataTables :)
    });
});

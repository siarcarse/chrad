$(document).ready(function() {
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
        let name = $('#name').val();
        let description = $('#description').val();
        controller.validate((err) => {
            if (!err) {
                let id = $(this).attr('data-update');
                $(this).attr('data-update', '');
                let method = 'POST';
                let url = '/api/lesson';
                if (id) {
                    method = 'PUT';
                    url = '/api/lesson/' + id;
                } else {
                    method = 'POST';
                    url = '/api/lesson';
                }
                $('#crud-modal').modal('hide');
                $.ajax({
                    url: url,
                    type: method,
                    data: { name, description },
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
            url: '/api/lesson/' + id,
            type: 'DELETE',
        }).done(function(data) {
            datatable.ajax.reload();
        });
    });
});

$(document).ready(function() {
    controller.loadSelectRole();
    $("#phone").numeric({ decimal: false, negative: false }); //Control numeric Input

    $('input#phone').on('keyup', function() {
        controller.limitText(this, 8); // Control Lenght Numeric Input (phone max 8 characters)
    });
    $('#rut').Rut({
        on_error: () => {
            $('#rut').parent().addClass('has-error');
            global.sendMessage('danger', 'Rut Invalido!');
            $('#saveButton').attr('disabled', 'disabled');
        },
        on_success: ()=> {
            $('#rut').parent().removeClass('has-error');
            $('#saveButton').removeAttr('disabled');
        }
    });
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
        let username = $('#username').val();
        let password = $('#password').val();
        let name = $('#name').val();
        let lastname = $('#lastname').val();
        let role = $('#role').val();
        let mail = $('#mail').val();
        let rut = $('#rut').val();
        let birthdate = $('#birthdate').val();
        let phone = $('#phone').val();
        controller.validate((err) => {
            if (!err) {
                let id = $(this).attr('data-update');
                $(this).attr('data-update', '');
                let method = 'POST';
                let url = '/api/users';
                if (id) {
                    method = 'PUT';
                    url = '/api/users/' + id;
                } else {
                    method = 'POST';
                    url = '/api/users';
                }
                $('#crud-modal').modal('hide');
                $.ajax({
                    url: url,
                    type: method,
                    data: { username, password, name, lastname, role, mail, birthdate, phone, rut },
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
            url: '/api/users/' + id,
            type: 'DELETE',
        }).done(function(data) {
            datatable.ajax.reload();
        });
    });
});

$(document).ready(function() {

    $("#enrollment").numeric({ decimal: false, negative: false }); //Control numeric Input
    //Reset state error un click inputs
    $('#crudForm :input').click(function(event) {
        $(this).parent().removeClass('has-error');
        if ($(this).attr('id') === 'enrollment') {
            $('#enrollment').attr('data-error', 'false');
        }
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
        let rut = $('#rut').val();
        let lastname = $('#lastname').val();
        let gender = $('#gender').val();
        let address = $('#address').val();
        let birthdate = $('#birthdate').val();
        let enrollment = $('#enrollment').val();
        controller.validate((err) => {
            if (!err) {
                let idValidate = $('#saveButton').attr('data-update') || 0;
                controller.verifyEnrollment(enrollment, idValidate, (data) => { // VALIDO QUE EL NUMERO DE MATRICULA SEA UNICO
                    if (!data) {
                        let id = $(this).attr('data-update');
                        $(this).attr('data-update', '');
                        let method = 'POST';
                        let url = '/api/student';
                        if (id) {
                            method = 'PUT';
                            url = '/api/student/' + id;
                        } else {
                            method = 'POST';
                            url = '/api/student';
                        }
                        $('#crud-modal').modal('hide');
                        $.ajax({
                            url: url,
                            type: method,
                            data: { name, lastname, gender, rut, birthdate, address, enrollment },
                        }).done(function(data) {
                            datatable.ajax.reload();
                        });
                    } else {
                        $('#enrollment').parent().addClass('has-error');
                        global.sendMessage('danger', 'Número de matricula ya esta asociado a otro alumno. Verifique su información...');
                    }
                });
            }
        });
    });
    $('#delete-crud').click(function(event) {
        let rowSelected = datatable.rows('.selected').data();
        let id = rowSelected[0].id;
        $.ajax({
            url: '/api/student/' + id,
            type: 'DELETE',
        }).done(function(data) {
            datatable.ajax.reload();
        });
    });
});

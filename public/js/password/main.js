$(document).ready(function() {
    /********* Reset Input Error onClick *********/
    $('#form :input').click(function(event) {
        $(this).parent().removeClass('has-error');
    });

    $('#save').click(function(event) {
        controller.validate(function(err) {
            if (!err) {
                let password = $('#password').val();
                let new_password = $('#new-password').val();
                let new_password_repeat = $('#new-password-repeat').val();
                let user = credentials.id;
                $.post('/api/change_password', { password, new_password, new_password_repeat, user }, function(data, textStatus, xhr) {
                    if(!data.message.error) {
                        global.sendMessage('info', 'Contraseña cambiada con éxito!');
                    }else {
                        global.sendMessage('danger', data.message.text);
                        $('#password').parent().addClass('has-error');
                    }
                });
            }
        })
    });
});

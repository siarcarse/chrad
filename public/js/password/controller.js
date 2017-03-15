let controller = {
    validate: (cb) => {
        let err = false;
        $('#form :input').each((index, el) => {
            if ($(el).attr('type') === 'text' || $(el).attr('type') === 'password') {
                if (!$(el).val() || $(el).val() === null || $(el).val() === '') {
                    $(el).parent().addClass('has-error');
                    err = true;
                }
            }
        });
        if($('#new-password').val() !== $('#new-password-repeat').val()) {
            err = true;
            $('#new-password, #new-password-repeat').parent().addClass('has-error');
            global.sendMessage('warning', 'Contraseñas no coinciden!');
        }
        cb(err);
    }
}

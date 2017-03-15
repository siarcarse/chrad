let controller = {
    validate: (cb) => {
        let err = false;
        $('#crudForm :input').each((index, el) => {
            if (!$(el).val() || $(el).val() === null || $(el).val() === '' && $(el).attr('id') !== 'role') {
                $(el).parent().addClass('has-error');
                err = true;
            } else if ($(el).attr('type') === 'email') {
                if (!controller.validateEmail($(el).val())) {
                    $(el).parent().addClass('has-error');
                    err = true;
                }
            } else if ($(el).attr('id') === 'phone') {
                if ($(el).val().length !== 8) {
                    $(el).parent().addClass('has-error');
                    err = true;
                }
            } else if ($(el).attr('id') === 'role') {
                if (parseInt($(el).val()) === 0) {
                    $(el).parent().addClass('has-error');
                    err = true;
                }
            }
        });
        cb(err);
    },
    resetFormInputs: (cb) => {
        let err = false;
        $('#crudForm :input').each((index, el) => {
            $(el).val('');
            $(el).parent().removeClass('has-error');
        });
    },
    editFormData: (obj) => {
        $.each(obj, function(index, val) {
            if (index === 'roleid') index = 'role';
            $("[id=" + index + "]").val(val);
        });
    }
}

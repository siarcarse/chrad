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
            } else if ($(el).attr('id') === 'enrollment') {
                if (parseInt($(el).val()) === 0) {
                    $(el).parent().addClass('has-error');
                    err = true;
                }
            }
        });
        cb(err);
    },
    verifyEnrollment: (enrollment, id, cb) => {
        $.ajax({
                url: 'api/student/' + enrollment + '/enrollment/' + id,
                type: 'GET',
                dataType: 'json'
            })
            .done(function(data) {
                cb(data);
            });

    },
    limitText: (field, maxChar) => {
        var ref = $(field),
            val = ref.val();
        if (val.length >= maxChar) {
            ref.val(() => {
                return val.substr(0, maxChar);
            });
        }
    },
    validateEmail: (sEmail) => {
        var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
        if (filter.test(sEmail)) {
            return true;
        } else {
            return false;
        }
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

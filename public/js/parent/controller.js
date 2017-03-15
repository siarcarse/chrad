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
    },
    loadTokenInput: (parent) => {
        $.get('/api/student/father/' + parent, (data) => { // Traigo a los sin padre
            $.get('/api/student/' + parent + '/father/', (selected) => { // Traigo a los hijos previos

                //Cargo a los sin padres
                $multiselect = $('#multiselect');
                $multiselect.empty();
                $.each(data, function(i, item) {
                    $multiselect.append($("<option></option>")
                        .attr("value", item.id).attr("data-father", parent).text(item.name));
                });

                //Cargo los hijos previos
                $multiselect_to = $('#multiselect_to');
                $multiselect_to.empty();
                $.each(selected, function(i, item) {
                    $multiselect_to.append($("<option></option>")
                        .attr("value", item.id).text(item.name));
                });
                $('#multiselect').multiselect({
                    search: {
                        left: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />'
                    },
                    afterMoveToLeft: function(left, right, options) {
                        let id = options.val();
                        if (id) {
                            $.post('/api/student/father/', { father: 0, id: id }, function(data) {//Asigno el father
                            });
                        }
                    },
                    afterMoveToRight: function(left, right, options) {//Reseteo el father
                        let id = options.val();
                        let father = options.attr('data-father');
                        if (id) {
                            $.post('/api/student/father/', { father: father, id: id }, function(data) {
                            });
                        }
                    }
                });
            });
        });
    }
}

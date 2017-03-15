let controller = {
    validate: (cb) => {
        let err = false;
        $('#crudForm :input').each((index, el) => {
            if (parseInt($(el).val()) === 0) {
                $(el).parent().addClass('has-error');
                err = true;
            }
        });
        cb(err);
    },
    resetFormInputs: (cb) => {
        let err = false;
        $('#crudForm :input').each((index, el) => {
            if ($(el).attr('id') === 'level') {
                $(el).val(0);
            } else if ($(el).attr('id') === 'year') {
                $('#year').val(parseInt(moment().format('YYYY'))); // Seteo año actual por defecto
                $('#year').prop('disabled', false);
            }
            $(el).parent().removeClass('has-error');
        });
    },
    editFormData: (obj) => {
        $.each(obj, function(index, val) {
            if (index === 'roleid') index = 'role';
            $("[id=" + index + "]").val(val);
        });
        $('#year').prop('disabled', true);
    },
    loadSelectLevel: (cb) => {
        $.get('/api/level', (data) => {
            var $select = $('#level');
            $select.empty();
            $select.append($("<option></option>")
                .attr("value", 0).text('- Seleccione -'));

            $.each(data, function(i, item) {
                $select.append($("<option></option>")
                    .attr("value", item.id).text(item.name));

            });
        });
    },
    loadTokenInput: (course, name_course) => {
        $('#title-modal-assoc').text(name_course);
        $.get('/api/lesson/' + course + '/course', (data) => { // Traigo a los sin padre
            $.get('/api/lesson/courses/' + course, (selected) => { // Traigo a los hijos previos

                //Cargo a los sin padres
                $multiselect = $('#multiselect');
                $multiselect.empty();
                $.each(data, function(i, item) {
                    $multiselect.append($("<option></option>")
                        .attr("value", item.id).attr("data-course", course).text(item.name));
                });

                //Cargo los hijos previos
                $multiselect_to = $('#multiselect_to');
                $multiselect_to.empty();
                $.each(selected, function(i, item) {
                    $multiselect_to.append($("<option></option>")
                        .attr("value", item.id).attr("data-course", course).text(item.name));
                });
                $('#multiselect').multiselect({
                    search: {
                        left: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
                        right: '<strong class="text-primary text-center">Asignaturas del curso!</strong>'
                    },
                    afterMoveToLeft: function(left, right, options) {
                        let course = options.attr('data-course');
                        let lesson = options.val();
                        if (lesson) {
                            $.ajax({
                                url: '/api/course_lesson',
                                type: 'DELETE',
                                data: { course: course, lesson: lesson }
                            });
                        }
                    },
                    afterMoveToRight: function(left, right, options) { //Reseteo el course
                        let lesson = options.val();
                        let course = options.attr('data-course');
                        if (lesson) {
                            $.post('/api/course_lesson', { course: course, lesson: lesson });
                        }
                    }
                });
            });
        });
    },
    loadStudentInput: (course, name_course) => {
        $('#title-modal-student').text(name_course);
        $.get('/api/student/' + course + '/course', (data) => {
            $.get('/api/student/courses/' + course, (selected) => {

                //Cargo a los sin Cursos
                $multiselect = $('#multiselect_student');
                $multiselect.empty();
                $.each(data, function(i, item) {
                    $multiselect.append($("<option></option>")
                        .attr("value", item.id).attr("data-course", course).text(item.name));
                });

                //Cargo los cursos previos
                $multiselect_to = $('#multiselect_to_student');
                $multiselect_to.empty();
                $.each(selected, function(i, item) {
                    $multiselect_to.append($("<option></option>")
                        .attr("value", item.id).attr("data-course", course).text(item.name));
                });
                $('#multiselect_student').multiselect({
                    search: {
                        left: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
                        right: '<strong class="text-primary text-center">Alumnos del curso!</strong>'
                    },
                    right: '#multiselect_to_student',
                    rightSelected: '#js_right_Selected_1',
                    leftSelected: '#js_left_Selected',
                    afterMoveToLeft: function(left, right, options) {
                        let course = options.attr('data-course');
                        let student = options.val();
                        if (student) {
                            $.ajax({
                                url: '/api/course_student',
                                type: 'DELETE',
                                data: { course: course, student: student }
                            });
                        }
                    },
                    afterMoveToRight: function(left, right, options) { //Reseteo el course
                        let student = options.val();
                        let course = options.attr('data-course');
                        if (student) {
                            $.post('/api/course_student', { course: course, student: student });
                        }
                    }
                });
            });
        });
    }
}

let controller = {
    loadSelectCourse: (cb) => {
        var userId = credentials.id;
        if (credentials.rolename === 'Administrador') {
            var apiPath = '/api/courses/';
        } else {
            var apiPath = '/api/courses/' + userId + '/teacher';
        }
        $.get(apiPath, (data) => {
            var count = data.length;
            var $select = $('#courses');
            $select.empty();
            $select.append($("<option></option>")
                .attr("value", 0).text('- Seleccione -'));

            $.each(data, function(i, item) {
                if (parseInt(count) === 1) {
                    $select.append($("<option></option>")
                        .attr("value", item.id).attr('selected', 'selected').text(item.level_name));
                } else {
                    $select.append($("<option></option>")
                        .attr("value", item.id).text(item.level_name));
                }
            });
            if (parseInt(count) === 1) {
                datatable.ajax.url('/api/course_lesson/' + data[0].id + '/course/').load(); //Reload DataTables :)
            }
        });
    },
    loadTeacherInput: (course_lesson, name_course) => {
        $('#title-modal-assoc').text(name_course);
        $.get('/api/teacher/' + course_lesson + '/course_lesson', (data) => {
            $.get('/api/teacher/course_lesson/' + course_lesson, (selected) => {
                //Cargo a los sin Cursos
                $multiselect = $('#multiselect');
                $multiselect.empty();
                $.each(data, function(i, item) {
                    $multiselect.append($("<option></option>")
                        .attr("value", item.id).attr("data-course_lesson", course_lesson).text(item.name));
                });

                //Cargo los cursos previos
                $multiselect_to = $('#multiselect_to');
                $multiselect_to.empty();
                $.each(selected, function(i, item) {
                    $multiselect_to.append($("<option></option>")
                        .attr("value", item.id).attr("data-course_lesson", course_lesson).text(item.name));
                });
                $('#multiselect').multiselect({
                    search: {
                        left: '<input type="text" name="q" class="form-control" placeholder="Buscar..." />',
                        right: '<strong class="text-primary text-center">Profesor(es) del curso!</strong>'
                    },
                    afterMoveToLeft: function(left, right, options) {
                        let course_lesson = options.attr('data-course_lesson');
                        let teacher = options.val();
                        if (teacher) {
                            $.ajax({
                                url: '/api/course_lesson_teacher',
                                type: 'DELETE',
                                data: { course_lesson: course_lesson, teacher: teacher }
                            });
                        }
                    },
                    afterMoveToRight: function(left, right, options) { //Reseteo el course_lesson
                        let teacher = options.val();
                        let course_lesson = options.attr('data-course_lesson');
                        if (teacher) {
                            $.post('/api/course_lesson_teacher', { course_lesson: course_lesson, teacher: teacher });
                        }
                    }
                });
            });
        });
    }
}

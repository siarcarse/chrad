let controller = {
    validate: (cb) => {
        let err = false;
        $('#student, #courses, #type').each((index, el) => {
            if (parseInt($(el).val()) === 0) {
                //$(el).parent().addClass('has-error');
                $(el).selectpicker('setStyle', 'btn-danger');
                err = true;
            }
        });
        if ($('.summernote').summernote('isEmpty')) {
            err = true;
        }
        cb(err);
    },
    loadSelectCourse: () => {
        if (credentials.rolename === 'Administrador') {
            var apiPath = '/api/course_lesson/';
        } else {
            var apiPath = '/api/course_lesson/' + credentials.id + '/teacher/';
        }
        $.get(apiPath, (data) => {
            var $select = $('#courses');
            $select.empty();
            $select.append($("<option></option>")
                .attr("value", 0).text('- Seleccione -'));

            $.each(data, function(i, item) {
                $select.append($("<option></option>")
                    .attr("value", item.id).text(item.course + ' - ' + item.lesson));

            });
            $('#courses').selectpicker('refresh');
        });
    },
    loadSelectStudent: (course_lesson) => {
        $.get('/api/student/course_lesson/' + course_lesson, function(data) {
            var $select = $('#student');
            $select.empty();
            $select.append($("<option></option>")
                .attr("value", 0).text('- Seleccione -'));

            $.each(data, function(i, item) {
                $select.append($("<option></option>")
                    .attr("value", item.id).text(item.rut + ' - ' + item.name + ' ' + item.lastname));

            });
            $('#student').selectpicker('refresh');
        });
    }
}

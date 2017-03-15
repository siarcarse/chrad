let controller = {
    validate: (cb) => {
        let err = false;
        $('#courses, #lesson').each((index, el) => {
            if (parseInt($(el).val()) === 0) {
                //$(el).parent().addClass('has-error');
                $(el).selectpicker('setStyle', 'btn-danger');
                err = true;
            }
        });
        cb(err);
    },
    loadSelectCourse: () => {
        if (credentials.rolename === 'Administrador') {
            var apiPath = '/api/courses';
        } else {
            var apiPath = '/api/courses/' + credentials.id + '/teacher';
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
                        .attr("value", item.id).attr('selected', 'selected').text(item.level_name + ' - ' + item.year));
                } else {
                    $select.append($("<option></option>")
                        .attr("value", item.id).text(item.level_name + ' - ' + item.year));
                }

            });
            $('#courses').selectpicker('refresh');
            if (parseInt(count) === 1) {
                controller.loadSelectLesson(data[0].id);
            }
        });
    },
    loadSelectLesson: (course) => {
        var userId = credentials.id;
        if (credentials.rolename === 'Administrador') {
            var apiPath = '/api/course_lesson/' + course + '/course/';
        } else {
            var apiPath = '/api/course_lesson/' + course + '/teacher/' + userId;
        }
        $.get(apiPath, function(data) {
            var count = data.length;
            var $select = $('#lesson');
            $select.empty();
            $select.append($("<option></option>")
                .attr("value", 0).text('- Seleccione -'));

            $.each(data, function(i, item) {
                if (parseInt(count) === 1) {
                    $select.append($("<option></option>")
                        .attr("value", item.id).attr('selected', 'selected').attr('data-semester', item.semester).text(item.lesson));
                } else {
                    $select.append($("<option></option>")
                        .attr("value", item.id).attr('data-semester', item.semester).text(item.lesson));
                }
            });
            $('#lesson').selectpicker('refresh');
            if (parseInt(count) === 1) {
                controller.loadStudents($('#courses').val());
            }
        });
    },
    loadStudents: (course, semester) => {
        $.get('/api/student/courses/' + course, function(students) {
            if (parseInt(semester) === 1) {
                $('.semester-name').text('Primer Semestre');
            } else if (parseInt(semester) === 2) {
                $('.semester-name').text('Segundo Semestre');
            } else {
                $('.semester-name').text('Asignatura finalizada!');
            }
            $('#close-semester').attr('data-semester', semester);
            $('#student-data').empty();
            var htmlHeader = '<tr>';
            htmlHeader += '<th>Alumno</th>';
            htmlHeader += '<th width="10%">Nota 1</th>';
            htmlHeader += '<th width="10%">Promedio</th>';
            htmlHeader += '</tr>';
            $('#headerGrades').html(htmlHeader);
            if (parseInt(semester) === 3) {
                $('#student-data').append('<tr><td class="text-center" colspan="3"><b style="color: red;">ASIGNATURA FINALIZADA, PARA VISUALIZAR NOTAS IR A REPORTES</b></td></tr>')
                $('#close-semester').addClass('hidden');
                $('#saveGrade').attr('disabled', 'disabled');
            } else {
                $.each(students, function(index, student) {
                    $('#student-data')
                        .append($('<tr></tr>')
                            .append($('<td></td>').attr('id', student.id).text((index + 1) + '.- ' + student.name))
                            .append($('<td></td>')
                                .append($('<input data-index="1" style="width: 100%" onChange="controller.handleChangeInput(this);" class="grade gradeToSave text-center" type="number" min="0" max="7" step="0.1" />')))
                            .append($('<td></td>')
                                .append($('<input class="average text-center" type="number" step="0.1" readonly />'))))
                });
            }
            $('.gradeToSave').click(function(event) {
                $(this).css('background', 'white');
            });
        });
    },
    loadStudentGrades: (obj, course) => {
        if (parseInt(obj.semester) === 1) {
            $('.semester-name').text('Primer Semestre');
        } else if (parseInt(obj.semester) === 2) {
            $('.semester-name').text('Segundo Semestre');
        } else {
            $('.semester-name').text('Primer Semestre');
            obj.semester = 1;
        }
        $('#close-semester').attr('data-semester', obj.semester);
        var htmlHeader = '<tr>';
        htmlHeader += '<th>Alumno</th>';
        for (var i = 0; i < (parseInt(obj.index) + 1); i++) {
            htmlHeader += '<th width="10%">Nota ' + (i + 1) + '</th>';
        }
        htmlHeader += '<th width="10%">Promedio</th>';
        htmlHeader += '</tr>';
        $('#headerGrades').html(htmlHeader);
        $.get('/api/student/courses/' + course, function(students) {
            var bodyStudent = '';
            $.each(students, function(index, student) {
                bodyStudent += '<tr>';
                bodyStudent += '<td id="' + student.id + '"> ' + (index + 1) + '.- ' + student.name + '</td>';
                var sum = 0,
                    factor = 0;
                for (var i = 0; i < parseInt(obj.index); i++) {

                    let grade = obj.grades[_.findKey(obj.grades, { 'student': student.id, index: (parseInt(i) + 1) })].grade;

                    if (parseFloat(grade) === 0) {

                        let gradeId = obj.grades[_.findKey(obj.grades, { 'student': student.id, index: (parseInt(i) + 1) })].id;
                        bodyStudent += '<td><input data-id="' + gradeId + '" class="grade gradeToUpdate" style="background: lavender;" type="number" step="0.1" value="' + grade + '" /></td>';
                    } else {
                        bodyStudent += '<td><input readonly class="grade gradeToShow" type="number" step="0.1" value="' + grade + '" /></td>';
                        sum = sum + parseFloat(grade);
                        factor++;
                    }
                }
                var avg = round((sum / factor), 1);
                bodyStudent += '<td><input data-index="' + (parseInt(obj.index) + 1) + '" style="width: 100%" class="grade gradeToSave" type="number" step="0.1" min="0" max="7" value="" /></td>';
                bodyStudent += '<td><input readonly class="average" type="number" step="0.1" value="' + avg + '" /></td>';
                bodyStudent += '</tr>';
            });
            $('#student-data').html(bodyStudent);
            $(':input[type="number"]').change(function(event) {
                controller.handleChangeInput(this);
            });
            $('.gradeToSave').click(function(event) {
                $(this).css('background', 'white');
            });
        });
    },
    handleChangeInput: (input) => {
        var sum = $(input).val() && parseFloat($(input).val()) !== 0 ? parseFloat($(input).val()) : 0; // Si viene vacio NOTA es igual a cero
        var factor = $(input).val() && parseFloat($(input).val()) !== 0 ? 1 : 0; // Si viene vacio FACTOR es igual a cero
        $(input).parent().siblings().children('.grade').each(function(index, el) {
            if ($(el).val()) {
                if (parseFloat($(el).val())) {
                    sum = sum + parseFloat($(el).val());
                    factor++;
                }
            }
        });
        if (sum === 0 && factor === 0) {
            var avg = '';
        } else {
            var avg = round(parseFloat(sum / factor), 1);
        }
        $(input).parent().siblings().children('.average').val(avg)
    }
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

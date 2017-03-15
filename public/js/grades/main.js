$(document).ready(function() {
    controller.loadSelectCourse();
    $('#lesson').selectpicker({
        liveSearch: true,
        maxOptions: 1,
        size: 10
    });
    $('#courses').selectpicker({
        liveSearch: true,
        maxOptions: 1,
        size: 10
    });
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        $('#lesson, #courses, #type').selectpicker('mobile');
    }
    $('#lesson, #type, #courses').on('show.bs.select', function(a) {
        $(this).selectpicker('setStyle', 'btn-danger', 'remove');
        $(this).selectpicker('refresh');
    });
    $('#courses').on('changed.bs.select', function() {
        $('#close-semester').removeClass('hidden');
        let course = $(this).val();
        controller.loadSelectLesson(course);
    });


    $('#lesson').on('changed.bs.select', function() {
        $('#close-semester').removeClass('hidden');
        let course = $('#courses').val();
        let course_lesson = $(this).val();
        let semester = $(this).find('option:selected').attr('data-semester');
        $.get('/api/course_lesson_grade/' + course_lesson + '/semester/' + semester, function(data) {
            if (data.index) {
                controller.loadStudentGrades(data, course);
            } else {
                controller.loadStudents(course, semester);
            }
        });
    });
    $('#saveGrade').click(function(event) {
        let semester = parseInt($('#close-semester').attr('data-semester'));
        var nullTextGrades = '',
            studentGrades = [],
            studentGradesUpdate = [],
            grade, student,
            allGradesEmpty = true,
            gradeUpdate = false;
        $('.gradeToSave').each(function(index, el) {
            if ($(el).val()) {
                allGradesEmpty = false;
            }
            grade = parseFloat($(el).val()) || 0;
            if (grade <= 0) {
                nullTextGrades = 'existen notas vacias, ';
            }
            student = parseInt($(el).parent().siblings().first().attr('id'));
            if (student) {
                studentGrades.push({ student, grade });
            }
        });
        $('.gradeToUpdate').each(function(index, el) {
            if (parseInt($(el).val()) !== 0 && $(el).val() !== '') {
                gradeUpdate = true;
                let gradeValue = parseFloat($(el).val());
                student = parseInt($(el).parent().siblings().first().attr('id'));
                var id = $(el).attr('data-id');
                if (student) {
                    studentGradesUpdate.push({ id, student, grade: gradeValue });
                }
            }
        });
        var goToSave = true;
        if (allGradesEmpty) {
            if (!gradeUpdate) {
                goToSave = false;
            }
        }
        if (goToSave) {
            controller.validate(function(err) {
                if (!err) {
                    x0p({
                        title: 'Ingreso de Notas',
                        text: 'Favor revisar información, ' + nullTextGrades + 'desea continuar?',
                        icon: 'warning',
                        animationType: 'fadeIn',
                        buttons: [{
                            type: 'cancel',
                            text: 'Cancelar',
                        }, {
                            type: 'info',
                            text: 'Continuar',
                            showLoading: true
                        }]
                    }).then(function(data) {
                        let semester = $('#close-semester').attr('data-semester');
                        if (data.button == 'info') {
                            let course_lesson = $('#lesson').val();
                            let date = moment().format('YYYY-MM-DD HH:mm:ss');
                            let teacher = credentials.id;
                            let grades = [];
                            $('.gradeToSave').each(function(index, el) {
                                let student = parseInt($(el).parent().siblings().first().attr('id'));
                                let grade = parseFloat($(el).val());
                                grade = grade || 0;
                                let indexGrade = parseInt($(el).attr('data-index'));
                                grades.push({ student, grade, index: indexGrade });
                            });
                            if (!allGradesEmpty) {
                                $.post('/api/course_lesson_grade', {
                                    course_lesson,
                                    teacher,
                                    semester,
                                    date,
                                    grades: JSON.stringify(grades)
                                }, function(data, textStatus, xhr) {
                                    if (gradeUpdate) {
                                        $.post('/api/course_lesson_grade/update/massive/', { grades: JSON.stringify(studentGradesUpdate) },
                                            function(data, textStatus, xhr) {
                                                x0p('Datos guardados', null, 'ok', false);
                                                $('#lesson').trigger('change');
                                            });
                                    } else {
                                        x0p('Datos guardados', null, 'ok', false);
                                        $('#lesson').trigger('change');
                                    }
                                });
                            } else {
                                if (gradeUpdate) {
                                    $.post('/api/course_lesson_grade/update/massive/', { grades: JSON.stringify(studentGradesUpdate) },
                                        function(data, textStatus, xhr) {
                                            x0p('Datos guardados', null, 'ok', false);
                                            $('#lesson').trigger('change');
                                        });
                                }
                            }
                        }
                    });
                }
            });
        } else {
            global.sendMessage('warning', 'No existen notas para ingtesar o actualizar!...');
        }
    });
    $('#close-semester').click(function(event) {
        let semester = parseInt($(this).attr('data-semester'));
        let course_lesson = $('#lesson').val();
        var gradeEmpty = false,
            errorMessage = '';
        $('.gradeToSave').each(function(index, el) {
            if ($(el).val()) {
                $(el).css('background', 'gold');
                gradeEmpty = true;
                errorMessage += '- Existen notas sin guardar!(en color amarillo) Revise su formulario...<br>';
            }
        });
        if (parseInt($('.gradeToShow').length) === 0) {
            gradeEmpty = true;
            errorMessage += '- Debe insertar al menos una nota! asegurese de guardar sus cambios...<br>';

        }
        if (parseInt($('.gradeToUpdate').length) > 0) {
            gradeEmpty = true;
            errorMessage += '- Existen notas pendientes (en color morado), completar los datos primero...<br>';

        }
        var titleMessage = '';
        if (!gradeEmpty) {
            if (semester === 1) {
                titleMessage = 'Cierre de Semestre';
            } else {
                titleMessage = 'Cierre de Año';
            }
            semester = semester + 1;
            x0p({
                title: titleMessage,
                text: 'Estos cambios no se podrán deshacer, desea continuar?',
                icon: 'warning',
                animationType: 'fadeIn',
                buttons: [{
                    type: 'cancel',
                    text: 'Cancelar',
                }, {
                    type: 'info',
                    text: 'Continuar',
                    showLoading: true
                }]
            }).then(function(data) {
                if (data.button == 'info') {
                    $.post('/api/course_lesson/close_semester/', {
                        semester,
                        course_lesson
                    }, function(data, textStatus, xhr) {
                        $('#saveGrade').attr('disabled', 'disabled');
                        $('#lesson').attr('disabled', 'disabled');
                        $('#courses').attr('disabled', 'disabled');
                        $('#close-semester').addClass('hidden');
                        $('#close-semester').attr('data-semester', semester);
                        $('.gradeToSave').each(function(index, el) {
                            $(el).parent().addClass('hidden');
                            $('#headerGrades').children().children().last().prev().addClass('hidden');
                        });
                        x0p('Semestre Cerrado', null, 'ok', false);
                    });
                }
            });
        } else {
            global.sendMessage('danger', errorMessage);
        }
    });
});

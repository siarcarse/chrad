$(document).ready(function() {
    controller.loadSelectCourse();
    $('.summernote').summernote({
        height: 200,
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']]
        ]
    });
    $('#type').selectpicker({
        maxOptions: 1,
        size: 4
    });
    $('#student').selectpicker({
        liveSearch: true,
        maxOptions: 1,
        size: 4
    });
    $('#courses').selectpicker({
        liveSearch: true,
        maxOptions: 1,
        size: 4
    });
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
        $('#student, #courses, #type').selectpicker('mobile');
    }
    $('#student, #type, #courses').on('show.bs.select', function(a) {
        $(this).selectpicker('setStyle', 'btn-danger', 'remove');
        $(this).selectpicker('refresh');
    });
    $('#courses').on('changed.bs.select', function() {
        let course_lesson = $(this).val();
        controller.loadSelectStudent(course_lesson);
    });
    $('#saveComment').click(function(event) {
        controller.validate(function(err) {
            if (!err) {
                let comment = $('.summernote').summernote('code');
                let course_lesson = $('#courses').val();
                let student = $('#student').val();
                let type = $('#type').val();
                let date = moment().format('YYYY-MM-DD HH:mm:ss');
                $.post('/api/person_comment', { comment, course_lesson, student, type, date, teacher: users_session }, function(data, textStatus, xhr) {
                    controller.loadSelectCourse();
                    $('.summernote').summernote('reset');
                    $('#type, #student').selectpicker('val', 0);
                    global.sendMessage('success', 'Anotación ingresada con éxito!');
                });
            }
        });
    });
});

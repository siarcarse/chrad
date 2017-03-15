let datatable = {};
$(document).ready(function() {
    let ajaxComplete = false;
    let year = parseInt(moment().format('YYYY'));
    datatable = $('#crud-grid').DataTable({
        "language": {
            "url": "/public/tools/DataTables/Spanish.json"
        },
        "ajax": {
            "url": "/api/course_lesson/0/course/",
            "dataSrc": "",
            "data": function(d) {
                ajaxComplete = true;
            }
        },
        "columns": [
            { "data": "id" },
            { "data": "lesson" },
            { "data": "course" },
            { "data": "year" },
            { "data": "teachers" },
            { "data": "schedule" }
        ],
        "responsive": true,
        "serverSide": false,
        "processing": true,
        "bFilter": true,
        "bInfo": false,
        "bLengthChange": true,
        "select": {
            style: 'single'
        },
        "createdRow": function(row, data, index) {
            if ($('td', row).last().prev().text() !== '') {
                if (parseInt(data.teachers) > 0) {
                    var className = 'success';
                } else {
                    var className = 'default';
                }
                var image = '<i class="fa fa-graduation-cap" aria-hidden="true"></i>';
                var button = "<button onclick='controller.loadTeacherInput(" + data.id + ", " + '"Profesores ' + data.lesson + ' ' + data.course + ' ' + data.year + '"' + ");' class='btn btn-" + className + "' data-toggle='modal' href='#assoc-modal'>" + image + "</button>";
                $('td', row).last().prev().addClass('text-center').html(button);
            }
            if ($('td', row).last().text() !== '') {
                if (parseInt(data.schedule) > 0) {
                    var className = 'success';
                } else {
                    var className = 'default';
                }
                var image = '<i class="fa fa-calendar-plus-o" aria-hidden="true"></i>';
                var button = "<button onclick='controller.loadScheduleInput(" + data.id + ", " + '"Horario ' + data.lesson + ' ' + data.course + ' ' + data.year + '"' + ");' class='btn btn-" + className + "' data-toggle='modal' href='#schedule-modal'>" + image + "</button>";
                $('td', row).last().addClass('text-center').html(button);
            }
        }
    });

});

let datatable = {};
$(document).ready(function() {
    let ajaxComplete = false;
    let year = parseInt(moment().format('YYYY'));
    datatable = $('#crud-grid').DataTable({
        "language": {
            "url": "/public/tools/DataTables/Spanish.json"
        },
        "ajax": {
            "url": "/api/courses/" + year + "/year",
            "dataSrc": "",
            "data": function(d) {
                ajaxComplete = true;
            }
        },
        "columns": [
            { "data": "id" },
            { "data": "level_name" },
            { "data": "year" },
            { "data": "lesson" },
            { "data": "student" }
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
                var image = '<i class="fa fa-book" aria-hidden="true"></i>';
                var button = "<button onclick='controller.loadTokenInput(" + data.id + ", " + '"' + data.level_name + '"' + ");' class='btn btn-info' data-toggle='modal' href='#assoc-modal'>" + image + "</button>";
                $('td', row).last().prev().addClass('text-center').html(button);
            }
            if ($('td', row).last().text() !== '') {
                var image = '<i class="fa fa-graduation-cap" aria-hidden="true"></i>';
                var button = "<button onclick='controller.loadStudentInput(" + data.id + ", " + '"Alumnos ' + data.level_name + ' ' + data.year +'"' + ");' class='btn btn-success' data-toggle='modal' href='#student-modal'>" + image + "</button>";
                $('td', row).last().addClass('text-center').html(button);
            }
        }
    });

});

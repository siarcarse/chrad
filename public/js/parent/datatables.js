let datatable = {};
$(document).ready(function() {
    let ajaxComplete = false;
    datatable = $('#crud-grid').DataTable({
        "language": {
            "url": "/public/tools/DataTables/Spanish.json"
        },
        "ajax": {
            "url": "/api/parent/",
            "dataSrc": "",
            "data": function(d) {
                ajaxComplete = true;
            }
        },
        "columns": [
            { "data": "name" },
            { "data": "lastname" },
            { "data": "rut" },
            { "data": "gender" },
            { "data": "birthdate" },
            { "data": "address" },
            { "data": "id_apoderado" }
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
            if ($('td', row).last().text() !== '') {
                var image = '<i class="fa fa-link" aria-hidden="true"></i>';
                var button = '<button onclick="controller.loadTokenInput(' + data.id + ');" class="btn btn-info" data-toggle="modal" href="#assoc-modal">' + image + '</button>';
                $('td', row).last().addClass('text-center').html(button);
            }
        }
    });

});

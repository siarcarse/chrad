let datatable = {};
$(document).ready(function() {
    let ajaxComplete = false;
    datatable = $('#crud-grid').DataTable({
        "language": {
            "url": "/public/tools/DataTables/Spanish.json"
        },
        "ajax": {
            "url": "/api/users/",
            "dataSrc": "",
            "data": function(d) {
                ajaxComplete = true;
            }
        },
        "columns": [
            { "data": "username" },
            { "data": "role_name" },
            { "data": "name" },
            { "data": "lastname" },
            { "data": "rut" },
            { "data": "mail" },
            { "data": "state" }
        ],
        "responsive": true,
        "serverSide": false,
        "processing": true,
        "bFilter": true,
        "bInfo": false,
        "bLengthChange": true,
        "select": {
            style: 'multi'
        }
    });

});

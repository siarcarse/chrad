let datatable = {};
$(document).ready(function() {
    let ajaxComplete = false;
    datatable = $('#crud-grid').DataTable({
        "language": {
            "url": "/public/tools/DataTables/Spanish.json"
        },
        "ajax": {
            "url": "/api/student/",
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
            { "data": "address" }
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

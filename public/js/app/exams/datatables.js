let datatable = {};
$(document).ready(function() {
    let ajaxComplete = false;
    datatable = $('#dTable').DataTable({
        "language": {
            "url": "/public/tools/DataTables/Spanish.json"
        },
        "ajax": {
            "url": "/api/studies/datatables/?idate=2017-03-26&fdate=2017-04-02",
            "dataSrc": "",
            "data": function(d) {
                ajaxComplete = true;
            }
        },
        "columns": [
            { "data": "pk" },
            { "data": "status", "class": "status" },
            { "data": "pat_name" },
            { "data": "study_datetime" },
            { "data": "study_desc" },
            { "data": "institution" },
            { "data": "imagenes" },
            { "data": "tiempo" },
            { "data": "mods_in_study" },
            { "data": "prioridad" },
            { "data": "chat" },
            { "data": "critico" }
        ],
        "responsive": true,
        "serverSide": false,
        "processing": true,
        "bFilter": true,
        "bDeferRender": true,
        "bInfo" : true,
        "bSort": false,
        "bAutoWidth": false,
        "aLengthMenu": [
            [10, 15, 20, 25, -1],
            [10, 15, 20, 25, "Todos"]
        ],
        "bLengthChange": true,
        /*"select": {
            style: 'none'
        },*/
        "createdRow": function(row, data, index) {
            var options = "";
            if (data.prioridad == '') options += '<option value="" selected="selected">Sin Prioridad</option>';
            else options += '<option value="">Sin Prioridad</option>';
            if (data.prioridad == 'Muy Urgente') options += '<option style="background-color:red;" value="Muy Urgente" selected="selected">Muy Urgente</option>';
            else options += '<option value="Muy Urgente">Muy Urgente</option>';
            if (data.prioridad == 'Urgente') options += '<option value="Urgente" selected="selected">Urgente</option>';
            else options += '<option value="Urgente">Urgente</option>';
            if (data.prioridad == '') options += '<option value="24 Hrs" selected="selected">24 Hrs</option>';
            else options += '<option value="24 Hrs">24 Hrs</option>';
            if (data.prioridad == 'Normal') options += '<option value="Normal" selected="selected">Normal</option>';
            else options += '<option value="Normal">Normal</option>';

            var selectPriority = '<select class="form-control input-sm" onchange="changePriority(this);">' + options + '</select>';
            if (data.critico == 'critico') {
                $(row).toggleClass('danger');
            }
            $('td:eq(9)', row).html(selectPriority);
            $('td', row).first().next().addClass('text-center'); // Centro el estado!!!

            /* INICIO ESTADOS*/
            if (parseInt(data.status) === 4) {
                $('td', row).first().next().html('<i class="fa fa-circle validated" aria-hidden="true"></i>');
            } else if (parseInt(data.status) === 0) {
                $('td', row).first().next().html('<i class="fa fa-circle unviewed" aria-hidden="true"></i>');
            } else if (parseInt(data.status) === 6) {
                $('td', row).first().next().html('<i class="fa fa-circle requested" aria-hidden="true"></i>');
            } else if (parseInt(data.status) === 7) {
                $('td', row).first().next().html('<i class="fa fa-circle in-process" aria-hidden="true"></i>');
            }
            /* FIN ESTADOS*/
            if (data.critico === 'critico') {
                $('td', row).last().next().html('<i class="fa fa-circle validated" aria-hidden="true"></i>');
            }
        }
    });

});

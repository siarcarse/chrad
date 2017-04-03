let datatable = {};
$(document).ready(function() {
    let ajaxComplete = false;
    let fDate = moment().format('YYYY-MM-DD');
    let iDate = moment().subtract(7, 'd').format('YYYY-MM-DD');
    datatable = $('#dTable').DataTable({
        "language": {
            "url": "/public/tools/DataTables/Spanish.json"
        },
        "ajax": {
            "url": `/api/studies/datatables/?idate=${iDate}&fdate=${fDate}`,
            "dataSrc": "",
            "data": function(d) {
                ajaxComplete = true;
            }
        },
        "columns": [
            { data: "pk" },
            { data: "status", "class": "status" },
            { data: "pat_name" },
            { data: "study_datetime" },
            { data: "study_desc" },
            { data: "institution" },
            { data: "imagenes" },
            { data: "tiempo" },
            { data: "mods_in_study" },
            { data: "prioridad" },
            { data: "chat" },
            { data: null, clasName: "not-desktop" }
        ],
        "responsive": true,
        responsive: {
            details: false
        },
        "serverSide": false,
        "processing": true,
        "bFilter": true,
        "bDeferRender": true,
        "bInfo": true,
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
            var options = "",
                chatIcon;
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
            $('td', row).last().addClass('text-center'); // Centro el Chat!!!

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

            /*DEFINE FONDO PARA CRITICOS*/
            if (data.critico === 'critico') {
                $('td', row).last().next().html('<i class="fa fa-circle validated" aria-hidden="true"></i>');
            }

            /*DEFINE ChatBox Icons*/
            var chatValue = data.chat || '';
            if (chatValue === '') {
                var num = 0;
                chatIcon = '<div data-toggle="modal" href="#chatBoxModal" class="chat-icon-container"><i class="fa fa-commenting fa-2x"></i></div>';
            } else if (chatValue.indexOf('unread') !== -1) {
                var num = chatValue.split('-')[0];
                chatIcon = `<div data-toggle="modal" href="#chatBoxModal" class="chat-icon-container"><i class="fa fa-commenting fa-2x validated"></i><span class="badge badge-notify chat-unread">${num}</span></div>`;
            } else if (chatValue.indexOf('read') !== -1) {
                var num = chatValue.split('-')[0];
                chatIcon = `<div data-toggle="modal" href="#chatBoxModal" class="chat-icon-container"><i class="fa fa-commenting fa-2x"></i><span class="badge badge-notify chat-read">${num}</span></div>`;
            }
            $('td', row).last().prev().html(chatIcon); // Add Icon to Comentarios

            /*Fin ChatBox Icns*/
            var actionsButton = `
            '<div class="btn-group">
                <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Acciones <span class="caret"></span></button>
                <ul style="left:-70%;" class="dropdown-menu pull-left" role="menu">
                    <li name="report"><a href="#">Informar</a></li>
                    <li id="view" name="view"><a href="#" onclick="test(this);">Ver</a></li>
                    <li><a href="#">Descargar</a></li><li><a href="#" Osirix</a></li>
                    <li class="divider"></li><li><a href="#">Comentarios (${num})</a></li>
                    <li name="info"><a href="#">Info Médica</a></li>
                    <li name="infoGral"><a href="#">Ingreso Información</a></li>
                </ul>
            </div>`;
            $('td', row).last().html(actionsButton); // Add Icon to Comentarios
        }
    });

});

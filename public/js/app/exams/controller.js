let controller = {
    searchDatatable: () => {
        let idate = $('#idate').val();
        let fdate = $('#fdate').val();
        if (idate && fdate) {
            datatable.ajax.url(`/api/studies/datatables/?idate=${idate}&fdate=${fdate}`).load(); //Reload DataTables :)
        }
    }
}

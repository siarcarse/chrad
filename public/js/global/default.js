const global = {
    sendMessage: (type, message) => {
        type = type ? type : 'primary';
        $.notify({
            // options
            message,
        }, {
            // settings
            type,
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            }
        });
    }
}

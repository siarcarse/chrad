$(document).ready(function() {
    $(".button-collapse").sideNav();
    $(".dropdown-button").dropdown();
    $('.comments').click(function(event) {
        let student = parseInt($(this).attr('data-child'));
        if(student) {
            controller.loadCommentStudent(student);
        }
    });
    $('.grades').click(function(event) {
        console.log($(this).attr('data-child'));
    });
});

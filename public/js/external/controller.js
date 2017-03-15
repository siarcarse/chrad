let controller = {
    loadCommentStudent: (student) => {
        var ulComments = '<h1>Anotaciones</h1>';
        ulComments += '<ul class="collapsible" data-collapsible="accordion">';
        $.get('/api/person_comment/' + student, function(comments) {
            if (comments.length > 0) {
                $.each(comments, function(index, comment) {
                    if (comment) {
                        if (comment.type === 'positiva') {
                            var icon = 'tag_faces';
                            var textType = 'Positiva';
                            var classText = 'teal-text';
                        } else {
                            var icon = 'mood_bad';
                            var textType = 'Negativa';
                            var classText = 'red-text';
                        }
                        ulComments += '<li>';
                        ulComments += '<div class="collapsible-header">';
                        ulComments += '<i class="material-icons ' + classText + '">' + icon + '</i>' + textType;
                        ulComments += '<label class="right">' + moment(comment.date).format('YYYY-MM-DD hh:mm:ss') + '</label>';
                        ulComments += '</div>';
                        ulComments += '<div class="collapsible-body">';
                        ulComments += '<p><b>Profesor: </b> ' + comment.teacher + '</p>';
                        ulComments += '<p><b>Curso/Asignatura: </b> ' + comment.course + ' - ' + comment.lesson + '</p>';
                        ulComments += '<p><b>Anotación: </b>' + comment.comment + '</p>';
                        ulComments += '</div>';
                        ulComments += '</li>';
                    }
                });
                ulComments += '</ul>';
                $('#main').html(ulComments);
                $('.collapsible').collapsible();
            } else {
                $('#main').html('<p>No Existen Anotaciones</p>');
            }
        });
    }
}

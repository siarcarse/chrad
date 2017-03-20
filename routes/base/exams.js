const examsRules = [{
    method: 'GET',
    path: '/exams',
    handler: (request, reply) => {
        reply.view('app/exams');
    }
}]
export default examsRules;

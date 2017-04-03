const reportRules = [{
    method: 'GET',
    path: '/report',
    handler: (request, reply) => {
        reply.view('app/report');
    }
}]
export default reportRules;

const Index = {
    method: ['GET', 'POST'],
    path: '/',
    config: {
        handler: function(request, reply) {
            var data = {
                title: 'Bienvenido!',
                message: '',
            };
            return reply.view('app/index');
        }
    }
};
const Public = {
    method: "GET",
    path: "/public/{path*}",
    config: { auth: false },
    handler: {
        directory: {
            path: "./public",
            listing: false,
            index: false
        }
    }
};
const rules = [].concat(
    Public,
    Index
);
export default rules;

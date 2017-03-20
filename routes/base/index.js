import apiRules from '../api/'
import examsRules from './exams'

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
    Index,
    examsRules,
    apiRules
);
export default rules;

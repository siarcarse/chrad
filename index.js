import Hapi from 'hapi';
import Inert from 'inert';
import Vision from 'vision';
import hapiAuthCookie from 'hapi-auth-cookie';
import handlebars from 'handlebars';
import extend from 'handlebars-extend-block';
import dotenv from 'dotenv';

import cookiePassword from './config/';
import routes from './routes/base'; //Import all routes
dotenv.load(); // Load .env file for evoriment vars

// add server’s connection information
const server = new Hapi.Server();
server.connection({
    host: '0.0.0.0',
    port: 3000
});

//Register plugins and configure
server.register([Vision,
    { register: hapiAuthCookie },
    { register:  Inert },
    { register: require('hapi-postgres-connection') }
], (err) => {
    if (err) {
        console.log('Failed to load module. ', err);
    }
    const cache = server.cache({ segment: 'sessions', expiresIn: 3 * 60 * 60 * 1000 });
    server.app.cache = cache;

    server.auth.strategy('session', 'cookie', false, {
        password: cookiePassword,
        cookie: 'sid-csm',
        redirectTo: '/login',
        isSecure: false,
        validateFunc: function(request, session, callback) {
            cache.get(session.sid, (err, cached) => {
                if (err) {
                    return callback(err, false);
                }
                if (!cached) {
                    return callback(null, false);
                }
                return callback(null, true, cached.account);
            });
        }
    });
});

// Charge ALL routes
server.route(routes);

server.views({
    engines: {
        html: {
            module: extend(handlebars),
            isCached: false
        }
    },
    path: 'views',
    layoutPath: 'views/layout',
    layout: 'default',
    helpersPath: 'views/helpers',
    partialsPath: 'views/partials'
});
// start your server
server.start((err) => {
    if (err) {
        throw err;
    }

    console.log('Server running at: ', server.info.uri);
});

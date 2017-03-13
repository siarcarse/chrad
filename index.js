import Hapi from 'hapi';

// create a server with a host and port
const server = new Hapi.Server();

// add server’s connection information
server.connection({
    host: '0.0.0.0',
    port: 3000
});

// add “hello world” route
server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        reply('Hello Future Studio!');
    }
});


// start your server
server.start((err) => {
    if (err) {
        throw err;
    }

    console.log('Server running at: ', server.info.uri);
});

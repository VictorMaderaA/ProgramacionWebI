const fs = require('fs');
let _server = null;

response = (code, headers, body) => {
    _server.send(code, headers, body);
}



getHandlers = (request) => {

    switch (request.path) {

        case '/':
            response(
                "200", {
                    "content-type": "text/html"
                },
                fs.readFileSync('./src/index.html')
            );
            break;
        case '/space-invaders':
            response(
                "200", {
                    "content-type": "text/html"
                },
                fs.readFileSync('./src/space-invaders.html')
            );
            break;
        case '/favicon.ico':
            response(
                "200", {
                    "content-type": "image/x-icon"
                },
                fs.readFileSync('./assets/favicon.ico')
            );
            break;
        default:
            response(
                404, {
                    "content-type": "text/html"
                },
                "The requested URL '" + request.path + "' was not found on this server."

            );
            break;
    }
}

postHandlers = (request) => {



}


reqHandler = (request, server) => {
    _server = server;

    switch (request.method) {
        case "GET": {
            getHandlers(request);
        }
        case "POST": {
            postHandlers(request);
        }
        default: {
            return response(
                404, {
                    "Content-Type": "text/plain"
                },
                "The server only supports HTTP methods GET and POST"
            );
        }
    }
}

module.exports = reqHandler;
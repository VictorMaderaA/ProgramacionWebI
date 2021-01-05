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
        default:
            headers = {};
            switch (request.path.split('.').pop()){
                case 'svg':
                    headers['content-type'] = 'image/svg+xml'
                    break;
                case 'ico':
                    headers['content-type'] = 'image/x-icon'
                    break;
                case 'webp':
                    headers['content-type'] = 'image/webp'
                    break;
                case 'png':
                    headers['content-type'] = 'image'
                    break;
                case 'jpeg':
                    headers['content-type'] = 'image/jpeg'
                    break;
                case 'css':
                    headers['content-type'] = 'text/css'
                    break;
                case 'js':
                    headers['content-type'] = 'text/javascript'
                    break;
            }
            response(
                200, headers,
                fs.readFileSync('.'+request.path)
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
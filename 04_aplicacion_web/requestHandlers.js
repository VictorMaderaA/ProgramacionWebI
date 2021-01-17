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
        case '/points':
            response(
                "200", {
                    "content-type": "text"
                },
                fs.readFileSync('./records').toString()
            );
            break;
        default:
            headers = {};
            switch (request.path.split('.').pop()) {
                case 'svg':
                    headers['content-type'] = 'image/svg+xml';
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
                fs.readFileSync('.' + request.path)
            );
            break;
    }
}

postHandlers = (request) => {

    switch (request.path) {
        case '/points':
            var d = new Date,
                dformat = [d.getMonth() + 1,
                        d.getDate(),
                        d.getFullYear()].join('/') + ' ' +
                    [d.getHours(),
                        d.getMinutes(),
                        d.getSeconds()].join(':');
            let f = fs.readFileSync('./records').toString() + dformat + " " + request.body + " " + request.headers['USER-AGENT'] + "\n";
            fs.writeFileSync('./records', f, function (err, data) {
                if (err) {
                    return console.error(err);
                }
                console.log(data);
            });
            response(
                "200", {
                    "content-type": "text"
                },
                fs.readFileSync('./records').toString()
            );
            break;
    }


}


reqHandler = (request, server) => {
    _server = server;

    switch (request.method) {
        case "GET": {
            getHandlers(request);
            break;
        }
        case "POST": {
            postHandlers(request);
            break;
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

function test() {

}

module.exports = reqHandler;
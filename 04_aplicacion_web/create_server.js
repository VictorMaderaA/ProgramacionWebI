const events = require("events");
const net = require("net");

const splitHeaders = (h) => {
  let data = new Object();
  h.split("\r\n").forEach(line => {
    let parts = line.split(": ");
    data[parts[0].toUpperCase()] = parts[1];
  });
  return data;
}

const request = () => {

  let request = new Object();
  request.method = null;
  request.body = null;
  request.path = null;
  request.headers = new Object();

  request.getHeader = (header) => request.headers[header.toUpperCase()] === undefined ? null : request.headers[header.toUpperCase()];
  request.setHeader = (key, val) => request.headers[key.toUpperCase()] = val;
  request.setHeaders = (obj) => request.headers = obj;

  return request;
};

const createServer = (requestHandler) => {

  const server = net.createServer(socket => {
    console.log('server connected');


    let segmentado = false;
    let req;
    socket.on('data', function (data) {
      let chunk = data.toString();

      let match = /[a-zA-Z]+ [\/\.a-zA-Z0-9\-]* HTTP\/1\.1/i.test(chunk);
      if (match) {
        //Creamos un nuevo request
        req = request();

        d_index = chunk.indexOf('\n\r');

        req.method = chunk.split(" ")[0];
        req.path = chunk.split(" ")[1];
        req.setHeaders(splitHeaders(chunk.substring(0, d_index - 1)));

        d_index += 3;
        if (req.getHeader('CONTENT-LENGTH') !== null) {
          req.body = chunk.substring(d_index, d_index + parseInt(req.getHeader('CONTENT-LENGTH')));
          if (req.body.length < req.getHeader('CONTENT-LENGTH')) {
            segmentado = true;
            return;
          }
        } else {
          req.body = chunk.substring(d_index, chunk.length);
        }
      } else if (segmentado) {
          console.log(2);
        req.body += chunk;
      }

      //llamamos a requestHandler y pasamos la peticion y el objeto con metodo send
      requestHandler(req, {

        //Metodo send que recibe el codigo de respuesta, objeto headers y el body de respuesta
        send: (code, headers, body) => {

          //Agregamos Headers de respuesta
          headers['Content-Length'] = body.length;
          headers['Date'] = (new Date()).toUTCString();

          //Escribimos que se trata de una respuesta HTTP con codigo x
          socket.write(`HTTP/1.1 ${code} CodeMessage\r\n`);

          //Escribimos los headers que tengamos 
          Object.entries(headers).forEach(([key, value]) => {
            socket.write(`${key}: ${value}\r\n`);
          });

          //Escribimos el contenido de la respuesta 
          socket.end(`\r\n${body}\r\n`);
          //Cerramos la conexion
          socket.destroy();
        }

      });


    });

    //Cuando ocurra algun error ejecutar esta parte
    socket.on('error', function (e) {
      //Si EADDRINUSE se vuelve a intentar 
      if (e.code == 'EADDRINUSE') {
        console.log('Address in use, retrying...');
        setTimeout(function () {
          socket.close();
          socket.listen(PORT, HOST);
        }, 1000);
      }
    });

    //Establecemos un tiempo maximo de espera timeout
    socket.setTimeout(1000);
    socket.on('timeout', () => {
      console.log('socket timeout');
      socket.end();
    });

    //Notificamos que la conexion termino 
    socket.on('end', function () {
      console.log('server disconnected');
    });

  });



  return {
    listen: (portNumber) => {
      console.log('opened server on http://localhost:' + portNumber);
      server.listen(portNumber);
    },
    close: () => {
      server.close();
    },
  };
};

module.exports = createServer;
const events = require("events");
const net = require("net");

//Separa los parametros de header y los guarda en un objeto que luego devuelve
const splitHeaders = (h) => {
  //Creamos el objeto que contendra los headers
  let data = new Object();
  //Separamos el texto por cada linea y recorremos los items
  h.split("\r\n").forEach(line => {
    //Separamos la linea en el key y el valor
    let parts = line.split(": ");
    //Guardamos en el objeto los valores obtenidos
    data[parts[0].toUpperCase()] = parts[1];
  });
  //Devolvemos los datos
  return data;
}

const request = () => {

  //Creamos el nuevo Objeto Request e inicializamos sus variables
  let request = new Object();
  request.method = null;
  request.body = null;
  request.path = null;
  request.headers = new Object();

  //Creamos el metodo getHeaders que devuelve un header establecido por un identificador
  //Si el header esta indefinido devolvemos null
  request.getHeader = (header) => request.headers[header.toUpperCase()] === undefined ? null : request.headers[header.toUpperCase()];

  //Creamos metodo que establece un header a un valor
  request.setHeader = (key, val) => request.headers[key.toUpperCase()] = val;

  //Creamos metodo que establece todos los headers del objeto
  request.setHeaders = (obj) => request.headers = obj;

  //devolvemos el objeto
  return request;
};

const createServer = (requestHandler) => {


  const server = net.createServer(socket => {
    console.log('server connected');


    let segmentado = false;
    let req;
    socket.on('data', function (data) {
      //Convertimos la peticion en formato string
      let chunk = data.toString();

      let match = /[a-zA-Z]+ \/[ a-zA-Z\/]* HTTP\/1\.1/i.test(chunk);
      if (match) {
        //Creamos un nuevo request
        req = request();

        //Obtenemos el punto de separacion entre headers y body
        d_index = chunk.indexOf('\n\r');

        //Obtenemos el tipo de Peticion que se realiza GET | POST y lo almacenamos en el request
        req.method = chunk.split(" ")[0];
        //Obtenemos la ruta de la peticion y lo almacenamos en el request
        req.path = chunk.split(" ")[1];
        //Obtenemos los headers de la peticion y los procesamos para convertirlos en objeto  y lo almacenamos en el request
        req.setHeaders(splitHeaders(chunk.substring(0, d_index - 1)));

        //Obtenemos el body de la peticion con Content-Length Comentado la otra opcion
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
        req.body += chunk;
      }

      // req.setHeader("Authorization", true);



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
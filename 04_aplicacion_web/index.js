const createServer = require("./create_server.js");
const reqHandler = require("./requestHandlers.js");


const requestListener = (request, response) => {

  if(request === undefined){
    return response.send(
      500,
      { "Content-Type": "text/plain" },
      "Server Error\nRequest Undefined"
    );
  }

  reqHandler(request, response);
};

const server = createServer((request, response) => {
  try {
    return requestListener(request, response);
  } catch (error) {
    console.error(error);
    response.send(500, { "Content-Type": "text/plain" }, "Uncaught error");
  }
});

server.listen(8080);

/*
 * Experiments with WHATWG URL API
 *
 */

// Dependencies
const http = require('http');
const { URL } = require('url');


// The server should respond to all requests with a string
const server = http.createServer( (req,res) => {

  // Show header info in console
  // console.dir(req.headers);

  // Figuring out the user:password URL details
  // ref: https://stackoverflow.com/questions/48196706/new-url-whatwg-url-api?noredirect=1
  // ref: https://github.com/JoshuaWise/request-target
  // ref: https://stackoverflow.com/questions/5951552/basic-http-authentication-in-node-js
  // test: curl "localhost:3000/fubar/showMe.aspx?checkName=check#hash"
  // test: curl "http://EarlFlynn:SwashBuckler@localhost:3000/abc/xyz?foo=bar&snide=sarcastic&Blackfly=eAirRiffic#hash"

  // Check for authorization header content
  function buildUri() {
    if (req.headers && req.headers.authorization) {
      const header=req.headers.authorization;
      const token=header.split(/\s+/).pop()||'';
      const auth = new Buffer.from(token, 'base64').toString();
      const parts=auth.split(/:/);
      const username=parts[0];
      const password=parts[1];
      console.log(`Auth info:
        username: ${username}
        password: ${password}`);
        return  `http://${username}:${password}@${req.headers.host}${req.url}`;
    }
    else {
      return `http://${req.headers.host}${req.url}`;
    }
  }

  // Get the URI
  const uri = buildUri();

  // Get the parsed URL
  const parsedURL = new URL(req.url, uri);

  // Get the path from the URL
  const path = parsedURL.pathname + parsedURL.search;

  // Send the response
  const parsedResponse = (`Hello, here are your request details:

  parsedURL.hash......: ${parsedURL.hash}
  parsedURL.host......: ${parsedURL.host}
  parsedURL.hostname..: ${parsedURL.hostname}
  parsedURL.href......: ${parsedURL.href}
  parsedURL.origin....: ${parsedURL.origin}
  parsedURL.password..: ${parsedURL.password}
  parsedURL.pathname..: ${parsedURL.pathname}
  parsedURL.port......: ${parsedURL.port}
  parsedURL.protocol..: ${parsedURL.protocol}
  parsedURL.search....: ${parsedURL.search}
  parsedURL.username..: ${parsedURL.username}
  parsedURL.toString(): ${parsedURL.toString()}\n`);

  // res.end(`Hello, your URL was: ${parsedURL.toString()}\n`);
  res.end(parsedResponse);

  // Log the request path

});

// Start the server and listen on port 3000
server.listen(3000, () => {
  console.log("The server is listening on port 3000 now");
});
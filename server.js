var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');


var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api-docs', express.static('api-docs'));


/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Microservice
 *     description: Check server status
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Server status
 */
app.get('/', function (req, res) {
    res.json({ status: "ready" })
});


/* Run the server. */
var server;

if (process.env.target == 'DEPLOY') {

	var https = require('https');
	var fs = require('fs');

	var options = {
	    key: fs.readFileSync('/etc/apache2/certs/www.usbpi.us.nopass.key'),
	    cert: fs.readFileSync('/etc/apache2/certs/www.usbpi.us.cer'),
	};

	server = https.createServer(options, app).listen(config.port || 8080, function(){
	  console.log("Express listening (SSL) on port " + config.port || 8080);
	});
} else {
	server = app.listen(config.port || 8080, function () {
	    var port = server.address().port;
	    console.log('Express listening at port %s', port);
	});
}

module.exports = server;



var swaggerJSDoc = require('swagger-jsdoc');


var swaggerDefinition = {
  info: {
    title: 'Express Starter',
    version: '0.0.1',
    description: 'A Node/Express template with Gulp and Jasmine and Swagger.',
  },
  host: (config.hostname || "localhost") +':'+ (config.port || 8080),
  basePath: '/',
};

var options = {
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./server.js'],
};

var swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

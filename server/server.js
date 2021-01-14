const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const graphBuilder = require ('./methods/graphBuilder.js');
const allNodesConstructor = require ('./methods/nodeConstructor.js');

const fs = require('fs');
const server = express();
//const port = 3003;
server.use(bodyParser.json());
server.use(cors());
const port = process.env.PORT || 1337

server.use(express.static(__dirname + '/../client'))
server.use(express.static(__dirname + '/../'))
server.use(express.static(__dirname + '/../methods'))
server.use(express.static(__dirname + '/../node_modules'))
server.use(express.static(__dirname + '/../assets'))

var allNodes = allNodesConstructor();



server.get('/', (req,res) => {
	res.send('Fart Pancake') 

	})

server.get(`/libraryContents`, (req, res) => {
	fs.readdir( __dirname + `/../assets/libraries/${req.headers[`library-name`]}`, function(err,files){
		res.send(files)	})
})

server.post(`/rex`, (req,res) => {
	graphBuilder.sayHello();
	res.send({node : 'donkey'})
})




server.listen(port, () => {
	console.log(`server listening at http://localhost:${port}`)
})




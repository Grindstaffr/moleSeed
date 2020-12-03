const express = require('express');
const pdfjsLib = require('pdfjs-dist/es5/build/pdf.js')
const bodyParser = require('body-parser');
const fs = require('fs');
const server = express();
const port = 3003;
server.use(bodyParser.json());

server.use(express.static(__dirname + '/../client'))
server.use(express.static(__dirname + '/../'))
server.use(express.static(__dirname + '/../methods'))
server.use(express.static(__dirname + '/../node_modules'))
server.use(express.static(__dirname + '/../assets'))



server.get('/', (req,res) => {
	res.send('Fart Pancake') 

	})




server.listen(port, () => {
	console.log(`server listening at http://localhost:${port}`)
})




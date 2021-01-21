/*
import { createRequire } from 'module'
import path  from 'path'
const require = createRequire(import.meta.url)

const moduleURL = new URL(import.meta.url);

console.log(`pathname ${moduleURL.pathname}`);
console.log(`dirname ${path.dirname(moduleURL.pathname)}`);
const __dirname = path.dirname(moduleURL.pathname);
*/
const defaultGraphModule = require('./methods/defaultGraph.js');
const defaultGraph = defaultGraphModule.defaultGraph;
//const cc = require('./methods/cardCatalogue');
const cardCatalogue = {
	addresses : {},
	addressCount : 0,
};

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const init = function () {
	fs.readdir(__dirname +` /../assets/libraries`, function(err, files){
		files.forEach(function(fileName){
			fs.readdir(__dirname + `/../assets/libraries/${fileName}`, function(err, libraryFiles){
				libraryFiles.forEach(function(lFileName){
					if (Object.values(cardCatalogue).includes(`../assets/libraries/${fileName}/${lFileName}`)){
						return;
					}
					cardCatalogue.addresses[`l${cardCatalogue.addressCount}`] = `../assets/libraries/${fileName}/${lFileName}`
					cardCatalogue.addressCount += 1;
				}, this)
			})
		}, this)
	});	
}
//const graphBuilder = require ('./methods/graphBuilder.js');
//const allNodesConstructor = require ('./methods/nodeConstructor.js');

const fs = require('fs');
const server = express();
//const port = 3003;
server.use(bodyParser.json());
server.use(cors());
const port = process.env.PORT || 1337

console.log(__dirname + '/../client')


server.use(express.static(__dirname + '/../'))
server.use(express.static(__dirname + '/../client'))
server.use(express.static(__dirname + '/../methods'))
server.use(express.static(__dirname + '/../node_modules'))
server.use(express.static(__dirname + '/../assets'))

//var allNodes = allNodesConstructor.constructAllNodes();


server.get('/', (req,res) => {
	res.send('fart pancake') 

})

server.get('/defaultGraph', (req,res) => {
	//console.log(req.headers['update-name'])

	var updateName = req.headers['update-name'];
	//console.log(defaultGraph)
	console.log(updateName)
	var defaultGraphtoRet = defaultGraph.getDefaultGraph(updateName)
	console.log(defaultGraphtoRet)
	res.send({ diff: defaultGraphtoRet })
})

server.get(`/libraryContents`, (req, res) => {
	fs.readdir( __dirname + `/../assets/libraries/${req.headers[`library-name`]}`, function(err,files){
		res.send(files)	})
});

server.get(`/libraryFileURL`, (req, res) => {
	console.log(`endpoint :: /libraryFileURL`)
	var libraryDataObject = {
		addresses : {},
		addressCount : 0,
	};
	var output = {
		lfurl : ''
	};
	if (cardCatalogue.addressCount >= 0){
		libraryDataObject = cardCatalogue;
	}

	console.log(`looking for ${req.headers['library-address']} in ${Object.keys(cardCatalogue.addresses)}`)
	
	if (Object.keys(cardCatalogue.addresses).includes(req.headers[`library-address`])){
		output.lfurl = cardCatalogue.addresses[req.headers[`library-address`]]
		res.send(output);
		return;
	}


	fs.readdir(__dirname +` /../assets/libraries`, function(err, files){
		console.log(files)
		files.forEach(function(fileName){
			fs.readdir(__dirname + `/../assets/libraries/${fileName}`, function(err, libraryFiles){
				console.log(libraryFiles)
				libraryFiles.forEach(function(lFileName){
					if (Object.values(cardCatalogue).includes(`../assets/libraries/${fileName}/${lFileName}`)){
						return;
					}
					cardCatalogue.addresses[`l${cardCatalogue.addressCount}`] = `../assets/libraries/${fileName}/${lFileName}`
					cardCatalogue.addressCount += 1;
				}, this)
				output.lfurl = cardCatalogue.addresses[req.headers[`library-address`]]
				console.log(output)
				res.send(output);
				console.log('ccAC : ' + cardCatalogue.addressCount)
			})
		}, this)
	});
});

server.get(`/libraryFileTrueAddress`, (req, res) => {
	console.log(`endpoint :: /libraryFileTrueAddress`)
	var libraryDataObject = {
		addresses : {},
		addressCount : 0,
	};
	var output = {
		truAddress : ''
	};
	if (cardCatalogue.addressCount >= 0){
		libraryDataObject = cardCatalogue;
	}
	console.log(`reqHeaders:: ${req.headers[`library-url`]}`)

	if (Object.values(cardCatalogue.addresses).includes(req.headers[`library-url`])){
		Object.keys(cardCatalogue.addresses).forEach(function(truAddress){
			if (output.truAddress.length > 1){
				return;
			}
			if (cardCatalogue.addresses[truAddress] === req.headers['library-url']){
				output.truAddress += truAddress;
			}
		}, this)
		if (output.truAddress === 'l'){
			output.truAddress === 'undefined'
		}
		res.send(output);
		return;
	}
	fs.readdir(__dirname +` /../assets/libraries`, function(err, files){
		console.log(files)
		files.forEach(function(fileName){
			fs.readdir(__dirname + `/../assets/libraries/${fileName}`, function(err, libraryFiles){
				libraryFiles.forEach(function(lFileName){
					if (Object.values(cardCatalogue).includes(`../assets/libraries/${fileName}/${lFileName}`)){
						return;
					}
					cardCatalogue.addresses[`l${cardCatalogue.addressCount}`] = `../assets/libraries/${fileName}/${lFileName}`
					if (cardCatalogue.addresses[`l${cardCatalogue.addressCount}`] === req.headers['library-url']){
						output.truAddress = `l${cardCatalogue.addressCount}`;
					}
					cardCatalogue.addressCount += 1;
				}, this)
				console.log(output)
				res.send(output);
				console.log('ccAC : ' + cardCatalogue.addressCount)
			})
		}, this)
	});
});

server.post(`/rex`, (req,res) => {
	//graphBuilder.sayHello();
	res.send({node : 'donkey'})
})

init();


server.listen(port, () => {
	console.log(`server listening at http://localhost:${port}`)
})




import { Writable, UserWritable, Directory, LibraryFile, Library, Hardware, QRig, Malware, Recruiter, Worm, initializerAlpha, Node, Pdf, Asset, Readable, TerminalStoryPiece, TextDoc, Mole, Program, UniqueNode, Databank, NodeNet } from './fileSystemDefinitions.js'
import { constructGraphStringParser } from './stringToGraphConverter.js'

export const bigBang = function () {
	const nodeVerse = {};
	nodeVerse.databanks = {};

	nodeVerse.allDataBanks = {};
	nodeVerse.allNodeNets = {};
	nodeVerse.allNodes = {};

	nodeVerse.graphCompiler = constructGraphStringParser(nodeVerse);

	nodeVerse.router = {};

	/*
	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		These update functions need to be plugged into the SAVE UI
		in editor.js.... somehow...
	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		Also, I've been mega lazy and have yet to actually tie any 
		node functions to persistent graphDiff changes
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		I have so much goddamn work to do
	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	*/
	nodeVerse.getKernelAccess = function () {
		return this.nodeAttachmentHandler;
	}
	nodeVerse.updateUserWritableNode = function(name,text,trueAddress){
		if (trueAddress[0] !== 'w'){
			console.warn(`old RAT left you a message:`)
			console.log(`wrong function... I think... this is for updating writables, as such true addresses should be formatted as 'w###'`)
			return;
		}
		if (this.allNodes[trueAddress]){
			if (this.allNodes[trueAddress].name !== name){
				this.allNodes[trueAddress].changeReferenceName(name);
			}
			if (this.allNodes[trueAddress].text !== text){
				this.allNodes[trueAddress].text = text;
			}
		} else {
			console.log(`....uh.... I thought this wasn't ever going to happen`)
		}
		var index = trueAddress.slice(1);
		this.saveFileManager.storeUserWritable(name, text, index);
	}

	nodeVerse.createUserWritableNode = function (name, text) {
		this.saveFileManager.storeUserWritable(name,text);
		var count = this.saveFileManager.getKeyValue('user_rdbl_count');
		var index = parseInt(count) - 1;
		if (Number.isNaN(index)){
			throw new Error(`cannot instantiate a new userNode while this shit is broken`)
		}
		var node = new UserWritable(nodeVerse.allNodes, name, false, text, index);
		return node;
	}

	nodeVerse.createUserWormTongueNode = function (name, text) {
		this.saveFileManager.storeUserWormTongue(name, text);
		var count = this.saveFileManager.getKeyValue('user_wmt_count');

		var index = parseInt(count) - 1;
		if (Number.isNaN(index)){
			throw new Error(`cannot instantiate a new userNode while this shit is broken`)
		};
		var node = new UserWormTongue(nodeVerse.allNodes, name, false, text, index);
		return node;
	}

	//also needs an update func

	nodeVerse.testGraphStringParser = function () {
		console.log(this)
		var testString = `$0#0[(a20)(a0=20)]%`
		this.updateGraph({ 'update-name' : 'tony'}, testString);
	}

	nodeVerse.updateGraph = function (params, diffString) {
		var nv = this;
		this.retrieveServerSideDiff(params, function(diff){
			console.log(diff)
			var newDiff = nv.graphCompiler.concatToString(diff, diffString);
			console.log(newDiff);
		})
	}

	nodeVerse.getDatabank = function (trueAddress){
		if (this.allDataBanks[trueAddress]){
			return this.allDataBanks[trueAddress];
		} else {
			console.log(`No databank found with trueAddress = ${trueAddress}`);
			return undefined;
		}
	}

	nodeVerse.getNodeNet = function (trueAddress){
		if (this.allNodeNets[trueAddress]){
			return this.allNodeNets[trueAddress];
		} else {
			console.log(`No nodeNet found with trueAddress = ${trueAddress}`);
			return undefined;
		}
	}

	nodeVerse.getNode = function (trueAddress, callback){
		var nv = this;
		const tAdd = trueAddress
		if (this.allNodes[trueAddress]){
			return this.allNodes[trueAddress];
		} else if (trueAddress[0] === 'l') {

			var reqHeaders = new Headers();
			reqHeaders.append('library-address',  trueAddress);
			var init = {
				headers : reqHeaders,
				method : 'GET',
			}
			let urlRequest = new Request('/libraryFileURL', init);
			fetch(urlRequest).then(function(response){
				if (!response.ok){
					throw new Error((`HTTP error! status: ${response.status}`))
				}
				return response.json()
			}).then(function(response){
				var url = response.lfurl;
				console.log(response.lfurl)
				import(url).then(function(module){
					var name = module.doc.name
					var newNode = new LibraryFile(nv.allNodes, name, 'xx', url, tAdd);
					console.log('A');
					if (callback){
						console.log('B');
						callback(newNode);
					}
					console.log('C');
					return newNode;
				}).catch(function (err){
					throw new Error(err)
				})
			}).catch(function (err){
				throw new Error(err)
			})
		} else if (trueAddress[0] === 'w'){
			var userWritableTrueAddress = trueAddress.substring(1);
			var values = this.saveFileManager.retrieveUserWritable(userWritableTrueAddress);
			var name = values.name;
			var text = values.text;

			var newNode = new UserWritable(nv.allNodes, name, false, text, userWritableTrueAddress)
			return newNode;

		} else if (trueAddress[0] === 'x') {
			var userWritableTrueAddress = trueAddress.substring(1);
			var values = this.saveFileManager.retrieveUserWormTongue(userWritableTrueAddress);
			var name = values.name;
			var text = values.text;

			var newNode = new UserWritable(nv.allNodes, name, false, text, index)
			return newNode;

		} else {
			console.log(`No node found with trueAddress = ${tAdd}`);
			return undefined;
		}
	}

	nodeVerse.retrieveServerSideDiff = function (params, callback) {
		var reqHeaders = new Headers();
		if (params && typeof params === 'object'){
			Object.keys(params).forEach(function(key){
				reqHeaders.append(key, params[key])
			},this)
		};
		var init = {
			headers : reqHeaders,
			method : 'GET'
		}
		let graphDiffRequest = new Request('/defaultGraph', init);
		fetch(graphDiffRequest).then(function(response) {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		})
		.then(function(response) {
			if (callback){
				if (typeof callback === 'function'){
					callback(response.diff)
				}
			}
			console.log(response)
		}).catch(function(err){
			console.log(err);
		});
	}

	nodeVerse.findNodesByName = function (nodeName, exactBool) {
		console.warn('findNodesByName func now deprecated')
		//NOW DEPRECATED I'D BET
		//DepthFirst Traverse, collecting all nodes where name = nodeName, and returning their TRUEADDRESSES in an array;
		var returnArray = [];
		Object.keys(this.router).forEach(function(databankAddress){
			Object.keys(this.router[databankAddress]).forEach(function(nodeNetAddress){
				Object.keys(this.router[databankAddress][nodeNetAddress]).forEach(function(nodeAddress){
					var node = this.router[databankAddress][nodeNetAddress][nodeAddress];
					if (node.name === nodeName && exactBool){
						var truAddress = node.getTrueAddress();
						returnArray.push(truAddress);
						return;
					} else if (!exactBool && (node.name.includes(nodeName) || nodeName.includes(node.name))){
						var truAddress = node.getTrueAddress();
						returnArray.push(truAddress);
						return;
					}
				},this)
			},this)
		},this)
		return returnArray;
	};

	nodeVerse.appendDataBank = function (databank) {
		nodeVerse.databanks[databank.name] = databank;
		nodeVerse.router[databank.address] = {};
		Object.defineProperty(databank, '_meta', {
			value : this,
			writable : false,
		})
	}

	nodeVerse.getDefaultNode = function () {
		return this.router[`dz019q$$tajz>`][`%81jan222jn*=`][`8i7eu6p!y3jigc1mw`]
	}


	const _PioneerDataServices = new Databank(nodeVerse.allDataBanks,`_PioneerDataServices`,`PDS_p9.34.00`, `dz019q$$tajz>`)
	nodeVerse.appendDataBank(_PioneerDataServices);
	/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!
		DATABANK :: _PioneerDataServices NODENET:: __toaster
		!!!!!!!!!!!!!!!!!!!!!!!!!!!

	*/
	const __toaster = new NodeNet(nodeVerse.allNodeNets, `__toaster`,`%81jan222jn*=`);
	nodeVerse.databanks._PioneerDataServices.addNodeNet(__toaster)
	nodeVerse.databanks._PioneerDataServices.nodeNets.__toaster.init = function () {
		const seed = new Node(nodeVerse.allNodes,'seed', `8i7e36p!y9jig21mw`);
		this.addNode(seed);

		const biblio = new Program(nodeVerse.allNodes,`biblio.ext`, `usi8p6diw<82ihv37`, `./biblio.js`);
		this.addNode(biblio);

		const caravanLibrary = new Library(nodeVerse.allNodes,`moleSeed_docs`, `d%*a%611!c&tr\"inj`, `../assets/libraries/moleSeed_docs`)
		this.addNode(caravanLibrary);

		const reader_ext = new Program(nodeVerse.allNodes,'reader.ext', `a+zya0wtbd&e2fs%o`, './reader.js')
		this.addNode(reader_ext);

		const welcome = new TextDoc(nodeVerse.allNodes,'welcome', `=%zp5pszgciq<6sce`,'../assets/txtFiles/intro.js',);		
		this.addNode(welcome);

		const sample = new TextDoc(nodeVerse.allNodes,'sample',`0&tbiiz4pu1>t657v`, '../assets/txtFiles/sampleTxt.js')
		this.addNode(sample);

		const main_dir = new Directory(nodeVerse.allNodes,'main',`muflds0?&n*$r5?3e`, '../assets/txtFiles/toasterDirectory.js');
		this.addNode(main_dir);

		const admin_dir = new Directory(nodeVerse.allNodes,'00CE6._x172', false);
		this.addNode(admin_dir);

		const rucksack_dir = new Directory(nodeVerse.allNodes,'rucksack',`7k>g+wo\"?jz$e7p&<`);
		this.addNode(rucksack_dir);

		const rucksack_ext = new Program(nodeVerse.allNodes,'rucksack.ext',`hqch4+?u\"auwujxra`, './rucksack.js');
		this.addNode(rucksack_ext);

		const rucksack_rdbl = new TextDoc(nodeVerse.allNodes,'rucksack.rdbl', `3\"nbb$j\"jwkx!*4<&`, '../assets/txtFiles/rucksack.js');
		this.addNode(rucksack_rdbl);

		const crawler_dir = new Node(nodeVerse.allNodes,'crawler', `$ufcw&$miw2aui8=>`);
		this.addNode(crawler_dir);

		const crawler_ext = new Program(nodeVerse.allNodes,'crawler.mse', `bl&<d0vqfkq42jn<3`, `./crawler.js`);
		this.addNode(crawler_ext);

		const crawler_rdbl = new TextDoc(nodeVerse.allNodes,'crawler.rdbl', `=ye42z=ww39kikqat`, '../assets/txtFiles/crawler.js');
		this.addNode(crawler_rdbl);

		const moveHere = new Node(nodeVerse.allNodes,'move_here', `*r#!jo>nbhk?>!mgw`);
		this.addNode(moveHere);

		const moveHereNext = new Node(nodeVerse.allNodes,'move_here_next', `0hjn?&w?n#onkbk$j`);
		this.addNode(moveHereNext);

		const nomad_dir = new Directory(nodeVerse.allNodes,'mole', `4qb1927k+4c*?zwz3`)
		this.addNode(nomad_dir);

		const nomad_rdbl = new TextDoc(nodeVerse.allNodes,'nomad.rdbl', `*ga#hxf$+9nf$qa?$`, '../assets/txtFiles/nomad.js');
		this.addNode(nomad_rdbl);

		const nomad_mole = new Mole(nodeVerse.allNodes,'nomad.mole', `n<*c0!pxvhp%0d\"rs`, './nomad.js')
		this.addNode(nomad_mole);

		const welcomeV2 = new TextDoc(nodeVerse.allNodes,'welcome_update', `8=4f#9>3n\"y!=3$i2`,'../assets/txtFiles/MXthumbIntro.js')
		this.addNode(welcomeV2);

		const read_this = new TextDoc(nodeVerse.allNodes,'read_this', false, '../assets/txtFiles/firstRead.js');
		this.addNode(read_this);

		const now_read_this = new TextDoc(nodeVerse.allNodes,'now_read_this', false, '../assets/txtFiles/secondRead.js')
		this.addNode(now_read_this);

		const that = new TextDoc(nodeVerse.allNodes,'that', false, '../assets/txtFiles/thirdRead.js')
		this.addNode(that);

		const uniquekey = new TextDoc(nodeVerse.allNodes,'unique_key', false, `../assets/txtFiles/uniquekey.js`);
		this.addNode(uniquekey);

		const cordyceps = new Recruiter(nodeVerse.allNodes,'cordyceps.msh', false,'./cordyceps.js');
		this.addNode(cordyceps);

		const pegleg = new Recruiter(nodeVerse.allNodes,'pegleg.yaar', false,'./pegleg.js');
		this.addNode(pegleg);

		const silo_ext = new Program(nodeVerse.allNodes,'silo.ext','bxbljs00\"3p&*z\"yi' ,'./silo.js')
		this.addNode(silo_ext);

		const there = new Node(nodeVerse.allNodes,'there', false);
		this.addNode(there);

		const tonysIbsQ19 = new QRig(nodeVerse.allNodes,`tonys_IBS_Q19`, 'c6#!k%uvo3yg$<lcx','./wallysIbsQ19.js');
		this.addNode(tonysIbsQ19);

		
		const help = new Node(nodeVerse.allNodes,'help')
		this.addNode(help)
		const oops = new Node(nodeVerse.allNodes,'I_made_a_mistake');
		this.addNode(oops)
		const oops2 = new Node(nodeVerse.allNodes,'I_overwrote_my_only_moleware');
		this.addNode(oops2)
		const oops3 = new Node(nodeVerse.allNodes,'CaN_I_hAve_a_nEw_1?');
		this.addNode(oops3)

		const nomad_mole_2 = new Mole(nodeVerse.allNodes,'nomad.mole', `n<*c0!pxvhp%0d\"rs`, './nomad.js');
		this.addNode(nomad_mole);

		const editor_ext = new Program(nodeVerse.allNodes, 'editor.ext', false, './editor.js');
		this.addNode(editor_ext)



		this.seed.attach(admin_dir);
		this.seed.attach(rucksack_ext);
		admin_dir.attach(rucksack_ext);nodeVerse,
		admin_dir.attach(reader_ext);
		admin_dir.attach(nomad_mole);
		admin_dir.attach(silo_ext);
		admin_dir.attach(cordyceps);
		admin_dir.attach(pegleg);
		admin_dir.attach(crawler_ext);

		
		seed.attach(caravanLibrary);
		seed.attach(biblio);
		seed.attach(reader_ext);
		seed.attach(welcome);
		seed.attach(welcomeV2);
		seed.attach(tonysIbsQ19);
		seed.attach(silo_ext);
		seed.attach(cordyceps)
		seed.attach(editor_ext);
		

		this.seed.attachTo(moveHere);

		this.move_here.attach(read_this);
		this.move_here.attachTo(there);

		this.there.attach(reader_ext);
		this.there.attach(now_read_this);
		this.there.attach(that);
		this.there.attachTo(main_dir);

		main_dir.attach(welcome);
		main_dir.attach(welcomeV2);
		main_dir.attach(rucksack_dir);
		main_dir.attach(nomad_dir);
		main_dir.attach(uniquekey);
		main_dir.attach(help);

		help.attach(oops);
		oops.attach(oops2);
		oops2.attach(oops3);
		oops3.attach(nomad_mole_2);
		oops3.attachTo(main_dir);

		nomad_dir.attach(nomad_rdbl);
		nomad_dir.attach(nomad_mole);

		rucksack_dir.attach(rucksack_ext);
		rucksack_dir.attach(rucksack_rdbl);

		/*
		this.move_here_next.attachTo(welcome);
		this.welcome.attach(main_dir);
		this.main.attach(welcomeV2);
		this.main.attach(rucksack_dir);
		this.rucksack.attach(rucksack_ext);
		this.rucksack.attach(rucksack_rdbl);
		this.main.attach(crawler_dir);
		this.crawler.attach(crawler_ext);
		this.crawler.attach(crawler_rdbl);
		this.main.attach(nomad_dir);
		this.mole.attach(nomad_rdbl);
		this.mole.attach(nomad_mole);
		*/


	};
	nodeVerse.databanks._PioneerDataServices.nodeNets.__toaster.init();


	const __caravan = new NodeNet(nodeVerse.allNodeNets, `__caravan`);
	nodeVerse.databanks._PioneerDataServices.addNodeNet(__caravan);
	nodeVerse.databanks._PioneerDataServices.nodeNets.__caravan.init = function (){

		const portOfArrival = new Node(nodeVerse.allNodes,'caravan_entrance');
		this.addNode(portOfArrival);

		const seed = new Node(nodeVerse.allNodes,'seed')
		this.addNode(seed);

		const welcome = new TextDoc(nodeVerse.allNodes,'welcome', `*431hsa&cgciq>5tdi`,'../assets/txtFiles/intro.js');
		this.addNode(welcome);

		const dir = new Directory(nodeVerse.allNodes,'dir', false);
		this.addNode(dir);

		const biblio = new Program(nodeVerse.allNodes,`biblio.ext`, `usi8p6diw<82ihv37`, `./biblio.js`);
		this.addNode(biblio);

		const caravanLibrary = new Library(nodeVerse.allNodes,`moleSeed_docs`, false, `../assets/libraries/moleSeed_docs`)
		this.addNode(caravanLibrary);

		const newUserRepo_dir = new Directory(nodeVerse.allNodes,'new_user_repo', false);
		newUserRepo_dir.encrypt(7,`v9d%00&5k24`)
		this.addNode(newUserRepo_dir);

		const tonysIbsQ19 = new QRig(nodeVerse.allNodes,`tonys_IBS_Q19`, 'c6#!k%uvo3yg$<lcx','./wallysIbsQ19.js');
		this.addNode(tonysIbsQ19);

		const cordyceps = new Recruiter(nodeVerse.allNodes,'cordyceps.msh', false, './cordyceps.js');
		this.addNode(cordyceps);

		const pegleg = new Recruiter(nodeVerse.allNodes,'pegleg.yaar', false, './pegleg.js');
		this.addNode(pegleg)

		const silo_ext = new Program(nodeVerse.allNodes,'silo.ext','bxbljs00\"3p&*z\"yi' ,'./silo.js')
		this.addNode(silo_ext)

		const demoMessage = new TextDoc(nodeVerse.allNodes,'please_read_this', false, '../assets/txtFiles/demoCompleted.js')
		this.addNode(demoMessage);

		const nurSilo_doc = new TextDoc(nodeVerse.allNodes,'silo.rdbl', false, '../assets/txtFiles/silo.js')
		this.addNode(nurSilo_doc);

		const nurBiblio_doc = new TextDoc(nodeVerse.allNodes,'biblio.rdbl', false, '../assets/txtFiles/biblio.js')
		this.addNode(nurBiblio_doc);

		const gate = new Node(nodeVerse.allNodes,'portcullis', false)
		gate.encrypt(7, 'password=password')
		this.addNode(gate);

		const testNode = new Node(nodeVerse.allNodes, 'testNode', false)

		portOfArrival.attach(dir);

		dir.attach(newUserRepo_dir);
		dir.attach(tonysIbsQ19);
		dir.attach(gate);
		dir.attach(caravanLibrary);
		dir.attach(welcome);

		newUserRepo_dir.attach(cordyceps);
		newUserRepo_dir.attach(pegleg);
		newUserRepo_dir.attach(silo_ext);
		newUserRepo_dir.attach(nurSilo_doc);
		newUserRepo_dir.attach(biblio);
		newUserRepo_dir.attach(nurBiblio_doc);
		
		gate.attach(demoMessage);

	};
	nodeVerse.databanks._PioneerDataServices.nodeNets.__caravan.init();

	/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!
		DATABANK :::: _caravan
		!!!!!!!!!!!!!!!!!!!!!!!!!!!

	*/
	nodeVerse.databanks._caravan = new Databank(nodeVerse.allDataBanks,`_caravan`);
	nodeVerse.databanks._caravan.init = function () {

	};
	nodeVerse.databanks._caravan.init();

	/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!
		DATABANK :::: _cyber_kinetics
		!!!!!!!!!!!!!!!!!!!!!!!!!!!

	*/
	nodeVerse.databanks._cyber_kinetics = new Databank(nodeVerse.allDataBanks,`_cyber_kinetics`);
	nodeVerse.databanks._cyber_kinetics.init = function () {

	};
	nodeVerse.databanks._cyber_kinetics.init();

	/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!
		DATABANK :::: _ASTRL
		!!!!!!!!!!!!!!!!!!!!!!!!!!!

	*/
	nodeVerse.databanks._ASTRL = new Databank(nodeVerse.allDataBanks,`_ASTRL`);
	nodeVerse.databanks._ASTRL.init = function () {

	};
	nodeVerse.databanks._ASTRL.init();

	/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!
		DATABANK :::: _CleanSpace
		!!!!!!!!!!!!!!!!!!!!!!!!!!!

	*/
	nodeVerse.databanks._CleanSpace = new Databank(nodeVerse.allDataBanks,`_CleanSpace`);
	nodeVerse.databanks._CleanSpace.init = function () {

	};
	nodeVerse.databanks._CleanSpace.init();

	/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!
		DATABANK :::: _4M
		!!!!!!!!!!!!!!!!!!!!!!!!!!!

	*/
	nodeVerse.databanks._4M = new Databank(nodeVerse.allDataBanks,`_4M`);
	nodeVerse.databanks._4M.init = function () {

	};
	nodeVerse.databanks._4M.init();


	nodeVerse.databanks._NationalPatriotServerSolutions = new Databank(nodeVerse.allDataBanks,`_NationalPatriotServerSolutions`)

	const init = function () {
		Object.keys(nodeVerse).forEach(function(key){
			if (typeof nodeVerse[key] === 'function'){
				if (key === 'testGraphStringParser'){
					console.log(key)
				}
				nodeVerse[key] = nodeVerse[key].bind(nodeVerse);
			}
		})
	};
	init();
	nodeVerse.testGraphStringParser();
	return nodeVerse

}
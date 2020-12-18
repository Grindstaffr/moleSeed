import { addressGenerator } from './addressGenerator.js';
import { base49Map, reverseBase49Map } from './addressGenerator.js';


export class Node {
	constructor(name, address){
		this.Type = 'node';
		this.type = 'node';
		this.name = name;
		if (!address){
			address = addressGenerator(17)
		}
		this.address = Node.setAddress(address);
		console.log
		this.synonyms = Node.generateSynonyms(name);
		this.adjacencies = {};
		this.visibleAdjacencies = {};
		this.canOpen = false;
		this.isInvisible = false;
		this.visited = false;
		this.requirements = [];
		this.commands = ['mv'];
		this.triggerOnGrab = false;
		this.grabbable = true;
		this.recruitable = false;
		this.moveTriggeredFunctions = [];
	};

	static defaultFileExtension = "";
	static lastAddress = -1;
	static setAddress (address) {
		if (!address){
			this.lastAddress = this.lastAddress + 1;
			return this.lastAddress;
		}
		this.lastAddress = this.lastAddress + 1;

		var disguise = this.lastAddress + 7821

		var num_2 = Math.floor(disguise/2401);
		var num_1 = Math.floor(((disguise % 2401)/49));
		var num_0 = (disguise % 49);

		var val_0 = base49Map[num_0];
		var val_1 = base49Map[num_1];
		var val_2 = base49Map[num_2];

		address = address.substring(0,4) + val_0 + address.substring(5);
		address = address.substring(0,13) + val_1 + address.substring(14);
		address = address.substring(0,9) + val_2 + address.substring(10);

		return address;
	}

	static generateSynonyms (name){
		
		
		const synArray = [];
		//push name w or w/o file extensions
		synArray.push(name)
		if (name.split('.')[0] !== name){
			synArray.push(name.split('.')[0])
		}

		//push names missing a character?
		var prevLetter = "";
		for (var i = 0; i < (name.length - 1); i ++){
			var clone = name;
			if (clone[i] === prevLetter){
				continue;
			}
			prevLetter = clone[i]
			synArray.push(clone.substring(0,i) + clone.substring(i+1)); 
			if (i ===( name.length - 2)){
				synArray.push(clone.substring(0,i +1))
			}
		}

		synArray.forEach(function(value, index){
			if (!synArray.includes(value.toLowerCase())){
				synArray.push(value.toLowerCase())
			}
		}, this)



		return synArray
	}

	getTrueAddress () {
		var val_0 = this.address[4];
		var val_1 = this.address[13];
		var val_2 = this.address[9];

		var num_0 = reverseBase49Map[val_0];
		var num_1 = reverseBase49Map[val_1];
		var num_2 = reverseBase49Map[val_2];

		var decVal_0 = num_0;
		var decVal_1 = num_1 * 49;
		var decVal_2 = num_2 * 2401;

		return (decVal_2 + decVal_1 + decVal_0 - 7821);
	}

	triggerOnMove (context, lastNode) {
		if (this.moveTriggeredFunctions.length === 0){
			return;
		}
		this.moveTriggeredFunctions.forEach(function(func){
			if (typeof func !== 'function'){
				return;
			}
			func(context, lastNode);
		}, this)
	}

	setURL (url) {
		this.url = url;
	}

	encrypt(level, password, cracks){
		this.Type = `encrypted`;
		this.isEncrypted = true;
		this.encryptionData = {
			password : password,
			level : level,
			guessAgainDeclined : false,
			keyHoleCracks : cracks,
		}
		this.moveTriggeredFunctions.push(this.setAPI.bind(this))
		this.moveTriggeredFunctions.push(this.encryptionBarrier.bind(this));
	}

	encryptionBarrier(context, lastNode){
		var node = this;
		var lastNode = lastNode
		this.api.requestInput(function(commandFull){
			var keyCode = commandFull.split(" ")[0]
			if (keyCode === node.encryptionData.password){
				node.api.log(' ')
				node.api.log(` :: KEYCODE CORRECT :: `)
				return;
			} else {
				node.api.log(' ')
				node.api.log(` :: KEYCODE INCORRECT ::`)
				node.api.verifyCommand(`try again? `, function (bool) {
					if (!bool){
						node.encryptionData.guessAgainDeclined = true;
						node.api.executeCommand('mv', lastNode.name, true, lastNode)
						return;
					} else {
						return;
					}
				})
				/*
				if (node.encryptionData.guessAgainDeclined){
					node.encryptionData.guessAgainDeclined = false;
					node.api.executeCommand('mv', lastNode.name, true, lastNode)
				}
				*/
			}
		}, ` :: AUTHORIZATION REQUIRED :: ENTER KEYCODE : `)
	}

	setAPI(context){
		this.api = context.api;
		return;
	}

	detachFromAll (type) {
		//console.log(`jettisoning node`)
		if (!type){
			for (var nodeName in this.adjacencies){
				
				delete this.adjacencies[nodeName].adjacencies[this.name]
				delete this.adjacencies[nodeName].visibleAdjacencies[this.name]
				delete this.adjacencies[nodeName]
				delete this.visibleAdjacencies[nodeName]
			};
		} else {
			for (var nodeName in this.adjacencies){
				if (this.adjacencies[nodeName].type === type){
					delete this.adjacencies[nodeName].adjacencies[this.name]
					delete this.adjacencies[nodeName].visibleAdjacencies[this.name]
					delete this.adjacencies[nodeName]
					delete this.visibleAdjacencies[nodeName]
				}
			}
		}

		this.assembleVisibleAdjacencies();
		
	}
	attach(obj){
		this.adjacencies[obj.name] = obj;
		obj.adjacencies[this.name] = this;
	}

	attachTo(obj){
		this.adjacencies[obj.name] = obj;
	}

	detach(name){
		delete this.adjacencies[name];
	}

	assembleVisibleAdjacencies(){
		for (var nodeName in this.adjacencies){
			if (this.adjacencies[nodeName].isInvisible){
				for (var detachedNodeName in this.adjacencies[nodeName].adjacencies){
					this.visibleAdjacencies[detachedNodeName] = this.adjacencies[nodeName]
				}
			} else {
				this.visibleAdjacencies[nodeName] = this.adjacencies[nodeName]
			}
		}
		this.visibleAdjacencies[this.name] = this;
		return this.visibleAdjacencies;
	}

	hitchPacket(){
		return this._meta;
	}

	report() {
		return this.visited;
	}
};

export class Library extends Node {
	constructor (name, address, directoryUrl){

		super(name, address);
		this.directoryUrl = directoryUrl;
		this.assembleRepository = this.assembleRepository.bind(this)
		this.isLoaded = false;
		this.repository = {};
		this.files =  [];
		this.type = `library`;
		this.Type = `library`;
		this.grabbable = false;
		this.recruitable = false;
		this.readyToAcceptCommands = true;
		this.censoredTerms = ['SWARM','phoenix','SWARM/phoenix'];
		this.renderTrigger = function () {};
		this.assemblerTrigger = function () {};
		this.triggerOnReady = function () {};
		
		
	}
	setTriggerOnReady (func) {
		if (typeof func !== 'function'){
			console.log(`cannot setTriggerOnReady to a non-function (Library -- fileSystemDefinitions.js)`)
			return;
		}
		this.triggerOnReady = func;
	}
	setAssemblerTrigger (func) {
		if (typeof func !== 'function'){
			console.log(`cannot setAssemblerTrigger to a non-function (Library -- fileSystemDefinitions.js)`)
			return;
		}
		this.assemblerTrigger = func
	} 

	setRenderTrigger (func) {
		if (typeof func !== 'function'){
			console.log(`cannot setRenderTrigger to a non-function (Library -- fileSystemDefinitions.js)`)
			return;
		}
		this.renderTrigger = func;
	}

	censorTerm(string){
		this.censoredTerms.push(string);
	}

	checkCensorStatus (string) {
		this.censoredTerms.forEach(function(censoredTerm){
			if (censoredTerm.includes(string)){
				return true;
			}
		})
		return (!this.censoredTerms.indexOf(string) === -1)
	}

	powerDown () {
		this.detachAllFiles();
		this.freeRepo();
		this.setRenderTrigger(function(){});
		this.setAssemblerTrigger(function(){});
	}
	

	detachAllFiles() {
		Object.keys(this.adjacencies).forEach(function(adjacentNodeName){
			if (this.adjacencies[adjacentNodeName].type === `library_file`){
				this.adjacencies[adjacentNodeName].detachFromAll();
			}
		}, this)
	}

	freeRepo () {
		this.repository = {};
		return;
	}

	getFile (fileName) {

		this.detachAllFiles();
		if (!this.repository[fileName]){
			this.api.throwError(`No file found with name ${fileName}`)
			return { type : 'null' };
		}
		if (this.checkCensorStatus(fileName)){
			return { type : 'null'};
		}
		const file = new LibraryFile(`${fileName}`, `xx` ,`../assets/libraries/${this.name}/${this.repository[fileName].url}`)
		this.attach(file)
		return file
	}

	declareApi(api){
		this.api = api
	}

	fetchRepository () {
		
		this.waitingScreen();
		const library = this;
		const headers = new Headers();
		headers.append(`Library-Name`,`${this.name}`)
		const requestObject = {
			method : `GET`,
			headers : headers,
		}
		const repoRequest = new Request('/libraryContents', requestObject)
		
		fetch(repoRequest).then(function(response){
			response.json().then(function(data){
				library.files = data;
				library.isLoaded = true;
				library.assembleRepository();
			})
		})

	}

	searchRepository (string, options) {
		const library = this;
		if (!options){
			options = {};
			options.noPartialMatches = true;
			options.quickSearch = false;
			options.matchCase = false;
		}
		if (this.checkCensorStatus(string)){
			return[];
		}
		const eliminateDuplicates = function (searchTerm, array){
			if (array.indexOf(searchTerm) !== array.lastIndexOf(searchTerm)){
				array.splice(array.indexOf(searchTerm), 1)
				return eliminateDuplicates(searchTerm, array)
			}
			return array
		}
		
		const terminatingCharacters = [" ", ",", ".", "?", "!", ";", ":", ")", "(", "/"]
		this.waitingScreen();
		const outputArray = [];
		if (options.quickSearch){
			Object.keys(this.repository).forEach(function(fileName){
				if (this.repository[fileName].text.toLowerCase().includes(string.toLowerCase())){
					outputArray.push(fileName);
					return;
				}
		
			},this)
			library.searchComplete = true;
			return outputArray;
		}

		var firstCap = string.substring(0,1).toUpperCase() + string.substring(1)
		var allLow = string.toLowerCase();
		var allUpp = string.toUpperCase();

		var checkArray = [string, firstCap, allLow, allUpp];

		if (options.matchCase){
			checkArray = [string];
		}

		if (options.noPartialMatches) {
			var newCheckArray = [];
			terminatingCharacters.forEach(function(terminatingCharacter){
				checkArray.forEach(function(str){
					newCheckArray.push(" " + str + terminatingCharacter)
				})
			})
			checkArray = newCheckArray;
		}
		checkArray.forEach(function(searchTerm){
			eliminateDuplicates(searchTerm, checkArray)
		})
		Object.keys(this.repository).forEach(function(fileName){
			 return checkArray.forEach(function(searchTerm){
					if (this.repository[fileName].text.includes(searchTerm)){
						outputArray.push(fileName);
						return;
					}
			}, this)
		},this)
		outputArray.forEach(function(fileName, index){
			if (outputArray.indexOf(fileName) !== outputArray.lastIndexOf(fileName)){
				outputArray.splice(index, 1);
			}
			if (outputArray.indexOf(fileName) !== index){
				outputArray.splice(index, 1)
			}
		})
		outputArray.forEach(function(fileName, index){
			eliminateDuplicates(fileName, outputArray)
		})
		library.searchComplete = true;
		return outputArray;

	}

	assembleRepository () {
		var library = this;
		this.files.forEach(function(fileName, index){
			import(`../assets/libraries/${library.name}/${fileName}`).then(function(module){
				library.repository[module.doc.name] = module.doc;
				library.repository[module.doc.name].url = fileName
				if (index === library.files.length -1){
					library.lastFileLoaded = true;
					library.assemblerTrigger();
				}
			})
		})
	}

	waitingScreen(){
		var library = this;
		library.readyToAcceptCommands = false;


		
		const animFrames = {};
		animFrames.frame_0 = {
			row_1 : "loa",
			row_2 : "  d",
			row_3 : "gni"
		};
		animFrames.frame_1 = {
			row_1 : "oad",
			row_2 : "l i",
			row_3 : " gn"
		};
		animFrames.frame_2 = {
			row_1 : "adi",
			row_2 : "o n",
			row_3 : "l g"
		};		
		animFrames.frame_3 = {
			row_1 : "din",
			row_2 : "a g",
			row_3 : "ol "
		};
		animFrames.frame_4 = {
			row_1 : "ing",
			row_2 : "d  ",
			row_3 : "aol"
		};
		animFrames.frame_5 = {
			row_1 : "ng ",
			row_2 : "i l",
			row_3 : "dao"
		};		
		animFrames.frame_6 = {
			row_1 : "g l",
			row_2 : "n o",
			row_3 : "ida"
		};
		animFrames.frame_7 = {
			row_1 : " lo",
			row_2 : "g  a",
			row_3 : "nid"
		};

		const loop = function (value) {
			
			library.api.clearReservedRows();
			if (library.lastFileLoaded) {
				library.lastFileLoaded = false;
				stopWaiting();
				return;
			}
			if (library.shouldStop) {
				library.shouldStop = false;
				stopWaiting();
				return;
			}
			if (library.searchComplete) {
				library.searchComplete = false;
				stopWaiting();
				return;
			};

			var hSpacing = Math.floor(((library.api.getRowCount())-3)/2)
			var vSpacing = Math.floor(((library.api.getReservedRowCount())-3)/2)

			library.api.writeToGivenRow((" ").repeat(hSpacing) + animFrames[`frame_${value}`][`row_1`], vSpacing)
			library.api.writeToGivenRow((" ").repeat(hSpacing) +animFrames[`frame_${value}`][`row_2`], vSpacing + 1)
			library.api.writeToGivenRow((" ").repeat(hSpacing) +animFrames[`frame_${value}`][`row_3`], vSpacing + 2)

			var newValue = value % 8;
			setTimeout(function () {loop(newValue)}, 150)
		};

		const stopWaiting = function () {
			
			library.readyToAcceptCommands = true;
			library.api.clearReservedRows();
			library.renderTrigger();
			library.triggerOnReady();
			
		};
		
		loop(0);
		
	}

}

export class Program extends Node {
	constructor (name, address, url) {
		super(name, address);
		this.type = 'program';
		this.url = url;
		this.hasBeenInstalled = false;
		this.isNodelet = true;
		this.commands.push('install')
	}
	install(callback){
		var program = this;
		if (this.hasBeenInstalled){
			callback(program.program);
		} else {
			import(this.url).then(function(module){
				callback(module.program)
				program.program = module.program;
				program.hasBeenInstalled = true;
				program.commands[program.commands.indexOf('install')] = 'ex';
			})
		}
	}
	ex(){
		this.program.ex();
	}
	stop(){
		this.program.stop();
	}
}
export class Hardware extends Node {
	constructor (name, address, url){
		super(name, address);
		this.grabbable = false;
		this.recruitable = true;
		this.type = 'hardware'
		this.Type = 'hardware'
		this.url = url;
		this.methods = {};
		this.methods.unlink = {
			name : `unlink`,
			desc : `unlink linked hardware`,
			syntax : `unlink`,
			ex : function () {
				this.jettison();
			},
		}
		this.methods.recruit = {
			name : `recruit`,
			desc : `declare linked hardware to operate terminal commands on declared hardware`,
			syntax : `recruit [HARDWARE] ...`,
			ex : function (hardwareName, command, commandArg, commandArg2){
				if (!command){

					this.api.extendCommand() //(input?)
					return;
				}
				var hardware = this;
				var linkedHardware = this.siloApi.getLinkedHardware();
				if (hardwareName !== linkedHardware.name){
					this.api.throwError(`cannot access non-linked hardware. ${linkedHardware.name} is currently linked`);
					return;
				}
				if (!linkedHardware){
					this.api.throwError(`no link detected. "recruit" syntax requires harware-to-terminal link`)
					return;
				}
				var hdwrCommand = linkedHardware.methods.hardwareCommands[command]
				if (!hdwrCommand){
					this.api.throwError(`declared hardware does not support ${command}, try "recruit ${hardware.name} help"`)
					return;
				}
				hdwrCommand.ex(commandArg, commandArg2);

			}
		};
		this.methods.hardwareCommands  = {};
		this.methods.hardwareCommands.help = {
			name : 'help',
			desc : 'list available commands for declared hardware',
			syntax : `recruit [HARDWARE] help`,
			ex : function () {
				var hCmd = this.methods.hardwareCommands;
				this.api.writeLine("")
				this.api.writeLine(` --- listing available commands for ${this.name} with descriptions ---  `)
				this.api.writeLine("");
				this.api.writeLine("");
				Object.keys(hCmd).forEach(function(commandName){
					var name = hCmd[commandName].name
					var desc = hCmd[commandName].desc
					var line = (" ") + name + (" ").repeat(8 - name.length) + (": ") + desc
					this.api.writeLine(line)
					this.api.writeLine("");
				},this)
			}
		}
		this.methods.hardwareCommands.info = {
			name : `info`,
			desc : `display information for declared hardware`,
			syntax : `recruit [HARDWARE] info`,
			ex : function () {
				this.api.writeLine("");
				this.api.writeLine( ` ::: specs for ${this.name} ::: `);
				this.api.writeLine("");
				Object.keys(this.specs).forEach(function(key){
					if (typeof this.specs[key] === "string"){
						var key = key;
						var data = this.specs[key];
						var line = key + " : " + data;
						this.api.composeText(line, true);
					}
				}, this);
				this.api.writeLine("")
			} 
		}
		this.link = this.link.bind(this);
	}

	getSpecs (callback) {
		var hardware = this;
		import(this.url).then(function(hardwareDataMod){
				hardware.specs = hardwareDataMod.hardware
			if (callback){
				callback(hardwareDataMod);
			}
		});
	}

	bindAll (context) {
		Object.keys(context.methods.hardwareCommands).forEach(function(commandName){
			context.methods.hardwareCommands[commandName].ex = context.methods.hardwareCommands[commandName].ex.bind(context)
		}, context);
	}

	link (siloApi, api) {
		this.siloApi = siloApi;
		this.api = api;
		this.bindAll(this);
		Object.keys(this.methods).forEach(function(commandName){
			if (commandName === 'hardwareCommands'){
				return;
			}
			this.methods[commandName].ex = this.methods[commandName].ex.bind(this);
		}, this);
		this.api.addCommand(this.methods.unlink);
		this.api.addCommand(this.methods.recruit);
	}

	jettison () {
		this.api.deleteCommand(`unlink`);
		this.api.deleteCommand(`recruit`);
		this.siloApi.clearDataAfterLinkExpires();
		this.api.clearReservedRows();
		this.api.reserveRows(0);
	}


}

export class ProcessorMatrix extends Hardware {

}

export class QRig extends Hardware {
	constructor (name, address, url){
		super(name, address, url)
		this.type = `Q-Rig`
		this.methods.hardwareCommands.bf = {
			name : 'bf',
			desc : 'brute force an encrypted node',
			syntax : `bf [NODE]`,
			verificationCheckCrypt : false,
			verificationCheckShors : false,
			doShors : false,
			verificationCheckNokhanyo : false,
			doNokhanyo: false,
			verificationCheck : false,
			ex : function (nodeName){
				if (!nodeName){
					this.api.throwError(`brute force requires a node as a target... try "recruit [hardware] bf [target]"`);
					return;
				}
				var target = this.api.getAccessibleNodes()[nodeName];
				var qRig = this;
				var skip = false;
				var ver = qRig.methods.hardwareCommands.bf
				if (target.Type !== 'encrypted' && !ver.verificationCheckCrypt){
					this.api.warn(`node not encrypted. BF call is a waste of time and electricity`);
					this.api.verifyCommand('Waste time and electricity? ',function(bool){
						if (!bool){
							return;
						}
						ver.verificationCheckCrypt = true;
						skip = true;
					})
					return;
				}
				// this.api.log(`  decryptor   `)
				if (!ver.verificationCheckShors){
					this.api.verifyCommand(` Start with Coast's Algorithm? `, function (bool, toggle) {
						if (!bool) {
							ver.doShors = false;
						} else if (bool) {
							ver.doShors = true;
						}
						
						toggle.toggle = true;
						
						ver.verificationCheckShors = true;
					})
					return;
				}
				if (ver.verificationCheckShors && ver.doShors) {
					if (target.encryptionData.encryptionLevel > 1200) {
						this.api.log(`target using non-classical encryption methods, try Nokhanyos`)
						return;
					}
					this.methods.coasts.ex()
					this.api.writeLine(`${target.encryptionData.password}`)
				}
				if (!skip){
					if (this.specs.qubits >= target.encryptionData.level){
						for (var i = 0; i < this.specs.qubits; i ++){
							for (var j = 0; j < target.encryptionData.level; j ++){
								this.api.writeLine(addressGenerator(target.encryptionData.password.length + 10))
							}
						}
						this.api.writeLine(`${target.encryptionData.password}`)
						
					}
				}
			}

		}
		this.methods.coasts = {
			ex : function (encryptionLevel) {
				this.api.log(`barfCOPTER`)
				//program a visualizer for Shors here.

			}
		}
		this.methods.nokhanyos = {
			ex : function () {
				//program a visualizer for Nokhanyos' here

			}
		}
		this.methods.glooblop = {
			ex : function () {
				//first : rename to something a SWARM/phoenix user would call themself...
				//then : program a visualizer
			}
		}
	}

}


export class UniqueNode extends Node {
	constructor (...args) {
		super(...args);
		this.isUnique = true;
		this.triggerOnGrab = true;
		this.storageLoc = {};
		this.methods = {}
		this.methods.use = {
			name : 'use',
			desc : 'use an expendible node',
			syntax : 'use [NODE]',
			isSilent : true,
			usedBy : 0,
			ex : function (nodeName) {
				
				if (!this.storageLoc.container){
					this.detachFromAll();
					return;
				}
				this.storageLoc.container[this.storageLoc.index] = {name : `[EMPTY SLOT]`}
				for (var property in this.methods){
					this.api.decrementCommandUsedBy(property);
					if (this.api.getCommandUsedBy(property) === 0){
						this.api.deleteCommand(property);
					}
				}
				this.storageLoc.refresh();
			}
		}
		this.methods.use.ex = this.methods.use.ex.bind(this);
		this.grabTrigger = this.grabTrigger.bind(this);
	}
	grabTrigger(terminal, storageLoc, refreshFunc){
		
		this.trmnl = terminal;
		this.api = this.trmnl.api;
		this.storageLoc.container = storageLoc
		this.storageLoc.index = storageLoc.indexOf(this)
		this.storageLoc.refresh = refreshFunc
		if (this.name === this.trmnl.activeNode.name){
			this.api.composeText(`WARNING: terminal is instanced on a non-duplicable node, grabbing this node will pull the terminal into rucksack.ext`)
			//should throw a verify for grab with above message;
		}
		super.detachFromAll();
		this.trmnl.activeNode.assembleVisibleAdjacencies();
		for (var property in this.methods){
			if (!this.api.commandExistenceCheck(property)){
				if (this.methods[property].isSilent){
					this.api.addSilentCommand(this.methods[property])
				} else {
					this.api.addCommand(this.methods[property])
				}
			}
			this.api.incrementCommandUsedBy(property);
		}
	}
};
export class Malware extends UniqueNode {
	constructor (name, address, url){
		super(name);
		this.url = url;
		this.name = name;
		this.address = `FUCK YOURSELF`
		this.Type = `malware`
	}

	adjacencyTrigger () {
		this.api = terminal.api
	}

	ex (trmnl) {
		this.api = trmnl.api
		var malware = this;
		import(this.url).then(function(module){
			malware.exAnim = module.recruiter.exAnim.bind(malware);
			malware.exAnim(malware.api);
			malware.methods.use.ex();
		})
	}

	anim_stealMiddle (size) {

	}
}

export class Worm extends Malware {
	constructor (name, url) {
		super(name);
		this.url = url;
		this.type = 'worm'
	};

	//WORMS WILL BE NECESSARY FOR SCOUTING UNMAPPED MEMORY
	//NON-DEMO CLASS
	grabTrigger (terminal, storageLoc, refreshFunc) {
		var worm = this;
		worm.terminal = this;
		worm.api = worm.terminal.api;
		var superGrabber = super.grabTrigger;
		if (!terminal.programs[`silo.ext`]){
			this.api.throwError(`rucksack.ext does not support fileType:${worm.type} without an extension`)
		}
		import(this.url).then(function(module){
			if (callback){
				callback(module.recruiter)
			};
			superGrabber.call(worm, terminal, storageLoc, refreshFunc);
		})
	};
};


export class Recruiter extends Malware {
	constructor (name, url){
		super(name, 'FUCKYOU',url);
		this.siloApi = {};
		this.isSupported = false;
		this.isArmed = false;
		this.type = 'recruiter'
		this.methods.arm = {
			name : `arm`,
			desc : `arm a recruiter`,
			syntax : `arm [RECRUITER]`,
			ex : function (recruiterName) {
				var recruiter = this.api.getAccessibleNodes()[recruiterName]
				if (!recruiter.isSupported){
					this.api.throwError(`MIRAGE: "arm" not supported (missing dependencies)`)
					return;
				}
				this.siloApi.armRecruiter(recruiter);

			},
		};
		this.methods.trgt = {
			name : `trgt`,
			desc : `target adjacent hardware with an armed recruiter`,
			syntax : `trgt [HARDWARE]`,
			ex: function (hardwareName) {
				if (!this.isSupported){
					this.api.throwError(`MIRAGE: "trgt" not supported (missing dependencies)`)
					return;
				}
				this.siloApi.targetHardware(hardwareName)

			},

		}
		this.methods.fire = {
			name : `fire`,
			desc : `fire an armed recruiter at targeted hardware`,
			syntax : `fire [RECRUITER]`,
			isExtendable : true,
			verificationCheckA : false,
			verificationCheckB : false,
			verificationCheckC : false,
			ex: function (recruiterName) {
				var rctr = this;
				var recruiter = this.api.getAccessibleNodes()[recruiterName];
				if (!recruiter.isSupported){
					this.api.throwError(`MIRAGE: "fire" not supported (missing dependencies)`)
					return;
				};
				if (recruiterName !== this.siloApi.getArmedRecruiterName()){
					this.api.throwError(`${this.siloApi.getArmedRecruiterName()} is armed. Cannot fire a different recruiter`);
					return;
				};
				if (!recruiter.isArmed){
					this.api.throwError(`${recruiter.name} unarmed... cannot fire an unarmed recruiter`);
				}
				var launchControl = recruiter.methods.fire;
				if (!launchControl.verificationCheckA){
					this.api.verifyCommand(`armed recruiter: ${recruiter.name}, targeted hardware: ${rctr.siloApi.getTargetedHardwareName()}, confirm? `,function(bool){
						if (!bool){
							return;
						}
						launchControl.verificationCheckA = true;
						rctr.api.log(``)
					});
					return;
				};
				if (!launchControl.verificationCheckB){
					this.api.verifyCommand(`Use of recruiter-Ware is prohibited by the fucking cops and shit... Continue? `,function(bool){
						if (!bool){
							return;
						}
						launchControl.verificationCheckB = true;
						rctr.api.log(``)
					});
					return;
				}
				if (!launchControl.verificationCheckC){
					this.api.verifyCommand(`Instance of ${recruiter.name} is single-use... fire command will expend usage. Continue?`,function(bool){
						if (!bool){
							return;
						}
						launchControl.verificationCheckC = true;
						rctr.api.log(``)
					});
					return;
				}

				launchControl.verificationCheckA = false; 		
				launchControl.verificationCheckB = false;				
				launchControl.verificationCheckC = false;		
				this.siloApi.launchRecruiter(recruiter);

			},
		};
		var rctr = this;
		//console.log(this.url)
		import(url).then(function(module){
		//	console.log(module.recruiter)
			rctr.trolls = module.recruiter.trolls 
		});
	};
	grabTrigger (terminal, storageLoc, refreshFunc, callback) {

		var rctr = this;
		rctr.terminal = terminal;
		rctr.api = rctr.terminal.api;
		
		var superGrabber = super.grabTrigger;
		if (!terminal.programs[`silo.ext`]){
			this.api.warn(`rucksack.ext does not support fileType:${this.type} without an extension`);
			this.api.log(`...grabbing anyway`);
			this.installSiloTrigger();
		} else {
			this.isSupported = true;
			rctr.siloApi = terminal.programs[`silo.ext`].methods.siloApi
		}
		import(this.url).then(function(module){
			if (callback){
				callback(module.recruiter)
			};
			var recruiter = module.recruiter
			rctr.effectiveness = recruiter.effectiveness;
			rctr.slowness = recruiter.slowness;
			rctr.crackingAbil = recruiter.crackingAbil;
			rctr.recruitAnim = recruiter.recruitAnim;
			rctr.failureAnim = recruiter.failureAnim;
			superGrabber.call(rctr, terminal, storageLoc, refreshFunc);
			rctr.methods.arm.ex = rctr.methods.arm.ex.bind(rctr)	
			rctr.methods.trgt.ex = rctr.methods.trgt.ex.bind(rctr)	
			rctr.methods.fire.ex = rctr.methods.fire.ex.bind(rctr)

			if (rctr.api.checkRucksackRunning()){
				rctr.api.reRenderRucksack(true)
			}
						
		})
	};

	arm () {
		this.isArmed = true;
	}

	installSiloTrigger () {
		var rctr = this;
		this.api.addInstallTrigger(function(program){
			if (program.name === 'silo.ext'){
				rctr.isSupported = true;
				rctr.siloApi = program.methods.siloApi;
				return;
			};
			return;
		}, `${this.name}_silo`)

	};

};

export class Seed extends UniqueNode {
	constructor (name) {
		super(name);
		this.methods.plant = {
			name : 'plant',
			desc : 'plant a seed to recursively construct a node network',
			syntax : 'plant [SEED] in [HOLE]',
			usedBy : 0,
			ex : function () {

			}

		}
	}
};

export class Mole extends UniqueNode {
	constructor (name, address, url){
		super(name, address);
		this.url = url;
		this.type = 'mole';
		this.canBeRead = true;
		this.moleCommands = {};
		this.methods.mole = {
			name : 'mole',
			desc : 'declare mole-ware to utilize actions specific to declared .mole program',
			syntax : `mole [MOLE] ...`,
			recentlyVerified : false,
			ex: function (moleName, command, commandArg, commandArg2) {
				if (!command){
					//THIS STAYS UNTIL THERE'S A MULTILINE INPUT BUFFER,
					//AT WHICH POINT, YOU CAN USE THIS TO FILL THE BUFFER WITH CORRECT MOLE OR W/E
					//Good Example code for this can now be found in biblio.js (under biblio)
					this.api.throwError(`mole-ware declaration should be followed by command`);
					return;
				}
				var mole = this;
				if (!this.trmnl.accessibleNodes[moleName]){
					this.api.throwError('declared mole-ware not currently accessible.')
					return;
				}

				if (!this.trmnl.accessibleNodes[moleName].moleCommands[command]){
					this.api.throwError(`declared mole-ware does not support "${command}", try "mole ${moleName} help"`)
					return;
				}

				if (this.trmnl.accessibleNodes[moleName].moleCommands[command].requiresVerification && (!this.methods.mole.recentlyVerified)){
					this.api.verifyCommand('command will expend mole. continue? ', function(bool){
						if (!bool){
							return;
						};
						mole.methods.mole.recentlyVerified = true;
					})
					return;
				}
				if (this.trmnl.accessibleNodes[moleName].moleCommands[command].requiresVerification && (this.methods.mole.recentlyVerified)){
					this.methods.mole.recentlyVerified = false;
				};
				this.trmnl.accessibleNodes[moleName].moleCommands[command].ex(commandArg, commandArg2);
			},
		};
		this.moleCommands.help = {
			name : 'help',
			desc : 'list available commands for declared mole-ware',
			syntax : 'mole [MOLE] help',
			ex: function () {
				var mCmd = this.moleCommands;
				this.api.writeLine("");
				this.api.writeLine(` --- listing available commands for ${this.name} with descriptions ---  `)
				this.api.writeLine("");
				this.api.writeLine("");
				Object.keys(mCmd).forEach(function(commandName){
					var name = mCmd[commandName].name
					var desc = mCmd[commandName].desc
					var line = (" ") + name + (" ").repeat(8 - name.length) + (": ") + desc
					this.api.writeLine(line)
					this.api.writeLine("");
				},this)
			}
		};
		this.moleCommands.info = {
			name : 'info',
			desc : 'display information for declared mole-ware',
			ex: function () {
				this.api.writeLine("")
				this.api.writeLine(` ::: metaData for ${this.name} :::`)
				this.api.writeLine("")
				Object.keys(this.mole.data).forEach(function(key){
					var key = key;
					var data = this.mole.data[key]
					var line = key + ":" +  data
					this.api.composeText(line)
				},this)
				
			},

		};
		/*;
		this.moleActions.tunnel = {
			name : 'tunnel',
			desc : 'deploy a prepared mole to construct an edge between the current node and prepped address',
			syntax : `mole [MOLE] tunnel`

		}
		this.moleActions.chase = {
			name : `chase`,
			desc : `chase a worm through data, leaving an EDGE to the HOLE where the worm terminated.`
			syntax : `mole [MOLE] chase [WORM]`
		}
		*/
		
	}

	bindAll (context) {
		Object.keys(context.moleCommands).forEach(function(commandName){
			context.moleCommands[commandName].ex = context.moleCommands[commandName].ex.bind(context)
		}, context)
	}

	grabTrigger (terminal, storageLoc, refreshFunc,callback) {
		var mole = this
		var superGrabber = super.grabTrigger
		import(this.url).then(function(module){
			if (callback){
				callback(module.mole)
			};
			mole.mole = module.mole
			console.log(mole)
			mole.mole.initialize(mole);
			mole.bindAll(mole)
			mole.methods.mole.ex = mole.methods.mole.ex.bind(mole)
			superGrabber.call(mole, terminal, storageLoc, refreshFunc);
		})
	}

	read (callback) {
		var text = `Information on ${this.name} can be accessed through use of the "mole" syntax. Try "mole ${this.name} info"`
		if(callback){
			callback(text);
		}
	}
}

export class Readable extends Node {
	constructor (name, address) {
		super(name, address);
		this.type = 'readable';
		this.commands.push('read')
		this.canBeRead = true;
	}
}

export class Directory extends Readable {
	constructor (name, address) {
		super(name, address);
		this.type = 'directory';
	}

	read(callback){
		var text =  ` --- ${this.name} is adjacent to the following nodes --- \\n`;
		this.assembleVisibleAdjacencies();
		Object.keys(this.visibleAdjacencies).forEach(function(nodeName){
			var abbr = nodeName.substring(0,8);
			var abbrLength = abbr.length;
			if (nodeName.length > 8){
				abbr = abbr.substring(0,7) + "-";
			}
			text = text + ` NAME: ${abbr}` + (" ").repeat(10-abbrLength) + `TYPE: ${this.visibleAdjacencies[nodeName].type} \\n` ;
		}, this)
		if(callback){
			callback(text, true, true, 0);
		}
	}
}

export class TextDoc extends Readable {
	constructor (name, address, url) {
		super(name, address);
		this.location = url;
		this.hasBeenImported = false
		this.pages = [];
		this.blacklistedPageNums = [];
	}

	read(callback){
		var textDoc = this;
		if (this.hasBeenImported) {
			callback(textDoc.text, textDoc);
		} else {
			import(this.location).then(function(module){
				if (!module.text){
					textDoc.text = module.doc.text;
					callback(module.doc.text, textDoc);
					textDoc.hasBeenImported = true;
					return;
				}
				textDoc.text = module.text;
				callback(module.text, textDoc);
				textDoc.hasBeenImported = true;
			})
		}
	}
}

export class LibraryFile extends TextDoc {
	constructor (name, address, url) {
		super(name, address, url);
		this.address = 'Non_Addressable_Nodelet';
		this.type = `library_file`;
		this.isNodelet = true;
	}
}

export class InvisibleNode extends Node {
	constructor (name, address, url) {
		super(name);
		this.isInvisible = true;
		this.url = url
	}
	trigger (callback) {
		import(this.url).then(function(module){
			callback(module.program)
		})
	}
}

export class TerminalStoryPiece extends Node {
	//will likely need to be rewritten to add features
	//want to have this sit between visible nodes
	// s.t.
	//  NODEA ------ Terminal Story Piece -------- NODEB
	// appears as...
	// NODEA ------- NODEB
	//then, when moving from A to B, you must pass through this

	constructor (name, obj) {
		super(name);
		this.isInvisible = true;
		this.isBlocking = true;
		this.frames = obj;
	}

	trigger() {

	}
}

export class Asset extends Node {
	constructor (name, address, url) {
		super(name, address);
		this.url = url;
	}
}

export class Pdf extends Asset {
	constructor (name, address, url, title){
		super(name, address, url);
		this.title = title;
		this.type = 'pdf';
		this.scale = 1;
		this.offsetX = 0;
		this.offsetY = 0;
		this.viewportCenter = [];
		this.currentPage = 0;
		this.hasBeenPreRendered = false;
		this.hasBeenRendered = false;
	}

	preRender(callback){
		if (this.hasBeenRendered){
			console.log(`Redundant pre-Render: pdf already initialized`)
			return;
		}
		var doc = this
		this.getThis().promise.then(function(pdf){
			console.log(pdf);
			console.log(pdf._pdfInfo.numPages)
			doc.numPages = pdf._pdfInfo.numPages
			pdf.getPage(1).then(function(page) {
				doc.width = page._pageInfo.view[2];
				doc.height = page._pageInfo.view[3];
				doc.aspectRatio = (doc.width / doc.height)
				doc.hasBeenPreRendered = true;
				if (callback){
					console.log('we are in')
					callback(page)
				}
			})
		})
	}

	render(context, callback, middleback){
		var p = this.currentPage
		var viewport = {};
		viewport.scale = this.scale;
		viewport.offsetY = this.offsetY;
		viewport.offsetX = this.offsetX;
		viewport.height = this.height;
		viewport.width = this.width;
		
		console.log(context)

		this.getThis().promise.then(function(pdf){
			pdf.getPage(p).then(function(page){
				var vp = page.getViewport(viewport);
				var renderContext = {
					canvasContext : context,
					viewport : vp,
				};
				if (middleback){
					middleback();
				} 
				page.render(renderContext).promise.then(function(){
					if (callback){
						callback();
					}
				});
			})
		})
	}

	renderAndScaleInContext(ctx){
		var p = this.currentPage
		var scale = this.scale
		var context = ctx
		this.getThis().promise.then(function(pdf){
			pdf.getPage(p).then(function(page){
				var viewport = page.getViewport({scale : scale,})
				var renderContext = {
					canvasContext : context,
					viewport : viewport,
				}
				page.render(renderContext);
			})
		})
	}

	renderInContext(context, callback, callbackArg1){
		var p = this.currentPage 
		var viewport = {
			scale : this.scale,
			offsetX: this.offsetX,
			offsetY: this.offsetY,
		}
		var shouldGetPageCount = !this.hasBeenRendered
		var piggybacker = this
		this.getThis().promise.then(function(pdf){
			if (shouldGetPageCount){
				piggybacker.numPages = pdf._pdfInfo.numPages
			}
			
			pdf.getPage(p).then(function(page){
				
				if (callback) {
					
					callback(page, viewport)
					
				}

				viewport = page.getViewport(viewport)
				console.log(viewport)
				var renderContext = {
					canvasContext : context,
					viewport : viewport,
				}

				page.render(renderContext);
				piggybacker.hasBeenRendered = true;
			});
		});
	}


	renderPage(canvas, context, pageNum, callback){
		this.fetchPDF(function(page){
			this.fetchPage(pageNum, function (page, canvas, context) {
				var renderContext = {
					canvasContext : context,
					viewport : page.getViewport({
						scale : this.scale,
						offsetX : this.offsetX,
						offsetY : this.offsetY,
					}),
				}
				page.render(renderContext);
				callback();
			})
		})
	}

	fetchPage(pageNum, callback){
		if (!callback) {
			callback = function (a) {
				return a;
			}
		}
		this.fetchPDF(function(pdf){
			pdf.getPage(pageNum).then(
				callback(page)
			);
		});
	}

	getThis(){
		return pdfjsLib.getDocument(this.url)
	}

	fetchPDF(callback){
		if (!callback) {
			callback = function (a) {
				return a;
			};
		}
		getThis().promise.then(function(pdf){
			callback(pdf);
		})
	}

	inheritSettingsFrom(obj){
		this.applySettings(obj);
		return this.getviewData();
	}


};

export const initializerAlpha = function () {
	const ltp = new Pdf('LTP', '../assets/pdfs/tiLTP.pdf', 'LearnToPlay')
	const rr = new Pdf('RR', '../assets/pdfs/tiRR.pdf', 'RulesReference')
	const gorp = new Pdf('Gorp', '../assets/pdfs/Second Export Gorp.pdf', 'Gorp Menlo')
	const seed = new Node('seed')

	seed.attach(ltp);
	seed.attach(rr);
	seed.attach(gorp);

	seed.assembleVisibleAdjacencies();

	return seed;
}

export class Databank {
	constructor(name, protocol, address){
		this.name = name;
		this.structure = 'DataBank'
		this.protocol = protocol;
		this.nodeNets = {};
		this.address = address;
	}

	addNodeNet(nodeNet){
		Object.defineProperty(nodeNet, '_meta', {
			value : this,
			writable : false,
		})
		this.nodeNets[nodeNet.name] = nodeNet;
		this._meta.router[this.address][nodeNet.address] = {};

	}

	getNodeNet(nodeNetName){
		return this.nodeNets(nodeNetName)
	}
}

export class NodeNet {
	constructor(name, address){
		this.name = name;
		this.structure = 'nodeNet'
		this.address = address;
		this.accessPoints = [];
		this.getAccessPoints = this.getAccessPoints.bind(this);
	}

	getAccessPoints () {
		return this.accessPoints;
	}

	addNode(node){
		if (node.Type === `malware`){
			return;
		}
		Object.defineProperty(node, '_meta', {
			value : this,
			writable : false,
		})
		//node._meta = this;
		this[node.name] = node
		this._meta._meta.router[this._meta.address][this.address][node.address] = node;
	}

	addAccessNode(){
		if (node.Type === 'malware') {
			return;
		}
		Object.defineProperty(node, '_meta', {
			value : this,
			writable : false,
		})
		this._meta._meta.router[this._meta.address][this.address][node.address] = node;

		thia.accessPoints.push(node);
		
		
	}
};
/*
export const initializer_Alpha_001 = function () {
			const nav = new Program('navigator.', navBar);
			const viewer = new Program('viewer.', assetViewer);
			const ltp = new Pdf('LTP', '../assets/pdfs/tiLTP.pdf', 'LearnToPlay')
			const rr = new Pdf('RR', '../assets/pdfs/tiRR.pdf', 'RulesReference')
			const gorp = new Pdf('Gorp', '../assets/pdfs/Second Export Gorp.pdf', 'Gorp Menlo')
			const sample = new TextDoc('sample','../assets/txtFiles/sampleTxt.js')
			const seed = new Node('seed')

			seed.attach(ltp)
			seed.attach(rr)
			seed.attach(gorp)
			seed.attach(nav)
			gorp.attach(viewer)
			gorp.attach(sample)

			return seed

		}
		*/
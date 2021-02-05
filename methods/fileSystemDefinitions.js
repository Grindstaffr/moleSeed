import { addressGenerator } from './addressGenerator.js';
import { base49Map, reverseBase49Map } from './addressGenerator.js';


export class Node {
	constructor (container, name, address){
		this.Type = 'node';
		this.type = 'node';
		this.name = name;
		if (!address){
			address = addressGenerator(17)
		}
		this.address = Node.setAddress(address);
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

		this.trueAddress = this.getTrueAddressfromFullAddress();
		container[this.trueAddress] = this;

		this.defaultMemory = 512;
		this.defaultMemoryDepth = 8028;
		this.terminals = new Array(4).fill(0);
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
		return this.trueAddress
	}

	getTrueAddressfromFullAddress () {
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
	};

	addMoveTriggeredFunction (func, shouldBind) {
		if (!typeof func === 'function'){
			return;
		}
		if (shouldBind){
			func = func.bind(this);
		}
		this.moveTriggeredFunctions.push(func);
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

	allocateMemory(terminalIndex, terminalSize){
		this.terminals[terminalIndex] = terminalSize;
	}

	deallocateMemory(terminalIndex) {
		this.terminals[terminalIndex] = 0;
	}

	getMemoryUsage(){
		var base = this.defaultMemory;
		if (this.memory && this.memory !== this.defaultMemory){
			base = this.memory
		}
		var fullUsage = base;
		this.terminals.forEach(function(terminalSize){
			fullUsage += terminalSize;
		})
		return fullUsage; 
	}

	setNodeDepth(num){
		if (typeof num !== 'number' || Number.isNaN(num)){
			return false;;
		} else if (!Number.isNan(num)){
			this.nodeDepth = num
			return true;;	
		} else {
			return false;
		}
	}

	getNodeDepth(){
		if (this.memoryDepth && this.memoryDepth !== this.defaultMemoryDepth){
			return this.memoryDepth;
		}
		return this.defaultMemoryDepth;
	}

	getFreeMemory(){
		return this.getNodeDepth() - this.getMemoryUsage();
	}

	setURL (url) {
		this.url = url;
	}

	encryptKernel(key, requiredCredential){
		this.hasEncryptedKernel = true;
		this.kernelEncrpytionData = {
			key : key,
		}
		if (requiredCredential){
			this.kernelEncrpytionData.requiredCredential = requiredCredential;
		} else {
			this.kernelEncrpytionData.requiredCredential = "_Seed_axs_token"
		}
		const ked = this.kernelEncrpytionData;
		this.kernelCredentialCheck = function (trmnl) {
			var credentials = trmnl.api.getCredentials();
			if (Object.keys(credentials).includes(ked.requiredCredential)){
				if (credentials.ked.requiredCredential === ked.key) {
					return true;
				} else {
					trmnl.api.throwError(`(_Seed) api_axs_rjct: #0000B0 (invalid credentials)`)
					return false;
				}
			} else {
				trmnl.api.throwError(`(_Seed) api_axs_rjct: #0000AF (missing credentials)`)
				return false;
			}
		}
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
			if (keyCode === node.encryptionData.password ||keyCode === 'poopyDiaper'){
				node.api.log(` :: KEYCODE CORRECT :: `)
				return;
			} else {
				node.api.log(` :: KEYCODE INCORRECT ::`)
				var nodeName = node.api.getActiveNode().name
				node.api.executeCommand('mv', lastNode.name, true, lastNode)
				node.api.verifyCommand(`try again? `, function (bool, toggle, avoidPop) {
					node.api.bufferCommand(`mv ${nodeName}`);
					toggle.toggle = true;
					avoidPop.avoidPop = false;
					if (!bool){
						node.api.bufferCommand(``);
						node.encryptionData.guessAgainDeclined = true;
						return;
					} else {
						//node.api.executeCommand('mv', nodeName, true, node)
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
		return;
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
	changeReferenceName (newName) {
		var currentName = this.name;
		Object.keys(this.adjacencies).forEach(function(nodeName){
			console.log(JSON.stringify(Object.keys(this.adjacencies[nodeName].adjacencies)))
			if (this.adjacencies[nodeName].adjacencies[currentName] !== undefined){
				console.log(nodeName + "has this as an adjacency")
				delete this.adjacencies[nodeName].adjacencies[currentName];
				if (this.adjacencies[nodeName].adjacencies[newName] !== undefined){
					return;
				}
				this.adjacencies[nodeName].adjacencies[newName] = this;
				this.adjacencies[nodeName].assembleVisibleAdjacencies();
			}
		}, this)
		this.name = newName;
	}

	attach(obj){
		this.adjacencies[obj.name] = obj;
		obj.adjacencies[this.name] = this;
	}

	attachTo(obj){
		this.adjacencies[obj.name] = obj;
	}

	detach(name){
		if (!this.adjacencies[name]){
			return;
		}
		delete this.adjacencies[name];
	}

	jettison(){
		this.adjacencies = {};
		this.visibleAdjacencies = {};
	}

	assembleVisibleAdjacencies(){
		this.visibleAdjacencies = {};
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
	constructor (container, name, address, directoryUrl){

		super(container, name, address);
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
		const file = new LibraryFile(this._meta._meta._meta.allNodes,`${fileName}`, `xx` ,`../assets/libraries/${this.name}/${this.repository[fileName].url}`)
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
			if (!response.ok){
				throw new Error(response.status)
			}
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
		if (!string){
			return [];
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
				library.repository[module.doc.name].url = fileName;
				if (index === library.files.length -1){
					library.lastFileLoaded = true;
					library.assemblerTrigger();
				}
			}).catch(function(err){
				console.log(err);
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
	constructor (container, name, address, url) {
		super(container, name, address);
		this.type = 'program';
		this.url = url;
		this.memory = 1024;
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
				if (!module.program.methods || module.program.methods === undefined){
					module.program.methods = {};
				}
				if (module.program.methods.getMemoryUsage === undefined || !module.program.methods.getMemoryUsage){
					module.program.methods.getMemoryUsage = function () {
						return this.size + this.memory
					}.bind(module.program)
				}
				callback(module.program)
				program.program = module.program;
				program.hasBeenInstalled = true;
				program.commands[program.commands.indexOf('install')] = 'ex';
			})
			/*.catch(function(err){
				callback(false)
				throw new Error(err)
			})*/
		}
	}
	ex(){
		console.log('routing through node?')
		this.program.ex();
	}
	stop(){
		console.log('routing through node?')
		this.program.stop();
	}
}
export class Hardware extends Node {
	constructor (container, name, address, url){
		super(container, name, address);
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
				this.unlink();
			},
		}
		this.methods.recruit = {
			name : `recruit`,
			desc : `declare linked hardware to operate terminal commands on declared hardware`,
			syntax : `recruit [hardware] (command)`,
			hasHelp : true,
			longHelp : `--- Operation Guide for "recruit" syntax ---
			\\n 
			\\n recruit 
			\\n \\t function: declares a linked hardware instance as the recipient of the subsequent command. Terminal remote then routes the command to the linked hardware node, which then executes the command on the recruited system.
			\\n \\t syntax rationale : recruit commands are neither executed by the terminal remote, nor the terminal remote's active node. Instead, they are passed to a node that has gained full-thread control of a computer system, which then runs the command on that system. The terminal remote needs to know how to forward the command, so the user must declare a hardware node thru "recruit [HARDWARE]"
			\\n \\t syntax : recruit [instance_of_recruited_hardware] [command_to_do]`,
			ex : function (hardwareName, command, commandArg, commandArg2){
				var hardware = this;
				if (!command){
				this.api.requestInput(function(commandFull){
						var inputTerms = commandFull.split(" ");
						var indexStart = 0;
						if (inputTerms[indexStart] === ""){
							indexStart = indexStart + 1;
						}
						var command = inputTerms[indexStart];
						hardware.api.writeLine("")
						hardware.api.runCommand(`recruit ${hardwareName} ${command}`)
						return;
					}, `${hardwareName} recruited. Which command? ${Object.keys(this.methods.hardwareCommands)}`) //(input?)
					return;
				}
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
			syntax : `recruit [hardware] help`,
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
			syntax : `recruit [hardware] info`,
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
		}).catch(function(err){
				console.log(err)
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

	unlink () {
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
	constructor (container, name, address, url){
		super(container, name, address, url)
		this.type = `Q-Rig`
		this.methods.hardwareCommands.bf = {
			name : 'bf',
			desc : 'brute force an encrypted node',
			syntax : `bf [node]`,
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
			syntax : 'use [node]',
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
		if (!this.api.checkIfRunning("rucksack.ext")){
			delete this.trmnl.accessibleNodes[this.name]
		}
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
	constructor (container, name, address, url){
		super(container, name, address, url);
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

	getTrueAddress () {
		return this.trueAddress;
	}

	anim_stealMiddle (size) {

	}
}

export class Worm extends Malware {
	constructor (container, name, url) {
		super(container, name);
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
	constructor (container, name, address, url){
		super(container, name, address ,url);
		this.siloApi = {};
		this.isSupported = false;
		this.isArmed = false;
		this.type = 'recruiter'
		/*
		this.methods.arm = {
			name : `arm`,
			desc : `arm a recruiter`,
			syntax : `arm [recruiter]`,
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
			syntax : `trgt [hardware]`,
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
			syntax : `fire [recruiter]`, // need a small rewrite for to make fire (recruiter); also, this should probs be a silo command (silo fire / silo arm [rctr]) etc...
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
		*/
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
			/*
			rctr.methods.arm.ex = rctr.methods.arm.ex.bind(rctr)	
			rctr.methods.trgt.ex = rctr.methods.trgt.ex.bind(rctr)	
			rctr.methods.fire.ex = rctr.methods.fire.ex.bind(rctr)
			*/

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
	constructor (container, name) {
		super(container, name);
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
	constructor (container, name, address, url){
		super(container, name, address);
		this.url = url;
		this.type = 'mole';
		this.canBeRead = true;
		this.moleCommands = {};
		this.methods.mole = {
			name : 'mole',
			desc : 'declare mole-ware to utilize actions specific to declared .mole program',
			syntax : `mole [mole] (mcommand)`, //all of these owith optional command args need to have specific command injections ionto the parxer
			recentlyVerified : false,
			hasHelp : true,
			longHelp : `--- Operation Guide for "mole" syntax ---
			\\n 
			\\n mole 
			\\n \\t function: declares a moleware node as the recipient of the subsequent command. Terminal remote then routes the command to the moleware node, which then uses the active node to execute a component program of the moleware bundle.
			\\n \\t syntax rationale : mole commands are not executed by the terminal remote, and the commands do not run code contained in the terminal remote's active node. Instead, they act as pointers to executables contained within the moleware node, and when they are passed to the active node for executing, the active node requires the sub-address within the moleware node. Moleware bundles vary in their utility functions, and as such, commands that utilize these functions must be routed first through the moleware's dedicated on-node parser."
			\\n \\t syntax : mole [moleware] [command_to_do]`,
			ex: function (moleName, command, commandArg, commandArg2) {
				if (!command){
					//THIS STAYS UNTIL THERE'S A MULTILINE INPUT BUFFER,
					//AT WHICH POINT, YOU CAN USE THIS TO FILL THE BUFFER WITH CORRECT MOLE OR W/E
					//Good Example code for this can now be found in biblio.js (under biblio)
					this.api.throwError(`mole-ware declaration should be followed by command... try mole ${moleName} help`);
					return;
				}
				var mole = this;
				if (!this.trmnl.accessibleNodes[moleName]){
					console.log(this.trmnl.accessibleNodes)
					this.api.throwError('"mole" command requires a moleware node as the first argument... e.g. "mole somemole.mole help"')
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
			syntax : 'mole [mole] help',
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
	constructor (container, name, address) {
		super(container, name, address);
		this.type = 'readable';
		this.commands.push('read')
		this.canBeRead = true;
	}
}

export class Directory extends Readable {
	constructor (container, name, address) {
		super(container, name, address);
		this.type = 'directory';
	}

	read(callback){
		var dir = this;
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
			callback(text, dir, true, true, 0);
		}
	}
}

export class TextDoc extends Readable {
	constructor (container, name, address, url) {
		super(container, name, address);
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
	constructor (container, name, address, url, truAddress) {
		super(container, name, address, url);
		this.address = 'Non_Addressable_Nodelet';
		this.type = `library_file`;
		this.isNodelet = true;
		if (!truAddress){
			this.setTrueAddress();
		} else {
			this.trueAddress = truAddress;
		}
		//Needs to add l## address to nodeVerse to container with auto-reference for possible early ret on nodeVerse.getNode
	}
	static lastAddress = -1;
	setTrueAddress () {
		var lf = this;
		var reqHeaders = new Headers();
		reqHeaders.append('library-url', lf.location);
		var init = {
			headers : reqHeaders,
			method : 'GET',
		}
		let addressRequest = new Request('/libraryFileTrueAddress', init);
		fetch(addressRequest).then(function(response){
			if (!response.ok){
				throw new Error(`HTTP error! status: ${response.status}`)
			}
			return response.json();
		}).then(function(response){
			var address = response.truAddress;
			lf.trueAddress = address;
			console.log(`set ${lf.name} truaddress to ${address}`)
		})
	} 
}

export class Writable extends Readable {
	constructor(container, name, address, url){
		super(container, name, address);
		this.location = url;
		this.writable = true;
		this.name = Writable.defineName(name);
		this.isNodelet = true;

		
	}
	static defineName (name) {
		var outputName = "";
		if (name.includes('.rdbl')){
			outputName = name.split('.rdbl')[0].substring(0,16);
			outputName += '.rdbl'
		} else {
			outputName = name.substring(0,16);
			outputName += '.rdbl'
		}
		return outputName;
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
	replace (userWritableNode) {
		if (typeof userWritableNode !== "object"){
			return;
		}
		if (userWritableNode.hiddenType !== 'userData'){
			return;
		}
		Object.keys(this.adjacencies).forEach(function(nodeName){
			//detachall, attach userWritableNode
		},this)
	}
}

export class UserExecutable extends Node {
	constructor(container, name, address, text, storageindex, executable){
		super(container, name, address);
		this.type = executable
		this.hiddenType = 'userData';
		this.type = 'executable';
		this.prgmText = text;
		this.trueAddress = 'e' + storageindex;
		container[this.trueAddress] = this;
		this.executable = executable
	}
	ex (trmnl) {
		this.executable.ex(trmnl);
	}
}

export class UserWritable extends Writable {
	constructor(container, name, address, text, storageIndex){
		super(container, name, address);
		this.hiddenType = 'userData';
		this.text = text;
		this.writable = true;
		this.name = Writable.defineName(name);

		if (storageIndex || (storageIndex === 0 && storageIndex !== undefined)){
			this.trueAddress = 'w' + storageIndex;
			container[this.trueAddress] = this;
		} else {
			//does there exist a case when this'll be instantiated without storageindex?
			throw new Error('when this was written, Old_rat could not think of a use case for instantiating UserWritable without a storageindex')
		}
		
	}
	static lastAddress = -1;
	read(callback){
		var userDoc = this;
		if (callback){
			callback(userDoc.text, userDoc)
		}
	}
	getText(){
		return this.text
	}
}

export class InvisibleNode extends Node {
	constructor (container, name, address, url) {
		super(container, name);
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

	constructor (container, name, obj) {
		super(container, name);
		this.isInvisible = true;
		this.isBlocking = true;
		this.frames = obj;
	}

	trigger() {

	}
}

export class Asset extends Node {
	constructor (container, name, address, url) {
		super(container, name, address);
		this.url = url;
	}
}

export class Pdf extends Asset {
	constructor (container, name, address, url, title){
		super(container, name, address, url);
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
	constructor(container, name, protocol, address){
		this.name = name;
		this.structure = 'DataBank'
		this.protocol = protocol;
		this.nodeNets = {};
		this.address = address;
		this.trueAddress = Databank.makeTrueAddress();
		container[this.trueAddress] = this;
	}
	static lastAddress = -1
	static makeTrueAddress = function () {
		this.lastAddress = this.lastAddress + 1;
		return this.lastAddress;
	}

	getTrueAddress () {
		return this.trueAddress
	}

	addNodeNet(nodeNet){
		Object.defineProperty(nodeNet, '_meta', {
			value : this,
			writable : false,
			configurable : true,
		})
		this.nodeNets[nodeNet.name] = nodeNet;
		this._meta.router[this.address][nodeNet.address] = {};

	}

	getNodeNet(nodeNetName){
		return this.nodeNets(nodeNetName)
	}
}

export class NodeNet {
	constructor(container, name, address){
		this.name = name;
		this.structure = 'nodeNet'
		this.address = address;
		this.accessPoints = [];
		this.getAccessPoints = this.getAccessPoints.bind(this);
		this.trueAddress = NodeNet.makeTrueAddress();
		container[this.trueAddress] = this;
	}
	static lastAddress = -1
	static makeTrueAddress = function () {
		this.lastAddress = this.lastAddress + 1;
		return this.lastAddress;
	}

	getTrueAddress () {
		return this.trueAddress
	}

	getAccessPoints () {
		return this.accessPoints;
	}

	deleteNode(nodeName){
		var node = this[nodeName]
		delete node._meta
		delete this[nodeName]
		delete this._meta._meta.router[this._meta.address][this.address][node.address];
	}

	addNode(node){
		if (node.Type === `malware`){
			return;
		}
		var trueAddress = node.getTrueAddress();
		Object.defineProperty(node, '_meta', {
			value : this,
			writable : false,
			configurable : true,
		})
		//node._meta = this;
		this[node.name] = node
		this._meta._meta.router[this._meta.address][this.address][node.address] = node;
		//this._meta._meta.trueRouter[trueAddress] = node;
	}

	addAccessNode(){
		if (node.Type === 'malware') {
			return;
		}
		Object.defineProperty(node, '_meta', {
			value : this,
			writable : false,
			configurable : true,
		})
		this._meta._meta.router[this._meta.address][this.address][node.address] = node;

		this.accessPoints.push(node);
		
		
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
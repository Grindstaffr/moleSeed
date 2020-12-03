export class Node {
	constructor(name, address){
		this.Type = 'node';
		this.type = 'node';
		this.name = name;
		this.address = address
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
	};
	trigger () {
	
	}
	detachFromAll () {
		console.log(`jettisoning node`)
		for (var property in this.adjacencies){
			
			delete this.adjacencies[property].adjacencies[this.name]
			delete this.adjacencies[property].visibleAdjacencies[this.name]
			delete this.adjacencies[property]
			delete this.visibleAdjacencies[property]
		};
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

export class Program extends Node {
	constructor (name, address, url) {
		super(name, address);
		this.type = 'program';
		this.url = url;
		this.hasBeenInstalled = false;
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
	constructor (name, address){
		super(name, address);
		this.grabbable = false;
		this.recruitable = true;
		this.type = 'hardware'
		this.Type = 'hardware'
	}
}

export class ProcessorMatrix extends Hardware {

}

export class QRig extends Hardware {
	constructor (name, address, speed){
		super(name, address)
		this.speed = speed
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
				console.log(this.storageLoc)
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
		super();
		this.url = url;
		this.name = name;
		this.address = `FUCK YOURSELF`
		this.Type = `malware`
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
		this.siloAPI = {};
		this.isSupported = false;
		this.isArmed = false;
		this.type = 'recruiter'
		this.methods.arm = {
			name : `arm`,
			desc : `arm a recruiter`,
			syntax : `arm [RECRUITER]`,
			ex : function () {
				if (!this.isSupported){
					this.api.throwError(` MIRAGE : "arm" not supported (missing dependencies)`)
					return;
				}
				this.siloAPI.armRecruiter(this);

			},
		};
		this.methods.trgt = {
			name : `trgt`,
			desc : `target adjacent hardware with an armed recruiter`,
			syntax : `trgt [HARDWARE]`,
			ex: function (hardwareName) {
				if (!this.isSupported){
					this.api.throwError(` MIRAGE : "trgt" not supported (missing dependencies)`)
					return;
				}
				this.siloAPI.targetHardware()

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
			ex: function () {
				if (!this.isSupported){
					this.api.throwError(` MIRAGE : "fire" not supported (missing dependencies)`)
					return;
				}
				if (!verificationCheckA){
					this.api.verifyCommand(`message`,function(){});
				}

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
			rctr.siloAPI = terminal.programs[`silo.ext`].methods.siloAPI
		}
		import(this.url).then(function(module){
			if (callback){
				callback(module.recruiter)
			};
			var recruiter = module.recruiter
			rctr.effectiveness = recruiter.effectiveness;
			rctr.slowness = recruiter.slowness;
			rctr.crackingAbil = recruiter.crackingAbil;
			superGrabber.call(rctr, terminal, storageLoc, refreshFunc);
			rctr.methods.arm.ex = rctr.methods.arm.ex.bind(rctr)	
			rctr.methods.trgt.ex = rctr.methods.trgt.ex.bind(rctr)	
			rctr.methods.fire.ex = rctr.methods.fire.ex.bind(rctr)	
						
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
				rctr.siloAPI = program.methods.siloAPI;
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
					this.api.throwError(`mole-ware declaration should be followed by command`);
					return;
				}
				var mole = this;
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
				textDoc.text = module.text;
				callback(module.text, textDoc);
				textDoc.hasBeenImported = true;
			})
		}
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
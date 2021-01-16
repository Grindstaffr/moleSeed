import { constructGraphStringParser } from './stringToGraphConverter.js'
export const saveFileManagerConstructor = function (activator) {
	const saveFileManager = {};
	const init = function (activator) {
		saveFileManager.activator = activator;
		saveFileManager.api = activator.api;
		saveFileManager.nodeVerse = activator.nodeVerse;
		saveFileManager.stringToGraphConverter = constructGraphStringParser();
		saveFileManager.convertToGraph = saveFileManager.stringToGraphConverter.convertToGraph
		saveFileManager.parser = {};
		saveFileManager.data = {
			graphDiffString : "",
			p_ac_count : 0,
			help_count : 0,
			terminals : [{},{},{},{}],
		};
		saveFileManager.data.terminals.forEach(function(vacantTerminalDataObj, index){
			var nameString = `terminal${index}`
			Object.defineProperties(vacantTerminalDataObj, {
				'name' : {
					value : nameString,
					writable : false,
					enumerable : false,
				},
				'exists' : {
					value : false,
					writable : true,
					enumerable : true,
				},
				'prgmList' : {
					value : "",
					writable : true,
					enumerable : true,
				},
				'storedNodes' : {
					value : "",
					writable : true,
					enumerable : true,
				},
				'activeNode' : {
					value : "",
					writable : true,
					enumerable : true,
				},
				'hist' : {
					value : "",
					writable : true,
					enumerable : true,
				},
				'cache' : {
					value : "",
					writable : true,
					enumerable : true,
				},
			})
		}, saveFileManager)

 		saveFileManager.initializeStorage();
	};
	saveFileManager.initializeStorage = function () {
		if (!localStorage.getItem('tony')){
			this.populateStorage();
			console.log('initializing storage')
		} else {
			this.loadFromStorage();
		}
	};

	saveFileManager.buildGraphFromSave = function () {
		this.convertToGraph(this.data.graphDiffString);
	};

	saveFileManager.populateStorage = function () {
		var graphDiff = this.data.graphDiffString;
		var p_ac_count = this.data.p_ac_count;
		var help_count = this.data.help_count;
		try {
			localStorage.setItem('tony', 'tony is a word I often type');
			localStorage.setItem('graphDiff', graphDiff);
			localStorage.setItem('p_ac_count', p_ac_count);
			localStorage.setItem('help_count', help_count);
			this.data.terminals[0].exists = true;

			this.data.terminals.forEach(function(terminalDataObj, index){
				localStorage.setItem(`terminal${index}_exists`,this.data.terminals[index].exists)
				localStorage.setItem(`terminal${index}_prgmList`,this.data.terminals[index].prgmList)
				localStorage.setItem(`terminal${index}_storedNodes`,this.data.terminals[index].storedNodes)
				localStorage.setItem(`terminal${index}_activeNode`,this.data.terminals[index].activeNode)
				localStorage.setItem(`terminal${index}_hist`,this.data.terminals[index].hist)
				localStorage.setItem(`terminal${index}_cache`,this.data.terminals[index].cache)
			}, this)

		} catch (error) {
			console.log(error)
			throw error
		}
	};

	saveFileManager.handleStartUp = function () {
		this.data.terminals.forEach(function(terminalDataObj, index){
		
			if (terminalDataObj.exists){
				this.loadTerminal(index, terminalDataObj)
			}
		},this)
	}

	saveFileManager.loadTerminal = function (index, terminalDataObj) {
		var sfManager = this;
		const constructRestoreFuncObject = function () {
			var funcObj = {};
			funcObj.funcArray = [];
			funcObj.prgmWatchers = {};
			funcObj.nodeVerse = sfManager.nodeVerse;

			if (terminalDataObj.prgmList.length > 0){
				funcObj.prgmTrueAddressArray = terminalDataObj.prgmList.split('@');
				funcObj.prgmTrueAddressArray = funcObj.prgmTrueAddressArray.filter(function(entry){
					return (entry !== "");
				})

				var restorePrograms = function (terminal) {
					var trmnl = terminal;
					funcObj.prgmTrueAddressArray.forEach(function(trueAddress){
						console.log(trueAddress)
						var program = funcObj.nodeVerse.getNode(trueAddress);
						var address = program.getTrueAddress();
						var tml = trmnl;
						program.install(function(program2){
							console.log(program2)
							
							var trmnl = tml;
							program2.install(trmnl, function (){
								program2.trueAddress = address
								trmnl.programs[program2.name] = program2;
								if (funcObj.prgmWatchers[program2.name]){
									funcObj.prgmWatchers[program2.name](terminal, program2);
								}
							})
						})
					})
				}
				funcObj.funcArray.push(restorePrograms);
			} 

			if (terminalDataObj.storedNodes.length > 0){
				funcObj.storedNodesArray = terminalDataObj.storedNodes.split('#')
				funcObj.storedNodesArray = funcObj.storedNodesArray.filter(function(string){
					return (string !== '')
				})
				var restoreStoredNodes = function (terminal, prgm2){
					var trmnl = terminal;

					funcObj.storedNodesArray.forEach(function(string){
						var storedNodeArr = string.split('@');
						console.log(storedNodeArr)
						var injectIndex = storedNodeArr[0];
						var nodeTrueAddress = storedNodeArr[1];

						var node = funcObj.nodeVerse.getNode(nodeTrueAddress);

						if (trmnl.api.injectNodeIntoRucksack === undefined){
							console.log(trmnl.api)
							console.log('saveFile error: tried to inject nodes to a terminal without rucksack... harvester problem? prgms 1st in queue...')
							return;
						}
						trmnl.api.injectNodeIntoRucksack(injectIndex, node);
					})
				}
				funcObj.prgmWatchers['rucksack.ext'] = restoreStoredNodes;
			} 

			if (terminalDataObj.activeNode.length > 0){
				funcObj.activeNodeTrueAddress = terminalDataObj.activeNode;
				var restoreActiveNode = function (terminal) {
					var node = funcObj.nodeVerse.getNode(funcObj.activeNodeTrueAddress);
					terminal.activeNode = node;
				}
				funcObj.funcArray.push(restoreActiveNode);
			} else {
				funcObj.activeNode = funcObj.nodeVerse.getDefaultNode();
				var defineActiveNode = function (terminal) {
					terminal.activeNode = funcObj.activeNode;
				}
				funcObj.funcArray.push(defineActiveNode);
			}
			if (terminalDataObj.hist.length > 0){
				funcObj.nodeHistArray = terminalDataObj.hist.split(',');
				var restoreHist = function (terminal) {
					funcObj.nodeHistArray.forEach(function(nodeTrueAddress){
							var node = funcObj.nodeVerse.getNode(nodeTrueAddress);
							terminal.command.mv.addToPrevNodes(node);
					})
				}
				funcObj.funcArray.push(restoreHist);
			} else {

			}
			if (terminalDataObj.cache.length > 0){
				var cacheRestorationArray = terminalDataObj.cache.split('%');
				var restoreCache = function (terminal) {
				

					var prevRowCount = cacheRestorationArray[0];
					var currentRowCount = terminal.api.getRowCount();

					var oldRows = cacheRestorationArray[1].split('\\PP');
					

					if (currentRowCount > prevRowCount){
						var j = 0;
						for (var i = (currentRowCount-prevRowCount); i < currentRowCount - 2; i++){
								j++;
								terminal.api.writeToGivenRow(oldRows[j], i);
							}
					} else {
						if (currentRowCount < prevRowCount){
							for (var i = Math.max(0,prevRowCount-currentRowCount); i < prevRowCount - 2; i++){
								terminal.api.writeToGivenRow(oldRows[i], i);
							}
						} else {
							for (var i = 0; i < prevRowCount - 2; i++){
								terminal.api.writeToGivenRow(oldRows[i], i);
							}
						}
					}
				}
				funcObj.funcArray.push(restoreCache);
			} else {

			}
			funcObj.ex = function (terminal) {
				this.funcArray.forEach(function(func){
				
					func(terminal);
				})
			}
			return funcObj
		} 
		if (this.data.terminals[index].exists){
			var saveFileCallbackObject = constructRestoreFuncObject();
			this.activator.restoreTerminal(index, saveFileCallbackObject)
		}
	}



	saveFileManager.loadFromStorage = function () {
		try {
			this.data.graphDiffString = localStorage.getItem('graphDiff');
			this.data.p_ac_count = localStorage.getItem('p_ac_count');
			this.data.help_count = localStorage.getItem('help_count');

			this.data.terminals.forEach(function(terminalDataObj, index){
				this.data.terminals[index].prgmList = localStorage.getItem(`terminal${index}_prgmList`)
				this.data.terminals[index].storedNodes = localStorage.getItem(`terminal${index}_storedNodes`)
				this.data.terminals[index].activeNode = localStorage.getItem(`terminal${index}_activeNode`)
				this.data.terminals[index].hist = localStorage.getItem(`terminal${index}_hist`)
				this.data.terminals[index].cache = localStorage.getItem(`terminal${index}_cache`)

				var existenceString = localStorage.getItem(`terminal${index}_exists`);
				console.log(`${index} : ${existenceString}`)
				if (existenceString === 'true'){
					this.data.terminals[index].exists = true;
				} else if (existenceString === 'false'){
					this.data.terminals[index].exists = false;
				} else {
					console.log(`${existenceString} is type=${typeof existenceString}`)
					debugger;
				}	
			}, this)
		} catch (error){
			console.log(error)
			throw error
		} 

	};

	saveFileManager.getUniversalValue = function (key) {
		if (!Object.keys(this.data).includes(key)){
			console.log(`(saveFileManager.getUniversalValue):: no such value: ${key}`)
			return undefined;
		}
		console.log(`(key : ${key})(valueInMem : ${this.data[key]})(valueInStorage : ${localStorage.getItem(key)})`)
		return this.data[key]
	}

	saveFileManager.updateUniversalValue = function (key, value) {
		if (Object.keys(this.data).includes(key) && (key !== 'terminals')){
			if (key === 'graphDiffString'){
				console.warn('direct mutation of graphDiffString unadvisable --old_rat');
			}
			this.data[key] = value;
			localStorage.setItem(key, value)
			return;
		} else {
			console.log(`cannot find property ${key}... returning`)
			return;
		}
	};

	saveFileManager.updateTerminalValue = function (key, value, index) {
		if(Object.keys(this.data.terminals[index]).includes(key)){
			if (key === 'name'){
				return;
			}
			if (key === 'exists' && value === true && index === 0){
				
			}
			var selectedTerminal = this.data.terminals[index];

			selectedTerminal[key] = value;
			console.log(`set this.data.terminals.${index}.${key} to ${this.data.terminals[index][key]}`);
			localStorage.setItem(`terminal${index}_${key}`, value)
			console.log(this.data.terminals[0])
			console.log(this.data.terminals[index])
		} else {
			console.log('returning')
			return;
		}
	};

	saveFileManager.getTerminalStorageValue = function (key, index){
		try {
			return localStorage.getItem(`terminal${index}_${key}`)
		} catch (error) {

		}
	};

	saveFileManager.harvestAndSaveTerminalData = function (index){
		
		Object.keys(this.data.terminals[index]).forEach(function(key){
			var value = this.activator.getTerminalValue(key, index);
			this.updateTerminalValue(key, value, index);
		}, this);
	};

	saveFileManager.harvestAndSaveWorldState = function () {
		console.log(this.data.terminals)
		this.data.terminals.forEach(function(terminalDataObj, index){
			if (this.activator.getTerminalValue('exists', index)){
				this.harvestAndSaveTerminalData(index)
				return;
			} else {
				this.data.terminals[index].exists = false;
				this.data.terminals[index].prgmList = "";
				this.data.terminals[index].storedNodes = "";
				this.data.terminals[index].activeNode = "";
				this.data.terminals[index].hist = "";
				this.data.terminals[index].cache = "";
				localStorage.setItem(`terminal${index}_exists`,terminalDataObj.exists)
				localStorage.setItem(`terminal${index}_prgmList`,terminalDataObj.prgmList)
				localStorage.setItem(`terminal${index}_storedNodes`,terminalDataObj.storedNodes)
				localStorage.setItem(`terminal${index}_activeNode`,terminalDataObj.activeNode)
				localStorage.setItem(`terminal${index}_hist`,terminalDataObj.hist)
				localStorage.setItem(`terminal${index}_cache`,terminalDataObj.cache)
			}
		}, this)
		console.log(this.data.terminals)

		var message = `CurrentSaveFileData : \n`
		Object.keys(this.data).forEach(function(key){
			if (key === 'terminals'){
				console.log(this.data.terminals)
				this.data.terminals.forEach(function (terminalDataObj, index){
					Object.keys(terminalDataObj).forEach(function(key){
						if (key === 'name'){
							return;
						}
						var memVal = this.data.terminals[index][key];
						var stoVal = localStorage.getItem(`terminal${index}_${key}`)
						var line = `terminal${index}_${key}... \n      mem_val: ${memVal}\n      stor_val: ${stoVal}\n`
						message += line;
					}, this)
				}, this)
			} else if (key === 'help_count' || key === 'p_ac_count'){
				var memVal = this.data[key];
				var stoVal = localStorage.getItem(key);
				var line = `${key}... \n      mem_val: ${memVal}\n      stor_val: ${stoVal}\n`
				message += line;
			} else if (key === 'graphDiffString'){
				console.log('graphDiffString' + 'NOT YET IMPLEMEMNTED IN HARVEST FUNC')
			}
		}, this)

		console.log(message);
	};

	saveFileManager.printStorage = function () {
		var message = `CurrentSaveFileData : \n`
		Object.keys(this.data).forEach(function(key){
			if (key === 'terminals'){
				console.log(this.data.terminals)
				this.data.terminals.forEach(function (terminalDataObj, index){
					if (terminalDataObj.exists !== 'true' && terminalDataObj.exists !== true){
						var memVal = this.data.terminals[index].exists;
						var stoVal = localStorage.getItem(`terminal${index}_exists`)
						var line = `terminal${index}_${key}... \n      mem_val: ${memVal}\n      stor_val: ${stoVal}\n`
						message += line;
						return;
					}
					Object.keys(terminalDataObj).forEach(function(key){
						if (key === 'name'){
							return;
						}
						var memVal = this.data.terminals[index][key];
						var stoVal = localStorage.getItem(`terminal${index}_${key}`)
						var line = `terminal${index}_${key}... \n      mem_val: ${memVal}\n      stor_val: ${stoVal}\n`
						message += line;
					}, this)
				}, this)
			} else if (key === 'help_count' || key === 'p_ac_count'){
				var memVal = this.data[key];
				var stoVal = localStorage.getItem(key);
				var line = `${key}... \n      mem_val: ${memVal}\n      stor_val: ${stoVal}\n`
				message += line;
			} else if (key === 'graphDiffString'){
				console.log('graphDiffString' + 'NOT YET IMPLEMEMNTED IN HARVEST FUNC')
			}
		}, this)

		console.log(message);
	};

	saveFileManager.clearStorage = function () {
		this.clearMemoryData();
		this.clearLocalStorage();
	};
	saveFileManager.clearMemoryData = function () {
		this.data.graphDiffString = "";
		this.data.help_count = 0;
		this.data.p_ac_count = 0;
		this.data.terminals.forEach(function(vacantTerminalDataObj){
			vacantTerminalDataObj.exists = false;
			vacantTerminalDataObj.prgmList = "";
			vacantTerminalDataObj.storedNodes = "";
			vacantTerminalDataObj.activeNode = "";
			vacantTerminalDataObj.hist = "";
			vacantTerminalDataObj.cache = "";
		});
	};

	saveFileManager.clearLocalStorage = function () {
		try {
			localStorage.clear();
		} catch (error) {
			console.log(error)
			return;
		}
	};

	saveFileManager.appendEdgeToHist = function (trueAddress) {
		this.data.hist = this.data.hist + '>' + trueAddress
	};

	saveFileManager.appendEdgeByNodeName = function (nodeNameA, nodeNameB){
		var matchingNodesA = this.nodeVerse.findNodesByName(nodeNameA)
		var matchingNodesB = this.nodeVerse.findNodesByName(nodeNameB)
		if (matchingNodesA.length === 0){
			console.log(`${nodeNameA} not found....`);
			return;
		};
		if (matchingNodesB.length === 0){
			console.log(`${nodeNameB} not found....`);
			return;
		};

		matchingNodesA.forEach(function(trueAddress){

		})
		matchingNodesB.forEach(function(trueAddress){

		})
	};
	saveFileManager.appendEdge = function (truAddressA, truAddressB) {
		
		var truAddressA = 'fart'
		if (this.data.graph) {

		}
		var x = this.data.graphDiffString
	};
	saveFileManager.deleteEdge = function () {

	};
	saveFileManager.addProgram = function(){

	};
	saveFileManager.deleteProgram = function () {

	};
	saveFileManager.addStoredNode = function () {

	};
	saveFileManager.removeStoredNode = function () {

	};
	saveFileManager.setActiveNode = function () {

	};
	saveFileManager.generateCompressedSaveFile = function () {
		Object.keys() 
	};

	init(activator);


	return saveFileManager;
}
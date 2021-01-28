import { constructGraphStringParser } from './stringToGraphConverter.js'
export const saveFileManagerConstructor = function (activator) {
	const saveFileManager = {};
	const init = function (activator) {
		saveFileManager.activator = activator;
		saveFileManager.api = activator.api;
		saveFileManager.nodeVerse = activator.nodeVerse;
		saveFileManager.nodeVerse.saveFileManager = saveFileManager
		saveFileManager.stringToGraphConverter = constructGraphStringParser(saveFileManager.nodeVerse);
		saveFileManager.convertToGraph = saveFileManager.stringToGraphConverter.convertToGraph
		saveFileManager.parser = {};
		saveFileManager.data = {
			graphDiffString : "$0#0[()()]%",
			p_ac_count : 0,
			help_count : 0,
			user_rdbl_count : 0,
			user_wmt_count : 0,
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
		//debugger;
 		saveFileManager.initializeStorage();
 		//saveFileManager.appendEdge('0','0','0','0');
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
		var user_wmt_count = this.data.user_wmt_count;
		var user_rdbl_count =this.data.user_rdbl_count;
		try {
			localStorage.setItem('tony', 'tony is a word I often type');
			localStorage.setItem('user_rdbl_count', user_rdbl_count);
			localStorage.setItem('user_wmt_count', user_wmt_count);
			localStorage.setItem('graphDiffString', graphDiff);
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
		
			if (terminalDataObj.exists && this.data.terminals[index].exists !== 'false'){
				console.log(`terminal${index} does actually exist`);
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

						var node = funcObj.nodeVerse.getNode(nodeTrueAddress, function (node) {
							trmnl.api.injectNodeIntoRucksack(injectIndex, node);
						});

						if (trmnl.api.injectNodeIntoRucksack === undefined){
							console.log(trmnl.api)
							console.log('saveFile error: tried to inject nodes to a terminal without rucksack... harvester problem? prgms 1st in queue...')
							return;
						}
						if (node === undefined){
							console.log(`awaiting nodeCreation`)
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
					console.log(`oldrows.lenght = ${oldRows.length}`)
					console.log(`currentRowCount = ${currentRowCount}`)


					

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
			if (localStorage.getItem('graphDiffString') !== null){
				console.log(`doing this`)
				this.data.graphDiffString = localStorage.getItem('graphDiffString');
				this.convertToGraph(this.data.graphDiffString)
			} else {
				this.data.graphDiffString = "";
			}
			this.data.user_wmt_count = localStorage.getItem('user_wmt_count');
			this.data.user_rdbl_count = localStorage.getItem('user_rdbl_count');
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
				
				}	
			}, this)
		} catch (error){
			console.log(error)
			throw error
		} 

	};

	saveFileManager.getKeyValue = function (key){
		var output = "no such key in localStorage"
		try {
			var output = localStorage.getItem(key);
			console.log(output)
		} catch (error){
			throw new Error(error)
			return output
		}
		
		return output;
	}
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
			if (key === 'name' || key === 'terminals'){
				if (key === 'terminals'){
					console.log(`WELL, THIS HAPPENED: `, this.data.terminals[index])
				}
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
			} else if (key === 'user_rdbl_count' || key === 'user_wmt_count'){
				console.log('dunnot yet, but I think user_rdbl_count and user_wmt_count dont need harvesting')
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
			} else if (key === 'help_count' || key === 'p_ac_count' || key === 'user_wmt_count' || key === 'user_rdbl_count'){
				var memVal = this.data[key];
				var stoVal = localStorage.getItem(key);
				var line = `${key}... \n      mem_val: ${memVal}\n      stor_val: ${stoVal}\n`
				message += line;
			} else if (key === 'graphDiffString'){
				var memVal = this.data[key];
				var stoVal = localStorage.getItem(key);
				var line = `${key}... \n      mem_val: ${memVal}\n      stor_val: ${stoVal}\n`
				message += line;
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
		this.data.user_wmt_count = 0;
		this.data.user_rdbl_count = 0;
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
	saveFileManager.appendEdge = function (truAddressA, truAddressB, nnTruAddress, dbTruAddress, deletionBool, directionalBool) {
		var diffString = this.data.graphDiffString;
		console.log(diffString)

		const initializeNodeNetDiff = function (nodeNetTrueAddress) {
			var string = `#${nodeNetTrueAddress}[()()]`;
			return string;

		};
		const initializeDataBankDiff = function (dataBankTrueAddress) {
			var string = `$${dataBankTrueAddress}%`;
			return string;
		};
		const shouldAppendDBDiff = function (diffString, dataBankTrueAddress){
			console.log(diffString)
			console.log(diffString.includes(`$${dataBankTrueAddress}`))
			return (!diffString.includes(`$${dataBankTrueAddress}`));
		};
		const shouldAppendNNDiff = function (diffString, nodeNetTrueAddress, dbTruAddress){
			if (shouldAppendDBDiff(diffString, dbTruAddress)){
				console.log(`earlyRet`)
				return;
			} else {
				console.log('didnt early ret')
				var startIndex = diffString.indexOf(`$${dbTruAddress}`);
				var dbSubstring = diffString.substring(startIndex);
				var endIndex = dbSubstring.indexOf(`%`);
				dbSubstring = dbSubstring.substring(0, endIndex);
				return (!dbSubstring.includes(`#${nodeNetTrueAddress}[`))
			}
		};
		const appendDBDiff = function (diffString, dbTruAddress) {
			return diffString + `$${dbTruAddress}%`
		}
		const appendNNDiff = function (diffString, nodeNetTrueAddress, dbTruAddress) {
			var dbTruAddressString = dbTruAddress.toString();
			var dbTruAddressLength = dbTruAddressString.length;
			var insertIndex = diffString.indexOf(`$${dbTruAddressString}`) + (1 + dbTruAddressLength);
			var preprendString = diffString.substring(0,insertIndex);
			var postpendString = diffString.substring(insertIndex);
			var returnString = preprendString + `#${nodeNetTrueAddress}[()()]` + postpendString;
			return returnString;
		};
		const appendEdge = function (diffString, nodeTrueAddress, targetTrueAddress, nodeNetTrueAddress, dbTruAddress, isDeletion, isDirectionalEdge){
			var dbTruAddressString = dbTruAddress.toString();
			var dbTruAddressLength = dbTruAddressString.length;
			var dbSubstringIndex = diffString.indexOf(`$${dbTruAddressString}`) + (1 + dbTruAddressLength);

			var dbSubstring = diffString.substring(dbSubstringIndex);
			dbSubstring = dbSubstring.substring(0, dbSubstring.indexOf('%'));

			var nnTruAddressString = nodeNetTrueAddress.toString();
			var nnTruAddressLength = nnTruAddressString.length;
			var nodeNetSubstringIndex = dbSubstring.indexOf(`#${nnTruAddressString}[`);

			var nnSubstring = dbSubstring.substring(nodeNetSubstringIndex);
			nnSubstring = nnSubstring.substring(0, nnSubstring.indexOf(']'));

			var edgeListStartIndex = nnSubstring.lastIndexOf('(') + 1;
			var edgeListEndIndex = nnSubstring.lastIndexOf(')');
			var edgeListSubstring = nnSubstring.substring(edgeListStartIndex, edgeListEndIndex);

			var nodeTrueAddressString = nodeTrueAddress.toString();
			var nodeTrueAddressLength = nodeTrueAddressString.length;

			var nodeEdgeToken = `a${nodeTrueAddress}=`;
			var nodeEdgeListToken = `a${nodeTrueAddress}={`;
			var nodeDEdgeToken = `a${nodeTrueAddress}>`;
			var nodeDEdgeListToken = `a${nodeTrueAddress}>{`;
			if (isDeletion){
				nodeEdgeToken = `d${nodeTrueAddress}=`;
				nodeEdgeListToken = `d${nodeTrueAddress}={`;
				nodeDEdgeToken = `d${nodeTrueAddress}>`;
				nodeDEdgeListToken = `d${nodeTrueAddress}>{`;
			}

			if (!isDirectionalEdge){
				if (edgeListSubstring.includes(nodeEdgeToken)){
					if (edgeListSubstring.includes(nodeEdgeListToken)){
						var targetListStartIndex = edgeListSubstring.indexOf(nodeEdgeListToken) + 3 + nodeTrueAddressLength;
						var targetListSubstring = edgeListSubstring.substring(targetListStartIndex)
						var targetListEndIndex = targetListSubstring.indexOf('}')
						targetListSubstring = targetListSubstring.substring(0, targetListEndIndex);
						if (targetListSubstring.includes(targetTrueAddress)){
							return;
						} else {
							var insertIndex = dbSubstringIndex + nodeNetSubstringIndex + edgeListStartIndex + targetListStartIndex + targetListEndIndex;
							var prependString = diffString.substring(0,insertIndex);
							var postpendString = diffString.substring(insertIndex);
							var appendThis = `,${targetTrueAddress}`
							return prependString + appendThis + postpendString;
						}
					} else {
						var targetListStartIndex = (edgeListSubstring.indexOf(nodeEdgeToken) + 2 + nodeTrueAddressLength);
						var prevTarget = "";
						for (var i = targetListStartIndex; i < edgeListSubstring.length ; i++){
							var addressLetters = ['l','w','u','0','1','2','3','4','5','6','7','8','9'];
							if (addressLetters.includes(edgeListSubstring[i])){
								prevTarget += edgeListSubstring[i];
							} else {
								break;
							}
						}
						var prevTargetLength = prevTarget.length
						var appendThis = `{${prevTarget},${targetTrueAddress}}`
						var insertIndex = dbSubstringIndex + nodeNetSubstringIndex + edgeListStartIndex + targetListStartIndex;
						var prependString = diffString.substring(0,insertIndex);
						var postpendString = diffString.substring(insertIndex + prevTargetLength);
						return prependString + appendThis + postpendString;
					}
				} else {
					var insertIndex = dbSubstringIndex + nodeNetSubstringIndex + edgeListEndIndex;
					var appendThis = nodeEdgeToken + `${targetTrueAddress}`;
					var prependString = diffString.substring(0,insertIndex);
					var postpendString = diffString.substring(insertIndex);
					return prependString + appendThis + postpendString;
				}
			} else {
				if (edgeListSubstring.includes(nodeDEdgeToken)){
					if (edgeListSubstring.includes(nodeDEdgeListToken)){
						var targetListStartIndex = edgeListSubstring.indexOf(nodeDEdgeListToken) + 3 + nodeTrueAddressLength;
						var targetListSubstring = edgeListSubstring.substring(targetListStartIndex)
						var targetListEndIndex = targetListSubstring.indexOf('}')
						targetListSubstring = targetListSubstring.substring(0, targetListEndIndex);
						if (targetListSubstring.includes(targetTrueAddress)){
							return;
						} else {
							var insertIndex = dbSubstringIndex + nodeNetSubstringIndex + edgeListStartIndex + targetListStartIndex + targetListEndIndex;
							var prependString = diffString.substring(0,insertIndex);
							var postpendString = diffString.substring(insertIndex);
							var appendThis = `,${targetTrueAddress}`
							return prependString + appendThis + postpendString;
						}
					} else {
							var targetListStartIndex = edgeListSubstring.indexOf(nodeEdgeToken) + 2 + nodeTrueAddressLength;
						var prevTarget = "";
						for (var i = targetListStartIndex; i < (edgeListSubstring.length) ; i++){
							var addressLetters = ['l','w','u','0','1','2','3','4','5','6','7','8','9'];
							if (addressLetters.includes(edgeListSubstring[i])){
								prevTarget += edgeListSubstring[i];
							} else {
								break;
							}
						}
						var appendThis = `{${prevTarget},${targetTrueAddress}}`
						var insertIndex = dbSubstringIndex + nodeNetSubstringIndex + edgeListStartIndex + targetListStartIndex;
						var prependString = diffString.substring(0,insertIndex);
						var postpendString = diffString.substring(insertIndex);
						return prependString + appendThis + postpendString;
					}
				} else {
					var insertIndex = dbSubstringIndex + nodeNetSubstringIndex + edgeListEndIndex;
					var appendThis = nodeDEdgeToken + `${targetTrueAddress}`;
					var prependString = diffString.substring(0,insertIndex);
					var postpendString = diffString.substring(insertIndex);
					return prependString + appendThis + postpendString;
				}
			}
		};


		if (shouldAppendDBDiff(diffString, dbTruAddress)){
			diffString = appendDBDiff(diffString, dbTruAddress);
			
		};
		
		if (shouldAppendNNDiff(diffString, nnTruAddress, dbTruAddress)){
			
			diffString = appendNNDiff(diffString, nnTruAddress, dbTruAddress);
		};
		diffString = appendEdge(diffString, truAddressA, truAddressB, nnTruAddress, dbTruAddress, deletionBool, directionalBool)
		console.log(diffString)
		this.data.graphDiffString = diffString
		localStorage.setItem('graphDiffString', diffString);
		return diffString;
	};

	saveFileManager.storeUserWritable = function (name, text, specifiedIndex) {
		var index = ''
		if ((!specifiedIndex || specifiedIndex === undefined) && specifiedIndex !== 0){
			index = localStorage.getItem('user_rdbl_count');
			console.log(index)
		} else {
			index = specifiedIndex;
		}
		var newCount = (parseInt(index) + 1).toString();

		var key = `user_rdbl_${index}`
		var value = `${name}@&^%@_fuckyou_^^@%#${text}`

		localStorage.setItem(key, value);

		localStorage.setItem('user_rdbl_count', newCount);
	};

	saveFileManager.retrieveUserWritable = function (index) {
		if (index === undefined){
			return;
		}
		var returnObject = {
			name : "",
			text : ""
		}
		var key = `user_rdbl_${index}`;

		var value = localStorage.getItem(key);
		var fields = value.split(`@&^%@_fuckyou_^^@%#`);

		returnObject.name = fields[0];
		returnObject.text = fields[1];

		return returnObject;
	};

	saveFileManager.storeUserWormTongue = function (name, text) {
		var index = ''
		if ((!specifiedIndex || specifiedIndex === undefined) && specifiedIndex !== 0){
			index = localStorage.getItem('user_wmt_count');
		} else {
			index = specifiedIndex;
		}
		var newCount = (parseInt(index) + 1).toString();

		var key = `user_wmt_${index}`
		var value = `${name}@&^%@_fuckyou_^^@%#${text}`

		localStorage.setItem(key, value);

		localStorage.setItem('user_wmt_count', newCount);
	};

	saveFileManager.retrieveUserWormTongue = function (index) {
		if (index === undefined){
			return;
		}
		var returnObject = {
			name : "",
			text : ""
		}
		var key = `user_wmt_${index}`;

		var value = localStorage.getItem(key);
		var fields = value.split(`@&^%@_fuckyou_^^@%#`);

		returnObject.name = fields[0];
		returnObject.text = fields[1];

		return returnObject;
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
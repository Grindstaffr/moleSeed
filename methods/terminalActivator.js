import { Terminal } from './terminalClass.js'
import { buildAnimations } from './fullScreenAnimations.js'
import { saveFileManagerConstructor } from './saveFileManager.js'
import { nodeAttachmentHandlerConstructor } from './nodeAttachmentHandler.js'

export class TerminalActivator {
	constructor (canvas, globalProps, nodeVerse) {
		this.terminals = {};
		this.canvas = canvas;
		this.context = canvas.getContext('2d')
		this.globalProps = globalProps;
		this.nodeVerse = nodeVerse;
		this.devMode = true;
		this.shouldClick = true;
		this.saveFileManager = saveFileManagerConstructor(this);
		this.nodeAttachmentHandler = nodeAttachmentHandlerConstructor(this.nodeVerse, this.saveFileManager);
		this.activeTerminal = {};
		this.saveFileManager.handleStartUp();

		//this.addTerminal();
		//this.activateTerminal(0);
		console.log(this.activeTerminal)
		this.terminalDimensions = this.activeTerminal.__calcLocAndDim();
		this.activeTerminal.cache.rescaleCache();
		this.keyHandler = this.keyHandler.bind(this)
		this.animator = buildAnimations(canvas, this.selectColorScheme(0), this.terminalDimensions, globalProps.letterHeight);
	}
	selectColorScheme (int) {
		if (int > 3){
			return
		}
		if (int < 0){
			return;
		}
		const schemes = {
			0 : {
				background: "#01060D",
				text : "#EEF0FF",
				stroke : "#EEF0FF",

			},
			1 : {
				/*background: "#0000AA",*/
				background: "#01060D",
				text : "#AABBFF",
				stroke : "#AABBFF",

			},
			2 : {
				/*background: "#27190A",*/
				background: "#01060D",
				text : "#F6D158",
				stroke : "#F6D158",

			},
			3 : {
				/*background: "#13250F",*/
				background: "#01060D",
				text : "#A9FFA3",
				stroke : "#A9FFA3",

			},
		}
		return schemes[int]
	}

	restoreTerminal (index, saveFileCallbackObject){
		console.log( index, saveFileCallbackObject);
		this.terminals[index] = new Terminal(this.canvas, this.globalProps, this.nodeVerse.getDefaultNode(), this.selectColorScheme(index), this, index);
		this.activateTerminal(index);
		this.terminals[index].exists = true;
		this.terminalDimensions = this.activeTerminal.__calcLocAndDim();
		this.activeTerminal.cache.rescaleCache();
		this.terminals[index].__calcLocAndDim();
		var trmnlAct = this;
		setTimeout(function(){saveFileCallbackObject.ex(trmnlAct.terminals[index]);})
		

		//saveFileCallbackObject.ex(this.terminals[index]);
		console.log(this.terminals[index])
	}

	addTerminal (saveFileCallback) {
		//needs to catch if node can handle novel terminal
		console.log('old_rat... please implement catch for newRemote_sysmem>nodeDepth when instantiating new terminals')
		if (!node){
			var node = this.nodeVerse.getDefaultNode();
		}
		var currentTerminalCount = Object.keys(this.terminals).length
		if (currentTerminalCount === 4){
			console.log('here')
			this.activeTerminal.api.throwError(`Max Terminal Capacity... cannot add any more terminals`)
			return false; 
		}
		this.terminals[currentTerminalCount] = new Terminal(this.canvas, this.globalProps, node, this.selectColorScheme(currentTerminalCount), this, currentTerminalCount)
		this.terminals[currentTerminalCount].api.reallocateMemoryOnActiveNode();

		this.updateMultiterminalValues('help_count', this.saveFileManager.getUniversalValue('help_count'));
		this.updateMultiterminalValues('p_ac_count', this.saveFileManager.getUniversalValue('p_ac_count'));
		//need to mod savefil here
		this.terminals[currentTerminalCount].exists = true;
		return true;
		
	}

	isTerminalAtIndex (number) {
		if (this.terminals[number] && this.terminals[number].type === 'terminal'){
			return true;
		} else {
			return false;
		}
	}

	getTerminalCount () {
		return (Object.keys(this.terminals).length)
	}

	activateTerminal (number) {
		Object.keys(this.terminals).forEach(function(terminalIndex){
		
			if (terminalIndex === number.toString()){
				this.activeTerminal = this.terminals[terminalIndex]
				this.activeTerminal.activeNode.assembleVisibleAdjacencies();
				this.activeTerminal.api.assembleAccessibleNodes();
				Object.keys(this.activeTerminal.programs).forEach(function(programName){
					if (programName === 'runningPrograms'){
						return;
					}
					this.programs[programName].api = this.api;
					this.programs[programName].data = this.api.getData(programName);
				}, this.activeTerminal);
				this.terminals[terminalIndex].isActiveTerminal = true;
				this.activeTerminal.__calcLocAndDim();
				return;
			} else {
				this.terminals[terminalIndex].isActiveTerminal = false;
			}
		}, this);
		
	}
	handleAttachingNodes (tru) {
		this.nodeAttachmentHandler.attachNodes()
	}

	addRemoveEdge (nodeATrueAddress, nodeBTrueAddress, removeToggle, symmetricToggle) {
		this.saveFileManager.addRemoveEdge(nodeATrueAddress, nodeBTrueAddress, removeToggle, symmetricToggle);
	}

	addRemoveNode (nodeTrueAddress, removeToggle) {
		this.saveFileManager.addRemoveNode(nodeTrueAddress, removeToggle);
	}

	getUniversalValue(key){
		return this.saveFileManager.getUniversalValue(key)
	}

	updateUniversalValue (key, value) {
		try {
			this.saveFileManager.updateUniversalValue(key, value);
		} catch (error) {
			return;
		}
		this.updateMultiterminalValues(key, this.saveFileManager.getUniversalValue(key));
	}

	updateMultiterminalValues (key, value) {
		var trmnlAct = this;
		const keyUpdateRouter = {
			'p_ac_count' : function (value) {
				var number = value
				if (typeof number !== 'number'){
					number = parseInt(number);
				}
				if (Number.isNaN(number)){
					console.log(`Cannot set UniversalValue p_ac_count to ${value}... ${value} is not a number`);
					return;
				}
				Object.keys(trmnlAct.terminals).forEach(function(terminalIndex){
					if (trmnlAct.terminals[terminalIndex].exists){
						if (trmnlAct.terminals[terminalIndex].compiler.verifyAddOnInstalled('autoCorrectArgs')){
							trmnlAct.terminals[terminalIndex].compiler.addOns.autoCorrectArgs.fuckUpObject.fuckUpCount = number
						};
					}
				},trmnlAct)
			},
			'help_count' : function (value) {
				var number = value
				if (typeof number !== 'number'){
					
					console.log(value);
				}
				if (Number.isNaN(number)){
					console.log(`Cannot set UniversalValue p_ac_count to ${value}... ${value} is not a number`);
					return;
				}
				Object.keys(trmnlAct.terminals).forEach(function(terminalIndex){
					if (trmnlAct.terminals[terminalIndex].exists){
						if (trmnlAct.terminals[terminalIndex].command.help){
							trmnlAct.terminals[terminalIndex].command.help.helpCount = number
						};
					}
				},trmnlAct)

			},
		}
		if (Object.keys(keyUpdateRouter).includes(key) && (typeof keyUpdateRouter[key] === 'function')){
			keyUpdateRouter[key](value);
		} else {
			console.log(`cannot update ${key}... no such func in keyUpdateRouter (TerminalActivator)`)
			return;
		}
	};


	updateTerminalValue (key, value, index) {
		try {
			this.saveFileManager.updateTerminalValue(key, value)
		} catch (error) {
			return;
		}
		const keyUpdateRouter = {
			exists : function () {},
			prgmList : function () {},
			storedNodes : function () {},
			activeNode : function () {},
			hist : function () {},
			cache : function () {},
		}
	};

	getTerminalValue (key, index) {
		var trmnlAct = this;
		const keyRouter = {
			'exists' : function (index) {
				if (trmnlAct.terminals[index] === undefined){
					return false;
				}
				if (trmnlAct.terminals[index].exists){
					return true;
				}
				return false;
			},
			'prgmList' : function (index) {
				if (!trmnlAct.terminals[index].exists){
					console.log(`cannot retrieve property prgmList... terminal${index} does not exist`);
					return;
				}
				var programs = trmnlAct.terminals[index].api.getPrograms()
				if (programs === undefined){
					console.log(`cannot retrieve property prgmList... trmnlAct.terminals[${index}].api.getPrograms() returned undefined`);
					return;
				}
				var programNames = Object.keys(programs).filter(function(programName){
					return programName !== 'runningPrograms';
				},this);
				var list = programNames.map(function(programName){
					return programs[programName].trueAddress;
				});
				return list.reduce(function(accumulator, currentValue, index){
					if (!currentValue){
						return accumulator
					}
					return accumulator + '@' +  currentValue
				}, "")
			},
			'storedNodes' : function (index) {
				if (!trmnlAct.terminals[index].exists){
					console.log(`cannot retrieve property storedNodes... terminal${index} does not exist`)
					return "";
				}
				var programs = trmnlAct.terminals[index].api.getPrograms()
				if (!Object.keys(programs).includes(`rucksack.ext`)){
					console.log(`cannot retrieve property storedNodes... terminal${index} has no rucksack`)
					return "";
				}
				return programs[`rucksack.ext`].data.storedNodes.reduce(function(accumulator, currentNodeObject, index){
					if (currentNodeObject.name === '[EMPTY SLOT]'){
						return accumulator
					} else {
						if (isNaN(parseInt(currentNodeObject.getTrueAddress()))){
							var initialChar = currentNodeObject.getTrueAddress()[0]
							if (initialChar === 'l' || initialChar === 'w' || initialChar === 'e' ){
								if (isNaN(parseInt(currentNodeObject.getTrueAddress().substring(1)))){
									console.log('TRUEADDRESS ERROR');
									return accumulator;
								}
							} else {
								return accumulator;
							}
						}
						return accumulator + '#' + index + '@' + currentNodeObject.getTrueAddress();
					}
				}, "");
			},
			'activeNode' : function (index) {
				if (!trmnlAct.terminals[index].exists){
					console.log(`cannot retrieve property ${activeNode}... terminal${index} does not exist`)
				}

				return trmnlAct.terminals[index].activeNode.getTrueAddress();
			},
			'hist' : function (index) {
				if (!trmnlAct.terminals[index].exists){
					console.log(`cannot retrieve property ${hist}... terminal${index} does not exist`)
				}

				return trmnlAct.terminals[index].command.mv.prevNodes.reduce(function(accumulator, prevNode, index, arr){
					if (prevNode && prevNode.getTrueAddress !== undefined){
						if (index === arr.length -1){
							return accumulator + prevNode.getTrueAddress()
						}
						return accumulator + prevNode.getTrueAddress() + ','
					} else {
						return accumulator
					}
				}, "")
			},
			'cache' : function (index) {
				if (!trmnlAct.terminals[index].exists){
					console.log(`cannot retrieve property ${cache}... terminal${index} does not exist`)
				}
				var rowCount = trmnlAct.terminals[index].api.getRowCount();
				var reservedRows = trmnlAct.terminals[index].api.getReservedRowCount();
				var currentRows = [];

				currentRows.pop();
				trmnlAct.terminals[index].cache.currentRows.slice().reverse().forEach(function(row, index){
					currentRows.unshift(row)
					if (index === 0){
						currentRows.shift();
					}
				});
				if (currentRows[0] === undefined){
					console.log('broken erly')
				}

				if (reservedRows > 0){
					var hiddenRows = trmnlAct.terminals[index].api.getHiddenRows();
					console.log(hiddenRows.rows)
					for (var i = 0; i < hiddenRows.rowCount -1 ; i ++){
						currentRows.splice(i, 1, hiddenRows.rows.pop());
					}
				}

				return currentRows.reduce(function(accumulator, currentRow, index){
					if (!currentRow){
						console.log(index)
						debugger;
					}
					var rowAsString = currentRow.reduce(function(accumulator, currentLetter){
						return accumulator + currentLetter;
					}, "");
					return accumulator + rowAsString + '\\PP';
				},`${rowCount}%`)
			},
		}
		if (Object.keys(keyRouter).includes(key)){
			return keyRouter[key](index);
		} else {
			console.log('key mismatch (TerminalActivator.getTerminalValue)');
			return;
		}
	}

	clearStorage () {
		console.log('routing clearStorage to saveFileManager')
		this.saveFileManager.clearStorage();
		this.saveFileManager.initializeStorage();
	}

	draw () {
		if (this.animator.isDrawing){
			this.animator.setDimensions(this.activeTerminal.__calcLocAndDim());
			this.animator.draw();
			return;
		}
		if (this.helpNeeded){
			var height = window.innerHeight;
			var width = window.innerWidth;
			this.context.fillStyle = this.selectColorScheme(0).text
			var lineA = `make the browser fullscreen, (don't just maximize)`
			var lineB = `then press the    ~ \`   key`
			this.context.fillText(lineA, ((width/2) - (this.globalProps.letterHeight * lineA.length)), (height/2) - (this.globalProps.letterHeight * 2))
			this.context.fillText(lineB, ((width/2) - (this.globalProps.letterHeight * lineB.length)), (height/2) + (this.globalProps.letterHeight * 2))
			return;
		}
		if (!this.activeTerminal.isOn){
			this.context.fillStyle = this.selectColorScheme(0).text
			this.clickX = (this.canvas.width - 20*(this.globalProps.letterHeight))
			this.clickY = (this.canvas.height - 2*(this.globalProps.letterHeight))
			this.context.fillText(`F11 isn't working`, this.clickX, this.clickY )
		}
		this.activeTerminal.draw();
	}
	mouseHandler(e){
		if (!this.shouldClick){
			return;
		}
		
		this.mouseX = e.offsetX;
		this.mouseY = e.offsetY;
	}
	clickHandler(e){
		if (!this.shouldClick){
			return
		}
		if (this.helpNeeded){
			this.helpNeeded = false;
		}
		if ((this.mouseX + 50) >= this.clickX){
			if ((this.mouseY + 50) >= this.clickY){
				this.helpNeeded = true;
			}
		}

	}
	keyHandler(e){
	
		if(e.keyCode === 8 || e.keyCode === 222 || e.keyCode === 191){
			e.preventDefault();
		};
		if (!this.activeTerminal.isOn){
			if (e.keyCode === 122 || e.keyCode === 192){
				if (e.keyCode === 122){
					if (!window.screenTop && !window.screenY){
						e.preventDefault();
					}
				}
				if (!this.devMode){
					this.canvas.width = window.screen.width;
					this.canvas.height = window.screen.height;
					this.shouldClick = false;
					this.helpNeeded = false;
					this.canvas.letterspacing = '0px'
					this.canvas.fontkerning = 'none'
					this.canvas.style.fontfamily = 'terminalmonospace'
					this.canvas.style.cursor = "none";
					this.context.font = `${this.globalProps.letterSize}px terminalmonospace`
					this.activeTerminal.turnOn(this.animator.bootUp);

					this.activeTerminal.__calcLocAndDim();
				}
			}
			return;
		};
		if (this.activeTerminal.isOn){
			if (e.keyCode === 122 || e.keyCode === 192){
				this.activeTerminal.turnOff()
				this.shouldClick = true
				this.activeTerminal.__calcLocAndDim();
				delete this.canvas.style.cursor
				return;
			}
			this.activeTerminal.keyHandler(e);
			return;
		}
	}

	keyUpHandler(e){
		if (this.activeTerminal.isOn){
			this.activeTerminal.keyUpHandler(e)
			return;
		}
	}
}
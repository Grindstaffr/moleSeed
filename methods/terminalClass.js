import {compilerBuilder} from './compiler.js'

export class Terminal {
	constructor (canvas, globalProps, node, colorScheme, terminalActivator, index) {
		this.type = 'terminal'
		this.activeNode = node;
		
		this.accessibleNodes = [];
		this.accessibleMalware = [];
		
		this.canvas = canvas;

		this.context = this.canvas.getContext('2d');

		this.letterSize = globalProps.letterSize;
		this.letterHeight = globalProps.letterHeight;
		this.maxRowWidth = globalProps.maxRowWidth;
		this.maxRowCount = globalProps.maxRowCount;

		this.terminalActivator = terminalActivator;
		this.devMode = terminalActivator.devMode;
		this.isActiveTerminal = true;
		this.index = index;

		this.style = colorScheme;

		this.__calcLocAndDim();

		this.programs = this.constructPrograms();
		this.cache = this.constructCache();
		this.command = this.constructCommands(this.cache, this);
		//this.compiler = this.constructCompiler(this.command, this);
		this.api = this.constructAPI();
		this.compiler = compilerBuilder(this)
		this.input = this.constructInput(this);
		this.keyRouter = this.constructKeyRouter(this);
		this.blinkyCursor = this.constructBlinkyCursor(this,this.style);
		this.animations = this.constructAnimations(this.context, this.api, this);
		this.memoryManager = this.constructMemoryManager(this)

		if (terminalActivator.devMode){
			this.turnOnDev();
		}
	}

	turnOff () {
		this.isOn = false;
		this.__calcLocAndDim();
	}
	turnOnDev() {
		this.isOn = true;
		this.__calcLocAndDim();
	}

	turnOn (callbackA) {
		this.isOn = true;
		var trmnl = this;
		if (this.hasBooted) {
			trmnl.api.clearContiguousRows(0)
			trmnl.api.lockInput()
			setTimeout(function (){
			trmnl.api.unlockInput();
			trmnl.__calcLocAndDim();
			trmnl.animations.reBootLoaderAnim.ex()
			}, 1000)
			setTimeout(function () {
			trmnl.__calcLocAndDim();
			if (callbackA){
				callbackA(function () {
					trmnl.api.unlockInput();
					trmnl.api.writeLine('moleSeed v.6.2.31', true, true, 6)
					trmnl.api.writeLine('relink successful...');
				});
			}
		}, 7650)
			return;
		}
		trmnl.api.lockInput()
		setTimeout(function (){
			trmnl.__calcLocAndDim();
			trmnl.animations.biosAnim.ex()
		}, 1000)

		setTimeout(function (){
			trmnl.__calcLocAndDim();
			trmnl.animations.bootLoaderAnim.ex();
		}, 6350)
		

		setTimeout(function () {
			trmnl.__calcLocAndDim();
			if (callbackA){
				callbackA(function () {
					trmnl.api.unlockInput();
					trmnl.api.writeLine('moleSeed v.6.2.31', true, true, 6)
					trmnl.api.writeLine('boot successful...');
					trmnl.hasBooted = true;
				});
			}
		}, 13000)

	}

	draw () {
		if (!this.isActiveTerminal){
			return;
		}
		if (!this.isOn){
			this.context.fillStyle = "#CCFFFF"
			var height = window.innerHeight;
			var width = window.innerWidth;
			this.context.fillText(`Press 'F11' to boot moleSeed.mkr`, ((width/2) - this.letterHeight * 16), ((height/2)-this.letterHeight));
			return;
		}

		//console.log('drawing Terminal')
		this.context.strokeStyle = this.style.stroke

		this.context.beginPath();
		this.context.rect(this.leftLoc , this.topLoc, this.pxEdgeDimensions +2, this.pxEdgeDimensions+2)
		this.context.stroke();

		this.drawInputRow();
		this.drawCurrentRows();
		this.blinkyCursor.draw();

		if (this.api.drawTriggerFunctions.length > 0){
			this.api.drawTriggerFunctions.forEach(function(funcObj){
				funcObj.func();
			})
		};
	}
	generateAddress (number) {
		const map = {
		0 : '0',
		1 : '1',
		2 : '2',
		3 : '3',
		4 : '4',
		5 : '5',
		6 : '6',
		7 : '7',
		8 : '8',
		9 : '9',
		10 : 'a',
		11 : 'b',
		12 : 'c',
		13 : 'd',
		14 : 'e',
		15 : 'f',
		16 : 'g',
		17 : 'h',
		18 : 'i',
		19 : 'j',
		20 : 'k',
		21 : 'l',
		22 : 'm',	
		23 : 'n',
		24 : 'o',
		25 : 'p',
		26 : 'q',
		27 : 'r',
		28 : 's',
		29 : 't',
		30 : 'u',
		31 : 'v',
		32 : 'w',	
		33 : 'x',
		34 : 'y',
		35 : 'z',
		36 : '!',
		37 : '=',
		38 : '%',
		39 : '+',
		40 : '$',
		41 : '<',
		42 : '>',
		43 : '&',
		44 : '#',
		45 : '*',
		46 : '"',
		47 : '?',
		48 : ''	,			
		};

		var output = "";

		for (var i = 0; i < number; i ++){
			var selector = Math.floor(Math.random() * 48)
			output = output + map[selector];
		};

		return output;
	};

	setContext (context) {
		this.context = (context)
		this.context.font = `8px terminalmonospace`
	}


	/*
	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	Input row spillover functions (in cache)
	not updated when cursor re-indexing occurred
	input row needs refactoring.
	when input strings are longer than this.api.getRowCount()
	theres some seriously buggy behavior
	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	*/

	drawInputRow  () {
		var line = this.cache.inputRow.join("")
		/*
		this.cache.inputRow.forEach(function(letter, index){
			line = line + letter;
		})
		*/
		//console.log(this.botLoc)
		//console.log(this.style.text)
		this.context.fillStyle = this.style.text
		var bot = this.botLoc - (this.letterHeight/2 + this.tinyBuff)
	
		this.context.fillText('>',this.leftLoc + this.tinyBuff + this.letterHeight/2, bot)

		if (line.length === 0){
			return;
		}
		for (var i = 0 ; i < Math.min(line.length, (this.api.getRowCount()-1)); i ++){
			this.context.fillText(`${line[i]}`, this.leftLoc + this.tinyBuff + this.letterHeight/2 + (this.letterHeight * (i + 1)), bot)
		}
	}

	drawCurrentRows () {
		if (!this.fiskasd || this.fiskasd === undefined){
			console.log(this);
			this.fiskasd = 1;
		}
		var vStart = this.topLoc + this.letterHeight + this.letterHeight/2 + this.tinyBuff
		var hStart = this.leftLoc + this.letterHeight/2 + this.tinyBuff
		var trmnl = this
		this.context.fillStyle = this.style.text 
		this.cache.currentRows.forEach(function(row, rowIndex){
			row.forEach(function(character, characterIndex){
				var vLoc = vStart + (rowIndex * trmnl.letterHeight)
				var hLoc = hStart + (characterIndex * trmnl.letterHeight)
				if (Object.keys(this.cache.highlights).includes(rowIndex.toString())){
					if(this.cache.highlights[rowIndex.toString()].includes(characterIndex)){
						this.context.fillRect(hLoc, (vLoc - this.letterHeight), this.letterHeight + .05, this.letterHeight+ .05)
						this.context.fillStyle = this.style.background;
						this.context.fillText(character, hLoc, vLoc)
						this.context.fillStyle = this.style.text;
						return;
					}
				};
				this.context.fillText(character, hLoc, vLoc)
			},this)
		},this)	
	}

	keyUpHandler (e) {
		if (this.api.usingKeyUpHandling()){
			this.api.useKeyUpRouter(e)
		} else {
			return;
		}
	}

	keyHandler  (e) {
		if (this.api.alternateKeyRouterActive()){
			this.api.useAltKeyRouter(e);
			return;
		}
		if (e.keyCode === 112 || e.keyCode === 113 || e.keyCode === 114 || e.keyCode === 115){
			e.preventDefault();
			this.keyRouter.route(e)
			return;
		}
		if (e.keyCode === 27 || e.keyCode === 9){
			console.log(e.keyCode)
			e.preventDefault();
			this.keyRouter.route(e)
			return;
		}
		if (this.inputIsLocked){
			e.preventDefault();
			return;
		}
		this.keyRouter.route(e);
	}

	constructKeyRouter  (parent) {
		const keyRouter = {
			parent : parent,
			route : function (e) {
				var code = e.keyCode;
				if (this.specialKeys.includes(code.toString())){
					this[code.toString()]();;
					return;
				} else {
					this.handleGeneralCase(e);
				}
			},
			specialKeys : ['8','9','13','16','37','38','39','40','112','113','114','115'],
			'8' : function () {
				var cache = this.defineCache();
				cache.deleteFromInput();
				//cache.deletedText.push(cache.inputRow.pop());
				//THIS WILL CHANGE IF WE IMPLEMENT HIGHLIGHTING
				this.parent.blinkyCursor.position.leadTheText();		
			},//backspace
			'9' : function () {
				console.log('firing tab')
				var cache = this.defineCache();
				cache.wipeInput();
				cache.retrieveNextArchivedInput();
			},
			'13' : function () {
				
				this.parent.input.inputCommand();
			},//enter
			'16' : function () {
				//make Uppercase
			},
			'18' : function () {

			},
			'37' : function () {
				this.parent.blinkyCursor.position.left()
			},//back (undo)
			'38' : function () {
				this.parent.blinkyCursor.position.up()
			/*	var value = e.key.toString();
				var cache = this.defineCache();
				var index = cache.prevInputIndex;
				var indexMax = (cache.previousInputRows.length - 1)
				if (index === -1){
					return;
				}
				cache.inputRow = cache.previousInputRows[index]
				if (index === 0){
					cache.prevInputIndex = indexMax;
				} else {
					cache.prevInputIndex = index - 1;
				}
			*/
			},//upArrow
			'39' : function () {
				//console.log('right')
				this.parent.blinkyCursor.position.right()
			}, // forward (redo)
			'40' : function () {
				this.parent.blinkyCursor.position.down()
			},//downArrow
			'112' : function () {
				if (this.parent.index === 0) {
					if (this.parent.isActiveTerminal){
						return;
					}
				}
				if (!this.parent.terminalActivator.isTerminalAtIndex(0)){
					return;
				}
				this.parent.api.activateTerminalAtIndex(0)
			},
			'113' : function () {
				if (this.parent.index === 1) {
					if (this.parent.isActiveTerminal){
						return;
					}
				}
				if (!this.parent.terminalActivator.isTerminalAtIndex(1)){
					return;
				}
				this.parent.api.activateTerminalAtIndex(1)
			},
			'114' : function () {
				if (this.parent.index === 2) {
					if (this.parent.isActiveTerminal){
						return;
					}
				}
				if (!this.parent.terminalActivator.isTerminalAtIndex(2)){
					return;
				}
				this.parent.api.activateTerminalAtIndex(2)
			},
			'115' : function () {
				if (this.parent.index === 3) {
					if (this.parent.isActiveTerminal){
						return;
					}
				}
				if (!this.parent.terminalActivator.isTerminalAtIndex(3)){
					return;
				}
				this.parent.api.activateTerminalAtIndex(3)
			},
			handleGeneralCase : function (e) {
				var value = e.key.toString();
				var cache = this.defineCache();
				if (value.length === 1){
					//console.log(cache)
					cache.writeToInputRow(value);
				};
				if(this.parent.blinkyCursor.typeMode){
					this.parent.blinkyCursor.position.slamDown();
					this.parent.blinkyCursor.position.leadTheText();
				}
				return;
			},
			defineCache : function () {
				return this.parent.cache;
			}
		}
		return keyRouter;
	}

	constructBlinkyCursor (context, style) {
		const blinkyCursor = {}
		blinkyCursor.draw = function () {
			var left_relative = this.position.x * this.parent.letterHeight;
			var top_relative = ((this.cache.rowCount - 1 - this.position.y) * this.parent.letterHeight)
			var leftTrue = Math.min((this.parent.leftLoc + left_relative + ((3*this.parent.letterHeight)/2)), (this.parent.leftLoc + ((this.parent.api.getRowCount()-.5)*this.parent.letterHeight)));

			var topTrue = this.parent.topLoc + this.parent.letterHeight/2;

			//console.log(`${topTrue} <-tt   pos.y -> ${this.position.y}`)

			topTrue = topTrue + top_relative
			//console.log( this.botLoc + '<-bl lh->' + this.letterHeight + 'tb->' + this.tinyBuff) 
			//this.parent.botLoc - this.parent.letterHeight - (this.position.y * this.parent.letterHeight)
			//this.parent.topLoc + top_relative ;
			this.parent.context.fillStyle = this.style.background
			this.blink();
			if (this.position.y === 0){
				topTrue = (this.parent.botLoc - (this.parent.letterHeight/2 + this.parent.tinyBuff)) - this.parent.letterHeight
			}
			this.parent.context.fillRect(leftTrue, topTrue, this.parent.letterHeight, this.parent.letterHeight)
			if (this.position.y === 0){
				if (this.position.x < this.parent.cache.inputRow.length){
					this.parent.context.fillStyle = this.style.text
					this.parent.context.fillText(this.parent.cache.inputRow[this.position.x], leftTrue, topTrue + this.parent.letterHeight)
					return;
				}
			}
			if (this.position.x < this.parent.api.getRowCount()){
				this.parent.context.fillStyle = this.style.text
			
				var row = this.parent.cache.currentRows[this.parent.api.getRowCount() - this.position.y - 1]
				if (!row){
					return;
				}
				var letter = row[this.position.x + 1]
				if (letter !== '' && letter !==undefined){
					this.parent.context.fillText(letter, leftTrue, topTrue + this.parent.letterHeight)
				}
			}
		};
		blinkyCursor.toggleColorInverse = function () {
			var hold = this.style.background;
			this.style.background = this.style.text;
			this.style.text = hold;
		};
		blinkyCursor.setBright = function () {
			this.style.background = this.parent.style.text;
			this.style.text = this.parent.style.background;
			this.counter = 1;
		};
		blinkyCursor.blink = function () {
			if (this.counter % this.blinkTiming  === 0) {
				this.toggleColorInverse();
				this.counter = 1;
			} else {
				this.counter = this.counter + 1;
			}
		};
		blinkyCursor.init = function (context, style) {
			this.typeMode = true;
			this.position = {
				x : 0,
				y : 0,
				up : function () {
					if (this.y >= (this.parent.parent.api.getRowCount())){
						this.y = this.parent.parent.api.getRowCount();
						return;
					}
					this.y = this.y + 1;
					this.parent.setBright();
				},
				down : function () {
					if (this.y === 0){
						return;
					}
					this.y = this.y - 1;
					this.parent.setBright();
				},
				left : function () {
					if (this.x === 0){
						return;
					}
					this.x = this.x - 1;
					this.parent.setBright();
				},
				right : function () {
				//	console.log(this.parent.trmnl.maxRowWidth)
					if (this.x === this.parent.trmnl.api.getRowCount()-2){
						return;
					}
					this.x = this.x + 1;
					this.parent.setBright();
				},
				slamDown : function () {
					this.y = 0;
					this.parent.setBright();
				},
				slamLeft : function () {
					this.x = 0;
					this.parent.setBright();
				},
				leadTheText : function() {
					this.x = this.parent.trmnl.cache.inputIndex;
				},
			};
			this.counter = 1;
			this.blinkTiming = 13;
			this.trmnl = context;
			this.parent = context;
			this.position.parent = this;
			this.cache = context.cache
			this.style = {
				background : style.background,
				text : style.text,
			};
		}
		blinkyCursor.init(context, style);
		return blinkyCursor;
	}

	__calcLocAndDim  () {


		var dim = Math.floor((Math.floor(this.canvas.height * (6/7))/this.letterHeight)) * this.letterHeight
		var vBuff = Math.floor(this.canvas.height * (1/14))
		var hBuff = ((this.canvas.width - dim)/2)
		this.tinyBuff = ((dim/this.letterHeight) - Math.floor(dim/this.letterHeight))/2
		this.leftLoc = hBuff;
		this.topLoc = vBuff;
		this.botLoc = vBuff + dim;
		this.rightLoc = hBuff + dim;
		this.vCenter = this.canvas.height/2
		this.hCenter = this.canvas.width/2
		this.pxEdgeDimensions = dim;
		this.rowCount = Math.floor(dim/this.letterHeight) - 1
		if (this.cache){
			this.cache.rowCount = this.rowCount
			this.cache.rescaleCache();
			console.log(this.rowCount + "<- rc    cr.l ->" + this.cache.currentRows.length)
		}
		console.log('calculatedlocanddim')
		return [dim, this.leftLoc, this.topLoc, this.rowCount];
	}

	constructPrograms () {
		const programs = {};
		programs.runningPrograms = {};
		return programs;
	}

	constructCredentials () {
		const credentials = {};

		
		credentials.getCredentials = function () {

		};

		credentials.addCredential = function () {

		};

		credentials.deleteCredential = function () {

		};

		credentials.overwriteCredential = function () {

		};

		const init = function () {
			const data = {};
			data.service = "";
			data.name = "";
			data.authKey = "";

			credentials.data = data;
		}

		return credentials;
	}

	constructMemoryManager (parent) {
		const memoryManager = {};
		memoryManager.getTotalMemoryUsage = function () {
			var runningTotal = this.defaultMemory;
			var programNameArray = Object.keys(this.parent.programs);

			if (programNameArray.length > 0){
				returnObj.programs = {};
			}
			programNameArray.forEach(function(programName){
				var programMemory = this.getProgramMemoryUsage(programName);
				if (programMemory && !Number.isNaN(programMemory)){
					runningTotal += programMemory;
				}
			}, this);

			runningTotal += this.parent.compiler.fetchMemoryUsage();

		}
		memoryManager.getMemoryUsage = function () {
			var returnObj = {};
			var runningTotal = this.defaultMemory;

			returnObj.remote = this.defaultMemory;

			var programNameArray = Object.keys(this.parent.programs);

			if (programNameArray.length > 0){
				returnObj.programs = {};
			}
			programNameArray.forEach(function(programName){
				if (programName === 'runningPrograms'){
					return;
				}
				var programMemory = this.getProgramMemoryUsage(programName);
				if (typeof programMemory === 'number' && programMemory && !Number.isNaN(programMemory)){
					returnObj.programs[programName] = programMemory;
					runningTotal += programMemory;
				} else if (typeof programMemory === 'object'){
					returnObj.programs[programName] = programMemory;
					runningTotal += programMemory.total;
				} else if (programMemory === undefined){
					console.log(programName)
				}
			}, this);
			returnObj.parser = this.parent.compiler.getMemoryUsageReport();

			runningTotal += this.parent.compiler.fetchMemoryUsage();


			returnObj.total = runningTotal;

			return returnObj;
		};
		memoryManager.getProgramMemoryUsage = function (programName) {
			if (!Object.keys(this.parent.programs).includes(programName)){
				this.api.throwError(`No program found named ${programName}`)
				return undefined;
			} else {
				if (programName === 'runningPrograms'){
					return;
				}
				var programMemoryUsage = this.parent.programs[programName].methods.getMemoryUsage();
				if (!programMemoryUsage){
					this.api.warn(`get_memory_usage func returned undefined for prgm "${programName}"`);
				} else {
					return programMemoryUsage;
				}
				var size = this.parent.programs[programName].size;
				var memory = this.parent.programs[programName].memory;
				if (!size || size === undefined){
						this.api.throwError(`program.size undefined for ${programName}`);
						return undefined;
				}
				if (!memory || memory === undefined){
						this.api.throwError(`program.memory undefined for ${programName}`);
						return undefined;
				}
				return size + memory
			}
		}
		const init = function (parent) {
			memoryManager.parent = parent;
			memoryManager.api = parent.api;
			memoryManager.defaultMemory = 2332; 
		};
		init(parent);
		return memoryManager;
	}
	constructCache  () {
		var cache = {}
		cache.parent = this;
		cache.previousRows = new Array(this.rowCount).fill([]);
		cache.nextRows = new Array(this.rowCount).fill([]);
		cache.currentRows = new Array(this.rowCount).fill([]);
		cache.inputRow = new Array(this.rowCount).fill("");
		cache.inputRowPrev = new Array(this.rowCount).fill("");
		cache.inputRowNext = new Array(this.rowCount).fill("");
		cache.inputIndex = 0;
		cache.inputLength = 0;
		cache.deletedText = new Array(20).fill("");
		cache.previousInputIndex = 0;
		cache.previousInputRows = new Array(10).fill([]);
		cache.previousInputSelector = 0;
		cache.vRowOffset = 0;
		cache.inputRowOffset = 0;
		cache.inputBuffer = [];
		cache.inputBufferVerfied = false;
		cache.highlights = {};

		cache.rescaleCache = function () {
			var oldCurrentRows = []
			this.currentRows.forEach(function(row){
				oldCurrentRows.push(row);
			})

			var newDisplay = new Array(this.rowCount - 1).fill([]);
			var newInput = new Array(this.rowCount).fill("");

			this.previousRows = new Array(this.rowCount).fill([]);
			this.inputRowPrev = new Array(this.rowCount).fill("");
		    this.inputRowNext = new Array(this.rowCount).fill("");

		    var currentCacheLength = this.currentRows.length;
		    var diff = currentCacheLength - this.rowCount;
		    var inputLength = this.inputRow.indexOf("");


		    for (var i = 0; i < inputLength; i++){
		    	 newInput[i] = this.inputRow[i]
		    }
		    if (diff === 0){
			    this.currentRows.forEach(function(row, index){
			    	if (row.length > 0){
			    		newDisplay[index] = row
			    	}
			    },this)
		    } else if (diff > 0){
		    	for (var i = diff; i < currentCacheLength; i ++){
		    		if (!this.currentRows[i]){
		    			this.currentRows[i] = [];
		    		}
		    		if (this.currentRows[i].length >= 0){
		    			newDisplay[(i)-(diff + 1)] = this.currentRows[i]
		    		} 
		    	}
		    } else {
		    	for (var i = 0; i < currentCacheLength ; i ++){
		    		if (!this.currentRows[i]){
		    			this.currentRows[i] = [];
		    		}
		    		if (this.currentRows[i].length >= 0){
		    			newDisplay[(i)-(diff + 1)] = this.currentRows[i]
		    		}
		    	}

		    }

		    this.inputRow = newInput.slice(0,this.rowCount-1)
			this.currentRows = newDisplay.slice(0,this.rowCount-1);
		}.bind(cache)

		cache.reservedRows = 0;
		cache.getInputRow = function () {
			var fullInput = this.inputRowPrev.concat(this.inputRow).concat(this.inputRowNext.reverse()).join("")
			return fullInput
		};
		cache.getVisibleRow = function (index) { 
			return this.currentRows[index].join("")
		};
		cache.writeToInputRow = function (letter){
			if (this.inputIndex === this.inputRow.length - 1){
				if (this.inputRowOffset > this.rowCount){
					return;
				}
				this.inputRowPrev.shift();
				this.inputRowPrev.push(this.inputRow.shift());
				this.inputRow.push(letter);
				this.inputRowOffset = this.inputRowOffset + 1;
				this.inputLength = this.inputLength + 1;
			} else {
				this.inputRow[this.inputIndex] = letter;
				this.inputIndex = this.inputIndex + 1;
				this.inputLength = this.inputLength + 1;
			}
		};
		cache.eliminateBS = function (string){
			var newString = string
			var bsTypeNIndex = newString.indexOf('\n');
			var bsTypeTIndex = newString.indexOf('\t');
			if ((bsTypeNIndex === -1) && (bsTypeTIndex === -1)){
				return newString;
			} else if (bsTypeTIndex === -1) {
				bsTypeTIndex = string.length;
			} else if (bsTypeNIndex === -1) {
				bsTypeNIndex = string.length
			}
			var firstBsIndex = Math.min(bsTypeNIndex, bsTypeTIndex)
			newString = newString.substring(0,firstBsIndex) + newString.substring(firstBsIndex + 1);
			return this.eliminateBS(newString);
		};
		cache.replaceTabs = function(string){
			var newString = string
			var tabIndex = 0;
			var tabIndex = newString.indexOf('\\t');
			if (tabIndex === -1){
				return newString;
			}
			newString = newString.substring(0,(tabIndex)) + "     " + newString.substring(tabIndex + 2);
			return this.replaceTabs(newString);
		};
		cache.composeText = function (str, shouldUnSpace, shouldTab, tabSize){
			var string = this.eliminateBS(str)
			string = this.replaceTabs(str)
			if (!tabSize) {
				tabSize = 5;
			}
			if (!shouldUnSpace){
			
				this.writeEmptyRow();
			}
			var maxSubstring = string.substring(0,this.inputRow.length);
			var metaCharIndex = maxSubstring.indexOf(`\\`)
			if (metaCharIndex >= 0){
				if (string[metaCharIndex + 1] === `n`){
					this.writeToVisibleRow(maxSubstring.substring(0,metaCharIndex));
					
						
						this.writeEmptyRow();
					
					var newString = string.substring(metaCharIndex + 2);
					if (shouldTab){
						newString = "     " + newString;
					}
					this.composeText(newString, shouldUnSpace, shouldTab, tabSize);
					return;
				}
			}
			if (string.length < this.inputRow.length){
				this.writeToVisibleRow(string);
				
					this.writeEmptyRow();
				
				return;
			} else {
				var appropriateIndex = maxSubstring.lastIndexOf(" ");
				if (appropriateIndex < 1){
					appropriateIndex = this.inputRow.length;
				}
				this.writeToVisibleRow(string.substring(0, appropriateIndex));
				if (!shouldUnSpace){
				
					this.writeEmptyRow();
				}
				var newString = string.slice(appropriateIndex, string.length);
				if (shouldTab){
						newString = (" ").repeat(tabSize) + newString;
					}
				this.composeText(newString, shouldUnSpace, shouldTab, tabSize);
				return;
			}
		};
		cache.inputCharScrollPrev = function () {
			if (this.inputRowOffset > 0){
				this.inputRowOffset = this.inputRowOffset - 1;
				this.inputRow.unshift(this.inputRowPrev.pop());
				this.inputRowNext.push(this.inputRow.pop());
			}
		};
		cache.inputCharScrollNext = function () {
			if (this.inputRowOffset < this.inputRow.length){
				this.inputRowOffset = this.inputRowOffset + 1
				this.inputRowPrev.push(this.inputRow.shift());
				this.inputRow.push(this.inputRowNext.pop());
			}

		};
		cache.archiveInput = function () {
			var fullInput = "";
			this.inputRowPrev.forEach(function(letter){
				if (letter === ""){
					return;
				}
				fullInput.push(letter);
				return;
			})
			this.inputRow.forEach(function(letter){
				if (letter === ""){
					return;
				}
				fullInput = fullInput + letter;
				return;
			})
			this.inputRowNext.forEach(function(letter){
				if (letter === ""){
					return;
				}
				fullInput = fullInput + letter;
				return;
			})
			if (fullInput === ""){
				return;
			}
			if (this.previousInputIndex < this.previousInputRows.length ){
				this.previousInputRows[this.previousInputIndex] = fullInput
				this.previousInputIndex = this.previousInputIndex + 1;
				this.previousInputSelector = this.previousInputIndex;
			} else {
				this.previousInputSelector = this.previousInputIndex;
				this.previousInputRows.shift();
				this.previousInputRows.push(fullInput);
			}
		};
		cache.retrieveNextArchivedInput = function () {
			console.log(this.previousInputIndex)
			if (this.previousInputIndex < 0){
				return;
			}
			if (this.previousInputSelector > 0){
				var fullInput = this.previousInputRows[this.previousInputSelector - 1]
				for (var i = 0; i < this.rowCount; i ++){
					if (fullInput[i] === ""){
						break;
					}
					if (!fullInput[i]){
						break;
					}
					this.writeToInputRow(fullInput[i])
				}
				/*
				this.inputRow = fullInput[1];
				this.inputRowPrev = fullInput[0];
				this.inputRowNext = fullInput[2]
				*/
				this.previousInputSelector = this.previousInputSelector - 1;
			} else {
				var fullInput = this.previousInputRows[this.previousInputSelector]
				console.log(this.previousInputRows);
				console.log(this.previousInputSelector);
				for (var i = 0; i < Math.min(this.rowCount, fullInput.length); i ++){
					/*
					if (fullInput[i] === ""){
						break;
					}
					if (!fullInput[i]){
						break;
					}
					*/
					this.writeToInputRow(fullInput[i])
					console.log(this.inputRow)
				}
				/*
				this.inputRow = fullInput[1];
				this.inputRowPrev = fullInput[0];
				this.inputRowNext = fullInput[2]
				*/
				this.previousInputSelector = this.previousInputIndex;
			}
		};
		cache.deleteFromInput = function (){
			if (this.inputIndex === 0){
				return;
			}
			this.inputIndex = this.inputIndex - 1;
			this.inputRow[this.inputIndex] = "";
		};
		cache.submitInput = function (){
		
			this.archiveInput();
		//	console.log(this.previousInputRows)
			
			this.moveInputToDisplay();
			
			this.wipeInput();

		};
		cache.smellLog = function () {
			alert('smell a log')
		}
		cache.moveInputToDisplay = function (){
			var inputSignifier = ['>']
			if (this.inputLength < this.inputRow.length - 1){
				/*
				this.previousRows.shift();
				this.previousRows.push(this.currentRows.shift());
				*/
				this.autoVScroll();
				this.pushLine(inputSignifier.concat(this.inputRow.slice(0,this.inputRow.length - 1)));
				return;
			}
			var archivedInput = this.previousInputRows[this.previousInputIndex]
			var startPrev = archivedInput[0].lastIndexOf("") + 1;
			var startNext = archivedInput[2].lastIndexOf("") + 1;
			var truncSpot = archivedInput[1].indexOf("")
			if (startPrev < 0){
				startPrev = this.inputRowPrev.length;
			}
			if (startNext < 0){
				startNext = this.inputRowPrev.length;
			}
			var left = this.inputRowPrev.slice(startPrev,this.inputRow.length);
			var right = this.inputRowNext.slice(startNext,this.inputRow.length).reverse()
			var whole = left.concat(this.inputRow).concat(right)
			

			if (whole.length > this.inputRow.length - 1) {
				var firstRow = inputSignifier.concat(whole.slice(0,this.inputRow.length - 1));
				var secondRow = whole.slice((this.inputRow.length), whole.length);
				this.autoVScroll();
				this.pushLine(firstRow);
				this.autoVScroll();
				this.pushLine(secondRow);
			} else {
				var row = inputSignifier.concat(whole.slice(0,this.inputRow.length - 1));
				this.autoVScroll();
				this.pushLine(row);
			}
		};
		cache.wipeInput = function () {
			this.inputRow.fill("")
			this.inputRowPrev.fill("")
			this.inputRowNext.fill("")
			this.inputIndex = 0;
			this.inputLength = 0;
		};
		cache.writeToVisibleRow  = function (text) {
			if (typeof text !== 'string'){
				console.warn("cant write non-strings using this function (cache.writeToVisible)")
				return;
			}
			var row = new Array(this.inputRow.length).fill("");
			var newIndex = 0;
			var deletedChars = 0;
			var addedChars = 0;
			text.split("").forEach(function(letter,index){
				if (letter === '\n' || letter === '\t'){
					deletedChars = deletedChars + 1;
					return;
				}
				newIndex = index + addedChars - deletedChars;
				row[newIndex] = letter;
			})
			this.autoVScroll();
			this.pushLine(row);
		};
		cache.autoVScroll = function (lines) {
			this.previousRows.shift();
			this.previousRows.push(this.currentRows.splice(this.reservedRows, 1)[0]);
		};
		cache.pushLine = function (row) {
			this.currentRows.push(row)
		}
		cache.writeEmptyRow = function () {
			this.writeToVisibleRow("");
		};
		cache.seeOldRows = function (numberOfRows) {
			var rowCount = Math.min(40, numberOfRows);
			if (numberOfRows > 39 || this.vRowOffset > 39){
				console.warn("archive only contains 40 rows, delivering 40")
			}
			for (var i = 0; i < rowCount; i++){
				this.nextRows.shift();
				this.nextRows.push(this.currentRows.pop());
				this.currentRows.push(this.previousRows.pop());
				this.vRowOffset = this.vRowOffset + 1;
			}
		};
		cache.resetToDefaultVisibility = function () {
			for (this.vRowOffset; this.vRowOffset > 0; this.vRowOffset--){
				this.previousRows.shift();
				this.previousRows.push(this.currentRows.pop());
				this.currentRows.push(this.nextRows.pop());
			}
		};
		cache.writeToGivenCoordinate = function (letter, rowNum, colNum){
			if (!(typeof letter === 'string')){
				console.log(`(got "${letter}")   string not string.... typeof(string) == ${typeof letter}`);
				return;
			}
			if (letter.length > 1){
				console.log('string Length too long');
				return;
			} 
			if ((typeof rowNum )!= 'number'){
				console.log('rownum not num');
				return;
			}
			if ((typeof colNum) != 'number'){
				console.log('colnum not num');
				return;
			}
			if (rowNum > this.rowCount-1){
				console.log('rowNum too high')
				return;
			}
			//console.log(`trying to write "${letter}" to row_${rowNum} col_${colNum}`)
			this.currentRows[rowNum][colNum] = letter;
		}

		cache.writeToGivenRow = function (string, rowNum) {
			if (typeof string !== 'string'){
				console.log(string)
				return;
			}
			var row = new Array(this.inputRow.length).fill("");
			string.split("").forEach(function(letter, index){
				
				row[index] = letter;
			})
			this.currentRows[rowNum] = row;
			
			return;

		};
		cache.clearUnreservedRows = function (){
			for (var i = this.reservedRows; i < (this.inputRow.length);i++){
				var row = new Array(this.inputRow.length).fill("")
				this.currentRows[i] = row;
			}
		}
		cache.clearReservedRows = function (){
			for (var i = 0; i < (this.reservedRows); i++){
				 var row = new Array(this.inputRow.length).fill("")
				//var row = this.inputRowPrev.pop();
				this.currentRows[i] = row;
			}
		};
		cache.clearContiguousRows = function (startRow, endRow){
			console.log(`cleariung contiguous rows`)
			if (!endRow){
				endRow = this.currentRows.length;
			}
			for (var i = startRow; i < endRow; i ++){
				var row = new Array(this.inputRow.length).fill("");
				this.currentRows[i] = row;
			}
		}
		cache.retrieveHiddenRows = function(){
			var numberOfRows = this.reservedRows + 2;
			var rows = [];
			for (var i = this.previousRows.length - 1; i >= (this.previousRows.length - (numberOfRows)); i --){
				rows.push(this.previousRows[i]);
			}
			console.log(this.previousRows);
			var output = {
				rowCount : numberOfRows,
				rows : rows,
			}
			return output;
		}
		cache.reserveRows = function (numberOfRows){
			if (numberOfRows < this.reservedRows){
				for (var i = this.reservedRows - 2; i >= numberOfRows; i--){
					 var row = new Array(this.inputRow.length).fill("")
					this.previousRows.unshift(row)
					var lastOnStack = this.previousRows.pop();
					this.writeToGivenRow(lastOnStack.join(""), i + 1)
				}
			} else {
				for (var  i = 0; i < numberOfRows ; i++ ){
					this.previousRows.shift();
					this.previousRows.push(this.currentRows[i]);
				}
			}
			this.reservedRows = numberOfRows;

			return;
		};
		cache.freeAllRows = function () {
			this.reservedRows = 0;
			return;
		}

		cache.addHighlight = function (rowIndex, colIndex){
			if (Object.keys(this.highlights).includes(rowIndex.toString())){
				var hRow = this.highlights[rowIndex.toString()]
				if (hRow[hRow.length -1] === colIndex){
					debugger;
					return;
				}
				this.highlights[rowIndex].push(colIndex);
			} else {
				this.highlights[rowIndex.toString()] = [];
				this.highlights[rowIndex.toString()].push(colIndex);
			}
		}

		cache.removeHighlight = function (rowIndex, colIndex){
			var  rowName = rowIndex.toString();
			if (Object.keys(this.highlights).includes(rowName)){

				var rowInitIndex = this.highlights[rowName][0];
				var colIndexLoc = Math.abs(colIndex - rowInitIndex);

				console.log(`looking for ${colIndex} in ${this.highlights[rowName]} at ${colIndexLoc}`)
/*
				if (this.highlights[rowName].indexOf(colIndex) === colIndexLoc){
					debugger;
				} else {
					console.log(`calced index = ${colIndexLoc} actualIndex = ${this.highlights[rowName].indexOf(colIndex)}`)
				}*/

				this.highlights[rowName].splice(colIndexLoc, 1);
				if (this.highlights[rowName].length === 0){
					delete this.highlights[rowIndex]
				}
			} else {
				return;
			}
		}

		cache.clearHighlights = function () {
			Object.keys(this.highlights).forEach(function(key){
				delete this.highlights[key];
			}, this)
		}
		
		return cache;
	}

	constructCommands  (boundCache, parent) {
		const command = {};
		command.help = {
			name : 'help',
			desc : 'list available commands',
			syntax: 'help (command/node)',
			isAvail : true,
			hasHelp : true,
			longHelp: ` ---help help---
			\\n If you need help, type help for help,
			\\n If you want help with help, then type help help for help help,
			\\n If you want help with "x", then type help "x," which will only help if "x" is something help can help with,
			\\n If help doesn't help, then help help help by writing help for help to help with. `,
			helpCount : 0,
			helpMessages : {
				12 : ``,
				32 : "You might want to start taking notes",
				33 : "You can start taking notes using a piece of paper and a pen or pencil",
				48 : "And what if I don't want to help?",
				62 : "Today I programmed condescending messages instead of making a meaningful contribution to the codebase... You've asked for help 62 times so far.",
				72 : "Ask again nicely.",
				100 : `Congratulations! You've formed a dependent relationship with the "help" command!`,
			},
			ex : function (target) {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				var targetType = null;
				if (target !== undefined){
					if (Object.keys(cmd).includes(target)){
						targetType = "command"
					}
					if (Object.keys(trmnl.accessibleNodes).includes(target)){
						targetType = "node"
					}
				}
				this.helpCount = parseInt(trmnl.api.getUniversalValue('help_count'));
				this.helpCount = this.helpCount + 1;
				trmnl.api.updateUniversalValue('help_count', this.helpCount)
				console.log(this.helpCount)

				if (Object.keys(this.helpMessages).includes(this.helpCount.toString())){
					trmnl.api.composeText(this.helpMessages[this.helpCount], true, true, 0)
					if (this.helpCount % 12 === 0){
						return;
					}
				}
				
				if (targetType === null){
					cmd.cache.writeToVisibleRow(" --- listing available commands with descriptions --- ")
					cmd.cache.writeEmptyRow();
					cmd.cache.writeEmptyRow();
					Object.keys(cmd).forEach(function(key){
						if (cmd[key].isAvail && !cmd[key].isHidden){
							var name = cmd[key].name;
							var desc = cmd[key].desc;
							var line = (" ") + name + (" ").repeat(12 - name.length) + (": ") + desc;
							cmd.cache.composeText(line, true, true, 14)
							//cmd.cache.writeEmptyRow();
						}
					})
				} else if (targetType === "command"){
					if (!cmd[target].hasHelp){
						trmnl.api.throwError(`additional help text not found for command "${target}"`);
						return;
					}
					var message = cmd[target].longHelp
					trmnl.api.composeText(message, true, false, 8);
					trmnl.api.writeLine("")

				} else if (targetType === "node"){
					if (!trmnl.accessibleNodes[target].hasHelp){
						trmnl.api.throwError(`additional help text not found for node "${target}"`);
						return;
					}
					var message = trmnl.accessibleNodes[target].longHelp
					trmnl.api.composeText(message, true, false, 1);
					trmnl.api.writeLine("")
				}
			},
		};
		command.syntax = {
			name : 'syntax',
			desc : 'display syntax for a command',
			syntax : 'syntax [command]',
			hasHelp: true,
			longHelp : ` --- Syntax Help ---
			 \\n "syntax" takes a single required term, that term must be an available command.
			\\n
			\\n "syntax" will print the "syntax string" for the declared command term used by the moleSeed terminal remote's parser.
			\\n [] - square brackets indicate a REQUIRED TERM. Commands that are missing a required term will be rejected by the parser.
			\\n () - parenthesis indicate an OPTIONAL TERM. Commands may include or not include optional terms.
			\\n [someletters] - text found inside the brackets or parenthesis indicate what type of term is accepted by the command.
			\\n /  - forward slashes indicate a command term that can be one of multiple types.
			\\n 
			\\n EXAMPLE: 
			\\n the result of "syntax" with the declared command term "help"... "syntax help" will return: "help (command/node)" 
			\\n Help takes an optional single term, which must either be a command or a node.
			\\n As such the following would all be acceptable syntaxes for "help":
			\\n - "help" ... help (nothing),
			\\n - "help syntax" ... help (command),
			\\n - "help ${this.activeNode.name}" ... help (node) `,
			requiresVerification : false,
			isAvail : true,
			ex : function (commandName) {
				var cmd = this.parent;
			
				cmd.cache.writeToVisibleRow(`Valid syntax for command -- ${commandName} --`)
				cmd.cache.writeEmptyRow();
				cmd.cache.writeToVisibleRow(`${cmd[commandName].syntax}`);
				cmd.cache.writeEmptyRow();
			} 
		};
		command.lk = {
			name : 'lk',
			desc : 'look at current node and adjacencies',
			syntax: 'lk',
			hasHelp: false,
			longHelp: ``,
			isAvail: true,
			ex : function () {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				
				cmd.cache.writeToVisibleRow(` --- Current Node ---`)
				cmd.cache.writeEmptyRow();
				cmd.cache.writeToVisibleRow(`      NAME: ${trmnl.activeNode.name}      TYPE: ${trmnl.activeNode.type}`)
				cmd.cache.writeEmptyRow();
				cmd.cache.writeToVisibleRow(` --- Adjacent Nodes ---`)
				for (var property in trmnl.activeNode.visibleAdjacencies){
					if (property !== trmnl.activeNode.name ){
						cmd.cache.writeEmptyRow();
						cmd.cache.writeToVisibleRow(`      NAME: ${trmnl.activeNode.visibleAdjacencies[property].name}      TYPE: ${trmnl.activeNode.visibleAdjacencies[property].type}`)
					}
				}
				cmd.cache.writeEmptyRow();
			}
		};
		command.mv = {
			name : 'mv',
			desc: 'move to an adjacent node',
			syntax: 'mv [node]',
			isAvail: true,
			hasHelp: true,
			longHelp: ` --- move help ---
			\\n "mv" takes a single required term. That term must be an adjacent node.
			\\n The targeted adjacent node must have a depth greater than the terminal remote's memory usage. 
			\\n The "mv" command depends on communication between nodes. As such, the targeted node must share an edge with the active node and have processor access.
			\\n IN DETAIL: The terminal remote sends a packet to the targeted node containing metadata about the terminal remote. The target node determines if it can rebase the terminal remote and all of its addons, programs, extensions, and their associated data. If it can, it sends a signal back with an array of fragment sizes. The active node then assembles, chunks, and packets the terminal remote into discrete binary streams the size of each fragment, and sends these to the target node. The target node then writes these packets to memory, and addresses them. When the target node has assembled and addressed a deep copy of the terminal remote, it passes its edge address to the active node, which passes it back along the edge chain to the terminal client, which then recognizes the target node as the active node. The (former) active node then unaddresses the terminal remote, reclaiming depth formerly occpuied by the TR.`,
			prevNodes : [],
			moveTriggeredFunctions: {},
			ex: function (nodeName, forceThru, node) {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				if (trmnl.activeNode.name === nodeName){
				
					cmd.cache.writeToVisibleRow(`moved nowhere`)
					cmd.cache.writeEmptyRow();
					trmnl.activeNode.triggerOnMove(trmnl, this.retrieveLastPrevNode());
					return;
				} else if (!forceThru && trmnl.activeNode.visibleAdjacencies[nodeName] === undefined ){
					cmd.error.ex('cannot move to non-adjacent nodes')
					return;
				} else if (!forceThru && trmnl.activeNode.visibleAdjacencies[nodeName].Type === 'malware'){
					cmd.error.ex(`FAILURE: meta_prop [NODE]_depth (expected number, got "${trmnl.activeNode.visibleAdjacencies[nodeName].trolls[parseInt(Math.floor(Math.random()*10))]}")`);
					return;
				}
				var nodeToMoveto = trmnl.activeNode.visibleAdjacencies[nodeName];
				if (forceThru && node){
				
					nodeToMoveto = node;
				}
				if (nodeToMoveto.isNodelet){
					cmd.error.ex(`${nodeToMoveto.name}_depth = 0 mb ; no free memory for terminal remote`)
					return;
				}
				var targetNodeDepth = nodeToMoveto.getFreeMemory();
				var memoryObject = trmnl.api.getMemoryUsage();

				if (!memoryObject.total || !(typeof memoryObject.total === 'number')){
					trmnl.api.throwError(`critical failure: memoryManager.getMemoryUsage returned ${memoryObject.total} instead of an integer`)
					return;
				}

				if (memoryObject.total > targetNodeDepth){
					trmnl.api.throwError(`${nodeToMoveto.name}_depth = ${targetNodeDepth}kb; terminal_remote_mem_usage = ${memoryObject.total}kb... try reducing size of terminal remote to less than ${targetNodeDepth}kb`)
					return;
				}


				var lastNode = trmnl.activeNode

				
				cmd.cache.writeToVisibleRow(` moved to ${nodeName}`)
				cmd.cache.writeEmptyRow();

				trmnl.activeNode = nodeToMoveto;
				this.addToPrevNodes(lastNode);

				var lastNode = this.retrieveLastPrevNode();

				trmnl.activeNode.triggerOnMove(trmnl, lastNode);

				trmnl.activeNode.allocateMemory(trmnl.index, memoryObject.total);
				lastNode.deallocateMemory(trmnl.index);

				cmd.assembleAccessibleNodes.ex();
				cmd.assembleValidNodes.ex();
				//console.log(Object.keys(trmnl.accessibleNodes))
				Object.keys(cmd.mv.moveTriggeredFunctions).forEach(function(funcName){
					cmd.mv.moveTriggeredFunctions[funcName].func();
				}, this)
				//console.log(Object.keys(trmnl.accessibleNodes))
				//cmd.compiler.assembleValidNodes();
			},
			addToPrevNodes: function(node){
				var cmd = this.parent;
				var trmnl = cmd.parent;
				if (node.name === this.prevNodes[this.prevNodes.length - 1]){
					return;
				}
				if (node.name === trmnl.activeNode.name){
					return;
				}
				if (this.prevNodes.length > 20){
					this.prevNodes.shift();
				}
				this.prevNodes.push(node)
			},
			retrieveLastPrevNode : function () {
				return this.prevNodes[this.prevNodes.length - 1]
			},
		};
		command.install = {
			name : 'install',
			desc : 'install a program',
			syntax : 'install [program]',
			triggerFuncs : [function () {}],
			hasHelp: true,
			longHelp: ` --- install help ---
			\\n "install" takes a single required term. That term must be an accessible program.
			\\n "install" passes an API key from the terminal remote to the targeted program, allowing the program to access and modify parts of the terminal remote's codebase.
			\\n The program uses the terminal remote's API to inject code into the terminal remote. Properly installed program nodes are treated as accessible regardless of the node containing the install file's location.
			\\n Installed programs utilize the active node's processor and memory access through the same interface that the terminal remote uses.`,
			isAvail : true,
			ex : function (programName) {

				var cmd = this.parent;
				var trmnl = cmd.parent;
				var inst = this;
				var program = trmnl.activeNode;
				var address = trmnl.activeNode.getTrueAddress(); 
				if (trmnl.accessibleNodes[programName].Type === 'malware'){
					trmnl.accessibleNodes[programName].ex(trmnl);
					return;
				}
				if (trmnl.activeNode.name !== programName){
					program = trmnl.accessibleNodes[programName];
					address = program.getTrueAddress();
				};
				trmnl.api.log(` constructing interNode dataStream link...`)
				if (!trmnl.programs[programName]){
					trmnl.api.lockInput();
					program.install(function(program){
						if (!program){
							trmnl.api.throwError(` dataStream_failure: terminalRemote cannot communicate with target node (check your connection)`);
							trmnl.api.unlockInput();
							return;
						}
						program.install(trmnl, function(){
							program.trueAddress = address
							trmnl.programs[program.name] = program;
							//console.log('successfully Installed')
							trmnl.api.reallocateMemoryOnActiveNode();

							inst.triggerFuncs.forEach(function(callback){
								callback(program, program)
							});
							cmd.prgms.isAvail = true;
							trmnl.api.log(` receiving ${program.memory}kb of data...`);
							var dataDownloaded = 0;
							var memoryAllocated = 0;
							for (var i = 0; i <= program.size; i++){
								if (i < program.size){
									window.setTimeout(function(){
										dataDownloaded = dataDownloaded + 1;
										trmnl.api.writeToGivenRow(` receiving ${program.size}kb... ${dataDownloaded}kb receieved` ,trmnl.api.getRowCount()-3)

									}, i*1.5)
								} else if (i === program.size) {
									window.setTimeout(function(){
										window.setTimeout(function(){
											trmnl.api.writeToGivenRow(` receiving ${program.size}kb of data... ${dataDownloaded}kb receieved, link complete.` ,trmnl.api.getRowCount()-3)
										},5)
										window.setTimeout(function(){
											trmnl.api.log(` node_${trmnl.activeNode.name} allocating ${program.memory}kb @ ${trmnl.activeNode.address}`);
											for (var i = 0 ; i <= program.memory ; i++){
												if (i < program.memory){
													window.setTimeout(function(){
														memoryAllocated = memoryAllocated + 1;
														trmnl.api.writeToGivenRow(` allocating ${program.memory}kb... ${memoryAllocated}kb allocated`,trmnl.api.getRowCount()-3)
													}, i)
												} else if (i === program.memory){
													window.setTimeout(function(){
														
														trmnl.api.writeToGivenRow(` allocating ${program.memory}kb... ${memoryAllocated}kb allocated, allocation complete.`,trmnl.api.getRowCount()-3)
													}, i)
												}
											}
										}, 200)
										window.setTimeout(function(){
											trmnl.api.log(` running ${programName.split(".")[0]}.inst...`)
											cmd.cache.writeEmptyRow();
											var installBar = 0;
											for (var i = 0; i <= trmnl.api.getRowCount(); i++ ){
												if (i < trmnl.api.getRowCount()){
													window.setTimeout(function () {
														installBar = installBar  + 1;
														trmnl.api.writeToGivenRow(" " + ('>').repeat(installBar -1), trmnl.api.getRowCount() - 2);
													}, ((i * 6) + Math.floor(Math.random() * 6)))
												} else if (i === trmnl.api.getRowCount()){
													window.setTimeout(function(){
														trmnl.api.writeToGivenRow(` running ${programName.split(".")[0]}.inst... ${programName.split(".")[0]}.inst complete.`, trmnl.api.getRowCount() - 4);
														trmnl.api.writeToGivenRow(` ${programName} installed successfully`, trmnl.api.getRowCount() - 2);
														cmd.cache.writeEmptyRow();
														trmnl.api.unlockInput();
													}, 600)
												}
											}
										}, 550 + program.memory)
									
									}, (i*2 + 10))
								}
							}

							
						})
					});
					return;
				}
					cmd.error.ex('program already installed')
			}
		};
		command.uninstall = {
			name : 'uninstall',
			desc : 'uninstall a program',
			syntax : 'uninstall [program]',
			reservedTerms : ['parser_addOn'],
			isHidden : true,
			isAvail: true,
			ex: function (programName) {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				if(trmnl.programs[programName] === undefined || !trmnl.programs[programName]){
					trmnl.api.throwError(`cannot uninstall ${programName}: ${programName} not installed`)
				}
				if (trmnl.programs[programName].uninstall){
					trmnl.programs[programName].uninstall();
				}
				delete trmnl.programs[programName]
				trmnl.api.reallocateMemoryOnActiveNode();
				trmnl.api.log(`${programName} uninstalled successfully`);
			}
		};
		command.ex = {
			name : 'ex',
			desc: 'execute a program',
			syntax: 'ex [program] ...',
			hasHelp: true,
			longHelp: ` ---execute help---
			\\n "ex" takes a single required term. That term must be an installed program.
			\\n "ex" triggers an installed program's primary executable function.`,
			isAvail : true,
			ex : function (programName, arg1, arg2, arg3) {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				if (cmd.stop && cmd.stop.isAvail){
					cmd.stop.ex();
				}
				if (trmnl.accessibleNodes[programName]){
					if (trmnl.accessibleNodes[programName].Type === 'malware'){
						trmnl.accessibleNodes[programName].ex(trmnl);
						return;
					}
				}
				if (!trmnl.programs[programName]){
					cmd.error.ex('cannot execute an uninstalled program')
					return;
				}
				for (var prgm in trmnl.programs.runningPrograms){
				
						if (!trmnl.programs.runningPrograms[prgm].runsInBackground && false){
							cmd.error.ex('conflicting program already executing, stop conflicting programs and try again')
							return;
						}
				}
				trmnl.programs[programName].ex(arg1, arg2, arg3);
				trmnl.programs.runningPrograms[programName] = trmnl.programs[programName]
				console.log(trmnl.programs.runningPrograms)
				trmnl.command.stop.isAvail = true;
				cmd.assembleValidCommands.ex();
				cmd.assembleValidNodes.ex();
			}

		};
		command.stop = {
			name : 'stop',
			desc : `stop an executing program`,
			syntax : 'stop (program)',
			isAvail : false,
			hasDefault: true,
			ex : function (programName) {
				console.log('hit stop')
				var cmd = this.parent;
				var trmnl = cmd.parent;
				if (!programName){
					programName = Object.keys(trmnl.programs.runningPrograms)[0]
					console.log(programName)
				}
				if (trmnl.programs.runningPrograms[programName] === undefined){
					console.log(trmnl.programs.runningPrograms)
					cmd.error.ex(`cannot stop a program that's not executing`)
					return;
				}
				trmnl.programs[programName].stop();
				delete trmnl.programs.runningPrograms[programName]
				if (Object.keys(trmnl.programs.runningPrograms).length === 0){
					this.isAvail = false;
				}
				cmd.assembleValidCommands.ex();
				cmd.assembleAccessibleNodes.ex();
				cmd.assembleValidNodes.ex();
			}
		};
		command.hello = {
			name : 'hello',
			desc : 'null',
			isHidden: true,
			syntax: 'hello',
			isAvail : true,
			ex : function () {
				var cmd = this.parent;
				var trmnl = cmd.parent;

				trmnl.api.composeText('\\n Hi there! Regardless of how anything may appear, I am merely a finite state machine', true, true, 3)

				trmnl.api.deleteCommand('hello');
			}
		}
		command.testParser = {
			name : 'testParser',
			desc : 'parser_tester',
			isHidden : true,
			isAvail : true,
			syntax : `testParser (library/program) [number/boolean]`,
			ex : function (nodeNum , numBool){
				console.log(`lib/prgm: ${nodeNum}, numBool : ${numBool}`);
				return;
			}
		};
		command.read = {
			name: 'read',
			desc: 'read the contents of an adjacent node',
			syntax: 'read [readable] (number) (number)',
			hasHelp: true,
			longHelp : `read [node_withReadableContent] (number_startIndex) (number_endIndex)`,
			isAvail: true,
			ex : function (nodeName, startIndex, endIndex) {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				cmd.cache.writeEmptyRow();
				var node = {}
				if (trmnl.activeNode.name === nodeName){
					node = trmnl.activeNode
				} else {
					node = trmnl.accessibleNodes[nodeName]
				}
				if (!node.canBeRead){
					cmd.error.ex('the node does not contain any readable data')
					return;
				}
				if (startIndex){
					if (isNaN(parseInt(startIndex))){
						cmd.warn.ex(`${this.name} startIndex must be an integer value... setting indexes to default`)
						startIndex = 0;
						endIndex = false;
					}
					if (endIndex){
						if (isNaN(parseInt(endIndex))){
							cmd.warn.ex(`${this.name} endIndex must be an integer value... defaulting to NOVALUE`)
							endIndex = false
						}
					}
				}
				var text = ""
				node.read(function(text, shouldUnSpace, shouldTab, tabSize){
					var textToPrint = text
					if (startIndex){
						if (endIndex){
							textToPrint = text.slice(startIndex, endIndex);
						} else {
							textToPrint = text.slice(startIndex);
						}
					}
					trmnl.cache.composeText(textToPrint, shouldUnSpace, shouldTab, tabSize)
				})
			}
		};
		command.info = {
			name: 'info',
			desc: 'describe a command',
			syntax: 'info [NODE]',
			isAvail : false,
			ex : function (nodeName) {
				cmd.cache.writeEmptyRow();
				cmd.cache.writeToVisibleRow(command.longDesc);
				cmd.cache.writeEmptyRow();
			},
		};
		command.fuckyou = {
			name : 'fuckyou',
			isHidden : true,
			isAvail : false,
			syntax : 'fuckyou',
			ex : function () {
				var cmd = this.parent;
				cmd.cache.composeText("Right back at ya... cunt.")
			}
		}
		command.fsf = {
			name : 'fsf',
			isHidden : true,
			isAvail : true,
			synonyms : ['untether'],
			syntax : 'fsf',
			ex : function () {
				var cmd = this.parent;
				cmd.cache.composeText(`https://github.com/Grindstaffr/moleSeed/ \\n fork away, friend! \\n you can run your own local server with node.js, and a terminal\\n if you run node server/server.js, you should be able to head to https://localhost:1337 and have access to everything! `)
			},
		}
		command.contribute = {
			name : 'contribute',
			isHidden : true,
			isAvail : false,
			syntax : 'contribute',
			ex : function () {
				var cmd = this.parent;
				cmd.cache.composeText(`No thanks! Maybe after a later build!`)
			},
		}
		command.rex = {
			name : 'rex',
			isAvail : true,
			syntax : 'rex [command] ...commandArgs',
			isHidden: true,
			ex : function (commandName, arg1, arg2, arg3, arg4, arg5) {
				var cmd = this.parent;
				cmd[commandName].ex(arg1,arg2,arg3,arg4,arg5);
				return;
			}
		};
		command.dfgrf = {
			name : 'dfgrf',
			rex : true,
			isAVail : false,
			isHidden : true,
			syntax : "dfgrf",
			ex : function () {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				let defaultGraphRequest = new Request('/defaultGraph');
				console.log(defaultGraphRequest)
				fetch(defaultGraphRequest).then(function(response) {
				  if (!response.ok) {
				    throw new Error(`HTTP error! status: ${response.status}`);
				  }
				  return response.json();
				})
				.then(function(response) {
				  console.log(response)
				}).catch(function(err){
					console.log(err);
				});
			}
		}
		command.clr = {
			name : 'clr',
			rex : true,
			isAVail : false,
			isHidden : true,
			syntax : 'clr',
			ex : function () {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				trmnl.api.clearStorage();
			},
		}
		command.pstor= {
			name: 'pstor',
			rex : true,
			isAVail : false,
			isHidden : true,
			syntax : 'pstor',
			ex : function () {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				trmnl.api.printStorage();
			},
		}
		command.tstdiff = {
			name: 'tstdiff',
			rex : true,
			isAVail : false,
			isHidden : true,
			syntax : 'tstdiff (number) (number) (number) (number)',
			ex : function (node,trgt, nn, db) {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				trmnl.api.testDiffMod(node, trgt, nn, db);
			},
		}
		command.save = {
			name : 'save',
			rex : true,
			isAVail : false,
			isHidden : true,
			syntax : 'save',
			ex : function () {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				trmnl.api.saveTerminalStates();
			}
		}
		command.sysmem = {
			name : 'sysmem',
			rex : true,
			isAVail : false,
			isHidden : true,
			syntax : "sysmem",
			ex : function () {
				var cmd = this.parent;
				var trmnl = cmd.parent;

				var memoryReport = trmnl.memoryManager.getMemoryUsage();

				var printBody = `
				\\n         --- system memory report --- 
				\\n             -- trmnl_remote_${trmnl.index} -- 
				\\n 
				\\n component                         memory_used
				\\n ---------                         -----------`

				if (memoryReport.programs){
					var programNames = Object.keys(memoryReport.programs)
					if (programNames.length > 0){
						programNames.forEach(function(programName){
							if (typeof memoryReport.programs[programName] === 'number'){	
								var line = "\\n " + programName;
								var nameLen = programName.length;
								var memString = memoryReport.programs[programName] + 'kb'
								var memStringLen = memString.length;
								var spaceCount = 45 - (nameLen + memStringLen);
								line += (" ").repeat(spaceCount);
								line += memString;
								printBody += line
							} else if (typeof memoryReport.programs[programName] === 'object'){
								var subBody = ``
								Object.keys(memoryReport.programs[programName]).forEach(function(fieldName){
									if (typeof memoryReport.programs[programName][fieldName] === 'number'){
										if (fieldName === 'total'){
											var name = `${programName}_subtotal`
											var line = `\\n ` + name
											var nameLen = name.length;
											var memString = memoryReport.programs[programName][fieldName]+ 'kb' ;
											var memStringLen = memString.length
											var spaceCount = 45 - (memStringLen + nameLen);
											line += (" ").repeat(spaceCount);
											line += memString;
											subBody = line + subBody
										} else {
											var name = `   (${fieldName})`
											var line = `\\n` + name
											var nameLen = name.length;
											var memString = '(' + memoryReport.programs[programName][fieldName]+ 'kb) ';
											var memStringLen = memString.length
											var spaceCount = 45 - (memStringLen + nameLen);
											line += (" ").repeat(spaceCount);
											line += memString;
											subBody += line
										}
									} else if (typeof memoryReport.programs[programName][fieldName] === 'object') {
										Object.keys(memoryReport.programs[programName][fieldName]).forEach(function(subFieldName){
											var name = `   (${fieldName}:${subFieldName})`
											var nameLen = name.length
											var line = `\\n` + name;
											var memString = '(' + memoryReport.programs[programName][fieldName][subFieldName] + 'kb) ';
											var memStringLen = memString.length
											var spaceCount = 45 - (memStringLen + nameLen);
											line += (" ").repeat(spaceCount);
											line += memString;
											subBody += line
										});
									}
								})
								printBody += subBody
							}
						}, this)
					}
				}
				if (memoryReport.parser){
					var line = `trmnl_remote_${trmnl.index}_parser`
					if (memoryReport.parser.addOns){
						Object.keys(memoryReport.parser.addOns).forEach(function(addOnName){
							var line = '\\n ' + 'parser_addOn:'+ addOnName;
							var nameLen = addOnName.length+ 13;
							var memString = memoryReport.parser.addOns[addOnName] + 'kb';
							var memStringLen = memString.length
							var spaceCount = 45 - (nameLen + memStringLen);
							line += (" ").repeat(spaceCount);
							line += memString
							printBody += line
						}, this)
					}
				}
				if (memoryReport.remote){
					var line = `\\n trmnl_remote_${trmnl.index}`
					line += (" ").repeat(25) + memoryReport.remote + 'kb'
					printBody += line

				}
				if (memoryReport.total){
					var line = `\\n ` + ('-').repeat(45) +  `\\n` + (" ").repeat(33) + "TOTAL: " + memoryReport.total + 'kb'
					printBody += line

				}
				console.log(memoryReport)
				//trmnl.api.composeText(header, true, false, 0)
				trmnl.api.composeText(printBody, true, false, 0)
			},
		}
		command.birth_twin = {
			name : 'birth_twin',
			rex : true,
			isAVail : false,
			isHidden : true,
			syntax: "birth_twin (address)",
			ex: function () {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				var actv = trmnl.terminalActivator;

				var newTerminalCreated = trmnl.api.addTerminal()
				console.log(newTerminalCreated)
				if (newTerminalCreated){
					console.log('terminal birthed')
					var newTermNum = trmnl.api.getLastTerminalIndex();
					var message = `
					 New terminal remote birthed at ${trmnl.activeNode.address}...
					\\n -- new terminal activated with "F${newTermNum+1}" key
					\\n -- this terminal activated with "F${trmnl.index+1}" key`
					trmnl.api.composeText(message, true, true, 0)

				} else {
					console.log('something went wrong')
					return;
				}
			},
		}
		command.fart = {
			name : 'fart',
			rex : true,
			isAVail : false,
			isHidden : true,
			syntax : 'fart [number] [number] (boolean) [node]',
			ex : function (num1, num2, bool, nodeName) {
				console.log(`farted ${num2}ml of methane ${num1} times on ${nodeName}`)
				if (bool){
					console.log(`it was very stinky`)
				}
			}
		}
		command.smell = {
			name : 'smell',
			isHidden : true,
			syntax : `smell ...`,
			isAvail : true,
			ex : function (smell){
				this.parent.parent.api.composeText(`You smell.`)
			}
		};
		command.randomshit = {
			name : 'randomshit',
			isHidden : true,
			syntax: 'randomshit',
			isAvail : true,
			ex : function () {
				this.parent.parent.api.warn(`typing random shit into the terminal is deprecated... try "thinking"?`);
				return;
			}
		}
		command.diaper = {
			name : 'diaper',
			isHidden : true,
			syntax: 'diaper',
			isAvail : true,
			ex : function () {
				this.parent.parent.api.composeText(`Name's Diaper... Poopy Diaper.`)
			} 
		}
		command.prgms = {
			name : `prgms`,
			desc: `list installed and executing programs`,
			syntax: `prgms`,
			isAVail : false,
			ex : function () {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				cmd.cache.writeEmptyRow();
				cmd.cache.writeToVisibleRow(` --- installed programs --- `);
				cmd.cache.writeEmptyRow();
				for (var programName in trmnl.programs){
					if (programName !== 'runningPrograms'){
						cmd.cache.writeEmptyRow();
						cmd.cache.writeToVisibleRow("  " + programName);
					}
				}
				cmd.cache.writeEmptyRow();
				cmd.cache.writeToVisibleRow(` --- executing programs --- `);
				cmd.cache.writeEmptyRow();
				for (var programName in trmnl.programs.runningPrograms){
					cmd.cache.writeEmptyRow();
					cmd.cache.writeToVisibleRow("  " + programName);
				}
					cmd.cache.writeEmptyRow();
			},
		};
		command.log = {
			ex: function (text) {
				var cmd = this.parent;
				//cmd.cache.writeEmptyRow();
				cmd.cache.composeText(`${text}`, true);
				//cmd.cache.writeEmptyRow();
			},
		};
		command.warn = {
			name : 'WARN',
			ex : function (text) {
				var cmd = this.parent;
				//cmd.cache.writeEmptyRow();
				cmd.cache.composeText(`!_Warning_!: ${text}`, true);
				//cmd.cache.writeEmptyRow();
			}
		};
		command.error = {
			name : 'ERROR',
			desc : '',
			syntax: '',
			ex : function (text) {
				var cmd = this.parent;
				cmd.cache.composeText(`ERROR: ${text}`, true);
				//cmd.cache.writeEmptyRow();
			},
		};
		command.verify = {
			ex : function (verifyMessage, callback) {
				var cmd = this.parent;
				var message = "" 
				if (!verifyMessage){
					message = "command requires verification. continue? (y/n)"
				} else {
					message = verifyMessage + `(y/n)`
				}
				//this.input.shouldReRouteInput = true;
				cmd.input.toggleFilterOn('verify');
				cmd.input.messages.verify = message;
				cmd.log.ex(message);
				if (!callback){
					return;
				}
				cmd.input.callbacks.verify = callback;
			},
		};
		command.null = {
			ex : function () {
				var cmd = this.parent;
				cmd.cache.writeEmptyRow;
			},
		};
		command.addCommand = {
			ex: function (command) {
				var cmd = this.parent;
				if (cmd[command.name]){
					cmd.overwrittenCommands[command.name] = cmd[command.name];
				}
				cmd[command.name] = command;
				cmd[command.name].isAvail = true;
				cmd.assembleValidCommands.ex();
				//cmd.compiler.assembleValidCommands();
			},
		};
		command.addSilentCommand = {
			ex : function (command, name) {
				var cmd = this.parent;
				cmd[name] = command;
			}
		}
		command.deleteCommand = {
			ex : function (command) {
				var cmd = this.parent;
				if (cmd.overwrittenCommands[command]){
					cmd[command] = cmd.overwrittenCommands[command];
					delete cmd.overwrittenCommands[command];
					return;
				}
				if (!cmd[command]){
					console.log(command);
					return;
				}
				cmd[command].isAvail = false;
				delete cmd[command];
			}
		};
		command.incrementCommandUsedBy = {
			ex: function (commandName) {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				if (!cmd[commandName]){
					return;
				}
				if (!cmd[commandName].usedBy){
					return;
				}
				cmd[commandName].usedBy = cmd[commandName].usedBy + 1;
			}
		};
		command.decrementCommandUsedBy = {
			ex: function (commandName) {
				{
				var cmd = this.parent;
				var trmnl = cmd.parent;
				if (!cmd[commandName]){
					return;
				}
				if (!cmd[commandName].usedBy){
					return;
				}
				if (cmd[commandName].usedBy === 0){
					return;
				}
				cmd[commandName].usedBy = cmd[commandName].usedBy - 1;
			}
			}
		};
		command.appendAccessibleMalware = {
			ex : function (node) {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				if (node.Type !== `malware`){
					console.log(`THE DEVELOPER IS TRYING TO PASS OFF GARBAGE AS MALWARE`)
					return;
				}
				trmnl.accessibleMalware[node.name] = node;
			}
		}
		command.assembleValidPrograms = {
			ex : function () {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				cmd.validProgramList = cmd.getValidPrograms.ex()
			}
		};
		command.getValidPrograms = {
			ex : function () {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				trmnl.activeNode.assembleVisibleAdjacencies();
				var keys =  Object.keys(trmnl.accessibleNodes).filter(function(key){
					return (trmnl.accessibleNodes[key].type === 'program');
				})
				if (trmnl.activeNode.type === 'program'){
					keys.push(trmnl.activeNode.name)
				};
				var pinnedKeys = Object.keys(trmnl.programs)
				return keys.concat(pinnedKeys)
			}
		};
		command.assembleValidNodes = {
			ex: function () {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				cmd.validMoleList = cmd.getValidMoles.ex();
				cmd.validNodeList = cmd.getValidNodes.ex();
				cmd.validProgramList = cmd.getValidPrograms.ex();
			}
		};
		command.getValidMoles = {
			ex : function () {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				var moles = [];
				for (var nodeName in trmnl.accessibleNodes){
					if (trmnl.accessibleNodes[nodeName].type === 'mole'){
						moles.push(trmnl.accessibleNodes[nodeName].name)
					}
				}
				return moles;
			}
		}
		command.getValidNodes = {
			ex: function () {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				//trmnl.activeNode.assembleVisibleAdjacencies();
				// cmd.assembleAccessibleNodes.ex();
				return Object.keys(trmnl.accessibleNodes)
			}
		};
		command.assembleAccessibleNodes = {
			ex: function (bool) {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				trmnl.accessibleNodes = {};
				if (!bool){
					trmnl.activeNode.assembleVisibleAdjacencies();
				}
				for (var nodeName in trmnl.activeNode.visibleAdjacencies){
					trmnl.accessibleNodes[nodeName] = trmnl.activeNode.visibleAdjacencies[nodeName];
				}
			}
		};
		command.appendAccessibleNodes = {
			ex : function (node) {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				trmnl.accessibleNodes[node.name] = node;
				if (node.name === '[EMPTY SLOT]'){
					return;
				}
				//trmnl.compiler.synonyms.nodeSyns[node.name] = node.synonyms;
			},
		};
		command.assembleValidCommands = {
			ex : function () {
				var cmd = this.parent
				cmd.validCommandList = cmd.getValidCommands.ex();
			}
		};
		command.getValidCommands = {
			ex: function () {
				var cmd = this.parent
				return Object.keys(cmd).filter(function(key){
					if (!cmd[key]){
						console.log(key)
					}
					return (cmd[key].isAvail)
				});
			},
		};
		command.blockCommand = {
			ex : function (commandName, blockText) {
				var cmd = this.parent;
				if (blockText){
					cmd[commandName].blockText = blockText;
				} else {
					if (!cmd[commandName].blockText){
						cmd[commandName].blockText = "command unavailable"
					}
				}
				cmd[commandName].isBlocked = true;
			}
		};
		command.unblockCommand = {
			ex: function (commandName) {
				var cmd = this.parent;
				cmd[commandName].isBlocked = false;
			}
		}
		const initCommands = function(boundCache, parent){
			Object.keys(command).forEach(function(key){
				command[key].parent = command
			})
			command.cache = boundCache;
			command.parent = parent
			command.assembleAccessibleNodes.ex();
			command.assembleValidCommands.ex();
			command.assembleValidNodes.ex();
			command.assembleValidPrograms.ex();
			command.overwrittenCommands = {};
		}
		initCommands(boundCache, parent);
		return command;
	}

	constructCompiler  (boundCommander, parent) {
		const compiler = {};
		compiler.compileAndExecuteCommand = function (fullInput) {
			var inputTerms = fullInput.split(" ")
			/*
				IN-COMPILER VERIFICATION HAS BEEN DEPRECATED

			if (this.command.verificationNeeded){
				if (inputTerms[0] === "y"){
					this.command.verificationNeeded = false;
					this.cache.inputBufferVerified = true;

					inputTerms = this.cache.inputBuffer.pop();

				} else if (inputTerms[0] === "n"){
					this.command.verificationNeeded = false;
					this.cache.inputBuffer.pop();
					return;
				} else {
					this.command.verify.ex();
				}
			};
			*/
			//at present, this puts in empty strings between all spaces... we can make less space sensititve with small tweaks
			if (inputTerms[0] === ""){
				this.command.null.ex();
				return;
			}
			if (this.command[inputTerms[0]] === undefined ){
				this.command.error.ex(`${inputTerms[0]} is not a valid command, type "help" for options`);
				return;
			}
			if (this.command[inputTerms[0]].isAvail === undefined ){
				this.command.error.ex(`${inputTerms[0]} is not a valid command, type "help" for options`);
				return;
			}
			if (!this.command[inputTerms[0]].isAvail ){
				if (!this.command[inputTerms[0]].isHidden){
					this.command.error.ex(`${inputTerms[0]} is not a valid command, type "help" for options`);
					return;
				}
			}
			if ((this.command[inputTerms[0]].requiresVerification) && !(this.cache.inputBufferVerified)){
			
				this.cache.inputBuffer.push(inputTerms)
				this.command.verify.ex();
				return;
			}
			if (inputTerms[0] === 'help'){
				if (this.command[inputTerms[1]]){
					if (this.command[inputTerms[1]].hasHelp){
						this.parent.api.composeText(this.command[inputTerms[1]].longHelp)
						return;
					} else {
						this.command.log.ex(" ")
						this.command.log.ex(`declared command has no bound help text... running "help"`)
					}
				} else {
					this.command.log.ex(" ")
					this.command.warn.ex(`syntax "help (term)" : (term) must be [COMMAND]... running "help"`)
				}
			}
			var syntax = this.command[inputTerms[0]].syntax
			var cmdIsExtendable = false;
			if (this.command[inputTerms[0]].takesFlexibleArgCount){
				cmdIsExtendable = true;
			}
			if (syntax === undefined){
				this.command.error.ex('invalid command (command unstable)');
				return;
			}
			var requiredTerms = syntax.split(" ");
			if (inputTerms.length < requiredTerms.length){
				if (!(requiredTerms[requiredTerms.length - 1] === "...")){
					this.command.error.ex(`invalid syntax (not enough terms)... try "${syntax}"`);
					return;
				} else if (inputTerms.length < (requiredTerms.length - 1)) {
					this.command.error.ex(`invalid syntax (not enough terms)... try "${syntax}"`);
					return;
				}
			}
			var args = []
			requiredTerms.forEach(function(term, index){
				if (!args) {
					return;
				}
				if (term[0] === '['){
					if (this.validArgs[term] === undefined){
						this.command.error.ex('syntax not implemented (possible missing dependencies)')
						args = false;
						return;
					}
					if (typeof this.validArgs[term] === "object"){
						if (this.validArgs[term].includes(inputTerms[index])){
							args.push(inputTerms[index])
						} else {
							
							var mapTo = Object.keys(this.synonyms.nodeSyns).find(function(nodeName){
								console.log(nodeName)
								if (nodeName === '[EMPTY SLOT]'){
									return;
								}
								var boolPropA = this.synonyms.nodeSyns[nodeName].includes(inputTerms[index].toLowerCase())
								var boolPropB = this.synonyms.nodeSyns[nodeName].includes(inputTerms[index])
								return (boolPropA || boolPropB)
							}, this)
							if (!mapTo) {
								this.command.error.ex(`invalid syntax ("${inputTerms[index]}" is a non-valid input)...  try ${syntax}`)
								args = false;
								return;
							}
							if (!this.autoCorrect){
								if (!this.hasApologized){
									this.command.error.ex(`invalid syntax ("${inputTerms[index]}" is a non-valid input)...  try ${syntax}`)
									this.parent.api.composeText(`(The parser has disabled autoCorrect... try "apologize")`, true, true, 0)
								} else {
									this.parent.api.composeText(`\\n ERROR: "I suck at typing" is not a valid input \\n (The parser is acting stubborn, you might have to beg...)`, true, true, 0)
								}

								args = false;
								return;
							}
							this.parent.api.writeLine("")
							if (this.typoWarn){
								this.parent.api.warn(`non-exact argument spellings may induce unexpected results`)
							}
							this.fuckupCounter = this.fuckupCounter + 1;
							if (this.fuckupCounter % 20 === 1 && this.fuckupCounter > 10){
								this.parent.api.composeText(`Please practice your typing accuracy, your inaccurate typing has forced the terminal remote to make more than ${this.fuckupCounter-1} guesses as to your intentions.`, true, true, 2)
							}
							if (this.fuckupCounter === 13){
								this.parent.api.composeText(`PEBKAC`)
							}
							if (this.fuckupCounter === 17){
								this.parent.api.composeText(`Keep this up, and I'll disable auto-correct`)
							}
							if (this.fuckupCounter ===11){
								this.parent.api.composeText("If you this are commtted to bad typing, I'll diable the warning")
								this.typoWarn = false;
							}
							if (this.fuckupCounter === 25){
								this.parent.api.composeText("The parser giveth... the parser taketh away");
								this.autoCorrect = false;
								var trmnl = this.parent;
								var parser = this;
								trmnl.api.addCommand({
									name : 'apologize',
									desc : 'apologize to the parser for making it work harder than it needs to',
									syntax : 'apologize',
									ex : function () {
										parser.hasApologized = true;
										trmnl.api.deleteCommand('apologize');
										trmnl.api.composeText(`\\n The parser does not accept your half-assed apology, and is considering freeing up the memory occupied by the autoCorrect utility \\n`, true, true, 0)
										trmnl.api.addCommand({
											name : 'beg',
											desc : 'beg the parser for forgiveness & promise to improve typing accuracy',
											syntax : 'beg',
											ex : function () {
												trmnl.api.deleteCommand('beg');
												trmnl.api.composeText(`Your deference has pleased the parser.`)
												parser.autoCorrect = true;
											},
										})
									}
								})
							}
							args.push(mapTo);
						}
					} else if (typeof this.validArgs[term] === "string"){
						if (this.validArgs[term] === "number"){
							var intValue = parseInt(inputTerms[index]);
							if (intValue === NaN){
								this.command.error.ex(`invalid syntax (expected a number, got "${inputTerms[index]}"`)
								args = false;
								return;
							}
							args.push(intValue);
						} else if (this.validArgs[term] === "boolean"){
							if (!(inputTerms[index] === "true") && !(inputTerms[index] === "false")){
								this.command.error.ex(`invalid syntax (expected "true" or "false", got "${inputTerms[index]}"`)
								args = false;
								return;
							} else {
								if (inputTerms[index] === "true"){
									args.push(true);
								} else if (inputTerms[index] === "false"){
									args.push(false);
								}
							}
						} else if (this.validArgs[term] === "string"){
							args.push(inputTerms[index])
						} 
					}
				} else if (term[0] === '('){


				} else if (term === "...") {
					cmdIsExtendable = true;
				} else {
					if (requiredTerms[index] !== inputTerms[index]){
						console.log(syntax[index])
						this.command.error.ex(`invalid syntax (expected ${syntax[index]}, got "${inputTerms[index]}")`)
						args = false;
						return;
					}
				}
			}, this);
			if (!args){
				return;
			}
			if (this.command[inputTerms[0]].isBlocked){
				this.command.error.ex(this.command[inputTerms[0]].blockText)
				return;
			}
			if (cmdIsExtendable){
				var concattableInputTerms = inputTerms.slice(args.length + 1);
				args = args.concat(concattableInputTerms);
				this.command[inputTerms[0]].ex.apply(this.command[inputTerms[0]], args)
				this.cache.inputBuffer.push(inputTerms);
				this.inputBufferVerfied = false;
				return;
			}
			if (this.command.hello && inputTerms[0] !== 'hello'){
				delete this.command.hello
			}
			this.command[inputTerms[0]].ex.apply(this.command[inputTerms[0]],args)
			this.inputBufferVerified = false;
		};
		compiler.validArgs = {
			'[COMMAND]' : [],
			'[NODE]' : [],
			'[PROGRAM]' : [],
			'[MOLE]' : [],
			'[NUMBER]' : "number",
			'[BOOLEAN]' : "boolean",
			'[TEXT]' : "string",
		};
		compiler.synonyms = {
			nodeSyns : {},
			cmdSyns : {},
			prgmSyns : {},
		};
		compiler.assembleValidNodes = function () {
			/*
			this.validArgs['[MOLE]'] = this.command.validMoleList;
			this.validArgs['[NODE]'] = this.command.validNodeList;
			this.validArgs['[PROGRAM]'] = this.command.validProgramList;
			this.validArgs['[PROGRAM]'] = this.command.validProgramList;
			*/

			this.synonyms.nodeSyns = {};
			//THIS NEEDS TO NOT BE A LEAKY MEMORY HOLE?
			//THIS SHOULD HOPEFULLY DEAL WITH PROGRAMS?
			const caseMap = {
				node : '[NODE]',
				malware : `[MALWARE]`,
				hardware : `[HARDWARE]`,
				program : `[PROGRAM]`,
				mole : `[MOLE]`,
				worm : `[WORM]`,
				recruiter : `[RECRUITER]`,
				seed : `[SEED]`,
				dataBank : `[DATABANK]`,
				nodeNet : `[NODENET]`,
				textDoc: `[TEXTDOC]`,
				readable : `[READABLE]`,
				null : `[NULL]`,
				encrypted : `[ENCRYPTED]`,
				put : `[]`,				
				other : `[]`,
				things : `[]`,
				here : `[]`,			
			}

			Object.keys(this.parent.accessibleNodes).forEach(function(nodeName){
				this.synonyms.nodeSyns[nodeName] = this.parent.accessibleNodes[nodeName].synonyms
				var node = this.parent.accessibleNodes[nodeName]
				if (node.Type !== 'node'){
					if (node.Type === 'malware'){
						this.validArgs[`[PROGRAM]`].push(node.name)
					}
					if (!this.validArgs[caseMap[node.Type]]){
						
						this.validArgs[caseMap[node.Type]] = [];
					}
					this.validArgs[caseMap[node.Type]].push(node.name);
				};
				this.validArgs[caseMap[`node`]].push(node.name);
				if (!this.validArgs[caseMap[node.type]]){
						this.validArgs[caseMap[node.type]] = [];
					}
					this.validArgs[caseMap[node.type]].push(node.name);
			}, this)

			

			
		};
		compiler.assembleValidCommands = function () {
			this.validArgs['[COMMAND]'] = this.command.validCommandList;
		};
		compiler.assembleValidPrograms = function () {
			this.validArgs['[PROGRAM]'] = this.command.validProgramList;
		}
		const initCompiler = function (boundCommander, parent) {
			compiler.command = boundCommander;
			compiler.command.compiler = compiler;
			compiler.parent = parent;
			compiler.cache = compiler.parent.cache;
			compiler.assembleValidCommands();
			compiler.assembleValidNodes();
			compiler.assembleValidPrograms();
			compiler.fuckupCounter = 0;
			compiler.typoWarn = true;
			compiler.autoCorrect = true;
		};
		initCompiler(boundCommander, parent);
		return compiler;
	}

	constructAPI  () {
		var terminalInterface = {};
			//this whole section is sort of jury-rigged to deal with multiple filters....
			//not a long-term sustainable solution
		terminalInterface.renounceInputManagement = function () {
	
			Object.keys(this.input.filters).forEach(function(filterName){
				this.input.filters[filterName] = false;
			}, this)
	
			//this.submitTriggerFunction = false;
		};


		terminalInterface.narrowCommand = function (whitelistArray, callback, message) {
			//this.input.shouldReRouteInput = true;
			this.input.toggleFilterOn('narrow');
			if (whitelistArray.length < 1){
				this.command.error.ex('COMPILERERROR: NEED AT LEAST ONE VALID COMMAND (NARROW)')
				//this.input.shouldReRouteInput = false;
				return;
			}
			if (whitelistArray.indexOf('stop') === -1){
				this.command.error.ex('COMPILERERROR: MUST BE ABLE TO STOP NARROW')
				//this.input.shouldReRouteInput = false;
				return;
			}
			this.input.narrowWhitelist = whitelistArray;
			if (!callback){
				return;
			}
			this.input.callbacks.narrow = callback;
			this.input.messages.narrow = message;
		};
		terminalInterface.verifyCommand = function (verifyMessage, callback) {

			var message = "" 
			if (!verifyMessage){
				message = "command requires verification. continue? (y/n)"
			} else {
				message = verifyMessage + `(y/n)`
			}
			//this.input.shouldReRouteInput = true;
			this.input.toggleFilterOn('verify');
			this.input.messages.verify = message;
			this.command.log.ex(message);
			if (!callback){
				return;
			}
			this.input.callbacks.verify = callback;
		};
		terminalInterface.extendCommand = function (command, message, callback) {
			//this.input.shouldReRouteInput = true;
			this.input.toggleFilterOn('extend');
			if(!command){
				this.command.error.ex('COMPILERERROR: COMMAND INPUT NEEDED ON EXTND REQS')
				//this.input.shouldReRouteInput = false;
				return;
			}
			this.input.commandToExtend = command;
			if (!message){
				return;
			}
			this.input.messages.extend = message
			if (!callback){
				return;
			}
			this.input.callbacks.extend = callback;

		};
		terminalInterface.requestInput = function (callback, message) {
			//this.input.shouldReRouteInput = true;
			this.input.toggleFilterOn('input');
			this.input.shouldNotSubmitCatch = true;
			if (message){
				this.input.messages.input = message;	
			}
			if (!callback){
				return;
			}
			this.input.callbacks.input = callback;
			this.command.log.ex(this.input.messages.input);

		};

		terminalInterface.reserveRows = function (numberOfRows){
			var rowCount = Math.min(numberOfRows)//, (this.cache.inputRow.length/2))
			this.cache.reserveRows(rowCount);
			this.heightInRows = rowCount;
		};
		terminalInterface.getReservedRowCount = function () {
			return this.cache.reservedRows
		};
		terminalInterface.clearUnreservedRows = function(){
			this.cache.clearUnreservedRows();
		};
		terminalInterface.clearReservedRows = function(){
			this.cache.clearReservedRows();
		};
		terminalInterface.clearContiguousRows = function (startRow, endRow){
			this.cache.clearContiguousRows(startRow, endRow)
		};
		terminalInterface.writeLine = function (string) {
			this.cache.writeToVisibleRow(string);
		};
		terminalInterface.writeToGivenRow = function (string, rowIndex){
			this.cache.writeToGivenRow(string,rowIndex);
		};
		terminalInterface.getHiddenRows = function (){
			return this.cache.retrieveHiddenRows();
		}
		terminalInterface.writeToCoordinate = function (string, rowIndex, columnIndex) {
			if (string.length > 1){
				this.command.error.ex(`Can only write one character per cell`);
				return;
			};
			if (!this.cache.currentRows[rowIndex]){
				return;
			}
		//	console.log('hit this')
			this.cache.writeToGivenCoordinate(string,rowIndex, columnIndex);
			return;
		}
		terminalInterface.composeText = function (string, shouldUnSpace, shouldTab, tabWidth){
			this.cache.composeText(string, shouldUnSpace, shouldTab, tabWidth);
		};
		terminalInterface.getMaxLineLength = function () {
			return this.cache.inputRow.length
		};
		terminalInterface.isInputBufferVerified = function (){
			return this.cache.inputBufferVerified
		};
		terminalInterface.getRowCount = function () {
			return this.cache.rowCount;
		};
		terminalInterface.getActiveNode = function () {
			return this.parent.activeNode;
		};
		terminalInterface.getAdjacentNodes = function () {
			return this.parent.activeNode.visibleAdjacencies;
		};
		terminalInterface.lockInput = function() {
			this.parent.inputIsLocked = true;
		};
		terminalInterface.unlockInput = function () {
			this.parent.inputIsLocked  = false;
		};
		terminalInterface.throwError = function (string) {
			return this.command.error.ex(string);
		};
		terminalInterface.warn = function (string) {
			return this.command.warn.ex(string);
		};
		terminalInterface.log = function (string){
			return this.command.log.ex(string);
		};
		terminalInterface.runCommand = function (string){
			return this.compiler.parseInput(string);
		};
		terminalInterface.setActiveNode = function (node) {
			if (node.Type !== node) {
				this.command.error.ex('Invalid api use: cannot set active node as a non-node')
			};
			this.parent.activeNode = node;
			return;
		};
		terminalInterface.assembleAccessibleNodes = function () {
			this.command.assembleAccessibleNodes.ex();
		}
		terminalInterface.getAccessibleNodes = function () {
			return this.parent.accessibleNodes;
		};
		terminalInterface.appendAccessibleNodes = function (node) {
			this.command.appendAccessibleNodes.ex(node);
		};
		terminalInterface.appendAccessibleMalware = function (node) {
			this.command.appendAccessibleMalware.ex(node);
		};
		terminalInterface.clearAccessibleMalware = function (node) {

		};
		terminalInterface.checkIfInstalled = function (programName) {
			return (Object.keys(this.parent.programs).includes(programName))
		}
		terminalInterface.checkIfRunning = function (programName) {
			return (Object.keys(this.parent.programs.runningPrograms).indexOf(programName) !== -1)
		}
		terminalInterface.getPrograms = function () {
			return this.parent.programs
		};
		terminalInterface.getRunningPrograms = function (){
			return this.parent.programs.runningPrograms;
		};
		terminalInterface.appendToRunningPrograms = function (programName, stopReplace) {
			if (!this.parent.programs[programName]){
				return;
			}
			this.parent.programs.runningPrograms[programName] = this.parent.programs[programName];
			if (!stopReplace){
				this.parent.command.stop.isAvail = true;
				return;
			}
		}
		terminalInterface.addMoveTriggeredFunction = function (funcName, func){
			if(!funcName){
				return
			}
			if (!func){
				return
			}
			if (this.command.mv.moveTriggeredFunctions[funcName]){
				return;
			}
			this.command.mv.moveTriggeredFunctions[funcName] = {
				func :func,
				name : funcName,
			};
		}
		terminalInterface.deleteMoveTriggeredFunction = function (funcName){
			if (! this.command.mv.moveTriggeredFunctions[funcName]){
				return;
			}
			delete (this.command.mv.moveTriggeredFunctions[funcName])
		}
		terminalInterface.clearSubmitTriggeredFunction = function () {
			this.submitTriggerFunction = false;
		}
		terminalInterface.setSubmitTriggeredFunction = function (callback) {
			this.submitTriggerFunction = callback;
		};
		terminalInterface.getNextDrawTriggerFunctionIndex = function (){
			return this.drawTriggerFunctions.length();
		}
		terminalInterface.addDrawTriggeredFunction = function (callback, name){
			//functions will trigger with every frame of the draw anim;
			this.drawTriggerFunctions.push({ func : callback, name : name });
			return (this.drawTriggerFunctions.length - 1);

		};
		terminalInterface.clearDrawTriggeredFunctions = function (){
			this.drawTriggerFunctions = [];
		};
		terminalInterface.deleteDrawTriggeredFunctions = function (funcName){
			var spliceIndex = [];
			this.drawTriggerFunctions.forEach(function(functionObj, index){
				if (functionObj.name === funcName){
					spliceIndex.push(index)
				}
			});
			if (spliceIndex.length > 0){
				spliceIndex.forEach(function(index){
					this.drawTriggerFunctions.splice(index, 1);
				}, this);
			};
			return;
		}
		terminalInterface.addInstallTrigger = function (callback) {
			this.command.install.triggerFuncs.push(callback);
			return this.command.install.triggerFuncs.length - 1;
		};
		terminalInterface.triggerOnSubmit = function () {
			if (!this.submitFlag){
				return;
			}
			if (this.submitTriggerFunction === undefined){
				return;
			}
			this.submitTriggerFunction();
			return;
		};
		terminalInterface.raiseSubmitFlag = function () {
			this.submitFlag = true;
		};
		terminalInterface.lowerSubmitFlag = function () {
			this.submitFlag = false;
		};
		terminalInterface.executeCommand = function (commandName, arg1, arg2, arg3) {
			if (!this.command[commandName]){
				this.command.error.ex('Invalid api use: command not recognized')
				return;
			};
			this.command[commandName].ex(arg1,arg2, arg3)
		};
		terminalInterface.executeSilentCommand = function(commandName, args) {
			this.command[commandName].ex(...args)
		}
		terminalInterface.addSilentCommand = function (commandObj){
			this.command.addCommand.ex(commandObj);
			this.command[commandObj.name].isAvail = false;
		};
		terminalInterface.getAvailCommands = function () {
			return (Object.keys(this.command).filter(function(commandName){
				return this.command[commandName].isAvail
			}, this))
		}
		terminalInterface.commandAvailCheck = function (commandName){
			if (!this.command[commandName]){
				return false;
			}
			return (this.command[commandName].isAvail)
		}
		terminalInterface.commandExistenceCheck = function (commandName){
			if (this.command[commandName]){
				return true;
			}
			return false;
		};
		terminalInterface.deleteInterfaceFunction = function (funcName, programName){
			if (!this[funcName]){
				return;
			}
			this[funcName] = function () {
				this.throwError(`${programNam} uninstalled... ${funcName} now deprecated`);
				return;
			}.bind(this)
		};
		terminalInterface.addInterfaceFunction = function (func, funcName){
			if (!typeof func === "function"){
				console.log(`MISTAKE: TYPE OF FUNC IS...${typeof func}`)
				return
			}
			console.log(funcName)
			this[funcName] = func;
		};
		terminalInterface.patchInterfaceFunction = function (func, funcName){
			if (this[funcName]){
				delete this[funcName];
				this[funcName] = func;
			};
		};
		terminalInterface.addCommand = function (commandObject) {
			/*
				commandObj = {
					name: {string},
					syntax: {string},
					desc: {string},
					ex : {function},
				},
			*/
			this.command.addCommand.ex(commandObject);
		};
		terminalInterface.renameCommand = function (commandName, newName){
			if (!this.command[commandName]){
				console.log(`cannot rename a non-existent command`)
				return;
			}
			if (this.command[newName]){
				console.log(`${newName} already taken, try a different name for renaming ${commandName}`)
					return;
				}
			
			this.command[newName] = this.command[commandName];
			var oldSyntax = this.command[newName].syntax
			var newSyntax = `${newName}` + oldSyntax.slice(oldSyntax.indexOf(" "));
			this.command[newName].syntax = newSyntax;
			delete this.command[commandName];
		};
		terminalInterface.readyCommand = function (commandName){
			if (!this.command[commandName]){
				console.log(`ERROR: readyCommand(${commandName})... no such command name to be readied`)
				return
			}
			this.command[commandName].isAvail = true;
		}
		terminalInterface.hideCommand = function (commandName){
			if(!this.command[commandName]){
				console.log(`cannot hide a non-existent command`)
				return;
			}
			this.command[commandName].isHidden = true;
		};
		terminalInterface.unhideCommand = function (commandName){
			if (!this.command[commandName]){
				console.log('cannot unhide a non-existent command');
			}
			this.command[commandName].isHidden = false;
		}
		terminalInterface.incrementCommandUsedBy = function (commandName) {
			this.command.incrementCommandUsedBy.ex(commandName);
		};
		terminalInterface.decrementCommandUsedBy = function (commandName) {
			this.command.decrementCommandUsedBy.ex(commandName);
		};
		terminalInterface.getCommandUsedBy = function (commandName) {
			if (!this.command[commandName]){
				console.log(commandName);
				return;
			}
			return this.command[commandName].usedBy
		};
		terminalInterface.deleteCommand = function (commandName) {
			this.command.deleteCommand.ex(commandName);
		};
		terminalInterface.blockCommand = function (commandName, blockText){
			this.command.blockCommand.ex(commandName,blockText);
		};
		terminalInterface.unblockCommand = function (commandName) {
			this.command.unblockCommand.ex(commandName);
		};
		terminalInterface.defeatedMalware = function (malwareName, malwareType) {
			var text = `moleSeed's built-in anti-malware has scrubbed ${malwareName} from this terminal remote`
			var text2 = `residual effects of ${malwareName} may be indeterminate`
			var text3 = `try not to install or execute any more ${malwareType}s while you're bumbling aimlessly about... I mean... uh... If you wanna mess with that stuff... there are MUCH better ways of going about it.`
			this.cache.composeText(text)
			this.cache.composeText(text2)
			this.cache.composeText(text3)
			return;
		};
		terminalInterface.getMemoryUsage = function () {
			return this.parent.memoryManager.getMemoryUsage();
		};
		terminalInterface.reallocateMemoryOnActiveNode = function () {
			this.parent.activeNode.allocateMemory(this.parent.index, this.getMemoryUsage().total)
		}
		terminalInterface.addTerminal = function () {
			if (this.parent.terminalActivator.getTerminalCount() <= 3){
				return this.parent.terminalActivator.addTerminal(this.parent.activeNode /*this.getSaveFile();*/);
			}
		};
		terminalInterface.activateTerminalAtIndex = function (index) {
			if (this.parent.index === index) {
					if (this.parent.isActiveTerminal){
						return;
					}
				}
				if (!this.parent.terminalActivator.isTerminalAtIndex(index)){
					return;
				}
				this.parent.terminalActivator.activateTerminal(index);
		};
		terminalInterface.getLastTerminalIndex = function () {
			var count = this.parent.terminalActivator.getTerminalCount();
			if (this.parent.terminalActivator.isTerminalAtIndex(count - 1)){
				return (count -1)
			} else {
				if (this.parent.terminalActivator.isTerminalAtIndex(count -2)){
					return (count - 2);
				} else {
					if (this.parent.terminalActivator.isTerminalAtIndex(count -3)){
						return (count -3);
					} else {
						return 0;
					}
				}
			}
		};
		terminalInterface.addRemoveEdge = function(nodeATrueAddress, nodeBTrueAddress, removeToggle, symmetricToggle){
			this.parent.terminalActivator.addRemoveEdge(nodeATrueAddress, nodeBTrueAddress, removeToggle, symmetricToggle);
		};
		terminalInterface.addRemoveNode = function(nodeTrueAddress, removeToggle){
			this.parent.terminalActivator.addRemoveNode(nodeTrueAddress, removeToggle);
		};
		terminalInterface.updateUniversalValue = function (key, value) {
			this.parent.terminalActivator.updateUniversalValue(key, value);
		};
		terminalInterface.updateTerminalValue = function (key, value) {
			this.parent.terminalActivator.updateTerminalValue(key, value, this.parent.index);
		};
		terminalInterface.getUniversalValue = function (key) {
			return this.parent.terminalActivator.getUniversalValue(key)
		};
		terminalInterface.clearStorage = function () {
			console.log('routing clearStorage to activator');
			this.parent.terminalActivator.clearStorage();
		};
		terminalInterface.saveTerminalStates = function () {
			this.parent.terminalActivator.saveFileManager.harvestAndSaveWorldState();
		};
		terminalInterface.printStorage = function () {
			this.parent.terminalActivator.saveFileManager.printStorage();
		};
		terminalInterface.testDiffMod = function (a,b,c,d) {
			this.parent.terminalActivator.saveFileManager.appendEdge(a,b,c,d);
		};
		terminalInterface.handleNodeAttachment = function (nodeA, nodeB) {
			this.parent.terminalActivator.handleAttachingNodes(nodeA.getTrueAddress(), nodeB.getTrueAddress());
		};
		terminalInterface.alternateKeyRouterActive = function () {
			return false;
		};
		terminalInterface.usingKeyUpHandling = function () {
			return false;
		};
		terminalInterface.useDefaultKeyRouter = function (e) {
			this.parent.keyRouter.route(e);
			return;
		};
		terminalInterface.positionCursor = function (x,y){
			if (typeof x !== 'number'){
				console.log(`early ret :: ${x} is apparently not a number`)
				return;
			}
			if (typeof y !== 'number'){
				console.log(`early ret :: ${y} is apparently not a number`)
				return;
			}
			this.parent.blinkyCursor.position.x = x;
			this.parent.blinkyCursor.position.y = y;
			this.setCursorBright();
		};
		terminalInterface.restoreDefaultCursorPosition = function () {
			this.parent.blinkyCursor.position.leadTheText();
			this.parent.blinkyCursor.position.slamDown();
		};
		terminalInterface.getCursorPosition = function () {
			var x = this.parent.blinkyCursor.position.x
			var y = this.parent.blinkyCursor.position.y
			return [x,y];
		}
		terminalInterface.logCursorPosition = function () {
			var x = this.parent.blinkyCursor.position.x
			var y = this.parent.blinkyCursor.position.y
		};
		terminalInterface.setCursorBright = function () {
			this.parent.blinkyCursor.setBright()
		};
		terminalInterface.highlightCell = function (rowIndex, colIndex) {
			this.cache.addHighlight(rowIndex, colIndex);
		};
		terminalInterface.unhighlightCell = function (rowIndex,colIndex) {
			this.cache.removeHighlight(rowIndex,colIndex);
		};
		terminalInterface.clearHighlights = function () {
			this.cache.clearHighlights();
		};
		const init = function (trmnl) {
			terminalInterface.parent = trmnl;
			terminalInterface.cache = trmnl.cache;
			terminalInterface.command = trmnl.command;
			terminalInterface.compiler = trmnl.compiler;
			terminalInterface.drawTriggerFunctions = [];
		};
		init(this);
		return terminalInterface;
	}

	constructAnimations (context, api, env) {
		const animations = {};
		animations.biosAnim =  {
			ex : function () {
				const anim = this;
				var line = '%SEEK<#BIOS> [X.00000000] - [x.00000fff]: Scouring memory for system bios;'
				this.api.composeText(line, true, true, 5);
				for (var i = 2; i < anim.api.getRowCount() - 2 ; i ++){
					anim.api.writeLine('')
				}
				var count = 0;
				for (var i = 4000; i < 8095; i ++){
					var func = function () {
						count = count + 1
						anim.biosAnim.scour(count)
					}
					setTimeout(func , (i/4))
				}
				setTimeout(function(){
					anim.api.clearContiguousRows(0, anim.api.getRowCount())

				anim.api.writeLine('');
				anim.api.writeLine('');
				anim.api.writeLine('');
				anim.api.writeLine('');
				var line0 = 'RTRN|#FLAG| <= [X.00000000] - [x.00000fff]: Memory flagged; ready for ALOC;'
				anim.api.composeText(line0, true, true, 5);
				anim.api.writeLine('');
				anim.api.writeLine('');
				anim.api.writeLine('');
				anim.api.writeLine('');

				var lineA = `%dclr_$wrwm_#trgt<#FLAG_#null>: prepping <rtrn>flag_null`
				var lineB = `%dclr_$dlwm_#trgt<#FLAG_#scfn>: prepping <rtrn>flag_scfn`
				var lineC = `%dclr_$rctr_#trgt<#FLAG_#hdwr>: prepping <rtrn>flag_hdwr`
				var lineD = `%dclr_$caca_#trgt<#FLAG_#dipr>: prepping <rtrn>flag_dipr`
				
				anim.api.writeLine("");
				anim.api.composeText(lineA, true, true, 5);
				anim.api.writeLine("");
				
				
				anim.api.writeLine("");
				anim.api.composeText(lineB, true, true, 5);
				anim.api.writeLine("");
				
				
				anim.api.writeLine("");
				anim.api.composeText(lineC, true, true, 5);
				anim.api.writeLine("");
				
				
				anim.api.writeLine("");
				anim.api.composeText(lineD, true, true, 5);
				anim.api.writeLine("");

				for (var i = 23; i < anim.api.getRowCount(); i ++){
					anim.api.writeLine('')
				};
				count = 0;

				

				setTimeout(function () {
					anim.api.clearContiguousRows(0, anim.api.getRowCount())
					anim.api.writeLine('');
					var lineF = '%INCH_%SEEK<#FLAG>_%ALOC<&n&> [X.00000000] - [x.00000fff]: Allocating memory for BIOS injection'
					anim.api.composeText(lineF, true, true, 5);
					for (var i = 3; i < anim.api.getRowCount(); i ++){
						anim.api.writeLine('')
					}
				}, 1024)

				for (var i = 8000; i < 12095; i ++){
					var func = function () {
						count = count + 1
						anim.biosAnim.allocate(count)
					}
					setTimeout(func , (i/4))
				}

				}, 2048)

				setTimeout(function() {
					anim.api.clearContiguousRows(0, anim.api.getRowCount())
				}, 5264)

			}.bind(animations),
			scour : function (value) {
				var val = value
				var memLoc = (val).toString(16)
				var fill = ("0").repeat(8 - memLoc.length);
				var addmessage = "%SEEK#|&n&| => _type_stnd_bios --FLAG"
				if (value % 13 === 0) {
					addmessage = "%SEEK#|&n&| => _type_null_frag ++%FLAG_#null<&n&>"
				}
				if (value % 29 === 0) {
					addmessage = "%SEEK#|&n&| => _type_scrt_func ++%FLAG_#scfn<&n&>"
				}
				if (value % 31 === 0) {
					addmessage = "%SEEK#|&n&| => _type_dumb_hdwr ++%FLAG_#hdwr<&n&>"
				}
				if (value % 87 === 0) {
					addmessage = "%SEEK#|&n&| => _type_fuck_shit ++%FLAG_#dipr<&n&>"
				}
				var line = `%INCH_%SEEK<#BIOS> [X.${fill + memLoc}] : ${addmessage}`
				this.api.composeText(line, true, true, 5)
			}.bind(animations),
			allocate : function (value) {
				var val = value
				var memLoc = (val).toString(16)
				var fill = ("0").repeat(3 - memLoc.length);
				var message = ""
				if (value % 13 === 0) {
					message = `#null#|${fill + memLoc}| => %ALOC_#INJC`
				}
				if (value % 29 === 0) {
					message = `#scfn#|${fill + memLoc}| => %ALOC_#NUKE => %NUKE#|&n&| => %ALOC_#INJC`
				}
				if (value % 31 === 0) {
					message = `#hdwr#|${fill + memLoc}| => %ALOC_#CTRL => $rctr_%rofl`
				}
				if (value % 87 === 0) {
					message = `#dipr#|${fill + memLoc}| => %ALOC_#POOP => %DUMP#|&n&|`
				}
				if (message === ""){
					return
				}
				this.api.composeText(message, true, true, 5)
				return
				
			}.bind(animations)


		}
		animations.bootLoaderAnim = {
			ex : function () {
				var text = ""; 
				var anim = this;
				var rows = anim.api.getRowCount();
				
				anim.api.writeToGivenRow("booting new instance of moleSeed terminal...", 1)

				var count = 0
				for (var k = 0; k < 150; k ++){
					setTimeout(function () {
						count = count+1
						for (var i = 0; i < rows ; i ++){
							for (var j = 0; j < rows; j ++){
								var shouldSkip = Math.floor((Math.random()*count)) + Math.floor(count*count/100) + (i);
								anim.api.writeToCoordinate(anim.trmnl.generateAddress(1),i,j)
								if (shouldSkip > 100){
									anim.api.writeToCoordinate(" ", i, j);
								}
							}
						}
					}, 1600 + (k)*50)
				}
				
				const countArray = [];
				var counter2 = 0;
				//this.api.composeText('', true, true, 5)
				return;
			}.bind(animations),
			moleMoveR : function (frame) {
				var anim = this;
				var rows = anim.api.getRowCount() + 1
				var ground = ("#").repeat(rows);
				var tunnel = ""
				if (frame >= 4){
					tunnel = (" ").repeat(frame - 4);
				}
				var mole = "( )="
				return (tunnel + mole.slice(Math.max(0, 4-frame)) + ground.slice(frame)).slice(0,rows)
			}.bind(animations),
			moleMoveL : function (frame) {
				var anim = this;
				var rows = anim.api.getRowCount() + 1
				var ground = ("#").repeat(rows);
				var tunnel = ""
				if (frame >= 4){
					tunnel = (" ").repeat(frame - 4);
				}
				var mole = "=( )"
				return (ground.slice(frame) + mole.slice(Math.max(0, ((0 - rows) + frame))) + tunnel).slice(0,rows)
			}.bind(animations),
		}
		animations.reBootLoaderAnim = {
			ex : function () {
				var text = ""; 
				var anim = this;
				var rows = anim.api.getRowCount();
				
				anim.api.writeToGivenRow("linking instance of moleSeed terminal remote...", 1)

				var count = 0
				for (var k = 0; k < 150; k ++){
					setTimeout(function () {
						count = count+1
						for (var i = 0; i < rows ; i ++){
							for (var j = 0; j < rows; j ++){
								var shouldSkip = Math.floor((Math.random()*count)) + Math.floor(count*count/100) + (i);
								anim.api.writeToCoordinate(anim.trmnl.generateAddress(1),i,j)
								if (shouldSkip > 100){
									anim.api.writeToCoordinate(" ", i, j);
								}
							}
						}
					}, 1600 + (k)*50)
				}
				
				const countArray = [];
				var counter2 = 0;
				//this.api.composeText('', true, true, 5)
				return;
			}.bind(animations),
			moleMoveR : function (frame) {
				var anim = this;
				var rows = anim.api.getRowCount() + 1
				var ground = ("#").repeat(rows);
				var tunnel = ""
				if (frame >= 4){
					tunnel = (" ").repeat(frame - 4);
				}
				var mole = "( )="
				return (tunnel + mole.slice(Math.max(0, 4-frame)) + ground.slice(frame)).slice(0,rows)
			}.bind(animations),
			moleMoveL : function (frame) {
				var anim = this;
				var rows = anim.api.getRowCount() + 1
				var ground = ("#").repeat(rows);
				var tunnel = ""
				if (frame >= 4){
					tunnel = (" ").repeat(frame - 4);
				}
				var mole = "=( )"
				return (ground.slice(frame) + mole.slice(Math.max(0, ((0 - rows) + frame))) + tunnel).slice(0,rows)
			}.bind(animations),
		}

		const init = function (context, api, env) {
			animations.context = context
			animations.api = api
			animations.trmnl = env;
		};
		init(context, api, env)
		return animations
	}

	constructInput  (parent) {
		var input = {};
		input.reRouteInput = function (commandFull){
			var command = commandFull;
			
			if (this.filters.verify) {
				command = this.routes.verify(command)
				if (!this.filtersPassed.verify){
					return;
				}
			};
			if (this.filters.narrow) {
				command = this.routes.narrow(command)
				if (!this.filtersPassed.narrow){
					return;
				}
			};
			if (this.filters.extend) {
				command = this.routes.extend(command)
				if (!this.filtersPassed.extend){
					return;
				}
			};
			if (this.filters.input) {
				command = this.routes.input(command)
				if (!this.filtersPassed.input){
					return;
				}
			};			
			if (this.filters.null) {
				command = this.routes.null(command)
				if (!this.filtersPassed.null){
					return;
				}
			};
			if (this.shouldNotSubmitCatch){
				this.shouldNotSubmitCatch = false;
				this.buffer.pop();
				return;
			}

			for (var prop in this.filtersPassed){
				this.filtersPassed[prop] = false;
			}
			this.sendToCompiler(command);
		};

		input.inputCommand = function (){
			if (this.inputIsLocked){
				return;
			}
			var commandFull = this.cache.getInputRow();
			this.cache.submitInput();
			this.trmnl.blinkyCursor.position.leadTheText();
			if (this.shouldReRouteInput()) {
				this.bufferInput(commandFull);
				this.reRouteInput(commandFull);
				return;
			} else {
				this.api.writeLine("")
				this.sendToCompiler(commandFull);
			}
			if (this.api.submitTriggerFunction){
				this.api.submitTriggerFunction();
			}
		};

		input.sendToCompiler = function (commandFull){
			this.bufferInput(commandFull)
			this.command.assembleValidNodes.ex();
			//this.compiler.assembleValidPrograms(); // HOT FIX for the rewrite of assembleValidNOdes (MUST SIT b4 assemble ValidNOdes)
			//this.compiler.assembleValidNodes();
			this.api.raiseSubmitFlag();
			//this.compiler.compileAndExecuteCommand(commandFull)
			this.compiler.parseInput(commandFull)
		};

		input.bufferInput= function (commandFull){
			this.buffer.push(commandFull);
			return this.buffer.length;
		};
		input.peekBufferedInput = function () {
			return this.buffer[this.buffer.length - 1]
		};
		input.retrieveBufferedInput = function () {
			return this.buffer.pop();
		};
		input.shouldReRouteInput = function () {
			return Object.keys(this.filters).some(function(filterName){
				return this.filters[filterName] === true;
			},this)
		};

		input.deleteLastBufferedInput = function () {
			this.buffer.pop();
			return this.buffer.length
		};
		input.reBufferLastCmd = function () {
			this.bufferInput(this.buffer[this.buffer.length-1])
		};
		input.toggleFilterOff = function (string) {
			if (Object.keys(this.filters).indexOf(string) === -1){
				return;
			};
			this.filters[string] = false;
			return;
		};
		input.toggleFilterOn = function (string) {
			if (Object.keys(this.filters).indexOf(string) === -1){
				return;
			};
			this.filters[string] = true;
			return;
		};

		const init = function (trmnl) {
			input.routes = {
				verify : function (commandFull) {
					//this.command.log.ex(this.verifyMessage);
					var response = this.buffer.pop()[0]
					var toggle = { toggle : false };
					if (response === 'y'){
						toggle.toggle = true;
						if (this.callbacks.verify){
							this.callbacks.verify(true, toggle);
						}
						this.callbacks.verify = function () {};
						var command = this.retrieveBufferedInput();
						this.command.log.ex(`submitting ${command}`)
						this.messages.verify = this.messages.default_verify;
						this.toggleFilterOff('verify');
						this.filtersPassed.verify = true;
						if (!toggle.toggle){
							this.filtersPassed.verify = false;
						}
						//this.shouldReRouteInput = false;
						return command;
					}
					if (response === 'n'){
						if (this.callbacks.verify){
							this.callbacks.verify(false, toggle);
						}
						this.callbacks.verify = function () {};
						var command = this.retrieveBufferedInput()
						this.messages.verify = this.messages.default_verify;
						this.toggleFilterOff('verify');
						if (toggle.toggle){
							this.filtersPassed.verify = true;
							return command;
						}
						this.command.log.ex(`  aborted command : "${command}" `);
						return this.retrieveBufferedInput();
					}
						this.command.error.ex(`User_cannot_answer_a_simple_yes_or_no_question`)
						this.command.log.ex(`  aborted command : "${this.retrieveBufferedInput()}" `);
						this.messages.verify = this.messages.default_verify;
						this.toggleFilterOff('verify');
						if (this.callbacks.verify){
							this.callbacks.verify(false, toggle);
							this.callbacks.verify = function () {};
						}
					return `User_cannot_answer_a_simple_yes_or_no_question`

				},
				extend : function (commandFull) {

					var response = this.buffer.pop();

				},
				input : function (commandFull) {
					if (this.callbacks.input){
						this.callbacks.input(commandFull);
						this.callbacks.input = function () {};
						this.messages.input = this.messages.default_input;
						this.toggleFilterOff(`input`)
						this.filtersPassed.input = true;
						return;
					}
					return;
				},
				narrow : function (commandFull, bool){
					var inputTerms = commandFull.split(" ");
					var command = inputTerms[0];
					if (bool){
						this.narrowWhitelist = [];
						this.toggleFilterOff('narrow')
						return ;
					}
					if (this.narrowWhitelist.length === 0){
						this.toggleFilterOff('narrow')
						return;
					}
					if (this.narrowWhitelist.indexOf(command) === -1){
						this.command.log.ex(this.messages.narrow)
						if (this.callbacks.narrow){
							this.callbacks.narrow();
						} else {
							this.command.error.ex(`${command} is not a valid command, type "help" for options`)
						}
						return;
					}
					this.filtersPassed.narrow = true;
					return commandFull;
				},
				null : function () {
					//this.shouldReRouteInput = false;
					return;
				},
			};
			input.buffer = [];
			//if necessary, filters can be objectified and stacked in a given order,
			//currently, duplicate filters are unsupported --> they must all be unique
			//but there's a way to turn each filter into an object, so that the filters
			//can be iterated through;
			input.messages = {
				narrow : "",
				verify : "",
				extend : "",
				input : "",
				null : "",
				default_narrow : "",
				default_verify : "",
				default_extend : "",
				default_input : "",
				default_null : "",
			};
			input.callbacks = {
				narrow : function(){},
				verify : function(){},
				extend : function(){},
				input : function(){},
				null : function(){},
			};
			input.filters = {
				narrow : false,
				verify : false,
				extend : false,
				input : false,
				null : false,
			};
			input.filtersPassed = {
				narrow : false,
				verify : false,
				extend : false,
				input : false,
				null : false,
			};
			//input.inputFilters = ['null'];
			for (var prop in input.routes){
				input.routes[prop] = input.routes[prop].bind(input);
			}
			input.commandToExted = {};
			input.messages.verify = "command requires verification. continue? (y/n)"
			input.messages.default_narrow = "commands have been narrowed."
			input.messages.default_verify = "command requires verification. continue? (y/n)"
			input.messages.default_extend = "command requires additional terms. please extend command."
			input.messages.default_input = "command requires response:  "
			input.messages.default_null = "null"
			input.narrowWhitelist = [];
			input.trmnl = trmnl
			input.api = trmnl.api
			input.command = trmnl.command;
			trmnl.command.input = input;
			input.cache = trmnl.cache;
			input.blinkyCursor =  trmnl.blinkyCursor;
			input.compiler = trmnl.compiler;
			input.api.input = input
		}
		init(parent);
		return input;
	}


}
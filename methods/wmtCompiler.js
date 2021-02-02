export const program = {
	name : "wmtCompiler.MASM",
	isInstalled : false,

	target: {},
	dataTables : {
		numChars : ["0","1","2","3","4","5","6","7","8","9"],
		strictRuleTerminators : [" ", ";", ":"],
		genericTerminators : [" ", ";", ":"],
		genericUnexpectedTokens : ['"', ],
		varNameInitials : ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","_"]
		varNameChars : ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","_","0","1","2","3","4","5","6","7","8","9"]
		varNameTerminators : [" ","="],
		stringTerminator : ['"'],
		stringInitial : ['"'],
		stringChars : ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9","!","@","#","$","%","^","&","*","(",")","_","-","+","=","{","}","[","]","\\","|",";",":","'","<",",",">",".","/","?","~","`"," "]

	}
	state : {
		
	},
	errorMessages : {
		'000' : function () {
			return `syntaxError: unexpected character... "${this.state.currentCharacter}" not a recognized initial character for parseType = ${this.state.parseType}`;
		},
		'001' : function () {
			return `syntaxError: unexpected character... "${this.state.currentCharacter}" not in accepted set ${JSON.stringify(this.state.acceptableChars)}`;
		},
		'002' : function () {
			return `syntaxError: unexpected token... "${this.state.currentCharacter}" terminated parsing ${this.state.parseType}... expected at least one in accepted set ${JSON.stringify(this.state.acceptableChars)}`
		},
		'003' : function () {
			return `syntaxError: non-unique ${this.state.parseType}... "${this.state.term}" is already a ${this.state.parseType}`;
		},
		'004' : function () {
			return `referenceError: unrecognized term "${this.state.term}" or improper variable declaration`;
		},
		'100' : function () {
			return `typeError: expected type = ${this.state.expectedType} but got type = ${this.state.acquiredType}`;
		},
		'104' : function () {
			return `syntaxError: invalid assingment left-hand side, ("=" operator is for assignment only, to test equality, use "==")`;
		},
		'900' : function () {
			return `internalError: term length exceeds buffer size... ensure all terms are less than 1024 bytes`;
		},
		'999' : function () {
			return `internalError: parseGenericTerm fucked up... somehow... didn't think it was possible... damn.. sorry`
		}

	},
	compiler : {
		constructors : {
			assign : function (variable, value){

			},
			num_var : function (var_name) {

				var varName = var_name[0]();
				const defineNum = function () {
					this.variables[varName] = [undefined, 'num', varName];
					return this.variables[varName];
				}
				return [defineNum.bind(this.target), 'num_var'];
			},
			str_var : function (var_name) {
				var varName = var_name[0]();
				const defineStr = function () {
					this.variables[varName] = [undefined, 'str', varName];
					return this.variables[varName];
				}
				return [defineStr.bind(this.target), 'str_var'];
			},
			varName : function (str) {
				var string = str;
				const varName = function () {
					return string;
				}
				return [varName.bind(this.target), 'var_name'];
			},
			str_val : function (str) {
				var string = str;
				if (string[0] === '"'){
					string = string.substring(1);
				};
				if (string[string.length - 1] === '"'){
					string = string.substring(string.length - 1);
				};
				const defineStr_val = function () {
					return string;
				}
				return [defineStr_val.bind(this.target), 'str_val'];
			},
			var_var : function (varName) {
				var name = varName;
				var type = this.target.variables[name][1];
				const getVariable = function () {
					return this.variables[name];
				}
				return [getVariable.bind(this.target), `${type}_var`];
			},
			var_val : function (varName) {
				var name = varName;
				var type = this.target.variables[name][1];
				const getVarValue = function () {
					var value = this.variables[name][0];
					return value;
				}
				return [getVarValue.bind(this.target), `${type}_val`];
			}
		},
		composeTopConstructor : function () {
			var constructorArray = this.state.constructorFunctions.pop();
			this.state.task = `composing subFunc ${constructorArray[2]}`
			var constructorFunc = constructorArray[0];
			var expectedArgTypes = constructorArray[1];

			var applyArgs = [];
			for (var i = expectedArgTypes.length - 1; i >= 0; i--) {
				this.state.expectedType = expectedArgTypes[i]
				var arg = this.state.acquiredTerms.pop();
				this.state.acquiredType = arg[1];
				if (expectedArgTypes[i] !== arg[1]){
					this.methods.makeError('100');
				} else {
					applyArgs.push(arg);
				} 
			}
			applyArgs = applyArgs.reverse();

			/*
				I'm a little bit fuzzy on what goes on down here...
				But, hey... I think it should work?
			*/

			var newTerm = constructorFunc.apply(this, applyArgs);
			this.state.acquiredTerms.push(newTerm);
		},

	},
	parser : {
		variableRouter : {
			var : function (term) {
				this.state.acquiredTerms.push(this.compiler.constructors.var_var(term));
				this.parser.parse();
			},
			val : function (term) {
				this.state.acquiredTerms.push(this.compiler.constructors.var_val(term));
				this.parser.parse();
			},
		},
		genericRouter : {
			" " : function () {
				this.parser.parse();
			},
			'=' : function () {
				var assignee = this.parser.peekAcquiredTerm();
				var assType = assignee[1];
				if (assType.split("_")[1] !== 'var'){
					this.methods.makeError('104');
					return;
				};
				varType = assType.split("_")[0];
				this.parser.pushConstructorFunction('assign', [assType, `${varType}_val`] );
				this.parser.expectedArgs.push(`${varType}_val`);
				this.parser.parse();
			},
			'+' : function () {
				var assignee = this.parser.peekAcquiredTerm();
				var assType = assignee[1];
				if (assType !== 'num_val'){
					this.methods.makeError
				}
			},
			num : function () {
				this.parser.pushConstructorFunction('num_var', ['var_name'])
				this.state.expectedArgs.push("var_name");
				this.parser.parse();
			},
			str : function () {
				this.parser.pushConstructorFunction('str_var', ['var_name'])
				this.state.expectedArgs.push("var_name");
				this.parser.parse();
			},



		},
		specificRouter : {
			currentLineNum : function () {
				this.state.task = "parsing line number";
				this.state.parseType = "num_line";
				this.state.initialChars = this.dataTables.numChars;
				this.state.acceptableChars = this.dataTables.numChars;
				this.state.terminalChars = this.dataTables.strictRuleTerminators;
				var term = this.parser.parseSpecific();

				var lineNum = parseInt(term);
				if (this.target.lines[lineNum] !== undefined){
					this.methods.makeError('003');
				} else {
					this.state.currentLine = lineNum;
				}
				this.parser.parse();
			},
			var_name : function () {
				this.state.task = "parsing variable name";
				this.state.parseType = "var_name";
				this.state.initialChars = this.dataTables.varNameInitials;
				this.state.acceptibleChars = this.dataTables.varNameChars;
				this.state.terminalChars = this.dataTables.varNameTerminators;

				this.parser.parseSpecific();

					//since whatever called this wants it, we might wanna delegate to some kind of
					//composition function
				this.parser.pushAcquiredTerm();
				this.parser.parse();
			},
			str_val : function () {
				this.state.task = "parsing string value"
				this.state.parseType = "str_val";
				this.state.initialChars = this.dataTables.stringInitial;
				this.state.terminalChars = this.dataTables.stringTerminator;
				this.state.acceptibleChars = this.dataTables.stringChars;
				this.parser.parseSpecific();

				this.parser.pushAcquiredTerm();
				this.parser.parse();
			},
			num_val : function () {
				this.state.task = "parsing numerical value";
				this.state.parseType = "num_val";
				this.state.initialChars = this.dataTables.numChars;
				this.state.acceptibleChars = this.dataTables.numChars;
				this.state.terminalChars = this.dataTables.strictRuleTerminators;
				this.parser.parseSpecific();

				this.parser.pushAcquiredTerm();
				this.parser.parse();
			}
		},
		parseGenericTerm : function () {
			this.state.task = "parsing next term"
			var prgm = this;
			var acceptibleTerms = Object.keys(this.parser.genericRouter)
			var definedVariables = Object.keys(this.target.variables);
			var terminators = this.dataTables.genericTerminators;
			var term = "";
			const termBuilder = function (term, numCount) {
				if (!numCount){
					numCount = 0;
				}
				numCount += 1;
				if (numCount >= 1024){
					prgm.methods.makeError('900')
					return;
				}
				if (term.length === 0){
					var nextChar = prgm.parser.peekNextChar();
					if (nextChar === " "){
						prgm.parser.getNextChar();
						return termBuilder(term, numCount);
					} else if (terminators.includes(nextChar)) {
						term += prgm.parser.getNextChar();
						return term;
					} else {
						term += prgm.parser.getNextChar();
						return termBuilder(term, numCount);
					}
				} else {
					if (acceptibleTerms.includes(term)){
						return term;
					} else if (definedVariables.includes(term)){
						//institute state change
						return term;
					} else {
						var nextChar = prgm.parser.peekNextChar();
						if (terminators.includes(nextChar)){
							prgm.state.term = term;
							prgm.methods.makeError('004')
						} else {
							term += prgm.parser.getNextChar();
							return termBuilder(term, numCount)
						}
					}
				}
			}
			term = termBuilder(term);
			this.state.term = term;
			if (acceptibleTerms.includes(term)){
				this.parser.genericRouter[term]()
			} else if (definedVariables.includes(term)){
				this.parser.variableRouter['var'](term);
			} else {
				this.methods.makeError('999')
				return;
			}
		},

		parseSpecific : function () {
			var term = "";
			var prgm = this;
			var parseAsVariable = false;
			const termBuilder = function (term, numCount) {
				if (!numCount){
					numCount = -1;
				}
				numCount += 1;
				if (numCount >= 1023){
					prgm.methods.makeError('900')
					return;
				}
				if (term.length === 0){
					var char = prgm.parser.peekNextChar();
					if (char === " "){
						prgm.parser.getNextChar();
						return termBuilder(term, numCount);
					} else if (prgm.state.initialChars.includes(char)){
						term += prgm.parser.getNextChar();
						return termBuilder(term, numCount);
						return;
					} else if (prgm.state.terminalChars.includes(char)){
						prgm.parser.getNextChar();
						prgm.methods.makeError('002');
						return;
					} else {
						var variableList = Object.keys(prgm.target.variables).filter(function(varName){
							if (char !== varName[0]){
								return false;
							} else {
								return true;
							}
						})
						if (variableList.length >= 1){
							parseAsVariable = true;
							prgm.state.acceptibleChars = prgm.dataTables.varNameChars;
							prgm.state.terminalChars = prgm.dataTables.varNameTerminators;
							term += prgm.parser.getNextChar();
							return termBuilder(term, numCount)
						}
						prgm.parser.getNextChar();
						prgm.methods.makeError('000');
						return;
					}
				} else {
					var char = prgm.parser.peekNextChar();
					if (prgm.state.acceptableChars.includes(char)){
						term += prgm.parser.getNextChar();
						return termBuilder(term, numCount);
					} else if (prgm.state.terminalChars.includes(char)){
						return term;
					} else {
						prgm.parser.getNextChar();
						prgm.methods.makeError('001')
						return;
					}
					
				}

			}
			term = termBuilder(term);
			this.state.currentTerm = term;
			if (parseAsVariable){
				if (Object.keys(this.target.variables).includes(term)){
					if (this.state.parseType.split("_")[1] === 'val'){
						this.state.parseType = 'var_val';
						//this.parser.variableRouter.val(term);
					} else if (this.state.parseType.split("_")[1] === 'var'){
						this.state.parseType = 'var_var';
						//this.parser.variableRouter.var(term);
					}
				}
			}
			return term;
		},

		peekConstStack : function () {
			return this.state.constructorFunctions[this.state.constructorFunctions.length - 1];
		},
		pushConstructorFunction : function (constructorName, typeArray) {
			var constructor = this.compiler.constructors[constructorName]
			this.state.constructorFunctions.push([constructor, typeArray, constructorName])
		},

		peekAcquiredTerm : function () {
			return this.state.acquiredTerms[this.state.acquiredTerms.length - 1];
		},

		pushAcquiredTerm : function () {
			var constructor = this.compiler.constructors[this.state.parseType]
			var term = this.state.term;
			this.state.acquiredTerms.push(constructor(term))
		},

		peekNextChar : function () {
			return this.state.parseString[0];
		}

		getNextChar : function () {
			this.state.currentStringIndex += 1;
			this.state.currentLineIndex += 1;
			var char = this.state.parseString[0];
			this.state.currentCharacter = char;
			this.state.parseString = this.state.parseString.substring(1);
			return char
		},


		parseGenericTerm : function (term) {
			this.parser.genericRouter[term]();
		},
		parseSpecificTerm : function (term){
			this.parser.specificRouter[term]();
		},

		parse : function () {
			if (this.state.errorState){
				this.methods.throwError();
				return;
			};
			if (this.state.currentLine < 0 /* || some bool representing need to parse next line... like... saw a ';'?*/){
				this.parser.parseSpecificTerm('currentLineNum');
				return;
			};
			if (this.state.expectedArgs.length >= 1 && this.state.constructorFunctions.length >=1){
				var argType = this.state.expectedArgs.pop();
				this.parser.parseSpecificTerm(argType);
				return;
			};
			if (this.state.expectedArgs.length === 0 && this.state.constructorFunctions.length >=1){
				this.compiler.composeTopConstructor();

			};

			this.parser.parseGenericTerm();
		},

	},
	methods : {
		prepAll : function (nodeName){
			var textToCompile = this.methods.importWmt(nodeName);
			this.methods.initializeState(textToCompile);
			this.methods.initializeNewTarget(nodeName);
		},
		initializeNewTarget : function (name) {
			const targetConstructor = function (name) {
				const target = {};
				const init = function (name) {
					console.log(`WE MAY WANT TO CHANGE FILE EXTENTION NAME HERE!`)
					target.name = name;
					target.errorState = false;
					target.errorMessage = "";
					target.end = false;
					target.loopCount = false;
					target.currentLine = 0;
					target.nextLine = 0;
					target.lastLine = 0;
					target.variables = {};
					target.lines = {};
				}
				target.ex = function () {
					this.lines['00'](this.variables);
					var prgm = this;
					var api = this.api;
					var executableLoop = function () {
						if (prgm.end){
							api.log(`${this.name} reached "END" on line ${this.currentLine}`);
							api.deleteDrawTriggeredFunction(`${this.name}`);
							return;
						};
						if (prgm.errorState){
							api.throwError(this.errorMessage);
							api.deleteDrawTriggeredFunction(`${this.name}`);
							return;
						};
						if (prgm.loopCount >= 1000000){
							prgm.errorState = true;
							prgm.errorMessage = "loop iteration exceeded max buffer space. Cannot proceed."
							return;
						};
						if (prgm.nextLine === prgm.currentLine){
							prgm.executeNextLine(prgm.currentLine);
							return;
						} else {
							prgm.executeLineAt(prgm.nextLine);
						}
					}
					executableLoop = executableLoop.bind(this);
					var setTicksPerDraw = function (number) {
						var iterations = number;
						var returner = function () {
							for (var i = 0; i < iterations; i++){
							executableLoop();
							}
						}
						return returner;
					}

				this.api.addDrawTriggeredFunction(setTicksPerDraw(2), `${this.name}`);
				};
				target.executeNextLine = function (currentLine) {
					var foundLine = false;
					for (var i = currentLine; i <= this.lastLine; i++) {
						if (this.lines[i]){
							this.lines[i]();
							break;
						}
					}
					if (!foundLine){
						this.errorState = true;
						this.errorMessage = `default goto_nextLine on line ${this.currentLine} not a valid controlFlow... no lines after ${this.lastLine}`;
					}
					return;
				};
				target.executeLineAt =  function (lineTarget) {
					if (this.lines[lineTarget]){
						this.lines[lineTarget]();
					} else {
						this.errorState = true;
						this.errorMessage = `"goto ${lineTarget}" on line ${prgm.currentLine} not a valid controlFlow... no lines after ${prgm.lastLine}`;
					}
					return;
				};
				init(name)
				return target;
			}
			this.target = targetConstructor(name)
		},
		initializeState : function (textString) {
			const stateConstructor = function () {
				const state = {};
				const init = function (textString) {
					state.acceptableChars = [];
					state.terminalChars = [];
					state.fullInputString = textString;
					state.parseString = textString;
					state.currentLine = -1;
					state.currentStringIndex = 0;
					state.currentLineIndex = 0;
					state.composingFunction = "";
					state.term = "";
					state.currentCharacter = "";
					state.currentLineHasControlFlow = false;
					state.forStack = [];
					state.whileStack = [];
					state.constructorFunctions = [];
					state.expectedArgs = [];
					state.acquiredTerms = [];
					state.parseType = "";
					state.task = "";
					state.earlyReturn = false;
					state.errorState = false;
					state.errorCode = "";
				};
				init(textString);
				return state;
			}
			this.state = stateConstructor()
		},
		importWmt : function (nodeName) {
			var accessibleNodes = this.api.getAccessibleNodes();
			var accessibleNodesList = Object.keys(accessibleNodes);
			if (!accessibleNodesList.includes(nodeName)){
				this.api.throwError(`Cannot compile ${nodeName}... no such node found`);
				return;
			};
			if (accessibleNodes[nodeName].type !== 'wmt') {
				//TYPE MAY CHANGE>>>> Hence console log
				console.log(`NODE type-Checking in importWMT func is not complete...\n see wmtCompiler.methods.importWMT`);
				return;
			};
			var textToCompile = accessibleNodes[nodeName].getText();
			return textToCompile;
		},
		makeError : function (errorCode) {
			this.state.errorState = true;
			this.state.errorCode = errorCode;
			return;
		}
		throwError : function (){
			var location = `at line ${this.state.currentLine} at index ${this.state.currentLineIndex} (${this.state.currentStringIndex})`;
			var task = `while ${this.state.task}`
			var error = `wmtCompiler.MASM threw errorCode ${this.state.errorCode}: ${this.errorMessages[this.state.errorCode]()}`;
			var message = error + task + location;
			this.api.throwError(message);
			return;
		}
		compile : function () {

		}

	},
	ex : function (nodeName) {

		console.log(`YOU'RE GOING TO NEED INPUT REQUESTS IN HERE TO ENSURE A VALUE`)


		this.methods.prepAll(nodeName);
		this.methods.compile();
	},
	install : function (trmnl, callback) {
		this.trmnl = trmnl;
		trmnl.programs[this.name] = this;
		this.api = trmnl.api;
		this.compiler.api = this.api;

		/*
		YOU GET TO DO THIS WHEN YOU ARE DONE WITH SOMETHING MARGINALLY FUNCTIONAL!
		this.installData.compile.ex = this.installData.compile.ex.bind(this);
		*/

		Object.keys(this.methods).forEach(function(methodName){
			if (typeof this.methods[methodName] === 'function'){
				this.methods[methodName] = this.methods[methodName].bind(this)
			}
		}, this);
		Object.keys(this.router).forEach(function(routerFunctionName){
			if (typeof this.router[routerFunctionName] === 'function'){
				this.router[routerFunctionName] = this.router[routerFunctionName].bind(this);
			} else if (routerFunctionName === 'specificRouter' || routerFunctionName === 'genericRouter'){
				Object.keys(this.router[routerFunctionName]).forEach(function(parserRouteName){
					this.router[routerFunctionName][parserRouteName] = this.router[routerFunctionName][parserRouteName].bind(this);
				}, this)
			}
		}, this)
		Object.keys(this.compiler).forEach(function(compilerFunctionName){
			if (typeof this.compiler[compilerFunctionName] === 'function'){
				this.compiler[compilerFunctionName] = this.compiler[compilerFunctionName].bind(this);
			}
		}, this);


		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			Should also install a parser addon 
			for the compile command -- 
			looking for .wmts
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

		*/
	}

}
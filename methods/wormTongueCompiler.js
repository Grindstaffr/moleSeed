export const program = {
	name : "wormTongueCompiler.MASM",
	isInstalled : false,
	runsInBackGround : false,
	size : 50,
	memory: 55,
	data : {


	},
	state : {
		earlyReturn : false,
		errorState : false,
		errorMessage : "",
	},
	settings : {

	},
	compiler : {
		functionQueue : [],
		state : {
			errorHandling : {
				errorState : false,
				errorMessage : "",
				currentRow : 0,
				currentIndex : 0,
				currentTask : "",
			},
			parser : {
				task : "",
				fullText : "",
				parserText : "",
				term: "",

				expectedTerm: "",
				expectedTermRequired : true,

				stringIndex : 0,
				currentRow : 0,
				currentRowIndex : 0,
				prevRowNum : 0,
			},
			errorState : false,
			earlyReturn : false,
			errorMessage : "",
			forIndexes : [],
			hasInitialLine : false,
			currentLine : -1,
			currentLineHasControlFlow : false,
			currentLineFuncs : [],
			lineFunction : function () {};
			lineFunctionName : "null";
			expectedTerms : {},
			acquiredTerms : {},
			lineIs : "initializing",
			program : {
				name : '',
				errorState : false,
				errorMessage: "",
				end : false,
				loopCount : 0,
				currentLine : 0,
				nextLine : 0,
				variables : {},
				lines : {},
				lastLine : 0, // needs to be updated with every parsed/compiled line;
				ex : function () {
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
				},
				executeNextLine: function (currentLine) {
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
				},
				executeLineAt : function (lineTarget) {
					if (this.lines[lineTarget]){
						this.lines[lineTarget]();
					} else {
						this.errorState = true;
						this.errorMessage = `"goto ${lineTarget}" on line ${prgm.currentLine} not a valid controlFlow... no lines after ${prgm.lastLine}`;
					}
					return;
				},
			},
		},
		argumentRouter : {
				bool_func : function () {

				},
				num_line : function (argString) {
					
				},
				func : function (argString) {
					
				},
				val : function (argString) {

				},
				str_val : function (argString) {

				},

			}
		termRouter : {
			controlFlow : {
				if : function (){
					this.state.expectedTerms["0"]= ['bool_func', "$if"];
					this.state.expectedTerms["1"] = ['func', "then", false];
					this.state.expectedTerms["2"]= ['func', "else", false];
					this.state.lineFunction = this.componentFunctionGenerators.controlFlow.ifThen;
				},
				goto : function (){
					this.state.expectedTerms["0"] = ["num_line", '$goto'];
					this.state.lineFunction = this.componentFunctionGenerators.controlFlow.executeLineAt;
				},
				for : function () {
					this.state.expectedTerms["0"] = ["num_var", "$for"];
					this.state.expectedTerms["1"] = ["num_val", "to"];
					//push a for constructor onto the for stack
					this.state.lineFunction = this.componentFunctionGenerators.controlFlow.forToNext;
				},
				next : function () {
					this.state.expectedTerms["0"] = ["num_line", '^for#'];
					this.state.expectedTerms["1"] = ["num_var", '^for'];
					this.state.lineFunction = this.componentFunctionGenerators.controlFlow.next;
				},
				while : function () {

				},
				wend : function () {

				},
			},
			variableDeclarations : {
				num : function () {
					this.state.expectedTerms["0"] = ["str_val"];
					this.state.lineFunction = this.componentFunctionGenerators.variableDeclarations.defineVarNumber;
				},
				str : function () {
					this.state.expectedTerms["0"]= ["str_val"];
					this.state.lineFunction = this.componentFunctionGenerators.variableDeclarations.defineVarString;
				},
				arr : function () {
					this.state.expectedTerms["0"] = ["str_val"];
					this.state.lineFunction = this.componentFunctionGenerators.variableDeclarations.defineVarArray;
				},
				bool : function () {
					this.state.expectedTerms["0"] = ["str_val"];
					this.state.lineFunction = this.componentFunctionGenerators.variableDeclarations.defineVarBoolean;
				},
			},
			terminalLib : {
				print : function () {
					this.state.expectedTerms["0"] = ["str_val", 0, "()"];
					this.state.lineFunction = this.componentFunctionGenerators.terminalLib.definePrint
				},
				mv : function () {

				},
				lk : function () {

				},
			},
			tokens : {
				";" : function () {

				},
				':' : function () {
					this.state.expectedTerms[this.state.expectedTerms.length] = ['num_line', 'goto']
				},
				'"' : function () {
					
				},
				'=' : function () {
					if (Object.keys(this.state.acquiredTerms).length === 0){
						this.parser.throwParserError('invalid assignment... no left-hand side before "="')
						return;
					}
					var acquiredType = this.state.acquiredTerms[0][1]
					if (acquiredType.split("_")[1] === 'var'){
						this.state.expectedTerms = [acquiredType.split("_")[0]+"_val"];
						this.state.lineFunction = this.componentFunctionGenerators.variableReferences.updateVariableValue

					}
					if (acquiredType.split("_")[1] === 'val'){
						this.parser.throwParserError(`invalid assignment... cannot assign an alternate value to a value primative`);
					}
					this.state.expectedTerms =
					
				},
				'>' : function () {
					
				},
				' ' :  function () {
					
				},

			}
		},
		componentFunctionGenerators : {
			primitives : {
				generateNumber : function (number) {
					var retNum = function () {
						return [number, 'num'];
					}
					return [retNum.bind(this.state.program), "num_val"];
					},
				generatePrimString : function (string) {
					var retStr = function () {
						return [string, 'str'];
					}
					return [retStr.bind(this.state.program), "str_val"];
				},
				generatePrimBool : function (bool) {
					if (bool !== true && bool !== false){
						return;
					}
					var retBool = function () {
						return [bool, 'bool'];
					}
					return [retBool.bind(this.state.program), "bool_val"];
				},
			},
			variableDeclarations : {
				/*
				I have a sneaking suspicion that we'll need a functionCall on all inputvalues...
				*/
				defineVarNumber : function (name) {
					if (this.state.program.variables[name]){
						this.parser.throwParserError(`Cannot declare new variable named ${name} when ${name} is an existing variable`);
						return;
					}
					var numberDefineFunction = function () {
						this.variables[name] = [value, 'num', name];
						return this.variables[name]
					}
					return [numberDefineFunction.bind(this.state.program), "num_var"];
				},
				defineVarBoolean : function (name) {
					if (this.state.program.variables[name]){
						this.parser.throwParserError(`Cannot declare new variable named ${name} when ${name} is an existing variable`);
						return
					}
					var booleanDefineFunction = function () {
						this.variables[name] = [value, 'bool', name];
						return this.variables[name]
					}
					return [booleanDefineFunction.bind(this.state.program), 'bool_var']
				},
				defineVarString : function (name) {
					if (this.state.program.variables[name]){
						this.parser.throwParserError(`Cannot declare new variable named ${name} when ${name} is an existing variable`);
						return;
					}
					var stringDefineFunction = function () {
						this.variables[name] = [ value,'str', name];
						return this.variables[name]
					}
					return [stringDefineFunction.bind(this.state.program), `str_var`];
				},
				defineVarArray : function (name, type, indexes) {
					/*
						!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
						We will have to deal with arrays at a later point...
						Due to defn refactor... this is for sure busted;
						!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					*/

					if (this.state.program.variables[name]){
						this.parser.throwParserError(`Cannot declare new variable named ${name} when ${name} is an existing variable`);
						return;
					}
					var arrayDefineFunction = function () {
						var array = {};
						for (var i = 0; i < indexes; i++) {
							array[i] = [type, '', i];
						}
						array.length = indexes;
						this.variables[name] = [ array,'arr', name];
					}
					return [arrayDefineFunction.bind(this.state.program), 'arr_var'];
				},
			},
			variableReferences : {		
				getVar: function (variable) {
					var x = variable();
					var type = x[1]
					var getVarFunction = function (name) {
						return x;
					};
					return [getVarFunction.bind(this.state.program), `${type}_var`];
				},
				getVarVal : function (variable) {
					var x = variable();
					var type = x[1];
					var getVarValFunction = function () {
						var type = x[1];
						return x[0];
					};
					return [getVarValFunction.bind(this.state.program), `${type}_val`]
				},
				getArrVal : function (variable, index){
					var x = variable();
					var type = x[1];
					var getArrValFunction = function () {
						return this.variables[name][index]
					}
					return [getArrValFunction.bind(this.state.program), `${type}_var`];
				},
				updateVariableValue : function (variable, value){
					var x = variable();
					var type = x[1];
					var updateVariableValueFunction  = function () {
						this.variables[x[2]][0] = value;
						return this.variables[x[2]];
					}
					return [updateVariableValueFunction.bind(this.state.program), `${type}_var`];
				},
			},
			booleanOperators : {
				testProp_bool : function (value) {
					var boolFunc = function (value){
						var a = value();
						if (a){
							return true;
						}
						return false;
					}
					return [boolFunc.bind(this.state.program), 'bool_func']
				},
				testProp_Not : function (value) {
					var notFunction = function () {
						var a = value();
						if (a){
							return false;
						}
						return true;
					}
					return [notFunction.bind(this.state.program), 'bool_func'];
				},
				testProp_And : function (valueA, valueB) {
					if (valueA[1] !== 'bool_val'){
						return;					
					}
					if (valueB[1] !== 'bool_val'){
						return;
					}
					var andFunction = function () {
						var a = valueA();
						var b = valueB();
						if (!a[0]){
							return false;
						}
						if (!b[0]){
							return false;
						}
						return true
					},
					return [andFunction.bind(this.state.program), 'bool_func'];
				},
				testProp_Or : function (valueA, valueB) {
					if (valueA[1] !== 'bool_val'){
						return;					
					}
					if (valueB[1] !== 'bool_val'){
						return;
					}
					var orFunction = function () {
						var a = valueA();
						var b = valueB();
						if (a[0]){
							return true;
						}
						if (b[0]){
							return true;
						}
						return false;
					}
					return [orFunction.bind(this.state.program), 'bool_func'];
				},
				testProp_Equivalence : function (valueA, valueB){
					if (valueA[1].split("_")[1] !== 'val'){
						return;					
					}
					if (valueB[1].split("_")[1] !== 'val'){
						return;
					}
					var equivalenceFunction = function () {
						var a = valueA();
						var b = valueB();
						if (a[1] === b[1]){
							if (a[0] === b[0]){
								return true;
							}
						}
						return false
					}
					return [equivalenceFunction.bind(this.state.program), 'bool_func'];
				},
				testProp_GreaterThan : function (valueA, valueB){
					if (valueA[1] !== 'num_val'){
						return;					
					}
					if (valueB[1] !== 'num_val'){
						return;
					}
					var greaterThanFunction = function () {
						var a = valueA();
						var b = valueB();
						if (a[1] === 'num' && b[1] === 'num'){
							if (a[0] > b[0]){
								return true
							}
						}
						return false;
					}
					return [greaterThanFunction.bind(this.state.program), 'bool_func'];
				},
				testProp_LessThan : function (valueA, valueB){
					if (valueA[1] !== 'num_val'){
						return;					
					}
					if (valueB[1] !== 'num_val'){
						return;
					}
					var lessThanFunction = function () {
						var a = valueA();
						var b = valueB();
						if (a[1] === 'num' && b[1] === 'num'){
							if (a[0] < b[0]){
								return true
							}
						}
						return false;
					}
					return [lessThanFunction.bind(this.state.program), 'bool_func'];
				},
			},
			controlFlow : {
				executeNextLine : function () {
					var returnFunc = function () {		
						this.nextLine = this.currentLine;
						return;
					}
					return [returnFunc.bind(this.state.program), 'goto_func']
				},
				executeLineAt : function (lineIndex) {
					var lineExecuteFunction = function () {
						this.nextLine = lineIndex;
						return;
					}
					return [lineExecuteFunction.bind(this.state.program), 'goto_func'];
				},
				ifThen : function (testProposition, thenFunc, elseFunc){
					//may need to check if these values are functions... or at least constructThem to always be
					var executeLineAt = this.componentFunctionGenerators.executeLineAt
					var ifThenFunction = function () {
						if (testProposition()) {
							thenFunc();
						} else {
							elseFunc();
						}
					}
					return [ifThenFunction, 'func'];
				},

				forToNext : function (variable, terminalValue, lineIndexNext) {
					var ifThen = this.componentFunctionGenerators.controlFlow.ifThen;
					var lessThan = this.componentFunctionGenerators.booleanOperators.testProp_LessThan;
					var equivalence = this.componentFunctionGenerators.booleanOperators.testProp_Equivalence;
					var or = this.componentFunctionGenerators.booleanOperators.textProp_or;
					var executeNextLine = this.componentFunctionGenerators.controlFlow.executeNextLine;
					var executeLineAt = this.componentFunctionGenerators.controlFlow.executeLineAt;
					var forLine = this.currentLine

					//BUSTED
					var forToNextFunc = function () {
						ifThen(or(lessThan(variable, terminalValue),equivalence(variable, terminalValue)), executeNextLine(this.currentLine), executeLineAt(lineIndexNext));
					}
					return [forToNextFunc.bind(this.state.program), 'func'];
				},
				next : function (variable, lineIndexFor){
					var updateVariableValue = this.componentFunctionGenerators.updateVariableValue;
					var next = function () {
						updateVariableValue(variable)
					}
				},
			},
			terminalLib : {
				print : function (string) { 
					if (string[1] !== 'str_val'){
						return;
					}
					var api = this.api;
					const printFunc = function () {
						api.log(string()[0]);
					}
				},
				mv : function (string) {

				},
				lk : function () {

				},

			},
			
			





			defineArrayVal : function (arrName, index, value){
				var defineArrayValFunction = function () {
					this.variables[arrName][index][0] = value;
				}
			},
		},
		parser : {
			route : function (type, index, wrapper) {


				this.parser.router[type](index);
			}
			router : {
				//router contains parserFunctions for each type?
				str_val : function (index, wrapper) {
					this.state.parser.task = 'defining str_val'
					var valToBe = this.parser.parseString();
					if (valToBe[0] === '"'){
						if ( valToBe[valToBe.length - 1] === '"'){
							var valFunc = this.componentFunctionGenerators.primatives.generatePrimString(valToBe);
							this.state.acquiredTerms[index] = valFunc;
							return;
						} else {
							this.parser.throwParserError(`expected " to terminate string`)
						}
					} else {
						if (Object.keys(this.state.program.variables))
					}
				},
				num_val : function (index, wrapper) {
					this.state.parser.task = 'defining num_val'
					var valToBe = this.parser.parseNextTerm(wrapper);
					var number =  parseInt(valToBe);
					if (Number.isNaN(number)){
						if (Object.keys(this.state.program.variables).includes(valueToBe)){
							if (this.state.program.variables[valToBe][1] === 'num_var'){
								var  valFunc = this.componentFunctionGenerators.variableReferences.getVariableValue;
							} else {
								this.parser.throwParserError(`typeError... expected type == 'num', got ${this.state.program.variables[valToBe][1]} `);
								return;
							}
						} else {
							this.parser.throwParserError(`expected number... but got ${valToBe}`);
							return;
						}
					}
					var valFunc = this.componentFunctionGenerators.primatives.generateNumber(number);
					this.state.acquiredTerms[index] = valFunc;
				},
				bool_val : function (index, wrapper) {
					this.state.parser.task = 'defining bool_val';
					var valToBe = this.parser.parseNextTerm(wrapper);
					var bool = true;
					if (valToBe === 'false' || valToBe === '0' || valToBe === 'null' || valToBe === 'undefined' || valToBe === ''){
						bool = false; 
					}
					var valFunc = this.componentFunctionGenerators.primatives.generatePrimBool(bool);
					this.state.acquiredTerms[index] = valFunc;
				},
				prim_type : function (index, wrapper) {
					this.state.parser.task = 'setting variable type';
					var valToBe = this.parser.parseNextTerm(wrapper);
					const acceptableTypes = ['str', 'num', 'bool', 'arr']
					if (!acceptableTypes.includes(valToBe)){
						this.parser.throwParserError(`expected variable type (str, num, bool, arr), but got ${valToBe}`);
						return;
					}
					var valFunc = this.componentFunctionGenerators.primatives.generatePrimString(valToBe);
					this.state.acquiredTerms[index] = valFunc;
				},



			},

			parseString : function (string) {
				var parsingStringLiteral = false;
				if (string[0] === '"'){
					parsingStringLiteral = true;
				}
				var parseStringLiteral = function (string, accumulator) {
					
				}

				var parseStringVarName = function (string, accumulator) {

				}


				if (parsingStringLiteral){
					parseStringLiteral(string);
				} else {
					parseStringVarName(string);
				}
			}

			parseNextTerm : function (tokenWrapper, string, accumulator) {
				var tokens = this.tokensList
				if (!string){
					string = this.state.parser.parserText
				}
				if (!accumulator){
					if (tokenWrapper){
						if (tokenWrapper[0] !== string[0]){
							this.parser.throwParserError(`expected token ${tokenWrapper[0]}... but got ${string[0]}`);
							return;
						}
						accumulator = string[0];
						return this.parser.parseNextTerm(tokenWrapper, this.parser.incrementParserIndex(), accumulator);
					}
				};
				if (tokens.includes(string[0])){
					if (tokenWrapper){
						if (tokenWrapper.length === 2){
							if (string[0] === tokenWrapper[1]){
								return accumulator.slice(1);
							} else {
								this.parser.throwParserError(`expected token ${tokenWrapper[1]}... but got token ${string[0]}`);
								return;
							}
						}
						if (tokenWrapper.length === 1){
							return accumulator.slice(1);
						}
					}
					if (!accumulator || accumulator.length === 0){
						accumulator = string[0];
					}
					return accumulator;
				};
				accumulator += string[0];
				return this.parser.parseNextTerm(tokenWrapper, this.parser.incrementParserIndex(), accumulator);
			},
			
			incrementParserIndex : function () {
				this.state.parser.currentRowIndex += 1;
				this.state.parser.stringIndex += 1;
				this.state.parser.parserText = this.state.parser.parserText.substring(1);
				return this.state.parser.parserText;
			},
			setParserRow : function (newRowNumStr) {
				/*
					Dunno about this one? index may end on " " always...
					then, when it gets fed back into the parser, it'll start looking for a term
					when that term starts with " "... returning fuck all, 
					and termininating right after initial line is declared...
					if that's the case... we simply need to substring(1) parserText... I think
				*/
				var newRowNum = parseInt(newRowNumStr);
				if (Number.isNaN(newRowNum)){
					this.parser.throwParserError(` expected number, got ${newRowNumStr}`);
					return;
				}
				this.state.currentLine = newRowNum;
				this.state.parser.currentRow += newRowNum;
				this.state.parser.currentRowIndex = 0;
				this.state.parser.stringIndex += 1;
				return this.state.parser.parserText;
			},
			parseNext : function (string, indexes) {
				var nextChar = string.substring(indexes);
				this.parser.parse(nextChar);
			},
			setCurrentLine : function (lineNum) {
				this.state.parser.task = "setting line number"
				if (lineNum < this.state.parser.prevRowNum){
					this.state.throwParserError( ` expected new line number > ${this.state.parser.prevRowNum}`);
				}
				return this.state.parser.setParserRow(lineNum);
			},
			getCurrentLine : function (string) {
				this.state.parser.task = "getting next line number"
				const acceptableChars = ["0","1","2","3","4","5","6","7","8","9"];
				var lineNum = "";
				var errorState = this.state.errorState;
				var errorMessage = this.state.errorMessage;
				var compiler = this;
				function parseLineNum = function (string) {
					if (acceptableChars.includes(string[0])){
						if (string[0] === "0"){
							acceptableChars.push(" ")
						}
						if (string[0] === " "){
							return lineNum; 
						}
						lineNum += string[0];
						return parseLineNum(compiler.parser.incrementParserIndex());
					} else {
						this.parser.throwParserError(` expected numerical character... got ${string[0]}`)
						return;
					}


				}
				return parseLineNum(string)

			},
			setLineTerm : function (lineTerm) {
				this.state.parser.task = `setting function to ${lineTerm} for line ${this.state.parser.currentRow}`
				if (this.state.parser.term !== lineTerm){
					console.log(`Hey buddy, your getLineTermFunction is jacked up... "${lineTerm}" should == "${this.state.parser.term}"`);
					console.log(`(parser.setLineTerm.... arguments[0] should == this.state.parser.term)`);
					return;
				}
				if (!this.reservedTerms.includes(lineTerm)){
					this.parser.throwParserError(`"${lineTerm}" not a recognized term...`);
					return;
				}
				var routerCategory = this.reservedTerms[lineTerm];
				if (routerCategory === 'controlFlow'){
					this.state.currentLineHasControlFlow = true;
				};
				this.termRouter[routerCategory][lineTerm]();
				this.state.lineFunctionName = lineTerm;
			},
			getLineTerm : function (string) {
				this.state.parser.task = `getting function for line ${this.state.parser.currentRow}`;
				const compiler = this;
				var termIndex = 0
				const tokens = this.state.tokensList;
				var resTerms = this.state.reservedTermsList;
				function parseLineTerm = function(string) {
					var lineChar = string[0];
					if (tokens.includes(lineChar)){
						if (resTerms.length === 1){
							if (resTerms[0].length = termIndex + 1){
								console.log("I think the above bool right, but It could be a wink or 9 off")
								return resTerms[0];
							} else {
								console.log("resolve the bool here?")
								compiler.parser.throwParserError(` unexpected token ${lineChar} while considering "${resTerms[0]} "from "${compiler.state.parser.term}"`);
								return;
							}
						} else if (resTerms.length > 1){
							compiler.parser.throwParserError(` unexpected token ${lineChar}...(parsing "${compiler.state.parser.term}")`);
							return;
						} else if (resTerms.length === 0){
							compiler.parser.throwParserError(` unexpected token ${lineChar}...(parsing "${compiler.state.parser.term}")`);
							return;
						}
					} else {
						compiler.state.parser.term += lineChar;
					}
					resTerms = resTerms.filter(function(reservedTerm){
						if (reservedTerm[termIndex] !== lineChar){
							return false;
						} else if (reservedTerm[termIndex] === lineChar){
							return true;
						} else {
							return false;
						}
					})
					if (resTerms.length === 0){
						compiler.parser.throwParserError(` unrecognized initial term... "${compiler.state.parser.term}""`);
						return;
					};
					return parseLineTerm(compiler.parser.incrementParserIndex());
					termIndex += 1;
				};
				return parseLineTerm(string);
			},
			lineHasEnoughTermsCheck : function () {
				this.state.parser.task = 'checking argument count against expected argument count'
				var expectedCount = Object.keys(this.state.expectedTerms).length;
				var acquiredCount = Object.keys(this.state.acquiredTerms).length;
				if (expectedCount > acquiredCount){
					return false;
				} else if (expectedCount === acquiredCount){
					return true;
				} else {
					this.parser.throwParserError(`too many arguments`)
					return;
				}
			},
			getLineNum : function (locationString){
				if (locationString[0] === '@'){

				} else if (locationString[0] == '^')
			}

			searchforTerm : function (searchPrevToken, searchTerm, valueType, searchCaller) {
				/*
					Default (no args) => search down...
					searchPrevToggle = true => search up...
				*/
				var dir = "next";
				var direction = "subsequent";
				if (searchPrevToggle){
					dir = "prev";
					direction : "preceding";
				}
				this.state.parser.task = `searching ${dir} lines for ${searchTerm} ${valueType}`
				var currentToken = ";" + this.state.currentLine;
				var fullText = this.parser.fullText;
				var substrings = fullText.split(currentToken);
				var textToSearch = ""
				if (searchPrevToggle){
					textToSearch = substrings[0]
				} else {
					textToSearch = substrings[1];
				}

				if (textToSearch === ""){
					this.parser.throwParserError(` expected to search ${direction} lines for ${searchTerm}... but no ${direction} lines found`);
					return;
				}

				if (valueType === "num_line"){
					/*
						This wont work for search up... refactor with for
					*/
				
				};
			},
			getNextArg : function (string) {
				var acquiredTermsCount = Object.keys(this.state.acquiredTerms).length;
				var nextArgSpecs = this.state.expectedTerms[acquiredTermsCount.toString()];
				var functionToCall = this.state.lineFunctionName;
				var expectedType = nextArgSpecs[0];
				var expectedLocation = nextArgSpecs[1];

				this.parser.route(expectedType, acquiredTermsCount);
				
				

			},
			constructLineTermDirectory () {
				/*
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				This is the first pass of the parser...
				it should be verified against in later function calls;
				IT DOES NOT CHECK IF THE TERMS ARE VALID>>>
					Valid terms will expand as parser continues...
					varaible declarations make new terms reasonable...
					must now modify some other func...
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

					THIS SHOULD MAKE SURE ALL LINES ARE PROPERLY DECLARED

				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				*/
				this.state.parser.task = "verifying line enumeration syntax"
				this.state.parser.lineTermDirectory = {};

				const tokens = this.state.tokensList;

				var lines = this.state.parser.fullText.split(";")
				lines.forEach(function(line, index){
					if  (this.state.errorHandling.errorState) {
						return;
					}
					var allTerms = line.split("");
					terms = allTerms.filter(function(term){
						if (term === ""){
							return false;
						} else {
							return true;
						}
					});
					var lineNum = parseInt(allTerms[0]);
					if (Number.isNan(lineNum)){
						this.parser.throwError(`invalid line declaration... "${allTerms[0]}" is not a valid line number...`);
						return;
					}
					this.parser.state.currentRow = lineNum
					this.parser.state.currentRowIndex = line.length;
					
					this.state.parser.lineList.push(lineNum);
					this.state.parser.lineTermDirectory[terms[0]] = terms[1];

				}, this);

				this.parser.state.currentRow = 0;
				this.parser.state.currentRowIndex = 0;

			},
			initializeParser : function (string) {
				this.state.parser.fullText = string;
				this.state.parser.parserText = string;

				this.parser.router.forEach(function(funcName){
					this.parser.router[funcName] = this.parser.router[funcName].bind(this);
				}, this)

				this.parser.constructLineTermDirectory(string);

			},
			parse : function (string) {
				if (this.state.errorHandling.errorState){
					this.throwError();
					return;
				}
				if (!this.state.parser.initialized){
					this.parser.initializeParser(string);
				}
				if (this.state.currentLine === -1){
					this.parser.setCurrentLine(this.parser.getCurrentLine(string));
					return this.parser.parse(this.state.parser.parserText);
				}
				if (this.state.lineFunctionName === "null"){
					this.parser.setLineTerm(this.parser.getLineTerm(string));
					return this.parser.parse(this.state.parser.parserText);
				}
				if (!this.parser.lineHasEnoughTermsCheck()){
					this.parser.getNextArg(string);
					return this.parser.parse(this.state.parser.parserText);
				}
			},
			throwParserError : function (message) {
				this.state.errorHandling.errorMessage = message;
				this.state.errorHandling.errorState = true;
				this.state.errorHandling.currentRow = this.state.parser.currentRow;
				this.state.errorHandling.currentIndex = this.state.parser.currentRowIndex;
				this.state.errorHandling.currentTask = this.state.parser.task;
			},
		},
		methods : {
			constructLineObject : function () {
				const line = [];
			};
			filterBS : function (string) {
				var goodCharacters = string.split("").filter(function(character){
					if (character ===  '\t' || character == '\n'){
						return false;
					} else {
						return true;
					}
				},this)
				var filteredString = goodCharacters.join("");
				return filteredString;
			}

			initializeCompiler : function () {
				this.state.program = {};
				this.state.program.variables = {};
				this.state.program.lines = {};
				this.state.program.ex = function () {
					this.lines['00']();
				};
				this.reservedTerms = {};
				this.reservedTermsList = [];
				this.tokens = {};
				this.tokensList = [];

				Object.keys(this.termRouter).forEach(function(routerCategory){
					if (routerCategory !== 'tokens'){
						Object.keys(this.termRouter[routerCategory]).forEach(function(term){
							this.termRouter[routerCategory][term] = this.termRouter[routerCategory][term].bind(this);
							this.reservedTerms[term] = routerCategory;
							this.reservedTermsList.push(term);
						}, this)
					} else {
						Object.keys(this.termRouter[routerCategory]).forEach(function(term){
							this.termRouter[routerCategory][term] = this.termRouter[routerCategory][term].bind(this);
							/*These might need to be included in reserved terms? But maybe not...*/
							this.tokens[term] = routerCategory;
							this.tokensList.push(term);
						}, this)
					}
				}, this);

				Object.keys(this.componentFunctionGenerators).forEach(function(compFuncCat){
					Object.keys(this.componentFunctionGenerators[compFuncCat]).forEach(function(compFunc){
						this.componentFunctionGenerators[compFuncCat][compFunc] = this.componentFunctionGenerators[compFuncCat][compFunc].bind(this);
					}, this)
				},this)
			},

			finalizeProgram : function () {
				this.state.program.errorState = false;
				this.state.program.errorMessage = "";
			},

			prepArgs : function () {
				var allArgsGood = true;
				Object.keys(this.state.expectedTerms).forEach(function(expectedTerm){
					if (!Object.keys(this.state.acquiredTerms).includes(expectedTerm)){
						//should ErrorHandling be here?
						//Or in the parser...?
						allArgsGood = false;
						return;
					}
					var expectedType = this.state.expectedTerms[expectedTerm][0];
					var acquiredType = this.state.acquiredTerms[expectedTerm][1];
					if (expectedType !== acquiredType){
						//should ErrorHandling be Here?
						//or in the parser...?
						allArgsGood = false;
						return;
					}
					var argumentIndex = this.state.expectedTerms[expectedTerm][1];
					this.state.lineArguments[argumentIndex] = this.state.acquiredTerms[expectedTerm][0]
				}, this)
				if (allArgsGood){

				} else {

				}
			},

			compileLine : function () {

			},

			composeLine : function () {
				this.state.program.line[this.currentLine] = this.state.lineFunction.apply(this, this.state.lineArguments);
			},

			flushLineCache : function () {
				this.state.lineFunction = this.executeNextLine;
				this.state.expectedTerms = {};
				this.state.acquiredTerms = {};
				this.state.
			},

			findInitialLine : function () {

			},
			importFileText : function (fileName) {
				var accessibleNodes = this.api.getAccessibleNodes();
				var accessibleNodesList = Object.keys(accessibleNodes);

				if (!accessibleNodesList.includes(fileName)){
					this.state.errorState = true;
					this.state.errorMessage = " (wtc) FILE NOT FOUND";
					return;
				}
				this.state.text = this.methods.filterBS(accessibleNodes[fileName].getText());
			},

		},
		

	},
	methods: {
		handleErrors : function () {
			if (this.compiler.state.errorHandling.errorState){
				var line = this.compiler.state.errorHandling.currentRow;
				var index = this.compiler.state.errorHandling.currentIndex;
				var task = this.compiler.state.errorHandling.currentTask;

				var addendum = `(error thrown on line ${line}, at index ${index}... while ${task})`
				var message = this.compiler.state.errorHandling.errorMessage + addendum;

				this.api.throwError(message);
				return;
			}
		},
		initFunctionQueue : function () {
			this.compiler.functionQueue.push(this.compiler.methods.initializeCompiler)

		},
		executeFunctionQueue : function (fileName, queueCompletionCallback) {
			this.compiler.functionQueue.forEach(function(func){
				if (this.state.errorState || this.state.earlyReturn){
					return;
				}
				func(fileName);
			}, this);
			if (this.compiler.state.errorHandling.errorState || this.compiler.state.errorHandling.earlyReturn){
				return this.methods.handleErrors();
			} else if (queueCompletionCallback){
				queueCompletionCallback();
			} 

		},

		createNodelet : function () {
			this.api.requestKernelAccess(' (wormTongueCompiler.MASM) requires kernel access to instantiate a new Nodelet, grant access?(y/n)', function(kernel){
					//kernel.makeAnExecutable()
			})
		},
		installLibrary : function () {
			//add terms to the compiler... extend language functionality;
		}
		uninstallLibrary : function () {
			//remove terms from compiler routers... reduce compiler memory usage;
		}

	},
	installData : {
		compile : {
			name : "compile",
			desc : "compile .wmt document to executable",
			syntax : "compile [.wmt]",
			ex : function (wormTongueFileName) {
				this.methods.initFunctionQueue();
				this.methods.executeFunctionQueue(wormTongueFileName, this.methods.createNodelet);
			},
		},
	},
	install : function (trmnl, callback) {
		this.trmnl = trmnl;
		trmnl.programs[this.name] = this;
		this.api = trmnl.api;
		this.compiler.api = this.api;
		this.installData.compile.ex = this.installData.compile.ex.bind(this);

		Object.keys(this.methods).forEach(function(methodName){
			if (typeof this.methods[methodName] === 'function'){
				this.method = this.method.bind(this);
			}
		},this)

		this.api.addCommand(this.installData.compile)
		//testing new HTTPS key for github
	},
}
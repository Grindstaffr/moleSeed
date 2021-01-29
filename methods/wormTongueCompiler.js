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
			hasInitialLine : false,
			currentLine : 0,
			currentLineHasControlFlow : false,
			currentLineFuncs : [],
			lineFunction : function () {};
			requiredPostlineTerms : [];
			expectedTerms : {},
			acquiredTerms : {},
			lineIs : "initializing",
			program : {
				errorState : false,
				errorMessage: "",
				currentLine : '00',
				variables : {},
				lines : {},
				ex : function () {
					this.lines['00'](this.variables);
				}
			},
		},
		router : {
			controlFlow : {
				if : function (){
					this.state.expectedTerms.testProposition = ['bool_func', 0, "if"];
					this.state.expectedTerms.thenIndex = ['num_line', 1, "@then#>", true];
					this.state.expectedTerms.elseIndex = ['num_line', 2, "@else#>||@then#+", true];
					this.state.lineFunction = this.componentFunctionGenerators.ifThen;
				},
				goto : function (){
					this.state.expectedTerms.lineIndex = ["num_line", 0, 'goto'];
					this.state.currentLineHasControlFlow = true;
					this.state.lineFunction = this.componentFunctionGenerators.executeLineAt;
				},
				for : function () {
					this.state.expectedTerms.initialValue = ["num_var", 0, "for"];
					this.state.expectedTerms.terminalValue = ["num_val", 1, "to"];
					this.state.expectedTerms.indexOfNext = ["num_line", 2, "@next#+"];
					this.state.currentLineHasControlFlow = true;
					this.state.lineFunction = this.componentFunctionGenerators.forToNext;
				},
				next : function () {
					this.state.expectedTerms = ["num_line", 0, '^for#'];
					this.state.expectedTerms = ["num_var", 1, '^for'];
					this.state.currentLineHasControlFlow = true;
					this.state.lineFunction = this.componentFunctionGenerators.next;
				},
			},
			variableDeclarations : {
				num : function () {
					this.state.expectedTerms.name = ["str_val", 0, "num"];
					this.state.expectedTerms.value = ["num_val", 1, "="];
					this.state.lineFunction = this.componentFunctionGenerators.defineVarNumber;
				},
				str : function () {
					this.state.expectedTerms.name = ["str_val", 0, "str"];
					this.state.expectedTerms.value = ["str_val", 1, "="];
					this.state.lineFunction = this.componentFunctionGenerators.defineVarString;

				},
				arr : function () {
					this.state.expectedTerms.name = ["str_val", 0, "arr"];
					this.state.expectedTerms.type = ["str_val", 1, "="];
					this.state.expectedTerms.indexes = ["num_val", 2, "[]"];
					this.state.lineFunction = this.componentFunctionGenerators.defineVarArray;

				},
				bool : function () {
					this.state.expectedTerms.name = ["str_val", 0, "bool"];
					this.state.expectedTerms.value = ["bool_val", 1, "="];
					this.state.lineFunction = this.componentFunctionGenerators.defineVarBoolean;
				},
			},
			terminalLib : {
				print : function () {

				},
				mv : function () {

				},
				lk : function () {

				},
			},
		},
		componentFunctionGenerators : {
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
				var retbol = function () {
					return [bool, 'bool'];
				}
				return [retStr.bind(this.state.program), "bool_val"];
			},
			defineVarNumber : function (name, value) {
				var numberDefineFunction = function () {
					this.variables[name] = [value, 'num', name];
					return this.variables[name]
				}
				return [numberDefineFunction.bind(this.state.program), "num_var"];
			},
			defineVarBoolean : function (name, value) {
				var booleanDefineFunction = function () {
					this.variables[name] = [value, 'bool', name];
					return this.variables[name]
				}
				return [booleanDefineFunction.bind(this.state.program), 'bool_var']
			},
			defineVarString : function (name, value) {
				var stringDefineFunction = function () {
					this.variables[name] = [ value,'str', name];
					return this.variables[name]
				}
				return [stringDefineFunction.bind(this.state.program), `str_var`];
			},
			defineVarArray : function (name, type, indexes) {
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





			defineArrayVal : function (arrName, index, value){
				var defineArrayValFunction = function () {
					this.variables[arrName][index][0] = value;
				}
			},





			getVar: function (name) {
				var getVarFunction = function (name) {
					type = this.variables[name][1]
					return this.variables[name]
				};
				return [getVarFunction.bind(this.state.program), `${type}_var`];
			},
			getArrVal : function (name, index){
				var getArrValFunction = function () {
					return this.variables[name][index]
				}
				return [getArrValFunction.bind(this.state.program), `${type}_var`];
			},
			updateVariableValue : function (name, value){
				var type = ""
				var updateVariableValueFunction  = function () {
					type = this.variables[name][1]
					this.variables[name] = value;
					return this.variables[name]
				}
				return [updateVariableValueFunction.bind(this.state.program), `${type}_var`];
			},
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
			}
			testProp_And : function (valueA, valueB) {
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
			}
			executeNextLine : function (currentLine) {
				var returnFunc = function () {		
					var allLines = this.lines
					var findNextLargestIndex = function (currentLine) {
						var numVal = parseInt(currentLine);
						var lineNums = Object.keys(allLines).map(function(lineNum){
							return parseInt(lineNum);
						}).sort(function(a,b){
							return a - b
						});
						var nextLineNum = lineNums.find(function(number){
							return number > currentLine;
						})
						if (nextLineNum === undefined){
							return -10;
						} else {
							return nextLineNum;
						}
					}
					if (this.errorState){
						this.api.throwError(this.errorMessage)
						return;
					}
					this.currentLine = findNextLargestIndex(currentLine);
					this.lines[this.currentLine]();
				}
				return [returnFunc.bind(this.state.program), 'func']
			},
			executeLineAt : function (lineIndex) {
				var lineExecuteFunction = function () {
					this.currentLine = lineIndex();
					this.lines[this.currentLine]();
				}
				return [lineExecuteFunction.bind(this.state.program), 'func'];
			},
			ifThen : function (testProposition, thenIndex, elseIndex){
				//may need to check if these values are functions... or at least constructThem to always be
				var executeLineAt = this.componentFunctionGenerators.executeLineAt
				var ifThenFunction = function () {
					if (testProposition()) {
						executeLineAt(thenIndex)
					} else {
						executeLineAt(elseIndex);
					}
				}
				return [ifThenFunction, 'func'];
			},
			forToNext : function (variable, terminalValue, lineIndexNext) {
				var ifThen = this.componentFunctionGenerators.ifThen;
				var lessThan = this.componentFunctionGenerators.testProp_LessThan;
				var equivalence = this.componentFunctionGenerators.testProp_Equivalence;
				var or = this.componentFunctionGenerators.textProp_or;
				var executeNextLine = this.componentFunctionGenerators.executeNextLine;
				var executeLineAt = this.componentFunctionGenerators.executeLineAt;
				var forLine = this.currentLine
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
			}
		},
		constructLineObject : function () {
			const line = [];
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

			Object.keys(this.router).forEach(function(routerCategory){
				Object.keys(this.router[routerCategory]).forEach(function(term){
					this.router[routerCategory][term] = this.router[routerCategory][term].bind(this);
					this.reservedTerms[term] = routerCategory;
					this.reservedTermsList.push(term);
				})
			}, this);

			Object.keys(this.componentFunctionGenerators).forEach(function(compFuncGenName){
				this.componentFunctionGenerators[compFuncGenName] = this.componentFunctionGenerators[compFuncGenName].bind(this);
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

		composeLine : function () {
			this.state.program.line[this.currentLine] = this.state.lineFunction.apply(this, this.state.lineArguments);
		},

		flushLineCache : function () {

		},

		findInitialLine : function () {

		}

	},
	methods: {
		handleErrors : function () {
			if (this.state.errorState){
				this.api.throwError(this.state.errorMessage);
			}
		},
		executeFunctionQueue : function (fileName, queueCompletionCallback) {
			this.compiler.functionQueue.forEach(function(func){
				if (this.state.errorState || this.state.earlyReturn){
					return;
				}
				func(fileName);
			}, this);
			if (this.state.errorState || this.state.earlyReturn){
				return this.methods.handleErrors();
			} else if (queueCompletionCallback){
				queueCompletionCallback();
			} 

		},
		extractTextData : function (fileName) {
			var accessibleNodes = this.api.getAccessibleNodes();
			var accessibleNodesList = Object.keys(accessibleNodes);

			if (!accessibleNodesList.includes(fileName)){
				this.data.
			}

		},
		createNodelet : function () {
			this.api.requestKernelAccess(' (wormTongueCompiler.MASM) requires kernel access to instantiate a new Nodelet, grant access?(y/n)', function(kernel){
					//kernel.makeAnExecutable()
			})
		},

	},
	installData : {
		compile : {
			name : "compile",
			desc : "compile .wmt document to executable",
			syntax : "compile [.wmt]",
			ex : function (wormTongueFileName) {
				this.methods.executeFunctionQueue(wormTongueFileName, this.methods.createNodelet);
			},
		},
	},
	install : function (trmnl, callback) {
		this.trmnl = trmnl;
		trmnl.programs[this.name] = this;
		this.api = trmnl.api;
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
export const program = {
	name : "wmtCompiler.MASM",
	isInstalled : false,
	target: {},
	state : {},
	size : 64,
	memory: 128,
	dataTables : {
		numChars : ["0","1","2","3","4","5","6","7","8","9"],
		strictRuleTerminators : [" ", ";", ":"],
		genericTerminators : [" ", ";", ":"],
		genericUnexpectedTokens : ['"', ],
		resTermChars : /*Needs some active filtration on my part*/["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
		varNameInitials : ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","_"],
		varNameChars : ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","_","0","1","2","3","4","5","6","7","8","9"],
		varNameTerminators : [" ","=",";"],
		tokenInitials : ['!',"=","+","-","/","*","<",">","(",")",";","&","|"],
		tokenNonInitials : ['=', '&', '|'],
		tokenTerminators : [" ","0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
		stringTerminator : ['"'],
		stringInitial : ['"'],
		stringChars : ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9","!","@","#","$","%","^","&","*","(",")","_","-","+","=","{","}","[","]","\\","|",";",":","'","<",",",">",".","/","?","~","`"," "],

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
		'005' : function () {
			return `syntaxError: unexpected character "${this.state.currentCharacter}"... no possible terms, tokens, variable names, or primatives begin with ${this.state.currentCharacter}`;
		},
		'050' : function () {
			return `syntaxError: expected "${this.state.missingClosure}" before ";"... closure opened at line ${this.state.missingClosureLocation[0]}, index ${this.state.missingClosureLocation[1]}`
		},
		'060' : function () {
			return `incompleteErrorMessage: FORSTACK NOT EMPTY (but this is a bad message... needs line that for was opened on)`;
		},
		'061' : function () {
			return `incompleteErrorMessage: WHILESTACK NOT EMPTY (but this is a bad message... needs line that "while" was opened on)`;
		},
		'098' : function () {
			return `typeError: "+" operator only accepts numbers and strings as operands... got ${this.state.acquiredType}`;
		},
		'099' : function () {
			return `typeError: invalid assignment: cannot change ${this.state.expectedType} variable to alternate type ${this.state.acquiredType}`;
		},
		'100' : function () {
			return `typeError: expected type = ${this.state.expectedType} but got type = ${this.state.acquiredType}`;
		},
		'101' : function () {
			return `syntaxError: invalid assignment to undeclared variable`
		},
		'104' : function () {
			return `syntaxError: invalid assingment left-hand side, ("=" operator is for assignment only, to test equality, use "==")`;
		},
		'900' : function () {
			return `internalError: term length exceeds buffer size... ensure all terms are less than 1024 bytes`;
		},
		'950' : function () {
			return `internalError: parseFailure... parser parsed a number, but compiler got NaN`
		},
		'997' : function () {
			return `internalError: invalid call to convertAcqVarToVal`
		},
		'998' : function () {
			return `internalError: parseNamedTerm should have parsed ${this.state.term} as a varName, but instead spat out some horseShit, and failed to match it to a reservedTerm.`
		},
		'999' : function () {
			return `internalError: parseGenericTerm fucked up... somehow... didn't think it was possible... damn.. sorry`
		},

	},
	compiler : {
		constructors : {
			/*
				The option remains to include typechecking in each of these contructors...
				I'm hoping to write the parser/compiler such that these never get called
				with a mismatched-type... but hey... backups don't necessarily hurt;

			*/
			goto : function (num_val){
				var x = num_val;
				const goto = function () {
					var lineNum = x[0]();
					this.nextLine = lineNum;
				};
				return [goto.bind(this.target), 'undefined'];
			},
			printN : function (num_val){
				this.state.task = "assembling function printN";
				var x = num_val;
				const printN = function () {
					var number = x[0]();
					var string = number.toString();
					this.api.log(string);
					return;
				}
				return [printN.bind(this.target), 'undefined']
			},
			printS : function (str_val){
				/*Should be extensible.... take additional args within a closure? Dunno... maybe if we instantiate it like print(?*/
				this.state.task = "assembling function print"
			
				var x = str_val;
				const print = function () {
					var string = x[0]();
					this.api.log(string);
					return;
				};
				return [print.bind(this.target), 'undefined'];
			},
			assign : function (var_name, val){
				this.state.task = "assembling operator assign"
				var varName = var_name[0]();
				this.compiler.verifyVariableAssignee(varName);
				if (this.state.errorState){
					return
				}
				this.compiler.typeCheckAssignmentValue(varName, val);
				if (this.state.errorState){
					return;
				}
				var x = var_name;
				var y = val
				const assign = function () {
					var assignTo
					if (y[1] === 'var_name'){
						assignTo = this.getVariableValue(y);
					} else {
						assignTo = y[0](); 
					}
					var xName = x[0]();
					this.variables[xName][0] = assignTo;
					return xName;
				};
				return [assign.bind(this.target), `var_name`];
			},
			unary_add : function (num_val) {
				this.state.task = "assembling operator unary_add";
				var v = num_val;
				this.compiler.verifyType(num_val, "num_val");
				if (this.state.errorState){
					return;
				}
				const unaryAdd = function () {
					return v[0]();
				}
				return [unaryAdd.bind(this.target), `num_val`];
			},
			num_add : function (num_valA, num_valB){

				this.state.task = "assembling operator num_add";
				this.compiler.verifyType(num_valA,"num_val");
				if (this.state.errorState){
					return;
				}
				this.compiler.verifyType(num_valB,"num_val");
				if (this.state.errorState){
					return;
				}
				var vfA = num_valA[0];
				var vfB = num_valB[0];

				const numAdd = function () {
					var a = vfA();
					var b = vfB();
					return a + b;
				};
				return [numAdd.bind(this.target), 'num_val'];
			},
			str_add : function (str_valA, str_valB){
				this.state.task = "assembling operator str_add";
				this.compiler.verifyType(str_valA,'str_val');
				if (this.state.errorState){
					return;
				}
				this.compiler.verifyType(str_valB,'str_val');
				if (this.state.errorState){
					return;
				}
				var a = str_valA[0];
				var b = str_valB[0];
				const strAdd = function () {
					var x = a();
					var y = b();
					return x + y;
				};
				return [strAdd.bind(this.target), 'str_val'];
			},
			num_var : function (var_name) {
				this.state.task = "assembling variable declaration num"
				this.compiler.verifyType(var_name, 'var_name');
				if (this.state.errorState){
					return;
				}
				var varName = var_name[0]();
				this.target.variables[varName] = [undefined, 'num', varName];
				// ^^^^^^this may be redundant?

				const defineNum = function () {
					this.variables[varName] = [undefined, 'num', varName];
					return varName;
				}
				return [defineNum.bind(this.target), 'var_name'];
			},
			str_var : function (var_name) {
				this.state.task = "assembling variable declaration str"
				this.compiler.verifyType(var_name, 'var_name');
				if (this.state.errorState){
					return;
				}
				var varName = var_name[0]();
				this.target.variables = [undefined, 'str', varName];
				// ^^^^^^this may be redundant?


				const defineStr = function () {
					this.variables[varName] = [undefined, 'str', varName];
					return varName;
				}
				return [defineStr.bind(this.target), 'var_name'];
			},
			var_name : function (str) {
				this.state.task = "assembling primative var_name"
				var string = str;
				const varName = function () {
					return string;
				}
				return [varName.bind(this.target), 'var_name'];
			},
			str_val : function (str) {
			
				this.state.task = "assembling primative str_val"
				var string = str;
				if (string[0] === '"'){
					string = string.substring(1);
				};
				if (string[string.length - 1] === '"'){
					string = string.substring(0,string.length - 1);
				};
				const defineStr_val = function () {
					return string;
				}
				return [defineStr_val.bind(this.target), 'str_val'];
			},
			num_val : function (num) {
				this.state.task = "assembling primative  num_val"
				var number = parseInt(num);
				if (Number.isNaN(number)){
					this.methods.makeError('950');
				}
				const defineNum_val = function (){
					return number;
				}
				return [defineNum_val.bind(this.target), 'num_val'];
			},
			/*
			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					GONNA NEED TO REWORK THESE
			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			*/
			varName_val : function (var_name) {
				this.compiler.verifyType(var_name, "var_name");
				if (this.state.errorState){
					return;
				}
				var varName = var_name[0];
				var type = this.target.variables[varName()][1];
				const getVarNameVal = function (){
					var variable = this.variables[varName()];
					var value = variable[0];
					return value;
				};
				return [getVarNameVal.bind(this.target), `${type}_val`];
			},
			var_var : function (varName) {
				var name = varName;
				var type = this.target.variables[name][1];
				const getVariable = function () {
					return this.variables[name];
				}
				return [getVariable.bind(this.target), `${type}_var`];
			},
			var_val : function (var_name) {
				var x = var_name
				var varName = var_name[0]();
				var type = this.target.variables[varName][1];
				const getVarValue = function () {
					var name = x[0]();
					var value = this.variables[name][0];
					return value;
				}
				return [getVarValue.bind(this.target), `${type}_val`];
			},
		},
		verifyVariableAssignee : function (varName){
			if (this.target.variables[varName] !== undefined){
				return;
			} else {
				this.methods.makeError('101');
				return;
			}
		},
		typeCheckAssignmentValue : function (varName, assignment){
			this.state.expectedType = this.target.variables[varName][1];
			this.state.acquiredType = assignment[1].split("_")[0]
			if (this.state.expectedType === this.state.acquiredType){
				return;
			} else {
				this.methods.makeError('099');
				return;
			}
		},
		verifyType : function (input, expectedType){
			if (input[1] === expectedType){
				return;
			} else {
				this.state.expectedType = expectedType;
				this.state.acquiredType = input[1];
				this.methods.makeError('100');
				return;
			}
		},
		captureLastArg : function () {
			/*
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

					Gotta do some work here
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			*/
			var topFunc = this.state.constructorFunctions[this.state.constructorFunctions.length - 1]
			topFunc[3].push(this.state.acquiredTerms.pop());
		},
		compileLine : function () {
			var functionQueue = [];
			console.log(this.state);
			for (var i = this.state.acquiredTerms.length - 1; i >= 0; i--) {
				functionQueue.push(this.state.acquiredTerms[i][0]);
			};
			this.target.lines[this.state.currentLine] = function () {
				functionQueue.forEach(function(func){
					func();
				});
			};
		},
		composeStack : function () {
			/*
			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			Right now I'm thinking of putting a bool in as 
			a parameter to determine whether to compose the 
			full stack or to only compose what's composable;
			e.g. if fullStack is on, should only be when closure count is 0, 
			but if for some reason ( i don't think there is one rn,
			 but my brain is gonzo for the day) a func can't compose
			 (apart from a type-error), then there's some kinda syntax
			 problem? and we throw an error? i dunno
			 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			*/
			var constructorStack = this.state.constructorFunctions;
			this.state.task = "composing function stack";
			var closureDepth = this.state.closures.length;
			var stopCompose = false

			while (constructorStack.length > 0 && !this.state.errorState &&!stopCompose){
				var constructor = this.state.constructorFunctions.pop();
				var func = constructor[0];
				var requiredArgTypes = constructor[1];
				var minimumClosureDepth = constructor[2];
				var cachedArgs = constructor[3];
				var collectedArgs = [];
				if (closureDepth > minimumClosureDepth){
					stopCompose = true;
					//do something else
					break;
				}
				for (var i = requiredArgTypes.length - 1; i >= 0; i--) {
					if (this.state.errorState){
						return;
					}
					var testArg = this.parser.peekAcquiredTerm();
					if (requiredArgTypes[i] !== testArg[1]){
						if (testArg[1] === 'var_name'){
							this.compiler.convertAcqVarToVal();
							testArg = this.parser.peekAcquiredTerm();
							if (requiredArgTypes[i] !== testArg[1]){

								this.state.expectedType = requiredArgTypes[i];
								this.state.acquiredType = testArg[1];
								this.methods.makeError('100');
								return;
							} else {
								collectedArgs.push(this.parser.popAcquiredTerm());
								continue;
							}
						}
						console.log('broke here');
						this.methods.makeError('100')
						this.state.expectedType = requiredArgTypes[i];
						this.state.acquiredType = testArg[1];
						this.methods.makeError('100');
						return;
					} else {
						collectedArgs.push(this.parser.popAcquiredTerm());
						continue
					}
				}
				collectedArgs = collectedArgs.reverse()
				collectedArgs = cachedArgs.concat(collectedArgs);

				if (stopCompose === true){
					return;
				}
			
				var newTerm = func.apply(this, collectedArgs);
				if (newTerm === undefined){
					debugger;
				}
				this.state.acquiredTerms.push(newTerm);
			}
			
		},
		convertAcqVarToVal : function () {
			debugger;
			var var_name = this.state.acquiredTerms.pop();
			this.compiler.verifyType(var_name, 'var_name');
			if (this.compiler.errorState){
				return;
			}
			var varName = var_name[0]
			var variable = this.target.variables[varName()];
			var varType = variable[1];
			const valFunc = function () {
				var variable = this.variables[varName()];
				return variable[0]
			};
			this.state.acquiredTerms.push([valFunc.bind(this.target), `${varType}_val`]);
			return; 
		},
		composeTopConstructor : function () {
			var constructorArray = this.state.constructorFunctions.pop();
			this.state.task = `composing top function`;
			console.log(this.state.acquiredTerms)
			var constructorFunc = constructorArray[0];
			var expectedArgTypes = constructorArray[1];

			var applyArgs = constructorArray[3];
			for (var i = expectedArgTypes.length - 1; i >= 0; i--) {
				if (this.state.errorState){
					return;
				}
				this.state.expectedType = expectedArgTypes[i]
				var arg = this.parser.peekAcquiredTerm();
				this.state.acquiredType = arg[1];

				if (this.state.expectedType !== this.state.acquiredType){
					if (this.state.acquiredType === 'var_name'){
						this.compiler.convertAcqVarToVal();
					}
				}

				arg = this.parser.popAcquiredTerm();

				this.state.acquiredType = arg[1];

				if (expectedArgTypes[i] !== arg[1]){
					this.methods.makeError('100');
					return;
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
		
			this.state.acquiredTerms = this.state.acquiredTerms.concat([newTerm])
	
		},

	},
	parser : {
		/*
			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					variable Router probably worthless now
			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		variableRouter : {
			var : function (term) {
				this.state.acquiredTerms.push(this.compiler.constructors.var_var(term));
				return;
			},
			val : function (term) {
				this.state.acquiredTerms.push(this.compiler.constructors.var_val(term));
				return;
			},
		},
		tokenRouter : {
			" ": function () {
				return;
			},
			";" : function () {
				debugger;
				this.state.task = "verifying line end state";
				var topOfClosureStack = this.state.closures.pop();
				var foundClosure = topOfClosureStack[0]
				if (foundClosure !== ';'){
					this.state.missingClosure = foundClosure;
					this.state.missingClosureLocation = topOfClosureStack[1];
					this.methods.makeError('50');
				};
				this.compiler.composeStack();
				this.compiler.compileLine();
				if (this.parser.peekNextChar() === undefined){
					this.state.end = true;
					this.target.lastLine = this.state.currentLine;
					this.parser.verifyEndConditions();
				} else {
					this.methods.readyStateForNewLine();
					this.state.newLineNeeded = true;
				}
				return;
			},
			'=' : function () {
				var assignee = this.parser.peekAcquiredTerm();
				var assType = assignee[1];
				if (assType !== 'var_name'){
					this.methods.makeError('104');
					return;
				};
				var varType = this.parser.getTypeFromVarName(assignee);
				this.parser.pushConstructorFunction('assign', [`${varType}_val`], 0 );
				this.compiler.captureLastArg();
				//this.parser.expectedArgs.push(`${varType}_val`);
				return;
			},
			'+' : function () {
				if (!this.parser.checkForAcqTerms()){
					this.parser.pushConstructorFunction(`unary_add`, ['num_val'])
					return;
				} 
				var assignee = this.parser.peekAcquiredTerm();
				var assType = assignee[1];
				if (assType === 'var_name'){
					this.compiler.convertAcqVarToVal();
					assignee = this.parser.peekAcquiredTerm();
					assType = assignee[1];
				};
				if (assType !== 'num_val' && assType !== 'str_val'){
					this.methods.makeError('098');
					return;
				};
				var expectedType = assType;
				this.parser.pushConstructorFunction(`${assType.split("_")[0]}_add`, [expectedType])
				this.compiler.captureLastArg();
				/* I don't think we should be parsing specific here.... but... */
				this.state.expectedArgs.push(expectedType);
				return;
			},
			"-" : function () {

			},
			"*" : function () {

			},
			"/" : function () {

			},
			"%" : function () {

			},
			'(' : function () {
				//open new paren Closure
			},
			')' : function () {
				//close last paren closure
			},
			"==" : function () {
				//bool equivaelnce op
			},
			">" : function () {

			},
			"<" :function () {

			},
			">=" : function () {

			},
			"<=" : function () {

			},
			"!==" : function () {

			},
			"!" : function () {

			},

		},
		reservedTermsRouter :{
			num : function () {
				this.parser.pushConstructorFunction('num_var', ['var_name'])
				//here I think we do need to parse as VAR_nAME
				this.state.expectedArgs.push("var_name");
				return;
			},
			str : function () {
				this.parser.pushConstructorFunction('str_var', ['var_name'])
				this.state.expectedArgs.push("var_name");
				return;
			},
			printS : function () {
				this.parser.pushConstructorFunction('printS', ['str_val'])
				this.state.expectedArgs.push('str_val');
				return;
			},
			printN : function () {
				this.parser.pushConstructorFunction('printN', ['num_val'])
				this.state.expectedArgs.push('num_val');
				return;
			},
			goto : function () {
				this.parser.pushConstructorFunction('goto', ['num_val'])
				this.state.expectedArgs.push('num_val');
				return;
			},
			if : function () {
				this.parser.pushConstructorFunction('if', ['bool_val'], 0)
				this.state.expectedArgs.push('bool_val')
			},

		},
		genericRouter : {
			" " : function () {
				return;
			},
			";" : function () {
				
			},
			
			'(' : function () {
				this.state.closures.push([')', [this.state.currentLine, this.state.currentLineIndex, this.state.currentStringIndex], ]);
			},
			
			
			


		},
		specificRouter : {
			currentLineNum : function () {
				this.state.task = "parsing line number";
				this.state.parseType = "num_line";
				this.state.initialChars = this.dataTables.numChars;
				this.state.acceptableChars = this.dataTables.numChars;
				this.state.terminalChars = this.dataTables.strictRuleTerminators;
				this.parser.parseSpecific();

			
				var term = this.state.term

				var lineNum = parseInt(term);
				if (this.target.lines[lineNum] !== undefined){
					this.methods.makeError('003');
				} else {
					this.state.currentLine = lineNum;
					this.state.currentLineIndex = 0 + term.length;
				}
				return;
			},
			var_name : function () {
				this.state.task = "parsing variable name";
				this.state.parseType = "var_name";
				this.state.initialChars = this.dataTables.varNameInitials;
				this.state.acceptableChars = this.dataTables.varNameChars;
				this.state.terminalChars = this.dataTables.varNameTerminators;

				this.parser.parseSpecific();

				this.parser.pushAcquiredTerm();
				return;
			},
			str_val : function () {
				this.state.task = "parsing string value"
				this.state.parseType = "str_val";
				this.state.initialChars = this.dataTables.stringInitial;
				this.state.terminalChars = this.dataTables.stringTerminator;
				this.state.acceptableChars = this.dataTables.stringChars;
				this.state.includeTerminator = true;
				this.parser.parseSpecific();

				this.parser.pushAcquiredTerm();
				return;
			},
			num_val : function () {
				this.state.task = "parsing numerical value";
				this.state.parseType = "num_val";
				this.state.initialChars = this.dataTables.numChars;
				this.state.acceptableChars = this.dataTables.numChars;
				this.state.terminalChars = this.dataTables.strictRuleTerminators;
				this.parser.parseSpecific();
				if (this.state.term === "5"){
					debugger;
				}
				this.parser.pushAcquiredTerm();
				return;
			},
			token : function () {
				this.state.task = "parsing token";
				this.state.parseType = "token";
				this.state.initialChars = this.dataTables.tokenInitials;
				this.state.acceptableChars = this.dataTables.tokenNonInitials;
				this.state.terminalChars = this.dataTables.tokenTerminators;
				this.parser.parseSpecific();

				console.log(`the token is....${this.state.term}`)
				this.parser.tokenRouter[this.state.term]();
			},
			name_term : function () {
				this.state.task = "parsing named term";
				this.state.parseType = "name_term";
				this.state.initialChars = this.dataTables.varNameInitials;
				this.state.acceptableChars = this.dataTables.varNameChars;
				this.state.terminalChars = this.dataTables.varNameTerminators;
				this.parser.parseNamedTerm();

				if (this.state.parseType === "var_name"){
					this.parser.pushAcquiredTerm();
					return;
				} else if (this.state.parseType === "res_term"){
					this.parser.reservedTermsRouter[this.state.term]();
				}
			},

		},
		parseGenericTerm : function () {
			
			this.state.term = "";
			/*
			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				THIS NEEDS A REWORK
				should look at first term, then delegate
			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			*/
			this.state.task = "parsing next term"
			var prgm = this;
			var acceptableTerms = Object.keys(this.parser.reservedTermsRouter);
			var definedVariables = Object.keys(this.target.variables);
			var terminators = this.dataTables.genericTerminators;
			var routingSuccessful = false;
			var prgmEnd = false;
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
					if (nextChar === undefined){
						prgmEnd = true;
						return;
					}
					if (nextChar === " "){
						prgm.parser.getNextChar();
						return termBuilder(term, 0);
					} else if (prgm.dataTables.stringInitial.includes(nextChar)) {
						routingSuccessful = true;
						prgm.parser.specificRouter['str_val']();
						return;
					} else if (prgm.dataTables.numChars.includes(nextChar)) {
						routingSuccessful = true;
						prgm.parser.specificRouter['num_val']();
						return;
					} else if (prgm.dataTables.tokenInitials.includes(nextChar)){
						routingSuccessful = true;
						prgm.parser.specificRouter['token']();
						return;
					} else if (terminators.includes(nextChar)) {
						routingSuccessful = true;
						term += prgm.parser.getNextChar();
						return term;
					} else {
						term += prgm.parser.getNextChar();
						return termBuilder(term, numCount);
					}
				} else {
					if (acceptableTerms.includes(term)){
						console.log(term)
						return term;
					} else if (definedVariables.includes(term)){
						console.log(term)
						//institute state change
						return term;
					} else {
						var nextChar = prgm.parser.peekNextChar();
						if (terminators.includes(nextChar) || nextChar === undefined){
							prgm.state.term = term;
							prgm.methods.makeError('004')
							return term;
						} else {
							term += prgm.parser.getNextChar();
							return termBuilder(term, numCount)
						}
					}
				}
			}
			term = termBuilder(term);
			if (routingSuccessful){
				return;
			};
			if (prgmEnd){
				return;
			}
			this.state.term = term;
			if (acceptableTerms.includes(term)){
				this.parser.reservedTermsRouter[term]()
			} else if (definedVariables.includes(term)){
				this.state.parseType = 'var_name'
				this.parser.pushAcquiredTerm();
			} else {
				console.log(term);
				this.methods.makeError('999')
				return;
			}
		},
		parseNamedTerm : function () {
		
			this.state.term = "";
			this.state.acceptableChars = this.dataTables.varNameChars;
			var reservedTerms = Object.keys(this.parser.reservedTermsRouter);
			var parseAsVarName = false;
			var prgm = this;

			const termBuilder = function (term, numCount) {
				if (!numCount){
					numCount = -1;
				};
				numCount += 1;
				if (numCount >= 1023){
					prgm.methods.makeError('900')
					return;
				};
				if (reservedTerms.length === 0 && parseAsVarName === false){
					this.state.parseType = 'var_name'
					parseAsVarName = true;
				};
				if (term.length === 0){
					var char = prgm.parser.peekNextChar();
					if (!prgm.state.initialChars.includes(char)){
						this.state.term = prgm.parser.getNextChar();
						prgm.methods.makeError('005');
						return;
					} else {
						term = term + prgm.parser.getNextChar();
						reservedTerms = reservedTerms.filter(function(reservedTerm){
							if (reservedTerm[numCount] !== term[numCount]){
								return false;
							} else {
								return true;
							}
						} )
						return termBuilder(term, numCount);
					}
				} else {
					var char = prgm.parser.peekNextChar();
					if (prgm.state.acceptableChars.includes(char)){
						if (prgm.dataTables.resTermChars.includes(char) && !parseAsVarName){
							term = term + prgm.parser.getNextChar();
							reservedTerms = reservedTerms.filter(function(reservedTerm){
							if (reservedTerm[numCount] !== term[numCount]){
									return false;
								} else {
									return true;
								}
							} )
							return termBuilder(term, numCount);
						} else if (!parseAsVarName){
							parseAsVarName = true;
							this.state.parseType = 'var_name'
							term = term + prgm.parser.getNextChar();
							return termBuilder(term, numCount);
						}
						term = term + prgm.parser.getNextChar();
						return termBuilder(term, numCount);
					} else {
						if (prgm.state.terminalChars.includes(char)){
							console.log(term)
							return term;
						} else if (prgm.state.parseString.length === 0) {
							prgm.state.end = true;
							console.log(term);
							return term;
						} else {
							console.log(prgm.state.terminalChars);
							debugger;
							prgm.parser.getNextChar();
							prgm.methods.makeError('001');
							return;
						}
					}

				}
			}
			if (parseAsVarName){
				this.state.parseType = 'var_name'
				this.state.term = term;
			} else {
				if (Object.keys(this.parser.reservedTermsRouter).includes(term)){
					this.state.parseType = 'res_term'
					this.state.term = term;
					return;
				}
				this.methods.makeError('')
			}

		},

		parseSpecific : function () {
			/*
				Prolly needs rewrite? or no... I mean the var stuff in here is either unnecessary, or broken, but likely both
			*/
		
			this.state.term = ""
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
							prgm.state.acceptableChars = prgm.dataTables.varNameChars;
							prgm.state.terminalChars = prgm.dataTables.varNameTerminators;
							term += prgm.parser.getNextChar();
							return termBuilder(term, numCount)
						}
						prgm.parser.getNextChar();
						prgm.methods.makeError('000');
						return prgm.parser.parse();
					}
				} else {
					var char = prgm.parser.peekNextChar();
					if (prgm.state.acceptableChars.includes(char)){
						term += prgm.parser.getNextChar();
						return termBuilder(term, numCount);
					} else if (prgm.state.terminalChars.includes(char)){
						if (prgm.state.includeTerminator){
							term += prgm.parser.getNextChar();
							prgm.state.includeTerminator = false;
						}
						console.log(term)
						return term;
					} else if (prgm.state.parseString.length === 0){
						prgm.state.end = true;
						console.log(term);
						return term;
					} else {
						console.log(prgm.state.terminalChars);
						prgm.parser.getNextChar();
						prgm.methods.makeError('001')
						return prgm.parser.parse();
					}
					
				}

			}
			term = termBuilder(term);
			this.state.term = term;
			if (parseAsVariable){
				if (Object.keys(this.target.variables).includes(term)){
					var parseType = this.state.parseType
					this.state.parseType = 'var_name';
					/*
					this.parser.pushAcquiredTerm();
					this.compiler.convertAcqVarToVal();
					var convertedValue = this.parser.peekAcquiredTerm();
					if (parseType !== convertedValue[1]){
						debugger;
						this.state.expectedType = parseType;
						this.state.acquiredType = convertedValue[1];
						this.methods.makeError('100');
						return;
					}
					*/
				}
			}
			return term;
		},

		peekConstStack : function () {
			return this.state.constructorFunctions[this.state.constructorFunctions.length - 1];
		},
		pushConstructorFunction : function (constructorName, typeArray, closureCount) {
			if (closureCount === undefined || (!closureCount && closureCount !== 0)){
				closureCount = this.state.closures.length;
			}
			var constructor = this.compiler.constructors[constructorName]
			this.state.constructorFunctions.push([constructor, typeArray, closureCount, []])
		},

		checkForAcqTerms : function () {
			if (this.state.acquiredTerms.length > 0){
				return true;
			} else {
				return false;
			}
		},

		peekAcquiredTerm : function () {
			return this.state.acquiredTerms[this.state.acquiredTerms.length - 1];
		},

		pushAcquiredTerm : function () {
			var constructor = this.compiler.constructors[this.state.parseType]
			var term = this.state.term;
			this.state.acquiredTerms.push(constructor(term))
		},

		popAcquiredTerm : function () {
			return this.state.acquiredTerms.pop();
		},

		getTypeFromVarName : function (var_name) {
			var varName = var_name[0]();
			var variable = this.target.variables[varName]
			var type = variable[1];
			return type;
		},

		convertAcqVarNameToVal : function () {
			var variable = this.parser.popAcquiredTerm();
			if (variable[1] !== 'var_name'){
				this.methods.makeError('997');
				return;
			}
			this.state.term = variable[0]();
			this.state.parseType =`var_val`;
			this.parser.pushAcquiredTerm();
		},

		peekNextChar : function () {
			return this.state.parseString[0];
		},

		getNextChar : function () {
			this.state.currentStringIndex += 1;
			this.state.currentLineIndex += 1;
			var char = this.state.parseString[0];
			this.state.currentCharacter = char;
			this.state.parseString = this.state.parseString.substring(1);
			return char
		},

		parseSpecificTerm : function (term){
			this.parser.specificRouter[term]();
		},

		verifyEndConditions : function () {
			if (this.state.forStack.length > 0){
				this.methods.makeError('060');
				return;
			};
			if (this.state.whileStack.lenght > 0){
				this.methods.makeError('061');
				return;
			};

		},

		parse : function () {
			if (this.state.errorState){
				if (!this.state.errorThrown){
					this.methods.throwError();
					this.state.errorThrown = true;
					return;
				} else {
					return;
				}
			};
			if (this.state.parseString.length === 0){
				console.log(this.target);
				return this.target;
			}
			if (this.state.currentLine < 0 || this.state.newLineNeeded/* || some bool representing need to parse next line... like... saw a ';'?*/){
				this.parser.parseSpecificTerm('currentLineNum');
				this.state.closures.push([';', [this.state.currentLineNum, this.state.currentLineIndex, this.state.currentStringIndex]])
				this.state.newLineNeeded = false;
				return this.parser.parse();
			};
			if (this.state.expectedArgs.length >= 1 && this.state.constructorFunctions.length >=1){
				var argType = this.state.expectedArgs.pop();
				this.parser.parseSpecificTerm(argType);
				return this.parser.parse();
			};
			if (this.state.expectedArgs.length === 0 && this.state.constructorFunctions.length >=1){
				if (this.parser.peekConstStack()[2] < this.state.closures.length){
					this.parser.parseGenericTerm();
					return this.parser.parse();
				} else if (this.parser.peekConstStack()[2] >= this.state.closures.length){
					this.compiler.composeTopConstructor();
					return this.parser.parse();
				}

			};
	
				this.parser.parseGenericTerm();
				return this.parser.parse();
		

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
				target.ex = function (trmnl) {
					var prgm = this
					console.log(this);
					prgm.api = trmnl.api;
					var api = prgm.api
					prgm.lines[0](); 
					var executableLoop = function () {
						if (prgm.end && !prgm.ended){
							prgm.ended = true;
							api.log(`${prgm.name} reached "END" on line ${prgm.currentLine}`);
							api.deleteDrawTriggeredFunctions(`${prgm.name}`);
							return;
						};
						if (prgm.errorState){
							api.throwError(prgm.errorMessage);
							api.deleteDrawTriggeredFunctions(`${prgm.name}`);
							return;
						};
						if (prgm.loopCount >= 1000000){
							prgm.errorState = true;
							prgm.errorMessage = "loop iteration exceeded max buffer space. Cannot proceed."
							return;
						};
						if (prgm.nextLine === prgm.currentLine){
							//prolly need a better sieve here
							prgm.executeNextLine(prgm.currentLine);
							return;
						} else {
							prgm.executeLineAt(prgm.nextLine);
						}
					}
					executableLoop = executableLoop.bind(prgm);
					var setTicksPerDraw = function (number) {
						var iterations = number;
						var returner = function () {
							for (var i = 0; i < iterations; i++){
							executableLoop();
							}
						}
						return returner;
					}

				prgm.api.addDrawTriggeredFunction(setTicksPerDraw(2), `${prgm.name}`);
				};
				target.executeNextLine = function (currentLine) {
					var prgm = this;
					debugger;
					console.log(this);
					var foundLine = false;
					for (var i = prgm.currentLine; i <= prgm.lastLine; i++) {
						if (prgm.lines[i] && i !== prgm.currentLine){
							prgm.currentLine = i;
							prgm.nextLine = i;
							prgm.lines[i]();
							foundLine = true;
							break;
						}
					}

					if (!foundLine){
						prgm.end = true;
						/*
						prgm.errorState = true;
						prgm.errorMessage = `default goto_nextLine on line ${prgm.currentLine} not a valid controlFlow... no lines after ${prgm.lastLine}`;
						*/
					}
					return;
				};
				target.executeLineAt =  function (lineTarget) {
					var prgm = this;
					if (prgm.lines[lineTarget]){
						prgm.currentLine = lineTarget;
						prgm.nextLine = lineTarget;
						prgm.lines[lineTarget]();
					} else {
						prgm.errorState = true;
						prgm.errorMessage = `"goto ${lineTarget}" on line ${prgm.currentLine} not a valid controlFlow... no lines after ${prgm.lastLine}`;
					}
					return;
				};
				target.getVariableValue = function (var_name) {
					var prgm = this;
					var varName = var_name[0]();
					return prgm.variables[varName][0];
				};
				target.setVariableValue = function (var_name, _val) {
					/*NOt sure if we need prgm if the assignment function is written Correctly*/
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
					state.closures = [];
					state.constructorFunctions = [];
					state.expectedArgs = [];
					state.acquiredTerms = [];
					state.parseType = "";
					state.task = "";
					state.end = false;
					state.earlyReturn = false;
					state.errorState = false;
					state.errorCode = "";
					state.errorThrown = false;
				};
				init(textString);
				return state;
			}
			this.state = stateConstructor()
		},
		readyStateForNewLine : function () {
			console.log(`ready state for new line (prob needs more shit in this func)`)
			this.state.task = "readying state for new line";
			this.state.acquiredTerms = [];
			this.state.closures = [];
			return;
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
				//return;
			};
			var textToCompile = accessibleNodes[nodeName].getText();
			if (textToCompile === undefined){
				accessibleNodes[nodeName].read(function(text){ console.log(text) ; textToCompile = text});
			} else {
				console.log(textToCompile)
			}

			return this.methods.filterText(textToCompile);
		},
		filterText : function (text){
			text = text.split('\\n').join('').split('\\t').join('').split('\n').join('').split('\t').join('');
			return text.trim();
		},
		makeError : function (errorCode) {
			this.state.errorState = true;
			this.state.errorCode = errorCode;
			return;
		},
		throwError : function (){
			var location = ` at line ${this.state.currentLine} at index ${this.state.currentLineIndex} (${this.state.currentStringIndex})`;
			var task = ` while ${this.state.task}`
			var error = `wmtCompiler.MASM threw errorCode ${this.state.errorCode}: ${this.errorMessages[this.state.errorCode]()}`;
			var message = error + task + location;
			this.api.throwError(message);
			return;
		},
		compile : function () {
			return this.parser.parse();
		},

	},
	installData : {
		compile : {
			name : 'compile',
			desc: 'compile .wmt document to executable',
			syntax : 'compile [readable]',
			ex : function (wormTongueFileName){
				var prgm = this;
				this.methods.prepAll(wormTongueFileName);
				var executable = this.methods.compile();
				if (this.state.errorState){
					return;
				}

				var newName = wormTongueFileName.split('.')[0] + '.ex';
				var accessibleNodes = this.api.getAccessibleNodes()
				var accessibleNodesList = Object.keys(accessibleNodes);

				this.api.requestKernelAccess('(wmt_compiler.MASM) requests kernel access to instantiate new executable, grant access?(y/n)', function(kernel){
					var activeNode = prgm.api.getActiveNode();
					var activeNodeTrueAddress = activeNode.getTrueAddress();
					prgm.api.log (' (_Seed) access granted... creating node...');
					try {
						kernel.appendUserExecutable(activeNodeTrueAddress, newName, prgm.state.fullInputString, executable);
					} catch (error) {
						prgm.api.throwError( `(_Seed) cmd_rjct: #1F44B2`);
						throw new Error(error);
						return;
					}
					var finalDocName = newName;
					prgm.api.assembleAccessibleNodes();
					var newAccessibleNodes = prgm.api.getAccessibleNodes();
					var newAccessibleNodesList = Object.keys(newAccessibleNodes);
					newAccessibleNodesList = newAccessibleNodesList.filter(function(nodeName){
						if (accessibleNodesList.includes(nodeName)){
							return false;
						} else {
							return true;
						}
					})
					if (newAccessibleNodesList.length === 1){
						finalDocName = newAccessibleNodesList[0];
					} else {
						;
					}
					prgm.api.log(` (_Seed) ${finalDocName} sprouted at ${activeNode.address}`);
				}, function (kernelReject){
					prgm.api.log(` (_Seed) api_axs_rjct: #0000B4`);
					prgm.api.log(` (wmt_compiler.MASM) seed access required to instantiate new nodes. Aborting "compile"...`);
				})
			},

		},
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
		Object.keys(this.parser).forEach(function(routerFunctionName){
			if (typeof this.parser[routerFunctionName] === 'function'){
				this.parser[routerFunctionName] = this.parser[routerFunctionName].bind(this);
			} else if (routerFunctionName === 'specificRouter' || routerFunctionName === 'genericRouter' || routerFunctionName === 'tokenRouter' || routerFunctionName === 'reservedTermsRouter'){
				Object.keys(this.parser[routerFunctionName]).forEach(function(parserRouteName){
					this.parser[routerFunctionName][parserRouteName] = this.parser[routerFunctionName][parserRouteName].bind(this);
				}, this)
			}
		}, this)

		Object.keys(this.compiler).forEach(function(compilerFunctionName){
			console.log(compilerFunctionName)
			if (typeof this.compiler[compilerFunctionName] === 'function'){
				this.compiler[compilerFunctionName] = this.compiler[compilerFunctionName].bind(this);
			} else if (compilerFunctionName === 'constructors'){
				Object.keys(this.compiler[compilerFunctionName]).forEach(function(constructorFunc){
					this.compiler[compilerFunctionName][constructorFunc] = this.compiler[compilerFunctionName][constructorFunc].bind(this)
				},this)
			}
		}, this);
		Object.keys(this.errorMessages).forEach(function(errorCode){
			this.errorMessages[errorCode] = this.errorMessages[errorCode].bind(this);
		}, this);

		this.installData.compile.ex = this.installData.compile.ex.bind(this);

		this.api.addCommand(this.installData.compile)


		if (callback){
			callback(this.installData)
		}

		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			Should also install a parser addon 
			for the compile command -- 
			looking for .wmts
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

		*/
	}

}
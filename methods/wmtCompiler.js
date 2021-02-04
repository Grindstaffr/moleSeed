export const program = {
	name : "wmtCompiler.MASM",
	isInstalled : false,
	target: {},
	state : {},
	dataTables : {
		numChars : ["0","1","2","3","4","5","6","7","8","9"],
		strictRuleTerminators : [" ", ";", ":"],
		genericTerminators : [" ", ";", ":"],
		genericUnexpectedTokens : ['"', ],
		resTermChars : /*Needs some active filtration on my part*/["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
		varNameInitials : ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","_"],
		varNameChars : ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","_","0","1","2","3","4","5","6","7","8","9"],
		varNameTerminators : [" ","="],
		tokenInitials : ['!',"=","+","-","/","*","<",">","(",")",";","&","|"],
		tokenNonInitials : ['=', '&', '|'],
		tokenTerminators : ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
		stringTerminator : ['"'],
		stringInitial : ['"'],
		stringChars : ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9","!","@","#","$","%","^","&","*","(",")","_","-","+","=","{","}","[","]","\\","|",";",":","'","<",",",">",".","/","?","~","`"," "],

	}
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
		}
		'999' : function () {
			return `internalError: parseGenericTerm fucked up... somehow... didn't think it was possible... damn.. sorry`
		}

	},
	compiler : {
		constructors : {
			/*
				The option remains to include typechecking in each of these contructors...
				I'm hoping to write the parser/compiler such that these never get called
				with a mismatched-type... but hey... backups don't necessarily hurt;

			*/
			assign : function (var_name, val){
				this.state.task = "assembling operator assign"
				var varName = var_name[0]();
				this.compiler.verifyVariableAssignee(varName);
				if (this.state.errorState){
					return this.parser.parse();
				}
				this.compiler.typeCheckAssignmentValue(varName, val);
				if (this.state.errorState){
					return this.parser.parse();
				}
				var x = var_name;
				var y = val
				const assign = function () {
					var assignTo
					if (y[1] === 'var_name'){
						assignTo = this.getVariableValue(y);
					} else () {
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
					return this.parser.parse();
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
					return this.parser.parse();
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
					return this.parser.parse();
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
					return this.parser.parse();
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
					return this.parser.parse();
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
					string = string.substring(string.length - 1);
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
			}
			/*
			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					GONNA NEED TO REWORK THESE
			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			*/
			varName_val : function (var_name) {
				this.compiler.verifyType(var_name, "var_name");
				if (this.state.errorState){
					return this.parser.parse();
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
				var varName = var_name()[0];
				var type = this.target.variables[name][1];
				const getVarValue = function () {
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
				return this.parser.parse();
			}
		},
		typeCheckAssignmentValue : function (varName, assignment){
			this.state.expectedType = this.target.variables[varName][1];
			this.state.acquiredType = assignment[1].split("_")[0]
			if (this.state.expectedType === this.state.acquiredType){
				return;
			} else {
				this.methods.makeError('099');
				return this.parser.parse();
			}
		},
		verifyType : function (input, expectedType){
			if (input[1] === expectedType){
				return;
			} else {
				this.state.expectedType = expectedType;
				this.state.acquiredType = input[1];
				this.methods.makeError('100');
				return this.parser.parse();
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
						return this.parser.parse();
					}
					var testArg = this.parser.peekAcquiredTerm();
					if (requiredArgTypes[i] !== testArg[1]){
						if (testArg[1] === 'var_name'){
							this.compiler.convertAcqVarNameToVal();
							testArg = this.parser.peekAcquiredTerm();
							if (requiredArgTypes[i] !== testArg[1]){
								this.state.expectedType = requiredArgTypes[i];
								this.state.acquiredType = testArg[1];
								this.methods.makeError('100');
								return this.parser.parse();
							} else {
								collectedArgs.push(this.parser.popAcquiredTerm());
							}
						}
						this.methods.makeError('100')
						this.state.expectedType = requiredArgTypes[i];
						this.state.acquiredType = testArg[1];
						this.methods.makeError('100');
						return this.parser.parse();
					} else {
						collectedArgs.push(this.parser.popAcquiredTerm());
					}
				}
				collectedArgs = collectedArgs.reverse()
				collectedArgs = cachedArgs.concat(collectedArgs);

				//THIS IS REDUNDANT--- IT's an early return above.
				if (closureDepth < minimumClosureDepth){
					var newTerm = constructor.apply(this, collectedArgs);
					this.state.acquiredTerms.push(newTerm);
				} else {
					stopCompose = true;
					return;
				}
			}
			
		},
		convertAcqVarToVal : function () {
			var var_name = this.state.acquiredTerms.pop();
			this.compiler.verifyType(var_name, 'var_name');
			if (this.compiler.errorState){
				return this.parser.parse();
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
			this.state.task = `composing function stack`
			var constructorFunc = constructorArray[0];
			var expectedArgTypes = constructorArray[1];

			var applyArgs = constructorArray[2];
			for (var i = expectedArgTypes.length - 1; i >= 0; i--) {
				if (this.state.errorState){
					return this.parser.parse();
				}
				this.state.expectedType = expectedArgTypes[i]
				var arg = this.parser.peekAcquiredTerm();
				this.state.acquiredType = arg[1];

				var acquiredType = this.state.acquiredType.split("_");
				var expectedType = this.state.expectedType.split("_");

				if (expectedType[0] === acquiredType[0]){
					if (expectedType[1] !== acquiredType[1]){
						if (acquiredType[1] === 'name'){
							if (expectedType[1] === 'val'){
								this.compiler.convertAcqVarNameToVal();
							}
						}
					}
				}

				arg = this.parser.popAcquiredTerm();
				this.state.acquiredType = arg[1];

				if (expectedArgTypes[i] !== arg[1]){
					this.methods.makeError('100');
					return this.parser.parse();
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
		/*
			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					variable Router probably worthless now
			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		variableRouter : {
			var : function (term) {
				this.state.acquiredTerms.push(this.compiler.constructors.var_var(term));
				return this.parser.parse();
			},
			val : function (term) {
				this.state.acquiredTerms.push(this.compiler.constructors.var_val(term));
				return this.parser.parse();
			},
		},
		tokenRouter : {
			" ": function () {
				return this.parser.parse();
			},
			";" : function () {
				//endLine, close openLine;
			},
			'=' : function () {
				var assignee = this.parser.peekAcquiredTerm();
				var assType = assignee[1];
				if (assType !== 'var_name'){
					this.methods.makeError('104');
					return this.parser.parse();
				};
				var varType = assType.split("_")[0];
				this.parser.pushConstructorFunction('assign', [`${varType}_val`], 0 );
				this.compiler.captureLastArg();
				//this.parser.expectedArgs.push(`${varType}_val`);
				return this.parser.parse();
			},
			'+' : function () {
				if (!this.parser.checkForAcqTerms()){
					this.parser.pushConstructorFunction(`unary_add`, ['num_val'])
					return this.parser.parse();
				}
				var assignee = this.parser.peekAcquiredTerm();
				var assType = assignee[1];
				if (assType === 'var_name'){
					prgm.compiler.convertAcqVarToVal();
					assignee = this.parser.peekAcquiredTerm();
					assType = assignee[1];
				};
				if (assType !== 'num_val' && assType !== 'str_val'){
					this.methods.makeError('098');
					return this.parser.parse();
				};
				var expectedType = assType;
				this.parser.pushConstructorFunction(`${assType.split("_")[0]}_add`, [expectedType])
				/* I don't think we should be parsing specific here.... but... */
				//this.parser.expectedArgs.push(expectedType);
				return this.parser.parse();
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
				return this.parser.parse();
			},
			str : function () {
				this.parser.pushConstructorFunction('str_var', ['var_name'])
				this.state.expectedArgs.push("var_name");
				return this.parser.parse();
			},

		},
		genericRouter : {
			" " : function () {
				return this.parser.parse();
			},
			";" : function () {
				this.state.task = "verifying line end state"
				var topOfClosureStack = this.state.closures.pop();
				var foundClosure = topOfClosureStack[0]
				if (foundClosure !== ';'){
					this.state.missingClosure = foundClosure;
					this.state.missingClosureLocation = topOfClosureStack[1];
					this.methods.makeError('50');
				};
				this.state.newLineNeeded = true;
				this.compiler.composeStack();
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
				var term = this.parser.parseSpecific();

				var lineNum = parseInt(term);
				if (this.target.lines[lineNum] !== undefined){
					this.methods.makeError('003');
				} else {
					this.state.currentLine = lineNum;
				}
				return this.parser.parse();
			},
			var_name : function () {
				this.state.task = "parsing variable name";
				this.state.parseType = "var_name";
				this.state.initialChars = this.dataTables.varNameInitials;
				this.state.acceptibleChars = this.dataTables.varNameChars;
				this.state.terminalChars = this.dataTables.varNameTerminators;

				this.parser.parseSpecific();

				this.parser.pushAcquiredTerm();
				return this.parser.parse();
			},
			str_val : function () {
				this.state.task = "parsing string value"
				this.state.parseType = "str_val";
				this.state.initialChars = this.dataTables.stringInitial;
				this.state.terminalChars = this.dataTables.stringTerminator;
				this.state.acceptibleChars = this.dataTables.stringChars;
				this.parser.parseSpecific();

				this.parser.pushAcquiredTerm();
				return this.parser.parse();
			},
			num_val : function () {
				this.state.task = "parsing numerical value";
				this.state.parseType = "num_val";
				this.state.initialChars = this.dataTables.numChars;
				this.state.acceptibleChars = this.dataTables.numChars;
				this.state.terminalChars = this.dataTables.strictRuleTerminators;
				this.parser.parseSpecific();

				this.parser.pushAcquiredTerm();
				return this.parser.parse();
			},
			token : function () {
				this.state.task = "parsing token";
				this.state.parseType = "token";
				this.state.initialChars = this.dataTables.tokenInitials;
				this.state.acceptibleChars = this.dataTables.tokenNonInitials;
				this.state.terminalChars = this.dataTables.tokenTerminators;
				this.parser.parseSpecific();

				this.parser.tokenRouter[this.state.term]();
			},
			name_term : function () {
				this.state.task = "parsing named term";
				this.state.parseType = "name_term";
				this.state.initialChars = this.dataTables.varNameInitials;
				this.state.acceptibleChars = this.dataTables.varNameChars;
				this.state.terminalChars = this.dataTables.varNameTerminators;
				this.parser.parseNamedTerm();

				if (this.state.parseType === "var_name"){
					this.parser.pushAcquiredTerm();
					return this.parser.parse();
				} else if (this.state.parseType === "res_term"){
					this.parser.reservedTermsRouter[this.state.term]();
				}
			},

		},
		parseGenericTerm : function () {

			/*
			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				THIS NEEDS A REWORK
				should look at first term, then delegate
			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			*/
			this.state.task = "parsing next term"
			var prgm = this;
			var acceptibleTerms = Object.keys(this.parser.genericRouter);
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
					return this.parser.parse();
				}
				if (term.length === 0){
					var nextChar = prgm.parser.peekNextChar();
					if (nextChar === " "){
						prgm.parser.getNextChar();
						return termBuilder(term, numCount);
					} else if (prgm.dataTables.stringInitial.includes(nextChar)) {
						prgm.parser.specificRouter['str_val']();
						return;
					} else if (prgm.data.numChars.includes(nextChar)) {
						prgm.parser.specificRouter['num_val']();
						return;
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
							return this.parser.parse();
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
				return this.parser.parse();
			}
		},
		parseNamedTerm : function () {
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
					return this.parser.parse();
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
						return this.parser.parse();
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
					if (prgm.state.acceptibleChars.includes(char)){
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
							return term;
						} else {
							prgm.parser.getNextChar();
							prgm.methods.makeError('001');
							return this.parser.parse();
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
					return this.parser.parse();
				}
				if (term.length === 0){
					var char = prgm.parser.peekNextChar();
					if (char === " "){
						prgm.parser.getNextChar();
						return termBuilder(term, numCount);
					} else if (prgm.state.initialChars.includes(char)){
						term += prgm.parser.getNextChar();
						return termBuilder(term, numCount);
						return this.parser.parse();
					} else if (prgm.state.terminalChars.includes(char)){
						prgm.parser.getNextChar();
						prgm.methods.makeError('002');
						return this.parser.parse();
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
						return prgm.parser.parse();
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
						return prgm.parser.parse();
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

		convertAcqVarNameToVal : function () {
			var variable = this.parser.popAcquiredTerm();
			if (variable[1] !== 'var_name'){
				this.methods.makeError('997');
				return this.parser.parse();
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


		parseGenericTerm : function (term) {
			this.parser.genericRouter[term]();
		},
		parseSpecificTerm : function (term){
			this.parser.specificRouter[term]();
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
				if (this.parser.peekConstStack()[2] < this.state.closures.length){
					this.parser.parseGenericTerm();
				} else if (this.parser.peekConstStack()[2] >= this.state.closures.length){
					this.compiler.composeTopConstructor();
				}

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
				target.getVariableValue = function (var_name) {
					var varName = var_name[0]();
					return this.variables[varName][0];
				};
				target.setVariableValue = function (var_name, _val) {
					/*NOt sure if we need this if the assignment function is written Correctly*/
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
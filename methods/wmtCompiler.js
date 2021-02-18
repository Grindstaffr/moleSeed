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
		genericTerminators : [" ", ";"],
		genericUnexpectedTokens : ['"'],
		resTermChars : /*Needs some active filtration on my part*/["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","_"],
		varNameInitials : ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","_"],
		varNameChars : ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","_","0","1","2","3","4","5","6","7","8","9"],
		varNameTerminators : [" ","=",";",":"],
		tokenInitials : ['!',"=","+","-","/","*","<",">","(",")",";","&","|",':'],
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
		'006' : function () {
			return `syntaxError: invalid use of array index token ":"... token must be preceded by reference to array instance`;
		},
		'007' : function () {
			return `syntaxError: invalid or non-existant reference to line 00`;
		},
		'008' : function () {
			return `syntaxError: line numbers must be greater than all preceding line numbers (expected lineNum > ${Object.keys(this.target.lines)[Object.keys(this.target.lines).length - 1]}, but got lineNum = ${this.state.currentLine})`;
		},
		'009' : function () {
			return `syntaxError: executable must begin with line 00, but got ${this.state.currentLine} on initial line`;
		},
		'020' : function () {
			return `syntaxError: missing lineEnd token ";"`;
		},
		'030' : function () {
			return `syntaxError: then without if... (missing "if" statement) cannot declare conditional response without specifying conditions`;
		},
		'031' : function () {
			return `syntaxError: else without if... (missing "if" statement) cannot declare conditional response without specifying conditions`;
		},
		'032' : function () {
			return `syntaxError: unexpected term "${this.state.term}"... an if statement can have at most one "${this.state.term}`;
		},
		'033' : function () {
			return `syntaxError: unexpected term "${this.state.term}"... an if statement can have at most one "${this.state.term}`;
		},
		'034' : function () {
			return `syntaxError: missing conditional expression, expected conditonal expression before "${this.state.term}"`;
		},
		'035' : function () {
			return `typeError: expected conditional expression (bool_val) but got (${this.state.acquiredType})`;
		},
		'036' : function () {
			return `syntaxError: too many arguments: conditional statement (if-then-else) must be of form "["if"] [bool_val] (("then")(func)) (("else")(func))"`
		},
		'040' : function () {
			return `syntaxError: line contains unexpected expression... hanging ${this.state.acquiredType}`;
		},
		'041' : function () {
			return `syntaxError: unexpected numerical expression or missing ";"...`
		},
		'050' : function () {
			return `syntaxError: expected "${this.state.missingClosure}" before ";"... closure opened at line ${this.state.missingClosureLocation[0]}, index ${this.state.missingClosureLocation[1]}`
		},
		'051' : function () {
			return `syntaxError: missing expression, expected ${this.state.expectedType} before "${this.state.term}"`;
		},
		'052' : function () {
			return `syntaxError: unexpected token "${this.state.term}"... expected some value, but got "${this.state.term}"`;
		},
		'053' : function () {
			return `syntaxError: unexpected use of reserved term... expected expression, but got ${this.state.term};`
		},
		'054' : function () {
			return "SOMETHING SPECIAL JUST FOR ME!!"
		},
		'060' : function () {
			return `incompleteErrorMessage: FORSTACK NOT EMPTY (but this is a bad message... needs line that for was opened on)`;
		},
		'061' : function () {
			return `incompleteErrorMessage: WHILESTACK NOT EMPTY (but this is a bad message... needs line that "while" was opened on)`;
		},
		'070' : function () {
			return `mallocError: cannot increase array size through assignment operator (${this.state.assignee} has fewer indexes than ${this.state.assignment})`;
		},
		'095' : function () {
			return `typeError: illegal type-coercion... cannot change ${this.state.acquiredType} variable to alternate type ${this.state.expectedType}`;
		},
		'096' : function () {
			return `typeError: assignment operator cannot handle array resizing`;
		},
		'097' : function () {
			return `typeError: numerical operator "${this.state.operator}" only accepts numbers as operands... got ${this.state.acquiredType}`;
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
			return `syntaxError: invalid assignment to undeclared variable`;
		},
		'102' : function () {
			return `typeError: expected "${this.state.expectedType}" before "${this.state.term}", but got ${this.state.acquiredType}`;
		},
		'103' : function () {
			return `typeError: cannot find size_of undefined`;
		},
		'104' : function () {
			return `syntaxError: invalid assignment left-hand side, ("=" operator is for assignment only, to test equality, use "==")`;
		},
		'200' : function () {
			return `referenceError: (undefined term -> ${this.state.term}) is either an undefined variable name, or a malformed ${this.state.parseType}`;
		},
		'201' : function () {
			return `referenceError: declared index is not a valid reference for referenced array`;
		},
		'202' : function () {
			return `referenceError: ${this.state.term} is undefined`;
		},
		'250' : function () {
			return `syntaxError: unexpected reference to undefined variable: ${this.state.term}`
		},
		'900' : function () {
			return `internalError: term length exceeds buffer size... ensure all terms are less than 1024 bytes`;
		},
		'950' : function () {
			return `internalError: parseFailure... parser parsed a number, but compiler got NaN`;
		},
		'994' : function () {
			return `internalError: developer has a diaper brain: compiler is trying to verify that something is something it shouldn't be;`
		},
		'995' : function () {
			return `internalError: parsed ${this.state.term} as a res_term... but no res_terms match ${this.state.term}`;
		},
		'996' : function () {
			return `internalError: cannot typeCheck acquired term when no terms have been acquired`;
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
		'SHITCODE' : function () {
			return `syntaxError: written line is so shit that the compiler can't even throw a decent error message.`;
		},

	},
	compiler : {
		constructors : {
			/*
				The option remains to include typechecking in each of these contructors...
				I'm hoping to write the parser/compiler such that these never get called
				with a mismatched-type... but hey... backups don't necessarily hurt;

			*/
			size_of : function (any) {
				var thing = any[0];
				var thingType = any[1];
				if (thingType === 'undefined'){
					this.methods.makeError('103');
					return;
				} 
				var sizeOf = function () {
					if (thingType == 'var_name'){
						var variable = this.variables[thing()];
						if (variable[0] === undefined || variable[0] === 'undefined'){
							this.throwError(`cannot find size_of ${variable[2]}... ${variable[2]} is undefined: line ${this.currentLine}`);
							return;
						}
						if (variable[1] === 'num'){
							return Math.ceil(Math.log2(variable[0]));
						};
						if (variable[1] === 'str'){
							return variable[0].length;
						};
						if (variable[1] === 'str_arr'){
							return variable[3];
						};
						if (variable[1] === 'bool'){
							return 1;
						}
						if (variable[2] === 'num_arr'){
							return variable[3];
						}
					} else if (thingType === 'num_val'){
						var number = thing();
						if (number[0] === undefined) {
							this.throwError(`cannot find size_of number... number is undefined: line ${this.currentLine}`);
							return;
						}
						return Math.ceil(Math.log2(number));
					} else if (thingType === 'str_val' ){
						var string = thing();
						if (string[0] === undefined){
							this.throwError(`cannot find size_of string... string is undefined: line ${this.currentLine}`);
							return;
						}
						return string.length
					} else if (thingType === 'bool_val'){
						var boolean = thing();
						if (boolean[0] === undefined){
							this.throwError(`cannot find size_of boolean... boolean is undefined: line ${this.currentLine}`);
							return;
						}
						return 1;
					} else if (thingType === 'str_arr' || thingType === 'num_arr'){
						var array = thing();
						return array[3];
					} else {
						this.throwError(`cannot find size_of "${thingType}"... "${thingType}" not supported by size_of function: line ${this.currentLine}`);
					}
				}
				return [sizeOf.bind(this.target), 'num_val'];
			},
			wait : function (num_val) {
				var numVal = num_val[0];
				var count = 0;
				const waitFunc = function () {
					if (count < numVal()){
						this.nextLine = this.currentLine;
						count = count + 1;
						return;
					} else {
						this.nextLine = -1;
						count = 0;
						return;
					}
				}
				return [waitFunc.bind(this.target), 'undefined'];
			},
			trmnl_node : function () {
				const trmnlNodeFunc = function () {
					var node = this.api.getActiveNode();
					var index0 = node.name;
					var index1 = node.type;
					var index2 = node.address;
					var index3 = node.getNodeDepth().toString();
					var output = [[],'str_arr','this_node',4];
					output[0].push([index0,'str','this_node@0'])
					output[0].push([index1,'str','this_node@1'])
					output[0].push([index2,'str','this_node@2'])
					output[0].push([index3,'str','this_node@3'])
					return output;
				}
				return [trmnlNodeFunc.bind(this.target), 'str_arr'];
			},
			this_node : function () {
				const thisNode = function () {
					var node = this.activeNode;
					var index0 = node.name;
					var index1 = node.type;
					var index2 = node.address;
					var index3 = node.getNodeDepth().toString();
					var output = [[],'str_arr','this_node',4];
					output[0].push([index0,'str','this_node@0'])
					output[0].push([index1,'str','this_node@1'])
					output[0].push([index2,'str','this_node@2'])
					output[0].push([index3,'str','this_node@3'])
					return output;
				};
				return [thisNode.bind(this.target), 'str_arr'];
			},
			inputS : function (var_name) {
				this.compiler.verifyType(var_name, 'var_name');
				if (this.state.errorState){
					return;
				};
				var varName = var_name[0];
				this.compiler.typeCheckVariable(varName, 'str');
				if (this.state.errorState){
					return;
				}
				//this.target.variables[varName()] = [undefined, 'str', varName];
				const inputStrFunc = function () {
					if (this.api === undefined){
						return
					}
					var executable = this;
					var output;
					this.api.stallExecutable();
					this.api.requestInput(function(commandFull){
						executable.variables[varName()][0] = commandFull;
						executable.api.resumeExecutable();
					}, `input ${varName()}:`);
				}
				return [inputStrFunc.bind(this.target), 'undefined'];
			},
			reel : function () {
				const reelFunc = function () {
					while (this.visitedNodes.length > 0) {
						this.activeNode.assembleVisibleAdjacencies();
						var accessibleNodes = Object.keys(this.activeNode.visibleAdjacencies);
						var prevNode = this.visitedNodes.pop()
						if (accessibleNodes.includes(prevNode) || this.activeNode.name === prevNode){
							if (this.activeNode.name !== prevNode){
								this.activeNode = this.activenode.visibleAdjacencies[prevNode];
							}
							if (Object.is(this.activeNode, this.api.getActiveNode())){
								this.visitedNodes = [];
							}
						} else {
							this.api.warn(`directional edges found on traverse path: cannot reel`);
							return false;
						}
					}
					return true;
				}
				return [reelFunc.bind(this.target), 'bool_val'];
			},
			trace : function () {
				const trace = function () {
					var followPath = this.visitedNodes.reverse();
					while (followPath.length > 0){

					}
				};
				return [traceFunc.bind(this.target), 'bool_val'];
			},
			err : function (str_val){
				this.compiler.verifyType(str_val, 'str_val');
				if (this.state.errorState){
					return;
				}
				var strVal = str_val[0]
				const errFunc = function () {
					this.throwError(strVal());
					return;
				}
				return [err.bind(this.target), 'undefined'];
			},
			tmv : function (str_val){
				this.compiler.verifyType(str_val, 'str_val');
				if (this.state.errorState) {
					return; 
				}
				var  nodeName = str_val[0];
				const terminalMove = function () {
					if (this.api === undefined){
						return true;
					} 
					var startNode = this.api.getActiveNode().name;

					if (startNode === nodeName()){
						return true;;
					};
				
					this.api.executeCommand('mv', nodeName());
					
					if (startNode === this.api.getActiveNode().name){
						return false;
					};
					return true;
				}
				return [terminalMove.bind(this.target), 'bool_val'];
			},
			mv : function (str_val){
				this.compiler.verifyType(str_val, 'str_val');
				var strVal = str_val[0];
				const move = function () {
					if (this.api === undefined){
						return true;
					}
					var nodeTarget = strVal();
					this.activeNode.assembleVisibleAdjacencies();
					var accessibleNodes = Object.keys(this.activeNode.visibleAdjacencies)
					if (accessibleNodes.includes(nodeTarget)){
						this.visitedNodes.push(this.activeNode.name);
						this.activeNode = this.activeNode.visibleAdjacencies[nodeTarget];
						console.log('might want some handling for encrypted nodes/nodelets here?')
						return true;
					} else if (nodeTarget = this.activeNode.name) {
						return true;
					} else {
						return false;
					}
				}
				return [move.bind(this.target), 'bool_val'];
			},
			lk : function (){

				const look = function () {
					if (!this.activeNode.assembleVisibleAdjacencies || typeof this.activeNode.assembleVisibleAdjacencies !== 'function'){
						debugger;
					}
					this.activeNode.assembleVisibleAdjacencies();
					var output = [];
					var accessibleNodes = Object.keys(this.activeNode.visibleAdjacencies)
					accessibleNodes.forEach(function(nodeName, index){
						output.push([nodeName, 'str', `look@${index}`])
					})
					return [output, 'str_arr', 'look', accessibleNodes.length];
				}
				return [look.bind(this.target), `str_arr`];
			},
			printN : function (num_val){
				this.state.task = "assembling function printN";
				var x = num_val;
				const printN = function () {
					var number = x[0]();
					if (number === undefined || number === 'undefined' || number === NaN){
						number = 'undefined';						
					}
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
			printB : function (bool_val){
				this.state.task = "assembling function print"

				var x = bool_val;
				const print = function () {
					var string = x[0]();
					if (string === "false" || !string){
						this.api.log("false");
					} else {
						this.api.log("true")
					}
					return;
				};
				return [print.bind(this.target), 'undefined'];
			},
			end : function () {
				const end = function () {
					this.end = true;
					return;
				}
				return [end.bind(this.target), 'undefined'];
			},
			goto : function (num_val){
				var x = num_val;
				const goto = function () {
					var lineNum = x[0]();
					this.nextLine = lineNum;
				};
				return [goto.bind(this.target), 'undefined'];
			},
			if : function (bool_val, then_func, else_func){
				var boolVal = bool_val;
				var thenFunc 
				const ifFunc = function () {
					const boolProp = boolVal[0]();
					if (boolProp){
						//do thenFunc
					} else {
						//do elseFunc
					}
				};
				return [ifFunc.bind(this.target), 'undefined'];
			},
			gthan : function (num_valA, num_valB){
				this.compiler.verifyType(num_valA, 'num_val');
				if (this.state.errorState){
					return;
				}
				this.compiler.verifyType(num_valB,'num_val')
				if (this.state.errorState){
					return;
				}
				var x = num_valA[0];
				var y = num_valB[0];
				const greaterThan = function () {
					var a = x();
					var b = y();
					if (a === undefined || b === undefined){
						this.throwError(`cannot evaluate boolean operator "<"... got undefined term`);
						return;
					}
					return a > b;
				}
				return [greaterThan.bind(this.target), 'bool_val'];
			},
			geqthan : function (num_valA, num_valB){
				this.compiler.verifyType(num_valA, 'num_val');
				if (this.state.errorState){
					return;
				}
				this.compiler.verifyType(num_valB,'num_val')
				if (this.state.errorState){
					return;
				}
				var x = num_valA[0];
				var y = num_valB[0];
				const greatEqThan = function () {
					var a = x();
					var b = y();
					if (a === undefined || b === undefined){
						this.throwError(`cannot evaluate boolean operator "<"... got undefined term`);
						return;
					}
					return a >= b;
				}
				return [greatEqThan.bind(this.target), 'bool_val'];
			},
			lthan : function (num_valA, num_valB){
				this.compiler.verifyType(num_valA, 'num_val');
				if (this.state.errorState){
					return;
				}
				this.compiler.verifyType(num_valB,'num_val')
				if (this.state.errorState){
					return;
				}
				var x = num_valA[0];
				var y = num_valB[0];
				const lessThan = function () {
					var a = x();
					var b = y();
					if (a === undefined || b === undefined){
						this.throwError(`cannot evaluate boolean operator "<"... got undefined term`);
						return;
					}
					return a < b;
				}
				return [lessThan.bind(this.target), 'bool_val'];
			},
			leqthan : function (num_valA, num_valB){
				this.compiler.verifyType(num_valA, 'num_val');
				if (this.state.errorState){
					return;
				}
				this.compiler.verifyType(num_valB,'num_val')
				if (this.state.errorState){
					return;
				}
				var x = num_valA[0];
				var y = num_valB[0];
				const lessEqThan = function () {
					var a = x();
					var b = y();
					if (a === undefined || b === undefined){
						this.throwError(`cannot evaluate boolean operator "<"... got undefined term`);
						return;
					}
					return a <= b;
				}
				return [lessEqThan.bind(this.target), 'bool_val'];
			},
			not : function (bool_val){
				this.compiler.verifyType(bool_val, 'bool_val');
				if (this.state.errorState){
					return;
				}
				var x = bool_val[0];
				const not = function () {
					var bool = x();
					if (bool === undefined){
						return true;
					}
					return !bool;
				};
				return [not.bind(this.target), 'bool_val'];
			},
			notEquivalence : function (valA, valB){
				var x = valA;
				var y = valB;
				const notEqual = function () {
					if (x[1] !== y[1]){
						return true;
					};
					var a = x[0]();
					var b = y[0]();
					if (a === undefined && b === undefined){
						return false;
					};
					if (a === null && b === null){
						return false;
					};
					if (a === NaN || b === NaN){
						return true;
					};
					return !(a == b);
				}
				return [notEqual.bind(this.target), 'bool_val'];
			},
			equivalence : function (valA, valB){
				/*
					at present no difference between strict equivalence
					 and loose equivalence... eg  (1 == true) is false;
				*/
				var x = valA;
				var y = valB;
				const equivalence = function () {
					if (x[1] !== y[1]){
						return false;
					};
					var a = x[0]();
					var b = y[0]();
					if (a === undefined && b === undefined){
						return true;
					};
					if (a === null && b === null){
						return true;
					};
					if (a === NaN || b === NaN){
						return false;
					};
					return (a == b);
				}
				return [equivalence.bind(this.target), 'bool_val'];
			},
			or : function (bool_valA, bool_valB) {
				this.state.task = "assembling boolean operator ||";
				this.compiler.verifyType(bool_valA, 'bool_val');
				if (this.state.errorState){
					return;
				}
				this.compiler.verifyType(bool_valB, 'bool_val');
				if (this.state.errorState){
					return;
				}
				var x = bool_valA;
				var y = bool_valB;
				const orFunc = function () {
					var a = x[0]();
					var b = y[0]();
					return a || b;
				}
				return [orFunc.bind(this.target), 'bool_val'];
			},
			and : function (bool_valA, bool_valB) {
				this.state.task = "assembling boolean operator &&";
				this.compiler.verifyType(bool_valA, 'bool_val');
				if (this.state.errorState){
					return;
				}
				this.compiler.verifyType(bool_valB, 'bool_val');
				if (this.state.errorState){
					return;
				}
				var x = bool_valA;
				var y = bool_valB;
				const andFunc = function () {
					var a = x[0]();
					var b = y[0]();
					return a && b;
				}
				return [andFunc.bind(this.target), 'bool_val'];
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
				var y = val;
				const assign = function () {
					var assignTo
					if (y[1] === 'var_name'){
						assignTo = this.getVariableValue(y);
					} else {
						assignTo = y[0](); 
					}
					var xName = x[0]();
					if (xName.split('@').length === 1){
						if (this.variables[xName][1].split('_').length > 1){
							if (this.variables[xName][1].split('_')[1] === 'arr'){
								for (var i = 0; i < this.variables[xName][3] ; i ++){
									if ( i < assignTo[3]){
										if (assignTo[0][i] === undefined){
											console.warn(`indexing off by one, i think -r@`);
										}
										this.variables[xName][0][i] = assignTo[0][i];
									} else {
										var emptyVal = [undefined, this.variables[xName][1].split('_')[0], `${xName}@${i}`];
										this.variables[xName][0][i] = emptyVal;
									}
								}
								return xName;
							}
						}
						this.variables[xName][0] = assignTo;
						return xName;
					} else if (xName.split('@').length === 2){
						var arrName = xName.split('@')[0];
						var index = parseInt(xName.split('@')[1]);
						if (this.variables[arrName][0][index] === undefined){
							this.throwError(`illegal reference ${arrName}:${index} is undefined: line ${this.currentLine}`);
							return;
						}
						this.variables[arrName][0][index][0] = assignTo;
						return xName;
					}
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
			negate : function (num_val){
				this.state.task = "assembling operator negate";
				var v = num_val;
				this.compiler.verifyType(num_val, "num_val");
				if (this.state.errorState){
					return -v[0]();
				}
				return [negate.bind(this.target), 'num_val'];
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
			num_sub : function (num_valA, num_valB){
				this.state.task = "assembling operator num_sub";
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

				const numSub = function () {
					var a = vfA();
					var b = vfB();
					return a - b;
				};
				return [numSub.bind(this.target), "num_val"];
			},
			num_mul :  function (num_valA, num_valB){
				this.state.task = "assembling operator num_mul";
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

				const numMul = function () {
					var a = vfA();
					var b = vfB();
					return a * b;
				};
				return [numMul.bind(this.target), "num_val"];
			},
			num_div : function (num_valA, num_valB){
				this.state.task = "assembling operator num_div";
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

				const numDiv = function () {
					var a = vfA();
					var b = vfB();
					if (b === 0){
						this.throwError('cannot divide by zero');
						return;
					}
					return a / b;
				};
				return [numDiv.bind(this.target), "num_val"];

			},
			num_rem : function (num_valA, num_valB){
				this.state.task = "assembling operator num_rem";
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

				const numRem = function () {
					var a = vfA();
					var b = vfB();
					return a % b;
				};
				return [numRem.bind(this.target), "num_val"];

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
				this.target.variables[varName] = [undefined, 'str', varName];
				// ^^^^^^this may be redundant?


				const defineStr = function () {
					this.variables[varName] = [undefined, 'str', varName];
					return varName;
				}
				return [defineStr.bind(this.target), 'var_name'];
			},
			bool_var : function (var_name) {
				this.state.task = "assembling variable declaration bool";
				this.compiler.verifyType(var_name, 'var_name');
				if (this.state.errorState){
					return;
				}
				var varName = var_name[0]();
				this.target.variables[varName] = [undefined, 'bool', varName];

				const defineBool = function () {
					this.variables[varName] = [undefined, 'bool', varName];
					return varName;
				}
				return [defineBool.bind(this.target), "var_name"];
			},
			str_arr : function (var_name, num_val){
				this.state.task = "assembling variable declaration string array";
				this.compiler.verifyType(var_name, 'var_name');
				if (this.state.errorState){
					return;
				}
				this.compiler.verifyType(num_val, 'num_val');
				if (this.state.errorState){
					return;
				}
				var varName = var_name[0];
				var numVal = num_val[0];
				var indexes = numVal();
				this.target.variables[varName()] = [[], 'str_arr', varName(), indexes];
				for (var i = 0; i < indexes; i ++){
					var entry = [undefined, 'str', `${varName()}@${i}`]
					this.target.variables[varName()][0].push(entry);
				}
				const defineStringArray = function () {
					var indexes = numVal();
					this.variables[varName()] = [[], 'str_arr', varName(), indexes];
					for (var i = 0; i < indexes; i ++){
						var entry = [undefined, 'str', `${varName()}@${i}`]
						this.variables[varName()][0].push(entry);
					}
					return varName();
				}
				return [defineStringArray.bind(this.target), 'var_name'];
			},
			num_arr : function (var_name, num_val){
				this.state.task = "assembling variable declaration number array";
				this.compiler.verifyType(var_name, 'var_name');
				if (this.state.errorState){
					return;
				}
				this.compiler.verifyType(num_val, 'num_val');
				if (this.state.errorState){
					return;
				}
				var varName = var_name[0];
				var numVal = num_val[0];
				var indexes = numVal();
				this.target.variables[varName()] = [[], 'num_arr', varName(), indexes];
				for (var i = 0; i < indexes; i ++){
					var entry = [undefined, 'num', `${varName()}@${i}`]
					this.target.variables[varName()][0].push(entry);
				}
			
				const defineStringArray = function () {
				
					var indexes = numVal();
					this.variables[varName()] = [[], 'num_arr', varName(), indexes];
					for (var i = 0; i < indexes; i ++){
						var entry = [undefined, 'num', `${varName()}@${i}`]
						this.variables[varName()][0].push(entry);
					}
					return varName();
				}
				return [defineStringArray.bind(this.target), 'var_name'];
			},
			anon_arr_index : function (arr, num_val){
				this.compiler.verifyType(arr, 'arr');
				if (this.state.errorState){
					return;
				}
				this.compiler.verifyType(num_val, 'num_val');
				if (this.state.errorState){
					return;
				}
				var arrayType = arr[1].split("_")[0];
				var arrayLiteral = arr[0];
				var numVal = num_val[0];
				const arrayIndexLiteral = function () {
					var index = numVal();
					var arrLit = arrayLiteral();
					var array = arrLit[0];
					var arrLength = arrLit[3];
					if (index > arrLength - 1){
						return undefined;
					}
					return arrayLiteral()[0][numVal()][0];
				};
				return [arrayIndexLiteral.bind(this.target), `${arrayType}_val`];

			},
			arr_index : function (var_name, num_val){
				this.state.task = "assembling variable reference arr_index";
				this.compiler.verifyType(var_name, 'var_name');
				if (this.state.errorState){
					return;
				}
				this.compiler.verifyType(num_val, 'num_val');
				if (this.state.errorState){
					return;
				}
				var varName = var_name[0];
				var numVal = num_val[0];
				const defineArrayIndexRef = function () {
					return varName() + '@' + numVal();

				};
				return [defineArrayIndexRef.bind(this.target), 'var_name']
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
				if (str === undefined){

				}
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
				this.state.task = "assembling primative num_val"
				var number = parseInt(num);	
				if (Number.isNaN(number)){
					this.methods.makeError('950');
					return;
				}
				const defineNum_val = function (){
					return number;
				}
				return [defineNum_val.bind(this.target), 'num_val'];
			},
			bool_val : function (bool) {
				this.state.task = "assembling primative bool_val";
				var boolean;
				var nonInt = false;
				if (bool === "true"){
					boolean = true;
				} else if (bool === "false"){
					boolean = false;
				};
				if (boolean === undefined){
					var num = parseInt(bool);
					if (Number.isNaN(num)){
						nonInt = true;
					}
					if (num === 0){
						boolean = false;
					} else if (num >= 1){
						boolean = true;
					} else if (num <= -1){
						boolean = true;
					}
				}
				if (boolean === undefined){
					if (nonInt){

					}
				}
			},
			str_bool_val : function (str) {
				//unfinsidhed bs
				this.state.task = "assembling primative bool_val";
				var boolean;
				if (str === `""`){
					boolean = false;
				} else if (str.length >= 3){
					boolean = true;
				}
				if (boolean === undefined){
					this.methods.makeError()
				}
			},
			num_bool_val : function (num) {
				//unfinfished bs
				this.state.task = "assembling primative bool_val";
				var number = parseInt(num);
				if (Number.isNaN(number)){
					nonInt = true;
				}
				if (number === 0){
					boolean = false;
				} else if (number >= 1){
					boolean = true;
				} else if (number <= -1){
					boolean = true;
				}
			},

			true : function () {
				const tFunc = function () {
					return true;
				}
				return [tFunc.bind(this.target), "bool_val"]
			},
			false : function () {
				const fFunc = function () {
					return false;
				}
				return [fFunc.bind(this.target), "bool_val"]
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
		verifyValidVarName : function () {
			if (this.state.parseType !== 'var_name'){
				this.methods.makeError('994');
			};
			var varName = this.state.term;
			if (this.target.variables[varName] === undefined){
				this.methods.makeError('202');
			};
		},
		verifyVariableAssignee : function (varName){
			if (this.target.variables[varName] !== undefined){
				return;
			} else {
		
				if (varName.split('@').length === 2){
					var arrName = varName.split('@')[0];
					var index = parseInt(varName.split('@')[1]);
					var maxIndex = this.target.variables[arrName][3] - 1;
					if (index > maxIndex){
						this.methods.makeError('201');
						return;
					} else if (index < 0){
						this.methods.makeError('201');
						return;
					} else if (index >= 0 && index <= maxIndex){
						return;
					} else if (index === NaN || varName.split('@')[1] === 'undefined'){
						return;
					}
				}
				this.methods.makeError('101');
				return;
			}
		},
		typeCheckVariable : function (varName, type) {
			var types = ['bool','str','num', 'str_arr', 'num_arr'];
			if (!types.includes(type)){
				this.methods.makeError('994');
				return;
			};
			var variable = this.target.variables[varName()];
			if (variable === undefined){
				this.state.term = varName();
				this.methods.makeError('202');
				return;
			}
			var varType = variable[1];
			if (varType !== type){
				this.state.expectedType = type;
				this.state.acquiredType = type;
				this.methods.makeError('095');
				return;
			} else {
				return;
			}

		},
		typeCheckAssignmentValue : function (varName, assignment){
			if (varName.split('@').length === 1){
				this.state.expectedType = this.target.variables[varName][1];
				
			} else if (varName.split('@').length === 2){
				var arrName = varName.split('@')[0];
				var index = parseInt(varName.split('@')[1]);
				if (Number.isNaN(index) && varName.split('@')[1] === "undefined"){
					this.state.expectedType = this.target.variables[arrName][0][0][1]
				} else {
					this.state.expectedType = this.target.variables[arrName][0][index][1];
				}
			}
			/*if (this.state.expectedType.split('_')[1] === 'arr'){
				var isArray = (assignment[1].split("_") === 'arr');
				if (isArray){
					if (assignment[3] === undefined || assignment[3] !== this.variables[varName][3]){
						this.methods.makeError('096');
						return;
					}	
				} 
			}*/
			if (this.state.expectedType === 'bool'){
				var isValue = (assignment[1].split("_")[1] === 'val');
				if (!isValue){
					this.state.acquiredType = assingment[1];
					this.methods.makeError('099')
					return;
				} else {
					this.state.parseType = assignment[1];
					return;
				}
			};
			this.state.acquiredType = assignment[1].split("_")[0]
			if (this.state.expectedType === assignment[1]){
				if (this.state.expectedType.split('_')[1] === 'arr'){
					var maxIndexes = this.target.variables[varName][3];
					var assignmentIndexes = assignment[3];
					if (assignmentIndexes > maxIndexes){
						this.methods.makeError('070');
					} else {
						return;
					}
				}
				return;
			} 
			if (this.state.expectedType === this.state.acquiredType) {
				return
			} else {
				this.methods.makeError('099');
				return;
			}
		},
		verifyType : function (input, expectedType){
				this.state.task = "verifying type"
			if (expectedType === 'val'){
				if ((input[1].split("_").length === 2) && (input[1].split("_")[1] === 'val')){
					return;
				}
			}
			if (expectedType === 'arr'){
				if ((input[1].split("_").length === 2) && (input[1].split("_")[1] === 'arr')){
					return;
				}
			}
			if (input[1] === expectedType){
				return;
			} else {
				this.state.expectedType = expectedType;
				this.state.acquiredType = input[1];
				this.methods.makeError('100');
				return;
			}
		},
		coerceAcqToBool : function (){
			const boolCoerceRouter = {
				'num_val': function (num_val) {
					var x = num_val;
					const numBool = function () {
						var num = x[0]();
						if (num === undefined){
							return false;
						} else if ( num === 0 ){
							return false;
						} else {
							return true;
						}
					}
					return [numBool, 'bool_val'];

				},
				'str_val': function (str_val) {
					var x = str_val;
					const strBool = function () {
						var str = x[0]();
						if (str === undefined){
							return false;
						} else if (str.length === 0){
							return false;
						} else {
							return true;
						}
					}
					return [strBool, 'bool_val'];

				},
				'var_name' : function (var_name) {

				},
			}
			if (this.parser.peekAcquiredTerm() === undefined){
				return;
			}
			var coercionTarget = this.state.acquiredTerms.pop();
			var targetType = coercionTarget[1];
			if (Object.keys(boolCoerceRouter).includes(targetType)){
				var returnable = boolCoerceRouter[targetType](coercionTarget);
				returnable[0] = returnable[0].bind(this.target)
				this.state.acquiredTerms.push(returnable);
			} else {
				if (targetType === 'bool_val'){
					this.state.acquiredTerms.push(coercionTarget);
				}
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
		allocateMemory : function () {
			var characters = this.state.currentLineIndex;
			var bytes = characters * 2;
			this.target.memory = this.target.memory + bytes;
			return;
		},
		allocateVariableMemory : function () {
			Object.keys(this.target.variables).forEach(function(varName){
				var variable = this.target.variables[varName];
				var bytes = 0;
				if (variable.length == 4){
					bytes = variable[3] * 1024
				} else if (variable.length == 3){
					bytes = 1024;
				}
				this.target.memory += bytes;
			}, this);
			return;
		},
		finalizeMemoryAllocation : function () {
			this.target.memory = Math.ceil(this.target.memory/1024);
			return;
		},
		compileLine : function () {
			var functionQueue = [];
		
			for (var i = this.state.acquiredTerms.length - 1; i >= 0; i--) {
				if (this.state.acquiredTerms[i][1] === 'var_name'){
					if (this.target.variables[this.state.acquiredTerms[i][0]()] === undefined){
						this.methods.makeError('250');
						break;
					}
				}
				if (this.state.acquiredTerms[i][1] === 'num_val' || this.state.acquiredTerms[i][1] === 'str_val'){
					this.state.acquiredType = this.state.acquiredTerms[i][1];
					if (this.state.acquiredTerms[i][1] === 'num_val' && functionQueue.length > 0){
						this.methods.makeError('041');
						break;
					}
					this.methods.makeError('040');
					break;
				}
				functionQueue.push(this.state.acquiredTerms[i][0]);
			};
			if (this.state.errorState){
				return;
			}
			this.target.lines[this.state.currentLine] = function () {
				functionQueue.forEach(function(func){
					func();
				});
			};
		},
		populateIfHandler : function () {
			const ifHandler = function (bool_val, then_func, else_func) {
				this.compiler.verifyType(bool_val,'bool_val');
				if (this.state.errorState){
					return;
				}
				if (then_func){

				} else {
					then_func = [function (){}, 'undefined'];
				}
				if (else_func){

				} else {
					else_func = [function (){}, 'undefined'];
				}
				var boolProp = bool_val[0];
				var thenFunc = then_func[0];
				var elseFunc = else_func[0];
				const ifFunc = function () {
			
					if (boolProp()){
						thenFunc();
					} else {
						elseFunc();
					};
					return;
				}
				return [ifFunc.bind(this.target), 'undefined'];
			};
			this.state.ifHandler = [ifHandler.bind(this), []]
		},
		captureLastArgIf : function (index) {
			this.state.task = 'capturing arg for if handler'
			if (this.state.ifHandler.length === 0){
				//could be an error condition, depending on how we handle then and else
				return;
			}
	
			var argCount = this.state.ifHandler[1].length;
			if (index === argCount){
				if (this.state.acquiredTerms.length === 0){
					this.methods.makeError('034');
					return;
				}
				if (index === 0){
					if (this.parser.peekAcquiredTerm()[1] === 'var_name'){
						this.compiler.convertAcqVarToVal();
					}
					if (this.parser.peekAcquiredTerm()[1] !== 'bool_val'){
						this.state.acquiredType = this.parser.peekAcquiredTerm()[1];
						this.methods.makeError('035');
						return;
					}
				}
				this.state.ifHandler[1].push(this.state.acquiredTerms.pop());
			} else if (argCount === 0 && index === 1){
				if (this.state.acquiredTerms.length < 1){
					this.methods.makeError('034');
					return;
				};
				if (this.state.acquiredTerms[0][1] !== 'bool_val'){
					this.state.acquiredType = this.state.acquiredTerms[0][1];
					this.methods.makeError('035');
					return;
				};
				if (this.state.acquiredTerms[0][1] === 'bool_val' && this.state.acquiredTerms.length === 2){
					this.state.ifHandler[1].push(this.state.acquiredTerms.pop());
					this.state.ifHandler[1].push(this.state.acquiredTerms.pop());
					this.state.ifHandler[1] = this.state.ifHandler[1].reverse();
				} else {
					if (this.state.acquiredTerms[0][1] === 'bool_val' && this.state.acquiredTerms.length === 1){
						this.state.ifHandler[1].push(this.state.acquiredTerms.pop());
						this.state.ifHandler[1].push([function(){}, 'undefined']);
					};
				}
				//this.state.ifHandler[1].push([function(){}.bind(this.target), 'undefined']);
			} else if (argCount > index){
				if (index === 0){
					this.methods.makeError('032');
					return;
				} else if (index === 1){
					this.methods.makeError('033');
					return;
				}
			}
		},
		composeIfHandler : function () {
			this.state.task = 'composing if handler'
			if (this.state.ifHandler.length === 0){
				return;
			};
			var applyArgs = [];
			var captureArgs = this.state.ifHandler[1];
			if (this.state.acquiredTerms.length > 3 - captureArgs.length){
				this.methods.makeError('036')
				return;
			}
			for (var i = this.state.acquiredTerms.length - 1; i >=0; i--){
				applyArgs.push(this.state.acquiredTerms.pop());
			};
			applyArgs = captureArgs.concat(applyArgs.reverse());

			if (applyArgs[0][1] !== 'bool_val'){
				this.state.acquiredType = applyArgs[0][1];
				this.methods.makeError('035');
				//this.methods.makeError('something')
				return;
			};
			var ifConstructor = this.state.ifHandler[0];
		
			var ifFunc = ifConstructor.apply(this, applyArgs);
			this.state.acquiredTerms.push(ifFunc);
			this.state.ifHandler = [];
			return;
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
					if (testArg === undefined){
						debugger;
					}
					this.state.acquiredType = testArg[1];

					if (requiredArgTypes[i] === 'any' && this.state.acquiredType !== 'undefined'){
						requiredArgTypes[i] = this.state.acquiredType;
					}

					if (requiredArgTypes[i] !== testArg[1]){
						if (testArg[1] === 'var_name'){
							this.compiler.convertAcqVarToVal();
							if (this.state.errorState){
								return;
							}
							testArg = this.parser.peekAcquiredTerm();
							this.state.acquiredType = testArg[1];
						}
					}

					if (requiredArgTypes[i] === 'val'){
						if (this.state.acquiredType.split("_").length === 2 && this.state.acquiredType.split("_")[1] === 'val'){
							collectedArgs.push(this.parser.popAcquiredTerm());
							continue;
						}
					}


					if (requiredArgTypes[i] !== testArg){
						if (requiredArgTypes[i] === 'bool_val'){
							this.compiler.coerceAcqToBool();
							testArg = this.parser.peekAcquiredTerm();
							this.state.acquiredType = testArg[1];
						}
					}

					if (requiredArgTypes[i] !== testArg[1]){

						this.state.expectedType = requiredArgTypes[i];
						this.state.acquiredType = testArg[1];
						this.methods.makeError('100');
						return;
					} else {
						collectedArgs.push(this.parser.popAcquiredTerm());
						continue;
					}
						
					/*	console.log('broke here');
						this.methods.makeError('100')
						this.state.expectedType = requiredArgTypes[i];
						this.state.acquiredType = testArg[1];
						this.methods.makeError('100');
						return;
					} else {
						collectedArgs.push(this.parser.popAcquiredTerm());
						continue
					}*/
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
		checkAcqVarIsArr : function (var_name) {
		
			if (!var_name || var_name === undefined || var_name.length < 2){
				if (this.state.acquiredTerms.length === 0){
					this.methods.makeError('996');
				} else {
					var_name = this.parser.peekAcquiredTerm();
				}
			}
			if (this.state.errorState){
				return;
			}
			this.compiler.verifyType(var_name, 'var_name');
			if (this.compiler.errorState){
				return;
			}
			var varName = var_name[0];
			var_name[0]();
			console.log(this.target.variables)
			var variable = this.target.variables[varName()];
			return (variable.length === 4);
		},
		convertAcqVarToVal : function () {
		
			var var_name = this.state.acquiredTerms.pop();
			this.compiler.verifyType(var_name, 'var_name');
			if (this.compiler.errorState){
				return;
			}
			
			var varName = var_name[0]
			var variable;
			if (varName().split('@').length === 2){
				variable = this.target.variables[varName().split('@')[0]][0][0];
			} else {
				var variable = this.target.variables[varName()];
			}

			if (variable === undefined){
				this.state.term = varName(); 
				this.methods.makeError('202');
				return;
			} else {
				console.log(variable);
			}
			var varType = variable[1];

			const valFunc = function () {
			
				if (varName().split('@').length === 1){
					var variable = this.variables[varName()];
					return variable[0]
				} else if (varName().split('@').length === 2){
					var arr_name = varName().split('@')[0];
					var index = parseInt(varName().split('@')[1]);
					if (Number.isNaN(index)){
						console.warn("somehow... array index is NaN...")
						return;
					}
					
					var variable = this.variables[arr_name][0][index]
					if (!variable){
						this.throwError(`illegal reference: ${arr_name}:${index} is undefined: line ${this.currentLine}`);
						return;
					}
					return variable[0];
				}
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

			var applyArgs = []
			var capArgs = constructorArray[3];
			for (var i = expectedArgTypes.length - 1; i >= 0; i--) {
				if (this.state.errorState){
					return;
				}
				this.state.expectedType = expectedArgTypes[i];
				var arg = this.parser.peekAcquiredTerm();
				this.state.acquiredType = arg[1];
				if (this.state.expectedType === 'any' && this.state.acquiredType !== 'undefined'){
					expectedArgTypes[i] = this.state.acquiredType;
					this.state.expectedType = this.state.acquiredType;
				}

				if (this.state.expectedType !== this.state.acquiredType){
					if (this.state.acquiredType === 'var_name'){
						this.compiler.convertAcqVarToVal();
						if (this.state.errorState){
							return;
						}
						arg = this.parser.peekAcquiredTerm();
						this.state.acquiredType = arg[1];
					}
				}
		
				if (this.state.expectedType === 'val'){
					if (this.state.acquiredType.split("_").length === 2 && this.state.acquiredType.split("_")[1] === 'val'){
						applyArgs.push(this.parser.popAcquiredTerm());
						continue;
					}
				}

				this.state.acquiredType = arg[1];


				if (expectedArgTypes[i] !== arg[1]){
					if (this.state.expectedType === 'bool_val'){
						this.compiler.coerceAcqToBool()
					}
				}

				arg = this.parser.peekAcquiredTerm();
				this.state.acquiredType = arg[1];

				if (this.state.expectedType !== arg[1]){
					this.methods.makeError('100');
					return;
				} else {
					applyArgs.push(this.parser.popAcquiredTerm());
				} 
			}
			applyArgs = capArgs.concat(applyArgs.reverse());

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
		
				this.state.task = "verifying line end state";
				var topOfClosureStack = this.state.closures.pop();
				var foundClosure = topOfClosureStack[0]
				if (foundClosure !== ';'){
					this.state.missingClosure = foundClosure;
					this.state.missingClosureLocation = topOfClosureStack[1];
					this.methods.makeError('50');
				};

				this.compiler.composeStack();
				if (this.state.errorState){
					return;
				}
				this.compiler.composeIfHandler();
				if (this.state.errorState){
					return;
				}
				this.compiler.allocateMemory();
				if (this.state.errorState){
					return;
				}
				this.compiler.compileLine();
				if (this.state.errorState){
					return;
				}
				if (this.parser.peekNextChar() === undefined){
					this.state.end = true;
					this.target.lastLine = this.state.currentLine;
					this.compiler.allocateVariableMemory();
					this.compiler.finalizeMemoryAllocation();
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
				if (this.state.errorState){
					return;
				}
				if (varType.split('_').length === 1){
					this.parser.pushConstructorFunction('assign', [`${varType}_val`], 0 );
					this.compiler.captureLastArg();
					return;
				} else if (varType.split('_').length === 2){
					if (varType.split('_')[1] === 'arr'){
						this.parser.pushConstructorFunction('assign', [varType], 0);
						this.compiler.captureLastArg();
					}
				}
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
					this.state.acquiredType = assType;
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
				if (!this.parser.checkForAcqTerms()){
					this.parser.pushConstructorFunction('negate', ['num_val']);
					return;
				}
				var assignee = this.parser.peekAcquiredTerm();
				var assType = assignee[1];
				if (assType = "var_name"){
					this.compiler.convertAcqVarToVal();
					assignee = this.parser.peekAcquiredTerm();
					assType = assignee[1];
				}
				if (assType !== 'num_val'){
					this.state.operator = "-"
					this.state.acquiredType = assType;
					this.methods.makeError('097');
					return;
				}
				this.parser.pushConstructorFunction(`num_sub`, ["num_val"]);
				this.compiler.captureLastArg();
				this.state.expectedArgs.push("num_val");
				return;
			},
			"*" : function () {
				if (!this.parser.checkForAcqTerms()){
					this.state.expectedType = "num_val";
					this.methods.makeError('051');
					return;
				}
				var assignee = this.parser.peekAcquiredTerm();
				var assType = assignee[1];
				if (assType = "var_name"){
					this.compiler.convertAcqVarToVal();
					assignee = this.parser.peekAcquiredTerm();
					assType = assignee[1];
				}
				if (assType !== 'num_val'){
					this.state.operator = "*"
					this.state.acquiredType = assType;
					this.methods.makeError('097');
					return;
				}
				this.parser.pushConstructorFunction(`num_mul`, ["num_val"]);
				this.compiler.captureLastArg();
				this.state.expectedArgs.push("num_val");
				return;
			},
			"/" : function () {
				if (!this.parser.checkForAcqTerms()){
					this.state.expectedType = "num_val";
					this.methods.makeError('051');
					return;
				}
				var assignee = this.parser.peekAcquiredTerm();
				var assType = assignee[1];
				if (assType = "var_name"){
					this.compiler.convertAcqVarToVal();
					assignee = this.parser.peekAcquiredTerm();
					assType = assignee[1];
				}
				if (assType !== 'num_val'){
					this.state.operator = "/"
					this.state.acquiredType = assType;
					this.methods.makeError('097');
					return;
				}
				this.parser.pushConstructorFunction(`num_div`, ["num_val"]);
				this.compiler.captureLastArg();
				this.state.expectedArgs.push("num_val");
				return;

			},
			"%" : function () {
				if (!this.parser.checkForAcqTerms()){
					this.state.expectedType = "num_val";
					this.methods.makeError('051');
					return;
				}
				var assignee = this.parser.peekAcquiredTerm();
				var assType = assignee[1];
				if (assType = "var_name"){
					this.compiler.convertAcqVarToVal();
					assignee = this.parser.peekAcquiredTerm();
					assType = assignee[1];
				}
				if (assType !== 'num_val'){
					this.state.operator = "%"
					this.state.acquiredType = assType;
					this.methods.makeError('097');
					return;
				}
				this.parser.pushConstructorFunction(`num_rem`, ["num_val"]);
				this.compiler.captureLastArg();
				this.state.expectedArgs.push("num_val");
				return;
			},
			'(' : function () {
				//open new paren Closure
			},
			')' : function () {
				//close last paren closure
			},
			"==" : function () {
				//bool equivaelnce op
				if (!this.parser.checkForAcqTerms()){
					this.state.expectedType = "expression";
					this.methods.makeError('051');
					return;
				}
				
				/*This needs to be a general value function... 
				just takes 2 values... therefore, need a general val sieve*/
				var expression = this.parser.peekAcquiredTerm();
				if (expression[1] === "var_name"){
					this.compiler.convertAcqVarToVal();
					expression = this.parser.peekAcquiredTerm();
				}

				this.parser.pushConstructorFunction('equivalence', ["val"]);
				this.compiler.captureLastArg();
				this.state.expectedArgs.push("val");
			},
			">" : function () {
				if (!this.parser.checkForAcqTerms()){
					this.state.expectedType = "expression";
					this.methods.makeError('051');
					return;
				}
				var expression = this.parser.peekAcquiredTerm();
				if (expression[1] === "var_name"){
					this.compiler.convertAcqVarToVal();
					expression = this.parser.peekAcquiredTerm();
				}
				if (expression[1] !== 'num_val'){
					this.state.operator = ">";
					this.state.acquiredType = expression[1];
					this.methods.makeError('097');
				}
				this.parser.pushConstructorFunction('gthan', ['num_val']);
				this.compiler.captureLastArg();
				this.state.expectedArgs.push('any');

			},
			"<" :function () {
				if (!this.parser.checkForAcqTerms()){
					this.state.expectedType = "expression";
					this.methods.makeError('051');
					return;
				}
				var expression = this.parser.peekAcquiredTerm();
				if (expression[1] === "var_name"){
					this.compiler.convertAcqVarToVal();
					expression = this.parser.peekAcquiredTerm();
				}
				if (expression[1] !== 'num_val'){
					this.state.operator = "<";
					this.state.acquiredType = expression[1];
					this.methods.makeError('097');
				}
				this.parser.pushConstructorFunction('lthan', ['num_val']);
				this.compiler.captureLastArg();
				this.state.expectedArgs.push('any');

			},
			">=" : function () {
				if (!this.parser.checkForAcqTerms()){
					this.state.expectedType = "expression";
					this.methods.makeError('051');
					return;
				}
				var expression = this.parser.peekAcquiredTerm();
				if (expression[1] === "var_name"){
					this.compiler.convertAcqVarToVal();
					expression = this.parser.peekAcquiredTerm();
				}
				if (expression[1] !== 'num_val'){
					this.state.operator = ">=";
					this.state.acquiredType = expression[1];
					this.methods.makeError('097');
				}
				this.parser.pushConstructorFunction('geqthan', ['num_val']);
				this.compiler.captureLastArg();
				this.state.expectedArgs.push('any');

			},
			"<=" : function () {
				if (!this.parser.checkForAcqTerms()){
					this.state.expectedType = "expression";
					this.methods.makeError('051');
					return;
				}
				var expression = this.parser.peekAcquiredTerm();
				if (expression[1] === "var_name"){
					this.compiler.convertAcqVarToVal();
					expression = this.parser.peekAcquiredTerm();
				}
				if (expression[1] !== 'num_val'){
					this.state.operator = "<=";
					this.state.acquiredType = expression[1];
					this.methods.makeError('097');
				}
				this.parser.pushConstructorFunction('leqthan', ['num_val']);
				this.compiler.captureLastArg();
				this.state.expectedArgs.push('any');

			},
			"!=" : function () {
				if (!this.parser.checkForAcqTerms()){
					this.state.expectedType = "expression";
					this.methods.makeError('051');
					return;
				}
				var expression = this.parser.peekAcquiredTerm();
				if (expression[1] === "var_name"){
					this.compiler.convertAcqVarToVal();
					expression = this.parser.peekAcquiredTerm();
				}
				this.parser.pushConstructorFunction('notEquivalence', ['val']);
				this.compiler.captureLastArg();
				this.state.expectedArgs.push('any');

			},
			"!" : function () {
				this.parser.pushConstructorFunction('not', ['bool_val']);
				/*
					might wanna replace this with an any? dunno...
				*/
				this.state.expectedArgs.push('bool_val');
		
				return;
			},
			"||" : function () {
				if (! this.parser.checkForAcqTerms()){
					this.state.expectedType = "expression";
					this.methods.makeError('051');
					return;
				}
				var expression = this.parser.peekAcquiredTerm();
				if (expression[1] !== 'bool_val'){
					if (expression[1] === 'var_name'){
						this.compiler.convertAcqVarToVal();
					}
					this.compiler.coerceAcqToBool();
					expression = this.parser.peekAcquiredTerm();
				}
				if (expression[1] !== 'bool_val'){
					this.state.task = "prepping boolean operator or";
					this.state.acquiredType = expression[1];
					this.state.expectedType = 'bool_val';
					this.methods.makeError('100');
					return;
				}
				this.parser.pushConstructorFunction('or',['bool_val']);
				this.compiler.captureLastArg();
				this.state.expectedArgs.push('bool_val');

			},
			"&&" : function () {
				if (! this.parser.checkForAcqTerms()){
					this.state.expectedType = "expression";
					this.methods.makeError('051');
					return;
				}
				var expression = this.parser.peekAcquiredTerm();
				if (expression[1] !== 'bool_val'){
					if (expression[1] === 'var_name'){
						this.compiler.convertAcqVarToVal();
					}
					this.compiler.coerceAcqToBool();
					expression = this.parser.peekAcquiredTerm();
				}
				if (expression[1] !== 'bool_val'){
					this.state.task = "prepping boolean operator and";
					this.state.acquiredType = expression[1];
					this.state.expectedType = 'bool_val';
					this.methods.makeError('100');
					return;
				}
				this.parser.pushConstructorFunction('and',['bool_val']);
				this.compiler.captureLastArg();
				this.state.expectedArgs.push('bool_val');

			},
			":" : function () {
				this.state.task = "prepping token array index"
				if (!this.parser.checkForAcqTerms()){
					this.state.expectedType = "arr_var_name";
					this.methods.makeError('051');
					return;
				};
				var expression = this.parser.peekAcquiredTerm();
				if (expression[1] !== 'var_name' && expression[1] !== 'str_arr' && expression[1] !== 'num_arr'){
					this.state.acquiredType = expression[1];
					this.state.expectedType = 'arr_var_name';
					this.methods.makeError('102');
					return;
				};
				if (expression[1] === 'var_name' && this.compiler.checkAcqVarIsArr()){
					this.parser.pushConstructorFunction('arr_index', ['num_val']);
					this.compiler.captureLastArg();
					this.state.expectedArgs.push('num_val');
				} else if (expression[1] === 'str_arr' || expression[1] === 'num_arr') {
					this.parser.pushConstructorFunction('anon_arr_index', ['num_val']);
					this.compiler.captureLastArg();
					this.state.expectedArgs.push('num_val');
				} else {
					this.methods.makeError('006');
					return;
				}
			}

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
			bool : function () {
				this.parser.pushConstructorFunction('bool_var', ['var_name'])
				this.state.expectedArgs.push("var_name");
				return;
			},
			arr_str : function () {
				this.parser.pushConstructorFunction('str_arr', ['var_name', 'num_val']);
				this.state.expectedArgs.push('num_val');
				this.state.expectedArgs.push('var_name');
				return;
			},
			arr_num : function () {
				this.parser.pushConstructorFunction('num_arr', ['var_name', 'num_val']);
				this.state.expectedArgs.push('num_val');
				this.state.expectedArgs.push('var_name');
				
				return;
			},
			goto : function () {
				this.parser.pushConstructorFunction('goto', ['num_val'])
				this.state.expectedArgs.push('num_val');
				return;
			},
			if : function () { 
				this.compiler.populateIfHandler();
				
				return;
			},
			then : function () {
				if (this.state.ifHandler.length === 0){
					this.methods.makeError('030');
					return;
				}
				if (this.state.constructorFunctions.length > 0){
					this.compiler.composeTopConstructor();
				}
	
				this.compiler.captureLastArgIf(0);
				return;
			},
			else : function () {
				if (this.state.ifHandler.length === 0){
					this.methods.makeError('031');
					return;
				}
				if (this.state.constructorFunctions.length > 0){
					this.compiler.composeTopConstructor();
				}
				this.compiler.captureLastArgIf(1);
				return;
			},
			end : function () {
				this.parser.pushConstructorFunction('end', [], 0);
				return;
			},
			true : function () {
				this.state.parseType = 'true'
				this.parser.pushAcquiredTerm();

			},
			false : function () {
				this.state.parseType = 'false'
				this.parser.pushAcquiredTerm();
			},
			size_of : function () {
				this.parser.pushConstructorFunction('size_of', ['any'])
				this.state.expectedArgs.push('any');
				return;
			},
			inputS : function () {
				this.parser.pushConstructorFunction('inputS', ['var_name']);
				this.state.expectedArgs.push('any');
				return;
			},
			printS : function () {
				this.parser.pushConstructorFunction('printS', ['str_val'])
				console.warn('changed expectation on printS in resTerm Router from "str_val" to "any"')
				this.state.expectedArgs.push('any');
				//debugger;
				return;
			},
			printN : function () {
				this.parser.pushConstructorFunction('printN', ['num_val'])
				console.warn('changed expectation on printN in resTerm Router from "num_val" to "any"')
				this.state.expectedArgs.push('any');
		
				return;
			},
			printB : function () {
				this.parser.pushConstructorFunction('printB', ['bool_val']);
				this.state.expectedArgs.push('bool_val');
				
				return;
			},
			tmv : function () {
				this.parser.pushConstructorFunction('tmv', ['str_val']);
				this.state.expectedArgs.push('any');
			},
			mv : function () {
				console.warn('not done yet');
				this.parser.pushConstructorFunction('mv', ['str_val']);
				this.state.expectedArgs.push('str_val');
			},
			lk : function () {
				this.state.parseType = 'lk';
				this.parser.pushAcquiredTerm();
				if (this.parser.peekNextChar() === ':'){
					this.state.term = this.parser.getNextChar();
					this.parser.tokenRouter[this.state.term]();
				};
			},
			this_node : function () {
				this.state.parseType = 'this_node';
				this.parser.pushAcquiredTerm();
				if (this.parser.peekNextChar() === ':'){
					this.state.term = this.parser.getNextChar();
					this.parser.tokenRouter[this.state.term]();
				};
			},
			trmnl_node : function () {
				this.state.parseType = 'trmnl_node';
				this.parser.pushAcquiredTerm();
				if (this.parser.peekNextChar() === ':'){
					this.state.term = this.parser.getNextChar();
					this.parser.tokenRouter[this.state.term]();
				};
			},
			reel : function () {
				this.state.parseType = 'reel';
				this.parser.pushAcquiredTerm();
			},
			wait : function () {
				this.parser.pushConstructorFunction('wait', ['num_val']);
				this.state.expectedArgs.push('any');
			},


		},
		nameTermFinalizers : {
			var_name : function (bool) {
				this.state.skipPush = bool;
				if (this.state.constructorFunctions.length === 0){
					this.compiler.verifyValidVarName();
				}
				if (this.state.errorState){
					return;
				}
				this.parser.pushAcquiredTerm();

				if (this.parser.peekNextChar() === ':'){
					this.state.term = this.parser.getNextChar();
					this.parser.tokenRouter[this.state.term]();
				};
				return;
			},
			res_term : function (bool) {
				this.state.skipPush = bool;
				this.parser.reservedTermsRouter[this.state.term]();
				return;
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
				if (this.state.errorState){
					return;
				}
			
				var term = this.state.term

				var lineNum = parseInt(term);
				if (this.target.lines[lineNum] !== undefined){
					this.methods.makeError('003');
				} else {
					var allLines = Object.keys(this.target.lines);
					if (allLines.length === 0){
						if (lineNum !== 0){
							this.state.currentLine = lineNum;
							this.methods.makeError('009');
							return;
						}
					} else {
						var lastLine = allLines[allLines.length - 1];
						console.log(allLines)
						var lastLineInt = parseInt(lastLine);
						if (lineNum < lastLineInt){
							this.state.currentLine = lineNum;
							this.methods.makeError('008');
							return;
						}

					}
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

				if (this.state.errorState){
					return;
				}

				this.parser.pushAcquiredTerm();

				if (this.parser.peekNextChar() === ':'){
					this.state.term = this.parser.getNextChar();
					this.parser.tokenRouter[this.state.term]();
				};
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

				if (this.state.errorState){
					return;
				}

				if (this.state.skipPush){
					this.state.skipPush = false;
				} else {
					this.parser.pushAcquiredTerm();
					if (this.parser.peekAcquiredTerm()[1] === 'var_name'){
						this.compiler.convertAcqVarToVal();
					}
				}
				return;
			},
			num_val : function () {
				this.state.task = "parsing numerical value";
				this.state.parseType = "num_val";
				this.state.initialChars = this.dataTables.numChars;
				this.state.acceptableChars = this.dataTables.numChars;
				this.state.terminalChars = this.dataTables.strictRuleTerminators;
				this.parser.parseSpecific();
				if (this.state.errorState){
					return;
				}

				if (this.state.skipPush){
					this.state.skipPush = false;
				} else {
					this.parser.pushAcquiredTerm();
				}
				return;
			},

			
			token : function () {
				this.state.task = "parsing token";
				this.state.parseType = "token";
				this.state.initialChars = this.dataTables.tokenInitials;
				this.state.acceptableChars = this.dataTables.tokenNonInitials;
				this.state.terminalChars = this.dataTables.tokenTerminators;
				this.parser.parseSpecific();
				if (this.state.errorState){
					return;
				}

				this.parser.tokenRouter[this.state.term]();
			},
			name_term : function () {
				this.state.task = "parsing named term";
				this.state.parseType = "name_term";
				this.state.initialChars = this.dataTables.varNameInitials;
				this.state.acceptableChars = this.dataTables.varNameChars;
				this.state.terminalChars = this.dataTables.varNameTerminators;
				this.parser.parseNamedTerm();
				if (this.state.errorState){
					return;
				}

				if (this.state.parseType === "var_name"){
					this.parser.pushAcquiredTerm();
					return;
				} else if (this.state.parseType === "res_term"){
					this.parser.reservedTermsRouter[this.state.term]();
				}
			},
			/*
			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
							Vague specifiers? 
			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			*/
			any : function () {
				this.state.task = "parsing next term";
				this.parser.parseGenericTerm();
				return;
			},

			val : function () {
				this.state.task = "parsing value";
			
				this.parser.parseGenericTerm();
				if (this.state.errorState){
					return;
				}

				if (this.state.parseType === "token"){
					//may need a bypass in here for parenthesis;
					this.methods.makeError('052');
					return;
				}

				if (this.state.parseType === "res_term"){
					this.methods.makeError('053');
					return;
				}


				var acqTerm = this.parser.peekAcquiredTerm();

				if (acqTerm[1] === 'var_name'){
					this.compiler.convertAcqVarToVal();
					acqTerm = this.parser.peekAcquiredTerm();
				};

				return;
			},
			bool_val : function () {
				this.parser.specificRouter['val']();
				this.state.task = "parsing boolean value";

				this.compiler.coerceAcqToBool();

				/*
				might want som e kind of light typechecking sieve in here? 
				I dunno, seems a little bare/dependant on compiler type coercion, 
				but hey... it's working on singular bool values

				UPDATE: delegate to valfunc, then coerce to bool...
				this should ensure that type is value, then bool always
				(or err throw in val subroutine)? 

				Will need to verify this works;
				*/
				
				return;
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
						return;
						term += prgm.parser.getNextChar();
						//I think this should route to parseNamedTerm?
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
			} 
			if (prgmEnd){
				return;
			}
			//this.state.term = term;
			return this.parser.parseNamedTerm();

			if (acceptableTerms.includes(term)){
				this.state.parseType = 'res_term';
				this.parser.reservedTermsRouter[term]()
			} else if (definedVariables.includes(term)){
				this.state.parseType = 'var_name';
				/*

				currently, the compiler is functioning with this 
				bottom section as the spill-over

				while I believe that this function would do better
				to route to parseNamed term instead of allowing the
				general parse to poop out varnames and resterms

				Problem is above marked with comment

				this push may be pre-emptory... 
				*/
				this.parser.pushAcquiredTerm();
			} else {
				
				this.methods.makeError('999')
				return;
			}
			console.log(term, this.state.parseType)
		},
		parseNamedTerm : function (shouldSkipPush) {
		
			this.state.term = "";
			this.state.acceptableChars = this.dataTables.varNameChars;
			this.state.initialChars = this.dataTables.varNameChars;
			this.state.terminalChars = this.dataTables.strictRuleTerminators;
			var reservedTerms = Object.keys(this.parser.reservedTermsRouter);
			var parseAsVarName = false;
			var prgm = this;

			const termBuilder = function (term, numCount) {
				if (prgm.state.parseString.substring(0,5) === "names"){
					
				}
				if (!numCount && numCount !== 0){
					numCount = -1;
				};
				numCount += 1;
				if (numCount >= 1023){
					prgm.methods.makeError('900')
					return;
				};
				if (reservedTerms.length === 0 && parseAsVarName === false){
					prgm.state.parseType = 'var_name'
					parseAsVarName = true;
				};
				if (term.length === 0){
					var char = prgm.parser.peekNextChar();
					if (char === " "){
						prgm.parser.getNextChar();
						return termBuilder(term, numCount);
					}
					if (!prgm.state.initialChars.includes(char)){
						prgm.state.term = prgm.parser.getNextChar();
						console.log(char)
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
							prgm.state.parseType = 'var_name'
							term = term + prgm.parser.getNextChar();
							return termBuilder(term, numCount);
						}
						term = term + prgm.parser.getNextChar();
						return termBuilder(term, numCount);
					} else {
						if (prgm.state.terminalChars.includes(char)){
						
							return term;
						} else if (prgm.state.parseString.length === 0) {
							prgm.state.end = true;
							
							return term;
						} else {
							console.log(prgm.state.terminalChars);
					
							prgm.parser.getNextChar();
							prgm.methods.makeError('001');
							return;
						}
					}

				}
			}
			var term = termBuilder(this.state.term)
			if(this.state.errorState){
				return;
			}
			if (parseAsVarName){
				this.state.parseType = 'var_name'
				this.state.term = term;
			} else {
				if (Object.keys(this.parser.reservedTermsRouter).includes(term)){
					this.state.parseType = 'res_term'
					this.state.term = term;
				} else {
					this.state.parseType ='var_name';
					this.state.term = term;
					/*this.methods.makeError('995');*/
				}
			}
			if (this.state.errorState){
				return;
			}
			console.log(term, this.state.parseType)
			if (shouldSkipPush){
				this.parser.nameTermFinalizers[this.state.parseType](true);
			} else {
				this.parser.nameTermFinalizers[this.state.parseType](false);
			}
			return;

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
							prgm.state.includeTerminator = false;
							term += prgm.parser.getNextChar();
							return termBuilder(term, numCount)
						} else {
							if (!prgm.dataTables.varNameInitials.includes(char)){
								prgm.parser.getNextChar();
								prgm.methods.makeError('000');
								return;
							}
							var substrIndex = prgm.state.parseString.indexOf(' ');
							if (substrIndex === -1){
								substrIndex = prgm.state.parseString.indexOf(':');
							} else {
								if (prgm.state.parseString.indexOf(':') >= 0){
									substrIndex = Math.min(prgm.state.parseString.indexOf(':'), substrIndex);
								}
							}
							if (substrIndex === -1){
								substrIndex = prgm.state.parseString.indexOf(';');
							} else {
								if (prgm.state.parseString.indexOf(';') >= 0){
									substrIndex = Math.min(prgm.state.parseString.indexOf(';'), substrIndex);
								}
							}
							if (substrIndex === -1){
								prgm.methods.makeError(`SHITCODE`);
								return;
							}
							console.log(substrIndex)
							prgm.state.term = term + prgm.state.parseString.substring(0, substrIndex);
							console.log(prgm.state.term)
							prgm.methods.makeError('200');
							return prgm.state.term;
						}
					
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
					
						return term;
					} else if (prgm.state.parseString.length === 0){
						prgm.state.end = true;
						
						return term;
					} else {
						console.log(prgm.state.terminalChars);
						prgm.parser.getNextChar();
						prgm.methods.makeError('001')
						return ;
					}
					
				}

			}
			term = termBuilder(term);
			console.log(term, this.state.parseType)
			if (term === 'digits'){
		
			}
			this.state.term = term;
			if (parseAsVariable){
				if (Object.keys(this.target.variables).includes(term)){
					var parseType = this.state.parseType
					this.state.parseType = 'var_name';
					this.parser.nameTermFinalizers[this.state.parseType](true);
					/*
					this.parser.pushAcquiredTerm();
					this.compiler.convertAcqVarToVal();
					var convertedValue = this.parser.peekAcquiredTerm();
					if (parseType !== convertedValue[1]){
					
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
			this.state.task = `fetching type for ${varName}`
			var isInArray = false;
			console.log(varName);
			
			if (varName.split('@').length === 2){
				isInArray = true;
				varName = varName.split('@')[0];
			}
			var variable = this.target.variables[varName]
			if (variable === undefined){
				this.state.term = varName;
				this.methods.makeError('202');
				return;
			}
			var type = variable[1];
			if (isInArray){
				type = variable[0][0][1];
			}

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
			if (this.state.term !== ';'){
				this.methods.makeError('020');
				return;
			}
			if (this.state.forStack.length > 0){
				this.methods.makeError('060');
				return;
			};
			if (this.state.whileStack.length > 0){
				this.methods.makeError('061');
				return;
			};
			if (Object.keys(this.target.lines).length === 0){
				this.methods.makeError('007');
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
				this.parser.verifyEndConditions();
				if (this.state.errorState){
					return this.parser.parse();
				}
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
					target.memory = 2396;
					target.errorState = false;
					target.errorMessage = "";
					target.end = false;
					target.loopCount = false;
					target.currentLine = 0;
					target.nextLine = -1;
					target.lastLine = 0;
					target.variables = {};
					target.lines = {};
					target.activeNode = {};
					target.visitedNodes = [];
				}
				target.ex = function (trmnl) {
					var prgm = this
					console.log(this);
					prgm.api = trmnl.api;
					var api = prgm.api;
					prgm.activeNode = trmnl.activeNode;
					api.declareExecutableRuntime();
					api.readyCommand('stop');
					prgm.lines[0](); 
					var executableLoop = function () {
						
						if (prgm.end){
							return;
						}
						if (prgm.api.stall){
							return;
						}
						if (prgm.api.halt){
							prgm.end = true;
							return;
						}
						if (prgm.loopCount >= 1000000){
							prgm.errorState = true;
							prgm.errorMessage = "loop iteration exceeded max buffer space. Cannot proceed."
							return;
						};
						if (prgm.nextLine === -1){
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
							if (prgm.end){
								prgm.end = false;
								api.log(`${prgm.name} reached "END" on line ${prgm.currentLine}`);
								prgm.currentLine = 0;
								prgm.nextLine = -1;
								api.deleteDrawTriggeredFunctions(`${prgm.name}`);
								api.renounceExecutableRuntime();
								api.unReadyCommand('stop');
								return;
							};
							if (prgm.errorState){
								api.throwError(prgm.errorMessage);
								prgm.errorState = false;
								prgm.end = false;
								prgm.errorMessage = "";
								prgm.currentLine = 0;
								prgm.nextLine = -1;
								api.deleteDrawTriggeredFunctions(`${prgm.name}`);
								api.renounceExecutableRuntime();
								api.unReadyCommand('stop');
								return;
							};
							for (var i = 0; i < iterations; i++){
								executableLoop();
							}
						}
						return returner;
					}

				prgm.api.addDrawTriggeredFunction(setTicksPerDraw(8), `${prgm.name}`);
				};
				target.executeNextLine = function (currentLine) {
					var prgm = this;
			
				
					var foundLine = false;
					for (var i = prgm.currentLine; i <= prgm.lastLine; i++) {
						if (prgm.lines[i] && i !== prgm.currentLine){
							prgm.currentLine = i;
							prgm.nextLine = -1;
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
				target.throwError = function (string) {
					var prgm = this;
					prgm.errorState = true;
					prgm.errorMessage = string;
					return;
				};
				target.executeLineAt =  function (lineTarget) {
					var prgm = this;
					if (prgm.lines[lineTarget]){
						prgm.currentLine = lineTarget;
						prgm.nextLine = -1;
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
			this.target = targetConstructor(name);
			this.target.activeNode = this.api.getActiveNode();
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
					state.ifHandler = [];
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
			text = text.split('\\n').join('').split('\\t').join('').split('\n').join('').split('\t').join('').split('\\').join('');
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
			var error = `wmtCompiler.MASM threw errorCode ${this.state.errorCode}: (${this.errorMessages[this.state.errorCode]()})`;
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
				var activeNode = prgm.api.getActiveNode();

				var newName = wormTongueFileName.split('.')[0] + '.ex';
				var accessibleNodes = this.api.getAccessibleNodes();
				var accessibleNodesList = Object.keys(accessibleNodes);
				if (accessibleNodesList.includes(newName)){
					/*Might wanna put an overwrite verify here?*/
					this.api.requestKernelAccess('(wmt_compiler.MASM) requests Seed access to replace an existing executable with a re-compiled version, grant access?(y/n)', function(kernel){
						var executableTrueAddress = accessibleNodes[newName].getTrueAddress();
						var text = prgm.state.fullInputString;
						prgm.api.log(' (_Seed) access granted... overwriting node...')
						try {
							kernel.updateUserExecutable(newName, text, executableTrueAddress, executable);
						} catch (error) {
							prgm.api.throwError(` (_Seed) cmd_rjct: #1F44B4`);
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
						prgm.api.log(` (_Seed) ${finalDocName} replaced with re-compiled executable`);
					}, function(kernelReject){
						prgm.api.log(` (_Seed) api_axs_rjct: #0000B6`);
						prgm.api.log(` (wmt_compiler.MASM) Seed access required to instantiate new nodes. Aborting "compile"...`);
					})
					return;
				}

				this.api.requestKernelAccess('(wmt_compiler.MASM) requests Seed access to instantiate new executable, grant access?(y/n)', function(kernel){
					
					var activeNodeTrueAddress = activeNode.getTrueAddress();
					prgm.api.log(' (_Seed) access granted... creating node...');
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
					prgm.api.log(` (wmt_compiler.MASM) Seed access required to instantiate new nodes. Aborting "compile"...`);
				})
			},

		},
	},
	ex : function (nodeName) {

		console.log(`YOU'RE GOING TO NEED INPUT REQUESTS IN HERE TO ENSURE A VALUE`)


		this.methods.prepAll(nodeName);
		this.methods.compile();
	},
	backDoorCompile : function (name, text) {
		var dummyApi = {
			log : function (text) {console.log(text)},
			throwError : function (text) {console.warn(`Error: ${text}`)},
			warn : function (text) {console.warn(text)},
			getActiveNode : function () { 
				var output = { 
					name : 'dummy', 
					assembleVisibleAdjacencies : function () {},
					assembleAccessibleNodes : function () {},
					visibleAdjacencies : {},
					getTrueAddress : function () { return 0 }, 
					address: "000000000000000000",
				}
				return output;
			},
		}
		this.api = dummyApi;
		
		Object.keys(this.methods).forEach(function(methodName){
			if (typeof this.methods[methodName] === 'function'){
				this.methods[methodName] = this.methods[methodName].bind(this)
			}
		}, this);
		Object.keys(this.parser).forEach(function(routerFunctionName){
			if (typeof this.parser[routerFunctionName] === 'function'){
				this.parser[routerFunctionName] = this.parser[routerFunctionName].bind(this);
			} else if (routerFunctionName === 'specificRouter' || routerFunctionName === 'nameTermFinalizers' || routerFunctionName === 'tokenRouter' || routerFunctionName === 'reservedTermsRouter'){
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

		this.methods.initializeState(text);
		this.methods.initializeNewTarget(name);
		return this.parser.parse();


	},
	setAPI : function (api) {
		this.api = api;
		return;
	},
	setData : function (data) {
		this.data = data;
		return;
	},
	setSettings : function (settings) {
		this.settings = settings;
		return;
	},
	install : function (trmnl, callback) {
		this.trmnl = trmnl;
		trmnl.programs[this.name] = this;
		this.api = trmnl.api;
		//this.compiler.api = this.api;

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
			} else if (routerFunctionName === 'specificRouter' || routerFunctionName === 'nameTermFinalizers' || routerFunctionName === 'tokenRouter' || routerFunctionName === 'reservedTermsRouter'){
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
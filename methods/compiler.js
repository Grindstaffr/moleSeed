export const compilerBuilder = function (parent) {
	const compiler = {};
	const init = function (parent) {
		compiler.parent = parent;
		compiler.api = parent.api;
		compiler.command = parent.command;
		compiler.buffer = {
			syntax : {
				raw : "",
				cmd : "",
				args : [],
				requiredArgs : [],
				optionalArgs : [],
			},
			userInput : {
				raw : "",
				command : "",
				arguments : [],
				argTypes : [],
			},
			earlyReturn : false,
			errorMessage : "",
			earlyReturn : false,
			messages : {
				typeCheckErrors : {},
			}
		};
		compiler.addOns = [
			{
				name : "input_type_checker",
				memoryUsage : 1624,
				func : function () {
					console.log('do some stuff')
				}.bind(compiler),
			},
			{
				name : "input_auto_fill",
				memoryUsage : 3096,
				func : function () {
					console.log('do some stuff')
				}.bind(compiler),
			}
		];

		compiler.functionQueue = [
		];
	};

	compiler.installAddOn = function (funcObj) {
		if (typeof funcObj.func !== "function"){
			this.api.throwError(`parserAddOn installation failure: addOn corrupted.`)
			console.log(funcObj)
			return;
		}
		funcObj.func.bind(this);
		if (funcObj.installer && (typeof funcObj.installer === "function")){
			funcObj.installer(this);
		}
		compiler.addOns.push(funcObj)
	}

	compiler.uninstallAddon = function (addOnName){
		var foundAddOn = false;
		var addOnIndex = -1;
		compiler.addOns.forEach(function(addOn, index){
			if (foundAddOn){
				return;
			}
			if (addOn.name === addOnName){
				foundAddOn = true;
				addOnIndex = index;
				return;
			} else {
				return;
			}
		});
		if (!foundAddOn){
			this.api.throwError(`cannot uninstall ${addOnName}: parser addOn not found.`)
			return;
		} else {
			this.addOns = this.addOns.splice(addOnIndex, 1);
			this.api.log(`${addOnName} uninstalled successfully: parser memory usage now ${this.fetchMemoryUsage()}`)
		}
	}

	compiler.fetchAddOns = function (){
		return this.addOns;
	}

	compiler.fetchMemoryUsage = function () {
		var memoryUsage = this.memoryUsage;
		this.addOns.forEach(function(addOn){
			if (!addOn.memoryUsage){
				var str = JSON.stringify(addOn)
				addOn.memoryUsage = (str.length * 16);
				addOn.memoryUsage = addOn.memoryUsage * 8;
			}
			memoryUsage = memoryUsage + addOn.memoryUsage;
		});
		return memoryUsage;
	}

	compiler.parseInput = function (userInput) {

		this.prepUserBuffer(userInput);

		this.checkCommand();

		if (this.buffer.earlyReturn){
			console.log('returnEarly')
			if (this.buffer.errorState){
				console.log('errorState')
				this.returnEarly();
				return this.handleError();
			};
			this.resetBuffer();
			return this.returnEarly();
		};

		this.fetchSyntax();

		if (this.buffer.earlyReturn){
			if (this.buffer.errorState){
				this.returnEarly();
				return this.handleError();
			};
			this.resetBuffer();
			return this.returnEarly();
		};

		this.parseSyntax();

		if (this.buffer.earlyReturn){
			if (this.buffer.errorState){
				this.returnEarly();
				return this.handleError();
			};
			this.resetBuffer();
			return this.returnEarly();
		};

		this.shallowSyntaxCompare();

		if (this.buffer.earlyReturn){
			if (this.buffer.errorState){
				this.returnEarly();
				return this.handleError();
			};
			this.resetBuffer();
			return this.returnEarly();
		};

		compiler.addOns.forEach(function(addOn){
			addOn.func();
			if (this.buffer.earlyReturn){
				if (this.buffer.errorState){
					this.returnEarly();
					return this.handleError();
				};
				this.resetBuffer();
			return this.returnEarly();
			};
		}, this)

		this.deepSyntaxCompare();

		if (this.buffer.earlyReturn){
			if (this.buffer.errorState){
				this.returnEarly();
				return this.handleError();
			};
			this.resetBuffer();
			return this.returnEarly();
		};

		this.executeCommand();
		this.resetBuffer();
	};

	compiler.resetBuffer = function () {
		this.buffer = {
			syntax : {
				raw : "",
				cmd : "",
				args : [],
				requiredArgs : [],
				optionalArgs : [],
			},
			userInput : {
				raw : "",
				command : "",
				arguments : [],
				argTypes : [],
			},
			earlyReturn : false,
			errorMessage : "",
			earlyReturn : false,
			messages : {
				typeCheckErrors : {},
			}
		};
	}.bind(compiler)

	compiler.prepUserBuffer = function (userInput) {
		this.buffer.userInput.arguments = [];
		this.buffer.userInput.raw = userInput;
		var terms = userInput.split(" ");
		this.buffer.userInput.command = terms[0];
		for (var i = 1; i < terms.length; i++){
			this.buffer.userInput.arguments.push(terms[i])
		}
		return;
	};


	compiler.searchSynonyms = function () {
		var userCmd = this.buffer.userInput.command;
		var foundRealCommand = false;
		Object.keys(this.command).forEach(function(cmdName){
			var trueCmd = this.command[cmdName]
			if (foundRealCommand){
				return;
			}
			if (trueCmd.synonyms === undefined){
				return;
			}
			if (!trueCmd.synonyms){
				return;
			}
			if (!trueCmd.synonyms.length){
				return;
			}
			if (trueCmd.synonyms.length < 1){
				return;
			}
			if (trueCmd.synonyms.length >=0){
				if (trueCmd.synonyms.includes(userCmd)){
					this.buffer.userInput.command = trueCmd;
					foundRealCommand = true;
					return;
				}
				return;
			}
		}, this);
		if (!foundRealCommand){
			this.setError(`${userCmd} is not a valid command, type "help" for options`);
			this.setEarlyReturn();
			return false;
		} else {
			return true;
		}
	};

	compiler.checkCommand = function () {
		//do all errorhandling for command
		var cmd = this.buffer.userInput.command
		if (this.buffer.userInput.command === ""){
			this.command.null.ex();
			this.setEarlyReturn();
			return;
		}
		if (this.command[this.buffer.userInput.command] === undefined){
			var synFound = this.searchSynonyms();
			if ((this.command[this.buffer.userInput.command] === undefined) && !synFound){
				this.setError(`invalid syntax: "${cmd}" is not a valid command, type "help" for options`);
				return;
			}
		}
		if (this.command[this.buffer.userInput.command].isAvail === undefined){
			this.setError(`invalid syntax: "${cmd}" is not a valid command, type "help" for options`);
			return;
		}
		if (!this.command[this.buffer.userInput.command].isAvail){
			this.setError(`invalid syntax: "${cmd}" is not a valid command, type "help" for options`);
			return;
		}
		if (this.command[this.buffer.userInput.command].isBlocked){
			this.setError(this.command[this.buffer.userInput.command].blockText);
			return;
		}
	};

	compiler.fetchSyntax = function () {
		if (!this.command[this.buffer.userInput.command]){
			this.setError(`invalid syntax: "${this.buffer.userInput.command}" does not exist as a valid command, type "help" for options`);
			this.setEarlyReturn();
			return;
		}
		if (this.command[this.buffer.userInput.command].syntax === undefined){
			this.setError(`invalid syntax: declared command "${this.buffer.userInput.command}" has no client-side syntax, try another command.`)
			this.setEarlyReturn();
			return;
		}
		if (!this.command[this.buffer.userInput.command].syntax){
			this.setError(`invalid syntax: declared command "${this.buffer.userInput.command}" has no client-side syntax, try another command.`)
			this.setEarlyReturn();
			return;
		}
		this.buffer.syntax.raw = this.command[this.buffer.userInput.command].syntax;
		return;
	};

	compiler.parseSyntax = function () {
		var syntaxString = this.buffer.syntax.raw;
		var syntaxTerms = syntaxString.split(" ");
		var command = syntaxTerms[0];
		var syntaxArgs = syntaxTerms.slice(1);

		const parseTerm = function (term, outputObj) {
			var output = outputObj
			if (output === undefined || !output){
				console.log('went int here')
				output = {
					type : "",
					options : [],
					complete : false,
				};
				if (term[0]==="["){
					output.type = "required";
				} else if (term[0] === "("){
					output.type = "optional";
				} else if (term === "..."){
					output.type = "deferential"
				} else {
					output.type = "literal";
				}
			}
			var substr = term.slice(1);
			var chopIndex = 0;
			
			if (substr.indexOf("/") === -1){
				if (output.type === "required"){
					output.complete = true;
					chopIndex = substr.indexOf("]");
				} else if (output.type === "optional"){
					output.complete = true;
					chopIndex = substr.indexOf(")");
				} else if (output.type === "literal"){
					output.complete = true;
					chopIndex = substr.length;
				} else if (output.type === "deferential"){
					output.complete = true;
					chopIndex = substr.length;
				}
			} else {
				chopIndex = substr.indexOf("/");
			}
			output.options.push(substr.slice(0,chopIndex));
			if (!output.complete){
				return parseTerm(substr.slice(chopIndex), output)
			}
			return output;
		}
		console.log(this.buffer.syntax.requiredArgs)
		if (syntaxArgs.length === 0){
			return;
		}

		syntaxArgs.forEach(function(string){
			if (this.buffer.errorState){
				return;
			}
			 var argObj = parseTerm(string);
			 if (argObj.type === "required"){
			 	if ((this.buffer.syntax.args.length > 0) && Object.keys(this.buffer.syntax.args[this.buffer.syntax.args.length - 1]).indexOf("o") !== -1){
			 		this.setError(`syntax_parsing_error: invalid syntax declaration: ${command} syntax must be refactored (optional arg preceding required arg)`);
			 	return;
			 	}
			 	this.buffer.syntax.args.push({"r" : argObj.options})
			 	this.buffer.syntax.requiredArgs.push(argObj.options)
			 	return;
			 } else if (argObj.type === "optional"){
			 	this.buffer.syntax.args.push({"o" : argObj.options})
			 	this.buffer.syntax.optionalArgs.push(argObj.options)
			 	return
			 } else if (argObj.type === "literal"){
			 	this.buffer.syntax.args.push({"l" : argObj.options});
			 	this.buffer.syntax.requiredArgs.push(argObj.options)
			 	return;
			 } else if (argObj.type === "deferential"){
			 	this.buffer.syntax.args.push({"d" : []});
			 	this.buffer.syntax.optionalArgs.push([]);
			 } else {
			 	this.setError(`syntax_parsing_error: invalid syntax declaration: ${command} syntax must be refactored (arg type not found)`);
			 	return;
			 }
		},this);

	};

	compiler.shallowSyntaxCompare = function () {
		if (this.buffer.userInput.arguments.length < this.buffer.syntax.requiredArgs.length){
			var message = `${this.buffer.syntax.args.length} terms`;
			if (this.buffer.syntax.args.length === 1){
				message = `${this.buffer.syntax.args.length} term`
			}
			if (this.buffer.syntax.optionalArgs.length > 0){
				if (this.buffer.syntax.requiredArgs.length === 1){
					message = `at least ${this.buffer.requiredArgs.length} term`
				}
				message = `at least ${this.buffer.requiredArgs.length} terms`
			}
			
			this.setError(`invalid syntax (not enough terms)... got ${this.buffer.userInput.arguments.length} terms, expected ${message}`);
			return;
		}
	};

	compiler.deepSyntaxCompare = function () {
		if (this.buffer.userInput.command === "rex"){
			//pass the command to the router with isRexCmd as True
		}
		this.buffer.userInput.arguments.forEach(function(argStr, index){
			if (this.buffer.errorState || this.buffer.earlyReturn){
				return;
			}
			var syntaxArgIndex = index;
			if (index > (this.buffer.syntax.args.length - 1)){
				if (!Object.keys(this.buffer.syntax.args[this.buffer.syntax.args.length - 1]).includes("d")){
					return;
				}
				syntaxArgIndex = this.buffer.syntax.args.length - 1;
			}
			var argObj = this.buffer.syntax.args[syntaxArgIndex];
			var argType = null;
			if (Object.keys(argObj).includes("r")){
				var typeCheckList = {};
				argObj.r.forEach(function(type){
					typeCheckList[type] = false;
				})
				Object.keys(typeCheckList).forEach(function(type){
					if (argType !== null){
						return;
					}
					typeCheckList[type] = this.checkAndFixType(type, argStr, index)
					if (typeCheckList[type] === true){
						argType = type;
						return;
					}
				}, this);
				if (argType === null){
					this.throwTypeCheckErrors(index);
					this.setEarlyReturn();
					return;
				} else {
					this.clearTypeCheckErrors();
				}
			};
			if (Object.keys(argObj).includes("l")){
				if (argStr !== argObj.l[0]){
					this.setTypeCheckError("literal" ,`(expected literal "${argObj.l[0]}", got "${argStr}")`)
					this.throwTypeCheckErrors(index);
					this.setEarlyReturn();
					return;
				} else {
				}

			};
			if (Object.keys(argObj).includes("o")){
				var typeCheckList = {};
				argObj.o.forEach(function(type){
					typeCheckList[type] = false;
				})
				Object.keys(typeCheckList).forEach(function(type){
					if (argType !== null){
						return;
					}
					typeCheckList[type] = this.checkAndFixType(type, argStr, index)
					if (typeCheckList[type] === true){
						argType = type;
						return;
					}
				}, this);
				if (argType === null){
					this.throwTypeCheckErrors(index);
					this.setEarlyReturn();
					return;
				} else {
					this.clearTypeCheckErrors();
				}
			};
			if (Object.keys(argObj).includes("d")){
				return;
			}
		}, this);
		if (this.errorState || this.earlyReturn){
			return;
		}
	};

	compiler.checkAndFixType = function (type, string, index) {
		if (!Object.keys(this.typeCheckFixRouter).includes(type)){
			this.setError(`syntax_parsing_error : invalid syntax declaration, termtype "${type}" not supported by parser`)
		}
		return this.typeCheckFixRouter[type](string, index)
	};

	compiler.typeCheckFixRouter = {
		"number" : function (string, index) {
			var intValue = parseInt(string);
			var isNum = (intValue !== NaN)
			if (!isNum){
				return isNum
			}
			this.buffer.userInput.args[index] = intValue;
			return isNum;
		}.bind(compiler),
		"text" : function (string, index) {
			return true;
		}.bind(compiler),
		"boolean" : function (string, index) {
			var isBool = false;
			const synonyms = {
				"true" : ["t","1","+"],
				"false" : ["f","0","-"],
			}
			synonyms.true.forEach(function(str){
				if (isBool){
					return;
				}
				if (string === str){
					isBool = true;
					this.buffer.userInput.args[index] = true;
				}
			}, this)
			synonyms.false.forEach(function(str){
				if (isBool){
					return
				};
				if (string === str){
					isBool = true;
					this.buffer.userInput.args[index] = false;
				}

			}, this)
			if (!isBool){
				this.setTypeCheckError('boolean',`(expected "true" or "false", got ${string})`)
			}
			return isBool;
		}.bind(compiler),
		"command" : function (string, index, isRexCmd) {

			var allCommandNames = Object.keys(this.parent.command);
			var foundCommand = false
			if (isRexCmd === undefined){
				isRexCmd = false;
			}
			allCommandNames.forEach(function(commandName){
				if (foundCommand || this.buffer.errorState){
					return;
				}
				if (commandName === string){
					if (isRexCmd){
						if ((this.parent.command[commandName].hasRexOverride === undefined ) || !this.parent.command[commandName].hasRexOverride){
							this.setTypeCheckError("command",`at present, ${commandName} is neither accessible by users nor super-users.`)
							return false;
						}
						foundCommand = true;
						return foundCommand;
					}
					foundCommand = true;
				}
				if (this.parent.command[commandName].synonyms){
					if (this.parent.command[commandName].synonyms.includes(string)){
						if (!isRexCmd){
							if (!this.parent.command[commandName].isAvail){
								this.setTypeCheckError("command", `${string} is not a valid command, type "help" to print command list`);
								return false;
							}
						} else {
							if ((this.parent.command[commandName].hasRexOverride === undefined ) || !this.parent.command[commandName].hasRexOverride){
								this.setTypeCheckError("command",`at present, ${commandName} is neither accessible by users nor super-users.`);
								return false;
							}
						}
						this.buffer.userInput.args[index] = commandName;
						foundCommand = true;
						return foundCommand;
					}
				}
				return foundCommand
			}, this);
			if (!foundCommand){
				this.setTypeCheckError("command",`(expected an available command, got ${string})... type "help" to print command list`)
			}
			return foundCommand;
		}.bind(compiler),
		"node" : function (string, index, specifier, metaSpecifier) {
			var type = "node"
			if (specifier && (specifier !== undefined)){
				type = specifier
				var nodes = Object.keys(this.parent.accessibleNodes)
				var foundNode = false;
				var validNodes = [];
				nodes.forEach(function(nodeName, index){
					if (this.parent.accessibleNodes.type === specifier){
						validNodes.push(nodeName);
					}
					if ((metaSpecifier !== undefined) && this.parent.accessibleNodes.Type === metaSpecifier){
						this.validNodes.push(nodeName);
					}
				}, this);
				if (validNodes.length === 0){
					this.setTypeCheckError(type,`no accessible nodes found matching type "${specifier}", try accessing different nodes`);
					return;
				}
				if (!validNodes.includes(string)){
					var messageExt = `type "lk" for a list of adjacent nodes`;
					if (Object.keys(this.parent.programs).includes("rucksack.ext") && (this.parent.programs.runningPrograms.indexOf("rucksack.ext") === -1)){
						messageExt = `\\n \\t - type "lk" to print a list of adjacent nodes
									\\n \\t  - type "rummage" to access nodes stored in rucksack.ext`
					}
					this.setTypeCheckError(type,`(expected ${specifier}, got "${string}")... ${messageExt}`);
				} else {
					foundNode = true;	
				}
			} else {
				var validNodes = Object.keys(this.parent.accessibleNodes)
				if (!validNodes.includes(string)){
					var messageExt = `type "lk" for a list of adjacent nodes`;
					if (Object.keys(this.parent.programs).includes("rucksack.ext") && (this.parent.programs.runningPrograms.indexOf("rucksack.ext") === -1)){
						messageExt = `\\n \\t - type "lk" to print a list of adjacent nodes
									\\n \\t  - type "rummage" to access nodes stored in rucksack.ext`
					}
					this.setTypeCheckError(type, `(expected node, got "${string}")... ${messageExt}`);
				} else {
					foundNode = true;
				}
				return foundNode;
			}
		}.bind(compiler),
		hardware : function (string, index) {
			this.node(string, index, "hardware");
			return;
		},
		mole : function (string, index) {
			this.node(string, index, "mole");
			return;
		},
		readable : function (string, index) {
			this.node(string, index, "readable");
			return;
		},
		recruiter : function (string, index) {
			this.node(string, index, "recruiter");
			return;
		},
		worm : function (string, index) {
			this.node(string, index, "worm");
			return;
		},
		program : function (string, index) {
			this.node(string, index, "program", "malware");
			return;
		},
		malware : function (string, index) {
			this.node(string, index, "malware");
			return;
		},
	}
	compiler.executeCommand = function () {
		this.command[this.buffer.userInput.command].ex.apply(this.command[this.buffer.userInput.command], this.buffer.userInput.arguments);
		return;
	}

	compiler.setEarlyReturn = function () {
		this.buffer.earlyReturn = true;
		return;
	};

	compiler.returnEarly = function (){
		this.buffer.earlyReturn = false;
		return;
	}

	compiler.setTypeCheckError = function (type, errorMessage){
		this.buffer.messages.typeCheckErrors[type] = errorMessage;
		return;
	}

	compiler.throwTypeCheckErrors = function (argIndex) {
		var typesChecked = Object.keys(this.buffer.messages.typeCheckErrors);
		if (typesChecked.length === 1){
			this.api.throwError(`invalid syntax: type_Error: ${this.buffer.userInput.arguments[argIndex]} is not an acceptable argument...\\n ${this.buffer.messages.typeCheckErrors[typesChecked[0]]}`)
			return;
		}
		var output = `inavlid syntax: type_Error: ${this.buffer.userInput.arguments[argIndex]} is not an acceptable argument...\\n`;
		Object.keys(this.buffer.messages.typeCheckErrors).forEach(function(type){
			output = output + `${this.buffer.userInput.arguments[argIndex]} is not a "${type}": ${this.buffer.messages.typeCheckErrors[type]}\\n`
			delete this.buffer.messages.typeCheckErrors[type]
		}, this)
		this.api.throwError(output);
		this.buffer.messages.typeCheckErrors = {};
		this.resetBuffer();
		return;
	}

	compiler.clearTypeCheckErrors = function (){
		Object.keys(this.buffer.messages.typeCheckErrors).forEach(function(type){
			delete this.buffer.messages.typeCheckErrors[type]
		}, this)
		this.buffer.messages.typeCheckErrors = {};
		return;
	}

	compiler.setError = function (errorMessage) {
		this.buffer.errorState = true;
		this.buffer.errorMessage = errorMessage;
		this.setEarlyReturn();
		return;
	};

	compiler.throwError = function () {
		this.buffer.errorState = false;
		console.log(`throwingError`)
		this.api.throwError(this.buffer.errorMessage);
		this.resetBuffer();
		return;
	}.bind(compiler);

	compiler.handleError = function () {
		if (!this.buffer.errorState){
			console.log(`no errorState`)
			return;
		};

		return this.throwError();

	};

	init(parent);
	return compiler;
}
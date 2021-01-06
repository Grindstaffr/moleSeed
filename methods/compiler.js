export const compilerBuilder = function (parent) {
	const compiler = {};
	const init = function (parent) {
		compiler.parent = parent;
		parent.api.compiler = compiler
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
			},
			repeatTermCount : false,
		};
		compiler.addOns = [
			{
				name : "input_type_checker",
				memoryUsage : 1624,
				func : function () {
					
				}.bind(compiler),
			},
			{
				name : "input_auto_fill",
				memoryUsage : 3096,
				func : function () {
					
				}.bind(compiler),
			}
		];

		compiler.functionQueue = [
		];
		compiler.api.addInterfaceFunction(compiler.installAddOn, 'installParserAddOn');
		compiler.api.addInterfaceFunction(compiler.appendTypeCheckRouter, 'addParserTypeCheckFunc')
	};

	compiler.installAddOn = function (funcObj) {
		if (typeof funcObj.func !== "function"){
			this.api.throwError(`parserAddOn installation failure: addOn corrupted.`)
			
			return;
		}
		funcObj.func.bind(this);
		if (funcObj.installer && (typeof funcObj.installer === "function")){
			funcObj.installer(this);
		}
		compiler.addOns.push(funcObj)
	}.bind(compiler);

	compiler.appendTypeCheckRouter = function (typeName, typeCheckFunction){
		if (!typeName || typeName === undefined){
			this.api.throwError(`installation exception: could not append parser type-checker... no type declared`)
			return;
		}
		if (!typeCheckFunction || typeCheckFunction === undefined){
			this.api.throwError(`installation exception: could not append parser type-checker... no sieve found`)
			return;
		}
		if (typeof typeCheckFunction !== "function"){
			this.api.throwError(`installation exception: could not append parser type-checker... Suggested sieve not a function`)
			return;
		}
		if (typeof typeName !== "string"){
			this.api.throwError(`installation exception: could not append parser type-checker... declared type must be a string`)
			return;
		}
		if (typeCheckFunction.length < 2){
			this.api.throwError(`installation exception: could not append parser type-checker... declared function must take at least "string" and "index" as arguments.`)
		}
		this.typeCheckFixRouter[typeName] = typeCheckFunction.bind(compiler)
		
	}.bind(compiler)

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
	}.bind(compiler)

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
			
			if (this.buffer.errorState){
				
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

		if (this.buffer.repeatTermCount){
			this.shallowSyntaxCompare();
			this.buffer.repeatTermCount = false;
		}

		if (this.buffer.earlyReturn){
			if (this.buffer.errorState){
				this.returnEarly();
				return this.handleError();
			};
			this.resetBuffer();
			return this.returnEarly();
		};

		this.executeCommand();
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
			var initSlice = 0;
			if (output === undefined || !output){
				output = {
					type : "",
					options : [],
					complete : false,
				};
				if (term[0]==="["){
					output.type = "required";
					initSlice = 1;
				} else if (term[0] === "("){
					output.type = "optional";
					initSlice = 1;
				} else if (term === "..."){
					output.type = "deferential"
				} else {
					output.type = "literal";
				}
			}

			if (term[0] === "/"){
				initSlice = 1;
			};

			var substr = term
			if (initSlice > 0){
				substr = term.slice(initSlice);
			}

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
			 	this.buffer.syntax.args.push({"o" : ["text"]});
			 	this.buffer.syntax.optionalArgs.push(["text"]);
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
					message = `at least ${this.buffer.syntax.requiredArgs.length} term`
				}
				message = `at least ${this.buffer.syntax.requiredArgs.length} terms`
			}
			
			this.setError(`invalid syntax (not enough terms)... got ${this.buffer.userInput.arguments.length} terms, expected ${message}...\\n \\t syntax: "${this.buffer.syntax.raw}"`);
			return;
		}
		if (this.buffer.userInput.arguments.length > this.buffer.syntax.args.length){
			if (Object.keys(this.buffer.syntax.args[this.buffer.syntax.args.length -1]).includes("o")){
				if (this.buffer.syntax.args[[this.buffer.syntax.args.length -1]].o[0] === 'text'){
					return;
				}
			}
			this.api.warn(`input term count exceeds command syntax term count... truncating...`)
			this.buffer.userInput.arguments.slice(0,this.buffer.syntax.args.length)
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
					this.buffer.userInput.arguments.splice(index,1)
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
			console.log(`ensuring ${string} is a number`)
			var intValue = parseInt(string);
			var isNum = (!isNaN(intValue))
			if (!isNum){
				this.setTypeCheckError('number', `(expected numerical value, got "${string}")`, index)
				return isNum
			}
			this.buffer.userInput.arguments[index] = intValue;
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
				this.setTypeCheckError('boolean',`(expected "true" or "false", got "${string}")`, index)
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
							this.setTypeCheckError("command",`at present, ${commandName} is neither accessible by users nor super-users.`, index)
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
								this.setTypeCheckError("command", `${string} is not a valid command, type "help" to print command list`, index);
								return false;
							}
						} else {
							if ((this.parent.command[commandName].hasRexOverride === undefined ) || !this.parent.command[commandName].hasRexOverride){
								this.setTypeCheckError("command",`at present, ${commandName} is neither accessible by users nor super-users.`, index);
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
				this.setTypeCheckError("command",`(expected an available command, got ${string})... type "help" to print command list`, index)
			}
			return foundCommand;
		}.bind(compiler),
		"node" : function (string, index, specifier, metaSpecifier, boolProp) {
			if (specifier === "null"){
				specifier = null;
			}
			if (metaSpecifier ==="null"){
				metaSpecifier = null;
			}
			if (specifier === "meta" && metaSpecifier !== undefined){
				var nodes = Object.keys(this.parent.accessibleNodes)
				var foundNode = false;
				var validNodes = [];
				nodes.forEach(function(nodeName, index){
					if ((metaSpecifier !== undefined) && this.parent.accessibleNodes[nodeName].Type === metaSpecifier){
						validNodes.push(nodeName);
					}
				}, this);
				if (validNodes.length === 0){
					this.setTypeCheckError(metaSpecifier, `no accessible nodes found matching type "${metaSpecifier}, try accessing different nodes"`, index);
					return foundNode
				}
				foundNode = validNodes.includes(string)
				if (!foundNode){
					var messageExt = `found ${validNodes.length} "${metaSpecifier}" node:`;
					if (validNodes.length > 1){
						messageExt = `found ${validNodes.length} "${metaSpecifier}" nodes:`;
					}
					validNodes.forEach(function(nodeName){
						var type = this.parent.accessibleNodes[nodeName].type
						messageExt = messageExt + `\\n   name: ${nodeName}` + (` .`).repeat(Math.max((16 - (nodeName.length)), 0)) + ` type: ${type}`;
					}, this)
					this.setTypeCheckError(type,`(expected ${metaSpecifier}, got "${string}")... ${messageExt}`, index);
					return foundNode
				}
				return foundNode
				
			}
			
			var type = "node"
			if (specifier && (specifier !== undefined)){
				type = specifier
		
				var nodes = Object.keys(this.parent.accessibleNodes)
				var foundNode = false;
				var validNodes = [];
				nodes.forEach(function(nodeName, index){
					if (this.parent.accessibleNodes[nodeName].type === specifier){
						validNodes.push(nodeName);
					}
					if ((metaSpecifier !== undefined) && this.parent.accessibleNodes[nodeName].Type === metaSpecifier){
						validNodes.push(nodeName);
					}
				}, this);
			
				if (validNodes.length === 0){
					this.setTypeCheckError(type,`no accessible nodes found matching type "${specifier}", try accessing different nodes`, index);
					return foundNode;
				}
				if (!validNodes.includes(string)){
					var messageExt = `type "lk" for a list of adjacent nodes`;
					if (Object.keys(this.parent.programs).includes("rucksack.ext") && (Object.keys(this.parent.programs.runningPrograms).indexOf("rucksack.ext") === -1)){
						messageExt = `\\n\\t - type "lk" to print a list of adjacent nodes
									\\n\\t - type "rummage" to access nodes stored in rucksack.ext`
					}
					this.setTypeCheckError(type,`(expected ${specifier}, got "${string}")... ${messageExt}`, index);
				} else {
					foundNode = true;
					return foundNode;	
				}
			} else {
				var validNodes = Object.keys(this.parent.accessibleNodes)
				if (!validNodes.includes(string)){
					var messageExt = `type "lk" for a list of adjacent nodes`;
					if (Object.keys(this.parent.programs).includes("rucksack.ext") && (Object.keys(this.parent.programs.runningPrograms).indexOf("rucksack.ext") === -1)){
						messageExt = `\\n \\t - type "lk" to print a list of adjacent nodes
									\\n \\t - type "rummage" to access nodes stored in rucksack.ext`
					}
					this.setTypeCheckError(type, `(expected node, got "${string}")... ${messageExt}`, index);
				} else {
					foundNode = true;
					if (!specifier && !metaSpecifier){
						if (boolProp !== undefined){
							foundNode = this.api.getAccessibleNodes()[string][boolProp]
							if (!foundNode){

								var message = `\\n\\t The following nodes satisfy node_property_${boolProp} = true:`
								var goodNodes = Object.keys(this.api.getAccessibleNodes()).filter(function(nodeName){
									return (this.api.getAccessibleNodes()[nodeName][boolProp] === true)
								}, this)
								goodNodes.forEach(function(nodeName){
									var node = this.api.getAccessibleNodes()[nodeName];
									var line = `\\n\\t  name: ${node.name}` + (` .`).repeat(Math.max((16 - Math.floor((nodeName.length)/2)), 0)) + ` type: ${node.type}`
									message = message + line;
								}, this)
								this.setTypeCheckError(type, `targeted node invalid: node_property_${boolProp} = false` + message)
							}
						}
					}
				}
				return foundNode;
			}
			return foundNode;

		}.bind(compiler),
		hardware : function (string, index) {
			return this.node(string, index, "meta", "hardware");
		},
		mole : function (string, index) {
			return this.node(string, index, "mole");
		},
		readable : function (string, index) {
			return this.node(string, index, "null", "null", "canBeRead");
		},
		recruiter : function (string, index) {
			console.log('checking for rctr')
			return this.node(string, index, "recruiter");
		},
		worm : function (string, index) {
			return this.node(string, index, "worm");
		},
		program : function (string, index) {
			if (string === "runningPrograms"){
				return false;
			}
			if (Object.keys(compiler.parent.programs).includes(string)){
				return true;
			}
			return this.node(string, index, "program", "malware");
		},
		malware : function (string, index) {
			return this.node(string, index, "malware");
		},
		mcommand : function (string, index) {
			var moleName = this.buffer.userInput.arguments[0];
			var mole = this.api.getAccessibleNodes()[moleName];
			var isMCommand = Object.keys(mole.moleCommands).includes(string)
			if (!isMCommand){
				this.setTypeCheckError('mcommand', `(expected ${moleName}-compatable command, got "${string}") ... try "mole ${moleName} help" to print a list of ${moleName}-compatible commands.`)
			} 
			return(isMCommand);
		}.bind(compiler)
	}
	compiler.executeCommand = function () {
		var command = this.buffer.userInput.command;
		var args = this.buffer.userInput.arguments;
		this.clearTypeCheckErrors();
		this.resetBuffer();

		this.command[command].ex.apply(this.command[command], args);
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

	compiler.setTypeCheckError = function (type, errorMessage, index){
		this.buffer.messages.typeCheckErrors[type] = {}
		this.buffer.messages.typeCheckErrors[type].text = errorMessage;
		this.buffer.messages.typeCheckErrors[type].command = this.buffer.userInput.command;
		this.buffer.messages.typeCheckErrors[type].argument = this.buffer.userInput.arguments[index];
		return;
	}

	compiler.throwTypeCheckErrors = function (argIndex) {
		var typesChecked = Object.keys(this.buffer.messages.typeCheckErrors);
		if (typesChecked.length === 1){
			this.api.throwError(`invalid syntax: type_Error: ${this.buffer.userInput.arguments[argIndex]} is not an acceptable argument...\\n ${this.buffer.messages.typeCheckErrors[typesChecked[0]].text}`)
			return;
		}
		var output = `inavlid syntax: type_Error: ${this.buffer.userInput.arguments[argIndex]} is not an acceptable argument...\\n`;
		Object.keys(this.buffer.messages.typeCheckErrors).forEach(function(type){
			output = output + `${this.buffer.userInput.arguments[argIndex]} is not a "${type}": ${this.buffer.messages.typeCheckErrors[type].text}\\n`
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
		
		this.api.throwError(this.buffer.errorMessage);
		this.resetBuffer();
		return;
	}.bind(compiler);

	compiler.handleError = function () {
		if (!this.buffer.errorState){
			
			return;
		};

		return this.throwError();

	};

	init(parent);
	return compiler;
}
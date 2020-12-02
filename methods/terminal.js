export const terminal = {
	keyHandler : function (e) {
		if (e.keyCode === 27){
			e.preventDefault();
			this.keyRouter.route(e)
			return;
		}
		if (this.inputIsLocked){
			e.preventDefault();
			return;
		}
		this.keyRouter.route(e);
	},
	keyRouter : {
		route : function (e) {
			var code = e.keyCode;
			if (this.specialKeys.includes(code.toString())){
				this[code.toString()]();;
				return;
			} else {
				this.handleGeneralCase(e);
			}
		},
		specialKeys : ['8','13','16','37','38','39','40'],
		'8' : function () {
			
			var cache = this.defineCache();
			cache.deleteFromInput();
			//cache.deletedText.push(cache.inputRow.pop());
			//THIS WILL CHANGE IF WE IMPLEMENT HIGHLIGHTING
			this.parent.blinkyCursor.position.leadTheText();		
		},//backspace
		'13' : function () {
			
			this.parent.input.inputCommand();
		},//enter
		'16' : function () {
			//make Uppercase
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
	},
	constructInput : function (trmnl) {
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


			for (var prop in this.filtersPassed){
				this.filtersPassed[prop] = false;
			}
			this.sendToCompiler(command);
		};

		input.inputCommand = function (){
			if (this.inputIsLocked){
				return;
			}
			if (this.api.submitTriggerFunction){
				this.api.submitTriggerFunction();
			}
			var commandFull = this.cache.getInputRow();
			this.cache.submitInput();
			this.blinkyCursor.position.leadTheText();
			this.bufferInput(commandFull);
			if (this.shouldReRouteInput()) {
				this.reRouteInput(commandFull);
				return;
			}
			this.sendToCompiler(commandFull);
		};

		input.sendToCompiler = function (commandFull){
			this.command.assembleValidNodes.ex();
			this.compiler.assembleValidNodes();
			this.api.raiseSubmitFlag();
			this.compiler.compileAndExecuteCommand(commandFull)
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
					if (response === 'y'){
						if (this.callbacks.verify){
							this.callbacks.verify(true);
						}
						this.callbacks.verify = function () {};
						var command = this.retrieveBufferedInput();
						this.command.log.ex(`submitting ${command}`)
						this.messages.verify = this.messages.default_verify;
						this.toggleFilterOff('verify');
						this.filtersPassed.verify = true;
						//this.shouldReRouteInput = false;
						return command;
					}
					if (response === 'n'){
						if (this.callbacks.verify){
							this.callbacks.verify(true);
						}
						this.callbacks.verify = function () {};
						this.command.log.ex(`  aborted command : "${this.retrieveBufferedInput()}" `);
						this.messages.verify = this.messages.default_verify;
						this.toggleFilterOff('verify');
						//this.shouldReRouteInput = false;
						return this.retrieveBufferedInput();
					}
					return `User_cannot_answer_a_simple_yes_or_no_question`

				},
				extend : function (commandFull) {

				},
				input : function (commandFull) {

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
						this.command.error.ex(`${command} is not a valid command, type "help" for options`)
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
		init(trmnl);
		return input;
	},
	reRouteInput : function (commandFull) {

		const routes = {
			verify : function (commandFull) {

			},
			extend : function (commandFull) {

			},
			input : function (commandFull) {

			},
		};


	},
	inputCommand : function () {
		console.log('THIS INPUT METHOD IS DEPRECATED, USE input.inputCommand instead')
		if (this.inputIsLocked){
			return;
		}
		if (this.api.submitTriggerFunction){
			this.api.submitTriggerFunction();
		}
		var commandFull = this.cache.getInputRow();
		this.cache.submitInput();
		this.blinkyCursor.position.leadTheText();
		if (this.shouldReRouteInput) {
			this.reRouteInput(commandFull);
			return;
		}

		this.command.assembleValidNodes.ex();
		this.compiler.assembleValidNodes();
		this.api.raiseSubmitFlag();
		this.compiler.compileAndExecuteCommand(commandFull)
	},
	constructCompiler : function (boundCommander, parent) {
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
				this.command.error.ex(`${inputTerms[0]} is not a valid command, type "help" for options`);
				return;
			}
			if ((this.command[inputTerms[0]].requiresVerification) && !(this.cache.inputBufferVerified)){
			
				this.cache.inputBuffer.push(inputTerms)
				this.command.verify.ex();
				return;
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
					this.command.error.ex('invalid syntax (not enough terms)');
					return;
				} else if (inputTerms.length < (requiredTerms.length - 1)) {
					this.command.error.ex('invalid syntax (not enough terms)');
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
						this.command.error.ex('syntax not implemented')
						args = false;
						return;
					}
					if (typeof this.validArgs[term] === "object"){
						if (this.validArgs[term].includes(inputTerms[index])){
							args.push(inputTerms[index])
						} else {
							this.command.error.ex(`invalid syntax ("${inputTerms[index]}" is a non-valid input)`)
							args = false;
							return;
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
				} else if (term === "...") {
					cmdIsExtendable = true;
				} else {
					if (requiredTerms[index] !== inputTerms[index]){
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
		compiler.assembleValidNodes = function () {
			this.validArgs['[MOLE]'] = this.command.validMoleList;
			this.validArgs['[NODE]'] = this.command.validNodeList;
			this.validArgs['[PROGRAM]'] = this.command.validProgramList;
			this.validArgs['[PROGRAM]'] = this.command.validProgramList;

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
		};
		initCompiler(boundCommander, parent);
		return compiler;
	},
	constructCommands : function (boundCache = this.cache, parent) {
		const command = {};
		command.help = {
			name : 'help',
			desc : 'list available commands',
			syntax: 'help',
			isAvail : true,
			ex : function () {
				var cmd = this.parent;
				cmd.cache.writeEmptyRow();
				cmd.cache.writeToVisibleRow(" --- listing available commands with descriptions --- ")
				cmd.cache.writeEmptyRow();
				cmd.cache.writeEmptyRow();
				Object.keys(cmd).forEach(function(key){
					if (cmd[key].isAvail){
						var name = cmd[key].name;
						var desc = cmd[key].desc;
						var line = (" ") + name + (" ").repeat(8 - name.length) + (": ") + desc;
						cmd.cache.writeToVisibleRow(line)
						cmd.cache.writeEmptyRow();
					}
				})
			},
		};
		command.syntax = {
			name : 'syntax',
			desc : 'display syntax for a command',
			syntax : 'syntax [COMMAND]',
			requiresVerification : false,
			isAvail : true,
			ex : function (commandName) {
				var cmd = this.parent;
				cmd.cache.writeEmptyRow();
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
			isAvail: true,
			ex : function () {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				cmd.cache.writeEmptyRow();
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
			syntax: 'mv [NODE]',
			isAvail: true,
			ex: function (nodeName) {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				if (trmnl.activeNode.name === nodeName){
					cmd.cache.writeEmptyRow();
					cmd.cache.writeToVisibleRow(`moved nowhere`)
					cmd.cache.writeEmptyRow();
					return;
				} else if (trmnl.activeNode.visibleAdjacencies[nodeName] === undefined){
					cmd.error.ex('cannot move to non-adjacent nodes')
					return;
				}
				trmnl.activeNode = trmnl.activeNode.visibleAdjacencies[nodeName];
				trmnl.activeNode.trigger();
				cmd.assembleAccessibleNodes.ex();
				cmd.assembleValidNodes.ex();
				cmd.compiler.assembleValidNodes();
				cmd.cache.writeEmptyRow();
				cmd.cache.writeToVisibleRow(`moved to ${nodeName}`)
				cmd.cache.writeEmptyRow();
			}
		};
		command.install = {
			name : 'install',
			desc : 'install a program',
			syntax : 'install [PROGRAM]',
			isAvail : true,
			ex : function (programName) {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				var program = trmnl.activeNode 
				if (trmnl.activeNode.name !== programName){
					program = trmnl.accessibleNodes[programName]
				};
				if (!trmnl.programs[programName]){
					program.install(function(program){
						program.install(trmnl, function(){
							trmnl.programs[program.name] = program;
							console.log('successfully Installed')
							cmd.prgms.isAvail = true;
							cmd.cache.writeEmptyRow();
							cmd.cache.writeToVisibleRow(`${programName} installed successfully`);
							cmd.cache.writeEmptyRow();
						})
					});
					return;
				}
					cmd.error.ex('program already installed')
			}
		};
		command.ex = {
			name : 'ex',
			desc: 'execute a program',
			syntax: 'ex [PROGRAM]',
			isAvail : true,
			ex : function (programName) {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				if (!trmnl.programs[programName]){
					cmd.error.ex('cannot execute an uninstalled program')
					return;
				}
				for (var prgm in trmnl.programs.runningPrograms){
					console.log(trmnl.programs.runningPrograms)
					if (!trmnl.programs.runningPrograms[prgm].runsInBackground){
						cmd.error.ex('conflicting program already executing, stop conflicting programs and try again')
						return;
					}
				}
				trmnl.programs[programName].ex();
				trmnl.programs.runningPrograms[programName] = trmnl.programs[programName]
				trmnl.command.stop.isAvail = true;
				cmd.assembleValidCommands.ex();
				cmd.assembleValidNodes.ex();
				cmd.compiler.assembleValidCommands();
				cmd.compiler.assembleValidNodes();
			}

		};
		command.stop = {
			name : 'stop',
			desc : `stop an executing program`,
			syntax : 'stop [PROGRAM]',
			isAvail : false,
			hasDefault: true,
			ex : function (programName) {
				if (!programName){
					programName = Object.keys(trmnl.programs.runningPrograms)[0]
				}
				var cmd = this.parent;
				var trmnl = cmd.parent;
				if (trmnl.programs.runningPrograms[programName] === undefined){
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
				cmd.compiler.assembleValidCommands();
				cmd.compiler.assembleValidNodes();
			}

		};
		command.read = {
			name: 'read',
			desc: 'read the contents of an adjacent node',
			syntax: 'read [NODE]',
			isAvail: true,
			ex : function (nodeName) {
				var cmd = this.parent;
				var trmnl = cmd.parent;
				var node = {}
				if (trmnl.activeNode.name === nodeName){
					node = trmnl.activeNode
				} else {
					console.log(trmnl.accessibleNodes)
					node = trmnl.accessibleNodes[nodeName]
				}
				console.log(node)
				if (!node.canBeRead){
					cmd.error.ex('the node does not contain any readable data')
					return;
				}
				var text = ""
				node.read(function(text){
					trmnl.cache.composeText(text)
				})
			}
		};
		command.info = {
			name: 'desc',
			desc: 'describe a command',
			syntax: 'desc [COMMAND]',
			isAvail : false,
			ex : function (command) {
				cmd.cache.writeEmptyRow();
				cmd.cache.writeToVisibleRow(command.longDesc);
				cmd.cache.writeEmptyRow();
			},
		};
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
				cmd.cache.writeEmptyRow();
				cmd.cache.writeToVisibleRow(`${text}`);
				cmd.cache.writeEmptyRow();
			},
		};
		command.warn = {
			name : 'WARN',
			ex : function (text) {
				var cmd = this.parent;
				cmd.cache.writeEmptyRow();
				cmd.cache.writeToVisibleRow(`!_warning_!: ${text}`);
				cmd.cache.writeEmptyRow();
			}
		};
		command.error = {
			name : 'ERROR',
			desc : '',
			syntax: '',
			ex : function (text) {
				var cmd = this.parent;
				cmd.cache.writeEmptyRow();
				cmd.cache.writeToVisibleRow(`ERROR: ${text}`);
				cmd.cache.writeEmptyRow();
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
				cmd.compiler.assembleValidCommands();
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
	},
	constructPrograms : function () {
		const programs = {};
		programs.runningPrograms = {};
		return programs;
	},

	draw : function () {
		if (!this.isOn){
			this.context.fillStyle = "#CCFFFF"
			var height = window.innerHeight;
			var width = window.innerWidth;
			this.context.fillText(`Press 'F11' to start moleSeed.mkr`, ((width/2) - this.letterHeight * 16), ((height/2)-this.letterHeight));
			return;
		}
		//console.log('drawing Terminal')
		this.context.strokeStyle = this.style.stroke
		this.context.beginPath();
		this.context.rect(this.leftLoc , this.topLoc, this.pxEdgeDimensions, this.pxEdgeDimensions)
		this.context.stroke();

		this.drawInputRow();
		this.blinkyCursor.draw();
		this.drawCurrentRows();
		/*
		this.cache.currentRows.forEach(function(row, index){
			var line = ""
			row.forEach(function(letter){
				if (typeof letter !== "string"){
					alert ('somehow a non-string made it into a String-only cache \n See Terminal.js')
				}
				line = line + letter
			})
			// this.context.fillText(line)
		})
		*/
	},
	drawInputRow : function () {
		var line = this.cache.inputRow.join("")
		/*
		this.cache.inputRow.forEach(function(letter, index){
			line = line + letter;
		})
		*/
		//console.log(this.botLoc)
		//console.log(this.style.text)
		this.context.fillStyle = this.style.text
		this.context.fillText('>',this.leftLoc + 2, this.botLoc - 2)
		this.context.fillText(`${line}`, this.leftLoc + 2 + this.letterHeight, this.botLoc -2)
	},
	drawCurrentRows : function () {
		var start = this.topLoc + this.letterHeight
		var trmnl = this
		this.context.fillStyle = this.style.text
		this.cache.currentRows.forEach(function(row, index){
			var line = row.join("");
			var vLoc = start + (index * trmnl.letterHeight)
			trmnl.context.fillText(`${line}`, trmnl.leftLoc + 2, vLoc )
		})

	},
	blinkyCursor : {
		draw : function () {
			var left_relative = this.position.x * this.parent.letterHeight;
			var top_relative = ((this.parent.rowCount - this.position.y) * this.parent.letterHeight)
			var leftTrue = this.parent.leftLoc + left_relative + this.parent.letterHeight + 2;
			var topTrue = this.parent.topLoc + top_relative + 1;
			this.parent.context.fillStyle = this.style.background
			this.blink();
			this.parent.context.fillRect(leftTrue, topTrue, this.parent.letterHeight, this.parent.letterHeight)
			if (this.position.y === 0){
				if (this.position.x < this.parent.cache.inputRow.length){
					this.parent.context.fillStyle = this.style.text
					this.parent.context.fillText(this.parent.cache.inputRow[this.position.x], leftTrue, topTrue + this.parent.letterHeight)
				}
			}
		},
		typeMode : true,
		position : {
			x : 0,
			y : 0,
			up : function () {
				if (this.y === (this.parent.trmnl.maxRowCount + 1)){
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
				if (this.x === this.parent.trmnl.maxRowWidth){
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
		}
		},
		toggleColorInverse : function () {
			var hold = this.style.background;
			this.style.background = this.style.text;
			this.style.text = hold;
		},
		setBright : function () {
			this.style.background = this.parent.style.text;
			this.style.text = this.parent.style.background;
			this.counter = 1;
		},
		counter : 1,
		blinkTiming: 13,
		blink : function () {
			if (this.counter % this.blinkTiming  === 0) {
				this.toggleColorInverse();
				this.counter = 1;
			} else {
				this.counter = this.counter + 1;
			}
		},
		init : function () {
			this.trmnl = this.parent;
			this.position.parent = this;
			this.style = {
				background : this.parent.style.background,
				text : this.parent.style.text,
			};
		},
	},
	constructAPI : function () {
		var terminalInterface = {};
			//this whole section is sort of jury-rigged to deal with multiple filters....
			//not a long-term sustainable solution
		terminalInterface.renounceInputManagement = function () {
	
			Object.keys(this.input.filters).forEach(function(filterName){
				this.input.filters[filterName] = false;
			}, this)
	
			//this.submitTriggerFunction = false;
		}
		terminalInterface.narrowCommand = function (whitelistArray, callback) {
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
		terminalInterface.requestInput = function (command, message) {
			//this.input.shouldReRouteInput = true;
			this.input.toggleFilterOn('input');
			if(!command){
				this.command.error.ex('COMPILERERROR: COMMAND INPUT NEEDED ON INPUT REQS');
				//this.input.shouldReRouteInput = false;
				return;
			}
			this.input.commandToExted = command;
			if (!message){
				return;
			}
			this.input.messages.input = message;
			if (!callback){
				return;
			}
			this.input.callbacks.input = callback;
		};

		terminalInterface.reserveRows = function (numberOfRows){
			var rowCount = Math.min(numberOfRows)//, (this.cache.inputRow.length/2))
			this.cache.reserveRows(rowCount);
			this.heightInRows = rowCount;
		};
		terminalInterface.clearUnreservedRows = function(){
			this.cache.clearUnreservedRows();
		};
		terminalInterface.clearReservedRows = function(){
			this.cache.clearReservedRows();
		};
		terminalInterface.writeLine = function (string) {
			this.cache.writeToVisibleRow(string);
		};
		terminalInterface.writeToGivenRow = function (string, rowIndex){
			this.cache.writeToGivenRow(string,rowIndex);
		};
		terminalInterface.composeText = function (string){
			this.cache.composeText(string);
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
			return this.compiler.compileAndExecuteCommand(string);
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
		terminalInterface.appendAccessibleNodes = function (node) {
			this.command.appendAccessibleNodes.ex(node);
		};
		terminalInterface.getAccessibleNodes = function () {
			return this.parent.accessibleNodes;
		}
		terminalInterface.clearSubmitTriggeredFunction = function () {
			this.submitTriggerFunction = false;
		}
		terminalInterface.setSubmitTriggeredFunction = function (callback) {
			this.submitTriggerFunction = callback;
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
		terminalInterface.executeCommand = function (commandName) {
			if (!this.command[commandName]){
				this.command.error.ex('Invalid api use: command not recognized')
				return;
			};
			this.command[commandName].ex()
		};
		terminalInterface.executeSilentCommand = function(commandName, args) {
			this.command[commandName].ex(...args)
		}
		terminalInterface.addSilentCommand = function (commandObj){
			this.command.addCommand.ex(commandObj);
			this.command[commandObj.name].isAvail = false;
		};
		terminalInterface.commandExistenceCheck = function (commandName){
			if (this.command[commandName]){
				return true;
			}
			return false;
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
		terminalInterface.incrementCommandUsedBy = function (commandName) {
			this.command.incrementCommandUsedBy.ex(commandName);
		};
		terminalInterface.decrementCommandUsedBy = function (commandName) {
			this.command.decrementCommandUsedBy.ex(commandName);
		};
		terminalInterface.getCommandUsedBy = function (commandName) {
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
		const init = function (trmnl) {
			terminalInterface.parent = trmnl;
			terminalInterface.cache = trmnl.cache;
			terminalInterface.command = trmnl.command;
			terminalInterface.compiler = trmnl.compiler;
		};
		init(this);
		return terminalInterface;

	},
	constructCache : function () {

		var cache = {}
		cache.parent = this;
		cache.previousRows = new Array(40).fill([]);
		cache.nextRows = new Array(40).fill([]);
		cache.currentRows = new Array(this.rowCount).fill([]);
		cache.inputRow = new Array(this.rowCount).fill("");
		cache.inputRowPrev = new Array(this.rowCount).fill("");
		cache.inputRowNext = new Array(this.rowCount).fill("");
		cache.inputIndex = 0;
		cache.inputLength = 0;
		cache.deletedText = new Array(20).fill("");
		cache.previousInputIndex = -1;
		cache.previousInputRows = new Array(10).fill([]);
		cache.previousInputSelector = 0;
		cache.vRowOffset = 0;
		cache.inputRowOffset = 0;
		cache.inputBuffer = [];
		cache.inputBufferVerfied = false;

		cache.rescaleCache = function () {
			console.log(this.rowCount)
			var newDisplay = new Array(this.rowCount).fill([])
			this.inputRow = new Array(this.rowCount).fill("");
			this.inputRowPrev = new Array(this.rowCount).fill("");
		    this.inputRowNext = new Array(this.rowCount).fill("");
		    this.currentRows.forEach(function(row, index){
		    	if (row.length > 0){
		    		newDisplay[index] = row
		    	}
		    },this)
			this.currentRows = newDisplay;
		}.bind(cache)
		/*
				!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

		(reserved rows) can act as a flag to get the cache
		to stop default (fullscreen) behaviour, and start
		dumping mid-screen

			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
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
		cache.composeText = function (str){
			var string = this.eliminateBS(str)
			string = this.replaceTabs(str)
			this.writeEmptyRow();
			var maxSubstring = string.substring(0,this.inputRow.length);
			var metaCharIndex = maxSubstring.indexOf(`\\`)
			if (metaCharIndex >= 0){
				if (string[metaCharIndex + 1] === `n`){
					this.writeToVisibleRow(maxSubstring.substring(0,metaCharIndex));
					this.writeEmptyRow();
					var newString = string.substring(metaCharIndex + 2);
					this.composeText(newString);
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
				this.writeEmptyRow();
				var newString = string.slice(appropriateIndex, string.length);
				this.composeText(newString);
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
			var fullInput = [this.inputRowPrev, this.inputRow, this.inputRowNext]
			if (this.previousInputIndex < this.previousInputRows.length - 2){
				this.previousInputSelector = this.previousInputIndex;
				this.previousInputIndex = this.previousInputIndex + 1;
				this.previousInputRows[this.previousInputIndex] = fullInput
			} else {
				this.previousInputSelector = this.previousInputIndex;
				this.previousInputRows.shift();
				this.previousInputRows.push(fullInput);
			}
		};
		cache.retrieveNextArchivedInput = function () {
			if (this.previousInputIndex < 0){
				return;
			}
			if (this.previousInputSelector > 0){
				var fullInput = this.previousInputRows[this.previousInputSelector]
				this.inputRow = fullInput[1];
				this.inputRowPrev = fullInput[0];
				this.inputRowNext = fullInput[2]
				this.previousInputSelector = this.previousInputSelector - 1;
			} else {
				var fullInput = this.previousInputRows[this.previousInputSelector]
				this.inputRow = fullInput[1];
				this.inputRowPrev = fullInput[0];
				this.inputRowNext = fullInput[2]
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
				/*
				this.previousRows.shift();
				this.previousRows.push(this.currentRows.shift());
				this.currentRows.push(firstRow);
				
				this.previousRows.shift();
				this.previousRows.push(this.currentRows.shift());
				this.currentRows.push(secondRow);
				*/
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

		cache.writeToGivenRow = function (string, rowNum) {
			if (typeof string !== 'string'){
				console.warn('cant use non-strings')
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
				this.currentRows[i] = row;
			}
		};
		cache.reserveRows = function (numberOfRows){
			this.reservedRows = numberOfRows;
			return;
		};
		cache.freeAllRows = function () {
			this.reservedRows = 0;
			return;
		}
		/*
			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			IN ORDER FOR CRAWLER TO WORK, WE NEED A CACHE FUNCTION WHICH SHRINKS THE SCALE OF Writable CACHE.
			CURRENTROWS AND SENDS THE AMOUNT THAT IT GOT SHRUNK BY TO PREVIOUS ROWS

			it must keep top...30-40 rows untouched until the crawler turns off
			gotta turn off standard push pop shift, and grab a middle element,
			ie. with an index and a delete


			this might be easily handleable with the above RESERVEDROWS FLAG, and editing functions
			cache.writeToVisibleRow
			      and
			cache.moveInputToDisplay

			also, cache needs a function for writing to specific rows, i.e. takes a number as an argument
			that way the crawler can start making a visualizer on the terminal
			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			
			This function should be triggered when the dang crawler gets run

		*/
		return cache;
	},
	turnOff : function () {
		this.isOn = false;
		this.__calcLocAndDim();
	},
	turnOn : function () {
		this.isOn = true;
		//this.canvas.requestFullscreen();
		//this.canvas.height = window.innerHeight
		//this.canvas.width = window.innerWidth
		this.__calcLocAndDim();
	},
	setContext : function (context){
		this.context = (context)
		this.context.font = `8px terminalmonospace`
	},
	__calcLocAndDim : function () {
		console.log(this.canvas.height)
		console.log(this.canvas.width)
		var dim = Math.floor(this.canvas.height * (6/7))
		var vBuff = Math.floor(this.canvas.height * (1/14))
		var hBuff = ((this.canvas.width - dim)/2)
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
		}
		return;
	},
	init : function (navBar, assetViewer, canvas, globalProps, fileInitializer, devMode) {
		
		this.activeNode = fileInitializer;
		
		this.accessibleNodes = [];
		this.navBar = navBar;
		this.assetViewer = assetViewer;
		this.canvas = canvas;
		this.context = this.canvas.getContext('2d');
		this.letterSize = globalProps.letterSize;
		this.letterHeight = globalProps.letterHeight;
		this.maxRowWidth = globalProps.maxRowWidth;
		this.maxRowCount = globalProps.maxRowCount;
		this.style = {
			background : "#01060D",
			text : "#EEF0FF",
			stroke: "#EEF0FF",
		}
		this.keyRouter.parent = this;
		//this.indexTools.parent = this;
		this.blinkyCursor.parent = this;
		this.blinkyCursor.style = this.style;
		this.__calcLocAndDim();
		this.programs = this.constructPrograms();
		this.cache = this.constructCache();
		this.command = this.constructCommands(this.cache, this);
		this.compiler = this.constructCompiler(this.command, this);
		this.api = this.constructAPI();
		this.input = this.constructInput(this);
		this.blinkyCursor.init();
		if(devMode){
			this.turnOn();
		}
	},
};
export const program = {
	name : `biblio.ext`,
	isInstalled : false,
	runsInBackground : false,
	data : {
		library : {},
	},
	settings : {
		isRunning : false
	},
	methods : {
		drawFiles : function () {

		},
		commands : {
			search : {
				name : "search",
				desc : "search this library for input text",
				syntax : "search [TEXT] ...",
				ex : function (text) {
					//need ability to specify other search parameters here!
					//see Library class for details, and feel free to tack on stuff if you want more search functionality.
					if (!this.data.library.readyToAcceptCommands){
						this.api.throwError(`This library cannot accept commands while performing a previously requested command`)
						return;
					}
					var fileArray = this.data.library.searchRepository(text);
					if (fileArray.length === 0){
						this.api.log(`${fileArray.length} files found containing term ${text}`)
					}
				}
			},
			help : {
				name : "help",
				desc : "list biblio-specific commands",
				syntax : "biblio help",
				ex : function () {
					this.api.writeLine("");
					this.api.writeLine(` --- listing available ${this.name} commands with descriptions --- `)
					this.api.writeLine("");
					this.api.writeLine("");
					Object.keys(this.methods.commands).forEach(function(commandName){
						var line = commandName + (" ").repeat(8-commandName.length) + ": " + this.methods.commands[commandName][desc];
						this.api.composeText(line, true, true, 12)
					});
				},
			},
			request : {
				name : "request",
				desc : "request a file by name",
				syntax : "request [TEXT]",
				ex : function (text) {
					if (!this.data.library.readyToAcceptCommands){
						this.api.throwError(`This library cannot accept commands while performing a previously requested command`)
						return;
					}
					var file = this.data.library.getFile(text)
					if (file.type === 'null'){
						this.api.throwError(`No file found with name ${text}`)
						//do something in the actual window
						return;
					}

				},
			}
		},
	},
	installData : {
		biblio : {
			name : "biblio",
			desc : "biblio-specific command syntax",
			syntax: "biblio ...",
			wantsMoreCommands : false,
			cmdExtVer : false,
			cmd:"",
			arg1:"",
			arg2:"",
			arg3:"",
			errorState : false,
			ex : function (command, arg1, arg2, arg3) {
				if (!this.settings.isRunning){
							this.ex();
					}
				const biblio = this.installData.biblio
				biblio.cmd = command;
				biblio.arg1 = arg1;
				biblio.arg2 = arg2;
				biblio.arg3 = arg3;
				if (arguments.length === 0){
					if (this.settings.isRunning){
						this.api.log(`  ${this.name} is already running.`)
					}
					if (!cmdExtVer){
						this.api.verifyCommand(`Would you like to run a ${this.name}-specific command?`, function(bool, bool2){
								if (!bool){
									biblio.cmdExtVer = true
									return;
								} else {
									biblio.cmdExtVer = true
									biblio.wantsMoreCommands = true;
									return;
								}
							})
						return;
					}
					if (!biblio.wantsMoreCommands){
						return;
					} else {
						this.api.requestInput(function(commandFull){
							var inputTerms = commandFull.split(" ");
							var indexStart = 0;
							if (inputTerms[indexStart] === ""){
								indexStart = indexStart + 1;
							}
							var command = inputTerms[indexStart];
							if (!this.methods.commands[command]){
								this.api.throwError(`input command is not recognized by ${this.name} parser`)
								biblio.errorState = true;
								return;
							}
							biblio.cmd = command;
							biblio.arg1 = inputTerms[indexStart + 1];
							biblio.arg2 = inputTerms[indexStart + 2];
							biblio.arg3 = inputTerms[indexStart + 3];
						}, `Enter biblio-specific command:`)
						if (biblio.errorState){
							biblio.errorState = false;
							return;
						}
					}
				};
				this.methods.commands[biblio.cmd].ex(biblio.arg1,biblio.arg2,biblio.arg3);
				biblio.cmdExtVer = false;
				biblio.wantsMoreCommands = false;
			},
		},
		



	},
	install : function (trmnl, callback) {
		this.trmnl = trmnl;
		terminal.programs[this.name] = this;
		this.api = terminal.api;
		if (callback){
			callback(this.installData);
		}
		this.isInstalled = true;
		this.data.settings = this.settings
		this.methods.data = this.data;
		this.methods.api = this.api;

		Object.keys(this.methods.commands).forEach(function(commandName){
			this.methods.commands[commandName].ex = this.methods.commands[commandName].ex.bind(this)
		}, this)

		this.installData.biblio.ex = this.installData.biblio.bind(this);

		this.api.addCommand(this.installData.biblio)
	},
	stop : function () {
		this.settings.isRunning = false;
		this.library.data.powerDown();
		this.data.library = {};
		this.api.clearReservedRows(0);
		this.api.reserveRows(0);
		this.api.unblockCommand('mv');

	},
	ex : function (trmnl) {
		var thisNode = this.api.getActiveNode();
		if (thisNode.type !== `library`){
			this.api.throwError(`${this.name} operates as a library interface; move to a library node in order to execute ${this.name} or use its command interface`)
			return;
		}
		this.api.reserveRows(20);
		this.api.clearReservedRows();
		this.settings.isRunning = true;
		this.api.blockCommand('mv', `cannot move away from a library while ${this.name} is running`)
		this.data.library = thisNode;
		thisNode.declareApi(this.api);
		thisNode.setRenderTrigger()
		thisNode.fetchRepository();
	},
}
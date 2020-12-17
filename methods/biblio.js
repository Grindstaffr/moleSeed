export const program = {
	name : `biblio.ext`,
	isInstalled : false,
	runsInBackground : false,
	data : {
		library : {},
		message : "",
		requestedFile : {type : 'null'},
		shortCutTable : {

		},
		pages : {

		},
		currentPage : 0,
		pseudonyms : {
			search : ['-s','sea', 'lookfor', 'find'],
			help : ['?', '-h', 'hlp', 'hep', 'hel'],
			next : ['>','+page', '-n'],
			prev : ['<','-page', '-p'],
			request : ['-r', 'req','get','fetch', 'retrieve'],
		}
	},
	settings : {
		isRunning : false,
		displayPageOfFiles : false,
		displayReqFile : false,
		displayWindow : true,
		displayLibMessage : true,

	},
	methods : {
		resetDisplaySettings : function () {
			this.settings.displayPageOfFiles = false;
			this.settings.displayReqFile = false; 
			this.settings.displayWindow = true; 
			this.settings.displayLibMessage = true; 
		},
		changeLibraryMessage : function (text) {
			this.data.message = text;
			this.methods.drawLibraryMessage();
		},
		clearPagesCache : function () {
			this.data.pages = {};
		},
		incrementPage : function () {
			if (this.data.currentPage === (Object.keys(this.data.pages).length - 1)){
				this.methods.changeLibraryMessage(`Cannot fetch next page: page does not exist;`)
				return;
			}
			this.data.currentPage  = this.data.currentPage + 1;
		},
		decrementPage : function () {
			if (this.data.currentPage === 0){
				this.methods.changeLibraryMessage(`Cannot fetch previous page: page does not exist;`)
				return;
			}
			this.data.currentPage = this.data.currentPage - 1;
		},
		drawFiles : function () {
			if (!this.settings.displayPageOfFiles){
				return;
			}
			if (Object.keys(this.data.pages).length === 0){
				return;
			}
			if (Object.keys(this.data.pages[this.data.currentPage]).length === 0){
				return;
			}
			Object.keys(this.data.pages[this.data.currentPage]).forEach(function(base32ShortCutKey, index){
				var aSpacing = 4 - base32ShortCutKey.toString().length
				var row = `[] - ${base32ShortCutKey}` + (" ").repeat(aSpacing) + ": " + `${this.data.shortCutTable[base32ShortCutKey]}`;
				this.api.writeToGivenRow(row, (6 + index*2));
			}, this);
		},
		drawRequestedFile : function () {
			if (!this.settings.displayReqFile){
				return;
			}
			this.api.clearContiguousRows(5,this.api.getReservedRowCount()-2)
			var fileAscii = {	
				row_0 : "  ______  ",
				row_1 : " |      | ",
				row_2 : " |  ----| ",
				row_3 : " |------| ",
				row_4 : " |----- | ",
				row_5 : " |  ----| ",
				row_6 : " |------| ",
				row_7 : " |-     | ",
				row_8 : " |______| ",
			}
			var vSpacingFile = Math.floor((this.api.getReservedRowCount() - Object.keys(fileAscii).length)/2);
			var hSpacingFile = Math.floor((this.api.getRowCount() - fileAscii.row_0.length)/2);

			var name = this.data.requestedFile.name;
			if (!name){
				name = 'NAME NOT FOUND';
			}
			var words = `New Node Created : ${name}`

			var vSpacingWords = (vSpacingFile + (Object.keys(fileAscii).length + 2));
			var hSpacingWords = Math.floor(((this.api.getRowCount())-words.length)/2)

			Object.keys(fileAscii).forEach(function(rowName, index){
				this.api.writeToGivenRow((" ").repeat(hSpacingFile) + fileAscii[`row_${index}`], vSpacingFile + index);
			},this);

			this.api.writeToGivenRow((" ").repeat(hSpacingWords) + words, vSpacingWords);
		},
		drawLibraryMessage : function () {
			if (!this.settings.displayLibMessage){
				return;
			}
			var spaceCount = Math.floor((this.api.getRowCount() - (this.data.message).length)/2)
			if (spaceCount < 0){
				spaceCount = 0;
			}
			var centerSpacing = (" ").repeat(spaceCount);
			this.api.writeToGivenRow(centerSpacing + `${this.data.message}` + centerSpacing, 2);
			return;
		},
		drawWindow : function () {
			if (!this.settings.displayWindow){
				return;
			}
			this.api.writeToGivenRow(("-").repeat(this.api.getRowCount() - this.name.length) + this.name, (this.api.getReservedRowCount()-1))
			this.api.writeToGivenRow((" -").repeat(Math.floor((this.api.getRowCount())/2)), 4);
			return;

		},
		draw : function () {
			this.methods.drawWindow();
			this.methods.drawLibraryMessage();
			this.methods.drawFiles();
			this.methods.drawRequestedFile();
		},
		resetMessageToDefault : function () {
			var library = this.api.getActiveNode();
			var libraryName = library.name;
			var libraryFileCount = library.files.length
			this.data.message = `${libraryName} is currently storing ${libraryFileCount} files`
		},
		assignShortCutKeys : function (fileArray) {
			if (!fileArray){
				fileArray = [];
			}
			if (fileArray.length === 0){
				this.data.shortCutTable = {};
				return;
			}
			fileArray.forEach(function(fileName, index){
					var number = index
					this.data.shortCutTable[number.toString(32)] = fileName;
			}, this)
		},
		pageSortFileList : function () {
			const rowCount = Math.floor((this.api.getReservedRowCount() - 6)/2);
			const currentPageNum = 0;
			this.data.pages = {};
			if (Object.keys(this.data.shortCutTable).length === 0){
				return;
			}
			Object.keys(this.data.shortCutTable).forEach(function(base32ShortCutKey, index){
				if (Object.keys(this.data.pages).length === 0){
					this.data.pages[currentPageNum] = {};
				};
				if (Object.keys(this.data.pages[currentPageNum]).length === rowCount){
					currentPageNum = currentPageNum + 1;
					this.data.pages[currentPageNum] = {};
				};
				this.data.pages[currentPageNum][base32ShortCutKey] = this.data.shortCutTable[base32ShortCutKey];
			},this)

		},
		commands : {
			search : {
				name : "search",
				desc : "search this library for input text",
				syntax : "biblio search [TEXT] ...",
				ex : function (text) {
					//need ability to specify other search parameters here!
					//see Library class for details, and feel free to tack on stuff if you want more search functionality.
					if (!this.data.library.readyToAcceptCommands){
						this.methods.changeLibraryMessage(`library cannot accept commands (performing another command)`)
						return;
					}
					var fileArray = this.data.library.searchRepository(text);
					if (fileArray.length === 0){
						this.methods.changeLibraryMessage(`found ${fileArray.length} files containing term "${text}"`)
					}

					this.methods.assignShortCutKeys(false);
					this.methods.assignShortCutKeys(fileArray);
					this.methods.pageSortFileList();

					this.methods.changeLibraryMessage(`${fileArray.length} files found matching search term "${text}"`);
					this.methods.resetDisplaySettings();
					this.settings.displayPageOfFiles = true;
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
						var line = " " + commandName + (" ").repeat(8-commandName.length) + ": " + this.methods.commands[commandName].desc;
						this.api.composeText(line, true, true, 12)
					},this);
				},
			},
			request : {
				name : "request",
				desc : "request a file by name",
				syntax : "biblio request [TEXT]",
				ex : function (text) {
					var requestFile = text;
					if (!this.data.library.readyToAcceptCommands){
						this.methods.changeLibraryMessage(`library cannot accept commands (performing another command)`)
						return;
					}
					var file = this.data.library.getFile(text)
					if (file.type === 'null'){
						this.methods.changeLibraryMessage(`No file found with name ${text}`)
						return;
					}

					if (Object.keys(this.data.shortCutTable).indexOf(requestFile) !== -1){
						requestFile = this.data.shortCutTable[requestFile];
					}

					this.data.requestedFile = this.data.library.getFile(requestFile);
				
					this.methods.resetDisplaySettings();
					this.settings.displayReqFile = true;
					this.api.appendAccessibleNodes(this.data.requestedFile);
				},
			},
			next : {
				name : "next",
				desc : "request next page of file names",
				syntax : "biblio next",
				ex : function () {
					if (!this.settings.displayPageOfFiles){
						this.methods.changeLibraryMessage(`No files in ${this.name} register, cannot increment page.`);
						return;
					}
					this.methods.incrementPage();
					return;
				},
			},
			prev : {
				name : "prev",
				desc : "request previous page of file names",
				syntax : "biblio prev",
				ex : function () {
					if (!this.settings.displayPageOfFiles){
						this.methods.changeLibraryMessage(`No files in ${this.name} register, cannot decrement page.`);
						return;
					}
					this.methods.decrementPage();
					return;
				},
			},
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
				const biblio = this.installData.biblio

				if (!this.settings.isRunning){
						// this.ex will return false in case of an error throw
						// we want errorState true in this case
						biblio.errorState =	!this.ex();
					}
				const prgm = this
				biblio.cmd = command;
				biblio.arg1 = arg1;
				biblio.arg2 = arg2;
				biblio.arg3 = arg3;
				if (biblio.errorState){
					biblio.wantsMoreCommands = false;
					biblio.cmdExtVer = false;
					biblio.errorState = false;
					console.log(`early error`)
					return;
				}
				if (arguments.length === 0){
					if (!biblio.cmdExtVer){
						this.api.verifyCommand(`Would you like to run a ${this.name}-specific command?`, function(bool, toggle){
								toggle.toggle = true;
								if (!bool){
									biblio.cmdExtVer = true
									return;
								} else {
									biblio.cmdExtVer = true;
									biblio.wantsMoreCommands = true;
									return;
								}
							})
						return;
					}
					if (!biblio.wantsMoreCommands){
				
						biblio.cmdExtVer = false;
						biblio.errorState = false;
						return;
					} else {
						
						this.api.requestInput(function(commandFull){
							var inputTerms = commandFull.split(" ");
							var indexStart = 0;
							if (inputTerms[indexStart] === ""){
								indexStart = indexStart + 1;
							}
							var command = inputTerms[indexStart];
							if (!prgm.methods.commands[command]){
								prgm.api.throwError(`input command is not recognized by ${this.name} parser, try "biblio help"`)
								biblio.errorState = true;
								return;
							}
							biblio.cmd = command;
							biblio.arg1 = inputTerms[indexStart + 1] || "";
							biblio.arg2 = inputTerms[indexStart + 2] || "";
							biblio.arg3 = inputTerms[indexStart + 3] || "";

							prgm.api.runCommand(`biblio ${biblio.cmd} ${biblio.arg1} ${biblio.arg2} ${biblio.arg3}`)
							return;
						}, `Enter biblio-specific command:`)
							return;
						
					}
				};
				if (biblio.errorState){
						biblio.cmdExtVer = false;
						biblio.wantsMoreCommands = false;
						biblio.errorState = false;
						console.log(`secondary error`)
						return;
					}
				let foundRealCommand = true
				if (!this.methods.commands[biblio.cmd]){
				
					foundRealCommand = false;
					Object.keys(this.data.pseudonyms).forEach(function(recognizedCommandName){
						if (this.data.pseudonyms[recognizedCommandName].indexOf(biblio.cmd) === -1){
							return;
						};
						foundRealCommand = true;
						biblio.cmd = recognizedCommandName;
						return;
					}, this)
				}
				if (!foundRealCommand){
					this.methods.changeLibraryMessage(`command unrecognized by ${this.name} parser`)
					biblio.cmdExtVer = false;
					biblio.wantsMoreCommands = false;
					return;
				}
				if (biblio.errorState){
					biblio.cmdExtVer = false;
					biblio.wantsMoreCommands = false;
					biblio.errorState = false;
				
					return
				}
				if (!this.data.library.readyToAcceptCommands){
			
					var triggerOnReady = function () {
						prgm.methods.commands[biblio.cmd].ex(biblio.arg1,biblio.arg2,biblio.arg3)
						prgm.data.library.setTriggerOnReady(function(){});
						prgm.methods.draw();
					}
					biblio.cmdExtVer = false;
					biblio.wantsMoreCommands = false;
					this.data.library.setTriggerOnReady(triggerOnReady)
					return;
				}
			
				this.methods.commands[biblio.cmd].ex(biblio.arg1,biblio.arg2,biblio.arg3);
				this.methods.draw();
				biblio.cmdExtVer = false;
				biblio.wantsMoreCommands = false;
			},
		},
		



	},
	install : function (trmnl, callback) {
		this.trmnl = trmnl;
		trmnl.programs[this.name] = this;
		this.api = trmnl.api;
		if (callback){
			callback(this.installData);
		}
		this.isInstalled = true;
		this.data.settings = this.settings
		this.methods.data = this.data;
		this.methods.api = this.api;

		Object.keys(this.methods).forEach(function(propName){
			if (typeof this.methods[propName] !== 'function'){
				return;
			}
			this.methods[propName] = this.methods[propName].bind(this);
		}, this)

		Object.keys(this.methods.commands).forEach(function(commandName){
			this.methods.commands[commandName].ex = this.methods.commands[commandName].ex.bind(this)
		}, this)

		this.installData.biblio.ex = this.installData.biblio.ex.bind(this);

		this.api.addCommand(this.installData.biblio)
	},
	stop : function () {
		this.settings.isRunning = false;
		this.data.library.powerDown();
		this.data.library = {};
		this.api.clearReservedRows(0);
		this.api.reserveRows(0);
		this.api.unblockCommand('mv');
		this.api.clearSubmitTriggeredFunction();

	},
	ex : function (trmnl) {
		if (this.api.commandAvailCheck(`stop`)){
			this.api.runCommand('stop')
		}
			this.api.readyCommand('stop')
		var thisNode = this.api.getActiveNode();
		if (thisNode.type !== `library`){
			this.api.throwError(`${this.name} operates as a library interface; move to a library node in order to execute ${this.name} or use its command interface`)
			return false;
		}
		if (!this.api.checkIfRunning(`${this.name}`)){
			this.api.appendToRunningPrograms(`${this.name}`, false)
		}
		this.api.reserveRows(40);
		this.api.clearReservedRows();
		this.settings.isRunning = true;
		this.api.blockCommand('mv', `cannot move away from a library while ${this.name} is running`)
		this.data.library = thisNode;
		thisNode.declareApi(this.api);

		const biblio = this;
			
		thisNode.setAssemblerTrigger(function(){
			biblio.methods.resetMessageToDefault();
			biblio.methods.draw();
		});

		thisNode.setRenderTrigger(function(){
			biblio.methods.draw();
		})
		thisNode.fetchRepository();

		this.methods.resetDisplaySettings();

		this.api.setSubmitTriggeredFunction(function(){
			biblio.methods.draw()
		})

		return true;
	},
}
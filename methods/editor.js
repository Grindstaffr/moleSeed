export const program = {
	name : `editor.ext`,
	isInstalled : false,
	runsInBackGround : false,
	size : 5,
	memory : 10,
	data : {
		activeDoc : {
			name : "",
			type : "",
			line_count : 0,
			char_count : 0,
			word_count : 0,
			est_mem_use : 0,
			writable : false,
		},
		activeDocTrueAddress : "",
		cursorLocation : [0,0,0],
		inserting : false,
		shiftDown : false,
		ctrlDown : false,
		altDown : false,
		clipBoard : "",
		text : "",
		highlight : [0,0],
		prevHighlight : [0,0],
		selectedText : false,
		textWidth : 0,
		displayHeight : 0,
		colHeight : 0,
		rowWidth : 0,
		characterMatrix : [],
		displayBarWidth : 20,
		stringIndexOffset : 0,
		vRowOffset : 0,
		lastInsertIndex : 0,
		scrollBar : '',
		displayBar : {
			keyBindings : {
				'F1' : '(edit_mode) copy slctd text',
				'F2' : '(edit_mode) cut slctd text',
				'F3' : '(edit_mode) paste slctd text',
				'F4' : 'toggle_mode [slow/fast]',
				'F5' : 'toggle_mode [select/write]',
				'F6' : 'toggle_mode [edit/terminal]',
				'F7' : 'toggle sidebar_[on/off]',
				'F8' : 'cycle sidebar pages',
			},
			commands : {
				'stop' : 'stop editor.ext',
				'save' : 'update active doc',
				'open' : 'edit an accessible doc',
				'new_rdbl' : 'create new .rdbl doc',
				'new_wmt' : 'create new .wmt doc',
				'rename' : 'rename active doc',
			},
		},
	},
	settings: {
		activeTerminal : 0,
		edit_mode : false,
		slct_mode : false,
		fast_mode : false,
		side_disp : 'special_keys', 
		displaySidebar : false,
	},
	methods: {
		commands : {
			save : {
				name : "save",
				desc : "modify existing writable node/instantiate new nodelet",
				syntax : "save",
				kernelAccessVer : false,
				kernelAccess : false,
				isAvail : true,
				ex : function () {
					const saveCmd = this.methods.commands.save
					const prgm = this;
					if (!this.data.activeDocTrueAddress || this.data.activeDocTrueAddress.length === 0){
						this.api.throwError(` (editor.ext) no document to save; aborting...`);
						return;
					}
					this.api.requestKernelAccess(' (editor.ext) requesting Seed access to modify an existing document, grant access?(y/n)`', function(kernel){
						var kernel = kernel;
						if (!prgm.data.activeDocTrueAddress){
							return;
						}
						prgm.api.log(` (_Seed) access granted... saving ${prgm.data.activeDoc.name}...`)
						if (prgm.data.activeDocTrueAddress[0] !== 'x' && prgm.data.activeDocTrueAddress[0] !== 'w'){
							if (prgm.data.activeDoc.type === '.rdbl'){
							kernel.replaceWritableWithUserWritable();
							} else if (prgm.data.activeDoc.type === '.wmt'){
								kernel.replaceWormtongueWithUserWormTongue();
							}
						} else if (prgm.data.activeDocTrueAddress[0] === 'w'){

						var name = prgm.data.activeDoc.name
						var text = prgm.data.text;
						var wIndex = prgm.data.activeDocTrueAddress

						kernel.updateUserWritable(name, text, wIndex);
						prgm.api.log( `${prgm.data.activeDoc.name} saved.`)
						/*Somehow call nodeVerse.updateUser######Node
						where #### is determined by
							prgm.data.activeDoc.type
						*/
						} else if (prgm.data.activeDocTrueAddress[0] === 'x'){

							var name = prgm.data.activeDoc.name
							var text = prgm.data.text;
							var xIndex = prgm.data.activeDocTrueAddress

							kernel.updateUserWormTongue(name, text, xIndex);
							prgm.api.log( `${prgm.data.activeDoc.name} saved.`)

						}
						prgm.api.assembleAccessibleNodes();
					}, function(kernelReject){
						prgm.api.log(` (_Seed) api_axs_rjct: #0000B4`);
						prgm.api.log(`(editor.ext) seed access required to modify on-node data; aborting...`)
						return;
					});
					return;
				},

			},
			open : {
				name : "open",
				desc : "open an accessible document",
				syntax : "open [readable]",
				isAvail : true,
				ex : function (target) {
					this.installData.edit.ex(target);
				}
			},
			new_rdbl : {
				name : "new_rdbl",
				desc : "create a new .rdbl nodelet",
				syntax : "new_rdbl (text/readable)",
				kernelAccessVer : false,
				kernelAccess : false,
				docName : "",
				docBody : "",
				isAvail : true,
				ex : function (text) {
					const newRdblCmd = this.methods.commands.new_rdbl
					const prgm = this;
					var isNewName = true;
					var docBody = "";
					var accessibleNodes = this.api.getAccessibleNodes()
					var accessibleNodesList = Object.keys(accessibleNodes);
					if (accessibleNodesList.includes(text)){
						isNewName = false;
						newRdblCmd.docName = text.split('.rdbl')[0] + '_copy' + '.rdbl';
						if (newRdblCmd.docBody.length === 0){
							accessibleNodes[text].read(function(textBody, docNode){
								newRdblCmd.docBody = textBody;
								prgm.api.runCommand(`new_rdbl ${text}`)
							})
							return;
						}
					}
					if (text !== undefined && text.length >= 1 && isNewName){
						text = text.split('.')[0]
						text = text.split(" ");
						text = text.join("_").substring(0,12);
						newRdblCmd.docName = text;
					}
					var nameMatches = accessibleNodesList.filter(function(nodeName){
						var nodeNameNoFileExt = nodeName.split('.')[0]
						if (nodeNameNoFileExt === newRdblCmd.docName.split('.')[0]){
							return true;
						} else {
							return false;
						}
					})
					if (nameMatches.length >= 1){
						prgm.api.warn(`An accessible node already exists with name = ${nameMatches[0]}... try another name.`);
						newRdblCmd.docName = "";
					} 
					if (newRdblCmd.docName.length === 0){
						this.api.requestInput(function(commandFull){
							var inputTerms = commandFull.split(" ")
							var fullInput = inputTerms.join("_").substring(0,12);
							if (fullInput === 'stop'){
								return;
							}
							prgm.api.runCommand(`new_rdbl ${fullInput}`)
						}, " Enter name for new .rdbl file:")
						return;
					};
					this.api.requestKernelAccess(` (editor.ext) requests seed access to instantiate a new nodelet, grant access?(y/n)`, function(kernel){
						var activeNode = prgm.api.getActiveNode();
						var activeNodeTrueAddress = activeNode.getTrueAddress();
						prgm.api.log (' (_Seed) access granted... creating node...');
						try{
							kernel.appendUserWritable(activeNodeTrueAddress, newRdblCmd.docName, newRdblCmd.docBody);
						} catch (error) {
							prgm.api.throwError( `(_Seed) cmd_rjct: #1F44B2`);
							throw new Error(error);
							return;
						}
						prgm.api.assembleAccessibleNodes();
						var newAccessibleNodes = prgm.api.getAccessibleNodes();
						var newAccessibleNodesList = Object.keys(newAccessibleNodes);
						var finalDocName = newRdblCmd.docName.split(".rdbl")[0].substring(0,16) + ".rdbl";
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
						newAccessibleNodes[finalDocName].text = newRdblCmd.docBody
						newRdblCmd.docBody = "";
						newRdblCmd.docName = "";
						prgm.installData.edit.ex(finalDocName);
					}, function(kernelReject){
						prgm.api.log(` (_Seed) api_axs_rjct: #0000B4`);
						newRdblCmd.kernelAccessVer = false;
						newRdblCmd.kernelAccess = false;
						newRdblCmd.docBody = "";
						newRdblCmd.docName = "";
						prgm.api.log(` (editor.ext) seed access required to instantiate new nodes. Aborting "new_rdbl"...`);
						return;
					})
					return;

				/*
					if (!newRdblCmd.kernelAccessVer){
						this.api.warn(` Do not grant seed access to untrusted programs`)
						this.api.bufferCommand(`new_rdbl ${newRdblCmd.docName}`)
						this.api.verifyCommand(` editor.ext is requesting seed access to instantiate a new nodelet, grant access?`, function(bool, toggle, avoidPop){
							avoidPop.avoidPop = false;
							toggle.toggle = true;
							if (!bool){
								newRdblCmd.kernelAccessVer = true;
							} else {
								newRdblCmd.kernelAccessVer = true;
								newRdblCmd.kernelAccess = true;
							}
							
						})
						return;
					}
					if (newRdblCmd.kernelAccessVer && newRdblCmd.kernelAccess) {
						newRdblCmd.kernelAccessVer = false;
						newRdblCmd.kernelAccess = false;
						var activeNode = this.api.getActiveNode();
						var activeNodeTrueAddress = activeNode.getTrueAddress();
						var kernel = activeNode._meta._meta._meta.getKernelAccess();
						this.api.log('creating node...')
						try {
							kernel.appendUserWritable(activeNodeTrueAddress, newRdblCmd.docName, newRdblCmd.docBody);
						} catch (error) {
							this.api.throwError(`seed_failure: errorCode #1F44B2`);
							throw new Error(error)
							return;
						}
						this.api.assembleAccessibleNodes();
						var finalDocName = newRdblCmd.docName.substring(0,16) + ".rdbl";
						var newAccessibleNodes = this.api.getAccessibleNodes();
						var newAccessibleNodesList = Object.keys(this.api.getAccessibleNodes())
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
						this.api.log(`${finalDocName} sprouted at ${activeNode.address}`);

						newAccessibleNodes[finalDocName].text = newRdblCmd.docBody
						newRdblCmd.docBody = "";
						newRdblCmd.docName = "";
						this.installData.edit.ex(finalDocName);

					} else {
						newRdblCmd.kernelAccessVer = false;
						newRdblCmd.kernelAccess = false;
						newRdblCmd.docBody = "";
						newRdblCmd.docName = "";
						this.api.log(`seed access required to instantiate new nodes. Aborting "new_rdbl"...`);
						return;
					}*/ 
					//This is where the old non-callback variety of requestKernel was stored.
				},

			},
			new_wmt : {
				name : "new_wmt",
				desc : "create a new .wmt nodelet",
				syntax : "new_wmt",
				kernelAccessVer : false,
				kernelAccess : false,
				isAvail : true,
				ex : function () {
					const newWmtCmd = this.methods.commands.new_wmt;
					const prgm = this;
					if (!newWmtCmd.kernelAccessVer){
						this.api.warn(` Do not grant seed access to untrusted programs`)
						this.api.verifyCommand(` (editor.ext) requests seed access to instantiate a new nodelet, grant access?`, function(bool, toggle, avoidPop){
							toggle.toggle = true;
							avoidPop.avoidPop = true;
							if (!bool){
								newWmtCmd.kernelAccessVer = true;
							} else {
								newWmtCmd.kernelAccessVer = true;
								newWmtCmd.kernelAccess = true;
							}
						})
						return;
					}
					if (newWmtCmd.kernelAccess) {
						newWmtCmd.kernelAccessVer = false;
						newWmtCmd.kernelAccess = false;
					} else {
						this.api.log(`(editor.ext) seed access required to instantiate new nodes. Aborting "new_wmt"...`);
						return;
					}
				},

			},
			rename : {
				name : "rename",
				desc : "rename the active doc",
				syntax : "rename [text]",
				isAvail : true,
				ex : function (newName) {
					var existingName = this.data.activeDoc.name;
					if (newName.length < 1){
						this.api.throwError(` (editor.ext) cannot rename "${existingName}" to "${newName}"... nameLength must be >= 1`);
						return;
					}
					var accessibleNodesList = Object.keys(this.api.getAccessibleNodes());
					if (accessibleNodesList.includes(newName)){
						this.api.throwError(`(editor.ext) cannot rename "${existingName}" to "${newName}"... ${newName} is already a pointer`);
						return;
					}
					this.data.activeDoc.name = newName;
					this.api.log(` (editor.ext) changed ${existingName} to ${newName}`)
					this.api.warn(` (editor.ext) name changes are not persistent without calling "save"`);

				},

			},
		},
		usingKeyUpHandling : function () {
			return true;
		},
		alternateKeyRouterActive : function () {
			return true;
		},
		keyStrokeRouter : {
			'8' : function (e) {
				if (this.settings.slct_mode){
					this.methods.multiDelete();
				} else {
					this.methods.deleteLetter();
				}
				//backspace
			},
			'9' : function (e) {
				if (this.settings.slct_mode){

				} else {
					this.methods.writeToText('\\t')
				}
			},
			'13' : function (e) {
				if (this.settings.slct_mode){

				} else {
					this.methods.writeToText('\\n')
				}
			},
			'16' : function (e) {
				//shift
				
			},
			'17' : function (e) {
				//ctrl
				
			},
			'18' : function (e) {
				//alt
				
				
			},
			'37' : function (e) {
				if (!this.settings.fast_mode){
					this.methods.handleCursorLeft();
				} else {
					this.methods.handleCursorLeft();
					this.methods.handleCursorLeft();
					this.methods.handleCursorLeft();
					this.methods.handleCursorLeft();
				}
			},
			'38' : function (e) {
				if (!this.settings.fast_mode){
					this.methods.handleCursorUp();
				} else {
					this.methods.handleCursorUp();
					this.methods.handleCursorUp();
					this.methods.handleCursorUp();
					this.methods.handleCursorUp();
				}
			},
			'39' : function (e) {
				if (!this.settings.fast_mode){
					this.methods.handleCursorRight();
				} else {
					this.methods.handleCursorRight();
					this.methods.handleCursorRight();
					this.methods.handleCursorRight();
					this.methods.handleCursorRight();
				}
			},
			'40' : function (e) {
				if (!this.settings.fast_mode){
					this.methods.handleCursorDown();
				} else {
					this.methods.handleCursorDown();
					this.methods.handleCursorDown();
					this.methods.handleCursorDown();
					this.methods.handleCursorDown();
				}
			},
			'112' : function (e) {
				this.methods.copy();
			},
			'113' : function (e) {
				this.methods.cut();
			},
			'114' : function (e) {
				this.methods.paste();
			},
			'115' : function (e) {
				if (!this.settings.isRunning){
					return;
				}
				this.methods.toggleFastMode();
			},
			'116' : function (e) {
				if (!this.settings.isRunning){
					return;
				}
				this.methods.toggleSelectMode();
			},
			'117' : function (e) {
				if (!this.settings.isRunning){
					return;
				}
				this.methods.toggleEditMode();
				return;
			},
			'118' : function (e) {
				if (!this.settings.isRunning){
					return;
				}
				this.methods.toggleSideBar();
			},
			'119' : function (e){
				if (!this.settings.isRunning){
					return;
				}
				this.methods.cycleSidebarDisplay();
			},
			generalCase : function (e) {
				var value = e.key.toString();
				if (!this.settings.slct_mode){
					this.methods.writeToText(value);
				}
			},

		},
		routeKeyStroke: function (e) {
			e.preventDefault();
			if (!this.settings.edit_mode){
				if (e.keyCode === 117){
					this.methods.keyStrokeRouter['117'](e);
					if (this.settings.displaySidebar){
						this.methods.drawDisplayBar();
					}
					if (this.settings.slct_mode){
						this.methods.drawHighlight();
					}
					this.methods.drawScrollBar();
					this.methods.drawWindow();
					return;
				}
				this.api.useDefaultKeyRouter(e);
				return;
			}
			if (Object.keys(this.methods.keyStrokeRouter).includes(e.keyCode.toString())){
				this.methods.keyStrokeRouter[e.keyCode.toString()](e);
			} else {
				this.methods.keyStrokeRouter.generalCase(e);
			}
			if (this.settings.displaySidebar){
				this.methods.drawDisplayBar();
			}
			if (this.settings.slct_mode){
				this.methods.drawHighlight();
			}
			this.methods.drawScrollBar();
			this.methods.drawWindow();
		},
		routeKeyUp : function (e) {
			
		},
		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		                    TOGGLEFUNCTIONS
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		toggleEditMode : function () {
			var docName = this.data.activeDoc.name;
			var docText = this.data.text;
			var prgm = this;
			if (this.settings.edit_mode == true){
				this.settings.edit_mode = false;
				this.api.restoreDefaultCursorPosition();
			} else if (this.settings.edit_mode == false){
				if (!this.data.activeDoc.writable){
					if (this.data.activeDoc.name === "null" && this.data.activeDoc.type === "undefined"){
						this.api.runCommand('new_rdbl');
						return;
					}
					this.methods.cloneReadOnly(docName);
					return;
				} 
				this.settings.edit_mode = true;
				if (!this.settings.displaySidebar){
					this.methods.toggleSideBar();
				}
				this.methods.inititalizeCursorPosition();
				var coordinates = this.methods.convertCursorLocationToXY();
				this.api.positionCursor(coordinates[0], coordinates[1]);
			} else {
				this.api.runCommand(`stop`);
				this.api.throwError(`editor.ext crashed with status: editMode = ${this.settings.edit_mode}`)
			}
		},
		toggleFastMode : function () {
			if (this.settings.fast_mode){
				this.settings.fast_mode = false;
			} else if (!this.settings.fast_mode) {
				this.settings.fast_mode = true;
			}
		},
		toggleSelectMode : function () {
			if (this.settings.slct_mode){
				this.settings.slct_mode = false;
				this.methods.clearHighlight();
			} else if (!this.settings.slct_mode){
				this.settings.slct_mode = true;
				this.data.highlight[0] = this.data.cursorLocation[2];
				this.data.highlight[1] = this.data.cursorLocation[2];
			}
		},
		toggleSideBar : function () {
			if (this.settings.displaySidebar){
				this.settings.displaySidebar = false;
				this.methods.clearDisplayBar();
				this.methods.initializeDimensions();
				this.methods.repositionCursor();
				if (this.settings.slct_mode){
					this.api.clearHighlights();
					this.methods.drawHighlight();
				}
			} else if (!this.settings.displaySidebar){
				this.settings.displaySidebar = true;
				this.methods.initializeDimensions();
				this.methods.repositionCursor();
				if (this.settings.slct_mode){
					this.api.clearHighlights();
					this.methods.drawHighlight();
				}
				this.methods.drawDisplayBar();
			} else {
				this.api.runCommand(`stop`);
				this.api.throwError(`editor.ext crashed with status: displaySideBar = ${this.settings.displaySidebar}`)
			}

		},
		cycleSidebarDisplay : function () {
			var options = ['special_keys', 'commands', 'doc_data'];
			var currentIndex = options.indexOf(this.settings.side_disp);
			currentIndex += 1;
			if (currentIndex === options.length){
				currentIndex = 0;
			}
			this.settings.side_disp = options[currentIndex];
			return;
		},
		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			DOC CREATION FUNCTIONS
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		cloneReadOnly : function (name){
			const prgm = this;
			var message = ` Document:${name} has property read_only=true; Would you like to create a writable copy?`
			const verifyFunc = function (bool, toggle, avoidPop){
				if (bool) {
					prgm.api.bufferCommand(`new_rdbl ${name}`);
					toggle.toggle = true;
				} else {
					prgm.api.bufferCommand("");
					toggle.toggle = true;
				}
			}
			this.api.verifyCommand(message, verifyFunc);
		},
		createNewRdbl : function (name, text, verBool, altMessage) {
			const prgm = this;
			var newNodeName = name;
			var newNodeText = text;
			var isNewName = true;
			if (!verBool){
				var message = ` Document:${newNodeName} has property read_only=true; Would you like to create a writable copy?`
				if (altMessage && (typeof altMessage === 'string')){
					message = altMessage;
				}
				const verifyFunc = function (bool, toggle, avoidPop) {
					avoidPop.avoidPop = true;
					toggle.toggle = false;
					if (bool){
						this.methods.createNewRdbl(newNodeName, newNodeText, true)
						return;
					} else {
						return;
					}
				}.bind(prgm)
				prgm.api.bufferCommand(`new_rdbl ${newNodeName}`);
				prgm.api.verifyCommand(message, verifyFunc)
				return;
			}

			var accessibleNodes = this.api.getAccessibleNodes();
			var accessibleNodesList = Object.keys(accessibleNodes);
			if (accessibleNodesList.includes(name)){
				isNewName = false;
				newNodeName = name.split('.rdbl')[0] + '_copy' + '.rdbl';
			}

			this.api.requestKernelAccess('(editor.ext) requests seed access to instantiate a new nodelet, grant access?(y/n)', function(kernel){
				var activeNode = prgm.api.getActiveNode();
				var activeNodeTrueAddress = activeNode.getTrueAddress();
				prgm.api.log (' (_Seed) access granted... creating node...');
				try{
					kernel.appendUserWritable(activeNodeTrueAddress, newNodeName, newNodeText);
				} catch (error) {
					prgm.api.throwError( `(_Seed) cmd_rjct: #1F44B2`);
					throw new Error(error);
					return;
				}
				prgm.api.assembleAccessibleNodes();
				var newAccessibleNodes = prgm.api.getAccessibleNodes();
				var newAccessibleNodesList = Object.keys(newAccessibleNodes);
				var finalDocName = newNodeName.split(".rdbl")[0].substring(0,16) + ".rdbl";
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
				newAccessibleNodes[finalDocName].text = newNodeText
				prgm.installData.edit.ex(finalDocName);
			}, function(kernelReject){
				prgm.api.log(` (_Seed) api_axs_rjct: #0000B4`);
				prgm.api.log(` (editor.ext) seed access required to instantiate new nodes. Aborting "new_rdbl"...`);
			})
			
			//Herein Lies old form... 
			/*this.api.requestInput(function(commandFull){
				;
				console.log(commandFull)
				if (commandFull === 'y'){
					var activeNode = prgm.api.getActiveNode();
					var activeNodeTrueAddress = activeNode.getTrueAddress();
					var kernel = activeNode._meta._meta._meta.getKernelAccess();
					prgm.api.log(' creating node...')
					try {
						kernel.appendUserWritable(activeNodeTrueAddress, newNodeName, newNodeText);
					} catch (error) {
						prgm.api.throwError(`seed_failure: errorCode #1F44B2`);
						throw new Error(error)
						return;
					}
					prgm.api.assembleAccessibleNodes();

					var finalDocName = newNodeName.substring(0,16) + ".rdbl";
					var newAccessibleNodesList = Object.keys(prgm.api.getAccessibleNodes())
					newAccessibleNodesList = newAccessibleNodesList.filter(function(nodeName){
						if (accessibleNodesList.includes(nodeName)){
							return false;
						} else {
							return true;
						}
					})
					if (newAccessibleNodesList.length === 1){
						finalDocName = newAccessibleNodesList[0];
						console.log(finalDocName)
					} else {
						;
					}
					if (isNewName){
						prgm.api.log(` ${finalDocName} sprouted at ${activeNode.address}`);
					} else {
						prgm.api.log(` ${finalDocName} sprouted at ${activeNode.address}`);
					}
					prgm.api.getAccessibleNodes()[finalDocName].text = newNodeText;	
					prgm.installData.edit.ex(finalDocName);
				} else if (commandFull = 'n'){
					prgm.api.log(`seed access required to instantiate new nodes. Aborting "new_rdbl"...`);
					return;
				} else {
					prgm.api.log(`seed access required to instantiate new nodes. Aborting "new_rdbl"...`);
					return;
				}
			},' editor.ext is requesting seed access to instantiate a new nodelet, grant access?(y/n)')*/
			return;
		},

		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			TEXT EDIT FUNCTIONS
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		writeToText : function (value) {
		
			var lastLoc = this.data.lastInsertIndex
			var insertLocation = this.data.cursorLocation[2];
			if (insertLocation === undefined || insertLocation === 0){
			
			}

			if (insertLocation === this.data.text.length){
				this.data.text += value;
			} else {
				var prepend = this.data.text.substring(0, insertLocation)
				var postpend = this.data.text.substring(insertLocation);
				this.data.text = prepend + value + postpend;
			}
			var currentRow = this.data.cursorLocation[0];
			var currentCol = this.data.cursorLocation[1];
			var currentStringIndex = this.data.cursorLocation[2];
			var cell = this.data.characterMatrix[currentRow][currentCol];
		

			this.methods.recomposeText();

			if (value.length === 1){
				this.methods.incrementCursorLocation();
			} else if (value.length > 1){
				if (value === '\\n'){
					//this.methods.incrementCursorLocation();
				}
				this.methods.incrementCursorLocation();
			}
			var coordinates = this.methods.convertCursorLocationToXY()
			this.api.positionCursor(coordinates[0], coordinates[1]);
			this.methods.updateActiveDoc();
		
		},
		deleteLetter : function () {
			var currentIndex = this.data.cursorLocation[2];
			this.methods.decrementCursorLocation();
			var deleteLocation = this.data.cursorLocation[2];
			if(currentIndex === deleteLocation){
				//case: could not Decrement -> early return;
				return;
			}
			var currentRow = this.data.cursorLocation[0];
			var currentCol = this.data.cursorLocation[1]
			var cell = this.data.characterMatrix[currentRow][currentCol];

			if (cell.length > 1){
				if (this.data.text.length === deleteLocation + 2){
					this.data.text = this.data.text.substring(deleteLocation + 2);
				} else if (deleteLocation === 0) {
					this.data.text = this.data.text.substring(deleteLocation + 2);
				} else {
					var prepend = this.data.text.substring(0,deleteLocation);
					var postpend = this.data.text.substring(deleteLocation + 2);
					this.data.text = prepend + postpend;
				}
			} else {
				if (this.data.text.length === deleteLocation + 1){
					this.data.text = this.data.text.substring(0,deleteLocation);
				} else {
					var prepend = this.data.text.substring(0,deleteLocation);
					var postpend = this.data.text.substring(deleteLocation + 1);
					this.data.text = prepend + postpend;
				}
			}

			//STILL NEEDS HANDLING FOR DELETING \\n and \\t
			if (cell.length > 1){
				//this.methods.decrementCursorLocation();
			} else if (cell.length === 1){
			}

			var oldLength = this.data.characterMatrix.length;
			this.methods.recomposeText();
			if (this.data.characterMatrix.length < oldLength){
				for (var i = oldLength ; i >=this.data.characterMatrix.length; i--) {
					this.api.writeToGivenRow("", i)
				}
			}
			var coordinates = this.methods.convertCursorLocationToXY()
			this.api.positionCursor(coordinates[0], coordinates[1]);
			this.methods.reacquireStringIndex();
			this.methods.updateActiveDoc();
		
		},
		multiDelete : function () {
			console.log('multiDelete')
			var deleteStartIndex = this.data.highlight[0];
			var deleteEndIndex = this.data.highlight[1];
			console.log(this.data.text)
			var prepend = this.data.text.substring(0, Math.min(deleteStartIndex,deleteEndIndex));
			var postpend = this.data.text.substring(Math.max(deleteEndIndex, deleteStartIndex) + 1);

			this.data.text = prepend + postpend;
			console.log(this.data.text);
			if (deleteEndIndex >= deleteStartIndex){
				for (var i = 0; i < Math.abs(this.data.highlight[0] - this.data.highlight[1]); i++){
					this.methods.decrementCursorLocation();
				}
			}
			this.methods.toggleSelectMode();
			this.methods.recomposeText();
			this.methods.positionTerminalCursor();
			this.methods.updateActiveDoc();
		},
		copy : function () {
			if (this.settings.slct_mode){
				this.methods.toggleSelectMode();
			} else {
				return;
			}
			this.data.clipBoard = this.data.text.substring(this.data.highlight[0], this.data.highlight[1]);
			this.methods.updateActiveDoc();
		},
		cut : function () {
			if (this.settings.slct_mode){
				this.methods.toggleSelectMode();
			} else {
				return;
			}
			var pointA = Math.min(this.data.highlight[0], this.data.highlight[1]);
			var pointB = Math.max(this.data.highlight[0], this.data.highlight[1]);


			this.data.clipBoard = this.data.text.substring(pointA, pointB);
			var prepend = this.data.text.substring(0, pointA);
			var postpend = this.data.text.substring(pointB);

			this.data.text = prepend + postpend;
			this.methods.recomposeText();
			if (this.data.highlight[1] >= this.data.highlight[0]){
				for (var i = 0; i < this.data.clipBoard.length; i++){
					this.methods.decrementCursorLocation();
				}
			}
			this.methods.positionTerminalCursor();
			this.methods.updateActiveDoc();
			//this.data.cursorLocation[2] -= this.data.clipBoard.length;
		},
		paste : function () {
			var insertLocation = this.data.cursorLocation[2];
			if (insertLocation === this.data.text.length){
				this.data.text += this.data.clipBoard;
			} else {
				var prepend = this.data.text.substring(0, insertLocation);
				var postpend = this.data.text.substring(insertLocation);
				this.data.text = prepend + this.data.clipBoard + postpend;
				//this.data.cursorLocation[2] += this.data.clipBoard.length;
			};
			this.methods.recomposeText();
			for (var i = 0; i < this.data.clipBoard.length; i++){
				this.methods.incrementCursorLocation();
			}
			this.methods.positionTerminalCursor();
			this.methods.updateActiveDoc();
		},
		reconstructCharacterMatrix : function () {
			this.data.characterMatrix = [];
			this.methods.appendRowToCharacterMatrix();
			this.methods.composeText();
		},
		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		Compose FUNCTIONSS BEGIN
		scaling functions Begin
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		filterText : function () {
			var string = this.data.text;
			string = string.replaceAll('\n','');
			string = string.replaceAll('\t','');
			if(string.length < this.data.text){
				this.data.text = string;
			} else {
				string = this.data.text.split('\n').join('').split('\t').join('');
				this.data.text = string;
			}
			this.data.text += ' ';
		},
		recomposeText : function () {
			this.data.characterMatrix = [];
			this.methods.composeText();
			this.methods.composeFromCharMatrix();
			return;
		},
		composeText : function () {
			var string = this.data.text;
			var currentRow = 0;
			var currentCol = -1;
			var prevCharBackslash = false;
			var prevCharBullshit = false;
			for (var i = 0; i < string.length; i++) {
				if (!this.data.characterMatrix[currentRow]){
					this.methods.appendRowToCharacterMatrix();
				}
				if (!prevCharBackslash && !prevCharBullshit){
					currentCol += 1;
				}
				if (prevCharBullshit){
					prevCharBullshit = false;
				}
				if (currentCol >= (this.data.textWidth)){
					currentCol = 0;
					if (this.settings.doubleSpacing){
							currentRow += 2;
							this.methods.appendRowToCharacterMatrix();
							this.methods.appendRowToCharacterMatrix();
						} else {
							currentRow += 1;
							this.methods.appendRowToCharacterMatrix();
						}
				} else if (!string[i] || string[i] === undefined || string[i] === "" || string[i] === '\n' || string[i] === '\t') {
					prevCharBullshit = true;
					continue;
				}else if (string[i] === '\\'){
					prevCharBackslash = true;
					this.data.characterMatrix[currentRow][currentCol][0] = i;
					continue;
				} else if (prevCharBackslash) {
					if (string[i] === 'n'){
						prevCharBackslash = false;
						this.data.characterMatrix[currentRow][currentCol][1] = i
						this.data.characterMatrix[currentRow][currentCol][2] = 0;
						if (this.settings.doubleSpacing){
							currentRow += 2;
							this.methods.appendRowToCharacterMatrix();
							this.methods.appendRowToCharacterMatrix();
						} else {
							currentRow += 1;
							this.methods.appendRowToCharacterMatrix();
						}
						currentCol = -1;
						continue;
					} else if (string[i] === 't'){
						this.data.characterMatrix[currentRow][currentCol][1] = i
						this.data.characterMatrix[currentRow][currentCol][2] = 4
						for (var j = 1; j < this.data.characterMatrix[currentRow][currentCol][2]; j++) {
							this.data.characterMatrix[currentRow][currentCol + j][0] = " ";	
						};
						currentCol += 3
						prevCharBackslash = false;
						continue;
					}
					prevCharBackslash = false;
				}
				this.data.characterMatrix[currentRow][currentCol][0] = i
			}

		},
		appendRowToCharacterMatrix : function () {
			var row = new Array(this.data.textWidth)
			for (var i = 0; i < row.length; i++) {
				var newArray = [];
				row[i] = newArray;
			}
			this.data.characterMatrix.push(row);
		},
		composeFromCharMatrix : function () {
			var prevCharBackslash = false;
			var lineBreak = false;
			var pageBreak = false;
			var rowOffset = 0;
			var colOffset = 1;
			var bufferCellsRemaining = 0;
			this.data.characterMatrix.slice(this.data.vRowOffset, this.data.vRowOffset + (this.data.displayHeight - 1)).forEach(function(row, rowIndex){
				row.forEach(function(cell, colIndex){
					var rowTranslate = rowIndex + rowOffset;
					var colTranslate = colIndex + colOffset;
					if (lineBreak || pageBreak){
						console.log(`rowlength == ${row.length} RI == ${rowIndex}, CI == ${colIndex}`)
						if (colIndex === row.length - 1){
							lineBreak = false;
						}
						this.api.writeToCoordinate("", rowTranslate, colTranslate)
						return;
					
					}
					if (cell.length === 0){
						this.api.writeToCoordinate("", rowTranslate, colTranslate)
						return;
					}
					if (cell[0] === undefined){
						this.api.writeToCoordinate("", rowTranslate, colTranslate)
						return
					}
					var character = ""
					if (cell.length > 1){
						this.api.writeToCoordinate(" ", rowTranslate, colTranslate);
					}
					if (cell[0] !== " " ){
						var character = this.data.text[parseInt(cell[0])]
						//console.log(`rowINdex = ${rowIndex} colIndex = ${colIndex}  cellValue = ${cell[0]} character : ${character}`)
					} else {
						character = " ";
					}
					if (!character || character === undefined || character === "" || character === '\n' || character === '\t'){
						this.api.writeToCoordinate("", rowTranslate, colTranslate)
						return;
					} else if (character === "\\"){
						//prevCharBackslash = true;
						this.api.writeToCoordinate("", rowTranslate, colTranslate)
						return;
					} /*else if (prevCharBackslash){
						if (character === "n"){
							prevCharBackslash = false;
							this.api.writeToCoordinate("", rowTranslate, colTranslate)
							//lineBreak = true;
							return;
						}
						if (character === "p"){
							prevCharBackslash = false;
							this.api.writeToCoordinate("", rowTranslate, colTranslate)
							//pageBreak = true;
							return;
						}
						if (character === "t"){
							prevCharBackslash = false;
							this.api.writeToCoordinate("", rowTranslate, colTranslate)
							return;
						}
						prevCharBackslash = false;
					}*/

					this.api.writeToCoordinate(character, rowTranslate, colTranslate)
				},this)
			},this)
		},
		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		Compose FUNCTIONSS END
		scaling functions Begin
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		setTextWidth : function () {
			this.data.textWidth = this.api.getRowCount() - 3;
			if (this.settings.displaySidebar){
				this.data.textWidth -= (this.data.displayBarWidth);
			};
			console.log(this.data.textWidth)
			return;
		},
		setDisplayHeight : function () {
			this.data.displayHeight = this.api.getRowCount() - 8;
			return;
		},
		reserveRows : function () {
			this.api.reserveRows(this.data.displayHeight);
			this.api.clearReservedRows();
		},
		initializeDimensions : function () {
			this.methods.setTextWidth();
			this.methods.setDisplayHeight();
			this.methods.reserveRows();
			this.methods.clearTextZone();
			this.methods.recomposeText();
		},
		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		      DRAW FUNCTIONS
                      ||
		      marker?\||/
			  ________\/_______
              |________________[D,   n
		                          \_/
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		clearTextZone : function () {
			var rightEdge = this.data.textWidth + 2;
			for (var i = 0; i < rightEdge; i++){
				for (var j = 0; j < this.data.displayHeight -1; j ++)
					this.api.writeToCoordinate("", j,i)
			}
		},
		clearDisplayBar : function () {
			var rightEdge = this.api.getRowCount() -1;
			var startIndex = rightEdge - 20;
			var height = this.data.displayHeight;

			for (var i = 0; i < height; i++) {
				for (var j = startIndex; j <= rightEdge; j++) {
					this.api.writeToCoordinate("", i, j);
				}
			}
		},
		clearHighlight : function () {
			this.api.clearHighlights();
		},
		drawHighlight : function () {
			if (!this.settings.slct_mode){
				return;
			}

			var situtation = 'A';

			var shouldUnhighlight = false;
			var shouldRerun = false;
			var skipDiff = false;

			var pointA = this.data.highlight[0];
			var pointB = this.data.highlight[1];

			var prevA = this.data.prevHighlight[0];
			var prevB = this.data.prevHighlight[1];

			if (pointA > pointB){
				if (prevA < prevB){
					this.api.clearHighlights();
					skipDiff = true;
				}
			} else if (pointB > pointA){
				if (prevB < prevA){
					this.api.clearHighlights();
					skipDiff = true;
				}
			} 
			if (!skipDiff){
				if (pointA > pointB){
					if (prevB > pointB){
						pointA = pointB;
						pointB = prevB;
					} else if (prevB < pointB) {
						pointA = prevB;
						pointB = pointB;
						shouldUnhighlight = true;
						situtation = 'B';
					} else if (pointB === prevB){

					}
				} else if (pointB > pointA){
					if (prevB > pointB){
						pointA = pointB;
						pointB = prevB;
						shouldUnhighlight = true;
						situtation = 'C'
					} else if (pointB > prevB) {
						pointA = prevB;
						pointB = pointB;
						situtation = 'D'
					} else if (pointB === prevB){

					}
				} else if (pointA === pointB){
					this.api.clearHighlights();

				}
			}

	
			var initialRow = -1;
			var terminalRow = -1;

			if (pointA === 719 || pointB === 719){
				;
			}

			var coordinatesA = this.methods.getCoordinatesFromStringIndex(pointA);
			var coordinatesB = this.methods.getCoordinatesFromStringIndex(pointB);

			initialRow = Math.min(coordinatesA[0], coordinatesB[0]);
			terminalRow = Math.max(coordinatesA[0], coordinatesB[0]);

			var initialColumn = Math.min(coordinatesA[1], coordinatesB[1]);
			var terminalColumn = Math.max(coordinatesA[1], coordinatesB[1]);

			if (coordinatesA[0] < coordinatesB[0]){
				initialColumn = coordinatesA[1];
				terminalColumn = coordinatesB[1];
			} else if (coordinatesB[0] < coordinatesA[0]){
				initialColumn = coordinatesB[1];
				terminalColumn = coordinatesA[1];
			}

			initialRow -= this.data.vRowOffset;
			terminalRow -= this.data.vRowOffset;
			//console.log(`irow: ${initialRow}, iCol: ${initialColumn}, trow: ${terminalRow}, tcol:${terminalColumn}`);

			
			if (shouldUnhighlight){
				if (initialRow === terminalRow){
					if (initialColumn === terminalColumn){
						this.api.unhighlightCell(initialRow, initialColumn + 1);
						this.data.prevHighlight = [this.data.highlight[0],this.data.highlight[1]];
						if (shouldRerun){
							console.log(`rerunning`)
							this.methods.drawHighlight();
						}
						return;
					}
					if (terminalColumn === initialColumn + 1 || terminalColumn === initialColumn - 1){




						if (this.data.highlight[1] < this.data.highlight[0]){
							this.api.unhighlightCell(initialRow, terminalColumn);
						} else {
							this.api.unhighlightCell(initialRow, terminalColumn + 1)
						}
						this.data.prevHighlight = [this.data.highlight[0],this.data.highlight[1]];
						if (shouldRerun){
							console.log(`rerunning`)
							this.methods.drawHighlight();
						}
						return;
					}
					for (var k = this.data.textWidth -1; k >=0; k --){
						if (k > terminalColumn){
							continue;
						} else if (k <= initialColumn){
							break;
						}
						this.api.unhighlightCell(terminalRow, (k+1));
					}
					this.data.prevHighlight = [this.data.highlight[0],this.data.highlight[1]];
					if (shouldRerun){
						console.log(`rerunning`)
						this.methods.drawHighlight();
					}
					return;
				}
				if (this.data.highlight[1] < this.data.highlight[0]){
					console.log('debug at pb < pA')
					for (var i = initialRow; i <= terminalRow; i++){
						for (var j = 0; j < this.data.textWidth ; j ++){
							if (i === initialRow && j < initialColumn){
								continue;
							}; 
							if (i === terminalRow && j >= terminalColumn){
								break;
							};
		
							this.api.unhighlightCell(i,(j + 1))
						}
					}
					this.data.prevHighlight = [this.data.highlight[0],this.data.highlight[1]];
					if (shouldRerun){
						console.log(`rerunning`)
						this.methods.drawHighlight();
					}
					return;
				} else {
					for (var i = terminalRow; i >= initialRow; i--){
						for (var j = this.data.textWidth - 1; j >=0; j--){
							if (i === terminalRow && j > terminalColumn){
								continue;
							};
							if (i === initialRow && j < initialColumn){
								break;
							}; 
		
							this.api.unhighlightCell(i,(j + 1))
						}
					}
					this.data.prevHighlight = [this.data.highlight[0],this.data.highlight[1]];
					if (shouldRerun){
						console.log(`rerunning`)
						this.methods.drawHighlight();
					}
					return;
				}
			} else {
				//console.log(`irow=(${initialRow}) trow=(${terminalRow}) icol=(${initialColumn}) tcol=(${terminalColumn}) `)
					for (var i = initialRow; i <=terminalRow; i++){
						for (var j = 0; j < this.data.textWidth ; j ++){
							if (i === initialRow && j < initialColumn){
								continue;
							};
							if (i === terminalRow && j >= terminalColumn){
								break;
							}; 
							this.api.highlightCell(i,(j + 1))
						}
					}
					this.data.prevHighlight = [this.data.highlight[0],this.data.highlight[1]];
					if (shouldRerun){
						console.log(`rerunning`)
						this.methods.drawHighlight();
					}
					return;

			
			}
			

			this.data.prevHighlight = [this.data.highlight[0],this.data.highlight[1]];
			if (shouldRerun){
				console.log(`rerunning`)
				this.methods.drawHighlight();
			}
		},
		drawDisplayBar : function () {
			
			this.methods.clearDisplayBar();
			
			var rightEdge = this.api.getRowCount() - 1;
			var startIndex = rightEdge - 18;
			var selectedDataStartIndex = 15
			Object.keys(this.settings).forEach(function(setting, index){
				if (setting === 'displaySidebar' || setting === 'isRunning'){
					return;
				}
				var setting = setting;
				var bool = this.settings[setting];
				var line = `${setting} : ${bool}`;
				var j = 0;
				for (var i = startIndex; i < rightEdge; i++) {
					if (line[j] !== undefined){
						this.api.writeToCoordinate(line[j], (2*index) + 2, i);
					j+=1;
					}
				}
			}, this);
			if (this.settings.side_disp === 'special_keys'){
				Object.keys(this.data.displayBar.keyBindings).forEach(function(key, index){
					var firstTerm = this.data.displayBar.keyBindings[key].substring(0, this.data.displayBar.keyBindings[key].indexOf(" "));
					var otherTerms = this.data.displayBar.keyBindings[key].substring(this.data.displayBar.keyBindings[key].indexOf(" "));
					var line = `${key}: ${firstTerm}`;
					var line2 = `${otherTerms}`;
					var j = 0;
					for (var i = startIndex; i < rightEdge; i++) {
						if (line[j] !== undefined){
							this.api.writeToCoordinate(line[j], (3*index) + selectedDataStartIndex, i);
						}
						if (line2[j] !== undefined){
							this.api.writeToCoordinate(line2[j], (3*index) + (selectedDataStartIndex + 1), i)
						}
						j+=1;
					}
				},this)
			} else if (this.settings.side_disp === 'commands'){
				Object.keys(this.data.displayBar.commands).forEach(function(key, index){
					var firstTerm = this.data.displayBar.commands[key].substring(0, this.data.displayBar.commands[key].indexOf(" "));
					var otherTerms = this.data.displayBar.commands[key].substring(this.data.displayBar.commands[key].indexOf(" "));
					var line = `${key}: ${firstTerm}`;
					var line2 = `${otherTerms}`;
					var j = 0;
					for (var i = startIndex; i < rightEdge; i++) {
						if (line[j] !== undefined){
							this.api.writeToCoordinate(line[j], (3*index) + selectedDataStartIndex, i);
						}
						if (line2[j] !== undefined){
							this.api.writeToCoordinate(line2[j], (3*index) + (selectedDataStartIndex + 1), i)
						}
						j+=1;
					}
				},this);
			} else if (this.settings.side_disp === 'doc_data'){
				Object.keys(this.data.activeDoc).forEach(function(key, index){
					if (typeof this.data.activeDoc[key] === 'number'){
						var line = `${key}`
						var line2 = `    ${this.data.activeDoc[key]}`
						var j = 0;
						for (var i = startIndex; i < rightEdge; i++) {
							if (line[j] !== undefined){
								this.api.writeToCoordinate(line[j], (3*index) + selectedDataStartIndex, i);
							}
							if (line2[j] !== undefined){
								this.api.writeToCoordinate(line2[j], (3*index) + (selectedDataStartIndex + 1), i)
							}
							j+=1;
						}
					} else {
						var line = `${key}`;
						var line2 = `    ${this.data.activeDoc[key]}`;
						var j = 0;
						for (var i = startIndex; i < rightEdge; i++) {
							if (line[j] !== undefined){
								this.api.writeToCoordinate(line[j], (3*index) + selectedDataStartIndex, i);
							}
							if (line2[j] !== undefined){
								this.api.writeToCoordinate(line2[j], (3*index) + (selectedDataStartIndex + 1), i)
							}
							j+=1;
						}
					}
				},this);
			}

		},

		drawScrollBar : function () {
			
			for (var i = 0; i < this.data.scrollBar.length; i++) {
				this.api.writeToCoordinate(this.data.scrollBar[i], i, (this.data.textWidth + 2));
			}
		},

		drawWindow : function () {

			var width = this.api.getRowCount();
			var title = 'editor.ext';
			title = title.split('').reverse().join('');
			var toggle = false;
			var j = 0;
			for (var i = (width - 1); i >= 0; i--){
				if (j < title.length){
					this.api.writeToCoordinate(title[j], this.data.displayHeight -1, i);
					console.log
					j += 1;
				} else {
					if (toggle){
						this.api.writeToCoordinate('-', this.data.displayHeight -1, i)
						toggle = false;
					} else {
						this.api.writeToCoordinate(' ', this.data.displayHeight -1, i)
						toggle = true;
					}
				}

			}
		},

		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		WINDOW TRANSLATION METHODS
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		translateWindowUp : function () {
			this.data.vRowOffset += 1;
			this.methods.scaleAndPositionScrollBar();
			this.methods.recomposeText();
		},

		translateWindowDown : function () {
			this.data.vRowOffset -= 1;
			this.methods.scaleAndPositionScrollBar();
			this.methods.recomposeText();
		},

		scaleAndPositionScrollBar : function () {
			var prependCount = 0;
			var postpendCount = 0;
			var barHeight = this.data.displayHeight - 1;
			this.data.scrollBar = ('#').repeat(barHeight);
			var displayRatio = (barHeight / this.data.characterMatrix.length).toPrecision(10);
			if (displayRatio > 1){
				return;
			}
			var barIndexes = Math.round(barHeight * (displayRatio));
			var scrollIndexes = barHeight - barIndexes;

			var botSpill = ((this.data.characterMatrix.length) - (this.data.vRowOffset) - (barHeight))

			let k = (scrollIndexes/(this.data.vRowOffset + botSpill)).toPrecision(10);



			console.log(this.data.characterMatrix)
			if (botSpill !== 0){
				var offsetProportion = (this.data.vRowOffset / botSpill).toPrecision(10);
			} else {
				offsetProportion = 9999999;
			}

			//var unDisplayedBot = (this.data.characterMatrix.length - (this.data.vRowOffset + this.barHeight));
			
			if (barIndexes < 0){
				
			}
		
			prependCount = Math.round(k * this.data.vRowOffset);
		
			if (prependCount < 0){
				prependCount === 0;
			}
			postpendCount = scrollIndexes - prependCount;
			if (postpendCount < 0){
				postpendCount === 0;
			}
			var scrollBar = ('|').repeat(prependCount) + ('#').repeat(barIndexes) + ('|').repeat(postpendCount);
			if (scrollBar.length < barHeight){
				scrollBar += '|';
			}
			this.data.scrollBar = scrollBar;
		},


		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		All cursor edge handlings must be dealt with to interact
		with actual viewport shit; this should be fun; cursor 
		has got to do actual work... 
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		assignHighlightSelection : function () {
			if (this.data.cursorLocation[2] > this.data.highlight[0]){
				this.data.highlight[1] = this.data.cursorLocation[2];
			} else if (this.data.cursorLocation[2] === this.data.highlight[0]){
				this.data.highlight[1] = this.data.cursorLocation[2];
			} else {
				var row = this.data.cursorLocation[0];
				var col = this.data.cursorLocation[1];
				var cell = this.data.characterMatrix[row][col];
				if (cell.length === 1){
					this.data.highlight[1] = this.data.cursorLocation[2] + 1;
				} else if (cell.length === 3){
					this.data.highlight[1] = this.data.cursorLocation[2] + 2
				}
			}
		},
		repositionCursor : function () {
			this.methods.setPositionFromStringIndex(this.data.cursorLocation[2])
		},
		setPositionFromStringIndex : function (stringIndex){
			var coordinates = this.methods.getCoordinatesFromStringIndex(stringIndex);
			this.data.cursorLocation[0] = coordinates[0];
			this.data.cursorLocation[1] = coordinates[1];
			this.methods.positionTerminalCursor();
		},
		reacquireStringIndex : function () {

			var presentRow = this.data.cursorLocation[0];
			var presentColumn = this.data.cursorLocation[1];
			this.data.cursorLocation[2] = this.data.characterMatrix[presentRow][presentColumn][0];
		},
		getCoordinatesFromStringIndex : function (stringIndex) {
			//I've just come to the realization that all these algorithms could be so much faster.
			//By which I mean the damn highlighter Func can use this... which is much faster;
			var targetValue = stringIndex;
			var row = -1;
			var col = -1;
			var initialIndex = 0;
			var searchRowIndex = Math.floor(this.data.characterMatrix.length /2);
			var rowFidelity = searchRowIndex;
			var searchColIndex = 0;
			var counter = 2*this.data.characterMatrix.length
			//this can be reinstantiated as a binary tree search

			while(col === -1 && counter > 0){
				var guessCell = this.data.characterMatrix[searchRowIndex][searchColIndex];
				initialIndex = 0;
				if (searchColIndex === 0){
					var rowGuessCell = this.data.characterMatrix[searchRowIndex][initialIndex];
					if (rowGuessCell.length === 0){
						if (initialIndex === 0){
							initialIndex += 1
							rowGuessCell = this.data.characterMatrix[searchRowIndex][initialIndex];
						}
					}
					guessCell = rowGuessCell;
				}
				if (guessCell === undefined){
				
		
				}
				if (guessCell[0] === targetValue) {
					row = searchRowIndex;
					col = searchColIndex;
					break;
				}
				if (row === -1){
			
					if (guessCell[0] > targetValue){
				
						if (this.data.characterMatrix[searchRowIndex -1][initialIndex][0] < targetValue){
						
							row = searchRowIndex - 1;
							searchRowIndex = row;
						
							counter -= 1;
							continue;
						}
						searchRowIndex -= Math.ceil(rowFidelity/2);
						rowFidelity = Math.max(Math.floor(rowFidelity/2), 1)
					}
					if (guessCell[0] < targetValue) {
						
						if (!this.data.characterMatrix[searchRowIndex +1]){
							row = searchRowIndex;
							searchRowIndex = row;
							counter -= 1;
							continue
						}
						if (this.data.characterMatrix[searchRowIndex +1][initialIndex][0] > targetValue){
							row = searchRowIndex;
							searchRowIndex = row;
							
							counter -= 1;
							continue;
						}
						searchRowIndex += Math.ceil(rowFidelity/2);
						rowFidelity = Math.max(Math.floor(rowFidelity/2), 1)
					}
					if (guessCell[0] === targetValue){
				
						row = searchRowIndex;
						col = 0;
						break;
					}
				} else {
				
					if (searchColIndex === 0){
						searchColIndex = (targetValue - this.data.characterMatrix[row][initialIndex][0]);
						if (searchColIndex === undefined){
					
						}
						if (this.data.characterMatrix[row][searchColIndex][0] === targetValue){
							col = searchColIndex;
							break;
						} else {
							searchColIndex = Math.floor(this.data.characterMatrix[row].length/2);
						}
					}
					if (col === -1){
						if (targetValue === 1282){
							;
						}
						guessCell = this.data.characterMatrix[searchRowIndex][searchColIndex]
						if (guessCell === undefined || guessCell.length === 0){
							searchColIndex -= 1;
							counter-=1;
							continue;
						}
						if (guessCell[0] === " "){
							searchColIndex -= 1;
							counter-=1;
							continue;
						}
						if (guessCell[0] > targetValue){
							var estimatedIndexes = guessCell[0] - targetValue;
							searchColIndex -= estimatedIndexes
							counter -= 1;
							continue;
						}
						if (guessCell[0] < targetValue){
							var estimatedIndexes =  targetValue - guessCell[0];
							searchColIndex += estimatedIndexes
							counter -= 1;
							continue
						}
						if (guessCell[0] === targetValue){
							col = searchColIndex;
							break;
						}
					} else {
						console.log(col)
					}
				}
				counter -= 1;
			}
			if (counter === 0){
				console.log(`search timeout: getCoordinatesFromStringIndex... algo too slow... looking for ${targetValue} in row ${searchRowIndex} at col ${searchColIndex}`)
				console.log(`col = ${col}, row = ${row}`)
				console.log(this.data.characterMatrix)
				return;
			}

			if (row === -1){
				return;
			}

			if (col === -1){
				return;
			}

		
			return [row, col, targetValue]			
		},
		decrementCursorLocation : function () {
			//this and increment may end up being faster with the stringIndex func...
			//on second thought... since this is an incrementor... it may look like n time...
			//but most case it runs in constant.. eg...  1 row iteration 1 to 5 col...
			//only worst case when trying to 
			var newLoc = [0,0,-1]
			var presentRow = this.data.cursorLocation[0];
			var presentColumn = this.data.cursorLocation[1];
			if (this.data.cursorLocation[2] === 0){
				return;
			} 
			for (var j = presentColumn - 1; j >= 0; j--){
				if (this.data.characterMatrix[presentRow][j][0] === " "){
					continue;
				}
				if (this.data.characterMatrix[presentRow][j].length > 1){
					newLoc[0] = presentRow;
					newLoc[1] = j;
					newLoc[2] = this.data.characterMatrix[presentRow][j][0];
					break;
				}
				if (!Number.isNaN(this.data.characterMatrix[presentRow][j][0])){
					var cell = this.data.characterMatrix[presentRow][j][0]
					if (cell === undefined){
						continue;
					}
					if (this.data.text[cell] === undefined){
						continue;
					}
					if (this.data.text[cell] === '\\'){
						continue;
					}
					newLoc[0] = presentRow;
					newLoc[1] = j;
					newLoc[2] = this.data.characterMatrix[presentRow][j][0];
					break;
				}
				continue;
			}
			if (newLoc[2] === -1){
				for (var i = presentRow -1; i >= 0; i--){
					for (var j = this.data.characterMatrix[i].length -1 ; j >= 0 ; j --){
						if (this.data.characterMatrix[presentRow][j][0] === " "){
							continue;
						}
						if (this.data.characterMatrix[i][j].length > 1){
							newLoc[0] = i;
							newLoc[1] = j;
							newLoc[2] = this.data.characterMatrix[i][j][0];
							if (newLoc[2] === undefined){
					
							}
							break;
						}
						var cell = this.data.characterMatrix[i][j][0]
						if (cell){
							console.log(cell)
						}
						if (this.data.characterMatrix[i][j][0] === undefined){
								continue;
							}
						if (!Number.isNaN(this.data.characterMatrix[i][j][0])){
							if (this.data.characterMatrix[i][j][0] === undefined){
								continue;
							}
							if (this.data.text[cell] === undefined){
								continue;
							}
							newLoc[0] = i;
							newLoc[1] = j;
							newLoc[2] = this.data.characterMatrix[i][j][0];
							break;
						}
						continue;
					}
					if (newLoc[2] !== -1){
						break;
					}
				}
				if (newLoc[2] === -1){
					return;
				}
			}
			if (newLoc[0] < this.data.vRowOffset){
				this.methods.translateWindowDown();
			}
			this.data.cursorLocation[0] = newLoc[0]
			this.data.cursorLocation[1] = newLoc[1];
			this.data.cursorLocation[2] = newLoc[2];
			return;

		},
		incrementCursorLocation : function () {
			var newLoc = [0,0,-1]
			var presentRow = this.data.cursorLocation[0];
			var presentColumn = this.data.cursorLocation[1];
			if (this.data.cursorLocation[2] === this.data.text.length - 1){
				return;
			}
			for (var j = presentColumn + 1; j < this.data.characterMatrix[presentRow].length; j++) {
				if (this.data.characterMatrix[presentRow][j][0] === " "){
					continue;
				}
				if (this.data.characterMatrix[presentRow][j].length > 1){
					newLoc[0] = presentRow;
					newLoc[1] = j;
					newLoc[2] = this.data.characterMatrix[presentRow][j][0];
					break;
				}
				if (!Number.isNaN(this.data.characterMatrix[presentRow][j][0])){
					var cell = this.data.characterMatrix[presentRow][j][0]
					if (cell === undefined){
						continue;
					}
					if (this.data.text[cell] === undefined){
						continue;
					}
					if (this.data.text[cell] === '\\'){
						continue;
					}
					newLoc[0] = presentRow;
					newLoc[1] = j;
					newLoc[2] = this.data.characterMatrix[presentRow][j][0];
					break;
				}
				continue;
			}
			if (newLoc[2] === -1){
				for (var i = presentRow + 1; i < this.data.characterMatrix.length; i++) {
					for (var j = 0; j < this.data.characterMatrix[i].length; j ++){
						if (this.data.characterMatrix[presentRow][j][0] === " "){
							continue;
						}
						if (this.data.characterMatrix[i][j].length > 1){
							newLoc[0] = i;
							newLoc[1] = j;
							newLoc[2] = this.data.characterMatrix[i][j][0];
							if (newLoc[2] === undefined){
					
							}
							break;
						}
						var cell = this.data.characterMatrix[i][j][0]
						if (this.data.characterMatrix[i][j][0] === undefined){
								continue;
							}
						if (!Number.isNaN(this.data.characterMatrix[i][j][0])){
							if (this.data.characterMatrix[i][j][0] === undefined){
								continue;
							}
							if (this.data.text[cell] === undefined){
								continue;
							}
							newLoc[0] = i;
							newLoc[1] = j;
							newLoc[2] = this.data.characterMatrix[i][j][0];
							break;
						}
						continue
					}
					if (newLoc[2] !== -1){
						break;
					}
				}
				if (newLoc[2] === -1){
					return;
				}
			}
			if (newLoc[0] > (this.data.vRowOffset + this.data.displayHeight - 2)){
				this.methods.translateWindowUp();
			}
			this.data.cursorLocation[0] = newLoc[0]
			this.data.cursorLocation[1] = newLoc[1];
			this.data.cursorLocation[2] = newLoc[2];
			return;
			
		},
		moveCursorUp : function () {
			var newLoc = [0,0,-1]
			var presentRow = this.data.cursorLocation[0];
			var presentColumn = this.data.cursorLocation[1];
			if (presentRow === 0){
				return;
			}
			var targetCell = this.data.characterMatrix[presentRow - 1][presentColumn];
			if (targetCell !== undefined && targetCell[0] !== " " && targetCell.length >0){
				if (this.data.text[targetCell[0]]){
					newLoc[0] = presentRow -1;
					newLoc[1] = presentColumn;
					newLoc[2] = targetCell[0];
				}
			} else {
				for (var i = presentRow - 1; i >= 0; i--) {
					for (var j = presentColumn; j >=0; j--){
						var targetCell = this.data.characterMatrix[i][j];
						if (targetCell !== undefined && targetCell[0] !== " " && targetCell.length >0){
							if (this.data.text[targetCell[0]]){
								newLoc[0] = i;
								newLoc[1] = j;
								newLoc[2] = targetCell[0];
								break;
							}
						}
					}
					if (newLoc[2] !== -1){
						break;
					}
				}
			}
			if (newLoc[0] < this.data.vRowOffset){
				this.methods.translateWindowDown();
			}
			this.data.cursorLocation[0] = newLoc[0]
			this.data.cursorLocation[1] = newLoc[1];
			this.data.cursorLocation[2] = newLoc[2];
			return;
		},

		moveCursorDown : function () {
			var newLoc = [0,0,-1]
			var presentRow = this.data.cursorLocation[0];
			var presentColumn = this.data.cursorLocation[1];
			if (presentRow === this.data.characterMatrix.length - 1){
				return;
			}
			var targetCell = this.data.characterMatrix[presentRow + 1][presentColumn];
			if (targetCell !== undefined && targetCell[0] !== " " && targetCell.length >0){
				if (this.data.text[targetCell[0]]){
					newLoc[0] = presentRow + 1;
					newLoc[1] = presentColumn;
					newLoc[2] = targetCell[0];
				}
			} else {
				for (var i = presentRow + 1; i < this.data.characterMatrix.length; i++) {
					for (var j = presentColumn; j >=0; j--){
						var targetCell = this.data.characterMatrix[i][j];
						if (targetCell !== undefined && targetCell[0] !== " "&& targetCell.length >0){
							if (this.data.text[targetCell[0]]){
								newLoc[0] = i;
								newLoc[1] = j;
								newLoc[2] = targetCell[0];
								break;
							}
						}
					}
					if (newLoc[2] !== -1){
						break;
					}
				}
				
			}
			if (newLoc[0] > (this.data.vRowOffset + this.data.displayHeight - 2)){
				this.methods.translateWindowUp();
			}
			
			this.data.cursorLocation[0] = newLoc[0]
			this.data.cursorLocation[1] = newLoc[1];
			this.data.cursorLocation[2] = newLoc[2];
			return;
		},
		inititalizeCursorPosition : function () {
			for (var i = 0; i < this.data.characterMatrix.length; i ++){
				for (var j = 0; j < this.data.characterMatrix[i].length; j++){
					if (this.data.characterMatrix[i][j][0] === 0 || this.data.characterMatrix[i][j][0]){
						console.log(`i=${i},j=${j}, index should be 0 == ${this.data.characterMatrix[i][j][0]}`)
						this.data.cursorLocation[0] = i;
						this.data.cursorLocation[1] = j;
						return;
					}
				}
			}
		},
		positionTerminalCursor : function () {
			var coordinates = this.methods.convertCursorLocationToXY()
			this.api.positionCursor(coordinates[0], coordinates[1]);
		},
		convertCursorLocationToXY : function () {
			var x = this.data.cursorLocation[1];
			var y = this.api.getRowCount() - this.data.cursorLocation[0] - 1 + this.data.vRowOffset;
			var z = this.data.cursorLocation[2];
			return [x,y];
		},
		handleCursorUp : function () {
			this.methods.moveCursorUp();
			if (this.settings.slct_mode){
				this.methods.assignHighlightSelection();
			}
			this.methods.positionTerminalCursor();
		},
		handleCursorDown : function () {
			this.methods.moveCursorDown();
			if (this.settings.slct_mode){
				this.methods.assignHighlightSelection();
			}
			var coordinates = this.methods.convertCursorLocationToXY()
			this.api.positionCursor(coordinates[0], coordinates[1]);
		},
		handleCursorLeft : function () {
			this.methods.decrementCursorLocation();
			if (this.settings.slct_mode){
				this.methods.assignHighlightSelection();
			}
			var coordinates = this.methods.convertCursorLocationToXY()
			this.api.positionCursor(coordinates[0], coordinates[1]);
		},
		handleCursorRight : function () {
			this.methods.incrementCursorLocation();
			if (this.settings.slct_mode){
				this.methods.assignHighlightSelection();
			}
			var coordinates = this.methods.convertCursorLocationToXY()
			this.api.positionCursor(coordinates[0], coordinates[1]);
		},

		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				ADMIN FUNCTIONS
		
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		resetActiveDoc : function (){
			this.data.activeDoc.name = "";
			this.data.activeDoc.type = "";
			this.data.activeDoc.line_count = 0;
			this.data.activeDoc.char_count = 0;
			this.data.activeDoc.word_count = 0;
			this.data.activeDoc.est_mem_use = 0;
			this.data.activeDoc.writable = false;
		},
		updateActiveDoc : function (text, doc, isNull) {
			if (!text || text === undefined){
				text = this.data.text;
			}
			if (isNull){
				this.data.activeDoc.name = "null";
				this.data.activeDoc.type = "undefined";
				this.data.activeDoc.line_count = NaN;
				this.data.activeDoc.char_count = NaN;
				this.data.activeDoc.word_count = NaN;
				this.data.activeDoc.est_mem_use = NaN;
				this.data.activeDoc.writable = false;
				return;
			}
			this.data.activeDoc.word_count = text.split("\\n").join(" ").split('\\t').join(" ").split(" ").filter(function(x){
				return x !== ""
			}).length;
			this.data.activeDoc.char_count = text.length;
			this.data.activeDoc.line_count = text.split("\\n").length;
			this.data.activeDoc.est_mem_use = this.data.activeDoc.char_count * 2;
			if (doc && doc !== undefined){
				this.data.activeDoc.name = doc.name;
				if (doc.isWormTongueProgram){
					this.data.activeDoc.type = '.wmt';
				} else {
					this.data.activeDoc.type = '.rdbl'
				}
				if (doc.writable === true){
					console.log(doc)
					this.data.activeDoc.writable = true;
				}
				console.log(doc)
				this.data.activeDocTrueAddress = doc.getTrueAddress();
				if (doc.writable && doc.getTrueAddress()[0] !== 'w'){
					;
				}
				console.log(this.data.activeDocTrueAddress);

			}
		},
		startEditext : function (text, doc, isNull) {
			console.log(doc)
			this.settings.isRunning = true;
			if (!this.api.checkIfRunning(`${this.name}`)){
				this.api.appendToRunningPrograms(`${this.name}`, false)
			}
			this.api.readyCommand('stop')

			this.methods.initializeDimensions();

			this.api.patchInterfaceFunction(function(){
				return true;
			}, 'alternateKeyRouterActive');
			this.api.patchInterfaceFunction(function(){
				return true;
			}, 'usingKeyUpHandling');

			Object.keys(this.methods.commands).forEach(function(commandName){
				this.api.addCommand(this.methods.commands[commandName])
			}, this)

			var haveAddedCommandNarrowing = false;
			if (!haveAddedCommandNarrowing){
				console.warn('YOU NEED TO DO SOME COMMAND NARROWING HERE...')
				console.log(`DO NOT SHIP THIS WITHOUT COMMAND NARROWING`)
			}
			;

			if (text !== undefined){
				this.data.text = text;
				this.methods.filterText();
			} else {
				this.data.text = "";
			}
			this.methods.resetActiveDoc();
			this.methods.updateActiveDoc(text, doc, isNull);

			this.methods.initializeDimensions();
			this.methods.scaleAndPositionScrollBar();

			if (this.settings.displaySidebar){
				this.methods.drawDisplayBar();
			}
			this.methods.drawScrollBar();
			this.methods.drawWindow();

			this.api.log(` use "F6" to switch between terminal input and editor interface`);
		},

	},
	installData : {
		edit : {
			name : 'edit',
			desc : 'edit a text document',
			syntax : 'edit (readable)', // still need .wt files and compiler
			hasHelp : false, //still need longHelp
			longHelp : ' --- Operation Guide for "edit" syntax ---',
			errorState : false,
			createNewDoc : false,
			cndVer : false,
			wantsExistingDoc : false,
			wedVer : false,
			noDocVer : false,
			openNoDoc : false,
			docToOpen : "",
			ex : function (target) {
				if (this.api.commandAvailCheck('stop') && !this.settings.isRunning){
					var runningProgramsList = Object.keys(this.api.getRunningPrograms());
					runningProgramsList.forEach(function(programName){
						if (programName !== 'editor.ext')
						this.api.runCommand(`stop ${programName}`)
					})
				}
				var edit = this.installData.edit;
				var prgm = this;
				if (edit.errorState){
					edit.resetAllFields();
					return;
				}
				if (!target && !edit.cndVer) {
					prgm.api.verifyCommand(` Would you like to create a new document?`, function (bool, toggle, avoidPop){
					
						toggle.toggle = true;
						avoidPop.avoidPop = true;
						if (bool){
							edit.cndVer = true;
							edit.createNewDoc = true;
							return;
						} else {	
							edit.cndVer = true;
							return
						}
					})
					return;
				}
				if (!target && edit.cndVer){
					if (!edit.createNewDoc && !edit.wedVer){
						prgm.api.verifyCommand( `Would you like to open an accessible document?`, function(bool, toggle, avoidPop){

							toggle.toggle = true;
							avoidPop.avoidPop = true;
							if (!bool){
								edit.wedVer = true;
								return;
							} else {
								edit.wedVer = true;
								edit.wantsExistingDoc = true;
								return;
							}
						})
						return;
					} else if (!edit.createNewDoc && edit.wedVer){
						if (edit.wantsExistingDoc && edit.docToOpen.length === 0){
							prgm.api.requestInput(function(commandFull){
								var inputTerms = commandFull.split(" ");
								var indexStart = 0;
								if (inputTerms[indexStart] === ""){
									indexStart = indexStart + 1;
								}
								var nodeName = inputTerms[indexStart];
								if (!Object.keys(prgm.api.getAccessibleNodes()).includes(nodeName)){
									prgm.api.throwError('(edit.ext) no such document recognized');
									edit.errorState = true;
									prgm.api.runCommand(`edit`);
									return;
								} else if (!prgm.api.getAccessibleNodes()[nodeName].canBeRead) {
									prgm.api.throwError(`(edit.ext) ${nodeName} has no readable data`);
									edit.errorState = true;
									prgm.api.runCommand(`edit`);
									return;
								} else {
									edit.docToOpen = nodeName;
								}
								prgm.api.runCommand(`edit ${edit.docToOpen}`)
								return;
							}, `Enter accessible document name: `)
							return;
						} else if (edit.wantsExistingDoc && edit.docToOpen.length >= 1){

						} else if (!edit.wantsExistingDoc){
							if (!edit.noDocVer) {

							prgm.api.verifyCommand(' Open edit.ext without any doc to edit?', function (bool, toggle, avoidPop) {
								toggle.toggle = true;
								avoidPop.avoidPop = true;
								if (bool){
									edit.noDocVer = true;
									edit.openNoDoc = true;
									return;
								} else {
									edit.noDocVer = true;
									return;
								}
							})
							return;
							} else if (edit.noDocVer && edit.openNoDoc) {
								//start program with command that handles row res, MUST define string with newDoc command or openDoc
								this.methods.startEditext("","",true)
							} else if (edit.noDocVer && !edit.openNoDoc) {
								edit.resetAllFields();
								this.api.log(` (editor.ext) aborting execution procedure...`)
							}
						}
					} else if (edit.createNewDoc && edit.docToOpen.length === 0) {
						//start program with command that handles row reservation and shit;
						prgm.api.requestInput(function(commandFull){
							var accessibleNodesList = Object.keys(prgm.api.getAccessibleNodes())
							var potentialName = commandFull.split(".rdbl").join("").split(".wmt").join("").split(" ").join("_").substring(0,16);
							var nameMatches = accessibleNodesList.filter(function(nodeName){
								var nodeNameNoFileExt = nodeName.split('.')[0]
								if (nodeNameNoFileExt === potentialName){
									return true;
								} else {
									return false;
								}
							})
							if (nameMatches.length >= 1){
								prgm.api.warn(`An accessible node already exists with name = ${nameMatches[0]}... try another name.`)
							} else {
								edit.docToOpen = potentialName;
							}
							prgm.api.runCommand(`edit`);
							return;
						}, 'Enter name for new document:')
						return;
						
					} else if (edit.createNewDoc && edit.docToOpen.length >= 1){
						console.log(edit.docToOpen)
						this.methods.createNewRdbl(edit.docToOpen, "", true);
						edit.resetAllFields();
						return;
					}
				}
				if (edit.errorState){
					edit.resetAllFields();
					if (this.api.checkIfRunning('editor.ext')){
						this.api.runCommand('stop');
					}
					return;
				}
				if (target){
					var accessibleNodes = prgm.api.getAccessibleNodes();
					if (!Object.keys(accessibleNodes).includes(target)){
						prgm.api.throwError('(editor.ext) no such document recognized');
						edit.resetAllFields();
						if (this.api.checkIfRunning('editor.ext')){
							this.api.runCommand('stop');
						}
						return;
					} else if (!accessibleNodes[target].canBeRead){
						prgm.api.throwError(`(editor.ext) ${target} has no readable data`);
						edit.resetAllFields();
						if (this.api.checkIfRunning('editor.ext')){
							this.api.runCommand('stop');
						}
						return;
					} else {
						edit.resetAllFields();
						var node = accessibleNodes[target];
						node.read(this.methods.startEditext);
					}

				}
			},
			resetAllFields : function () {
				this.errorState = false;
				this.createNewDoc = false;
				this.cndVer = false;
				this.wantsExistingDoc = false;
				this.wedVer = false;
				this.noDocVer = false;
				this.openNoDoc = false;
				this.docToOpen = "";
			},
		},

	},
	initializeData : function () {
		var data = {
			activeDoc : {
				name : "",
				type : "",
				line_count : 0,
				char_count : 0,
				word_count : 0,
				est_mem_use : 0,
				writable : false,
			},
			activeDocTrueAddress : "",
			cursorLocation : [0,0,0],
			inserting : false,
			shiftDown : false,
			ctrlDown : false,
			altDown : false,
			clipBoard : "",
			text : "",
			highlight : [0,0],
			prevHighlight : [0,0],
			selectedText : false,
			textWidth : 0,
			displayHeight : 0,
			colHeight : 0,
			rowWidth : 0,
			characterMatrix : [],
			displayBarWidth : 20,
			stringIndexOffset : 0,
			vRowOffset : 0,
			lastInsertIndex : 0,
			scrollBar : '',
			displayBar : {
				keyBindings : {
					'F1' : '(edit_mode) copy slctd text',
					'F2' : '(edit_mode) cut slctd text',
					'F3' : '(edit_mode) paste slctd text',
					'F4' : 'toggle_mode [slow/fast]',
					'F5' : 'toggle_mode [select/write]',
					'F6' : 'toggle_mode [edit/terminal]',
					'F7' : 'toggle sidebar_[on/off]',
					'F8' : 'cycle sidebar pages',
				},
				commands : {
					'stop' : 'stop editor.ext',
					'save' : 'update active doc',
					'open' : 'edit an accessible doc',
					'new_rdbl' : 'create new .rdbl doc',
					'new_wmt' : 'create new .wmt doc',
					'rename' : 'rename active doc',
				},
			},
		}
		this.api.setData('editor.ext', data);
		this.data = data;
	},
	install : function (terminal, callback) {
		this.trmnl = terminal;
		this.api = terminal.api;


		this.installData.edit.ex = this.installData.edit.ex.bind(this)

		this.api.addCommand(this.installData.edit);

		Object.keys(this.methods.commands).forEach(function(commandName){
				this.methods.commands[commandName].ex = this.methods.commands[commandName].ex.bind(this);
				
		}, this)

		Object.keys(this.methods.keyStrokeRouter).forEach(function(funcName){
			this.methods.keyStrokeRouter[funcName] = this.methods.keyStrokeRouter[funcName].bind(this);
		}, this);

		Object.keys(this.methods).forEach(function(funcName){
			if (typeof this.methods[funcName] === 'function'){
				this.methods[funcName] = this.methods[funcName].bind(this);
			} else {
				return;
			}
		}, this)

		this.api.addInterfaceFunction(this.methods.routeKeyUp, 'useKeyUpRouter');
		this.api.addInterfaceFunction(this.methods.routeKeyStroke, 'useAltKeyRouter'); 

		window.addEventListener("resize", this.methods.initializeDimensions);

		if (callback){
			callback(this.installData)
		}

		this.initializeData();

	},
	uninstall : function () {
		this.trml = {};
		this.api = {};
		delete this.reader.editor;
		delete this.reader;

		this.api.patchInterfaceFunction('alternateKeyRouterActive', function(){
			return false;
		});
		this.api.patchInterfaceFunction('usingKeyUpHandling', function(){
			return false;
		});
		
		this.api.deleteInterfaceFunction('useKeyUpRouter', 'editor.ext');
		this.api.deleteInterfaceFunction('useAltKeyRouter', 'editor.ext');

		window.removeEventListener("resize", this.methods.initializeDimensions);


	},
	stop : function () {
		this.settings.isRunning = false;
		this.api.patchInterfaceFunction(function(){
			return false;
		}, 'alternateKeyRouterActive');
		this.api.patchInterfaceFunction(function(){
			return false;
		}, 'usingKeyUpHandling');

		Object.keys(this.methods.commands).forEach(function(commandName){
			this.api.deleteCommand(commandName);
		},this);


		this.api.clearReservedRows();
		this.api.reserveRows(0);

		var program = this;
		/*setTimeout(function(){
			program.api.clearReservedRows();
			program.api.reserveRows(0);
		}, 12)*/
	},
	ex : function (target) {
		this.installData.edit.ex(target)
	},
}
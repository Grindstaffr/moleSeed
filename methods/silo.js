export const program = {
	name : `silo.ext`,
	isInstalled : false,
	runsInBackground : true,
	size: 19,
	memory: 2412,
	data: {
		armedRecruiter : {isDummy : true},
		targetedHardware : {isDummy : true},
		meanUnLinkTime : 300000,
		unLinkTime : 100000,
		linkTime: 0,
		linkTimeStart: 0,
		linkedHardware : {isDummy : true},
		canRecruit : false,
		hardwareStatus : {
			linked : false,
			targeted : false,
		},
		
	},
	deprecatedFunctions : {

		},
	settings : {},
	methods : {
		commands : {
			arm : {
				name: "arm",
				desc : "",
				syntax : "silo arm [recruiter]",
				argType : "r",
				acceptedTypes : ['recruiter'],
				ex : function (malwareName) {
					var malware = this.api.getAccessibleNodes()[malwareName]
					if (Object.keys(this.api.getRucksackContents()).includes(malwareName)){
						this.methods.siloApi.armRecruiter(malwareName);
						return;
					}
					if (!Object.keys(this.api.getRucksackContents()).includes(malwareName)){
						var openSlot = this.api.getFirstOpenRucksackSlot();
						if (openSlot === -1){
							this.api.throwError(`to arm ${malware.type}, ${malwareName} must be in rucksack.ext ... ditch something or arm a grabbed ${malware.type}`)
							return;
						}
						this.api.runCommand(`grab ${malwareName} into ${openSlot}`);
						this.methods.siloApi.armRecruiter(malwareName);
					}
					return;
				}
			},
			trgt : {
				name: "trgt",
				desc : "",
				syntax : "silo trgt [hardware]",
				argType : "r",
				acceptedTypes : ['hardware'],
				ex : function (hardwareName) {
					this.methods.siloApi.targetHardware(hardwareName);
					return;
				},
			},
			fire : {
				name: "fire",
				desc : "",
				syntax : "silo fire (recruiter)",
				argType : "o",
				acceptedTypes : ['recruiter'],
				verificationCheckA : false,
				verificationCheckB : false,
				verificationCheckC : false,
				ex : function (malwareName) {
					if (malwareName === undefined){
						if (!this.data.armedRecruiter || this.data.armedRecruiter.isDummy){
							this.api.throwError(`No armed executable. Cannot "fire" nothing.`)
							return;
						}
						malwareName = this.data.armedRecruiter.name;
					};
					var malware = this.api.getAccessibleNodes()[malwareName];
					if (malware === undefined || malware.Type !== 'malware'){
						this.api.throwError(`invalid "fire" call: ${malwareName} is an invalid term.`)
					};
					if (malwareName !== this.data.armedRecruiter.name){
						this.api.throwError(`${malwareName} unarmed... cannot fire an unarmed ${malware.type} (${this.methods.siloApi.getArmedRecruiterName()} is currently armed)`)
					};
					if (!this.data.armedRecruiter.isArmed){
						this.api.throwError(`exception : uncaught error... armed ${this.data.armedRecruiter.type} is not armed... `)
					}
					var launchControl = this.methods.commands.fire
					var api = this.api
					if (!launchControl.verificationCheckA){
					this.api.verifyCommand(`armed recruiter: ${malwareName}, targeted hardware: ${api.getTargetedHardwareName()}, confirm? `,function(bool){
						if (!bool){
							return;
						}
						launchControl.verificationCheckA = true;
						api.log(``)
					});
						return;
					};
					if (!launchControl.verificationCheckB){
						this.api.verifyCommand(`Use of recruiter-Ware is prohibited by the fucking cops and shit... Continue? `,function(bool){
							if (!bool){
								return;
							}
							launchControl.verificationCheckB = true;
							api.log(``)
						});
						return;
					}
					if (!launchControl.verificationCheckC){
						this.api.verifyCommand(`Instance of ${recruiter.name} is single-use... fire command will expend usage. Continue?`,function(bool){
							if (!bool){
								return;
							}
							launchControl.verificationCheckC = true;
							api.log(``)
						});
						return;
					}

					launchControl.verificationCheckA = false; 		
					launchControl.verificationCheckB = false;				
					launchControl.verificationCheckC = false;	
					this.methods.siloApi.launchRecruiter(this.data.armedRecruiter)
				},
			},
			help : {
				name : "help",
				desc : "print a list of silo-specific commands",
				syntax : "silo help (scommand)",
				argType : "o",
				acceptedTypes : ['scommand'],
				ex : function (commandName) {
					this.api.log('SILO HELP SYNTAX NEEDS TO BE IMPLEMENTED')

				},
			},
		},
		siloApi : {
			getLinkedHardware : function () {
				if (!this.data.hardwareStatus.linked){
					return false;
				}
				return this.data.linkedHardware;
			},
			getArmedRecruiterName : function () {
				if (this.data.armedRecruiter.isDummy){
					this.api.throwError(`no recruiter is armed`)
					return;
				}
				if (!this.data.armedRecruiter.name){
					this.api.throwError(`missing value (ARMD RCTR [NAME])`)
					return;
				};
				return this.data.armedRecruiter.name;
			},
			getTargetedHardwareName : function () {
				if (this.data.targetedHardware.isDummy){
					this.api.throwError(`no hardware is targeted`)
				}
				if (!this.data.targetedHardware.name){
					this.api.throwError(`missing value (TRGT HDWR [NAME])`)
					return;
				}
				return this.data.targetedHardware.name
			},
			armRecruiter : function (recruiterName) {
				var recruiter = this.api.getAccessibleNodes()[recruiterName]
				if (!recruiter.arm){
					this.api.throwError(`targeted node not compatible with silo... aborting...`)
				}
				this.data.armedRecruiter = recruiter;
				this.data.armedRecruiter.arm();
				this.api.reRenderRucksack(true);
				var silo = this;
				if (this.data.hardwareStatus.targeted) {
					this.data.targetedHardware.getSpecs(function(data){
					silo.data.hardwareStatus.targeted = true;
					silo.data.unLinkTime = Math.floor(silo.data.meanUnLinkTime * (silo.data.armedRecruiter.effectiveness/silo.data.targetedHardware.specs.resistance))
					silo.data.canRecruit = (silo.data.armedRecruiter.crackingAbil >= silo.data.targetedHardware.specs.security)
					silo.api.reRenderRucksack(true);
					})
				}
			},
			resetAllData : function (){
				this.data = {
					armedRecruiter : {isDummy : true},
					targetedHardware : {isDummy : true},
					meanUnLinkTime : 300000,
					unLinkTime : 100000,
					linkTime: 0,
					linkTimeStart: 0,
					linkedHardware : {isDummy : true},
					canRecruit : false,
					hardwareStatus : {
						linked : false,
						targeted : false,
					},
				}
			},
			linkTargetedHardware : function (){
				this.data.linkedHardware = this.data.targetedHardware
				this.data.linkedHardware.link(this.methods.siloApi, this.api);
				this.data.hardwareStatus.linked = true;
				this.data.hardwareStatus.targeted = false;
				this.data.linkTimeStart = Date.now();

				this.api.log(` ${this.data.armedRecruiter.name} success.`)
				this.api.log(` ${this.data.linkedHardware.name} commands now accessible thru "recruit" syntax`)
				
				this.methods.siloApi.clearDataAfterNewLink();
				
				this.api.reRenderRucksack(true);

			},
			clearDataAfterNewLink : function () {
				this.data.armedRecruiter = {isDummy : true};
				this.data.targetedHardware = {isDummy : true};
			},
			clearDataAfterLinkExpires : function () {
				this.data.hardwareStatus.linked = false; 
				this.data.unLinkTime = this.data.meanUnLinkTime;
				this.data.linkTimeStart = 0;
				this.data.linkTime = 0;
				this.data.linkedHardware = {isDummy : true};
			},
			targetHardware: function (hardwareName) {
				var silo = this;
				var target = this.api.getAdjacentNodes()[hardwareName];
				if (!target){
					this.api.throwError(`targeted hardware not accessible`)
					return;
				}
				if (target.Type !== 'hardware'){
					this.api.throwError(`must target hardware (expected Type = "hardware", got Type = "${target.Type}")`)
				}
				this.data.targetedHardware = target;
				this.data.targetedHardware.getSpecs(function(data){
					silo.data.hardwareStatus.targeted = true;
					silo.data.unLinkTime = Math.floor(silo.data.meanUnLinkTime * (silo.data.armedRecruiter.effectiveness/silo.data.targetedHardware.specs.resistance))
					silo.data.canRecruit = (silo.data.armedRecruiter.crackingAbil >= silo.data.targetedHardware.specs.security)
					silo.api.reRenderRucksack(true);
				})

			},
			launchRecruiter : function (recruiter){
				var silo = this;
				if (!this.data.canRecruit){
					this.data.armedRecruiter.failureAnim(this.api, function () {
						silo.api.log(`  RECRUIT FAILURE: ${silo.data.armedRecruiter.name} (detected non-exploited Anti-Malware program)`)
						return;
					})
					return;
				} else {
					this.data.armedRecruiter.recruitAnim(this.api, function(){
						console.log(silo.data)
						console.log(silo.data.armedRecruiter)
						silo.data.armedRecruiter.methods.use.ex();
						silo.methods.siloApi.linkTargetedHardware();
						/*
						silo.data.linkedHardware = silo.data.targetedHardware;
						silo.methods.siloAPI.clearDataAfterNewLink();

						silo.data.linkTimeStart = Date.now();
						silo.data.hardwareStatus.linked = true;
						silo.data.hardwareStatus.targeted = false;
						silo.api.log(`  RECRUIT SUCCESS`);
						silo.api.reRenderRucksack(true);
						*/
						//console.log(silo.data)
					})
				};

				
				//program fun shit here

			},
		},
		drawSilo : function () {
			var count = this.api.getRowCount();
			var spacing = Math.floor((count - 4)/3)
			var line = "  ";
			var time = " ";
			if (!this.data.armedRecruiter.isArmed){
				var rctrHeader = "NO RCTR"
				line = line + rctrHeader + (" ").repeat(spacing-rctrHeader.length);
			} else {
				var rctrHeader = `ARMD RCTR:${this.data.armedRecruiter.name}`
				if (spacing-rctrHeader.length <= 4){
					rctrHeader = rctrHeader.substring(0, spacing-4)
				}
				line = line + rctrHeader + (" ").repeat(spacing-rctrHeader.length); 
			};
			if (this.data.hardwareStatus.linked){
				var hdwrHeader = `LINK HDWR:${this.data.linkedHardware.name}`
				line = line + hdwrHeader + (" ").repeat(spacing - hdwrHeader.length)
			} else if (this.data.hardwareStatus.targeted){
				var hdwrHeader = `TRGT HDWR:${this.data.targetedHardware.name}`
				line = line + hdwrHeader + (" ").repeat(spacing - hdwrHeader.length)
			} else {
				var hdwrHeader = 'NO HDWR'
				line = line + hdwrHeader + (" ").repeat(spacing - hdwrHeader.length)
			};
			if ((this.data.hardwareStatus.linked) && (this.data.linkTime <= this.data.unLinkTime)){
				var timeHeader = `TIME : ${this.data.linkTime} / ${this.data.unLinkTime}`
				line = line + "  " + timeHeader;
			};
			this.api.writeToGivenRow(line, 1)
			this.api.writeToGivenRow((' -').repeat((Math.floor(this.api.getRowCount()/2))-5 )+ ' silo.ext',3)
		},
		monitor : function () {
			//upon running, this should sit in the main draw loop, as it should be triggered A LOT;
			if (!this.data.hardwareStatus.linked){
				return;
			}
			var now = Date.now();
			this.data.linkTime = now - this.data.linkTimeStart;
			if (this.data.linkTime >= this.data.unLinkTime){
				this.data.linkedHardware.jettison();
				this.methods.siloApi.clearDataAfterLinkExpires();
				this.api.log(`Link Broken`)
				this.api.reserveRows(0);
				//DO RESETS (SHUD HAVE FUNC FOR DO)
			}
			//can drop some kinds of triggers in here
			this.methods.drawSilo(); 
		},

	},
	installData : {
		silo : {
			name : "silo",
			desc : "silo-specific command syntax",
			syntax : "silo [scommand] (text)",
			hasHelp: true,
			longHelp : ` --- Operation Guide for "silo" syntax ---
			\\n
			\\n silo
			\\n \\t function : declares that the subsequent command is to be routed to the silo subroutine.
			\\n \\t syntax rationale : silo is useful in managing and handling volatile executables that should not gain access to the terminal remote. silo.ext maintains a partitioned heap with no backward access to the remote, allowing a one way communication with these executables through silo's "arm"/"trgt"/"fire" syntax.
			\\n \\t syntax : silo [arm/trgt/fire] [armable_node/hardware/armable_node] -OR- silo help (silo_command)`,
			ex : function (siloCommand, nodeName) {
				var node = null;
				var cmd = null;
				if (nodeName && nodeName !== undefined){
					node = nodeName;
				}
				if (siloCommand && siloCommand !==undefined){
					if (!Object.keys(this.methods.commands).includes(siloCommand)){
						this.api.throwError(`--SILO-- sCommand not recognized... aborting...`);
						return;
					}
					cmd = siloCommand;
				}
				if (!cmd){
					this.api.throwError(`--SILO-- no command found... aborting...`)
					return;
				}
				if (!node && this.methods.commands[cmd].argType === "r"){
					this.api.throwError(`--SILO-- 1 term required... no terms found... aborting...`);
					return;
				}
				this.methods.commands[cmd].ex(nodeName);
				return;
			}
		},
		patch_showContents : function () {
			this.data.storedNodes.forEach(function(node, index){
				if (node.name === `[EMPTY SLOT]`){
					this.api.writeToGivenRow(` ${index} - ${node.name}`, ((index*2) + 5));
				} else {
					this.api.writeToGivenRow(` ${index} - name : ${node.name}    type : ${node.type}`, ((index*2) + 5))
				}
			}, this)
		},
		patch_drawWindow : function () {
			var count = this.api.getMaxLineLength();
			this.api.writeToGivenRow(("-").repeat(count - 17) + 'rucksack.ext (+S)', 22)
		},
		patch_rucksack_stop : function () {
			this.settings.isRunning = false;
			this.api.clearReservedRows();
			this.api.reserveRows(0);
			if (this.silo.data.hardwareStatus.linked){
				this.api.reserveRows(4)
			}
			// this.methods.drawSilo();
			// AT some later point, we may wanna upgrade silo from a patch upgrade for rucksack to being standalone... but not now!
			this.api.unblockCommand('mv');
			this.api.clearAccessibleMalware();
			this.api.deleteMoveTriggeredFunction(`append`);
			
			if (this.silo.data.armedRecruiter.isArmed){
				this.api.appendAccessibleMalware(this.silo.data.armedRecruiter);
				this.methods.drawSilo();
				return;
			};

			this.api.deleteDrawTriggeredFunctions(`silo_monitor`)
			
		},
		patch_rucksack_ex : function (bool) {
			var rucksack = this;
		// this.api.composeText(this.data.readMe)
			if (!this.settings.isRunning){
				this.api.addMoveTriggeredFunction('append',function(){
					rucksack.api.runCommand(`ex rucksack.ext false`, true);
				});
			}
			this.api.reserveRows(23);
			this.api.clearReservedRows();
			this.settings.isRunning = true;
			if (!bool){
				this.api.writeLine(``)
				this.api.writeLine(`rummaging thru contents of rucksack.ext (+S)`)
				this.api.writeLine(``)
			}
			//this.api.blockCommand('mv','cannot move nodes while rummaging through rucksack.ext (+S)')
			this.methods.showContents();
			this.methods.drawWindow();
			this.methods.drawSilo();
			this.data.storedNodes.forEach(function(node){
				if(node.Type === 'node'){
					this.api.appendAccessibleNodes(node)
				} else if (node.Type === 'malware'){
					this.api.appendAccessibleNodes(node)
					this.api.appendAccessibleMalware(node)
				}
			},this);
			this.api.addDrawTriggeredFunction(this.silo.methods.monitor, `silo_monitor`);
		},

	},
	setAPI : function (api) {
		this.api = api;
		return;
	},
	setData : function (data) {
		this.data = data;
		/*
		 JANKY PATCHING CODE FROM HERE
		*/
		var storedNodes = this.api.getData('rucksack.ext').storedNodes;
		this.data.storedNodes = storedNodes;
		//  UNTIL HERE
		return;
	},
	setSettings: function (settings) {
		this.settings = settings;
		return;
	},
	initializeData : function () {
		var data =  {
			armedRecruiter : {isDummy : true},
			targetedHardware : {isDummy : true},
			meanUnLinkTime : 300000,
			unLinkTime : 100000,
			linkTime: 0,
			linkTimeStart: 0,
			linkedHardware : {isDummy : true},
			canRecruit : false,
			hardwareStatus : {
				linked : false,
				targeted : false,
			},
		}
		this.data = data;
		this.api.setData('silo.ext', data);
		return;
	},
	install : function (terminal, callback){
		this.trmnl = terminal;
		this.api = terminal.api;
		if (!terminal.programs[`rucksack.ext`]){
			this.api.throwError(`(unfound dependency): missing rucksack.ext`)
			return;
		};
		if (callback){
			callback(this.installData);
		};
		this.initializeData();
		terminal.programs[this.name] = this;
		this.isInstalled = true;

		console.log(`every bit of code between here`)
		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		FUCKED UP BLOC...
		*/

		this.rucksack = this.trmnl.programs[`rucksack.ext`];
		this.rucksack.silo = this;
		this.data.storedNodes = this.rucksack.data.storedNodes;
		this.data.settings = this.settings
		this.methods.data = this.data;
		this.methods.api = this.api;

		this.deprecatedFunctions.stop = this.rucksack.stop
		this.deprecatedFunctions.ex = this.rucksack.ex
		this.deprecatedFunctions.showContents = this.rucksack.methods.showContents
		this.deprecatedFunctions.drawWindow = this.rucksack.methods.drawWindow

		this.rucksack.stop = this.installData.patch_rucksack_stop;
		this.rucksack.ex = this.installData.patch_rucksack_ex;
		this.rucksack.methods.showContents = this.installData.patch_showContents;
		this.rucksack.methods.drawWindow = this.installData.patch_drawWindow;

		console.log(`and here... is pretty fucked`)
		/*It's like I wrote this and thought. well, this is done, never gonna have to edit this...

		god I'm fucking stupid

		*/

		this.methods.monitor = this.methods.monitor.bind(this);
		this.rucksack.methods.drawSilo = this.methods.drawSilo.bind(this);

		Object.keys(this.methods.siloApi).forEach(function(key){
			this.methods.siloApi[key] = this.methods.siloApi[key].bind(this);
		}, this);
		Object.keys(this.methods.commands).forEach(function(key){
			this.methods.commands[key].ex = this.methods.commands[key].ex.bind(this)
		}, this)

		this.installData.silo.ex = this.installData.silo.ex.bind(this);
		this.api.addCommand(this.installData.silo)
		var siloCommands = this.methods.commands
		var siloCommandNames = Object.keys(siloCommands);

		this.api.addParserTypeCheckFunc('scommand', function (string, index) {
			var foundSiloCommand = siloCommandNames.includes(string);
			if (!foundSiloCommand){
				this.setTypeCheckError('scommand', `(expected silo-specific command, got "${string}")... try "silo help" to print a list of scommands`, index)
			} else {
				console.log(this.buffer.syntax)
				var nodeTypes = siloCommands[string].acceptedTypes
				var argType = siloCommands[string].argType
				var syntaxObj = {};
				syntaxObj[argType] = nodeTypes
				var tbsa = this.buffer.syntax.args
				var reqArgs = this.buffer.syntax.requiredArgs
				if (tbsa[tbsa.length - 1] && tbsa[tbsa.length - 1].o.length && tbsa[tbsa.length - 1].o[0] === 'text'){
					tbsa.pop();
					tbsa.push(syntaxObj);
					console.log(argType)
					if (argType === "r"){
						reqArgs.push(nodeTypes)
					}
					this.buffer.syntax.raw = siloCommands[string].syntax
				}
				this.buffer.repeatTermCount = true;
			}
			return foundSiloCommand
		})
		if (this.rucksack.settings.isRunning){
			this.api.reRenderRucksack(true);
		}
	},
	uninstall : function () {
		if (Object.keys(this.api.getRunningPrograms()).includes('rucksack.ext')){
			this.api.runCommand('stop');
		}
		this.rucksack.methods.drawSilo = function () {};

		this.rucksack.stop = this.deprecatedFunctions.stop 
		this.rucksack.ex = this.deprecatedFunctions.ex
		this.rucksack.methods.showContents = this.deprecatedFunctions.showContents
		this.rucksack.methods.drawWindow = this.deprecatedFunctions.drawWindow

		this.methods.siloApi.resetAllData();
		
		delete this.data.storedNodes;
		delete this.rucksack.silo;

		delete this.rucksack;

		this.api.deleteCommand('silo');

		delete this.methods.api;
		delete this.methods.settings;
		delete this.data.settings;

		this.api = {};
		this.trmnl = {};

		
		this.isInstalled = false;
		return;
	},
	stop : function () {
		this.settings.isRunning = false;
		this.api.clearReservedRows();
		this.api.reserveRows(0);
		this.api.unblockCommand('mv');
		this.api.clearAccessibleMalware();
	},
}
export const program = {
	name : `silo.ext`,
	isInstalled : false,
	runsInBackground : true,
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
	settings : {},
	methods : {
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
			armRecruiter : function (recruiter) {
				this.data.armedRecruiter = recruiter;
				this.data.armedRecruiter.arm();
				this.api.reRenderRucksack(true);
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
						silo.api.log(`  RECRUIT FAILURE: ${silo.armedRecruiter.name} (detected non-exploited Anti-Malware program)`)
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
			var count = this.api.getMaxLineLength();
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
			this.api.writeToGivenRow((' -').repeat((Math.floor(this.api.getRowCount()/2))-4 )+ ' silo.ext',3)
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
			
			if (this.silo.data.armedRecruiter.isArmed){
				this.api.appendAccessibleMalware(this.silo.data.armedRecruiter);
				this.methods.drawSilo();
				return;
			};

			this.api.deleteDrawTriggeredFunctions(`silo_monitor`)
			
		},
		patch_rucksack_ex : function (bool) {
			this.api.reserveRows(23);
			this.api.clearReservedRows();
			this.settings.isRunning = true;
			if (!bool){
				this.api.writeLine(``)
				this.api.writeLine(`rummaging thru contents of rucksack.ext (+S)`)
				this.api.writeLine(``)
			}
			this.api.blockCommand('mv','cannot move nodes while rummaging through rucksack.ext (+S)')
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
	install : function (terminal, callback){
		this.trmnl = terminal;
		this.api = terminal.api;
		if (!terminal.programs[`rucksack.ext`]){
			this.api.throwError(`(unfound dependency): missing rucksack.ext`)
			return;
		};
		this.rucksack = this.trmnl.programs[`rucksack.ext`];
		this.rucksack.silo = this;
		this.data.storedNodes = this.rucksack.data.storedNodes;
		terminal.programs[this.name] = this;
		if (callback){
			callback(this.installData);
		};
		this.isInstalled = true;
		this.data.settings = this.settings
		this.methods.data = this.data;
		this.methods.api = this.api;
		this.methods.monitor = this.methods.monitor.bind(this);
		this.rucksack.methods.drawSilo = this.methods.drawSilo.bind(this);

		this.rucksack.stop = this.installData.patch_rucksack_stop;
		this.rucksack.ex = this.installData.patch_rucksack_ex;
		this.rucksack.methods.showContents = this.installData.patch_showContents;
		this.rucksack.methods.drawWindow = this.installData.patch_drawWindow;

		Object.keys(this.methods.siloApi).forEach(function(key){
			this.methods.siloApi[key] = this.methods.siloApi[key].bind(this);
		}, this);

		/*
		this.methods.siloAPI.armRecruiter = this.methods.siloAPI.armRecruiter.bind(this);
		this.methods.siloAPI.targetHardware = this.methods.siloAPI.targetHardware.bind(this);
		this.methods.siloAPI.launchRecruiter = this.methods.siloAPI.launchRecruiter.bind(this);
		*/

		this.api.patchInterfaceFunction(this.installData.patch_rucksack_ex.bind(this.rucksack), 'reRenderRucksack')

		if (this.rucksack.settings.isRunning){
			this.api.reRenderRucksack(true);
		}
	},
	stop : function () {
		this.settings.isRunning = false;
		this.api.clearReservedRows();
		this.api.reserveRows(0);
		this.api.unblockCommand('mv');
		this.api.clearAccessibleMalware();
	},
}
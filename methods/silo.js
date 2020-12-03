export const program = {
	name : `silo.ext`,
	isInstalled : false,
	runsInBackground : true,
	data: {
		armedRecruiter : {},
		targetedHardware : {},
		breakTime : 100000,
		linkTime: 0,
		linkTimeStart: Date.now(),
		linkedHardware : {},
		hardwareStatus : {
			linked : false,
			targeted : false,
		},
	},
	settings : {},
	methods : {
		showContents_patch : function () {
			this.data.storedNodes.forEach(function(node, index){
				if (node.name === `[EMPTY SLOT]`){
					this.api.writeToGivenRow(` ${index} - ${node.name}`, ((index*2) + 5));
				} else {
					this.api.writeToGivenRow(` ${index} - name : ${node.name}    type : ${node.type}`, ((index*2) + 5))
				}
			}, this)
		},
		drawWindow_patch : function () {
			var count = this.api.getMaxLineLength();
			this.api.writeToGivenRow(("-").repeat(count - 17) + 'rucksack.ext (+S)', 22)
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
			if ((this.data.hardwareStatus.linked) && (this.data.linkTime <= this.data.breakTime)){
				var timeHeader = `TIME : ${this.data.linkTime} / ${this.data.breakTime}`
				line = line + timeHeader;
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
			//can drop some kinds of triggers in here
			this.methods.drawSilo(); 
		},

	},
	installData : {},
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
		this.installed = true;
		this.data.settings = this.settings
		this.methods.data = this.data;
		this.methods.api = this.api;
		this.methods.monitor = this.methods.monitor.bind(this);
		this.rucksack.stop = this.patch_rucksack_stop;
		this.rucksack.ex = this.patch_rucksack_ex;
		this.rucksack.methods.drawSilo = this.methods.drawSilo.bind(this);
		this.rucksack.methods.showContents = this.methods.showContents_patch;
		this.rucksack.methods.drawWindow = this.methods.drawWindow_patch;
	},
	patch_rucksack_stop : function () {
		this.settings.isRunning = false;
		this.api.clearReservedRows();
		this.api.reserveRows(0);
		// this.methods.drawSilo();
		// AT some later point, we may wanna upgrade silo from a patch upgrade for rucksack to being standalone... but not now!
		this.api.unblockCommand('mv');
		this.api.clearAccessibleMalware();
		
		if (this.silo.data.armedRecruiter.isArmed){
			this.api.appendAccessibleMalware(this.silo.armedRecruiter);
			this.methods.drawSilo();
			return;
		};

		this.api.deleteDrawTriggeredFunctions(`silo_monitor`)
		
	},
	stop : function () {
		this.settings.isRunning = false;
		this.api.clearReservedRows();
		this.api.reserveRows(0);
		this.api.unblockCommand('mv');
		this.api.clearAccessibleMalware();
	},
	patch_rucksack_ex : function () {
		this.api.reserveRows(23);
		this.api.clearReservedRows();
		this.settings.isRunning = true;
		this.api.writeLine(``)
		this.api.writeLine(`rummaging thru contents of rucksack.ext (+S)`)
		this.api.writeLine(``)
		this.api.blockCommand('mv','cannot move nodes while rummaging through rucksack.ext (+S)')
		this.methods.showContents();
		this.methods.drawWindow();
		this.methods.drawSilo();
		this.data.storedNodes.forEach(function(node){
			if(node.Type === 'node'){
				this.api.appendAccessibleNodes(node)
			} else if (node.Type === 'malware'){
				this.api.appendAccessibleMalware(node)
			}
		},this);
		this.api.addDrawTriggeredFunction(this.silo.methods.monitor, `silo_monitor`);
	},
}
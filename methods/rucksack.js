export const program = {
	name : 'rucksack.ext',
	isInstalled: false,
	runsInBackground : false,
	data : {
		storedNodes : [],
		readMe : `\\n rucksack.ext v.0.6.14 \\n \\n  \\t rucksack.ext is an extension for the moleSeed Terminal that allows for the storage of up to 8 nodes. \\n \\t NOTE: rucksack.ext does not store node adjacencies.`,	
	},
	settings : {
		maxNodes : 8,
		isRunning : false,
	},
	methods : {
		showContents : function () {
			this.data.storedNodes.forEach(function(node, index){
				if (node.name === `[EMPTY SLOT]`){
					this.api.writeToGivenRow(` ${index} - ${node.name}`, (index*2) + 2);
				} else {
					if (node.Type === 'malware'){
						this.api.writeToGivenRow(` ${index} - name : ${node.name}    type : !!ERROR!!: TYPE_NOT_FOUND_`, (index*2) + 2)	
					} else {
						this.api.writeToGivenRow(` ${index} - name : ${node.name}    type : ${node.type}`, (index*2) + 2)
					}
				}
			}, this)
		},
		drawWindow : function () {
			var count = this.api.getMaxLineLength();
			this.api.writeToGivenRow(("-").repeat(count - 12) + 'rucksack.ext', 19)
		},

	},
	installData : {
		api_triggerReDraw : function (bool) {
			console.log(this)
			this.api.runCommand(`ex rucksack.ext ${bool}`);
		},
		api_checkRucksackRunning : function () {
			return this.settings.isRunning
		},
		ditch : {
			name : 'ditch',
			desc : 'ditch contents of a numbered slot in rucksack.ext',
			syntax : 'ditch [NUMBER]',
			verificationRequired : true,
			ex : function (number) {
				var trueVal = (number % 8);
				if (trueVal === -1){
					trueVal = 7;
				};
				var nodeName = this.data.storedNodes[trueVal].name
				if (nodeName === '[EMPTY SLOT]'){
					this.api.throwError(`cannot ditch nothing`);
					return;
				}
				this.data.storedNodes[trueVal] = {name : `[EMPTY SLOT]`};
				var shouldRemove = this.data.storedNodes.reduce(function(accumulator, currentValue){
					console.log(currentValue.name)
					console.log(accumulator)
					return (accumulator && (currentValue.name === `[EMPTY SLOT]`))
				}, true)
				if (shouldRemove) {
					this.api.deleteCommand('ditch')
				}
				if (this.settings.isRunning){
					this.methods.showContents();
				}
				this.api.writeLine('')
				this.api.writeLine(`ditched ${nodeName} from slot ${trueVal}`)
				this.api.writeLine('')
				return;
			}, 

		},
		grab : {
			name : 'grab',
			desc : 'grab a node and store it in numbered rucksack.ext slot',
			syntax : 'grab [NODE] into [NUMBER]',
			ex : function (nodeName, number) {
				var activeNode = this.api.getActiveNode();
				var adjNodes = this.api.getAdjacentNodes();
				var node = {name : '[EMPTY SLOT]'}
				if (activeNode.name == nodeName){
					node = activeNode;
				} else if ( adjNodes[nodeName].name === nodeName){
					node = adjNodes[nodeName]
				};
				var trueVal = (number % 8);
				if (trueVal === -1){
					trueVal = 7;
				};
				if (!this.data.storedNodes[trueVal].name === '[EMPTY SLOT]' ){
					//need to throw a verify here.... but current verify syntax is all tangled, so I can't just throw one in the middle...
				}
				if (!node.grabbable){
					this.api.throwError(`cannot grab ${node.name} into ${trueVal} (${node.type} cannot be grabbed)`)
					return;
				};

				this.data.storedNodes[trueVal] = node; 

				if (!this.installData.ditch.isAvail){
					this.api.addCommand(this.installData.ditch);
				}
				var rucksack = this
				if (node.triggerOnGrab){

					node.grabTrigger(this.trmnl, this.data.storedNodes, function(){
					 	rucksack.methods.showContents();	
					});
				}
				if (this.settings.isRunning){
					this.methods.showContents();
				}

				this.api.appendAccessibleNodes(node);
				this.api.writeLine('')
				this.api.writeLine(`grabbed ${nodeName} into slot ${trueVal}`)
				this.api.writeLine('')
			},
		},
		rummage : {
			name : 'rummage',
			desc : 'search through contents of rucksack.ext',
			syntax : 'rummage',
			ex : function () {
				if (this.settings.isRunning){
					this.api.throwError('rucksack.ext already running')
					return;
				}
				this.api.runCommand(`ex rucksack.ext`);
				
			},
		},
		mod8ImmediateInput : {
			syntax : '',
			ex : function () {

			},
		},

	},
	install : function (terminal, callback) {
		this.trmnl = terminal;
		terminal.programs[this.name] = this;
		this.api = terminal.api;
		if (callback){
			callback(this.installData);
		}
		this.isInstalled = true;
		this.data.settings = this.settings
		this.methods.data = this.data;
		this.methods.api = this.api;
		this.methods.showContents= this.methods.showContents.bind(this)
		this.data.storedNodes = new Array(8).fill({name : `[EMPTY SLOT]`})
		this.installData.grab.ex = this.installData.grab.ex.bind(this);
		this.installData.rummage.ex = this.installData.rummage.ex.bind(this);
		this.installData.ditch.ex = this.installData.ditch.ex.bind(this);
		this.installData.api_triggerReDraw = this.installData.api_triggerReDraw.bind(this);
		this.installData.api_checkRucksackRunning = this.installData.api_checkRucksackRunning.bind(this);
		this.api.addCommand(this.installData.grab);
		this.api.addCommand(this.installData.rummage);
		this.api.addInterfaceFunction(this.installData.api_triggerReDraw,`reRenderRucksack`);
		this.api.addInterfaceFunction(this.installData.api_checkRucksackRunning, `checkRucksackRunning`)

	},
	
	stop : function () {
		this.settings.isRunning = false;
		this.api.deleteMoveTriggeredFunction('append');
		this.api.clearReservedRows();
		this.api.reserveRows(0);
		this.api.unblockCommand('mv')

	},
	ex : function (bool) {
		var rucksack = this;
		// this.api.composeText(this.data.readMe)
		if (!this.settings.isRunning){
			this.api.addMoveTriggeredFunction('append', function(){
				rucksack.api.runCommand(`ex rucksack.ext true`);
			});
			
		}
		if (!bool) {
			this.api.writeLine(``)
			this.api.writeLine(`rummaging thru contents of rucksack.ext`)
			this.api.writeLine(``)
		}
		this.api.reserveRows(20);
		this.api.clearReservedRows();
		this.settings.isRunning = true;
		//this.api.blockCommand('mv','cannot move nodes while rummaging through rucksack.ext')
		this.methods.showContents();
		this.methods.drawWindow();
		this.data.storedNodes.forEach(function(node){
			console.log('appendingNodes')
			this.api.appendAccessibleNodes(node)
		},this)
	},
}
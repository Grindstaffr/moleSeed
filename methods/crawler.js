export const program = {
	name : 'crawler.mse',
	isInstalled: false,
	runsInBackground : false,
	data : {
		selectorIndex : 0,
		openDocSubMenuOn : false,
		selectedNodeName : "",
		prevNodes: [],
		navColCurrent : [],
		navColPrev : [],
		navColSubMenu : [],
	},
	settings: {
		isRunning : false,
		inpectionOn : false,
		inspectedNode : {},
	},
	methods: {
			menu : {
			drawVisualizer : function () {
				if (!this.settings.isRunning){
					return;
				}
				this.api.clearReservedRows();
				//this.api.writeLine("I'm a salty tuna fish!");
				var currentWriteRow = 4;
				var prevNode = "";
				var needPrevNode = false;
				if (this.data.prevNodes.length > 0){
					prevNode = this.data.prevNodes[this.data.prevNodes.length - 1].name;
					needPrevNode = true;
				}
				var activeNode = this.api.getActiveNode().name;
				var adjacentNodes = Object.keys(this.api.getAdjacentNodes());
				var autoIndex = adjacentNodes.indexOf(activeNode);
				adjacentNodes.splice(autoIndex,1);
				var nameLengths = adjacentNodes.map(function(key){
					return key.length
				})
				var maxAdjNameLeng = Math.max(...nameLengths);
				var	totalNamesLeng = maxAdjNameLeng + prevNode.length + activeNode.length
				var count = this.api.getMaxLineLength();
				this.api.writeToGivenRow(("-").repeat(count-11) + "crawler.mSe", 39);
				var numFillerChars = Math.floor((count - totalNamesLeng - 16)/3);
				var midSpace = (`_`).repeat(numFillerChars)
				const rows = [];
				var row_1 = (" ").repeat(4) + " " + prevNode + " " + midSpace + "_ " + activeNode;
				var row_2 = (" ").repeat(Math.floor(row_1.length - (activeNode.length/2))) + "\\";
				var row_3 = (" ").repeat(row_2.length) + "\\";
				rows.push(row_1,row_2,row_3);

				var adjNodeStartVal = row_3.length

				if (this.settings.inspectionOn){
					if (this.data.activeNode === this.settings.inspectedNode){
						//case where active node is being inspected
						var numCommandsToList = this.data.activeNode.commands.length
						
							rows[0] = row_1 + " " + ("_").repeat((numFillerChars/2)) + "_ " +this.data.activeNode.commands[0];
							if (numCommandsToList > 1){
								rows[1] = row_2 + (" ").repeat((numFillerChars/2) + (activeNode.length/2) - 4) + "\\"
								rows[2] = row_3 + (" ").repeat((numFillerChars/2) + (activeNode.length/2) - 4) + "\\" + "___ " + this.data.activeNode.commands[1]
								for (var i = 2; i < numCommandsToList; i++){
									var preRow = (" ").repeat(adjNodeStartVal) + "|" + (" ").repeat((numFillerChars/2) + (activeNode.length/2) - 4) + "|";
									currentWriteRow = currentWriteRow + 1;
									var row = preRow + "__ " + this.data.activeNode.commands[i]
									currentWriteRow = currentWriteRow + 1;
									rows.push(preRow, row);
								}
							}
							adjacentNodes.forEach(function(nodeName){
								var prerow = (" ").repeat(adjNodeStartVal ) + "|"
								currentWriteRow = currentWriteRow + 1;
								var row = prerow + midSpace + nodeName
								currentWriteRow = currentWriteRow + 1;
								rows.push(prerow,row);
							}, this)

					} else if (this.settings.inspectedNode === this.data.activeNode.visibleAdjacencies[this.settings.inspectedNode.name]){
						//case where adjacent node is being inspected
						var inspectedIndex = adjacentNodes.indexOf(this.settings.inspectedNode.name);
						adjacentNodes.forEach(function(nodeName,index){
							var prerow = (" ").repeat(adjNodeStartVal ) + "|"
							var row = prerow + midSpace + nodeName

							if (index === inspectedIndex){
								var numCommandsToList = this.settings.inspectedNode.commands.length;
								row = row + " " + ("_").repeat((numFillerChars/2)) + " " + this.settings.inspectedNode.commands[0];
								rows.push(prerow, row)
								if (index === adjacentNodes.length - 1) {
									prerow = (" ").repeat(adjNodeStartVal + 1);
								}
								if (numCommandsToList > 1){
									var rowA = prerow + (" ").repeat((numFillerChars*(3/2)) + (nodeName.length) - 4) + "\\"
									var rowB = prerow + (" ").repeat((numFillerChars*(3/2)) + (nodeName.length) - 4) + " \\" + "___ " + this.settings.inspectedNode.commands[1];
									rows.push(rowA, rowB);
									for (var i = 2; i < numCommandsToList; i++){
										var preRow = prerow + (" ").repeat((numFillerChars*(3/2)) + (nodeName.length) - 2) + "|";
									
										var row = preRow + "__ " + this.settings.inspectedNode.commands[i]
									
										rows.push(preRow, row);
									}
								}
							} else {
								rows.push(prerow, row);
							}
						},this)
					}
				} else {
					adjacentNodes.forEach(function(key){
						var prerow = (" ").repeat(adjNodeStartVal ) + "|"
						currentWriteRow = currentWriteRow + 1;
						var row = prerow + midSpace + key
						currentWriteRow = currentWriteRow + 1;
						rows.push(prerow,row);
					}, this)

				}
				rows.forEach(function(row, index){
					this.api.writeToGivenRow(row, index + 4)
				}, this);
				
				this.settings.inspectionOn = false;
				
			},
			captureActiveNode : function (){
				if (this.data.activeNode.name !== this.api.getActiveNode().name){
					this.data.prevNodes.push(this.data.activeNode);
					this.data.activeNode = this.api.getActiveNode()
				}
			},
		},
		terminal : {

		},
	},
	keyBindings : {

	},
	installData : {
		inspect : {
			name : 'inspect',
			desc : 'inspect a node in the crawler for viable commands',
			syntax: 'inspect [NODE]',
			ex : function (node) {
				if (this.data.activeNode.name === node){
					this.settings.inspectedNode = this.data.activeNode;
				} else {
					this.settings.inspectedNode = this.data.activeNode.visibleAdjacencies[node]
				}
				this.settings.inspectionOn = true;
			},
		},
		crawl : {
			name : 'crawl',
			desc : 'execute crawler.mSe in the terminal',
			syntax: 'crawl',
			ex : function () {
				if (this.settings.isRunning){
					this.api.throwError('crawler.mSe already running')
					return;
				}

				this.api.runCommand('ex crawler.mse')
			}
		},

	},
	install : function (terminal, callback) {
		this.trmnl = terminal;
		terminal.programs[this.name] = this;
		this.api = terminal.api;
		callback(this.installData);
		for (var prop in this.methods){
			for (var func in this.methods[prop]){
				func = this.methods[prop][func].bind(this)
			}
			this.methods[prop].prgm = this;
		}
		this.isInstalled = true;
		this.installData.crawl.ex = this.installData.crawl.ex.bind(this);
		this.api.addCommand(this.installData.crawl);
		
	},
	patch : function () {

	},
	stop : function () {
		this.settings.isRunning = false;
		this.api.renounceInputManagement();
		this.api.clearReservedRows();
		this.api.reserveRows(0);
		this.api.deleteCommand('inspect');
	},
	ex : function () {
		var crawler = this
		this.data.activeNode = this.api.getActiveNode();
		this.api.reserveRows(40);
		this.settings.isRunning = true;
		this.api.setSubmitTriggeredFunction(function(){
			crawler.methods.menu.captureActiveNode.bind(crawler)();
			crawler.methods.menu.drawVisualizer.bind(crawler)();
			});
		this.installData.inspect.ex = this.installData.inspect.ex.bind(this);
		this.api.addCommand(this.installData.inspect);
		
	},
	draw : function () {
		if (!this.setting.isRunning){
			return;
		}

	},
}
export const program = {
	name : 'reader.ext',
	isInstalled : true,
	runsInBackground : false,
	size : 15,
	memory : 312,
	data : {
		textName : "",
		text : "",
		pageCount : 0,
		pages : [],
		currentPageNum : 0,
		currentPageText : [],
		rowCount: 0,
		blacklistedPageNums : [],
		lineCensoredTerms : [`SWARM`, `SWARM/phoenix`, `phoenix`],
		pageCensoredTerms : [],
	},
	settings : {
		isRunning : false,
		recentlyVerified : false,
		lineBreakThreshold: .80,

	},
	methods : {
		resetData : function () {
			this.data.textName = "";
			this.data.text = "";
			this.data.pageCount = 0;
			this.data.pages = [];
			this.data.currentPageNum = 0;
			this.data.currentPageText = [];
			this.data.rowCount = 0;
			this.data.blacklistedPageNums = [];
			this.data.boundDoc = {};
			return;
		},
		filterOutMetaChars : function (text){
			var newString = text;
			var bsTypeNIndex = newString.indexOf('\n');
			var bsTypeTIndex = newString.indexOf('\t');
			if ((bsTypeNIndex === -1) && (bsTypeTIndex === -1)){
				return newString;
			} else if (bsTypeTIndex === -1) {
				bsTypeTIndex = text.length;
			} else if (bsTypeNIndex === -1) {
				bsTypeNIndex = text.length
			}
			var firstBsIndex = Math.min(bsTypeNIndex, bsTypeTIndex)
			newString = newString.substring(0,firstBsIndex) + newString.substring(firstBsIndex + 1);
			return this.methods.filterOutMetaChars(newString);
		},

		replaceTabs : function (text){
			var newString = text
			var tabIndex = 0;
			var tabIndex = newString.indexOf('\\t');
			if (tabIndex === -1){
				return newString;
			}
			newString = newString.substring(0,(tabIndex)) + "     " + newString.substring(tabIndex + 2);
			return this.methods.replaceTabs(newString);
		},

		constructNewPage : function () {
			var header = "  " + `${this.data.textName}` + (" ").repeat(this.api.getRowCount() - (this.data.textName.length + 12)) + `page: ${this.data.boundDoc.pages.length}` + ("  ");
			var blank = ""
			var upper = (" -").repeat(this.api.getRowCount()/2)
			return [header, blank, upper, blank];
		},

		pageBreak : function (doc, page) {
			var currentPage = [];
			
			if (!page){
				return this.methods.constructNewPage();
			}
			if (page.length && page.length > 0){
				currentPage = page;
			};
			if (page.length === this.api.getRowCount() - 12){
				this.data.pages.push(page);
				doc.pages.push(page);
				this.data.pageCount = doc.pages.length;
				return this.methods.constructNewPage();
			}
			if (page.length >= this.api.getRowCount() - 12){
				if (page[page.length - 1] === ""){
					page.splice(page.length - 1, 1);
					this.data.pages.push(page);
					doc.pages.push(page);
					this.data.pageCount = doc.pages.length;
					if (page.length === this.api.getRowCount() - 12){
						return this.methods.constructNewPage();
					}
				}
				this.api.throwError('Cannot Triple Push, this edge case should be infeasible (reader.js)')
				throw 'DEVELOPER DONE FUCKED UP PRETTY GOOD (reader.js)'
			};
			return currentPage;
		},

		appendLastPage : function (doc, page) {
			this.data.pages.push(page);
			doc.pages.push(page);
			this.data.pageCount = doc.pages.length
			return;
		},

		writeLinesToPages : function (text, doc, page){
			var maxSubstring = text.substring(0,this.api.getRowCount());
			var metaCharIndex = maxSubstring.indexOf(`\\`);
			var pageToWriteOn = this.methods.pageBreak(doc, page)
			if (metaCharIndex >= 0){
				if (text[metaCharIndex + 1] === `n`){
					maxSubstring = maxSubstring.substring(0,metaCharIndex)
					pageToWriteOn.push(this.methods.censor(maxSubstring, doc, pageToWriteOn));
					pageToWriteOn.push("")
					var newString = text.substring(metaCharIndex+2);
					this.methods.writeLinesToPages(newString, doc, pageToWriteOn);
					return;
				};
			};
			if (text.length < this.api.getRowCount()){
				pageToWriteOn.push(this.methods.censor(text, doc, pageToWriteOn));
				pageToWriteOn.push("");
				this.methods.appendLastPage(doc,pageToWriteOn);
				return;
			} 
			var lastSpaceIndex = maxSubstring.lastIndexOf(" ");
			if (lastSpaceIndex === -1){
				pageToWriteOn.push(this.methods.censor(maxSubstring, doc, pageToWriteOn));
				pageToWriteOn.push("")
				var newString = text.slice(this.api.getRowCount());
				this.methods.writeLinesToPages(newString, doc, pageToWriteOn);
				return;
			};
			if (lastSpaceIndex < (this.api.getRowCount() * (this.settings.lineBreakThreshold))){
				maxSubstring = maxSubstring.slice(0,this.api.getRowCount() - 1) + '-';
				pageToWriteOn.push(this.methods.censor(maxSubstring, doc, pageToWriteOn));
				pageToWriteOn.push("")
				var newString = text.slice(this.api.getRowCount()-1);
				this.methods.writeLinesToPages(newString, doc, pageToWriteOn);
				return;
			};
			maxSubstring = maxSubstring.slice(0,lastSpaceIndex);
			pageToWriteOn.push(this.methods.censor(maxSubstring, doc, pageToWriteOn));
			pageToWriteOn.push("")
			var newString = text.slice(lastSpaceIndex);
			this.methods.writeLinesToPages(newString, doc, pageToWriteOn);
		},

		handleBadRequest : function (text) {
			var midpoint = Math.floor((this.api.getRowCount() - 8)/2)
			var hBuffer = Math.floor((this.api.getRowCount()-(text.length))/2)
			var line = (" ").repeat(hBuffer) + text;
			this.api.writeToGivenRow(line, midpoint)
			return;
		},

		censor: function (line, doc, page) {
			//this can get beefed up to censor individual terms (can be used with edit FInd replace too (replace with "####") yeah yeah yeah)
			var newLine = line;
			var shouldSkip = false;

			if (this.data.lineCensoredTerms.length === 0){
				shouldSkip = true;
			};
			if (!shouldSkip){
				var dontCensorLine = this.data.lineCensoredTerms.every(function(censoredTerm){
					return (line.indexOf(censoredTerm) === -1)
				}, this);
				
				if (!dontCensorLine){
					newLine = (`#`).repeat(this.api.getRowCount())
				}
			}
			shouldSkip = false;

			if (this.data.blacklistedPageNums.indexOf(doc.pages.length) !== -1){
				
				return newLine;
			}
			
			if (this.data.pageCensoredTerms.length === 0){
				shouldSkip = true;
			}
			
			if (!shouldSkip){
				var dontCensorPage = this.data.pageCensoredTerms.every(function(censoredTerm){
				
					return (line.indexOf(censoredTerm) === -1)
				},this);

				if (!dontCensorPage){
					
					this.data.blacklistedPageNums.push(doc.pages.length);
					doc.blacklistedPageNums.push(doc.pages.length);
				}
			}
			shouldSkip = false;
			
			return newLine;

		},
		editFindReplace : function (){

		},

		compileText : function (text, doc, page) {
			/*
				doc.pages = Array of all pages;
				doc.pages[i] = single page;
				page = single page;
				page[i] = single row;

			*/
			
			var fullString = this.methods.filterOutMetaChars(text);
			fullString = this.methods.replaceTabs(text);
			this.methods.writeLinesToPages(fullString, doc);

		},
		composeText : function (doc, page){

			var currentPage = [];
			var txtDoc = {};
			var text = "";
			if (!doc){
				txtDoc = this.data
				if (this.data.pages.length = 0){
					this.stop();
					this.api.throwError('cannot find .rdbl to compose, stopping reader.ext');
					return;
				}
			} else {
				txtDoc = doc;
			}


			if (!page){
				if (doc.pages[0] === undefined){
					this.api.throwError(' .rdbl file is empty. ');
					return;
				};
				if (this.data.currentPageNum > this.data.pageCount - 1){
					this.methods.handleBadRequest('Page requested unavailable (page does not exist)')
					return;
				};
				if (this.data.blacklistedPageNums.includes(this.data.currentPageNum)){
					this.methods.handleBadRequest('Page requested unavailable (page does not exist)')
					return;
				}
				currentPage = txtDoc.pages[this.data.currentPageNum];
			} else {
				currentPage = page;
			}
			

			if (currentPage.length > (this.api.getRowCount() - 8)){
				this.stop();
				this.api.throwError(` .rdbl file corrupted (too long) cannot compose without Recompile`);
				doc.hasBeenImported = false;
				return;
			};

			var rowIndex = 0;
			
			currentPage.forEach(function(line,index,page){
				this.api.writeToGivenRow(line,index + 2);
			},this);
		},
		drawWindow : function () {
			var count = this.api.getMaxLineLength();
			this.api.writeToGivenRow(('-').repeat(count - 10) + 'reader.ext', this.data.rowCount - 1)

		},

		textDocCallback : function (text, doc){
			var skipCompile = false;
			if ((doc.name === this.data.textName) && (doc.pages.length === this.data.pages.length)){
				this.methods.composeText(this.data, this.data.pages[this.data.currentPageNum]);
				this.methods.drawWindow();
				return;
			};
			if ((doc.hasBeenImported) && (doc.pages.length >= 1)){
				console.log(doc.pages);
				console.log(this.data.currentPageNum)
				this.data.pages = doc.pages;
				this.data.pageCount = doc.pages.length
				this.data.blacklistedPageNums = doc.blacklistedPageNums;
				skipCompile = true;
			};
			this.settings.isRunning = true;
			this.api.appendToRunningPrograms('reader.ext', true)
			this.data.textName = doc.name;
			this.data.boundDoc = doc;
			this.data.text = doc.text;
			this.data.currentPageNum = 0;
			this.data.rowCount = this.api.getRowCount();
			this.data.activeNode = this.api.getActiveNode();
			this.data.rowCount = this.api.getRowCount() - 8
		
			this.api.reserveRows(this.data.rowCount);
			this.api.clearReservedRows();
			if (!skipCompile){
				this.methods.compileText(text,doc);
			}
			this.methods.composeText(doc);
			this.methods.drawWindow();

			for (var cmd in this.installData.commands){
				if (cmd !== 'read'){
					this.api.addCommand(this.installData.commands[cmd])
				}
			}
			var api = this.api
			var whiteListArray = [`stop`,`next`,`prev`,`read`];
			if (this.api.checkIfInstalled(`biblio.ext`) && (this.api.getActiveNode().type === 'library')){
				whiteListArray.push(`biblio`);
			}
			this.api.narrowCommand(whiteListArray, function () {
				api.composeText( `reader.ext is currently restricting commands... The following commands are available: ${whiteListArray.join(", ")}` , true, false, 0)
			},"")

		},
		
	},
	installData : {
		commands : {
			/*
			help : {
				name : 'help',
				desc : 'display reader.ext commands',
				syntax: 'help',
				ex : function () {

				}
			},
			*/

			next : {
				name : 'next',
				desc : 'compose next page to terminal',
				syntax: 'next',
				ex : function () {
					
					if (this.data.currentPageNum === this.data.pageCount - 1){
						this.api.throwError(`cannot increment higher than maximum`)
						return;
					}
					this.data.currentPageNum = this.data.currentPageNum + 1;
					
					this.api.clearReservedRows();
					this.methods.composeText(this.data.boundDoc,this.data.pages[this.data.currentPageNum]);
					this.api.log(`    incrementing page`)
					this.methods.drawWindow();
					return;
				},
			},
			prev : {
				name : 'prev',
				desc: 'compose previous page to terminal',
				syntax : 'prev',
				ex : function () {
					if (this.data.currentPageNum === 0){
						this.api.throwError(`cannot decrement lower than zero`)
						return;
					}
					this.data.currentPageNum = this.data.currentPageNum - 1;
					this.api.clearReservedRows();
					this.methods.composeText(this.data.boundDoc,this.data.pages[this.data.currentPageNum])
					this.api.log(`    decrementing page`)
					this.methods.drawWindow();
					return;
				},
			},
			read : {
				name : 'read',
				desc: 'read an adjacent node',
				syntax: 'read [node]',
				hasDefault : true,
				ex : function (nodeName) {
					
				
					this.data.activeNode = this.api.getActiveNode();
					if (!nodeName){
						nodeName = this.data.activeNode.name;
					};
					
					var node = this.api.getAccessibleNodes()[nodeName];
					var reader = this;
					if (!nodeName){
						this.api.warn('no node selected')
						this.api.runCommand('ex reader.ext');
						return;
					}
					if (!node){
						this.api.throwError('invalid node: selected node must be accessible');
						return;
					}
					if (this.settings.isRunning && !this.settings.recentlyVerified){
						
						this.api.verifyCommand(`close "${this.data.textName}" and start reading "${nodeName}"?`, function(bool){
							if (!bool){
								return;
							};
							reader.settings.recentlyVerified = true;
						});
						return;
					};
					if (this.settings.isRunning && this.settings.recentlyVerified) {
						this.settings.recentlyVerified = false;
					};
					if (!node.canBeRead) {
						this.api.throwError('cannot read: node lacks readable data');
						return;
					};
					if (node.type === 'directory'){
						this.api.runCommand(`read_raw ${nodeName}`)
						return;
					}
					if (this.api.commandAvailCheck(`stop`)){
						this.api.runCommand('stop')
					}
						this.api.readyCommand(`stop`)

					//
					this.methods.resetData();
					node.read(this.methods.textDocCallback);
				},
			},
			/*
			stop : {
				name : 'stop',
				desc : 'stop reader.ext',
				syntax: 'stop',
				ex: function () {
					this.stop();
					return;
				},
			},
			*/
		},

	},
	initializeSettings : function () {
		var settings = {isRunning : false,
				recentlyVerified : false,
				lineBreakThreshold: .80,}
		this.settings = settings;
		this.api.setSettings('reader.ext', settings);
		return;
	},
	initializeData : function () {
		var data = {
			textName : "",
			text : "",
			pageCount : 0,
			pages : [],
			currentPageNum : 0,
			currentPageText : [],
			rowCount: 0,
			blacklistedPageNums : [],
			lineCensoredTerms : [`SWARM`, `SWARM/phoenix`, `phoenix`],
			pageCensoredTerms : [],
		};
		this.data = data;
		this.api.setData('reader.ext', data);
		return;
	},
	setAPI : function (api) {
		this.api = api;
		return;
	},
	setData : function (data) {
		this.data = data;
		return;
	},
	setSettings : function (settings) {
		this.settings = settings;
		return;
	},
	install : function (terminal, callback){
		this.trmnl = terminal;
		terminal.programs[this.name] = this;
		this.api = terminal.api;
		callback(this.installData);
		this.initializeData();
		this.initializeSettings();
		for (var prop in this.methods){
				this.methods[prop] = this.methods[prop].bind(this)
		}
		this.installed = true;
		for (var cmdName in this.installData.commands){
			this.installData.commands[cmdName].ex = this.installData.commands[cmdName].ex.bind(this);
		};
		this.api.renameCommand(`read`, `read_raw`);
		this.api.hideCommand(`read_raw`);
		this.api.addCommand(this.installData.commands.read);
	},
	uninstall : function () {
		this.trmnl = {};
		this.api = {};
		this.installed = false;
		this.api.deleteCommand('read');
		this.api.renameCommand('read_raw', 'read');
		this.api.unhideCommand('read');
	},
	ex : function (nodeName) {
		var reader = this;
		if (nodeName === "false"){
			return;
		}
		this.api.warn(`use of "ex reader.ext" deprecated, use "read [NODE]" instead`)
		
		return;
		//this.api.extendCommand(this.methods.read, 'read which node?')
		//this.methods.read(nodeName)
	},
	stop : function () {
		this.methods.resetData();
		this.settings.isRunning = false;
		this.api.renounceInputManagement();
		this.api.clearReservedRows();
		this.api.reserveRows(0);

		for (var cmdKey in this.installData.commands){
			if (cmdKey !== 'read'){
				this.api.deleteCommand(cmdKey);
			}
		};



	},

}
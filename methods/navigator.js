export const program = {
	name : 'navigator.mS',
	navModeOn : true,
	pdfModeOn : false,
	openDocSubMenuOn : false,
	activeNode : {},
	previousNodes : [],
	togglePDFMode : function () {
		this.navModeOn = !this.navModeOn
		this.pdfModeOn = !this.pdfModeOn
	},
	navContent : [],
	pinnedCommands : [],
	prevButton : {
		name : 'prev',
		press : function () {
			if(this.parent.activeNode.canOpen){
				//resets doc specific pinned command
				this.parent.pinnedCommands.pop();
			}
			this.parent.activeNode = this.parent.previousNodes.pop();
			this.parent.assembleText();
			if (this.parent.previousNodes.length === 0){
				this.parent.pinnedCommands.pop();
			}
			if(this.parent.activeNode.canOpen){
				this.parent.openButton.name = `open ${this.parent.activeNode.name}`;	
				this.parent.pinnedCommands.push(this.parent.openButton);
			}
		}
	},
	openButton : {
		name : `open`,
		press : function () {
			//functionality needs to be widened to a VIEW mode
			//(as oppsed to just a PDF mode)
			this.parent.openDocSubMenuOn = true;
			this.parent.navModeOn = false;
			this.parent.selectorLocation = 0;
		}
	},	
	selectorLocation : 0,
	selectorControl : {
			'up' : function () {
				
				if (this.parent.selectorLocation !== 0){
					this.parent.selectorLocation = this.parent.selectorLocation - 1
				}
			},
			'down' : function () {
				var selectableCount = this.parent.navContent.length + this.parent.pinnedCommands.length
				if (this.parent.selectorLocation < (selectableCount - 1)) {
					this.parent.selectorLocation = this.parent.selectorLocation + 1
				}
			},
			'select' : function () {
				if (this.parent.openDocSubMenuOn){
					return this.open();
				}
				var selectorTemp = this.parent.selectorLocation;
				this.parent.selectorLocation = 0;
				if (selectorTemp >= this.parent.navContent.length) {
					selectorTemp = selectorTemp - this.parent.navContent.length
					this.parent.pinnedCommands[selectorTemp].press();
				} else{
					if(this.parent.activeNode.canOpen){
						//resets doc specific pinned command
						this.parent.pinnedCommands.pop();
					}
					this.parent.previousNodes.push(this.parent.activeNode)
					//move current node on top of the previous nodes stack
					this.parent.activeNode = this.parent.navContent[selectorTemp]
					this.parent.activeNode.assembleVisibleAdjacencies();
					//set active node to the node selected
					this.parent.assembleText();
				if (this.parent.previousNodes.length > 0){
					if (this.parent.pinnedCommands.length === 0){
						this.parent.pinnedCommands.push(this.parent.prevButton)
					}
				}
				if (this.parent.activeNode.canOpen){
						//checks if active node has doc-specific pinned command
					this.parent.openButton.name = `open ${this.parent.activeNode.name}`;
						//sets name on doc specific pinned command
					this.parent.pinnedCommands.push(this.parent.openButton);
						//adds doc-specific command to toolbar
					}
					//reassembles the nav content for the current selected node
				}
				return this.parent.navContent[this.parent.selectorLocation]
			},
			'open' : function () {
				if (this.parent.selectorLocation === 1){
					this.parent.openDocSubMenuOn = false;
					this.parent.navModeOn = true;
					this.parent.pdfModeOn = false;
				}
				if (this.parent.selectorLocation === 0){
					this.parent.assetViewer.readyAsset(this.parent.activeNode);
					this.parent.openDocSubMenuOn = false;
					this.parent.navModeOn = false;
					this.parent.pdfModeOn = true;
				}
			}
	},
	resumeNav : function () {
		this.navModeOn = true;
		this.pdfModeOn = false;
		this.openDocSubMenuOn = false;
	},
	init : function (canvas, boundViewer) {
		if (canvas === undefined) {
			throw `ERROR: cannot initialize navBar without a canvas`
		}
		if (boundViewer === undefined) {
			throw `ERROR: cannot initialize navBar without binding an Asset Viewer`
		}
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		this.selectorControl.parent = this;
		this.prevButton.parent = this;
		this.openButton.parent = this;
		this.assetViewer = boundViewer
		delete this.init;
		return this;
	},
	fillStyle : "#CCFFFF",
	backGroundStyle : "black",
	killSwitch : false,
	selection : {},
	/*
	for modularity's sake, windowTender should likely be in the AssetViewer
	*/
	openWindow : function () {
		this.context.clearRect(320,80,640,800)
	},
	closeWindow : function () {
		var temp = this.context.fillStyle;
		this.context.fillStyle = this.backGroundStyle;
		this.context.fillRect(320,80,640,800)
	},
	windowTender : function () {
		if (this.pdfModeOn){
			this.openWindow();
		} else {
			//maynot be necessary
			this.closeWindow();
		}
	},
	draw : function (context = this.context, hexcode) {
		//note hard-coded numbwers may be subject to moving, as typeface may change, and these 18.4 multiples are for the terminal monospace font
		if (hexcode === undefined) {
			hexcode = this.fillStyle;
		}
		var holdingStyle = context.fillStyle;
		context.fillStyle = hexcode;
		if (this.navModeOn) {
			context.fillText('>', 0, ((this.selectorLocation + 1) * 18.4))
			var fileCount = this.navContent.length
			for (var i = 0; i < fileCount; i++){
				context.fillText(`${this.navContent[i].name}`, 18.4, ((i+1) * 18.4))
			}
			for (var i = fileCount; i < fileCount + this.pinnedCommands.length; i++){
				context.fillText(`${this.pinnedCommands[i-fileCount].name
				}`, 18.4, ((i+1) * 18.4))
			}
		}
		if (this.openDocSubMenuOn) {
			context.fillText('>', 0, ((this.selectorLocation + 2)*18.4))
			context.fillText('open file?', 18.4, (1 * 18.4))
			context.fillText('y', 18.4, (2 * 18.4))
			context.fillText('n', 18.4, (3 * 18.4))
		}
		context.fillStyle = holdingStyle;
	},
	assembleText : function () {
		this.navContent = [];
		for (var node in this.activeNode.visibleAdjacencies){
			this.navContent.push(this.activeNode.visibleAdjacencies[node])
		}
		this.navContent.sort(function(a,b){
			if (a.name < b.name) {
				return -1;
			}
			if (b.name < a.name) {
				return 1; 
			}
			return 0;
		})
	}
};
	


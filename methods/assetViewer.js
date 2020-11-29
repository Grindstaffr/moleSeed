export const assetViewer = {
	selectedAsset : {},
	isInstalled : false,
	selectedAssetIsLoaded : false,
	shouldRender : false,
	canvasIsCleared : false,
	displayData: false,
	pageFinder: false,
	scaleFactor : 1,
	zoomFactor : 1.07,
	keyCommands : {
		basicCommands : {
			'esc' : 'exit',
			'->' : 'previous page',
			'<-' : 'next page',
			'9' : 'show advanced',
			'0' : 'show commands'
		},
		advancedCommands : {
			'+' : 'zoom in',
			'-' : 'zoom out',
			'w' : 'move up',
			's' : 'move down',
			'a' : 'move left',
			'd' : 'move right',
			'q' : 'toggle data',
			'e' : 'page finder',
			'space' : 'refresh',
			'~' : 'toggle theme',
			'0' : 'hide commands',
			'9' : 'hide advanced',
		},
		pageFinderCommands : {

		},
		advancedCommandsOn : false,
		commandsOn : false
	},
	drawKeyCommands : function () {
		var ctx = this.bdContext
		var hold = this.bdContext.fillStyle
		this.bdContext.fillStyle = "#ccffff"
		var bdHeight = this.boundaryCanvas.height;
		var bdWidth = this.boundaryCanvas.width;
		var letterheight = 12.4 //should make this scale (with the Canvs) baby
		var windowsize = Math.floor((5/6)*(bdHeight))
		var initialX = (((bdWidth - windowsize)/2) + windowsize) + letterheight/2
		var initialY = Math.floor((1/6)*(bdHeight))
		var commandNumber = 0
		var xValue = this.canvas
		if (this.keyCommands.commandsOn){
			for (var key in this.keyCommands.basicCommands){
				if (key !== '9' && key !== '0'){
					var fillLength = (6-(key.length));
					var string = " ".repeat(fillLength).concat(`: ${this.keyCommands.basicCommands[key]}`);
					string = `${key}`.concat(string);
					ctx.fillText(string, initialX, initialY + (commandNumber*letterheight));
					commandNumber = commandNumber + 1;
				}
			}
			if (this.keyCommands.advancedCommandsOn){
				for (var key in this.keyCommands.advancedCommands){
					var fillLength = (6-(key.length));
					var string = " ".repeat(fillLength).concat(`: ${this.keyCommands.advancedCommands[key]}`);
					string = `${key}`.concat(string);
					ctx.fillText(string, initialX, initialY + (commandNumber*letterheight));
					commandNumber = commandNumber + 1;
				}
			} else {
				var fillLength = (6-('9'.length));
				var string = " ".repeat(fillLength).concat(`: ${this.keyCommands.basicCommands['9']}`);
				string = `${'9'}`.concat(string);
				ctx.fillText(string, initialX, initialY + (commandNumber*letterheight));
				commandNumber = commandNumber + 1
			}
		} else {
			var fillLength = (6-(`0`.length));
			var string = " ".repeat(fillLength).concat(`: ${this.keyCommands.basicCommands[`0`]}`);
			string = `0`.concat(string);
			ctx.fillText(string, initialX, initialY + (commandNumber*letterheight));
			commandNumber = commandNumber + 1
		}
		this.context.fillStyle = hold
	},
	toggleVisibleCommands : function () {
		this.keyCommands.commandsOn = !this.keyCommands.commandsOn
	},
	toggleAdvancedCommands : function () {
		this.keyCommands.advancedCommandsOn = !this.keyCommands.advancedCommandsOn
	},

	refresh : function (needsToScale) {
//		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
//		this.routeAndRender[this.selectedAsset.type](needsToScale);
		this.clearCanvas();
		this.selectedAssetIsLoaded = false;
	},

	escape : function () {
		this.clearCanvas();
		this.shouldRender = false;
		this.selectedAssetIsLoaded = false;
	},
	nextPage : function () {
		console.log(this.selectedAsset.currentPage)
		if (this.selectedAsset.hasBeenPreRendered && this.selectedAsset.numPages !== undefined){
			if (this.selectedAsset.currentPage < this.selectedAsset.numPages){
				this.selectedAsset.currentPage = this.selectedAsset.currentPage + 1;
			}
		}
		this.refresh();
	},
	previousPage : function () {
		console.log(this.selectedAsset.currentPage)
		if (this.selectedAsset.currentPage > 1){
			this.selectedAsset.currentPage = this.selectedAsset.currentPage - 1;
		}
		this.refresh();
	},
	eliminateOffset : function () {
		this.selectedAsset.offsetX = 0;
		this.selectedAsset.offsetY = 0;
	},
	calculateCenter : function () {
		return;
	},
	scaleCanvas : function (scale) {
		this.canvas.width = this.canvas.width * scale
		this.canvas.height = this.canvas.height * scale
	},
	scaleCanvasX : function (scale) {
		this.canvas.width = this.canvas.width * scale
	},
	scaleCanvasY : function (scale) {
		this.canvas.height = this.canvas.height * scale
	},
	wedgeScaleCanvasX : function (positionObject) {
		//scales canvas horizontally to right edge
		console.log('wedgeScaleCanvasX')
		var position = positionObject;
		var trueWidth = this.canvas.width;
		var maxWidth = this.canvas.width + position.rightBuffer;
		var maxXScale = (maxWidth / trueWidth);
		console.log(maxXScale)
		this.scaleCanvasX(maxXScale);
	},
	wedgeScaleCanvasY : function (positionObject) {
		//scales canvas vertically to bottom edge
		console.log('wedgeScaleCanvasY')
		var position = positionObject;
		var trueHeight = this.canvas.height;
		var maxHeight = this.canvas.height + position.bottomBuffer
		var maxYScale = (maxHeight / trueHeight);
		console.log(maxYScale)
		this.scaleCanvasY(maxYScale);
	},
	defineZoomCenter : function () {
		var position = this.canvasTruePosition();
		// 640 and ... 480 (in true)
		var focalPointX = 640 - position.left
		var focalPointY = 480 - position.top
		if (focalPointX > 0 && focalPointY > 0){
			return {
				left : focalPointX,
				top: focalPointY,
			}
		} else {
			return {
				left : 0,
				top: 0,
			}
		}
	},
	defineCoordinates : function () {
		var canvasFrameWidth = (this.canvas.width);
		var canvasFrameHeight = (this.canvas.height);
		var viewFrameWidth = this.backgroundCanvas.width;
		var viewFrameHeight = this.backgroundCanvas.height;
		var canvasX = parseInt(this.canvas.style.left.split('p')[0]);
		var canvasY = parseInt(this.canvas.style.top.split('p')[0]);
		var viewerX = parseInt(this.backgroundCanvas.style.left.split('p')[0]);
		var viewerY = parseInt(this.backgroundCanvas.style.top.split('p')[0]);

		var x = ((viewerX + (viewFrameWidth/2)) - (canvasX + (canvasFrameWidth/2)))
		var y = ((viewerY + (viewFrameHeight/2)) - (canvasY + (canvasFrameHeight/2)))

		return {
			x : -Math.floor(x),
			y : Math.floor(y),
		}
	},
	__scaleCanvasPositionObject : function (scale) {
		var position = this.canvasTruePosition();
		var prop_RightEdge = position.right * scale;
		var prop_BottomEdge = position.bottom * scale;
		var prop_RightBuff = this.boundaryCanvas.width - prop_RightEdge;
		var prop_BottomBuff = this.boundaryCanvas.height - prop_BottomEdge;
		var scaledCPObject = {
			left : position.left,
			top : position.top,
			right : prop_RightEdge,
			bottom : prop_BottomEdge,
			rightBuffer : prop_RightBuff,
			bottomBuffer : prop_BottomBuff,
		}
		return scaledCPObject;
	},
	__canvasScalar : function (boolean) {
		var position = this.canvasTruePosition();
		var wannaZoomIn = boolean;
		var zoomVal = this.zoomFactor;
		if (wannaZoomIn){
			zoomVal = zoomVal;
			var propDimensions = this.__scaleCanvasPositionObject(zoomVal);

			var shouldScaleX = (propDimensions.rightBuffer > 0)
			var shouldScaleY = (propDimensions.bottomBuffer > 0)

			if(shouldScaleX && shouldScaleY){
				this.scaleCanvas(zoomVal);
				return;
			} else {
				if(shouldScaleX){
					this.scaleCanvasX(zoomVal);
					this.wedgeScaleCanvasY(this.canvasTruePosition());
				};
				if(shouldScaleY){
					this.scaleCanvasY(zoomVal);
					this.wedgeScaleCanvasX(this.canvasTruePosition());
				};
				if(!shouldScaleX && !shouldScaleY){
					this.wedgeScaleCanvasX(this.canvasTruePosition());
					this.wedgeScaleCanvasY(this.canvasTruePosition());
				};
			return;
			}
		} else { //case for zooming out
			//should truncate beyond thousandths place
			zoomVal = Math.round((1 / this.zoomFactor)*(1000))/1000
			var potScaleFactor = this.scaleFactor * zoomVal;
			var futureAssetHeight = this.selectedAsset.height * potScaleFactor;
			var futureAssetWidth = this.selectedAsset.width * potScaleFactor;
			var shouldScaleX = (futureAssetWidth < this.canvas.width);
			var shouldScaleY = (futureAssetHeight < this.canvas.height);
			if (shouldScaleX && shouldScaleY){
				var scaleValueX = (futureAssetWidth/this.canvas.width);
				var scaleValueY = (futureAssetHeight/this.canvas.height);
				this.scaleCanvasX(zoomVal);
				this.scaleCanvasY(zoomVal);
				return;
			} else {
				if (shouldScaleX){
					var scaleValueX = (futureAssetWidth/this.canvas.width);
					this.scaleCanvasX(scaleValueX);
				};
				if (shouldScaleY){
					var scaleValueY = (futureAssetHeight/this.canvas.height);
					this.scaleCanvasY(scaleValueY);
				};
				return;
			}
			
		}	
	},
	__prototypePanAndZoom : function (boolean) {
		var wannaZoomIn = boolean;
		var zoomCenter = this.defineZoomCenter();
		var zoomFactor = this.zoomFactor;
		if (!wannaZoomIn) {
			zoomFactor = Math.round((1 / this.zoomFactor)*(1000))/1000
		}
		var newZoomCenter = {};
		newZoomCenter.left = Math.round(zoomCenter.left * zoomFactor);
		newZoomCenter.top = Math.round(zoomCenter.top * zoomFactor);
		var toPanX = zoomCenter.left - newZoomCenter.left;
		var toPanY = zoomCenter.top - newZoomCenter.top;



		if (toPanX < 0){
			toPanX = 0 - toPanX
			this.slideLeft(toPanX)
		} else {
			this.slideRight(toPanX)
		}
		if (toPanY < 0){
			toPanY = 0 - toPanY
			this.slideUp(toPanY)
		} else {
			this.slideDown(toPanY)
		}
		this.__canvasScalar(boolean);
	},
	canCanvasZoom : function () {
		var position = this.canvasTruePosition();
		var proposedRightEdge = position.right * this.zoomFactor
		var proposedBottomEdge = position.bottom * this.zoomFactor
		return ((proposedRightEdge - position.right < position.rightBuffer) && ( proposedBottomEdge -position.bottom < position.bottomBuffer))
	},
	zoomIn : function () {
		this.eliminateOffset();
			//should zoom based on this.zoomFactor, not a hardcoded number
			this.__prototypePanAndZoom(true);
			this.scaleFactor = this.scaleFactor * this.zoomFactor;
			this.clearCanvas();
			this.context.scale(this.scaleFactor,this.scaleFactor);
			this.refresh(true);
		return;
	},
	zoomOut : function () {
		// TO DO :
		//integrate with __prototypePanAndZoom
		//so that when zooming out, 
		//whatever is at the center of the viewer
		//stays at the center of the viewer
		//
		this.eliminateOffset();
		//should zoom based on (the reciprocal of) this.zoomFactor
		// not a hardcoded number (.9375)
		this.__prototypePanAndZoom(false);
		var zoomVal = Math.round((1 / this.zoomFactor)*(1000))/1000;
		this.scaleFactor = this.scaleFactor * zoomVal;
		this.context.scale(this.scaleFactor,this.scaleFactor);
		this.refresh(true);
		return;
	},
	canvasTruePosition : function () {
		var tempLeftArray = this.canvas.style.left.split("p");
		var pxFromLeftWall = parseInt(tempLeftArray[0])
		var tempTopArray = this.canvas.style.top.split("p");
		var pxFromTopWall = parseInt(tempTopArray[0]);
		var rightEdgePos = pxFromLeftWall + this.canvas.width;
		var bottomEdgePos = pxFromTopWall + this.canvas.height;
		var pxFromRightWall = this.boundaryCanvas.width - rightEdgePos;
		var pxFromBottomWall = this.boundaryCanvas.height - bottomEdgePos;
		var aspectRatio = ((rightEdgePos-pxFromLeftWall)/(bottomEdgePos - pxFromTopWall))
		var returnObject = {
			left : pxFromLeftWall,
			top : pxFromTopWall,
			right: rightEdgePos,
			bottom : bottomEdgePos,
			rightBuffer : pxFromRightWall,
			bottomBuffer : pxFromBottomWall,
			aspectRatio : aspectRatio,
		}
		return returnObject
	},
	canvasHStretch : function (px = 10) {
		//ideally, this should work for correcting zoom as well as pan
		var truePdfWidth = this.selectedAsset.width * this.scaleFactor;
		var maxStretch = truePdfWidth - this.canvas.width;
		var stretchVal = Math.min(maxStretch, px);
		if (stretchVal < px){
			this.context.scale(this.scaleFactor, this.scaleFactor)
		this.refresh()
			this.canvas.width = this.canvas.width + stretchVal;
			return px;
		} else {
			this.context.scale(this.scaleFactor, this.scaleFactor)
		this.refresh()
			this.canvas.width = this.canvas.width + px;
			return px;
		}
	},
	canvasVStretch : function (px = 10) {
		//should work for panning after zoom truncation as well as pan truncation
		//but don't know if it does yet?
		var truePdfHeight = this.selectedAsset.height * this.scaleFactor;
		var maxStretch = truePdfHeight-this.canvas.height;
		var stretchVal = Math.min(maxStretch, px)
		if (stretchVal < px){
			
			this.canvas.height = this.canvas.height + stretchVal;
			this.context.scale(this.scaleFactor, this.scaleFactor)
			this.refresh()
			return px;
		} else {
			this.canvas.height = this.canvas.height + px
			this.context.scale(this.scaleFactor, this.scaleFactor)
			this.refresh()
			return px;
		}
	},
	canvasHShrink : function (px = 10) {
		var position = this.canvasTruePosition();
		var shrinkVal =  Math.max(px - position.rightBuffer, 0);
		this.canvas.width = this.canvas.width - shrinkVal;
		if (shrinkVal > 0){
			this.context.scale(this.scaleFactor, this.scaleFactor)
		this.refresh()
			return px;
		} else {
			this.context.scale(this.scaleFactor, this.scaleFactor)
		this.refresh()
			return px;
		}
	},
	canvasVShrink : function (px = 10) {
		var position = this.canvasTruePosition();
		var shrinkVal = Math.max(px - position.bottomBuffer, 0);
		this.canvas.height = this.canvas.height - shrinkVal;
		if (shrinkVal > 0){
			console.log('shrinking by' + shrinkVal)
			this.context.scale(this.scaleFactor, this.scaleFactor)
			this.refresh()
			return px;
		} else {
			this.context.scale(this.scaleFactor, this.scaleFactor)
			this.refresh()
			return px;
		}
	},
	slideUp : function (px = 10) {
		var position = this.canvasTruePosition();
		if (position.bottom < 80){
			//If trailing edge outside viewframe, return early, do not pan
			return;
		}
		if (position.bottomBuffer < 1){
			//tryin to eliminate all these offset things with canvas shrinking
			//and canvas shiftin
			this.canvasSlideUp(this.canvasVStretch(px))
		} else {
			this.canvasSlideUp(px);
		}
	},
	slideDown : function (px = 10) {
		var position = this.canvasTruePosition();
		if ( position.top > 880) {
			//If trailing edge outside viewframe, return early, do not pan
			return;
		}
		if (position.bottomBuffer - px < 0){
			//this should Vshrink canvas, instead of fucking with the offset
			//then do a canvas slide
			console.log(`bottomBuffer is` + position.bottomBuffer)
			var tony = this.canvasVShrink(px)
			console.log(tony)
			this.canvasSlideDown(tony)
		} else {
			//this should check if a vstretch is needed,
			//and ifso, perform it,
			//otherwise do a canvasslide
			this.canvasSlideDown(px);
		}
	},
	slideLeft : function (px = 10) {
		var position = this.canvasTruePosition();
		if (position.right < 320){
			//If trailing edge outside viewframe, return early, do not pan
			return;
		}
		
		if (position.rightBuffer < 1){
			//this should hShrink canvas, instead of fucking with the offset
			//then do a canvas slide
			this.canvasSlideLeft(this.canvasHStretch(px))
		} else {
			this.canvasSlideLeft(px);
		}
	},
	slideRight : function (px = 10) {
		var position = this.canvasTruePosition();
		if (position.left > 960){
			//If trailing edge outside viewframe, return early, do not pan
			return;
		}
		if (position.rightBuffer - px < 0){
			this.canvasSlideRight(this.canvasHShrink(px))
		} else {
			this.canvasSlideRight(px);
		}
	},
	canvasSlideRight : function (px = 10) {
		var tempArray = this.canvas.style.left.split("p");
		var value = parseInt(tempArray[0]);
		value = value + px;
		var newDescription = value.toString().concat("px");
		this.canvas.style.left = newDescription;
	},
	canvasSlideLeft : function (px = 10) {
		var tempArray = this.canvas.style.left.split("p");
		var value = parseInt(tempArray[0]);
		value = value - px;
		var newDescription = value.toString().concat("px");
		this.canvas.style.left = newDescription;
	},
	canvasSlideUp : function (px = 10) {
		var tempArray = this.canvas.style.top.split("p");
		var value = parseInt(tempArray[0]);
		value = value - px;
		var newDescription = value.toString().concat("px");
		this.canvas.style.top = newDescription;
	},
	canvasSlideDown : function (px = 10) {
		var tempArray = this.canvas.style.top.split("p");
		var value = parseInt(tempArray[0]);
		value = value + px;
		var newDescription = value.toString().concat("px");
		this.canvas.style.top = newDescription;
		var position = this.canvasTruePosition();
		console.log(position.bottomBuffer)
	},
	clearCanvas : function () {
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
		this.canvasIsCleared = true;
	},
	loadAnimation : function () {
		if (!this.canvasIsCleared){
			return;
		}
		var loadText = {
			'0' : 'Loading',
			'3' : 'Loading .',
			'6' : 'Loading . .',
			'9' : 'Loading . . .',
			'12' : 'Loading . . . .',
			'15' : 'Loading . . . . .',
		};
		var hold = this.bgContext.fillStyle
		this.bgContext.fillStyle = this.backgroundTextHue

		if ((this.loadFrame % 3) === 0){
			this.bgContext.fillText(loadText[this.loadFrame.toString()],300,400)
		} else {
			var frame = ((Math.floor(this.loadFrame/3))*3)
			this.bgContext.fillText(loadText[frame.toString()],300,400)
		}

		
		if (this.loadFrame < 15){
			this.loadFrame = this.loadFrame + 1
		} else {
			this.loadFrame = 0
		}
		this.bgContext.fillStyle = hold
	},
	clearBackdrop : function () {
		this.bgContext.clearRect(0,0,this.backgroundCanvas.width, this.backgroundCanvas.height);
		this.loadFrame = 0;
		this.bgContext.fillStyle = this.backgroundHue;
			this.bgContext.fillRect(0,0,this.backgroundCanvas.width,this.backgroundCanvas.height)
		console.log('resetting')
	},
	lightenBackdrop : function () {
		this.backgroundHue = "#EFFFFF"
		this.backgroundTextHue = "#00080F"
		this.darkModeOn = false;
	},
	darkenBackdrop : function () {
		this.backgroundHue = "#00080F"
		this.backgroundTextHue = "#EFFFFF"
		this.darkModeOn = true;
	},
	toggleViewMode : function () {
		if (this.darkModeOn){
			this.lightenBackdrop();
		} else {
			this.darkenBackdrop();
		}
		this.shouldRender = true;
	},
	toggleData : function () {
		this.pageFinder = false;
		this.displayData = !this.displayData;
	},
	togglePageFinder : function () {
		this.displayData = false;
		this.pageFinder = !this.pageFinder;
	},
	drawData : function () {
		//letterheight(needs to be scalable?)
		if (!this.displayData){
			return;
		}
		var letterheight = 12.4
		var ctx = this.bdContext;
		var bdHeight = this.boundaryCanvas.height;
		var bdWidth = this.boundaryCanvas.width;
		var edgeLength = Math.floor((5/6)*(bdHeight));
		var vborder = ((bdHeight - edgeLength)/2)
		var titleX = Math.floor((2*(bdWidth - edgeLength))/3);
		var titleY = Math.floor(((bdHeight - edgeLength)/2) - (letterheight/2));
		var title = this.selectedAsset.title
		ctx.fillText(title, titleX, titleY)
		var p = this.selectedAsset.currentPage;
		var pp = this.selectedAsset.numPages;
		var pageX = Math.floor(edgeLength);
		ctx.fillText(`page ${p}/${pp}`, pageX ,titleY)
		var zoom = Math.floor(this.scaleFactor * 100).toString().concat("%")
		var botY = (edgeLength + vborder + (letterheight));
		ctx.fillText(zoom, pageX, botY)
		var coordinates = this.defineCoordinates();
		var coordinateXString = `x : ${coordinates.x}`
		var coordinateYString = `y : ${coordinates.y}`
		var botY2 = botY + (1*(letterheight))
		
		ctx.fillText(coordinateXString, titleX, botY)
		ctx.fillText(coordinateYString, titleX, botY2)

	},
	drawPageFinder : function () {

	},
	drawWindow : function () {
		var bdHeight = this.boundaryCanvas.height;
		var bdWidth = this.boundaryCanvas.width;
		var edgeLength = Math.floor((5/6)*(bdHeight))
		var initialX = Math.floor((bdWidth - edgeLength)/2)
		var initialY = Math.floor((bdHeight - this.backgroundCanvas.height)/2)
		var ctx = this.bdContext;
		ctx.beginPath();
		ctx.strokeStyle = "#ccffff"
		ctx.rect(initialX,initialY,edgeLength,edgeLength)
		ctx.stroke();

	},
	draw : function () {

		var assetViewer = this
		
		if (this.shouldRender){
			this.bgContext.fillStyle = this.backgroundHue
			this.bgContext.fillRect(0,0,this.backgroundCanvas.width,this.backgroundCanvas.height)
			this.drawWindow()
			this.drawKeyCommands();
			this.drawData();
			if (this.selectedAssetisLoading || assetViewer.isRendering){
				this.loadAnimation();
			}
			if (!this.selectedAssetisLoading && !this.selectedAssetIsLoaded){
				this.clearCanvas();
				this.selectedAsset.render(assetViewer.context, function(){
						assetViewer.isRendering = false;
						assetViewer.loadedPage = assetViewer.selectedAsset.currentPage
						assetViewer.canvasIsCleared = false;
						assetViewer.selectedAssetisLoading = false;
						assetViewer.selectedAssetIsLoaded = true;
						assetViewer.clearBackdrop();
					}, function () {
						assetViewer.isRendering = true;
					})
				this.selectedAssetisLoading = true;
			} else if (true) {

			}
			

		} else {
			if (this.canvasIsCleared){
				return;
			} else {
				this.clearCanvas();
			}
		}
	},


	scaleAndPositionCanvas : function () {
		this.canvas.width = this.selectedAsset.width * this.selectedAsset.scale;
		this.canvas.height = this.selectedAsset.height * this.selectedAsset.scale;
		var diffX = 640 - this.canvas.width;
		var diffY = 800 - this.canvas.height;
		var leftPX = 320 + (diffX/2);
		var topPX = 80 + (diffY/2);
		var leftPXstr = leftPX.toString().concat("px");
		var topPXstr = topPX.toString().concat("px");
		this.canvas.style.left = leftPXstr;
		this.canvas.style.top = topPXstr;
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	},
	__scaleAndPositionCanvas : function (obj) {
		obj.canvas.width = obj.selectedAsset.width * obj.selectedAsset.scale;
		obj.canvas.height = obj.selectedAsset.height * obj.selectedAsset.scale;
		var diffX = 640 - obj.canvas.width;
		var diffY = 800 - obj.canvas.height;
		var leftPX = 320 + (diffX/2);
		var topPX = 80 + (diffY/2);
		var leftPXstr = leftPX.toString().concat("px");
		var topPXstr = topPX.toString().concat("px");
		obj.canvas.style.left = leftPXstr;
		obj.canvas.style.top = topPXstr;
		obj.context.clearRect(0,0,obj.canvas.width,obj.canvas.height);
	},

	readyAsset : function (asset) {
		this.selectedAsset = asset;
		this.selectedAsset.currentPage = 1;
		var tony = this;
		if (!this.selectedAsset.hasBeenPreRendered){
			this.selectedAsset.preRender(function(page){
				tony.__scaleAndPositionCanvas(tony);
				tony.shouldRender = true;
				tony.selectedAssetIsLoaded = false;
			});
		} else {
			this.shouldRender = true;
		}
		
	},
	initializeBackground : function (canvas) {
		this.darkenBackdrop();
		this.backgroundCanvas = canvas;
		this.bgContext = this.backgroundCanvas.getContext('2d');

		this.bgContext.fillRect(0,0,this.backgroundCanvas.width,this.backgroundCanvas.height)
		this.loadFrame = 0;
		this.bgContext.font = '8px terminalmonospace'
	},
	init : function (canvas, boundaryCanvas, backgroundCanvas) {
		if (backgroundCanvas === undefined) {
			throw `ERROR: cannot initialize Asset Viewer without its own canvas`
		}
		this.initializeBackground(backgroundCanvas)
		this.canvas = canvas;
		this.boundaryCanvas = boundaryCanvas;
		this.bdContext = this.boundaryCanvas.getContext('2d')
		this.cWidth = canvas.width;
		this.cHeight = canvas.height;
		this.context = canvas.getContext('2d');

		this.canvasIsCleared = true;
		this.selectedAssetisLoading = false;
	},
}
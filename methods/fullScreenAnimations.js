export function buildAnimations (canvas, styleObject, dimensions, letterHeight) {
	const animationsObject = {};

	const constructor = function (canvas, styleObject, dimensions, letterHeight) {
		animationsObject.canvas = canvas;
		animationsObject.context = animationsObject.canvas.getContext(`2d`);
		animationsObject.style = styleObject;
		animationsObject.dim = dimensions[0];
		animationsObject.left = dimensions[1];
		animationsObject.top = dimensions[2];
		animationsObject.rowCount = dimensions[3];
		animationsObject.letterHeight = letterHeight
		animationsObject.isDrawing = false;
		animationsObject.drawStack = [];
		animationsObject.frameNum = 0;
		animationsObject.indexMap = {};
		animationsObject.callback = function () {};
	}

	animationsObject.bootUp = function (callback) {
		this.isDrawing = true;
		this.drawStack.push(this.bootUpSequence.ex)
		
		if (callback){
			this.callback = callback;
		}
		
	}.bind(animationsObject);

	
	animationsObject.bootUpSequence = {
		props : {
			hStart : 0,
			vStart : 0,
			vStop : 0,
			hStrokeWidth : 0,
			metaStrokeWidth : 0,
			metaSpacing : 0,
		},
		init : function () {
			this.metaStrokeWidth = Math.floor(((this.dim) * (5/1024)));
			this.metaSpacing = 2 * this.metaStrokeWidth;

			this.indexMap = this.initializeIndexMap(this.top, this.top + this.dim);
			this.indexCount = Object.keys(this.indexMap).length;

			this.bootUpSequence.props.hStart = this.left + Math.floor(((this.dim)*(1/16)));
			this.bootUpSequence.props.vStart = this.top 
			this.bootUpSequence.props.vStop = this.top + this.dim
			this.bootUpSequence.props.hStrokeWidth = (((this.dim) * (30/2056)))//Math.floor(((this.dim)*(1/64)));
			this.metaHStrokeWidth = this.bootUpSequence.props.hStrokeWidth

			this.hasInitialized = true;
		}.bind(animationsObject),
		ex : function () {
			const props = this.bootUpSequence.props
			if (!this.hasInitialized){
				this.bootUpSequence.init();
			}
			this.bootUpSequence.finalizer(666);

			this.frameNum = this.frameNum + 4;



		var fillStyle = this.style.background
		this.context.fillStyle = this.style.stroke;
		this.context.strokeStyle = this.style.stroke;
		this.drawWindow();

		this.draw_lc_m(props.hStart + (0 * props.hStrokeWidth) , 24, 0, 666);
		this.draw_lc_o(props.hStart + (12 * props.hStrokeWidth), 24, (9 * props.hStrokeWidth), 666)
		this.draw_lc_l(props.hStart + (19 * props.hStrokeWidth), 16, (6 * props.hStrokeWidth), 666)
		this.draw_lc_e(props.hStart + (23 * props.hStrokeWidth), 24, (9 * props.hStrokeWidth), 666)

		this.draw_uc_s(props.hStart + (28 * props.hStrokeWidth), 40, (9 * props.hStrokeWidth), 666)
		this.draw_lc_e(props.hStart + (41 * props.hStrokeWidth), 50, (20 * props.hStrokeWidth), 666)
		this.draw_lc_e(props.hStart + (48 * props.hStrokeWidth), 50, (20 * props.hStrokeWidth), 666)
		this.draw_lc_d(props.hStart + (55 * props.hStrokeWidth), 50, (20 * props.hStrokeWidth), 666)

		this.drawVersionNumber(props.hStart, this.indexMap[45], (25 * props.hStrokeWidth), 666);

		this.drawLoadingBar(80, (this.top + Math.floor((7* this.dim) /8)), (25 * props.hStrokeWidth), 666)
		this.context.fillStyle = fillStyle


			

		}.bind(animationsObject),
		finalizer : function (frameStart) {
			if (this.frameNum < frameStart){
				return;
			}
			var anim = this;
			console.log(this.isDrawing)
			this.isDrawing = false;
			this.hasInitialized = false;
			this.frameNum = 0;
			this.drawStack.splice(this.drawStack.indexOf(this.bootUpSequence.ex), 1);
		
			setTimeout(function () {
				anim.callback();
				anim.callback = function () {}
			}, 500);
			
			return;
		}.bind(animationsObject),
	}


	animationsObject.draw = function () {

		this.drawStack.forEach(function(func){
			func();
		}, this);
	};

	animationsObject.printLine = function () {

	}

	animationsObject.setDimensions = function (dimensions){
		this.dim = dimensions[0];
		this.left = dimensions[1];
		this.top = dimensions[2];
		this.rowCount = dimensions[3];
		return;
	};

	animationsObject.finalizer = function (frameStart) {
		if (this.frameNum < frameStart){
			return;
		}
		this.isDrawing = false;
		this.hasInitialized = false;
		this.frameNum = 0;
		this.drawStack
		return;
	};

	animationsObject.drawLoadingBar = function ( percentOfScreen, vStart, frameStart, frameEnd){
		if (this.frameNum < frameStart){
			return;
		}
		if (this.frameNum > frameEnd){
			return;
		}
		
		var hLength = (percentOfScreen * this.dim)/100
		var rectDim = this.letterHeight;
		var rectCount = Math.floor((hLength/(2*rectDim)));
		var buffer = ((100 - percentOfScreen)/100 * ((this.dim))/2);
		var totalTime = frameEnd - frameStart;
		var relFrame = Math.floor(this.frameNum - frameStart);
		var rectsPerTime = rectCount/ totalTime;
		var avgRectsDrawn = relFrame * rectsPerTime;
		var x_0 = this.left + buffer;
		this.context.beginPath()
		this.context.fillStyle = "#FFFFFF";
		

		for (var i = 0; i < Math.min(avgRectsDrawn, Math.floor(rectCount/4)); i ++){
			var x = Math.floor(x_0 + ((2*i) * (rectDim))) 
			this.context.fillRect(x, vStart, rectDim, rectDim);
		}
		if (relFrame < totalTime/4){
			return;
		}
		for (var i = 0; i < Math.min((1.25*avgRectsDrawn), Math.floor(rectCount/2)); i++){
			var x = Math.floor(x_0 + ((2*i) * (rectDim))) 
			this.context.fillRect(x,vStart,rectDim, rectDim);
		}
		if (relFrame < totalTime/2){
			return;
		}
		for (var i = 0; i < Math.min((.75*avgRectsDrawn), Math.floor((3 * rectCount)/5)); i ++){
			var x = Math.floor(x_0 + ((2*i) * (rectDim))) 
			this.context.fillRect(x,vStart,rectDim, rectDim);
		}
		if (relFrame < ((3*totalTime)/5)){
			return;
		}
		for (var i = 0; i < Math.min(avgRectsDrawn, rectCount); i ++){
			var x = Math.floor(x_0 + ((2*i) * (rectDim))) 
			this.context.fillRect(x,vStart,rectDim, rectDim);
		}
		return;

	}.bind(animationsObject);


	animationsObject.initializeIndexMap = function (vStart, vStop) {
		var counter = 0;

		for (var i = vStart; i < vStop ; i += this.metaSpacing){
			this.indexMap[counter] = i;
			counter = counter + 1;
		}

		return this.indexMap;
	}
	//index map is now a map from indexes (of... varying length???)
	//to v locations. v[0] should be vstart;
	animationsObject.lc_full_v_stroke = function (startHIndex, frameStart) {
		var vStartLC = Math.floor((this.indexCount * (3 / 5)));
		this.vStroke(vStartLC, this.indexCount - 2, startHIndex, frameStart);
	}

	animationsObject.small_v_stroke = function (startHIndex, frameStart){
		var vStart = Math.floor((this.indexCount * (7/10)))
		this.vStroke(vStart, this.indexCount - 2, startHIndex, frameStart)
	}.bind(animationsObject)
	
	animationsObject.drawWindow = function () {
		this.context.beginPath();
		this.context.rect(this.left, this.top, this.dim + 2, this.dim + 2);
		this.context.stroke();
	}.bind(animationsObject);

	animationsObject.drawVersionNumber = function (hStart, vStart, frameStart, frameEnd) {
		if (this.frameNum < frameStart){
			return;
		}
		if (this.frameNum > frameEnd){
			return;
		}
		this.context.fillText(' moleSeed v.6.2.31', hStart , vStart)
		this.context.fillText(' Brought to you by:', hStart , vStart + (2*this.letterHeight))
		this.context.fillText(`  MXThumb, panmi, `, hStart, vStart + (4* this.letterHeight))
		this.context.fillText(`KETL9, & system_ludd`, hStart, vStart + (6*this.letterHeight))
	}.bind(animationsObject);

	animationsObject.lc_sym_round_top = function (lStart, startVIndex, frameStart, widthInStrokes, frameEnd){
		if (this.frameNum < frameStart){
			return;
		}
		const diff = (widthInStrokes*this.metaHStrokeWidth)/6
		if (!startVIndex){
			startVIndex = Math.floor((this.indexCount * (7/10)))
		}
		this.hStroke(lStart, lStart + (1*diff), startVIndex, frameStart, 2, frameEnd)
		this.hStroke(lStart + (.75*diff), lStart + (2*diff), startVIndex - 2, frameStart + (.75*diff), 2, frameEnd)
		this.hStroke(lStart + (1.5*diff),lStart + (4.5*diff), startVIndex - 4, frameStart + (1.5*diff), 2, frameEnd)
		this.hStroke(lStart + (4.0*diff), lStart + (5.25*diff), startVIndex -2, frameStart + (3.5*diff), 2, frameEnd)
		this.hStroke(lStart + (5*diff), lStart + (6*diff), startVIndex, frameStart + (4.25*diff), 2, frameEnd)
	}.bind(animationsObject);

	animationsObject.lc_sym_round_bot = function (lStart, startVIndex, frameStart,  widthInStrokes, frameEnd){
		if (this.frameNum < frameStart){
			return;
		}
		const diff = (widthInStrokes*this.metaHStrokeWidth)/6
		if (!startVIndex){
			startVIndex = this.indexCount - 8
		}
		this.hStroke(lStart, lStart + (1*diff), startVIndex, frameStart, 2)
		this.hStroke(lStart + (.75*diff), lStart + (2*diff), startVIndex + 2, frameStart + (.75*diff), 2, frameEnd)
		this.hStroke(lStart + (1.5*diff),lStart + (4.5*diff), startVIndex + 4, frameStart + (1.5*diff), 2, frameEnd)
		this.hStroke(lStart + (4.0*diff), lStart + (5.25*diff), startVIndex + 2, frameStart + (3.5*diff), 2, frameEnd)
		this.hStroke(lStart + (5*diff), lStart + (6*diff), startVIndex, frameStart + (4.25*diff), 2, frameEnd)	
	}.bind(animationsObject);

	animationsObject.lc_sym_round_bot_shallow = function (lStart, startVIndex, frameStart,  widthInStrokes, frameEnd){
		if (this.frameNum < frameStart){
			return;
		}
		const diff = (widthInStrokes*this.metaHStrokeWidth)/6
		if (!startVIndex){
			startVIndex = this.indexCount - 8
		}
		
		this.hStroke(lStart, lStart + (1.5*diff), startVIndex , frameStart, 2, frameEnd)
		this.hStroke(lStart + (1.0*diff),lStart + (5*diff), startVIndex + 2, frameStart + (1.0*diff), 2, frameEnd)
		this.hStroke(lStart + (4.5*diff), lStart + (6*diff), startVIndex, frameStart + (4.5*diff), 2, frameEnd)	
	}.bind(animationsObject);

	animationsObject.lc_sym_round_top_shallow = function (lStart, startVIndex, frameStart,  widthInStrokes, frameEnd){
		if (this.frameNum < frameStart){
			return;
		}
		const diff = (widthInStrokes*this.metaHStrokeWidth)/6
		if (!startVIndex){
			startVIndex = this.indexCount - 8
		}
		
		this.hStroke(lStart, lStart + (1.5*diff), startVIndex , frameStart, 2, frameEnd)
		this.hStroke(lStart + (1.0*diff),lStart + (5*diff), startVIndex -2 , frameStart + (1.0*diff), 2, frameEnd)
		this.hStroke(lStart + (4.5*diff), lStart + (6*diff), startVIndex, frameStart + (4.5*diff), 2, frameEnd)
	}.bind(animationsObject);

	animationsObject.uc_sym_round_top = function (lStart, startVIndex, frameStart, widthInStrokes, frameEnd){
		if (this.frameNum < frameStart){
			return;
		}
		const diff = (widthInStrokes*this.metaHStrokeWidth)/6
		if (!startVIndex){
			startVIndex = Math.floor((this.indexCount * (7/10)))
		}
		this.hStroke(lStart, lStart + (1*diff), startVIndex, frameStart, 2, frameEnd)
		this.hStroke(lStart + (.75*diff), lStart + (2*diff), startVIndex - 2, frameStart + (.75*diff), 2, frameEnd)
		this.hStroke(lStart + (1.5*diff),lStart + (4.5*diff), startVIndex - 4, frameStart + (1.5*diff), 2, frameEnd)
		this.hStroke(lStart + (4.0*diff), lStart + (5.25*diff), startVIndex -2, frameStart + (3.5*diff), 2, frameEnd)
		this.hStroke(lStart + (5*diff), lStart + (6*diff), startVIndex, frameStart + (4.25*diff), 2, frameEnd)
	}.bind(animationsObject);

	animationsObject.uc_sym_round_bot = function (lStart, startVIndex, frameStart,  widthInStrokes, frameEnd){
		if (this.frameNum < frameStart){
			return;
		}
		const diff = (widthInStrokes*this.metaHStrokeWidth)/6
		if (!startVIndex){
			startVIndex = this.indexCount - 8
		}
		this.hStroke(lStart, lStart + (1*diff), startVIndex, frameStart, 2, frameEnd)
		this.hStroke(lStart + (.75*diff), lStart + (2*diff), startVIndex + 2, frameStart + (.75*diff), 2, frameEnd)
		this.hStroke(lStart + (1.5*diff),lStart + (4.5*diff), startVIndex + 4, frameStart + (1.5*diff), 2, frameEnd)
		this.hStroke(lStart + (4.0*diff), lStart + (5.25*diff), startVIndex + 2, frameStart + (3.5*diff), 2, frameEnd)
		this.hStroke(lStart + (5*diff), lStart + (6*diff), startVIndex, frameStart + (4.25*diff), 2, frameEnd)
	}.bind(animationsObject);

	animationsObject.diagStroke = function (startHIndex, startVIndex, hLength, slope, frameStart, frameEnd){
		slope = slope / this.metaSpacing
			if (this.frameNum < frameStart){
				return;
			}
			if (this.frameNum){
				if (this.frameNum > frameEnd){
					return;
				}
			}
			if (slope < 0){
				if (slope < -1){
					var absSlope = Math.abs(slope);
					var rise = Math.abs(slope)
					for (var i = 0; i < rise; i ++){
						this.hStroke((startHIndex + (i*this.metaHStrokeWidth)),(startHIndex + ((i+1)*this.metaHStrokeWidth)), (startVIndex - i),( frameStart + (i * runPerRise)), rise * 2,frameEnd)
					}

				} else if (slope > -1){
					var absSlope = Math.abs(slope);
					var rise = Math.floor(absSlope * hLength) // = indexes down;
					var runPerRise = hLength/rise                    // hmove per index up
					for (var i = 0; i < rise; i ++){
						this.hStroke((startHIndex + (i * runPerRise)),(startHIndex + ((i+1) *runPerRise)), (startVIndex + i), (frameStart + (i * runPerRise)), 2, frameEnd)
					}
				}
				return	
			} else if (slope === 0) {
				this.hStroke(startHIndex, startHIndex + hLength, startVIndex, frameStart, 2)
				return;
			} else { // slope > 0;
				if (slope > 1){
					var rise = slope // = indexes up;
					                // hmove per index up
					for (var i = 0; i < rise; i ++){
						this.hStroke((startHIndex + (i*this.metaHStrokeWidth)),(startHIndex + ((i+1)*this.metaHStrokeWidth)), (startVIndex - i),( frameStart + (i * runPerRise)), rise * 2, frameEnd)
					}

				} else if (slope < 1){
					var rise = Math.ceil(slope * hLength) // = indexes up;
					var runPerRise = hLength/rise                    // hmove per index up
					for (var i = 0; i < rise; i ++){
						this.hStroke((startHIndex + (i * runPerRise)),(startHIndex + ((i+1) *runPerRise)), (startVIndex - i),( frameStart + (i * runPerRise)), 2, frameEnd)
					}

				}
				return
			}
	}.bind(animationsObject);

	animationsObject.hStroke = function (startHIndex, endHIndex, startVIndex, frameStart, strokeHeight, frameEnd) {
			if (this.frameNum < frameStart){
				return;
			}
			if (this.frameNum){
				if (this.frameNum > frameEnd){
					return;
				}
			}
			for (var i = startVIndex; i < startVIndex + strokeHeight; i ++){
				var j = Math.min(this.frameNum-frameStart, (endHIndex - startHIndex))
				this.context.fillRect(startHIndex, this.indexMap[i], j, this.metaStrokeWidth);
			} 
	}.bind(animationsObject);

	animationsObject.vStroke = function (startHIndex, startVIndex, endVIndex,  frameStart, frameEnd) {
		if (this.frameNum < frameStart){
			return;
		}
		if (this.frameNum){
			if (this.frameNum > frameEnd){
				return;
			}
		}
		this.hStroke(startHIndex, startHIndex + this.metaHStrokeWidth, startVIndex, frameStart, (endVIndex - startVIndex), frameEnd)
	}.bind(animationsObject);



	animationsObject.draw_lc_d = function (hStart, vStart, frameStart, frameEnd) {
		this.lc_sym_round_top_shallow(hStart, vStart + 2, frameStart, 6,frameEnd);
		this.lc_sym_round_bot_shallow(hStart, vStart + 8, frameStart, 6,frameEnd);
		this.vStroke(hStart, vStart + 4, vStart + 10, frameStart,frameEnd);
		this.vStroke(hStart + (6*this.metaHStrokeWidth),vStart -6, vStart +12,  (frameStart + (4*this.metaHStrokeWidth)),frameEnd)
	};

	animationsObject.draw_uc_s = function (hStart, vStart, frameStart, frameEnd) {
		this.uc_sym_round_top(hStart, vStart , frameStart, 12, frameEnd);
		this.uc_sym_round_bot(hStart, vStart + 16, frameStart, 12, frameEnd);

		this.vStroke(hStart, vStart + 2, vStart + 6, frameStart, frameEnd)
		this.vStroke(hStart + (11 * this.metaHStrokeWidth), vStart + 12, vStart + 16, frameStart + (10 * this.metaHStrokeWidth), frameEnd);

		this.diagStroke(hStart, vStart + 5, (3*this.metaHStrokeWidth), (-.5), frameStart, frameEnd)
		this.diagStroke(hStart + (3*this.metaHStrokeWidth), vStart + 7, (6 * this.metaHStrokeWidth), (-.25), frameStart + (2*this.metaHStrokeWidth), frameEnd )
		this.diagStroke(hStart + (9 * this.metaHStrokeWidth), vStart + 9, (3*this.metaHStrokeWidth), (-.5), frameStart + (8*this.metaHStrokeWidth), frameEnd)
	};

	animationsObject.draw_lc_e = function ( hStart, vStart, frameStart, frameEnd) {
		this.lc_sym_round_top_shallow(hStart, vStart + 2, frameStart, 6, frameEnd);
		this.lc_sym_round_bot_shallow(hStart, vStart + 8, frameStart, 6, frameEnd);
		this.vStroke(hStart, vStart + 6, vStart + 8, frameStart, frameEnd);
		this.hStroke(hStart, (hStart + (6*this.metaHStrokeWidth)), vStart + 4, frameStart, 2, frameEnd)
	};


	animationsObject.draw_lc_l = function (hStart, vStart, frameStart, frameEnd) {
		this.vStroke(hStart, vStart, vStart + 18, frameStart, frameEnd);
		this.hStroke(hStart, hStart + (3*this.metaHStrokeWidth), vStart+18, frameStart, 2, frameEnd);
		//this.vStroke(hStart + this.metaHStrokeWidth, vStart + 16,vStart + 18,  frameStart + this.metaHStrokeWidth);
		//end vIndex not yet defined, but w/e
	};
	animationsObject.draw_lc_m = function (hStart, vStart, frameStart, frameEnd) {
		this.vStroke(hStart, vStart, vStart + 12, frameStart, frameEnd)
		this.lc_sym_round_top(hStart, vStart + 4, frameStart, 6, frameEnd);
		this.lc_sym_round_top(hStart+ (5*this.metaHStrokeWidth), vStart + 4,(4*this.metaHStrokeWidth), 6, frameEnd);
		this.vStroke(hStart + (this.metaHStrokeWidth * 5),vStart+4, vStart + 12, this.metaHStrokeWidth * 4, frameEnd);
		this.vStroke(hStart + (this.metaHStrokeWidth *10),vStart+4, vStart + 12, this.metaHStrokeWidth * 8, frameEnd);	
	};

	animationsObject.draw_lc_n = function (hStart, vStart, frameStart, frameEnd) {
		this.vStroke(hStart, vStart, vStart + 12, frameStart, frameEnd)
		this.lc_sym_round_top(hStart, vStart + 4, frameStart, 6, frameEnd);
		this.vStroke(hStart + (this.metaHStrokeWidth * 5),vStart+4, vStart + 12, this.metaHStrokeWidth * 4, frameEnd);
	};

	animationsObject.draw_lc_o = function (hStart, vStart, frameStart, frameEnd) {
		this.lc_sym_round_top_shallow(hStart, vStart + 2, frameStart, 6, frameEnd);
		this.lc_sym_round_bot_shallow(hStart, vStart + 8, frameStart, 6, frameEnd);
		this.vStroke(hStart, vStart + 4, vStart + 10, frameStart, frameEnd);
		this.vStroke(hStart + (5*this.metaHStrokeWidth),vStart + 4, vStart +10,  (frameStart + (4*this.metaHStrokeWidth)), frameEnd)
	};


	





		
		









		


	constructor(canvas, styleObject, dimensions, letterHeight)
	return animationsObject;
}
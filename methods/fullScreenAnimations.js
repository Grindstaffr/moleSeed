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
		animationsObject.isDrawing = true;
		animationsObject.drawStack = [];
		animationsObject.frameNum = 0;
	}

	animationsObject.setDimensions = function (dimensions){
		this.dim = dimensions[0];
		this.left = dimensions[1];
		this.top = dimensions[2];
		this.rowCount = dimensions[3];
	};

	animationsObject.finalizer = function () {};

	animationsObject.draw = function () {
		this.frameNum = this.frameNum + 4;


		const hStart = this.left + Math.floor(((this.dim)*(1/16)));
		const vStart = this.top 
		const vStop = this.top + this.dim
		const hStrokeWidth = Math.floor(((this.dim)*(1/64)));
		const metaStrokeWidth = Math.floor(((this.dim) * (5/1024)));
		const metaSpacing = 2 * metaStrokeWidth;
		const initializeIndexMap = function () {
			var indexMap = {};
			var counter = 0;

			for (var i = vStart; i < vStop ; i += metaSpacing){
				indexMap[counter] = i;
				counter = counter + 1;
			}

			return indexMap;
		}
		//index map is now a map from indexes (of... varying length???)
		//to v locations. v[0] should be vstart;
		const indexMap = initializeIndexMap();
		const indexCount = Object.keys(indexMap).length
		const lc_full_v_stroke = function (startHIndex, frameStart) {
			var vStartLC = Math.floor((indexCount * (3 / 5)));
			vStroke(vStartLC, indexCount - 2, startHIndex, frameStart);
		}

		const small_v_stroke = function (startHIndex, frameStart){
			var vStart = Math.floor((indexCount * (7/10)))
			vStroke(vStart, indexCount - 2, startHIndex, frameStart)
		}.bind(this)
		
		const drawWindow = function () {
			this.context.beginPath();
			this.context.rect(this.left, this.top, this.dim + 2, this.dim + 2);
			this.context.stroke();
		}.bind(this)



		const lc_sym_round_top = function (lStart, startVIndex, frameStart, widthInStrokes, frameEnd){
			if (this.frameNum < frameStart){
				return;
			}
			const diff = (widthInStrokes*hStrokeWidth)/6
			if (!startVIndex){
				startVIndex = Math.floor((indexCount * (7/10)))
			}
			hStroke(lStart, lStart + (1*diff), startVIndex, frameStart, 2, frameEnd)
			hStroke(lStart + (.75*diff), lStart + (2*diff), startVIndex - 2, frameStart + (.75*diff), 2, frameEnd)
			hStroke(lStart + (1.5*diff),lStart + (4.5*diff), startVIndex - 4, frameStart + (1.5*diff), 2, frameEnd)
			hStroke(lStart + (4.0*diff), lStart + (5.25*diff), startVIndex -2, frameStart + (3.5*diff), 2, frameEnd)
			hStroke(lStart + (5*diff), lStart + (6*diff), startVIndex, frameStart + (4.25*diff), 2, frameEnd)
				
		}.bind(this)

		const lc_sym_round_bot = function (lStart, startVIndex, frameStart,  widthInStrokes, frameEnd){
			if (this.frameNum < frameStart){
				return;
			}
			const diff = (widthInStrokes*hStrokeWidth)/6
			if (!startVIndex){
				startVIndex = indexCount - 8
			}
			hStroke(lStart, lStart + (1*diff), startVIndex, frameStart, 2)
			hStroke(lStart + (.75*diff), lStart + (2*diff), startVIndex + 2, frameStart + (.75*diff), 2, frameEnd)
			hStroke(lStart + (1.5*diff),lStart + (4.5*diff), startVIndex + 4, frameStart + (1.5*diff), 2, frameEnd)
			hStroke(lStart + (4.0*diff), lStart + (5.25*diff), startVIndex + 2, frameStart + (3.5*diff), 2, frameEnd)
			hStroke(lStart + (5*diff), lStart + (6*diff), startVIndex, frameStart + (4.25*diff), 2, frameEnd)
				
		}.bind(this)

		const lc_sym_round_bot_shallow = function (lStart, startVIndex, frameStart,  widthInStrokes, frameEnd){
			if (this.frameNum < frameStart){
				return;
			}
			const diff = (widthInStrokes*hStrokeWidth)/6
			if (!startVIndex){
				startVIndex = indexCount - 8
			}
			
			hStroke(lStart, lStart + (1.5*diff), startVIndex , frameStart, 2, frameEnd)
			hStroke(lStart + (1.0*diff),lStart + (5*diff), startVIndex + 2, frameStart + (1.0*diff), 2, frameEnd)
			hStroke(lStart + (4.5*diff), lStart + (6*diff), startVIndex, frameStart + (4.5*diff), 2, frameEnd)
				
		}.bind(this)

		const lc_sym_round_top_shallow = function (lStart, startVIndex, frameStart,  widthInStrokes, frameEnd){
			if (this.frameNum < frameStart){
				return;
			}
			const diff = (widthInStrokes*hStrokeWidth)/6
			if (!startVIndex){
				startVIndex = indexCount - 8
			}
			
			hStroke(lStart, lStart + (1.5*diff), startVIndex , frameStart, 2, frameEnd)
			hStroke(lStart + (1.0*diff),lStart + (5*diff), startVIndex -2 , frameStart + (1.0*diff), 2, frameEnd)
			hStroke(lStart + (4.5*diff), lStart + (6*diff), startVIndex, frameStart + (4.5*diff), 2, frameEnd)
		}.bind(this)

		const uc_sym_round_top = function (lStart, startVIndex, frameStart, widthInStrokes, frameEnd){
			if (this.frameNum < frameStart){
				return;
			}
			const diff = (widthInStrokes*hStrokeWidth)/6
			if (!startVIndex){
				startVIndex = Math.floor((indexCount * (7/10)))
			}
			hStroke(lStart, lStart + (1*diff), startVIndex, frameStart, 2, frameEnd)
			hStroke(lStart + (.75*diff), lStart + (2*diff), startVIndex - 2, frameStart + (.75*diff), 2, frameEnd)
			hStroke(lStart + (1.5*diff),lStart + (4.5*diff), startVIndex - 4, frameStart + (1.5*diff), 2, frameEnd)
			hStroke(lStart + (4.0*diff), lStart + (5.25*diff), startVIndex -2, frameStart + (3.5*diff), 2, frameEnd)
			hStroke(lStart + (5*diff), lStart + (6*diff), startVIndex, frameStart + (4.25*diff), 2, frameEnd)
				
		}.bind(this)

		const uc_sym_round_bot = function (lStart, startVIndex, frameStart,  widthInStrokes, frameEnd){
			if (this.frameNum < frameStart){
				return;
			}
			const diff = (widthInStrokes*hStrokeWidth)/6
			if (!startVIndex){
				startVIndex = indexCount - 8
			}
			hStroke(lStart, lStart + (1*diff), startVIndex, frameStart, 2, frameEnd)
			hStroke(lStart + (.75*diff), lStart + (2*diff), startVIndex + 2, frameStart + (.75*diff), 2, frameEnd)
			hStroke(lStart + (1.5*diff),lStart + (4.5*diff), startVIndex + 4, frameStart + (1.5*diff), 2, frameEnd)
			hStroke(lStart + (4.0*diff), lStart + (5.25*diff), startVIndex + 2, frameStart + (3.5*diff), 2, frameEnd)
			hStroke(lStart + (5*diff), lStart + (6*diff), startVIndex, frameStart + (4.25*diff), 2, frameEnd)
				
		}.bind(this)



		

		//now vertical strokes should be iterating through index map

		const diagStroke = function (startHIndex, startVIndex, hLength, slope, frameStart, frameEnd){
			slope = slope / metaSpacing
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
						hStroke((startHIndex + (i*hStrokeWidth)),(startHIndex + ((i+1)*hStrokeWidth)), (startVIndex - i),( frameStart + (i * runPerRise)), rise * 2,frameEnd)
					}

				} else if (slope > -1){
					var absSlope = Math.abs(slope);
					var rise = Math.floor(absSlope * hLength) // = indexes down;
					var runPerRise = hLength/rise                    // hmove per index up
					for (var i = 0; i < rise; i ++){
						hStroke((startHIndex + (i * runPerRise)),(startHIndex + ((i+1) *runPerRise)), (startVIndex + i), (frameStart + (i * runPerRise)), 2, frameEnd)
					}
				}
				return	
			} else if (slope === 0) {
				hStroke(startHIndex, startHIndex + hLength, startVIndex, frameStart, 2)
				return;
			} else { // slope > 0;
				if (slope > 1){
					var rise = slope // = indexes up;
					                // hmove per index up
					for (var i = 0; i < rise; i ++){
						hStroke((startHIndex + (i*hStrokeWidth)),(startHIndex + ((i+1)*hStrokeWidth)), (startVIndex - i),( frameStart + (i * runPerRise)), rise * 2, frameEnd)
					}

				} else if (slope < 1){
					var rise = Math.ceil(slope * hLength) // = indexes up;
					var runPerRise = hLength/rise                    // hmove per index up
					for (var i = 0; i < rise; i ++){
						hStroke((startHIndex + (i * runPerRise)),(startHIndex + ((i+1) *runPerRise)), (startVIndex - i),( frameStart + (i * runPerRise)), 2, frameEnd)
					}

				}
				return
			}
			

		}.bind(this)
		const hStroke = function (startHIndex, endHIndex, startVIndex, frameStart, strokeHeight, frameEnd) {
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
				this.context.fillRect(startHIndex, indexMap[i], j, metaStrokeWidth);
			} 
		}.bind(this)

		const vStroke = function (startHIndex, startVIndex, endVIndex,  frameStart, frameEnd) {
			if (this.frameNum < frameStart){
				return;
			}
			if (this.frameNum){
				if (this.frameNum > frameEnd){
					return;
				}

			}
			hStroke(startHIndex, startHIndex + hStrokeWidth, startVIndex, frameStart, (endVIndex - startVIndex), frameEnd)
		}.bind(this)

		var fillStyle = this.style.background



		const draw_lc_d = function (hStart, vStart, frameStart, frameEnd) {
			lc_sym_round_top_shallow(hStart, vStart + 2, frameStart, 6,frameEnd);
			lc_sym_round_bot_shallow(hStart, vStart + 8, frameStart, 6,frameEnd);
			vStroke(hStart, vStart + 4, vStart + 10, frameStart,frameEnd);
			vStroke(hStart + (6*hStrokeWidth),vStart -6, vStart +12,  (frameStart + (4*hStrokeWidth)),frameEnd)

		}

		this.context.fillStyle = this.style.stroke;
		this.context.strokeStyle = this.style.stroke;
		const draw_uc_s = function (hStart, vStart, frameStart, frameEnd) {
			uc_sym_round_top(hStart, vStart , frameStart, 12, frameEnd);
			uc_sym_round_bot(hStart, vStart + 16, frameStart, 12, frameEnd);

			vStroke(hStart, vStart + 2, vStart + 6, frameStart, frameEnd)
			vStroke(hStart + (11 * hStrokeWidth), vStart + 12, vStart + 16, frameStart + (10 * hStrokeWidth), frameEnd);

			diagStroke(hStart, vStart + 5, (3*hStrokeWidth), (-.5), frameStart, frameEnd)
			diagStroke(hStart + (3*hStrokeWidth), vStart + 7, (6 * hStrokeWidth), (-.25), frameStart + (2*hStrokeWidth), frameEnd )
			diagStroke(hStart + (9 * hStrokeWidth), vStart + 9, (3*hStrokeWidth), (-.5), frameStart + (8*hStrokeWidth), frameEnd)
		}
		const draw_lc_e = function ( hStart, vStart, frameStart, frameEnd) {
			lc_sym_round_top_shallow(hStart, vStart + 2, frameStart, 6, frameEnd);
			lc_sym_round_bot_shallow(hStart, vStart + 8, frameStart, 6, frameEnd);
			vStroke(hStart, vStart + 6, vStart + 8, frameStart, frameEnd);
			hStroke(hStart, (hStart + (6*hStrokeWidth)), vStart + 4, frameStart, 2, frameEnd)
		}


		drawWindow();
		const draw_lc_l = function (hStart, vStart, frameStart, frameEnd) {
			vStroke(hStart, vStart, vStart + 18, frameStart, frameEnd);
			hStroke(hStart, hStart + (3*hStrokeWidth), vStart+18, frameStart, 2, frameEnd);
			//vStroke(hStart + hStrokeWidth, vStart + 16,vStart + 18,  frameStart + hStrokeWidth);
			//end vIndex not yet defined, but w/e
		}
		const draw_lc_m = function (hStart, vStart, frameStart, frameEnd) {
			vStroke(hStart, vStart, vStart + 12, frameStart, frameEnd)
			lc_sym_round_top(hStart, vStart + 4, frameStart, 6, frameEnd);
			lc_sym_round_top(hStart+ (5*hStrokeWidth), vStart + 4,(4*hStrokeWidth), 6, frameEnd);
			vStroke(hStart + (hStrokeWidth * 5),vStart+4, vStart + 12, hStrokeWidth * 4, frameEnd);
			vStroke(hStart + (hStrokeWidth *10),vStart+4, vStart + 12, hStrokeWidth * 8, frameEnd);
			
		}
		const draw_lc_n = function (hStart, vStart, frameStart, frameEnd) {
			vStroke(hStart, vStart, vStart + 12, frameStart, frameEnd)
			lc_sym_round_top(hStart, vStart + 4, frameStart, 6, frameEnd);
			vStroke(hStart + (hStrokeWidth * 5),vStart+4, vStart + 12, hStrokeWidth * 4, frameEnd);
		}

		const draw_lc_o = function (hStart, vStart, frameStart, frameEnd) {
			lc_sym_round_top_shallow(hStart, vStart + 2, frameStart, 6, frameEnd);
			lc_sym_round_bot_shallow(hStart, vStart + 8, frameStart, 6, frameEnd);
			vStroke(hStart, vStart + 4, vStart + 10, frameStart, frameEnd);
			vStroke(hStart + (5*hStrokeWidth),vStart + 4, vStart +10,  (frameStart + (4*hStrokeWidth)), frameEnd)

		}

		const drawVersionNumber = function (hStart, vStart, frameStart, frameEnd) {
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
		}.bind(this)


		draw_lc_m(hStart + (0 * hStrokeWidth) , 24, 0, 500);
		draw_lc_o(hStart + (12 * hStrokeWidth), 24, (12 * hStrokeWidth), 500)
		draw_lc_l(hStart + (19 * hStrokeWidth), 16, (12 * hStrokeWidth), 500)
		draw_lc_e(hStart + (23 * hStrokeWidth), 24, (12 * hStrokeWidth), 500)

		draw_uc_s(hStart + (28 * hStrokeWidth), 40, (12 * hStrokeWidth), 500)
		draw_lc_e(hStart + (41 * hStrokeWidth), 50, (25 * hStrokeWidth), 500)
		draw_lc_e(hStart + (48 * hStrokeWidth), 50, (25 * hStrokeWidth), 500)
		draw_lc_d(hStart + (55 *hStrokeWidth), 50, (25 * hStrokeWidth), 500)

		drawVersionNumber(hStart, 350, (28 * hStrokeWidth), 500)

		
		this.context.fillStyle = fillStyle
	}

	animationsObject.bootUp = function (callback) {
		this.isDrawing = true;

		const hStart = this.left + Math.floor(((this.dim)*(1/16)));
		const vStart = this.top + Math.floor(((this.dim)*(5/16)));
		const hStrokeWidth = Math.floor(((this.dim)*(5/512)));
		const metaStrokeWidth = Math.floor(((this.dim) * (1/64)));



		this.finalizer = function () {
			this.isDrawing = false;
			callback();
		}
	}

	constructor(canvas, styleObject, dimensions, letterHeight)
	return animationsObject;
}
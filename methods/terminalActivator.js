import { Terminal } from './terminalClass.js'
import { buildAnimations } from './fullScreenAnimations.js'
import { saveFileManagerConstructor } from './saveFileManager.js'

export class TerminalActivator {
	constructor (canvas, globalProps, nodeVerse) {
		this.terminals = {};
		this.canvas = canvas;
		this.context = canvas.getContext('2d')
		this.globalProps = globalProps;
		this.nodeVerse = nodeVerse;
		this.devMode = true;
		this.shouldClick = true;
		this.activeTerminal = {};
		this.addTerminal();
		this.activateTerminal(0);
		this.terminalDimensions = this.activeTerminal.__calcLocAndDim();
		this.activeTerminal.cache.rescaleCache();
		this.keyHandler = this.keyHandler.bind(this)
		this.animator = buildAnimations(canvas, this.selectColorScheme(0), this.terminalDimensions, globalProps.letterHeight);
		this.saveFileManager = saveFileManagerConstructor(this);
		
	}
	selectColorScheme (int) {
		if (int > 3){
			return
		}
		if (int < 0){
			return;
		}
		const schemes = {
			0 : {
				background: "#01060D",
				text : "#EEF0FF",
				stroke : "#EEF0FF",

			},
			1 : {
				/*background: "#0000AA",*/
				background: "#01060D",
				text : "#AABBFF",
				stroke : "#AABBFF",

			},
			2 : {
				/*background: "#27190A",*/
				background: "#01060D",
				text : "#F6D158",
				stroke : "#F6D158",

			},
			3 : {
				/*background: "#13250F",*/
				background: "#01060D",
				text : "#A9FFA3",
				stroke : "#A9FFA3",

			},
		}
		return schemes[int]
	}

	addTerminal (node, saveFile) {
		if (!node){
			node = this.nodeVerse.getDefaultNode();
		}
		var currentTerminalCount = Object.keys(this.terminals).length
		if (currentTerminalCount === 4){
			console.log('here')
			this.activeTerminal.api.throwError(`Max Terminal Capacity... cannot add any more terminals`)
			return false; 
		}
		this.terminals[currentTerminalCount] = new Terminal(this.canvas, this.globalProps, node, this.selectColorScheme(currentTerminalCount), this, currentTerminalCount)
		this.terminals[currentTerminalCount].api.reallocateMemoryOnActiveNode();
		return true;
		
	}

	isTerminalAtIndex (number) {
		if (this.terminals[number] && this.terminals[number].type === 'terminal'){
			return true;
		} else {
			return false;
		}
	}

	getTerminalCount () {
		return (Object.keys(this.terminals).length)
	}

	activateTerminal (number) {
		Object.keys(this.terminals).forEach(function(terminalIndex){
		
			if (terminalIndex === number.toString()){
				this.activeTerminal = this.terminals[terminalIndex]
				this.terminals[terminalIndex].isActiveTerminal = true;
				return;
			} else {
				this.terminals[terminalIndex].isActiveTerminal = false;
			}
		}, this);
		
	}

	draw () {
		if (this.animator.isDrawing){
			this.animator.setDimensions(this.activeTerminal.__calcLocAndDim());
			this.animator.draw();
			return;
		}
		if (this.helpNeeded){
			var height = window.innerHeight;
			var width = window.innerWidth;
			this.context.fillStyle = this.selectColorScheme(0).text
			var lineA = `make the browser fullscreen, (don't just maximize)`
			var lineB = `then press the    ~ \`   key`
			this.context.fillText(lineA, ((width/2) - (this.globalProps.letterHeight * lineA.length)), (height/2) - (this.globalProps.letterHeight * 2))
			this.context.fillText(lineB, ((width/2) - (this.globalProps.letterHeight * lineB.length)), (height/2) + (this.globalProps.letterHeight * 2))
			return;
		}
		if (!this.activeTerminal.isOn){
			this.context.fillStyle = this.selectColorScheme(0).text
			this.clickX = (this.canvas.width - 20*(this.globalProps.letterHeight))
			this.clickY = (this.canvas.height - 2*(this.globalProps.letterHeight))
			this.context.fillText(`F11 isn't working`, this.clickX, this.clickY )
		}
		this.activeTerminal.draw();
	}
	mouseHandler(e){
		if (!this.shouldClick){
			return;
		}
		
		this.mouseX = e.offsetX;
		this.mouseY = e.offsetY;
	}
	clickHandler(e){
		if (!this.shouldClick){
			return
		}
		if (this.helpNeeded){
			this.helpNeeded = false;
		}
		if ((this.mouseX + 50) >= this.clickX){
			if ((this.mouseY + 50) >= this.clickY){
				this.helpNeeded = true;
			}
		}

	}
	keyHandler(e){
	
		if(e.keyCode === 8 || e.keyCode === 222 || e.keyCode === 191){
			e.preventDefault();
		};
		if (!this.activeTerminal.isOn){
			if (e.keyCode === 122 || e.keyCode === 192){
				if (e.keyCode === 122){
					if (!window.screenTop && !window.screenY){
						e.preventDefault();
					}
				}
				if (!this.devMode){
					this.canvas.width = window.screen.width;
					this.canvas.height = window.screen.height;
					this.shouldClick = false;
					this.helpNeeded = false;
					this.canvas.letterspacing = '0px'
					this.canvas.fontkerning = 'none'
					this.canvas.style.fontfamily = 'terminalmonospace'
					this.canvas.style.cursor = "none";
					this.context.font = `${this.globalProps.letterSize}px terminalmonospace`
					this.activeTerminal.turnOn(this.animator.bootUp);

					this.activeTerminal.__calcLocAndDim();
				}
			}
			return;
		};
		if (this.activeTerminal.isOn){
			if (e.keyCode === 122 || e.keyCode === 192){
				this.activeTerminal.turnOff()
				this.shouldClick = true
				this.activeTerminal.__calcLocAndDim();
				delete this.canvas.style.cursor
				return;
			}
			this.activeTerminal.keyHandler(e);
			return;
		}
	}
}
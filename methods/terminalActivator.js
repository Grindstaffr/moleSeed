import { Terminal } from './terminalClass.js'
import { buildAnimations } from './fullScreenAnimations.js'

export class TerminalActivator {
	constructor (canvas, globalProps, nodeVerse) {
		this.terminals = {};
		this.canvas = canvas;
		this.globalProps = globalProps;
		this.nodeVerse = nodeVerse;
		this.devMode = true;
		this.activeTerminal = {};
		this.addTerminal();
		this.activateTerminal(0);
		this.terminalDimensions = this.activeTerminal.__calcLocAndDim();
		this.activeTerminal.cache.rescaleCache();
		this.keyHandler = this.keyHandler.bind(this)
		this.animator = buildAnimations(canvas, this.selectColorScheme(0), this.terminalDimensions, globalProps.letterHeight);
		
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
				background: "#01060D",
				text : "#EEF0FF",
				stroke : "#EEF0FF",

			},
			2 : {
				background: "#01060D",
				text : "#EEF0FF",
				stroke : "#EEF0FF",

			},
			3 : {
				background: "#01060D",
				text : "#EEF0FF",
				stroke : "#EEF0FF",

			},
		}
		return schemes[int]
	}

	addTerminal (node) {
		if (!node){
			node = this.nodeVerse.getDefaultNode();
		}
		var currentTerminalCount = Object.keys(this.terminals).length
		if (currentTerminalCount === 4){
			this.activeTerminal.api.throwError(`Max Terminal Capacity... cannot add any more terminals`)
			return; 
		}
		this.terminals[currentTerminalCount] = new Terminal(this.canvas, this.globalProps, node, this.selectColorScheme(currentTerminalCount), this, currentTerminalCount)
	
		
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
		this.activeTerminal.draw();
	}

	keyHandler(e){
	
		if(e.keyCode === 8 || e.keyCode === 222 || e.keyCode === 191){
			e.preventDefault();
		};
		if (!this.activeTerminal.isOn){
			if (e.keyCode === 122){
				if (!window.screenTop && !window.screenY){
					e.preventDefault();
				}
				if (!this.devMode){
					this.activeTerminal.turnOn();
					this.canvas.width = window.screen.width;
					this.canvas.height = window.screen.height;

					this.activeTerminal.__calcLocAndDim();
				}
			}
			return;
		};
		if (this.activeTerminal.isOn){
			if (e.keyCode === 122){
				this.activeTerminal.turnOff()
				this.activeTerminal.__calcLocAndDim();
				return;
			}
			this.activeTerminal.keyHandler(e);
			return;
		}
	}
}
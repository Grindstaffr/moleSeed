import { program } from './navigator.js';
import { initializerAlpha, Node, Pdf, Asset, Readable, TerminalStoryPiece, TextDoc, Mole, Program, UniqueNode } from './fileSystemDefinitions.js'
import { assetViewer } from './assetViewer.js'
import { globalProps } from './globalState.js'
import { terminal } from './terminal.js'
import { bigBang } from './nodeVerse.js'


/*async function __initializer () {
	const pdfjs = await import('../node_modules/pdfjs-dist/build/pdf.js');
    const pdfjsWorker = await import('../node_modules/pdfjs-dist/build/pdf.worker.entry.js');

    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
}
*/
		var pdfjsLib = window['pdfjs-dist/build/pdf'];

		var samplePDFURL = '../assets/pdfs/Second Export Gorp.pdf';

		pdfjsLib.GlobalWorkerOptions.workerSRC = '..node_modules/pdfjs-dist/build/pdf.worker.js';











		const keyMap = {
			8 : 'backspace',
			9 : 'tab',
			13: 'enter',
			16: 'shift',
			17: 'ctrl',
			27: 'esc',
			32: 'space',
			33: 'pgup',
			34: 'pgdwn',
			35: 'end',
			36: 'home',
			37: 'left',
			38: 'up',
			39: 'right',
			40: 'down',
			48: '0',
			49: '1',
			50: '2',
			51: '3',
			52: '4',
			53: '5',
			54: '6',
			55: '7',
			56: '8',
			57: '9',
			58: ':',
			59: ';',
			60: '.',
			61: '=',
			64: '@',
			65: 'a',
			66: 'b',
			67: 'c',
			68: 'd',
			69: 'e',
			70: 'f',
			71: 'g',
			72: 'h',
			73: 'i',
			74: 'j',
			75: 'k',
			76: 'l',
			77: 'm',
			78: 'n',
			79: 'o',
			80: 'p',
			81: 'q',
			82: 'r',
			83: 's',
			84: 't',
			85: 'u',
			86: 'v',
			87: 'w',
			88: 'x',
			89: 'y',
			90: 'z',
			173: '-',
			191: '/',
			192: '`',
		}

		const pdfKeyCommands = {
			'backspace' : function () {
				
			},
			'tab' : function () {

			},
			'enter' : function () {

					navBar.selectorControl.select()

			
			},
			'shift' : function(){
				
			},
			'ctrl' : function () {},
			'esc' : function () {
			if (assetViewer.selectedAssetIsLoaded){
				assetViewer.escape();
				navBar.resumeNav();
			}
			
			},
			'space' : function () {
				if (assetViewer.shouldRender){	
					assetViewer.refresh();
				}
			},
			'pgup' : function () {},
			'pgdwn' : function () {},
			'end' : function () {},
			'home' : function () {},
			'left' : function () {
				if (assetViewer.shouldRender){
					assetViewer.previousPage();
				}
			},
			'up' : function () {
				if (!pdfLoaded){
					navBar.selectorControl.up();
				} else {
					alert('pan code needs werk')
				}

			},
			'right' : function () {
				if (assetViewer.shouldRender){
					assetViewer.nextPage();
				} else if (navBar.navModeOn){

				}

			},
			'down' : function () {
				if (!pdfLoaded){
					navBar.selectorControl.down()
				} else {
					if (assetViewer.shouldRender) {

					}
				}
				
			},
			'0' : function () {
				if (assetViewer.shouldRender){
					assetViewer.toggleVisibleCommands();
				} else if (navBar.navModeOn){
				}
			},
			'1' : function () {},
			'2' : function () {},
			'3' : function () {},
			'4' : function () {},
			'5' : function () {},
			'6' : function () {},
			'7' : function () {},
			'8' : function () {},
			'9' : function () {
				if (assetViewer.shouldRender){
					assetViewer.toggleAdvancedCommands();
				} else if (navBar.navModeOn){
				}
			},
			':' : function () {},
			';' : function () {},
			'.' : function () {},
			'=' : function () {
				if (assetViewer.shouldRender){
					assetViewer.zoomIn();
				} else if (navBar.navModeOn){
				}
		
			},
			'@' : function () {},
			'a' : function () {
				if (assetViewer.shouldRender){
					assetViewer.slideLeft()
				} else if (navBar.navModeOn){
				}
			},
			'b' : function () {},
			'c' : function () {},
			'd' : function () {
				if (assetViewer.shouldRender){
					assetViewer.slideRight();
				} else if (navBar.navModeOn){
				}
			},
			'e' : function () {},
			'f' : function () {},
			'g' : function () {},
			'h' : function () {},
			'i' : function () {},
			'j' : function () {
				
			},
			'k' : function () {
			
				
			},
			'l' : function () {},
			'm' : function () {},
			'n' : function () {},
			'o' : function () {},
			'p' : function () {},
			'q' : function () {
				if (assetViewer.shouldRender){
					assetViewer.toggleData();
				} else if (navBar.navModeOn){
				}
			},
			'r' : function () {},
			's' : function () {
				if (assetViewer.shouldRender){
					assetViewer.slideDown();
				} else if (navBar.navModeOn){
				}			
			},
			't' : function () {},
			'u' : function () {},
			'v' : function () {},
			'w' : function () {
				if (assetViewer.shouldRender){
					assetViewer.slideUp();
				} else if (navBar.navModeOn){
				}
			},
			'x' : function () {},
			'y' : function () {},
			'z' : function () {},
			'-' : function () {
				//decrease scale (zoom out)
				if (assetViewer.shouldRender){
					assetViewer.zoomOut();
				} else if (navBar.navModeOn){
				}
			},
			'/' : function () {
				
			},
			'`' : function () {
				if (assetViewer.shouldRender){
					assetViewer.toggleViewMode();
				} else if (navBar.navModeOn){
				}
			},
		}

		const cleanCanvasFrame = function (canvas, context) {
			context.clearRect(0, 0, canvas.width, canvas.height)
		}

		const paintCanvasBackground = function (canvas, context, color) {
			if (!color){
				context.fillRect(0,0,canvas.width, canvas.height);
			} else {
				context.fillStyle = color;
				context.fillRect(0,0, canvas.width, canvas.height);
			}
			
		}

		const handleKeyPress = function (e) {
			if(e.keyCode === 8 || e.keyCode === 222 || e.keyCode === 191){
				e.preventDefault();
			}
			/*
			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			temporary Testing Solution, not stable at scale?
			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			*/
			if (!terminal.isOn){
				if (e.keyCode === 122){
					if (!devMode){
						terminal.turnOn();
						
							
							lacanvasa.width = window.screen.width 
							lacanvasa.height = window.screen.height 
						
							terminal.__calcLocAndDim();
					}
						
					
				}
				return;
			};
			if (terminal.isOn){
				if (e.keyCode === 122){
					terminal.turnOff();
					terminal.__calcLocAndDim();
					return;
				}
				terminal.keyHandler(e);
				//sizeCanvas(lacanvasa);
				return;
			};
			if (!keyMap.hasOwnProperty(e.keyCode)){
				return;
			};
		
			var routingName = keyMap[e.keyCode];
				
			if (!pdfKeyCommands.hasOwnProperty(routingName)) {
				return;
			};

			pdfKeyCommands[routingName]();

		};

		const keyUp = function (e){

		}
		const buildNodeVerse = function () {
			const nodeVerse = bigBang();

			return nodeVerse
		}

		const initNodeVerse = function (nodeVerse) {
			
			return nodeVerse.databanks._PioneerDataServices.nodeNets.__toaster.seed
		}

		const initializer_Alpha_001 = function () {
			const nav = new Program('crawler.mse', `./crawler.js`);
			const viewer = new Program('viewer.mS', `./assetViewer.js`);
			const rucksack = new Program('rucksack.ext', './rucksack.js')
			/*
			const ltp = new Pdf('LTP', '../assets/pdfs/tiLTP.pdf', 'LearnToPlay')
			const rr = new Pdf('RR', '../assets/pdfs/tiRR.pdf', 'RulesReference')
			const gorp = new Pdf('Gorp', '../assets/pdfs/Second Export Gorp.pdf', 'Gorp Menlo')
			const sample = new TextDoc('sample','../assets/txtFiles/sampleTxt.js')
			*/
			const intro = new TextDoc('welcome','../assets/txtFiles/intro.js')
			const seed = new Node('seed')
			const crawlerBX = new Node('crawler')
			const rucksackBX = new Node('rucksack')
			const crawlerReadMe = new TextDoc('crawler.rdbl', '../assets/txtFiles/crawler.js')
			const rucksackReadMe = new TextDoc('rucksack.rdbl', '../assets/txtFiles/rucksack.js')
			const mxthumbtro = new TextDoc('read_this', '../assets/txtFiles/MXthumbIntro.js')
			const caravan = new TextDoc('caravan', '../assets/txtFiles/Caravan.js')
			const mole = new Mole('Gyorgy.mole', './Gyorgy.js')

			intro.attach(rucksackBX)
			intro.attach(crawlerBX)
			seed.attach(intro)
			seed.attach(rucksack)
			mole.attach(seed);
			mxthumbtro.attach(intro)
			caravan.attach(mxthumbtro)
			rucksackBX.attach(rucksackReadMe)
			rucksackBX.attach(rucksack)
			crawlerBX.attach(crawlerReadMe)
			crawlerBX.attach(nav)

			//seed.attach(gorp)
			//seed.attach(nav)
			//gorp.attach(viewer)
			//gorp.attach(sample)

			return seed

		}


		const autoToggleBlackScreen = function () {
			if (!pdfLoaded){
				ctx.fillStyle = 'black'
				ctx.fillRect(0,0,lacanvasa.width, lacanvasa.height);
			}
		}

		const sizeHandler = function () {
			if(devMode){
				lacanvasa.width = window.innerWidth
				lacanvasa.height = window.innerHeight
			}	else {
				lacanvasa.width = window.screen.width 
				lacanvasa.height = window.screen.height 		

			}
			ctx = lacanvasa.getContext('2d')
			lacanvasa.style.class = "terminal"
			lacanvasa.style.letterspacing = '0px'
			lacanvasa.style.fontkerning = 'none'
			lacanvasa.style.fontfamily = 'terminalmonospace'
			ctx.font = `${globalProps.letterSize}px terminalmonospace`;
			terminal.setContext(ctx)
			//terminal.setContext(ctx);
			console.log(terminal.context)
			terminal.__calcLocAndDim();
			console.log(terminal.context)
			terminal.cache.rescaleCache();
		};

	//	window.addEventListener("click", loadPdf);
		window.addEventListener("keydown", handleKeyPress);
		window.addEventListener("keyup", keyUp);
		window.addEventListener("resize", sizeHandler);
		window.addEventListener("fullscreenchange", sizeHandler)

		var devMode = true;
		var lacanvasa = {};
		var pdfCanvas = {};
		var pdfBack = {};
		var ctx = {};
		var ptx = {};
		var btx = {};
		var needToLoadPDF = false;
		var needToScrubPDF = false;
		var needToRefreshPDF = false;


		const mainLoop = function() {
				cleanCanvasFrame(lacanvasa, ctx)
				paintCanvasBackground(lacanvasa, ctx, "#00000a")
				/*
				navBar.draw(ctx);
				navBar.windowTender();
				assetViewer.draw();
				*/
			//	console.log(ctx.font)

			globalProps.time = Date.now()

				terminal.draw();
				


		}
		

		const attachCanvases = function () {
			lacanvasa = document.getElementById('the-canvas');
			//pdfCanvas = document.getElementById('pdfviewer');
			//pdfBack = document.getElementById('viewerBack');
				
						ctx = lacanvasa.getContext('2d');
					//	ptx = pdfCanvas.getContext('2d');
					//	btx = pdfBack.getContext('2d');
					
		
		}
		const sizeCanvas = function (canvas, width = 1280, height = 960) {
			canvas.height = window.innerHeight;
			canvas.width = window.innerWidth;
			console.log(canvas.height);
			console.log(canvas.width);
		}

		const init = function() {
			
			//__initializer();
			const nodeVerse = buildNodeVerse();


			attachCanvases();
			//lacanvasa.requestFullscreen();
			sizeCanvas(lacanvasa);
			//assetViewer.init(pdfCanvas, lacanvasa, pdfBack, );
			ctx.fillStyle = 'black'
			ctx.fillRect(0,0,lacanvasa.width, lacanvasa.height);
			ctx.fillStyle = "#CCFFFF"
			/*
			navBar.init(lacanvasa, assetViewer);
			navBar.activeNode = initializerAlpha();
			navBar.previousNode = navBar.activeNode;
			navBar.assembleText();
			navBar.draw(ctx, 'lime')

			initializer_Alpha_001
			*/
			
			terminal.init({},assetViewer,lacanvasa,globalProps,initNodeVerse(buildNodeVerse()), devMode)
			needToLoadPDF = false;
			globalProps.time = Date.now();
			ctx.font = `${globalProps.letterSize}px terminalmonospace`
			lacanvasa.style.class = "terminal"
			lacanvasa.style.letterspacing = '0px'
			lacanvasa.style.fontkerning = 'none'
			lacanvasa.style.fontfamily = 'terminalmonospace'
			console.log(ctx.font)
			
			setInterval(() => {mainLoop()}, 50);
		}

		init();
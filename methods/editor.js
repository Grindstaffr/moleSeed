export const program = {
	name : `editor.ext`,
	isInstalled : false,
	runsInBackGround : false,
	size : 5,
	memory : 10,
	data : {
		cursorLocation : [0,0,0],
		inserting : false,
		shiftDown : false,
		ctrlDown : false,
		altDown : false,
		clipBoard : "",
		text : "",
		highlight : [0,0],
		prevHighlight : [0,0],
		selectedText : false,
		textWidth : 0,
		displayHeight : 0,
		colHeight : 0,
		rowWidth : 0,
		characterMatrix : [],
		displayBarWidth : 20,
		stringIndexOffset : 0,
		vRowOffset : 0,
		lastInsertIndex : 0,
		scrollBar : '',
		displayBar : {
			keyBindings : {
				'F1' : '(edit_mode) copy slctd text',
				'F2' : '(edit_mode) cut slctd text',
				'F3' : '(edit_mode) paste slctd text',
				'F4' : 'toggle_mode [slow/fast]',
				'F5' : 'toggle_mode [select/write]',
				'F6' : 'toggle_mode [edit/terminal]',
				'F7' : 'toggle sidebar_[on/off]',
				'F8' : 'cycle sidebar pages',
			},
			commands : {
				'stop' : 'stop editor.ext',
				'save' : 'update active doc',
				'open' : 'edit an accessible doc',
				'new_rdbl' : 'create new .rdbl doc',
				'new_wmt' : 'create new .wmt doc',
				'rename' : 'rename active doc',
			},
			docData : {
				'doc_name' : `"testName"`,
				'doc_type' : `".rdbl"`,
				'line_count' : 456,
				'char_count' : 20182,
				'word_count' : 4105,
				'est_mem_use' : 8210,
			},
		},
	},
	settings: {
		edit_mode : false,
		slct_mode : false,
		fast_mode : false,
		side_disp : 'special_keys', 
		displaySidebar : true,
	},
	methods: {
		commands : {

		},
		usingKeyUpHandling : function () {
			return true;
		},
		alternateKeyRouterActive : function () {
			return true;
		},
		keyStrokeRouter : {
			'8' : function (e) {
				if (this.data.selectedText){
					this.methods.multiDelete();
				} else {
					this.methods.deleteLetter();
				}
				//backspace
			},
			'9' : function (e) {
				this.methods.writeToText('\\t')
			},
			'13' : function (e) {
				this.methods.writeToText('\\n')
			},
			'16' : function (e) {
				//shift
				this.data.shiftDown = true;
			},
			'17' : function (e) {
				//ctrl
				this.data.ctrlDown = true;
			},
			'18' : function (e) {
				//alt
				this.data.altDown = true;
				console.log(`altdown`)
			},
			'37' : function (e) {
				if (!this.settings.fast_mode){
					this.methods.handleCursorLeft();
				} else {
					this.methods.handleCursorLeft();
					this.methods.handleCursorLeft();
					this.methods.handleCursorLeft();
					this.methods.handleCursorLeft();
				}
			},
			'38' : function (e) {
				if (!this.settings.fast_mode){
					this.methods.handleCursorUp();
				} else {
					this.methods.handleCursorUp();
					this.methods.handleCursorUp();
					this.methods.handleCursorUp();
					this.methods.handleCursorUp();
				}
			},
			'39' : function (e) {
				if (!this.settings.fast_mode){
					this.methods.handleCursorRight();
				} else {
					this.methods.handleCursorRight();
					this.methods.handleCursorRight();
					this.methods.handleCursorRight();
					this.methods.handleCursorRight();
				}
			},
			'40' : function (e) {
				if (!this.settings.fast_mode){
					this.methods.handleCursorDown();
				} else {
					this.methods.handleCursorDown();
					this.methods.handleCursorDown();
					this.methods.handleCursorDown();
					this.methods.handleCursorDown();
				}
			},
			'67' : function (e) {
				if (this.data.ctrlDown){
					this.methods.copy();
					return;
				}
				this.methods.keyStrokeRouter.generalCase(e);
			},
			'112' : function (e) {
				this.methods.copy();
			},
			'113' : function (e) {
				this.methods.cut();
			},
			'114' : function (e) {
				this.methods.paste();
			},
			'115' : function (e) {
				if (!this.settings.isRunning){
					return;
				}
				this.methods.toggleFastMode();
			},
			'116' : function (e) {
				if (!this.settings.isRunning){
					return;
				}
				this.methods.toggleSelectMode();
			},
			'117' : function (e) {
				if (!this.settings.isRunning){
					return;
				}
				this.methods.toggleEditMode();
				return;
			},
			'118' : function (e) {
				if (!this.settings.isRunning){
					return;
				}
				this.methods.toggleSideBar();
			},
			'119' : function (e){
				if (!this.settings.isRunning){
					return;
				}
				this.methods.cycleSidebarDisplay();
			},
			'86' : function (e) {
				if (this.data.ctrlDown){
					this.methods.paste();
					return;
				}
				this.methods.keyStrokeRouter.generalCase(e);
			},
			generalCase : function (e) {
				var value = e.key.toString();
				this.methods.writeToText(value);
			},

		},
		routeKeyStroke: function (e) {
			e.preventDefault();
			if (!this.settings.edit_mode){
				if (e.keyCode === 117){
					this.methods.keyStrokeRouter['117'](e);
					if (this.settings.displaySidebar){
						this.methods.drawDisplayBar();
					}
					if (this.settings.slct_mode){
						this.methods.drawHighlight();
					}
					this.methods.drawScrollBar();
					this.methods.drawWindow();
					return;
				}
				this.api.useDefaultKeyRouter(e)
				if (this.settings.displaySidebar){
					this.methods.drawDisplayBar();
				}
				if (this.settings.slct_mode){
					this.methods.drawHighlight();
				}
				this.methods.drawScrollBar();
				this.methods.drawWindow();
				return;
			}
			if (Object.keys(this.methods.keyStrokeRouter).includes(e.keyCode.toString())){
				this.methods.keyStrokeRouter[e.keyCode.toString()](e);
			} else {
				this.methods.keyStrokeRouter.generalCase(e);
			}
			if (this.settings.displaySidebar){
				this.methods.drawDisplayBar();
			}
			if (this.settings.slct_mode){
				this.methods.drawHighlight();
			}
			this.methods.drawScrollBar();
			this.methods.drawWindow();
		},
		routeKeyUp : function (e) {
			e.preventDefault();
			if (e.keyCode === 16) {
				e.preventDefault();
				this.data.shiftDown = false;
				console.log('shiftup')
			} else if (e.keyCode === 17) {
				e.preventDefault();
				this.data.ctrlDown = false;
				console.log('ctrlup')
			} else  if (e.keyCode === 18) {
				e.preventDefault();
				this.data.altDown = false;
				console.log ('altup')
			}
		},
		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		                    TOGGLEFUNCTIONS
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		toggleEditMode : function () {
			if (this.settings.edit_mode == true){
				this.settings.edit_mode = false;
				this.api.restoreDefaultCursorPosition();
			} else if (this.settings.edit_mode == false){
				this.settings.edit_mode = true;
				this.methods.inititalizeCursorPosition();
				var coordinates = this.methods.convertCursorLocationToXY()
				this.api.positionCursor(coordinates[0], coordinates[1]);
			} else {
				this.api.runCommand(`stop`);
				this.api.throwError(`editor.ext crashed with status: editMode = ${this.settings.edit_mode}`)
			}
		},
		toggleFastMode : function () {
			if (this.settings.fast_mode){
				this.settings.fast_mode = false;
			} else if (!this.settings.fast_mode) {
				this.settings.fast_mode = true;
			}
		},
		toggleSelectMode : function () {
			if (this.settings.slct_mode){
				this.settings.slct_mode = false;
				this.methods.clearHighlight();
			} else if (!this.settings.slct_mode){
				this.settings.slct_mode = true;
				this.data.highlight[0] = this.data.cursorLocation[2];
				this.data.highlight[1] = this.data.cursorLocation[2];
			}
		},
		toggleSideBar : function () {
			if (this.settings.displaySidebar){
				this.settings.displaySidebar = false;
				this.methods.clearDisplayBar();
				this.methods.inititalizeDimensions();
			} else if (!this.settings.displaySidebar){
				this.settings.displaySidebar = true;
				this.methods.inititalizeDimensions();
				this.methods.drawDisplayBar();
			} else {
				this.api.runCommand(`stop`);
				this.api.throwError(`editor.ext crashed with status: displaySideBar = ${this.settings.displaySidebar}`)
			}
		},
		cycleSidebarDisplay : function () {
			var options = ['special_keys', 'commands', 'doc_data'];
			var currentIndex = options.indexOf(this.settings.side_disp);
			currentIndex += 1;
			if (currentIndex === options.length){
				currentIndex = 0;
			}
			this.settings.side_disp = options[currentIndex];
			return;
		},

		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			TEXT EDIT FUNCTIONS
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		writeToText : function (value) {
		
			var lastLoc = this.data.lastInsertIndex
			var insertLocation = this.data.cursorLocation[2];
			if (insertLocation === undefined || insertLocation === 0){
			
			}

			if (insertLocation === this.data.text.length){
				this.data.text += value;
			} else {
				var prepend = this.data.text.substring(0, insertLocation)
				var postpend = this.data.text.substring(insertLocation);
				this.data.text = prepend + value + postpend;
			}
			var currentRow = this.data.cursorLocation[0];
			var currentCol = this.data.cursorLocation[1];
			var currentStringIndex = this.data.cursorLocation[2];
			var cell = this.data.characterMatrix[currentRow][currentCol];
		

			this.methods.recomposeText();

			if (value.length === 1){
				this.methods.incrementCursorLocation();
			} else if (value.length > 1){
				if (value === '\\n'){
					//this.methods.incrementCursorLocation();
				}
				this.methods.incrementCursorLocation();
			}
			var coordinates = this.methods.convertCursorLocationToXY()
			this.api.positionCursor(coordinates[0], coordinates[1]);
		
		},
		deleteLetter : function () {
	
			this.methods.decrementCursorLocation();
			var deleteLocation = this.data.cursorLocation[2];
			var currentRow = this.data.cursorLocation[0];
			var currentCol = this.data.cursorLocation[1]
			var cell = this.data.characterMatrix[currentRow][currentCol];

			if (cell.length > 1){
				if (this.data.text.length === deleteLocation + 2){
					this.data.text = this.data.text.substring(deleteLocation + 2);
				} else if (deleteLocation === 0) {
					this.data.text = this.data.text.substring(deleteLocation + 2);
				} else {
					var prepend = this.data.text.substring(0,deleteLocation);
					var postpend = this.data.text.substring(deleteLocation + 2);
					this.data.text = prepend + postpend;
				}
			} else {
				if (this.data.text.length === deleteLocation + 1){
					this.data.text = this.data.text.substring(0,deleteLocation);
				} else {
					var prepend = this.data.text.substring(0,deleteLocation);
					var postpend = this.data.text.substring(deleteLocation + 1);
					this.data.text = prepend + postpend;
				}
			}

			//STILL NEEDS HANDLING FOR DELETING \\n and \\t
			if (cell.length > 1){
				//this.methods.decrementCursorLocation();
			} else if (cell.length === 1){
			}

			var oldLength = this.data.characterMatrix.length;
			this.methods.recomposeText();
			if (this.data.characterMatrix.length < oldLength){
				for (var i = oldLength ; i >=this.data.characterMatrix.length; i--) {
					this.api.writeToGivenRow("", i)
				}
			}
			var coordinates = this.methods.convertCursorLocationToXY()
			this.api.positionCursor(coordinates[0], coordinates[1]);
			this.methods.reacquireStringIndex();
		
		},
		multiDelete : function () {
			var deleteStartIndex = this.data.highlight[0];
			var deleteEndIndex = this.data.highlight[1];

			var prepend = this.data.text.substring(0, deleteStartIndex);
			var postpend = this.data.text.substring(deleteEndIndex + 1);

			this.data.text = prepend + postpend;
		},
		copy : function () {
			if (this.settings.slct_mode){
				this.methods.toggleSelectMode();
			} else {
				return;
			}
			this.data.clipBoard = this.data.text.substring(this.data.highlight[0], this.data.highlight[1]);
		},
		cut : function () {
			if (this.settings.slct_mode){
				this.methods.toggleSelectMode();
			} else {
				return;
			}
			this.data.clipBoard = this.data.text.substring(this.data.highlight[0], this.data.highlight[1]);
			var prepend = this.data.text.substring(0, this.data.highlight[0]);
			var postpend = this.data.text.substring(this.data.highlight[1]);

			this.data.text = prepend + postpend;
			this.methods.recomposeText();
			for (var i = 0; i < this.data.clipBoard.length; i++){
				this.methods.decrementCursorLocation();
			}
			this.methods.positionTerminalCursor();
			//this.data.cursorLocation[2] -= this.data.clipBoard.length;
		},
		paste : function () {
			var insertLocation = this.data.cursorLocation[2];
			if (insertLocation === this.data.text.length){
				this.data.text += this.data.clipBoard;
			} else {
				var prepend = this.data.text.substring(0, insertLocation);
				var postpend = this.data.text.substring(insertLocation);
				this.data.text = prepend + this.data.clipBoard + postpend;
				//this.data.cursorLocation[2] += this.data.clipBoard.length;
			};
			this.methods.recomposeText();
			for (var i = 0; i < this.data.clipBoard.length; i++){
				this.methods.incrementCursorLocation();
			}
			this.methods.positionTerminalCursor();
		},
		reconstructCharacterMatrix : function () {
			this.data.characterMatrix = [];
			this.methods.appendRowToCharacterMatrix();
			this.methods.composeText();
		},
		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		Compose FUNCTIONSS BEGIN
		scaling functions Begin
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		filterText : function () {
			var string = this.data.text;
			string = string.replaceAll('\n','');
			string = string.replaceAll('\t','');
			if(string.length < this.data.text){
				this.data.text = string;
			} else {
				string = this.data.text.split('\n').join('').split('\t').join('');
				this.data.text = string;
			}
			this.data.text += ' ';
		},
		recomposeText : function () {
			this.data.characterMatrix = [];
			this.methods.composeText();
			this.methods.composeFromCharMatrix();
			return;
		},
		composeText : function () {
			var string = this.data.text;
			var currentRow = 0;
			var currentCol = 0;
			var prevCharBackslash = false;
			for (var i = 0; i < string.length; i++) {
				if (!this.data.characterMatrix[currentRow]){
					this.methods.appendRowToCharacterMatrix();
				}
				if (!prevCharBackslash){
					currentCol += 1;
				}
				if (currentCol >= (this.data.textWidth)){
					currentCol = 0;
					if (this.settings.doubleSpacing){
							currentRow += 2;
							this.methods.appendRowToCharacterMatrix();
							this.methods.appendRowToCharacterMatrix();
						} else {
							currentRow += 1;
							this.methods.appendRowToCharacterMatrix();
						}
				} else if (!string[i] || string[i] === undefined || string[i] === "" || string[i] === '\n' || string[i] === '\t') {
					continue;
				}else if (string[i] === '\\'){
					prevCharBackslash = true;
					this.data.characterMatrix[currentRow][currentCol][0] = i;
					continue;
				} else if (prevCharBackslash) {
					if (string[i] === 'n'){
						prevCharBackslash = false;
						this.data.characterMatrix[currentRow][currentCol][1] = i
						this.data.characterMatrix[currentRow][currentCol][2] = 0;
						if (this.settings.doubleSpacing){
							currentRow += 2;
							this.methods.appendRowToCharacterMatrix();
							this.methods.appendRowToCharacterMatrix();
						} else {
							currentRow += 1;
							this.methods.appendRowToCharacterMatrix();
						}
						currentCol = 0;
						continue;
					} else if (string[i] === 't'){
						this.data.characterMatrix[currentRow][currentCol][1] = i
						this.data.characterMatrix[currentRow][currentCol][2] = 4
						for (var j = 1; j < this.data.characterMatrix[currentRow][currentCol][2]; j++) {
							this.data.characterMatrix[currentRow][currentCol + j][0] = " ";	
						};
						currentCol += 3
						prevCharBackslash = false;
						continue;
					}
					prevCharBackslash = false;
				}
				this.data.characterMatrix[currentRow][currentCol][0] = i
			}

		},
		appendRowToCharacterMatrix : function () {
			var row = new Array(this.data.textWidth)
			for (var i = 0; i < row.length; i++) {
				var newArray = [];
				row[i] = newArray;
			}
			this.data.characterMatrix.push(row);
		},
		composeFromCharMatrix : function () {
			var prevCharBackslash = false;
			var lineBreak = false;
			var pageBreak = false;
			var rowOffset = 0;
			var colOffset = 1;
			var bufferCellsRemaining = 0;
			this.data.characterMatrix.slice(this.data.vRowOffset, this.data.vRowOffset + (this.data.displayHeight - 1)).forEach(function(row, rowIndex){
				row.forEach(function(cell, colIndex){
					var rowTranslate = rowIndex + rowOffset;
					var colTranslate = colIndex + colOffset;
					if (lineBreak || pageBreak){
						console.log(`rowlength == ${row.length} RI == ${rowIndex}, CI == ${colIndex}`)
						if (colIndex === row.length - 1){
							lineBreak = false;
						}
						this.api.writeToCoordinate("", rowTranslate, colTranslate)
						return;
					
					}
					if (cell.length === 0){
						this.api.writeToCoordinate("", rowTranslate, colTranslate)
						return;
					}
					if (cell[0] === undefined){
						this.api.writeToCoordinate("", rowTranslate, colTranslate)
						return
					}
					var character = ""
					if (cell.length > 1){
						this.api.writeToCoordinate(" ", rowTranslate, colTranslate);
					}
					if (cell[0] !== " " ){
						var character = this.data.text[parseInt(cell[0])]
						//console.log(`rowINdex = ${rowIndex} colIndex = ${colIndex}  cellValue = ${cell[0]} character : ${character}`)
					} else {
						character = " ";
					}
					if (!character || character === undefined || character === "" || character === '\n' || character === '\t'){
						this.api.writeToCoordinate("", rowTranslate, colTranslate)
						return;
					} else if (character === "\\"){
						prevCharBackslash = true;
						this.api.writeToCoordinate("", rowTranslate, colTranslate)
						return;
					} else if (prevCharBackslash){
						if (character === "n"){
							prevCharBackslash = false;
							this.api.writeToCoordinate("", rowTranslate, colTranslate)
							//lineBreak = true;
							return;
						}
						if (character === "p"){
							prevCharBackslash = false;
							this.api.writeToCoordinate("", rowTranslate, colTranslate)
							//pageBreak = true;
							return;
						}
						if (character === "t"){
							prevCharBackslash = false;
							this.api.writeToCoordinate("", rowTranslate, colTranslate)
							return;
						}
						prevCharBackslash = false;
					}

					this.api.writeToCoordinate(character, rowTranslate, colTranslate)
				},this)
			},this)
		},
		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		Compose FUNCTIONSS END
		scaling functions Begin
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		setTextWidth : function () {
			this.data.textWidth = this.api.getRowCount() - 3;
			if (this.settings.displaySidebar){
				this.data.textWidth -= (this.data.displayBarWidth);
			};
			return;
		},
		setDisplayHeight : function () {
			this.data.displayHeight = this.api.getRowCount() - 8;
			return;
		},
		reserveRows : function () {
			this.api.reserveRows(this.data.displayHeight);
		},
		inititalizeDimensions : function () {
			this.methods.setTextWidth();
			this.methods.clearTextZone();
			this.methods.setDisplayHeight();
			this.methods.recomposeText();
			this.methods.reserveRows();
		},
		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		      DRAW FUNCTIONS
                      ||
		      marker?\||/
			  ________\/_______
              |________________[D,   n
		                          \_/
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		clearTextZone : function () {
			var rightEdge = this.data.textWidth + 2;
			for (var i = 0; i < rightEdge; i++){
				for (var j = 0; j < this.data.displayHeight -1; j ++)
					this.api.writeToCoordinate("", j,i)
			}
		},
		clearDisplayBar : function () {
			var rightEdge = this.api.getRowCount() -1;
			var startIndex = rightEdge - 20;
			var height = this.data.displayHeight;

			for (var i = 0; i < height; i++) {
				for (var j = startIndex; j <= rightEdge; j++) {
					this.api.writeToCoordinate("", i, j);
				}
			}
		},
		clearHighlight : function () {
			this.api.clearHighlights();
		},
		drawHighlight : function () {
			if (!this.settings.slct_mode){
				return;
			}

			var situtation = 'A';

			var shouldUnhighlight = false;

			var pointA = this.data.highlight[0];
			var pointB = this.data.highlight[1];

			var prevA = this.data.prevHighlight[0];
			var prevB = this.data.prevHighlight[1];

			if (pointA > pointB){
				if (prevB > pointB){
					pointA = pointB;
					pointB = prevB;
				} else if (prevB < pointB) {
					pointA = prevB;
					pointB = pointB;
					shouldUnhighlight = true;
					situtation = 'B';
				}
			} else if (pointB > pointA){
				if (prevB > pointB){
					pointA = pointB;
					pointB = prevB;
					shouldUnhighlight = true;
					situtation = 'C'
				} else if (pointB > prevB) {
					pointA = prevB;
					pointB = pointB;
					situtation = 'D'
				}
			} else if (pointA === pointB){
				this.api.clearHighlights();

			}

			if (situtation === 'C'){
				console.log(`pA = ${pointA} pointB = ${pointB}`)
			}

			var initialRow = -1;
			var terminalRow = -1;

			for (var i = 0; i < this.data.characterMatrix.length; i++) {
				var firstCell = this.data.characterMatrix[i][0];
				if (firstCell.length === 0){
					firstCell = this.data.characterMatrix[i][1];
				}
				if (firstCell[0] > Math.min(pointA, pointB)){
					if (initialRow === -1){
						initialRow = i-1;
					}
				}
				if (firstCell[0] > Math.max(pointA, pointB)){
					if (terminalRow === -1){
						terminalRow = i-1;
						break;
					}
				}
			}
			if (initialRow === -1 || terminalRow === -1){
				return;
			}

			if (situtation === 'C'){
				console.log(`pARow = ${initialRow} pointBrow = ${terminalRow}`)
			}

			var initialColumn = this.data.characterMatrix[initialRow].findIndex(function(cell, index){
				if (cell[0] === Math.min(pointA, pointB)){
					console.log(index)
					return true;
				} else {
					if (cell[0] === Math.min(pointA, pointB) + 1){
						return true;
					}
					return false;
				}
			}, this)

			var terminalColumn = this.data.characterMatrix[terminalRow].findIndex(function(cell){
				if (cell[0] === Math.max(pointA, pointB)){
					return true;
				} else {
					if (cell[0] === Math.max(pointA, pointB) + 1){
						return true;
					}
					return false;
				}
			}, this)

			if (initialColumn === -1 || terminalColumn === -1){
				if (initialColumn === -1){
					console.log(`seeking ${Math.min(pointA, pointB)} in ${this.data.characterMatrix[initialRow]}`)
					console.log(this.data.characterMatrix)
				} else {
					console.log(`seeking ${Math.max(pointA, pointB)} in ${this.data.characterMatrix[terminalRow]}`)
				}
				console.log()
				return;
			}
			if (situtation === 'C'){
				console.log(`pACol = ${initialColumn} pointBcol = ${terminalColumn}`)
			}

			initialRow -= this.data.vRowOffset;
			terminalRow -= this.data.vRowOffset;
			//console.log(`irow: ${initialRow}, iCol: ${initialColumn}, trow: ${terminalRow}, tcol:${terminalColumn}`);

			
			if (shouldUnhighlight){
				if (initialRow === terminalRow){
					if (initialColumn === terminalColumn){
						this.api.unhighlightCell(initialRow, initialColumn + 1);
						this.data.prevHighlight = [this.data.highlight[0],this.data.highlight[1]];
						return;
					}
					if (terminalColumn === initialColumn + 1 || terminalColumn === initialColumn - 1){
						this.api.unhighlightCell(initialRow, terminalColumn + 1);
						this.data.prevHighlight = [this.data.highlight[0],this.data.highlight[1]];
						return;
					}
					for (var k = this.data.textWidth -1; k >=0; k --){
						if (k > terminalColumn){
							continue;
						} else if (k <= initialColumn){
							break;
						}
						this.api.unhighlightCell(terminalRow, (k+1));
					}
					this.data.prevHighlight = [this.data.highlight[0],this.data.highlight[1]];
					return;
				}
				for (var i = terminalRow; i >= initialRow; i--){
					for (var j = this.data.textWidth - 1; j >=0; j--){
						if (i === terminalRow && j > terminalColumn){
							continue;
						};
						if (i === initialRow && j < initialColumn){
							break;
						}; 
	
						this.api.unhighlightCell(i,(j + 1))
					}
				}
				this.data.prevHighlight = [this.data.highlight[0],this.data.highlight[1]];
				return;
			} else {
				for (var i = initialRow; i <=terminalRow; i++){
					for (var j = 0; j < this.data.textWidth ; j ++){
						if (i === initialRow && j < initialColumn){
							continue;
						};
						if (i === terminalRow && j >= terminalColumn){
							break;
						}; 
					
						this.api.highlightCell(i,(j + 1))
						
					}
				}
				this.data.prevHighlight = [this.data.highlight[0],this.data.highlight[1]];
				return;
			}
			

			this.data.prevHighlight = [this.data.highlight[0],this.data.highlight[1]];
		},
		drawDisplayBar : function () {
			this.methods.clearDisplayBar();
			
			var rightEdge = this.api.getRowCount() - 1;
			var startIndex = rightEdge - 18;
			var selectedDataStartIndex = 15
			Object.keys(this.settings).forEach(function(setting, index){
				if (setting === 'displaySidebar' || setting === 'isRunning'){
					return;
				}
				var setting = setting;
				var bool = this.settings[setting];
				var line = `${setting} : ${bool}`;
				var j = 0;
				for (var i = startIndex; i < rightEdge; i++) {
					if (line[j] !== undefined){
						this.api.writeToCoordinate(line[j], (2*index) + 2, i);
					j+=1;
					}
				}
			}, this);
			if (this.settings.side_disp === 'special_keys'){
				Object.keys(this.data.displayBar.keyBindings).forEach(function(key, index){
					var firstTerm = this.data.displayBar.keyBindings[key].substring(0, this.data.displayBar.keyBindings[key].indexOf(" "));
					var otherTerms = this.data.displayBar.keyBindings[key].substring(this.data.displayBar.keyBindings[key].indexOf(" "));
					var line = `${key}: ${firstTerm}`;
					var line2 = `${otherTerms}`;
					var j = 0;
					for (var i = startIndex; i < rightEdge; i++) {
						if (line[j] !== undefined){
							this.api.writeToCoordinate(line[j], (3*index) + selectedDataStartIndex, i);
						}
						if (line2[j] !== undefined){
							this.api.writeToCoordinate(line2[j], (3*index) + (selectedDataStartIndex + 1), i)
						}
						j+=1;
					}
				},this)
			} else if (this.settings.side_disp === 'commands'){
				Object.keys(this.data.displayBar.commands).forEach(function(key, index){
					var firstTerm = this.data.displayBar.commands[key].substring(0, this.data.displayBar.commands[key].indexOf(" "));
					var otherTerms = this.data.displayBar.commands[key].substring(this.data.displayBar.commands[key].indexOf(" "));
					var line = `${key}: ${firstTerm}`;
					var line2 = `${otherTerms}`;
					var j = 0;
					for (var i = startIndex; i < rightEdge; i++) {
						if (line[j] !== undefined){
							this.api.writeToCoordinate(line[j], (3*index) + selectedDataStartIndex, i);
						}
						if (line2[j] !== undefined){
							this.api.writeToCoordinate(line2[j], (3*index) + (selectedDataStartIndex + 1), i)
						}
						j+=1;
					}
				},this);
			} else if (this.settings.side_disp === 'doc_data'){
				Object.keys(this.data.displayBar.docData).forEach(function(key, index){
					if (typeof this.data.displayBar.docData[key] === 'number'){
						var line = `${key}`
						var line2 = `    ${this.data.displayBar.docData[key]}`
						var j = 0;
						for (var i = startIndex; i < rightEdge; i++) {
							if (line[j] !== undefined){
								this.api.writeToCoordinate(line[j], (3*index) + selectedDataStartIndex, i);
							}
							if (line2[j] !== undefined){
								this.api.writeToCoordinate(line2[j], (3*index) + (selectedDataStartIndex + 1), i)
							}
							j+=1;
						}
					} else {
						var line = `${key}`;
						var line2 = `    ${this.data.displayBar.docData[key]}`;
						var j = 0;
						for (var i = startIndex; i < rightEdge; i++) {
							if (line[j] !== undefined){
								this.api.writeToCoordinate(line[j], (3*index) + selectedDataStartIndex, i);
							}
							if (line2[j] !== undefined){
								this.api.writeToCoordinate(line2[j], (3*index) + (selectedDataStartIndex + 1), i)
							}
							j+=1;
						}
					}
				},this);
			}

		},

		drawScrollBar : function () {
			for (var i = 0; i < this.data.scrollBar.length; i++) {
				this.api.writeToCoordinate(this.data.scrollBar[i], i, (this.data.textWidth + 2));
			}
		},

		drawWindow : function () {
			var width = this.api.getRowCount();
			var title = 'editor.ext'
			title = title.split('').reverse().join('');
			var toggle = false;
			var j = 0;
			for (var i = (width - 1); i >= 0; i--){
				if (j < title.length){
					this.api.writeToCoordinate(title[j], this.data.displayHeight -1, i);
					console.log
					j += 1;
				} else {
					if (toggle){
						this.api.writeToCoordinate('-', this.data.displayHeight -1, i)
						toggle = false;
					} else {
						this.api.writeToCoordinate(' ', this.data.displayHeight -1, i)
						toggle = true;
					}
				}

			}
		},

		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		WINDOW TRANSLATION METHODS
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		translateWindowUp : function () {
			this.data.vRowOffset += 1;
			this.methods.scaleAndPositionScrollBar();
			this.methods.recomposeText();
		},

		translateWindowDown : function () {
			this.data.vRowOffset -= 1;
			this.methods.scaleAndPositionScrollBar();
			this.methods.recomposeText();
		},

		scaleAndPositionScrollBar : function () {
			var prependCount = 0;
			var postpendCount = 0;
			var barHeight = this.data.displayHeight - 1;
			this.data.scrollBar = ('#').repeat(barHeight);
			var displayRatio = (barHeight / this.data.characterMatrix.length).toPrecision(10);
			if (displayRatio > 1){
				return;
			}
			var barIndexes = Math.round(barHeight * (displayRatio));
			var scrollIndexes = barHeight - barIndexes;

			var botSpill = ((this.data.characterMatrix.length) - (this.data.vRowOffset) - (barHeight))

			let k = (scrollIndexes/(this.data.vRowOffset + botSpill)).toPrecision(10);



			console.log(this.data.characterMatrix)
			if (botSpill !== 0){
				var offsetProportion = (this.data.vRowOffset / botSpill).toPrecision(10);
			} else {
				offsetProportion = 9999999;
			}

			//var unDisplayedBot = (this.data.characterMatrix.length - (this.data.vRowOffset + this.barHeight));
			
			if (barIndexes < 0){
				debugger
			}
		
			prependCount = Math.round(k * this.data.vRowOffset);
		
			if (prependCount < 0){
				prependCount === 0;
			}
			postpendCount = scrollIndexes - prependCount;
			if (postpendCount < 0){
				postpendCount === 0;
			}
			var scrollBar = ('|').repeat(prependCount) + ('#').repeat(barIndexes) + ('|').repeat(postpendCount);
			if (scrollBar.length < barHeight){
				scrollBar += '|';
			}
			this.data.scrollBar = scrollBar;
		},


		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		All cursor edge handlings must be dealt with to interact
		with actual viewport shit; this should be fun; cursor 
		has got to do actual work... 
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		reacquireStringIndex : function () {
			var presentRow = this.data.cursorLocation[0];
			var presentColumn = this.data.cursorLocation[1];
			this.data.cursorLocation[2] = this.data.characterMatrix[presentRow][presentColumn][0];
		},
		decrementCursorLocation : function () {
			var newLoc = [0,0,-1]
			var presentRow = this.data.cursorLocation[0];
			var presentColumn = this.data.cursorLocation[1];
			if (this.data.cursorLocation[2] === 0){
				return;
			}
			for (var j = presentColumn - 1; j >= 0; j--){
				if (this.data.characterMatrix[presentRow][j][0] === " "){
					continue;
				}
				if (this.data.characterMatrix[presentRow][j].length > 1){
					newLoc[0] = presentRow;
					newLoc[1] = j;
					newLoc[2] = this.data.characterMatrix[presentRow][j][0];
					break;
				}
				if (!Number.isNaN(this.data.characterMatrix[presentRow][j][0])){
					var cell = this.data.characterMatrix[presentRow][j][0]
					if (cell === undefined){
						continue;
					}
					if (this.data.text[cell] === undefined){
						continue;
					}
					if (this.data.text[cell] === '\\'){
						continue;
					}
					newLoc[0] = presentRow;
					newLoc[1] = j;
					newLoc[2] = this.data.characterMatrix[presentRow][j][0];
					break;
				}
				continue;
			}
			if (newLoc[2] === -1){
				for (var i = presentRow -1; i >= 0; i--){
					for (var j = this.data.characterMatrix[i].length -1 ; j >= 0 ; j --){
						if (this.data.characterMatrix[presentRow][j][0] === " "){
							continue;
						}
						if (this.data.characterMatrix[i][j].length > 1){
							newLoc[0] = i;
							newLoc[1] = j;
							newLoc[2] = this.data.characterMatrix[i][j][0];
							if (newLoc[2] === undefined){
					
							}
							break;
						}
						var cell = this.data.characterMatrix[i][j][0]
						if (cell){
							console.log(cell)
						}
						if (this.data.characterMatrix[i][j][0] === undefined){
								continue;
							}
						if (!Number.isNaN(this.data.characterMatrix[i][j][0])){
							if (this.data.characterMatrix[i][j][0] === undefined){
								continue;
							}
							if (this.data.text[cell] === undefined){
								continue;
							}
							newLoc[0] = i;
							newLoc[1] = j;
							newLoc[2] = this.data.characterMatrix[i][j][0];
							break;
						}
						continue;
					}
					if (newLoc[2] !== -1){
						break;
					}
				}
				if (newLoc[2] === -1){
					return;
				}
			}
			if (newLoc[0] < this.data.vRowOffset){
				this.methods.translateWindowDown();
			}
			this.data.cursorLocation[0] = newLoc[0]
			this.data.cursorLocation[1] = newLoc[1];
			this.data.cursorLocation[2] = newLoc[2];
			return;

		},
		incrementCursorLocation : function () {
			var newLoc = [0,0,-1]
			var presentRow = this.data.cursorLocation[0];
			var presentColumn = this.data.cursorLocation[1];
			if (this.data.cursorLocation[2] === this.data.text.length){
				return;
			}
			for (var j = presentColumn + 1; j < this.data.characterMatrix[presentRow].length; j++) {
				if (this.data.characterMatrix[presentRow][j][0] === " "){
					continue;
				}
				if (this.data.characterMatrix[presentRow][j].length > 1){
					newLoc[0] = presentRow;
					newLoc[1] = j;
					newLoc[2] = this.data.characterMatrix[presentRow][j][0];
					break;
				}
				if (!Number.isNaN(this.data.characterMatrix[presentRow][j][0])){
					var cell = this.data.characterMatrix[presentRow][j][0]
					if (cell === undefined){
						continue;
					}
					if (this.data.text[cell] === undefined){
						continue;
					}
					if (this.data.text[cell] === '\\'){
						continue;
					}
					newLoc[0] = presentRow;
					newLoc[1] = j;
					newLoc[2] = this.data.characterMatrix[presentRow][j][0];
					break;
				}
				continue;
			}
			if (newLoc[2] === -1){
				for (var i = presentRow + 1; i < this.data.characterMatrix.length; i++) {
					for (var j = 0; j < this.data.characterMatrix[i].length; j ++){
						if (this.data.characterMatrix[presentRow][j][0] === " "){
							continue;
						}
						if (this.data.characterMatrix[i][j].length > 1){
							newLoc[0] = i;
							newLoc[1] = j;
							newLoc[2] = this.data.characterMatrix[i][j][0];
							if (newLoc[2] === undefined){
					
							}
							break;
						}
						var cell = this.data.characterMatrix[i][j][0]
						if (this.data.characterMatrix[i][j][0] === undefined){
								continue;
							}
						if (!Number.isNaN(this.data.characterMatrix[i][j][0])){
							if (this.data.characterMatrix[i][j][0] === undefined){
								continue;
							}
							if (this.data.text[cell] === undefined){
								continue;
							}
							newLoc[0] = i;
							newLoc[1] = j;
							newLoc[2] = this.data.characterMatrix[i][j][0];
							break;
						}
						continue
					}
					if (newLoc[2] !== -1){
						break;
					}
				}
				if (newLoc[2] === -1){
					return;
				}
			}
			if (newLoc[0] > (this.data.vRowOffset + this.data.displayHeight - 2)){
				this.methods.translateWindowUp();
			}
			this.data.cursorLocation[0] = newLoc[0]
			this.data.cursorLocation[1] = newLoc[1];
			this.data.cursorLocation[2] = newLoc[2];
			return;
			
		},
		moveCursorUp : function () {
			var newLoc = [0,0,-1]
			var presentRow = this.data.cursorLocation[0];
			var presentColumn = this.data.cursorLocation[1];
			if (presentRow === 0){
				return;
			}
			var targetCell = this.data.characterMatrix[presentRow - 1][presentColumn];
			if (targetCell !== undefined && targetCell[0] !== " " && targetCell.length >0){
				if (this.data.text[targetCell[0]]){
					newLoc[0] = presentRow -1;
					newLoc[1] = presentColumn;
					newLoc[2] = targetCell[0];
				}
			} else {
				for (var i = presentRow - 1; i >= 0; i--) {
					for (var j = presentColumn; j >=0; j--){
						var targetCell = this.data.characterMatrix[i][j];
						if (targetCell !== undefined && targetCell[0] !== " " && targetCell.length >0){
							if (this.data.text[targetCell[0]]){
								newLoc[0] = i;
								newLoc[1] = j;
								newLoc[2] = targetCell[0];
								break;
							}
						}
					}
					if (newLoc[2] !== -1){
						break;
					}
				}
			}
			if (newLoc[0] < this.data.vRowOffset){
				this.methods.translateWindowDown();
			}
			this.data.cursorLocation[0] = newLoc[0]
			this.data.cursorLocation[1] = newLoc[1];
			this.data.cursorLocation[2] = newLoc[2];
			return;
		},

		moveCursorDown : function () {
			var newLoc = [0,0,-1]
			var presentRow = this.data.cursorLocation[0];
			var presentColumn = this.data.cursorLocation[1];
			if (presentRow === this.data.characterMatrix.length - 1){
				return;
			}
			var targetCell = this.data.characterMatrix[presentRow + 1][presentColumn];
			if (targetCell !== undefined && targetCell[0] !== " " && targetCell.length >0){
				if (this.data.text[targetCell[0]]){
					newLoc[0] = presentRow + 1;
					newLoc[1] = presentColumn;
					newLoc[2] = targetCell[0];
				}
			} else {
				for (var i = presentRow + 1; i < this.data.characterMatrix.length; i++) {
					for (var j = presentColumn; j >=0; j--){
						var targetCell = this.data.characterMatrix[i][j];
						if (targetCell !== undefined && targetCell[0] !== " "&& targetCell.length >0){
							if (this.data.text[targetCell[0]]){
								newLoc[0] = i;
								newLoc[1] = j;
								newLoc[2] = targetCell[0];
								break;
							}
						}
					}
					if (newLoc[2] !== -1){
						break;
					}
				}
				
			}
			if (newLoc[0] > (this.data.vRowOffset + this.data.displayHeight - 2)){
				this.methods.translateWindowUp();
			}
			
			this.data.cursorLocation[0] = newLoc[0]
			this.data.cursorLocation[1] = newLoc[1];
			this.data.cursorLocation[2] = newLoc[2];
			return;
		},
		inititalizeCursorPosition : function () {
			for (var i = 0; i < this.data.characterMatrix.length; i ++){
				for (var j = 0; j < this.data.characterMatrix[i].length; j++){
					if (this.data.characterMatrix[i][j][0] === 0 || this.data.characterMatrix[i][j][0]){
						console.log(`i=${i},j=${j}, index should be 0 == ${this.data.characterMatrix[i][j][0]}`)
						this.data.cursorLocation[0] = i;
						this.data.cursorLocation[1] = j;
						return;
					}
				}
			}
		},
		positionTerminalCursor : function () {
			var coordinates = this.methods.convertCursorLocationToXY()
			this.api.positionCursor(coordinates[0], coordinates[1]);
		},
		convertCursorLocationToXY : function () {
			var x = this.data.cursorLocation[1];
			var y = this.api.getRowCount() - this.data.cursorLocation[0] - 1 + this.data.vRowOffset;
			var z = this.data.cursorLocation[2];
			return [x,y];
		},
		handleCursorUp : function () {
			this.methods.moveCursorUp();
			if (this.settings.slct_mode){
				this.data.highlight[1] = this.data.cursorLocation[2];
				console.log(this.data.highlight)
			}
			this.methods.positionTerminalCursor();
		},
		handleCursorDown : function () {
			this.methods.moveCursorDown();
			if (this.settings.slct_mode){
				this.data.highlight[1] = this.data.cursorLocation[2];
				console.log(this.data.highlight)
			}
			var coordinates = this.methods.convertCursorLocationToXY()
			this.api.positionCursor(coordinates[0], coordinates[1]);
		},
		handleCursorLeft : function () {
			this.methods.decrementCursorLocation();
			if (this.settings.slct_mode){
				this.data.highlight[1] = this.data.cursorLocation[2];
				console.log(this.data.highlight)
			}
			var coordinates = this.methods.convertCursorLocationToXY()
			this.api.positionCursor(coordinates[0], coordinates[1]);
		},
		handleCursorRight : function () {
			this.methods.incrementCursorLocation();
			if (this.settings.slct_mode){
				this.data.highlight[1] = this.data.cursorLocation[2];
				console.log(this.data.highlight)
			}
			var coordinates = this.methods.convertCursorLocationToXY()
			this.api.positionCursor(coordinates[0], coordinates[1]);
		},

		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

		END CURSOR SHIT
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		startEditext : function (text, doc) {
			this.settings.isRunning = true;

			this.methods.inititalizeDimensions();
			this.api.clearReservedRows();

			this.api.patchInterfaceFunction(function(){
				return true;
			}, 'alternateKeyRouterActive');
			this.api.patchInterfaceFunction(function(){
				return true;
			}, 'usingKeyUpHandling');

			if (text !== undefined){
				this.data.text = text;
				this.methods.filterText();
			} else {
				this.data.text = "";
			}
			this.api.log(` use "F6" to switch between input modes`);
			this.api.log(` use "F7" to toggle sidebar display`)

			this.methods.composeText();
			this.methods.composeFromCharMatrix();
			this.methods.scaleAndPositionScrollBar();

			if (this.settings.displaySidebar){
				this.methods.drawDisplayBar();
			}
			this.methods.drawScrollBar();
			this.methods.drawWindow();
		},

	},
	installData : {
		edit : {
			name : 'edit',
			desc : 'edit a text document',
			syntax : 'edit (readable)', // still need .wt files and compiler
			hasHelp : false, //still need longHelp
			longHelp : ' --- Operation Guide for "edit" syntax ---',
			createNewDoc : false,
			cndVer : false,
			wantsExistingDoc : false,
			wedVer : false,
			noDocVer : false,
			openNoDoc : false,
			docToOpen : "",
			ex : function (target) {
				if (this.api.commandAvailCheck('stop')){
					this.api.runCommand('stop');
				}
				this.api.readyCommand('stop')
				if (!this.api.checkIfRunning(`${this.name}`)){
					console.log(this.name)
				
					this.api.appendToRunningPrograms(`${this.name}`, false)
				}
				var edit = this.installData.edit;
				var prgm = this;
				console.log(target)
				if (edit.errorState){
					createNewDoc = false;
					cndVer = false;
					wantsExistingDoc = false;
					wedVer = false;
					noDocVer = false;
					openNoDoc = false;
					docToOpen = "";
					return;
				}
				if (!target && !edit.cndVer) {
					prgm.api.verifyCommand(`Would you like to create a new document?`, function (bool, toggle){
						toggle.toggle = true;
						if (bool){
							edit.cndVer = true;
							edit.createNewDoc = true;
							return;
						} else {	
							edit.cndVer = false;
							return
						}
					})
					return;
				}
				if (!target && edit.cndVer){
					if (!edit.createNewDoc && !wedVer){
						prgm.api.verifyCommand(`Would you like to open an accessible document?`, function(bool, toggle){
							toggle.toggle = true;
							if (!bool){
								edit.wedVer = true;
								return;
							} else {
								edit.wedVer = true;
								edit.wantsExistingDoc = true;
								return;
							}
						})
						return;
					} else if (!edit.createNewDoc && wedVer){
						if (edit.wantsExistingDoc){
							prgm.api.requestInput(function(commandFull){
								var inputTerms = commandFull.split(" ");
								var indexStart = 0;
								if (inputTerms[indexStart] === ""){
									indexStart = indexStart + 1;
								}
								var nodeName = inputTerms[indexStart];
								if (!Object.keys(prgm.api.getAccessibleNodes()).includes(nodeName)){
									prgm.api.throwError('(edit.ext) no such document recognized');
									edit.errorState = true;
									return;
								} else if (!prgm.api.getAccessibleNodes()[nodeName].canBeRead) {
									prgm.api.throwError(`(edit.ext) ${nodeName} has no readable data`);
									edit.errorState = true;
									return;
								} else {
									edit.docToOpen = nodeName;
								}
								prgm.api.runCommand(`edit ${edit.docToOpen}`)
								return;
							}, `Enter accessible document name: `)
							return;
						} else if (!edit.wantsExistingDoc){
							if (!edit.noDocVer) {

							prgm.api.verifyCommand('Open edit.ext without any doc to edit?', function (bool, toggle) {
								toggle.toggle = true;
								if (bool){
									edit.noDocVer = true;
									edit.openNoDoc = true;
									return;
								} else {
									edit.noDocVer = true;
									return;
								}
							})
							return;
							} else if (edit.noDocVer && edit.openNoDoc) {
								//start program with command that handles row res, MUST define string with newDoc command or openDoc

							} else if (edit.noDocVer && !edit.openNoDoc) {
								//reroute to beginning or exit out;
							}
						}
					} else if (edit.createNewDoc) {
						//start program with command that handles row reservation and shit;
						this.methods.startEditext();
					}
				}
				if (edit.errorState){
					createNewDoc = false;
					cndVer = false;
					wantsExistingDoc = false;
					wedVer = false;
					noDocVer = false;
					openNoDoc = false;
					docToOpen = "";
					if (this.api.checkIfRunning('editor.ext')){
						this.api.runCommand('stop');
					}
					return;
				}
				if (target){
					var accessibleNodes = prgm.api.getAccessibleNodes();
					if (!Object.keys(accessibleNodes).includes(target)){
						prgm.api.throwError('(editor.ext) no such document recognized');
						return;
					} else if (!accessibleNodes[target].canBeRead){
						prgm.api.throwError(`(editor.ext) ${target} has no readable data`);
						return;
					} else {
						var node = accessibleNodes[target];
						node.read(this.methods.startEditext);
					}

				}
			},
		},

	},
	install : function (terminal, callback) {
		this.trmnl = terminal;
		this.api = terminal.api;

		this.installData.edit.ex = this.installData.edit.ex.bind(this)

		Object.keys(this.methods.keyStrokeRouter).forEach(function(funcName){
			this.methods.keyStrokeRouter[funcName] = this.methods.keyStrokeRouter[funcName].bind(this);
		}, this);

		Object.keys(this.methods).forEach(function(funcName){
			if (typeof this.methods[funcName] === 'function'){
				this.methods[funcName] = this.methods[funcName].bind(this);
			} else {
				return;
			}
		}, this)

		this.api.addInterfaceFunction(this.methods.routeKeyUp, 'useKeyUpRouter');
		this.api.addInterfaceFunction(this.methods.routeKeyStroke, 'useAltKeyRouter'); 

		window.addEventListener("resize", this.methods.inititalizeDimensions);

		if (callback){
			callback(this.installData)
		}

	},
	uninstall : function () {
		this.trml = {};
		this.api = {};
		delete this.reader.editor;
		delete this.reader;

		this.api.patchInterfaceFunction('alternateKeyRouterActive', function(){
			return false;
		});
		this.api.patchInterfaceFunction('usingKeyUpHandling', function(){
			return false;
		});
		
		this.api.deleteInterfaceFunction('useKeyUpRouter', 'editor.ext');
		this.api.deleteInterfaceFunction('useAltKeyRouter', 'editor.ext');

		window.removeEventListener("resize", this.methods.inititalizeDimensions);


	},
	stop : function () {
		this.settings.isRunning = false;
		this.api.clearReservedRows();
		this.api.reserveRows(0);
		this.api.patchInterfaceFunction('alternateKeyRouterActive', function(){
			return false;
		});
		this.api.patchInterfaceFunction('usingKeyUpHandling', function(){
			return false;
		});
	},
	ex : function (target) {
		this.installData.edit.ex(target)
	}
}
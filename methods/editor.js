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
		selectedText : false,
		textWidth : 0,
		displayHeight : 0,
		colHeight : 0,
		rowWidth : 0,
		characterMatrix : [],
		displayBarWidth : 20,
		displayBar : [],
		stringIndexOffset : 0,
		vRowOffset : 0,
	},
	settings: {
		editMode : false,
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
				this.methods.writeToText('     ')
			},
			'13' : function (e) {
				this.methods.writeToText('\\n')
				console.log(this.data.text);
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
				this.methods.handleCursorLeft();
			},
			'38' : function (e) {
				this.methods.handleCursorUp();
			},
			'39' : function (e) {
				this.methods.handleCursorRight();
			},
			'40' : function (e) {
				this.methods.handleCursorDown();
			},
			'67' : function (e) {
				if (this.data.ctrlDown){
					this.methods.copy();
					return;
				}
				this.methods.keyStrokeRouter.generalCase(e);
			},
			'117' : function (e) {
				if (!this.settings.isRunning){
					return;
				}
				this.methods.toggleEditMode();
				return;
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
			if (this.settings.displaySidebar){
				this.methods.drawDisplayBar();
			}
			if (!this.settings.editMode){
				if (e.keyCode === 117){
					this.methods.keyStrokeRouter['117'](e);
					return;
				}
				console.log(this.settings.editMode)
				this.api.useDefaultKeyRouter(e)
			}
			if (Object.keys(this.methods.keyStrokeRouter).includes(e.keyCode.toString())){
				this.methods.keyStrokeRouter[e.keyCode.toString()](e);
			} else {
				this.methods.keyStrokeRouter.generalCase(e);
			}
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
		toggleEditMode : function () {
			if (this.settings.editMode == true){
				this.settings.editMode = false;
				this.api.restoreDefaultCursorPosition();
			} else if (this.settings.editMode == false){
				this.settings.editMode = true;
				this.methods.inititalizeCursorPosition();
				var coordinates = this.methods.convertCursorLocationToXY()
				this.api.positionCursor(coordinates[0], coordinates[1]);
			} else {
				this.api.runCommand(`stop`);
				this.api.throwError(`editor.ext crashed with status: editMode = ${this.data.editMode}`)
			}
		},
		writeToText : function (value) {
			var insertLocation = this.data.cursorLocation[2];
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

			var nextNewLine = this.data.text.substring(currentStringIndex).indexOf('\\n');
			if (this.data.text.substring(currentStringIndex, nextNewLine).includes('\\t')){

			}
			//BAD CODE WARNING
			this.data.cursorLocation[2] += value.length;
		
				this.methods.incrementCursorLocation();
		
			var coordinates = this.methods.convertCursorLocationToXY()
			this.api.positionCursor(coordinates[0], coordinates[1]);
			this.data.characterMatrix = [];
			this.methods.composeText();
			this.methods.composeFromCharMatrix();
		},
		deleteLetter : function () {
			this.data.cursorLocation[2] -= 1;
			var deleteLocation = this.data.cursorLocation[2];
			if (this.data.text.length === deleteLocation + 1){
				this.data.text = this.data.text.substring(0,deleteLocation);
			} else {
				var prepend = this.data.text.substring(0,deleteLocation);
				var postpend = this.data.text.substring(deleteLocation + 1);
				this.data.text = prepend + postpend;
			}

			//STILL NEEDS HANDLING FOR DELETING \\n and \\t

			this.methods.decrementCursorLocation();
			var coordinates = this.methods.convertCursorLocationToXY()
			this.api.positionCursor(coordinates[0], coordinates[1]);
			var oldLength = this.data.characterMatrix.length;
			this.data.characterMatrix = [];
			this.methods.composeText();
			this.methods.composeFromCharMatrix();
			if (this.data.characterMatrix.length < oldLength){
				console.log('shorter');
				for (var i = oldLength ; i >=this.data.characterMatrix.length; i--) {
					this.api.writeToGivenRow("", i)
				}
			}
		},
		multiDelete : function () {
			var deleteStartIndex = this.data.highlight[0];
			var deleteEndIndex = this.data.highlight[1];

			var prepend = this.data.text.substring(0, deleteStartIndex);
			var postpend = this.data.text.substring(deleteEndIndex + 1);

			this.data.text = prepend + postpend;
		},
		copy : function () {
			this.data.clipBoard = this.data.text.substring(this.data.highlight[0], this.data.highlight[1]);
		},
		cut : function () {
			this.data.clipBoard = this.data.text.substring(this.data.highlight[0], this.data.highlight[1]);
			var prepend = this.data.text.substring(0, this.data.highlight[0]);
			var postpend = this.data.text.substring(this.data.highlight[1]);

			this.data.text = prepend + postpend;

			this.data.cursorLocation[2] -= this.data.clipBoard.length;
		},
		paste : function () {
			var insertLocation = this.data.cursorLocation[2];
			if (insertLocation === this.data.text.length){
				this.data.text += this.data.clipBoard;
			} else {
				var prepend = this.data.text.substring(0, insertLocation);
				var postpend = this.data.text.substring(insertLocation);
				this.data.text = prepend + this.data.clipBoard + postpend;
				this.data.cursorLocation[2] += this.data.clipBoard.length;
			}
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
		reComposeText : function () {

		},
		composeText : function () {
			var string = this.data.text;
			var currentRow = 0;
			var currentCol = 0;
			var prevCharBackslash = false;
			console.log(string.length)
			for (var i = 0; i < string.length; i++) {
				if (!this.data.characterMatrix[currentRow]){
					this.methods.appendRowToCharacterMatrix();
				}
				currentCol += 1;
				if (currentCol >= this.data.textWidth){
					currentCol = 0;
					if (this.settings.doubleSpacing){
							currentRow += 2;
							this.methods.appendRowToCharacterMatrix();
							this.methods.appendRowToCharacterMatrix();
						} else {
							currentRow += 1;
							this.methods.appendRowToCharacterMatrix();
						}
				} 	else if (string[i] === '\\'){
					prevCharBackslash = true;
				} else if (prevCharBackslash) {
					if (string[i] === 'n'){
						currentCol = 0;
						if (this.settings.doubleSpacing){
							currentRow += 2;
							this.methods.appendRowToCharacterMatrix();
							this.methods.appendRowToCharacterMatrix();
						} else {
							currentRow += 1;
							this.methods.appendRowToCharacterMatrix();
						}
						prevCharBackslash = false;
					
					} else if (string[i] === 't'){
						this.data.characterMatrix[currentRow][currentCol][0] = i
						for (var j = 0; j < 3; j++) {
							this.data.characterMatrix[currentRow][currentCol + j][0] = " ";	
						};
						currentCol += 2
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
			console.log(this.data.characterMatrix)
			console.log(this.data.text[42])
			var prevCharBackslash = false;
			var lineBreak = false;
			var pageBreak = false;
			var rowOffset = 0;
			var colOffset = 1;
			this.data.characterMatrix.forEach(function(row, rowIndex){
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
			this.data.textWidth = this.api.getRowCount() - 2;
			if (this.settings.displaySidebar){
				this.data.textWidth -= this.data.displayBarWidth;
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
			this.methods.setDisplayHeight();
			this.methods.reconstructCharacterMatrix();
			this.methods.reserveRows();
		},
		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		scaling functions end
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		drawDisplayBar : function () {
			var string = `editMode:${this.settings.editMode}`
			var rightEdge = this.api.getRowCount();
			var j = string.length;
			for (var i = rightEdge -1; i > rightEdge - 20; i--){
				j --;
				if (j >= 0)
				this.api.writeToCoordinate(string[j], 2, i)
			}
		},

		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		All cursor edge handlings must be dealt with to interact
		with actual viewport shit; this should be fun; cursor 
		has got to do actual work... 
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		decrementCursorLocation : function () {
			var newLoc = [0,0,-1]
			var presentRow = this.data.cursorLocation[0];
			var presentColumn = this.data.cursorLocation[1];
			if (this.data.cursorLocation[2] === 0){
				return;
			}
			for (var i = presentColumn - 1; i >= 0; i--){
				if (!Number.isNaN(this.data.characterMatrix[presentRow][i][0])){
					var cell = this.data.characterMatrix[presentRow][i][0]
					if (cell === undefined){
						continue;
					}
					if (this.data.text[cell] === undefined){
						continue;
					}
					if (this.data.text[cell] === '\\'){
						continue;
					}
					if (this.data.text[cell] === 'n' || this.data.text[cell] === 't'){
						if (this.data.text[cell - 1] === '\\'){
						continue;
						}
					}
					newLoc[0] = presentRow;
					newLoc[1] = i;
					newLoc[2] = this.data.characterMatrix[presentRow][i][0];
					break;
				}
				continue;
			}
			if (newLoc[2] === -1){
				for (var i = presentRow -1; i >= 0; i--){
					for (var j = this.data.characterMatrix[i].length -1 ; j >= 0 ; j --){
						var cell = this.data.characterMatrix[i][j][0]
						if (!Number.isNaN(this.data.characterMatrix[i][j][0])){
							if (this.data.characterMatrix[i][j][0] === undefined){
								continue;
							}
							if (this.data.text[cell] === undefined){
								continue;
							}
							if (this.data.text[cell] === '\\'){
								continue;
							}
							if (this.data.text[cell] === 'n' || this.data.text[cell] === 't'){
								if (j === 0 || !this.data.characterMatrix[i][j -1 ]){
									console.log(this.data.textWidth);
									console.log(this.data.characterMatrix);
									console.log(`i == ${i}`);
									var lastChar = "";
									for (var k = this.data.textWidth - 1 ; k >= 0; k--){
										if (this.data.characterMatrix[i-1][k][0] === undefined){
											continue;
										} else if (typeof this.data.characterMatrix[i-1][k][0] === 'number'){
											lastChar = this.data.text[this.data.characterMatrix[i-1][k][0]];
											break;
										}
									}
									if (lastChar === `\\`){
										continue;
									}
								} else {
									if (this.data.text[this.data.characterMatrix[i][j -1 ][0]] === '\\'){
										continue;
									}	
								}
							}
							newLoc[0] = i;
							newLoc[1] = j;
							newLoc[2] = this.data.characterMatrix[i][j][0];
							break;
						}
					}
					if (newLoc[2] !== -1){
						break;
					}
				}
				if (newLoc[2] === -1){
					return;
				}
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
					if (this.data.text[cell] === 'n' || this.data.text[cell] === 't'){
						if (this.data.text[cell - 1] === '\\'){
						continue;
						}
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
							if (this.data.text[cell] === '\\'){
								continue;
							}
							if (this.data.text[cell] === 'n' || this.data.text[cell] === 't'){
								console.log(j)
								if (j === 0){
									console.log(this.data.textWidth);
									console.log(this.data.characterMatrix);
									console.log(`i == ${i}`);
									var lastChar = "";
									for (var k = this.data.textWidth - 1 ; k >= 0; k--){
										if (this.data.characterMatrix[i-1][k][0] === undefined){
											continue;
										} else if (typeof this.data.characterMatrix[i-1][k][0] === 'number'){
											lastChar = this.data.text[this.data.characterMatrix[i-1][k][0]];
											break;
										}
									}
									if (lastChar === `\\`){
										continue;
									}
								} else {
									if (this.data.text[this.data.characterMatrix[i][j -1][0]] === '\\'){
										continue;
									}

								}
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
						if (targetCell !== undefined && targetCell[0] !== " "){
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
			console.log(targetCell)
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
						if (!isNaN(targetCell[0] + 5)){
							debugger;
						}
						if (targetCell !== undefined && targetCell[0] !== " "){
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
		convertCursorLocationToXY : function () {
			var x = this.data.cursorLocation[1];
			var y = this.api.getRowCount() - this.data.cursorLocation[0] - 1;
			var z = this.data.cursorLocation[2];
			console.log(`c[col] = ${x}.... c[row] = ${this.data.cursorLocation[0]} ... stringIndex = ${z} string = ${this.data.text[this.data.cursorLocation[2]]}`)
			this.api.logCursorPosition();
			return [x,y];
		},
		handleCursorUp : function () {
			this.methods.moveCursorUp();
			var coordinates = this.methods.convertCursorLocationToXY()
			this.api.positionCursor(coordinates[0], coordinates[1]);
		},
		handleCursorDown : function () {
			this.methods.moveCursorDown();
			var coordinates = this.methods.convertCursorLocationToXY()
			this.api.positionCursor(coordinates[0], coordinates[1]);
		},
		handleCursorLeft : function () {
			this.methods.decrementCursorLocation();
			var coordinates = this.methods.convertCursorLocationToXY()
			this.api.positionCursor(coordinates[0], coordinates[1]);
		},
		handleCursorRight : function () {
			this.methods.incrementCursorLocation();
			var coordinates = this.methods.convertCursorLocationToXY()
			this.api.positionCursor(coordinates[0], coordinates[1]);
		},

		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

		END CURSOR SHIT
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		startEditext : function (text, doc) {
			if (this.api.commandAvailCheck(`stop`)){
				this.api.runCommand('stop')
			}
			this.api.readyCommand('stop');
			this.settings.isRunning = true;
			this.api.appendToRunningPrograms('edit.ext');

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
			} else {
				this.data.text = "";
			}
			this.api.log(` use "F6" to switch between input modes`);
			this.api.log(` use "F7" to toggle sidebar display`)

			this.methods.composeText();
			this.methods.composeFromCharMatrix();
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
					if (this.api.checkIfRunning('editor.ext')){
						this.api.runCommand('stop');
					}
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
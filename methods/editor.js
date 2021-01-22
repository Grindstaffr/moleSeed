export const program = {
	name : `editor.ext`,
	isInstalled : false,
	runsInBackGround : false,
	size : 2000,
	memory : 12039,
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
	},
	settings: {
		editMode : false,
		displaySidebar : false,

	},
	methods: {
		usingKeyUpHandling : function () {
			return true;
		}
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
				this.methods.handleCursorLeft();
			},
			'67' : function (e) {
				if (this.data.ctrlDown){
					this.methods.copy();
					return;
				}
				this.methods.keyStrokeRouter.generalCase(e);
			},
			'73' : function (e) {
				if (!this.settings.isRunning){
					return;
				}
				if (this.data.altDown) {
					this.methods.toggleEditMode();
					return;
				}
				this.methods.keyStrokeRouter.generalCase(e)
			},
			'86' : function (e) {
				if (this.data.ctrlDown){
					this.methods.paste();
					return;
				}
				this.methods.keyStrokeRouter.generalCase(e);
			},
			generalCase : function (e) {
				value = e.key.toString();
				this.methods.writeToText(value);
			},

		},
		routeKeyStroke: function (e) {
			if (!this.data.editMode){
				if (this.data.altDown && e.keyCode === 73){
					this.methods.keyStrokeRouter['73'](e);
					return;
				}
				this.api.useDefaultKeyRouter(e)
			}
			if (Object.keys(this.methods.keyStrokeRouter).includes(e.keyCode.toString())){
				this.methods.keyStrokeRouter[e.keyCode.toString](e);
			} else {
				this.methods.keyStrokeRouter.generalCase(e);
			}
		},
		routeKeyUp : function (e) {
			if (e.keyCode === 16) {
				e.preventDefault();
				this.data.shiftDown = false;
			} else if (e.keyCode === 17) {
				e.preventDefault();
				this.data.ctrlDown = false;
			} else  if (e.keyCode === 18) {
				e.preventDefault();
				this.data.altDown = false;
			}
		},
		toggleEditMode : function () {
			if (this.settings.editMode == true){
				this.settings.editMode = false;
			} else if (this.settings.editMode == false){
				this.settings.editMode = true;
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
			this.data.cursorLocation[2] += 1;
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
			if (insertLocation] === this.data.text.length){
				this.data.text += this.data.clipBoard;
			} else {
				var prepend = this.data.text.substring(0, insertLocation);
				var postpend = this.data.text.substring(insertLocation);
				this.data.text = prepend + this.data.clipBoard + postpend;
				this.data.cursorLocation[2] += this.data.clipBoard.length;
			}
		},
		composeText : function () {
			return this.data.text
		},
		/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		All cursor edge handlings must be dealt with to interact
		with actual viewport shit; this should be fun; cursor 
		has got to do actual work... 
		!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		*/
		incrementCursorLocation : function () {
			this.data.cursorLocation[2] += 1;
		},
		handleCursorUp : function () {
			if (this.data.cursorLocation[1] === this.data.textWidth){
				if (this.data.cursorLocation[0] === 0){

				}
			}
			this.api.positionCursor(this.data.cursorLocation[0], this.data.cursorLocation[1]);
		},
		handleCursorDown : function () {
			
			this.api.positionCursor(this.data.cursorLocation[0], this.data.cursorLocation[1]);
		},
		handleCursorLeft : function () {
			if (this.data.cursorLocation[0] === 0){
				this.data.cursorLocation[1] -= 1;
				this.data.cursorLocation[0] = this.data.textWidth;
			} else {
				this.data.cursorLocation[0] += 1;
			}
			this.api.positionCursor(this.data.cursorLocation[0], this.data.cursorLocation[1]);
		},
		handleCursorRight : function () {
			if (this.data.cursorLocation[0] === this.data.textWidth){
				this.data.cursorLocation[1] += 1;
				this.data.cursorLocation[0] = 0;
			} else {
				this.data.cursorLocation[0] -= 1;
			}
			this.api.positionCursor(this.data.cursorLocation[0], this.data.cursorLocation[1]);
		},

	},
	installData : {
		edit : {
			name : 'edit',
			desc : 'edit a text document',
			syntax : 'edit (readable)', // still need .wt files and compiler
			hasHelp : false, //still need longHelp
			longHelp : ' --- Operation Guide for "edit" syntax ---',
			ex : function (target) {
				this.api.log(` use "ALT+I" to switch between TEXT_EDIT and TERMINAL_INPUT`)
			},
		},

	},
	install : function (terminal, callback) {
		this.trmnl = terminal;
		this.api = terminal.api;
	
		this.reader = this.trmnl.programs[`reader.ext`];
		this.reader.editor = this;

		this.methods.toggleEditMode = this.methods.toggleEditMode.bind(this);
		this.methods.routeKeyStroke = this.methods.routeKeyStroke.bind(this);
		this.methods.routeKeyUp = this.methods.routeKeyUp.bind(this);

		Object.keys(this.methods.keyStrokeRouter).forEach(function(func){
			func = func.bind(this);
		}, this);

		this.api.addInterfaceFunction('useKeyUpRouter', this.methods.routeKeyUp);
		this.api.addInterfaceFunction('useAltKeyRouter', this.methods.routeKeyStroke); 

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
	ex : function () {
		this.api.patchInterfaceFunction('alternateKeyRouterActive', function(){
			return true;
		});
		this.api.patchInterfaceFunction('usingKeyUpHandling', function(){
			return true;
		});
		this.api.patchInterfaceFunction('useKeyUpRouter', this.methods.routeKeyUp);
		this.api.patchInterfaceFunction('useAltKeyRouter', this.methods.routeKeyStroke);
		this.data.textWidth = this.api.getRowCount() - 2;
	}
}
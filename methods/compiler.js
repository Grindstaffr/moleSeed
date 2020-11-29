export const compilerBuilder = function (parent) {
	const compiler = {};
	const init = function (parent) {
		compiler.cache = parent.cache;
		compiler.cmd = parent.command;
		compiler.trmnl = parent;
		compiler.cmd.compiler = compiler;
		compiler.inputBuffer = {};
		compiler.inputBuffer.bufferInUse= false;
		compiler.inputBuffer.shouldVerify = false;
		compiler.inputBuffer.shouldExtend = false;
		compiler.inputBuffer.declaredWare = {};

		compiler.inputBuffer.toggleMethods = {
			verify : function () {
				this.shouldVerify = true;
				this.shouldExtend = false;
			},
			extend : function () {
				this.shouldVerify = false;
				this.shouldExtend = true;
			},
		};

		compiler.inputBuffer.toggleMethods.verify = compiler.inputBuffer.toggleMethods.verify.bind(compiler.inputBuffer);
		compiler.inputBuffer.toggleMethods.continue = compiler.inputBuffer.toggleMethods.continue.bind(compiler.inputBuffer);

		compiler.validArgs = {
			'[COMMAND]' : [],
			'[NODE]' : [],
			'[PROGRAM]' : [],
			'[MOLE]' : [],
			'[NUMBER]' : "number",
			'[BOOLEAN]' : "boolean",
			'[TEXT]' : "string",
		};
		compiler.getValidArgs();
	};

	compiler.throwVerify = function (message) {
		this.inputBuffer.toggleMethods.verify();
		var line = message + `(y/n)`
		this.cache.writeEmptyLine();
		this.cache.writeToVisibleRow(line)
		this.cache.writeEmptyLine();
		return;
	};

	compiler.throwExtend = function (message) {
		this.inputBuffer.toggleMethods.extend();
		var line = message
		this.cache.writeEmptyLine();
		this.cache.writeToVisibleRow(line)
		this.cache.writeEmptyLine();
		return;
	};

	compiler.fetchCommandSyntax = function (commandName) {
		var syntax = this.cmd[commandName].syntax;
		if (typeof syntax === "string"){
			return [syntax];
		} else {
			return syntax
		}
	};

	compiler.compileFromInput = function (fullInput) {
		var inputTerms = fullInput.split(" ")
		var inputExtension = [];
		if (!compiler.inputBuffer.bufferInUse){
			//case that buffer isn't being used for a multi-input command
			compiler.inputBuffer.lastInput = fullInput;
			compiler.inputBuffer.lastInputVerified = false;
		} else if (compiler.inputBuffer.bufferInUse){
			//case that last passthru required additional user input;
			if (this.inputBuffer.shouldVerify){
				//case that lastInput triggered user verification

			};
			if (this.inputBuffer.shouldExtend){
				//case that lastInput triggered user extension of command (not enough terms?)

			};
		};

		//check to see if first term 





	};
	compiler.manageInputBuffer = function (fullInput) {

	};
	compiler.getCommandDetails = function(commandName) {
		if (commandName === 'default') {
			return;
		}

	}
	compiler.determineCommand = function (fullInput) {
		var inputTerms = fullInput.split(" ");
		var commandName = inputTerms[0];

		if (commandName === ""){
			this.command.null.ex();
			return 'default';
		};
		if (commandName === "mole") {
			if () {

			}
			return 'mole';
		};
		if (commandName === "worm") {
			if () {

			}
			return 'worm';
		};
		if 

	};
	compiler.fetchDeclaredMole = function (fullInput) {

	};
	compiler.fetchDeclaredWorm = function (fullInput) {

	};
	compiler.parseTerminalCommand = function (fullInput) {

	};
	compiler.parseWormWare = function (fullInput) {

	};
	compiler.parseMoleWare = function (fullInput){

	};
	compiler.getValidArgs = function () {
		this.validArgs[`[COMMAND]`] = this.command.validCommandList
		this.validArgs[`[NODE]`] = this.command.validNodeList
		this.validArgs[`[PROGRAM]`] = this.command.validProgramList
		this.validArgs[`[MOLE]`] = this.command.validMoleList
		this.validArgs[`[WORM]`] = this.command.validWormList
		this.validArgs[`[NUMBER]`] = "number"
		this.validArgs[`[BOOLEAN]`] = "boolean"
		this.validArgs[`[TEXT]`] = "string"
	};
	init();
	return compiler;
}
export class mSe {
	/*
		@subparam {string} programObject.name
		@subparam {Object} programObject.data
		@subparam {Object} programObject.methods
		@subparam {Object} programObject.keyBindings
		@subparam {Object} programObject.installData
		@subparam {function} programObject.installFunc
		@subparam {function} programObject.exFunc
		@subparam {function} programObject.drawFunc
	*/
	constructor(programObject){
		this.name = programObject.name;
		this.data = programObject.data;
		this.settings = programObject.settings;
		this.methods = programObject.methods;
		this.keyBindings = programObject.keyBindings;
		this.installData = programObject.installData;
		this.install = programObject.install;
		this.ex = programObject.ex;
		this.draw = programObject.draw;
	}

	install(terminal){
		this.installFunc(this.installData)
		this.installData.isInstalled = true;
	}

	uninstall(terminal){

	}
}
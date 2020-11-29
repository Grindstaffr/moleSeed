const program = {
	name : '[PROGRAM].mSe',
	isInstalled : false,
	data : {
		
	},
	settings: {
		isRunning : false,
	},
	methods: {

	},
	keyBindings : {

	},
	installData : {

	},
	install : function (terminal, callback) {
		this.trmnl = terminal;
		this.api = terminal.api;
		terminal.programs[this.name] = this;
		if (callback) {
			callback(this.installData);
		}
		for (var prop in methods){
			prop.prgm = this;
		}
		this.isInstalled = true;
	},
	ex : function () {
		this.settings.isRunning = true;
	},
	esc : function () {
		this.settings.isRunning = false;
	},
	draw : function () {
		if (!this.settings.isRunning){
			return;
		}
	},
}
export const startScreen = {
	isOn : true,

	bootTerminal : function () {
		this.turnTerminalOn();
	}

	init : function (terminal) {
		this.api = terminal.api;
		this.turnTerminalOn = terminal.turnOn();
	},
}
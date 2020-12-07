export const recruiter = {
	effectiveness : 1.9,
	slowness : 80,
	crackingAbil : 25,
	trolls : {
	 1 : `I'm having a shippy day`,
	 2 : `I'm more than mad, i'm pIRATE!`,
	 3 : `My favorite type of animal is the CommonDeer`,
	 4 : `When I cry, I let loose one privateTeer`,
	 5 : `Poop deck`,
	 6 : `I don't update... I-patch.`,
	 7 : `I like starting up my computer... that's the only time I get a little BOOTy`,
	 8 : `Suck a lime, you fart-huffin' bilge rat`,
	 9 : `YOUR SYSTEM HAS BEEN INFECTED WITH MALWARE, TYPE "install pegleg.yaar" TO STOP IT`,
	 0 : `My favorite part of a song is always the HOOK`,
	},
	recruitAnim : function (api, callback) {
		if (callback){
			callback();
		}
	},
	failureAnim : function (api, callback) {
		if (callback){
			callback();
		}
	},
	exAnim : function (api, frame) {
		api.lockInput();

		var selectFrames = function (value) {
			var val = value & 27;
			return asciiArt[`pirate_${value}`]
		}

		var drawRows = function (value, acc) {
			api.clearReservedRows();
			api.clearUnreservedRows();
			var newVal = value + 1;
			var newAcc = acc + 1;
			if (newVal === 27){
				newVal = 0;
			}
			if (acc > 160){
				api.unlockInput();
				api.defeatedMalware(`pegleg.yaar`,`recruiter`)
				return;
			}
			var frames = selectFrames(value + 1);
			Object.keys(frames).forEach(function(rowName,index){
				api.writeToGivenRow((" ").repeat(Math.floor(api.getRowCount()-37)/2) + frames[rowName], (Math.floor((api.getRowCount()-8)/2) + index))
			});
			var line = "YOUR HARDWARE'S BEEN PIRATED... ARRRRR YOU SURPRISED?"
			api.writeToGivenRow((" ").repeat(Math.floor(api.getRowCount()-line.length)/2) + line, (Math.floor((api.getRowCount()-8)/2) + 10 ))

			setTimeout(function(){drawRows(newVal,newAcc)}, 200)
		};

		const asciiArt = {};
		asciiArt.pirate_1 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"   _ ___              |    T   |     ",
			row_3 :	"  | | o |             |    |   |     ",
			row_4 :	"  | | x |             |____|___|     ",
			row_5 :	"  |_|___|          _____||__||__     ",
			row_6 :	"   _I_I___         \\   o  o  o  |I  ",
			row_7 :	"  I| o o./          \\           |I  ",
			row_8 :	"  |_____/            \\__________/   ",
		}
		asciiArt.pirate_2 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"    _ ___             |    T   |     ",
			row_3 :	"   | | o |            |    |   |     ",
			row_4 :	"   | | x |            |____|___|     ",
			row_5 :	"   |_|___|         _____||__||__     ",
			row_6 :	"    _I_I___ .      \\   o  o  o  |I  ",
			row_7 :	"   I| o o /         \\           |I  ",
			row_8 :	"   |_____/           \\__________/   ",
		}
		asciiArt.pirate_3 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"     _ ___            |    T   |     ",
			row_3 :	"    | | o |           |    |   |     ",
			row_4 :	"    | | x |           |____|___|     ",
			row_5 :	"    |_|___|    .   _____||__||__     ",
			row_6 :	"     _I_I___       \\   o  o  o  |I  ",
			row_7 :	"    I| o o /        \\           |I  ",
			row_8 :	"    |_____/          \\__________/   ",
		}
		asciiArt.pirate_4 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"      _ ___           |    T   |     ",
			row_3 :	"     | | o |          |    |   |     ",
			row_4 :	"     | | x |          |____|___|     ",
			row_5 :	"     |_|___|       _____||__||__     ",
			row_6 :	"      _I_I___     .\\   o  o  o  |I  ",
			row_7 :	"     I| o o /       \\           |I  ",
			row_8 :	"     |_____/         \\__________/   ",
		}
		asciiArt.pirate_5 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"       _ ___          |    T   |     ",
			row_3 :	"      | | o |         |    |   |     ",
			row_4 :	"      | | x |         |____|___|     ",
			row_5 :	"      |_|___|      _____||__||__     ",
			row_6 :	"       _I_I___     \\   o  o  o  |I  ",
			row_7 :	"      I| o o /      #           |I  ",
			row_8 :	"      |_____/        \\__________/   ",
		}
		asciiArt.pirate_6 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"        _ ___         |    T   |     ",
			row_3 :	"       | | o |        |    |   |     ",
			row_4 :	"       | | x |        |____|___|     ",
			row_5 :	"       |_|___|     _____||__||__     ",
			row_6 :	"        _I_I___   ^\\   o  o  o  |I  ",
			row_7 :	"       I| o o./     @^          |I  ",
			row_8 :	"       |_____/     ^ \\__________/   ",
		}
		asciiArt.pirate_7 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"         _ ___        |    T   |     ",
			row_3 :	"        | | o |       |    |   |     ",
			row_4 :	"        | | x |       |____|___|     ",
			row_5 :	"        |_|___| .  _____||__||__     ",
			row_6 :	"         _I_I___   \\   o  o  o  |I  ",
			row_7 :	"        I| o o /    0           |I  ",
			row_8 :	"        |_____/      \\__________/   ",
		}
		asciiArt.pirate_8 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"          _ ___       |    T   |     ",
			row_3 :	"         | | o |   .  |    |   |     ",
			row_4 :	"         | | x |      |____|___|     ",
			row_5 :	"         |_|___|   _____||__||__     ",
			row_6 :	"          _I_I___  \\   o  o  o  |I  ",
			row_7 :	"         I| o o /   0           |I  ",
			row_8 :	"         |_____/     \\__________/   ",
		}
		asciiArt.pirate_9 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"           _ ___      |    T   |     ",
			row_3 :	"          | | o |     |,   |   |     ",
			row_4 :	"          | | x |     |____|___|     ",
			row_5 :	"          |_|___|  _____||__||__     ",
			row_6 :	"           _I_I___ \\   o  o  o  |I  ",
			row_7 :	"          I| o o /  0           |I  ",
			row_8 :	"          |_____/    \\__________/   ",
		}
		asciiArt.pirate_10 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"             _ ___    |    T   |     ",
			row_3 :	"            | | o |   |,   |   |     ",
			row_4 :	"            | | x |   |____|___|     ",
			row_5 :	"            |_|___|_____||__||__     ",
			row_6 :	"             _I_I__\\   o  o  o  |I  ",
			row_7 :	"            I| o o /0           |I  ",
			row_8 :	"            |_____/  \\__________/   ",
		}
		asciiArt.pirate_11 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"              _ ___   |    T   |     ",
			row_3 :	"             | | o |  |,   |   |     ",
			row_4 :	"             | | x |  |____|___|     ",
			row_5 :	"             |_|___|____||__||__     ",
			row_6 :	"              _I_I__\\_ o  o  o  |I  ",
			row_7 :	"             I| o o /           |I  ",
			row_8 :	"             |_____/ \\__________/   ",
		}
		asciiArt.pirate_12 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"               _ ___  |    T   |     ",
			row_3 :	"              | | o | |,   |   |     ",
			row_4 :	"              | | x | |____|___|     ",
			row_5 :	"              |_|___|___||__||__     ",
			row_6 :	"               _I_I_\\__o  o  o  |I  ",
			row_7 :	"              I| o o /          |I  ",
			row_8 :	"              |_____/\\__________/   ",
		}
		asciiArt.pirate_13 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"               _ ___  |    T   |     ",
			row_3 :	"              | | o | |,   |   |     ",
			row_4 :	"              | | x | |____|___|     ",
			row_5 :	"              |_|___|___||__||__     ",
			row_6 :	"               _I_I_P__o  o  o  |I  ",
			row_7 :	"              I| o o /          |I  ",
			row_8 :	"              |_____/\\__________/   ",
		}
		asciiArt.pirate_14 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"               _ ___  |    T   |     ",
			row_3 :	"              | | o | |,   |   |     ",
			row_4 :	"              | | x | |____|___|     ",
			row_5 :	"              |_|___|P__||__||__     ",
			row_6 :	"               _I_I_\\__o  o  o  |I  ",
			row_7 :	"              I| o o /          |I  ",
			row_8 :	"              |_____/\\__________/   ",
		}
		asciiArt.pirate_15 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"               _ ___  |    T   |     ",
			row_3 :	"              | | o | |,   |   |     ",
			row_4 :	"              | | x | |____|___|     ",
			row_5 :	"              |_|___|__P||__||__     ",
			row_6 :	"               _I_I_P__o  o  o  |I  ",
			row_7 :	"              I| o o /          |I  ",
			row_8 :	"              |_____/\\__________/   ",
		}
		asciiArt.pirate_16 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"               _ ___  |    T   |     ",
			row_3 :	"              | | o | |,   |   |     ",
			row_4 :	"              | | x | |____|___|     ",
			row_5 :	"              |_|___|P__||P_||__     ",
			row_6 :	"               _I_I_\\__o  o  o  |I  ",
			row_7 :	"              I| o o /          |I  ",
			row_8 :	"              |_____/\\__________/   ",
		}
		asciiArt.pirate_17 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"               _ ___  |    T   |     ",
			row_3 :	"              | | o | |,   |   |     ",
			row_4 :	"              | | x | |____|___|     ",
			row_5 :	"              |_|___|__P||P_||__     ",
			row_6 :	"               _I_I_\\__o  o  o  |I  ",
			row_7 :	"              I| o o /          |I  ",
			row_8 :	"              |_____/\\__________/   ",
		}
		asciiArt.pirate_18 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"               _ ___  |    T   |     ",
			row_3 :	"              | | o | |,   |   |     ",
			row_4 :	"              | | x | |____|___|     ",
			row_5 :	"              |_|___|__P||P_||__     ",
			row_6 :	"               _I_I_\\__o  o  o  |I  ",
			row_7 :	"              I| o o /          |I  ",
			row_8 :	"              |_____/\\__________/   ",
		}
		asciiArt.pirate_19 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"               _ ___  |    T   |     ",
			row_3 :	"              | | o | |____|   |     ",
			row_4 :	"              | | x |   |||____|     ",
			row_5 :	"              |_|___|__P||P_||__     ",
			row_6 :	"               _I_I_\\__o  o  o  |I  ",
			row_7 :	"              I| o o /          |I  ",
			row_8 :	"              |_____/\\__________/   ",
		}
		asciiArt.pirate_20 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"               _ ___  |____T   |     ",
			row_3 :	"              | | o |   |||    |     ",
			row_4 :	"              | | x |   |||____|     ",
			row_5 :	"              |_|___|__P||P_||__     ",
			row_6 :	"               _I_I_\\__o  o  o  |I  ",
			row_7 :	"              I| o o /          |I  ",
			row_8 :	"              |_____/\\__________/   ",
		}
		asciiArt.pirate_21 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"               _ ___    |||T   |     ",
			row_3 :	"              | | o |   |||    |     ",
			row_4 :	"              | | x |   |||____|     ",
			row_5 :	"              |_|___|__P||P_||__     ",
			row_6 :	"               _I_I_\\__o  o  o  |I  ",
			row_7 :	"              I| o o /          |I  ",
			row_8 :	"              |_____/\\__________/   ",
		}
		asciiArt.pirate_22 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"               _ ___  |____T   |     ",
			row_3 :	"              | | o |   |||    |     ",
			row_4 :	"              | | x |   |||____|     ",
			row_5 :	"              |_|___|__P||P_||__     ",
			row_6 :	"               _I_I_\\__o  o  o  |I  ",
			row_7 :	"              I| o o /          |I  ",
			row_8 :	"              |_____/\\__________/   ",
		}
		asciiArt.pirate_23 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"               _ ___  | () T   |     ",
			row_3 :	"              | | o | |____|   |     ",
			row_4 :	"              | | x |   |||____|     ",
			row_5 :	"              |_|___|__P||P_||__     ",
			row_6 :	"               _I_I_\\__o  o  o  |I  ",
			row_7 :	"              I| o o /          |I  ",
			row_8 :	"              |_____/\\__________/   ",
		}
		asciiArt.pirate_24 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"               _ ___  | () T   |     ",
			row_3 :	"              | | o | | >< |   |     ",
			row_4 :	"              | | x | |____|___|     ",
			row_5 :	"              |_|___|__P||P_||__     ",
			row_6 :	"               _I_I_\\__o  o  o  |I  ",
			row_7 :	"              I| o o /          |I  ",
			row_8 :	"              |_____/\\__________/   ",
		}
		asciiArt.pirate_25 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"               _ ___  | () T   |     ",
			row_3 :	"              | | o | | >< |   |     ",
			row_4 :	"              | | x | |___P|___|     ",
			row_5 :	"              |_|___|__P||__||__     ",
			row_6 :	"               _I_I_\\__o  o  o  |I  ",
			row_7 :	"              I| o o /          |I  ",
			row_8 :	"              |_____/\\__________/   ",
		}
		asciiArt.pirate_26 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"               _ ___  | () T   |     ",
			row_3 :	"              | | o | | >< |   |     ",
			row_4 :	"              | | x | |P___|___|     ",
			row_5 :	"              |_|___|___||P_||__     ",
			row_6 :	"               _I_I_\\__o  o  o  |I  ",
			row_7 :	"              I| o o /          |I  ",
			row_8 :	"              |_____/\\__________/   ",
		}
		asciiArt.pirate_27 = {
			row_1 :	"                       ____ ___      ",
			row_2 :	"               _ ___  | () T   |     ",
			row_3 :	"              | | o | | >< |   |     ",
			row_4 :	"              | | x | |____|___|     ",
			row_5 :	"              |_|___|__P||P_||__     ",
			row_6 :	"               _I_I_\\__o  o  o  |I  ",
			row_7 :	"              I| o o /          |I  ",
			row_8 :	"              |_____/\\__________/   ",
		}

		drawRows(0,0)
	
		
	}

}
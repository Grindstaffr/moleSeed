export const recruiter = {
	effectiveness : 1.3, //relative to mean of 1 (scalar for how long recruited hardware stays under user control)
	slowness : 70, //scalar for setTimeout governing animation on recruit?
	crackingAbil : 40,//can only crack things with lower security ratings?
	trolls : {
		1 : `I'm a fun guy!`,
		2 : `Ant you glad you're not an ant?`,
		3 : `All your ants are belong to us`,
		4 : `...moron`,
		5 : `get high, then die`,
		6 : `SHROOMTOWN BAYYYBBYYYY`,
		7 : `Mind your own business`,
		8 : `YOUR BRAIN IS BEING INFECTED! HIT ALT-F4 TO STOP IT NOW!`,
		9 : `I'll bet you've got poop in your diaper, you stupid baby...`,
		0 : `Ummm... well... no. not happening.`
	}, 
	author : "",
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
	exAnim : function (api, frame){
		api.lockInput();
		

		var selectFrames = function (value) {
			var val_1 = value % 4
			var val_2 = value % 8
			return [asciiArt[`head_${val_1}`],asciiArt[`shroom_${val_2}`]]
		}

		var drawRows = function (value, acc) {
			api.clearReservedRows();
			api.clearUnreservedRows();
			var newValue = value + 1
			var newAcc = acc + 1;
			if (newValue === 8){
				newValue = 0
			}
			if (acc > 40) {
				api.unlockInput()
				api.defeatedMalware(`cordyceps.msh`,`recruiter`)
				return;
			}
			var frames = selectFrames(value);
			var mid = Math.floor(api.getRowCount()/2)
			
			Object.keys(frames[0]).forEach(function(rowName, index){
				if (index < 5){
					var shroom = (` `).repeat((Math.floor((api.getRowCount()-12)/2))+2) + selectFrames(value)[1][`row_${index+1 }`];
				}
				var head = (` `).repeat((Math.floor((api.getRowCount()-12)/2))-2) + selectFrames(value)[0][`row_${index+1}`]

				
				if (index < 5){
					api.writeToGivenRow(shroom,( mid - 15 + index))
				}
				api.writeToGivenRow(head, (mid - 10 + index))
			})
			var numSpaces = Math.floor((api.getRowCount()- asciiArt.message[value + 1].length)/2)
			api.writeToGivenRow((" ").repeat(numSpaces) + asciiArt.message[value + 1], mid + 3)


			setTimeout(function(){drawRows(newValue, newAcc)}, 250);
		}

		var asciiArt = {};

		asciiArt.message = {
			1 : "YOUR",
			2 : "YOUR",
			3 : "HARDWARE",
			4 : "HARDWARE",
			5 : "IS",
			6 : "IS",
			7 : "MINE",
			8 : "MINE",
			9 : "NOW",
			10 : "NOW",
		}

		asciiArt.head_0 = {
			row_1 : `    /\\/\\/\\ `,
			row_2 : `   /      \\ `,
			row_3 : `  |        |`,
			row_4 : ` _| /o  /\\ |_`,
			row_5 : `|   \\/  o/   |`,
			row_6 : `|     /      |`,
			row_7 : ` \\   <_n    /`,
			row_8 : `  |        |`,
	        row_9 : `  \\ /\\/\\/\\ /`,
	        row_10 : `   \\______/ `,
		}
		asciiArt.head_1 = {
			row_1 : `    /\\/\\/\\ `,
			row_2 : `   /      \\ `,
			row_3 : `  |        |`,
			row_4 : ` _| o\\  o\\ |_`,
			row_5 : `|   \\/  \\/   |`,
			row_6 : `|     /      |`,
			row_7 : ` \\   <_n    /`,
			row_8 : `  |        |`,
	        row_9 : `  \\ /\\/\\/\\ /`,
	        row_10 : `   \\______/ `,
		}
		asciiArt.head_2 = {
			row_1 : `    /\\/\\/\\ `,
			row_2 : `   /      \\ `,
			row_3 : `  |        |`,
			row_4 : ` _| /\\  /o |_`,
			row_5 : `|   o/  \\/   |`,
			row_6 : `|     /      |`,
			row_7 : ` \\   <_n    /`,
			row_8 : `  |        |`,
	        row_9 : `  \\ /\\/\\/\\ /`,
	        row_10 : `   \\______/ `,
		}
		asciiArt.head_3 = {
			row_1 : `    /\\/\\/\\ `,
			row_2 : `   /      \\ `,
			row_3 : `  |        |`,
			row_4 : ` _| /\\  /\\ |_`,
			row_5 : `|   \\o  \\o   |`,
			row_6 : `|     /      |`,
			row_7 : ` \\   <_n    /`,
			row_8 : `  |        |`,
	        row_9 : `  \\ /\\/\\/\\ /`,
	        row_10 : `   \\______/ `,
		}
		asciiArt.head_4 = {
			row_1 : `    /\\/\\/\\ `,
			row_2 : `   /      \\ `,
			row_3 : `  |        |`,
			row_4 : ` _| /o  /\\ |_`,
			row_5 : `|   \\/  o/   |`,
			row_6 : `|     /      |`,
			row_7 : ` \\   <_n    /`,
			row_8 : `  |        |`,
	        row_9 : `  \\ /\\/\\/\\ /`,
	        row_10 : `   \\______/ `,
		}
		asciiArt.head_5 = {
			row_1 : `    /\\/\\/\\ `,
			row_2 : `   /      \\ `,
			row_3 : `  |        |`,
			row_4 : ` _| o\\  o\\ |_`,
			row_5 : `|   \\/  \\/   |`,
			row_6 : `|     /      |`,
			row_7 : ` \\   <_n    /`,
			row_8 : `  |        |`,
	        row_9 : `  \\ /\\/\\/\\ /`,
	        row_10 : `   \\______/ `,
		}
		asciiArt.head_6 = {
			row_1 : `    /\\/\\/\\ `,
			row_2 : `   /      \\ `,
			row_3 : `  |        |`,
			row_4 : ` _| /\\  /o |_`,
			row_5 : `|   o/  \\/   |`,
			row_6 : `|     /      |`,
			row_7 : ` \\   <_n    /`,
			row_8 : `  |        |`,
	        row_9 : `  \\ /\\/\\/\\ /`,
	        row_10 : `   \\______/ `,
		}
		asciiArt.head_7 = {
			row_1 : `    /\\/\\/\\ `,
			row_2 : `   /      \\ `,
			row_3 : `  |        |`,
			row_4 : ` _| /\\  /\\ |_`,
			row_5 : `|   \\o  \\*o  |`,
			row_6 : `|     /      |`,
			row_7 : ` \\   <_n    /`,
			row_8 : `  |        |`,
	        row_9 : `  \\ /\\/\\/\\ /`,
	        row_10 : `   \\______/ `,
		}
		asciiArt.shroom_0 = {
			row_1 :	` `  ,   
			row_2 :	` `  ,    
			row_3 :	` ` ,
			row_4 :	`   ()`,
			row_5 :	`   ||`, 
		}
		asciiArt.shroom_1 = {
			row_1 :	` `,
			row_2 :	` `,
			row_3 :	`   ()`,
			row_4 :	`   ||`,
			row_5 :	`   ||`,
		}
		asciiArt.shroom_2 = {
			row_1 :	`   __ `,
			row_2 :	`  (  )`,
			row_3 :	`   || `,
			row_4 :	`   || `,
			row_5 :	`   || `,
		}
		asciiArt.shroom_3 = {
			row_1 :	`  ____ `,
			row_2 :	` ( __ )`,
			row_3 :	`  \\  / `,
			row_4 :	`   ||  `,
			row_5 :	`   ||  `,
		}
		asciiArt.shroom_4 = {
			row_1 : 	`  _____  `,
			row_2 : 	` / o   \\ `,
			row_3 : 	`(_____o_)`,
			row_4 : 	`   | |   `,
			row_5 : 	`   | |   `, 
		}
		asciiArt.shroom_5 = {
			row_1 : 	`  _____  `,
			row_2 : 	` / o   \\ `,
			row_3 : 	`(_____o_)`,
			row_4 : 	`  ^| |   `,
			row_5 : 	`   | |   `, 
		}
		asciiArt.shroom_6 ={

			row_1 : 	`  _____  `,
			row_2 : 	` / o   \\ `,
			row_3 : 	`(_____o_)`,
			row_4 : 	`   | | ^ `,
			row_5 : 	` ^ | |   `, 
		}
		asciiArt.shroom_7 = {
			row_1 : 	`  _____  `,
			row_2 : 	` / o   \\ `,
			row_3 : 	`(_____o_)`,
			row_4 : 	`   | |   `,
			row_5 : 	`   | |  ^`, 
		}

		drawRows(0,0);
	}
}
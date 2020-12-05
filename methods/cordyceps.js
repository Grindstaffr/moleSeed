export const recruiter = {
	effectiveness : 1.3, //relative to mean of 1 (scalar for how long recruited hardware stays under user control)
	slowness : 70, //scalar for setTimeout governing animation on recruit?
	crackingAbil : 40,//can only crack things with lower security ratings?
	trolls : {
		1 : "I'm a fun guy!",
		2 : "Ant you glad you're not an ant?",
		3 : "All your ants are belong to us",
		4 : "...moron",
		5 : "get high, then die",
		6 : "SHROOMTOWN BAYYYBBYYYY",
		7 : "Mind your own business",
		8 : "YOUR BRAIN IS BEING INFECTED! HIT ALT-F4 TO STOP IT NOW!",
		9 : "I'll bet you've got poop in your diaper, you stupid baby...",
		0 : "Ummm... well... no. not happening."
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
}
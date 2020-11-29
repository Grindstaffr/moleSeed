export const mole = {
	worm : {
		name : `_simple_homing_worm@@CARAVAN-nodeNet`,
		cache : {},
		ex : function (api, callback) {
			api.writeLine("initializing _simple_homing_worm@@CARAVAN-nodeNet...")
			api.writeLine("")
			setTimeout( function () {
				api.writeLine("learning _PDS_v.22.13.9281.a...")
				api.writeLine("")
			},150)
			setTimeout( function () {
				api.writeLine("harvesting meta data from CCentral_PDS_AA0032881...")
				api.writeLine("")
			}, 478)
			setTimeout( function () {
				api.writeLine("_simple_homing_worm@@CARAVAN-nodeNet :: iterating clones...")
				var count = 0;
				for (var i = 0; i < 64; i ++){
					setTimeout (function () {
						count = count + 1
						api.writeLine(`_s_h_w_ :: worm clone ${count} created`)
						api.writeLine(``) 
						if (count === 64){
							finalize()
						}
					}, count*12 + Math.floor(Math.random * count))
				}
				api.writeLine("")
			}, 690)
			var callCallback = function () {

				callback(api);

			}

			
			var finalize = function (){
				setTimeout( function () {
					api.writeLine(`finalizing...`)
					api.writeLine("")
					scanNodes();
				}, 800)
			};
			var chaseMatch = function () {
				api.clearUnreservedRows();
				api.writeLine(`_simple_homing_worm@@CARAVAN-nodeNet :: CARAVAN-nodeNet LOCATED`)
				api.writeLine(``)
				api.writeLine(``)
				api.writeLine(``)
				api.writeLine(``)
				api.writeLine(`_simple_homing_worm@@CARAVAN-nodeNet :: deleting worm remnants...`)
				setTimeout(function(){
					var j = 0;
					for (var i = 0; i < 64; i++){
						setTimeout(function (i) {
							j = j + 1;
							
							api.writeLine(`_s_h_w_ :: clone ${j} erased`)
							api.writeLine(``) 
	
							if (j === 64){
								callCallback();
							}
						},i * 12 + Math.floor(Math.random() * Math.floor(20)))
					}
				}, 1200)
			};
			var scanNodes = function () {
				api.writeLine(`_simple_homing_worm@@CARAVAN-nodeNet :: preparing to scan nodes...`)
				setTimeout(function () {
					api.writeLine(`_simple_homing_worm@@CARAVAN-nodeNet :: scanning nodes...`)
					var number = 0
					var number2 = 0
					var terminate = false;
					var j = 0;
					for (var i = 0; i < 113; i++){
					
						setTimeout(function () {
							if (terminate){
								return;
							}
							if (number2 === 1){
								chaseMatch();
								terminate = true;
								return;
							}
							number = number + Math.floor(Math.random() * Math.floor(10000))
							j = j + 1;
							
							if (j === 111) {
								number2 = 1;
							}
							api.writeLine(`${number} kb scanned... ${number2} matching addresses`)
							api.writeLine("") 	
						},i * 25 + Math.floor(Math.random() * Math.floor(15)))
					}
				}, 1000)
			}
			api.writeLine("")
			var activeNode = api.getActiveNode();
			console.log(activeNode)
			var returnable = activeNode._meta._meta.nodeNets.__caravan["caravan_entrance"]
			this.cache = returnable
		},
	},
	commands : {
		deploy : {
			name : 'deploy',
			desc : 'tunnel an edge from the active node to CARAVAN-nodeNet',
			syntax : 'mole nomad.mole deploy',
			requiresVerification : true,
			ex : function () {
				//do an animation
				//currentNode.attach(caravan_seed)
				this.methods.use.ex();
				this.api.writeLine(``)
				this.api.lockInput();
				var pass = this
				this.mole.worm.ex(this.api, function (api){
					api.clearUnreservedRows();
					api.writeLine(`nomad.mole :: tunneling to @@CARAVAN-nodeNet.__&(caravan_entrance)`)
					setTimeout(function(){
						var j = 0
						var h = 0
						for (var i = 0; i < api.getMaxLineLength(); i++){
							j = j + 1;
							setTimeout(function(){
								h = h + 1
								var line = (">").repeat(h)
								api.clearUnreservedRows();
								api.writeLine(`nomad.mole :: tunneling to @@CARAVAN-nodeNet.__&(caravan_entrance)`)
								api.writeLine("");
								api.writeLine("");
								api.writeLine(line)
								api.writeLine("");
								api.writeLine("");

								if (h === api.getMaxLineLength()){
									setTimeout(function(){
										api.writeLine(`nomad.mole :: tunnel to @@CARAVAN-nodeNet.__&(caravan_entrance) completed`)
										api.writeLine("")
										api.writeLine(`nomad.mole :: deployment successful`)
										api.writeLine("")
										api.unlockInput();
										api.getActiveNode().attach(pass.mole.worm.cache);
										api.getActiveNode().assembleVisibleAdjacencies();
										api.assembleAccessibleNodes()
									},1150)
								};

							}, j*50 - Math.floor(Math.random()*j*3))
						}
					}, 200);
					
				});
			}

		}
	},
	data : {
		version_info : 'LITE.mole v.1.5.24',
		mole_class : `Bound Linkage Mole <=> _simple_homing_worm@@CARAVAN-nodeNet`,
		boundWorm :`_simple_homing_worm@@CARAVAN-nodeNet`,
		operation_complexity : 'basic',
		read_this : 'nomad.mole is included with all distributions of moleSeed after v.0.8.00. Since v.1.0.00, nomad.mole is bundled with a worm targeted on CARAVAN-nodeNet. The mole-ware/worm bundle will tunnel a one-way edge to CARAVAN-nodeNet from any vacant node with use of the nomad.mole "deploy" syntax. '



	},
	initialize : function (mole) {
		console.log(mole)
		mole.moleCommands.deploy = this.commands.deploy

	},
	prep : function () {

	},
};
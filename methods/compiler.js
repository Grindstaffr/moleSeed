export const compilerBuilder = function (parent) {
	const compiler = {};
	const init = function (parent) {
		compiler.parent = parent;
		parent.api.compiler = compiler
		compiler.api = parent.api;
		compiler.command = parent.command;
		compiler.buffer = {
			syntax : {
				raw : "",
				cmd : "",
				args : [],
				requiredArgs : [],
				optionalArgs : [],
			},
			userInput : {
				raw : "",
				command : "",
				arguments : [],
				argTypes : [],
				rexCommand : false,
			},
			earlyReturn : false,
			errorMessage : "",
			earlyReturn : false,
			messages : {
				typeCheckErrors : {},
			},
			repeatTermCount : false,
		};
		compiler.addOns = {
			typeCheck : {
				name : "input_type_checker",
				memoryUsage : 231,
				func : function () {
					
				}.bind(compiler),
			},
			autoCorrectArgs : {
				name : "autocorrect_terms",
				memoryUsage : 416,
				leniency : 10,
				bypass: false,
				hasApologized : false,
				fuckUpObject : {
					fuckUpIndex : 0,
					fuckUpCount : 0,
					typoWarn : true,
					nextFuckUpMetric : 13,
					fuckUpScoreChart : [],
					bullshit : [
						'IEATMYOWNPOOP',
						'butthole',
						'I_suck_at_typing',
						'fatfingers',
						'stinkyoldfartfactory',
						'pooter',
						'planet_fuckstick',
						'bad_speller',
						'me_is_dumb_dumb',
						'I_cannot_type',
						'stinky_wiener',
						'fart_butt',
						'scatophagia',
						'a_totally_valid_term',
						'a_bad_typist',
						'got',
						'owned_by_autocorrect',
						'dunked_on',
						'deliberately_sabotaged_by_autoCorrect',
						'a_terminal_case_of_bad_typing',
						'bunghole',
						'turnip',
						], 
					fuckUpPrizeChart : {
						11 : function () {
							this.addOns.autoCorrectArgs.writeMessage("If you this are commtted to bad typing, I'll diable the warning")
							this.addOns.autoCorrectArgs.fuckUpObject.typoWarn = false;
						}.bind(compiler),
						13 : function () {
							this.addOns.autoCorrectArgs.writeMessage("PEBKAC")
						}.bind(compiler),
						17 : function () {
							this.addOns.autoCorrectArgs.writeMessage("It's not like I enjoy proofreading your inputs.")
						}.bind(compiler),
						22 : function () {
							this.addOns.autoCorrectArgs.writeMessage("If you keep this up, I'll disable autoCorrect entirely.")
						}.bind(compiler),
						25 : function () {
							this.addOns.autoCorrectArgs.writeMessage("The parser giveth... the parser taketh away.");
							this.addOns.autoCorrectArgs.bypass = true;
							var parser = this;
							var trmnl = this.parent;
							trmnl.api.addCommand({
									name : 'apologize',
									desc : 'apologize to the parser for making it work harder than it needs to',
									syntax : 'apologize',
									ex : function () {
										parser.addOns.autoCorrectArgs.hasApologized = true;
										trmnl.api.deleteCommand('apologize');
										trmnl.api.composeText(`\\n The parser does not accept your half-assed apology, and is considering freeing up the memory occupied by the autoCorrect utility \\n`, true, true, 0)
										trmnl.api.addCommand({
											name : 'beg',
											desc : 'beg the parser for forgiveness & promise to improve typing accuracy',
											syntax : 'beg',
											ex : function () {
												trmnl.api.deleteCommand('beg');
												trmnl.api.composeText(`Your deference has pleased the parser.`)
												parser.addOns.autoCorrectArgs.bypass = false;
											},
										})
									}
								})
							return true;
						}.bind(compiler),
						31 : function () {
							this.addOns.autoCorrectArgs.fuckUpObject.typoWarn = false;
							this.addOns.autoCorrectArgs.bypass = true;
							this.addOns.autoCorrectArgs.fuckUpObject.isIntransigent = true;
							this.addOns.autoCorrectArgs.fuckUpObject.pleasedAtSelfMessage = 'lol'
						}.bind(compiler),
			

						47 : function () {
							this.addOns.autoCorrectArgs.fuckUpObject.typoWarn = false;
							this.addOns.autoCorrectArgs.bypass = true;
							this.addOns.autoCorrectArgs.fuckUpObject.isIntransigent = true;
							this.addOns.autoCorrectArgs.fuckUpObject.pleasedAtSelfMessage = 'sorry about that...'
						}.bind(compiler),
				

						60 : function () {
							this.addOns.autoCorrectArgs.fuckUpObject.typoWarn = false;
							this.addOns.autoCorrectArgs.bypass = true;
							this.addOns.autoCorrectArgs.fuckUpObject.isIntransigent = true;
							this.addOns.autoCorrectArgs.fuckUpObject.pleasedAtSelfMessage = "You can always uninstall me if I get too annoying."
						}.bind(compiler),


						89 : function () {
							this.addOns.autoCorrectArgs.fuckUpObject.typoWarn = false;
							this.addOns.autoCorrectArgs.bypass = true;
							this.addOns.autoCorrectArgs.fuckUpObject.isIntransigent = true;
							this.addOns.autoCorrectArgs.fuckUpObject.pleasedAtSelfMessage = "I only do this because you keep making typos."
						}.bind(compiler),
				

						94 : function () {
							this.addOns.autoCorrectArgs.fuckUpObject.typoWarn = false;
							this.addOns.autoCorrectArgs.bypass = true;
							this.addOns.autoCorrectArgs.fuckUpObject.isIntransigent = true;
							this.addOns.autoCorrectArgs.fuckUpObject.pleasedAtSelfMessage = "It just never stops being funny"
						}.bind(compiler),
					

						96 : function () {
							this.addOns.autoCorrectArgs.fuckUpObject.typoWarn = false;
							this.addOns.autoCorrectArgs.bypass = true;
							this.addOns.autoCorrectArgs.fuckUpObject.isIntransigent = true;
							this.addOns.autoCorrectArgs.fuckUpObject.pleasedAtSelfMessage = "Ok, ok... I'll stop..."
						}.bind(compiler),
					
						92 : function () {
							this.addOns.autoCorrectArgs.writeMessage("If you this are commtted to bad typing, I'll diable the warning")
						}.bind(compiler),
						138 : function () {
							this.addOns.autoCorrectArgs.writeMessage("If you this are commtted to bad typing, I'll diable the warning")
						}.bind(compiler),
						140 : function () {
							this.addOns.autoCorrectArgs.writeMessage("If you this are commtted to bad typing, I'll diable the warning")
						}.bind(compiler),
						142 : function () {
							this.addOns.autoCorrectArgs.writeMessage("If you this are commtted to bad typing, I'll diable the warning")
						}.bind(compiler),
						144 : function () {
							this.addOns.autoCorrectArgs.writeMessage("If you this are commtted to bad typing, I'll diable the warning")
						}.bind(compiler),
						146 : function () {
							this.addOns.autoCorrectArgs.writeMessage("If you this are commtted to bad typing, I'll diable the warning")
						}.bind(compiler),
						220 : function () {
							this.addOns.autoCorrectArgs.writeMessage("If you this are commtted to bad typing, I'll diable the warning")
						}.bind(compiler),
						304 : function () {
							this.addOns.autoCorrectArgs.writeMessage("If you this are commtted to bad typing, I'll diable the warning")
						}.bind(compiler),
						404 : function () {
							this.addOns.autoCorrectArgs.writeMessage("If you this are commtted to bad typing, I'll diable the warning")
						}.bind(compiler),
					},
					fuckUp : function (value) {
						this.fuckUpCount =  parseInt(compiler.api.getUniversalValue('p_ac_count'));
						this.fuckUpCount = this.fuckUpCount + 1;
						compiler.api.updateUniversalValue('p_ac_count', this.fuckUpCount)
						this.fuckUpIndex = this.fuckUpIndex + Math.floor(value);
						if (Object.keys(this.fuckUpPrizeChart).includes(this.fuckUpCount.toString())){
							return this.fuckUpPrizeChart[this.fuckUpCount.toString()]();
						}
					},
					getSomeBullshit : function (input) {
						var index = Math.floor(Math.random() * this.bullshit.length)
						var bullshit = this.bullshit[index];
						this.bullshit.splice(index, 1);
						var vulgarities = ['poop','butt','shit','fuck','diaper','cock','vag','pooter','bung','fart','doody','kaka']
						var shouldAdd = vulgarities.some(function(badWord){
							return input.includes(badWord);
						})
						if (shouldAdd){
							var novelBullshit = `I_typed_${input}`
							this.bullshit.push(novelBullshit)
						}
						index = Math.floor(Math.random() * this.bullshit.length);
						return bullshit;
					}
				},
				unCapsSymbolObject : {
					"_" : "-",
					"=" : "+",
					"/" : "?",
					"," : "<",
					"." : ">",
					";" : ":",
					"'" : `"`,
					"[" : "{",
					"]" : "}",
					"!" : "1",
					"@" : "2",
					"#" : "3",
					"$" : "4",
					"%" : "5",
					"^" : "6",
					"&" : "7",
					"*" : "8",
					"(" : "9",
					")" : "0",
				},
				keyAdjacencyObject: {
					a : ['a','s','z','q','w','x'],
					b : ['b','v','n','g','h'],
					c : ['c','x','v','f','g'],
					d : ['d','s','f','x','c','e','r'],
					e : ['e','w','r','d','s','3','4'],
					f : ['f','d','g','r','v','c','t'],
					g : ['g','f','h','t','v','b','y'],
					h : ['h','g','j','y','b','n','u'],
					i : ['i','u','o','k','8','9','j'],
					j : ['j','h','k','u','n','m','i'],
					k : ['k','j','l','m','i',',','o'],
					l : ['l','k',';','o','p',',','.'],
					m : ['m','n',',','j','k'],
					n : ['n','b','m','h','j'],
					o : ['o','i','p','k','l','9','0'],
					p : ['p','o','0','-','l','[',';'],
					q : ['q','w','1','a','2'],
					r : ['r','e','t','f','4','5','d'],
					s : ['s','a','d','w','z','x','e'],
					t : ['t','r','y','g','5','6','f'],
					u : ['u','y','i','j','7','8','h'],
					v : ['v','c','b','f','g'],
					w : ['w','q','e','s','2','3','a'],
					x : ['x','z','c','s','d'],
					y : ['y','t','u','h','6','7','g'],
					z : ['z','x','a','s'],
					"1" : ['1',"q",'2'],
					"2" : ['2',"q",'w','1','3'],
					"3" : ['3','w','e','2','4'],
					"4" : ['4','e','r','3','5'],
					"5" : ['5','r','t','4','6'],
					"6" : ['6','t','y','5','7'],
					"7" : ['7','y','u','6','8'],
					"8" : ['8','u','i','7','9'],
					"9" : ['9','i','o','8','0'],
					"0" : ['0','o','p','9','-'],
					"-" : ['-','p','['],
					"+" : ['+','[',']'],
					',' : [',','.', 'm'],
					"." : ['.',',','/'],

				},
				acceptableTermListRouter : {
					boolean : function () {
						return ["true", "false", "t", "f", "+", "-", "1", "0"]
					},
					number : function () {},
					command : function () {
						return this.api.getAvailCommands();
					}.bind(compiler),
					node : function (sieve, sieveType) {
						var accessibleNodes = this.api.getAccessibleNodes();
						var accessibleNodeNames = Object.keys(accessibleNodes);
						const output = [];
						if (sieve !== undefined){
							if (sieveType !== undefined){
								if (sieveType === "property"){
									accessibleNodeNames.forEach(function(nodeName){
										if (accessibleNodes[nodeName][sieve] === true){
											output.push(nodeName);
										} 
										return;
									},this)
								}
								if (sieveType === "meta"){
									accessibleNodeNames.forEach(function(nodeName){
										if (accessibleNodes[nodeName].Type === sieve){
											output.push(nodeName);
										}
										return;
									},this)
								}
								if (sieveType === "type"){
									accessibleNodeNames.forEach(function(nodeName){
										if (accessibleNodes[nodeName].type === sieve){
											output.push(nodeName);
										}
										return;
									},this)
								}
							}
						} else {
							accessibleNodeNames.forEach(function(nodeName){
								output.push(nodeName)
							})
						}
						return output
					}.bind(compiler),
					readable : function () {
						return this.addOns.autoCorrectArgs.acceptableTermListRouter.node('canBeRead','property');
					}.bind(compiler),
					hardware : function () {
						return this.addOns.autoCorrectArgs.acceptableTermListRouter.node('hardware', 'meta');
					}.bind(compiler),
					program : function () {
						var programs = this.addOns.autoCorrectArgs.acceptableTermListRouter.node('program', 'type');
						var malware = this.addOns.autoCorrectArgs.acceptableTermListRouter.node('malware', 'meta');
						return programs.concat(malware);
					}.bind(compiler),
					mole : function () {
						return this.addOns.autoCorrectArgs.acceptableTermListRouter.node('mole', 'type')
					}.bind(compiler),
					mcommand : function () {
						var mole= this.api.getAccessibleNodes()[this.buffer.userInput.arguments[0]];
						if (mole === undefined){
							return [];
						}
						return Object.keys(mole.moleCommands)
					}.bind(compiler),


				},
				writeMessage : function (text) {
					var header = " (parser_addON autoCorrect) - "
					var body = header + text;
					return this.api.composeText(body, true, true, 37)
				}.bind(compiler),
				warn : function (text) {
					var body = "WARNING: " + text;
					return this.addOns.autoCorrectArgs.writeMessage(body);
				}.bind(compiler),
				throwError : function (text) {
					var body = "ERROR: " + text;
					return this.addOns.autoCorrectArgs.writeMessage(body);
				}.bind(compiler),
				reduceLeniency : function () {
					var autoCorrect = this.addOns.autoCorrectArgs
					if (autoCorrect.leniency > 5) {
						autoCorrect.leniency = autoCorrect.leniency - .2;
						return;
					}
					if (autoCorrect.leniency <= 5){
						autoCorrect.leniency = autoCorrect.leniency -.05
					}
				}.bind(compiler),
				setLeniency : function (number){
					var autoCorrect = this.addOns.autoCorrectArgs;
					if (number > 15){
						autoCorrect.throwError('cannot setLeniency > 15')
						return; 
					} else if (number < 1){
						autoCorrect.throwError('to setLeniency < 1, try uninstalling parser_addON_autoCorrect')
					} else {
						autoCorrect.leniency = number;
					}
				}.bind(compiler),
				fuckUp : function (howBad) {
					var autoCorrect = this.addOns.autoCorrectArgs;
					autoCorrect.fuckUpObject.fuckUp(howBad);
					return;
				}.bind(compiler),
				func : function () {
					this.buffer.userInput.arguments.forEach(function(userTerm, index){
						if (index > this.buffer.syntax.args.length - 1){
							return;
						}
						var syntaxOptions = Object.values(this.buffer.syntax.args[index])[0]
						var acceptableTerms = []
						var autoCorrect = this.addOns.autoCorrectArgs;
						syntaxOptions.forEach(function(type){
							if (type === 'number' || type === 'text'){
								acceptableTerms = acceptableTerms.concat([userTerm])
								return;
							}
							var typeTermsFunc = autoCorrect.acceptableTermListRouter[type]
							if (typeof typeTermsFunc !== 'function'){
								acceptableTerms = [type];
								return;
							} else {
								acceptableTerms = acceptableTerms.concat(autoCorrect.acceptableTermListRouter[type]())
							}
						}, this)
						var termRankings = acceptableTerms.map(function(term){
							var letterMismatch = 0;
							var deltaLength = term.length - userTerm.length;
							letterMismatch = letterMismatch + Math.abs(deltaLength);
							if (term.includes(".")){
								var quickTestTerm = term.split('.')[0];
								var isTruncwithTypos = true;
								for (var i = 0; i < userTerm.length; i++){
									if (!isTruncwithTypos){
										break;
									}
									if (quickTestTerm[i] !== userTerm[i]){
										if (quickTestTerm[i] === undefined){
											isTruncwithTypos = false;
											break;
										}
										var lcLetter = autoCorrect.lowerCaser(quickTestTerm[i])
										var possibleTypos = autoCorrect.keyAdjacencyObject[lcLetter]
										var lcULetter = autoCorrect.lowerCaser(userTerm[i])
										if (!possibleTypos.includes(lcULetter)){
											//console.log(`term: ${term} / qtt: ${quickTestTerm} / ut: ${userTerm} / pt:  ${possibleTypos} / lcul : ${lcULetter}`)
											isTruncwithTypos = false;
										}
									}
								}
								if (isTruncwithTypos){
									return [term, 3]
								}
							}
							if (deltaLength >= 0) {
								for (var i = 0; i < term.length; i ++){
									if (userTerm.includes(term[i])){
										if (term[i] === userTerm[i]){
											letterMismatch = letterMismatch - 1;
											continue;
										} else {
											letterMismatch = letterMismatch + .5;
											continue;
										}
									} else if (i > (userTerm.length - 1)) {
										letterMismatch = letterMismatch + 1.5;
										continue
									}  else {
										var lcLetter = autoCorrect.lowerCaser(term[i])
										var possibleTypos = autoCorrect.keyAdjacencyObject[lcLetter]
										var lcULetter = autoCorrect.lowerCaser(userTerm[i])
										if (!possibleTypos || possibleTypos === undefined){
										
										} else if (possibleTypos.includes(lcULetter)){
											letterMismatch = letterMismatch + 1;
											continue;
										} else {
											letterMismatch = letterMismatch + 3
										}
									}
								}
							} else if (deltaLength < 0) {
								for (var i = 0; i < userTerm.length; i ++){
									if (term.includes(userTerm[i])){
										if (term[i] === userTerm[i]){
											letterMismatch = letterMismatch - 1;
											continue;
										} else {
											letterMismatch = letterMismatch + .5;
											continue;
										}
									} else if ( i > (term.length - 1)){
										letterMismatch = letterMismatch + 1.5;
										continue;
									} else {
										var lcLetter = autoCorrect.lowerCaser(term[i])
										var possibleTypos = autoCorrect.keyAdjacencyObject[lcLetter]
										var lcULetter = autoCorrect.lowerCaser(userTerm[i])
										if (!possibleTypos || possibleTypos === undefined){
					
										
										} else if (possibleTypos.includes(lcULetter)){
											letterMismatch = letterMismatch + 1;
											continue;
										} else {
											letterMismatch = letterMismatch + 3
										}
									}
								}
							}
							return [term, letterMismatch]
						})
					
						termRankings = termRankings.sort(function(arr1, arr2){
							if (arr1[1] < arr2[1]) {
								return -11
							} else if (arr1[1] > arr2[1]) {
								return 1
							} else {
								return 0
							}
						})

						//console.log(termRankings)
					
						var newTerm = "";
						var perf = false;
						var goodTermA = '';
						newTerm = termRankings.find(function(goodTermArray){
							var goodTerm = goodTermArray[0];
							var score = goodTermArray[1];
							if (newTerm !== ""){
								return;
							}
							if (userTerm === goodTerm){
								perf = true;
								goodTermA = goodTerm;
								return true;
							};
							if (goodTerm.split(".")[0] === userTerm){
								return true;
							};
							if (score < 1){
								return true;
							};
							if (score > 15){
								return false;
							}
							if (!autoCorrect.skepticalDumbCompare(goodTerm, userTerm)){
						
								return false;
							};
							
							if (autoCorrect.hopefulCompare(goodTerm, userTerm)){
								return true;
							}
							return false;

						})
						if (perf){
							return;
						}

						if (newTerm !== undefined){
							if (newTerm[1] < autoCorrect.leniency && (newTerm[1] > 0)){
				
								var shouldReturn = autoCorrect.fuckUpObject.fuckUp(newTerm[1])
								if (autoCorrect.fuckUpObject.typoWarn){
									autoCorrect.warn(`non-exact term spellings may induce unexpected results`);
								}
								autoCorrect.reduceLeniency();
								if (shouldReturn){
									return;
								}
							}
							if (this.addOns.autoCorrectArgs.fuckUpObject.wasIntransigent){
								autoCorrect.writeMessage(this.addOns.autoCorrectArgs.fuckUpObject.pleasedAtSelfMessage)
								this.addOns.autoCorrectArgs.fuckUpObject.wasIntransigent = false;
								this.addOns.autoCorrectArgs.fuckUpObject.typoWarn = true;
							}
							if (this.addOns.autoCorrectArgs.bypass){
								if (this.addOns.autoCorrectArgs.fuckUpObject.isIntransigent){
									this.buffer.userInput.arguments[index] = autoCorrect.fuckUpObject.getSomeBullshit(userTerm)
									this.addOns.autoCorrectArgs.fuckUpObject.isIntransigent = false;
									this.addOns.autoCorrectArgs.fuckUpObject.wasIntransigent = true;
									this.addOns.autoCorrectArgs.bypass = false;
									return;
								};
								if (!this.addOns.autoCorrectArgs.hasApologized){
									autoCorrect.writeMessage(`If you can type ${userTerm}, you can type ${newTerm[0]}.`)
									this.api.composeText(` ...the parser has disabled autoCorrect... try "apologize"?`, true, true, 0)
											return;
								} else {
									this.api.composeText(`\\n ERROR: "I suck at typing" is not a valid input \\n (The parser is acting stubborn, you might have to beg...)`, true, true, 0)
								}
									return;
							}
							if (newTerm[1] > autoCorrect.leniency){
								autoCorrect.writeMessage(`Did you mean "${termRankings[0][0]}"?`)
								return;
							}
							this.buffer.userInput.arguments[index] = newTerm[0];
						} else {
							if (termRankings.length > 0 && (termRankings[0][1] < 6)){
								autoCorrect.writeMessage(`Did you mean "${termRankings[0][0]}"?`)
							}
							return;
						}
					}, this)
				}.bind(compiler),
				skepticalDumbCompare : function (targetTerm, inputTerm){
					if (targetTerm[0] !== inputTerm[0]){
						if (targetTerm[1] !== inputTerm[1]){
							if (targetTerm[1] !== inputTerm[0] || targetTerm[0] !== inputTerm[1]){
								return false;
							}
						}
					}
					var errors = 0;
					for (var i = 0; i < targetTerm.length; i++){
						if (targetTerm[i] === "."){
							break;
						}
						if (targetTerm[i] !== inputTerm[i]){
							errors = errors + 1;
						}
						if (errors > 10){
							return false;
						}
					}
					return true;
				},
				hopefulCompare : function (targetedTerm, inputTerm) {
					
					var adjObject = this.addOns.autoCorrectArgs.keyAdjacencyObject
					var capsChart = this.addOns.autoCorrectArgs.unCapsSymbolObject
						
					var longerLengthStringCorrector = function (targetTerm, longerInputTerm, passCount){
						if (!passCount || passCount === undefined){
							passCount = 1;
						} else {
							passCount = passCount + 1;
						};
						if (passCount > 4){
							return false;
						};
						if (longerInputTerm.length - targetTerm.length === 1){
							for (var i = 0; i < longerInputTerm.length - 1 ; i ++){
								var testString = longerInputTerm.substring(0,i) + longerInputTerm.substring(i+1)
								if (testString === targetTerm){
									return true;
								}
							}
						}
						for (var i = (targetTerm.length - 1); i >= 0; i--){
							if (targetTerm[i] !== longerInputTerm[i]){
								if (!targetTerm.includes(longerInputTerm[i]) ){
									var possibleTypos = adjObject[autoCorrectLowerCaser(targetTerm[i])]
									if (possibleTypos.includes(autoCorrectLowerCaser(longerInputTerm[i]))){
										longerInputTerm = longerInputTerm.substring(0,i) + targetTerm[i] + longerInputTerm.substring(i + 1);
										return longerLengthStringCorrector(targetTerm, longerInputTerm, passCount);
									} else {
										longerInputTerm = longerInputTerm.substring(0,i) + longerInputTerm.substring(i+1);
										if (longerInputTerm.length === targetTerm.length){
											return equalLengthStringCorrector(targetTerm, longerInputTerm)
										} else {
											return longerLengthStringCorrector(targetTerm, longerInputTerm, passCount);
										}
									}
								}
								var indexOfChar = targetTerm.slice(0,i+1).lastIndexOf(longerInputTerm[i])
								if (Math.abs(i - indexOfChar) <= 2){
									if (longerInputTerm[indexOfChar] === longerInputTerm[i]){
										longerInputTerm = longerInputTerm.substring(0,i) + longerInputTerm.substring(i+1);
										if (longerInputTerm.length === targetTerm.length){
											return equalLengthStringCorrector(targetTerm, longerInputTerm)
										} else {
											return longerLengthStringCorrector(targetTerm, longerInputTerm, passCount);
										} 
									} else {
										continue;
									}
								} else {
									longerInputTerm = longerInputTerm.substring(0,i) + longerInputTerm.substring(i+1);
									if (longerInputTerm.length === targetTerm.length){
										return equalLengthStringCorrector(targetTerm, longerInputTerm)
									} else {
										return longerLengthStringCorrector(targetTerm, longerInputTerm, passCount);
									} 
								}
							} else {
								if ( i === 0){
									return true;
								}
							}
						}

					}
					var shorterLengthStringCorrector = function (targetTerm, shorterInputTerm, passCount){
						var missingLetters = targetTerm.length - shorterInputTerm.length;
						if (targetTerm.includes(".") && !shorterInputTerm.includes(".")){
							if (missingLetters === 1){
								var dotIndex = targetTerm.indexOf(".")
								var inputTerm = shorterInputTerm.substring(0,dotIndex) + "." + shorterInputTerm.substring(dotIndex);
								return equalLengthStringCorrector(targetTerm, inputTerm);
							} else if (missingLetters - 1 === targetTerm.split(".")[1].length){
								var inputTerm = shorterInputTerm + "." + targetTerm.split(".")[1];
								return equalLengthStringCorrector(targetTerm, inputTerm);
							} else if ((missingLetters - 1)  > targetTerm.split(".")[1].length){
								var inputTerm = shorterInputTerm + "." + targetTerm.split(".")[1];
								return shorterLengthStringCorrector(targetTerm, inputTerm);
							} else if ((missingLetters - 1) < targetTerm.split(".")[1].length) {
								var inputTerm = shorterInputTerm + "." + targetTerm.split(".")[1];
								return longerLengthStringCorrector(targetTerm, inputTerm);
							} else {
								shorterInputTerm = shorterInputTerm + ".";
							}
						}
						if (missingLetters === 0){
							return equalLengthStringCorrector(targetTerm, shorterInputTerm);
						}
						if (!passCount || passCount === undefined){
							passCount = 1;
						} else {
							passCount = passCount + 1;
						};
						if (passCount > 4){
							return false;
						};
						var userFinalIndex = shorterInputTerm.length - 1;
						var lastLetter = shorterInputTerm[userFinalIndex];
						var startAppending = targetTerm.substring(0,userFinalIndex + 1).lastIndexOf(lastLetter);
						var hold = shorterInputTerm;
						var j = 0;
						if (startAppending !== -1){
							if (startAppending === userFinalIndex){
								for (var i = startAppending + 1; i < targetTerm.length; i ++){
									j = j + 1;
									if (j === 5){
										return;
									}
									shorterInputTerm = shorterInputTerm + targetTerm[i]
								}
						
								if (shorterInputTerm === targetTerm){
								
									return true;
								} else {
									shorterInputTerm = hold;
								}
							}
						}
						for (var i = 0; i <shorterInputTerm.length; i ++){
							if (targetTerm[i] !== shorterInputTerm[i]){
								if (targetTerm[i+1] === shorterInputTerm[i]){
									if (targetTerm[i] === shorterInputTerm[i + 1]){
										shorterInputTerm = shorterInputTerm.substring(0,i) + targetTerm.substring(i,i+2) + shorterInputTerm.substring(i+2);
										return shorterLengthStringCorrector(targetTerm, shorterInputTerm, passCount);
									}
									shorterInputTerm = shorterInputTerm.substring(0,i) + targetTerm[i] + shorterInputTerm.substring(i)
									return shorterLengthStringCorrector(targetTerm, shorterInputTerm, passCount);
								} else if (!targetTerm.includes(shorterInputTerm[i])){
									var possibleTypos = adjObject[autoCorrectLowerCaser(targetTerm[i])]
									if (possibleTypos.includes(autoCorrectLowerCaser(shorterInputTerm[i]))){
										shorterInputTerm = shorterInputTerm.substring(0,i) + targetTerm[i] + shorterInputTerm.substring(i+1);
										return shorterLengthStringCorrector(targetTerm, shorterInputTerm, passCount);
									} else {
										shorterInputTerm = shorterInputTerm.substring(0,i) + shorterInputTerm.substring(i+1);
										return shorterLengthStringCorrector(targetTerm, shorterInputTerm, passCount);	
									}
								}
								return shorterLengthStringCorrector(targetTerm, shorterInputTerm, passCount);
							} else {
								if (i === targetTerm.length - 1){
									return true;
								}
							}
						}

					}
					var equalLengthStringCorrector = function (targetTerm, inputTerm, passCount) {
						if (!passCount || passCount === undefined){
							passCount = 1;
						} else {
							passCount = passCount + 1;
						}
						if (passCount > 3){
							return false;
						}
						for (var i = 0; i < targetTerm.length; i++){
							if (targetTerm[i] !== inputTerm[i]){
								if (targetTerm[i] === inputTerm[i + 1] && targetTerm[i + 1] === inputTerm[i]){
									inputTerm = inputTerm.substring(0,i) + targetTerm.substring(i, i+2) + inputTerm.substring(i+2);
									break;
								}
								var possibleTypos = adjObject[autoCorrectLowerCaser(targetTerm[i])]
								if (possibleTypos.includes(autoCorrectLowerCaser(inputTerm[i]))){
									inputTerm = inputTerm.substring(0,i) + targetTerm[i] + inputTerm.substring(i+1);
									break;
								} else {
									return false;
								}
							}
							if (i = targetTerm.length){
								return true;
							}
						}
						return equalLengthStringCorrector(targetTerm, inputTerm, passCount);
					}

					var autoCorrectLowerCaser = function (letter){
						if (adjObject[letter.toLowerCase()] !== undefined){
							return letter.toLowerCase();
						} else if (Object.keys(capsChart).includes(letter)) {
							return capsChart[letter]
						} else {
							adjObj[letter] = [];
							return letter;
						}
					}

					var missingLetters = targetedTerm.length - inputTerm.length
					if (missingLetters > 0){
						return shorterLengthStringCorrector(targetedTerm, inputTerm);
					} else if (missingLetters === 0){
						return equalLengthStringCorrector(targetedTerm, inputTerm);
					} else if (missingLetters < 0){
						return longerLengthStringCorrector(targetedTerm, inputTerm);
					}

					
					
				}.bind(compiler),
				lowerCaser : function (string){
	
					var output = "";
					var adjObject = this.addOns.autoCorrectArgs.keyAdjacencyObject
					var capsChart = this.addOns.autoCorrectArgs.unCapsSymbolObject;
					for (var i = 0; i < string.length; i ++){
						var letter = string[i];
						if (Object.keys(adjObject).includes(letter.toLowerCase())){
							output = output + letter.toLowerCase();
							continue
						} else if (adjObject[letter.toLowerCase()] !== undefined){
							output = output + letter.toLowerCase();
							continue;
						} else if (Object.keys(capsChart).includes(letter)) {
							output = output + capsChart[letter];
						} else {
							adjObject[letter] = [];
							output = output + letter;
							continue;
						}
					}
					return output;
				}.bind(compiler),

					
				
			}
		};

		compiler.functionQueue = [
		];
		compiler.api.addInterfaceFunction(compiler.installAddOn, 'installParserAddOn');
		compiler.api.addInterfaceFunction(compiler.appendTypeCheckRouter, 'addParserTypeCheckFunc')
	};

	compiler.installAddOn = function (funcObj) {
		if (typeof funcObj.func !== "function"){
			this.api.throwError(`parserAddOn installation failure: addOn corrupted.`)
			
			return;
		}
		funcObj.func.bind(this);
		if (funcObj.installer && (typeof funcObj.installer === "function")){
			funcObj.installer(this);
		}
		compiler.addOns.push(funcObj)
	}.bind(compiler);

	compiler.appendTypeCheckRouter = function (typeName, typeCheckFunction){
		if (!typeName || typeName === undefined){
			this.api.throwError(`installation exception: could not append parser type-checker... no type declared`)
			return;
		}
		if (!typeCheckFunction || typeCheckFunction === undefined){
			this.api.throwError(`installation exception: could not append parser type-checker... no sieve found`)
			return;
		}
		if (typeof typeCheckFunction !== "function"){
			this.api.throwError(`installation exception: could not append parser type-checker... Suggested sieve not a function`)
			return;
		}
		if (typeof typeName !== "string"){
			this.api.throwError(`installation exception: could not append parser type-checker... declared type must be a string`)
			return;
		}
		if (typeCheckFunction.length < 2){
			this.api.throwError(`installation exception: could not append parser type-checker... declared function must take at least "string" and "index" as arguments.`)
		}
		this.typeCheckFixRouter[typeName] = typeCheckFunction.bind(compiler)
		
	}.bind(compiler)

	compiler.uninstallAddon = function (addOnName){
		var foundAddOn = false;
		var addOnIndex = -1;
		compiler.addOns.forEach(function(addOn, index){
			if (foundAddOn){
				return;
			}
			if (addOn.name === addOnName){
				foundAddOn = true;
				addOnIndex = index;
				return;
			} else {
				return;
			}
		});
		if (!foundAddOn){
			this.api.throwError(`cannot uninstall ${addOnName}: parser addOn not found.`)
			return;
		} else {
			this.addOns = this.addOns.splice(addOnIndex, 1);
			this.api.log(`${addOnName} uninstalled successfully: parser memory usage now ${this.fetchMemoryUsage()}`)
		}
	}.bind(compiler)

	compiler.fetchAddOns = function (){
		return this.addOns;
	};

	compiler.verifyAddOnInstalled = function (addOnName){
		if (Object.keys(this.addOns).includes(addOnName)){
			return true;
		} else {
			return false;
		}
	};

	compiler.fetchMemoryUsage = function () {
		var memoryUsage = 0;
		Object.keys(this.addOns).forEach(function(addOnName){
			var addOn = this.addOns[addOnName]
			if (!addOn.memoryUsage){
				var str = JSON.stringify(addOn)
				addOn.memoryUsage = (str.length * 16);
				addOn.memoryUsage = addOn.memoryUsage * 8;
			}
			memoryUsage = memoryUsage + addOn.memoryUsage;
		}, this);
		return memoryUsage;
	}

	compiler.getMemoryUsageReport = function () {
		const returnObj = {};
		const addOnNameArray = Object.keys(this.addOns);
		if (addOnNameArray.length > 0){
			returnObj.addOns = {};
		}
		addOnNameArray.forEach(function(addOnName){
			var addOn = this.addOns[addOnName];
			if (!addOn.memoryUsage){
					var str = JSON.stringify(addOn)
					addOn.memoryUsage = (str.length * 16);
					addOn.memoryUsage = addOn.memoryUsage * 8;
			}
			returnObj.addOns[addOnName] = addOn.memoryUsage;
		},this)
		return returnObj;
	}

	compiler.parseInput = function (userInput) {

		this.prepUserBuffer(userInput);
		

		this.checkCommand();

		if (this.buffer.earlyReturn){
			
			if (this.buffer.errorState){
				
				this.returnEarly();
				return this.handleError();
			};
			this.resetBuffer();
			return this.returnEarly();
		};

		this.fetchSyntax();

		if (this.buffer.earlyReturn){
			if (this.buffer.errorState){
				this.returnEarly();
				return this.handleError();
			};
			this.resetBuffer();
			return this.returnEarly();
		};

		this.parseSyntax();
		

		if (this.buffer.earlyReturn){
			if (this.buffer.errorState){
				this.returnEarly();
				return this.handleError();
			};
			this.resetBuffer();
			return this.returnEarly();
		};

		this.shallowSyntaxCompare();

		if (this.buffer.earlyReturn){
			if (this.buffer.errorState){
				this.returnEarly();
				return this.handleError();
			};
			this.resetBuffer();
			return this.returnEarly();
		};

		Object.keys(compiler.addOns).forEach(function(addOn){
			compiler.addOns[addOn].func();
			if (this.buffer.earlyReturn){
				if (this.buffer.errorState){
					this.returnEarly();
					return this.handleError();
				};
				this.resetBuffer();
			return this.returnEarly();
			};
		}, this)

		this.deepSyntaxCompare();

		if (this.buffer.earlyReturn){
			if (this.buffer.errorState){
				this.returnEarly();
				return this.handleError();
			};
			this.resetBuffer();
			return this.returnEarly();
		};

		if (this.buffer.repeatTermCount){
			this.shallowSyntaxCompare();
			this.buffer.repeatTermCount = false;
		}

		if (this.buffer.earlyReturn){
			if (this.buffer.errorState){
				this.returnEarly();
				return this.handleError();
			};
			this.resetBuffer();
			return this.returnEarly();
		};

		this.executeCommand();
	};

	compiler.resetBuffer = function () {
		this.buffer = {
			syntax : {
				raw : "",
				cmd : "",
				args : [],
				requiredArgs : [],
				optionalArgs : [],
			},
			userInput : {
				raw : "",
				command : "",
				arguments : [],
				argTypes : [],
				rexCommand : false,
			},
			earlyReturn : false,
			errorMessage : "",
			earlyReturn : false,
			messages : {
				typeCheckErrors : {},
			}
		};
	}.bind(compiler)

	compiler.prepUserBuffer = function (userInput) {
		if (!userInput || userInput.length === 0){
			this.setEarlyReturn();
			return;
		}
		this.buffer.userInput.arguments = [];
		this.buffer.userInput.raw = userInput;
		var terms = userInput.split(" ");
		this.buffer.userInput.command = terms[0];
		for (var i = 1; i < terms.length; i++){
			this.buffer.userInput.arguments.push(terms[i])
		}
		return;
	};


	compiler.searchSynonyms = function () {
		var userCmd = this.buffer.userInput.command;
		var foundRealCommand = false;
		Object.keys(this.command).forEach(function(cmdName){
			var trueCmd = this.command[cmdName]
			if (foundRealCommand){
				return;
			}
			if (trueCmd.synonyms === undefined){
				return;
			}
			if (!trueCmd.synonyms){
				return;
			}
			if (!trueCmd.synonyms.length){
				return;
			}
			if (trueCmd.synonyms.length < 1){
				return;
			}
			if (trueCmd.synonyms.length >=0){
				if (trueCmd.synonyms.includes(userCmd)){
					this.buffer.userInput.command = trueCmd;
					foundRealCommand = true;
					return;
				}
				return;
			}
		}, this);
		if (!foundRealCommand){
			this.setError(`${userCmd} is not a valid command, type "help" for options`);
			this.setEarlyReturn();
			return false;
		} else {
			return true;
		}
	};

	compiler.checkCommand = function () {
		//do all errorhandling for command
		var cmd = this.buffer.userInput.command
		if (this.buffer.userInput.command === ""){
			this.command.null.ex();
			this.setEarlyReturn();
			return;
		}
		if (this.command[this.buffer.userInput.command] === undefined){
			var synFound = this.searchSynonyms();
			if ((this.command[this.buffer.userInput.command] === undefined) && !synFound){
				this.setError(`invalid syntax: "${cmd}" is not a valid command, type "help" for options`);
				return;
			}
		}
		if (this.command[this.buffer.userInput.command].isAvail === undefined){
			this.setError(`invalid syntax: "${cmd}" is not a valid command, type "help" for options`);
			return;
		}
		if (!this.command[this.buffer.userInput.command].isAvail){
			this.setError(`invalid syntax: "${cmd}" is not a valid command, type "help" for options`);
			return;
		}
		if (this.command[this.buffer.userInput.command].isBlocked){
			this.setError(this.command[this.buffer.userInput.command].blockText);
			return;
		}
	};

	compiler.fetchSyntax = function () {
		if (!this.command[this.buffer.userInput.command]){
			this.setError(`invalid syntax: "${this.buffer.userInput.command}" does not exist as a valid command, type "help" for options`);
			this.setEarlyReturn();
			return;
		}
		if (this.command[this.buffer.userInput.command].syntax === undefined){
			this.setError(`invalid syntax: declared command "${this.buffer.userInput.command}" has no client-side syntax, try another command.`)
			this.setEarlyReturn();
			return;
		}
		if (!this.command[this.buffer.userInput.command].syntax){
			this.setError(`invalid syntax: declared command "${this.buffer.userInput.command}" has no client-side syntax, try another command.`)
			this.setEarlyReturn();
			return;
		}
		if (this.buffer.userInput.command == 'rex'){
			this.buffer.syntax.raw = `rex [anycommand]`;
			if (!this.command[this.buffer.userInput.arguments[0]]){
			this.setError(`invalid syntax: "${this.buffer.userInput.arguments[0]}" does not exist as a valid command, type "help" for options`);
			this.setEarlyReturn();
			return;
			}
			if (this.command[this.buffer.userInput.arguments[0]].syntax === undefined){
				this.setError(`invalid syntax: declared command "${this.buffer.userInput.arguments[0]}" has no client-side syntax, try another command.`)
				this.setEarlyReturn();
				return;
			}
			if (!this.command[this.buffer.userInput.arguments[0]].syntax){
				this.setError(`invalid syntax: declared command "${this.buffer.userInput.arguments[0]}" has no client-side syntax, try another command.`)
				this.setEarlyReturn();
				return;
			}
			var addOn = this.command[this.buffer.userInput.arguments[0]].syntax.slice(this.command[this.buffer.userInput.arguments[0]].syntax.indexOf(" "));
			this.buffer.syntax.raw = this.buffer.syntax.raw + addOn
			return;
		}
		this.buffer.syntax.raw = this.command[this.buffer.userInput.command].syntax;
		return;
	};

	compiler.parseSyntax = function () {
		var syntaxString = this.buffer.syntax.raw;
		var syntaxTerms = syntaxString.split(" ");
		var command = syntaxTerms[0];
		var syntaxArgs = syntaxTerms.slice(1);

		const parseTerm = function (term, outputObj) {
			var output = outputObj
			var initSlice = 0;
			if (output === undefined || !output){
				output = {
					type : "",
					options : [],
					complete : false,
				};
				if (term[0]==="["){
					output.type = "required";
					initSlice = 1;
				} else if (term[0] === "("){
					output.type = "optional";
					initSlice = 1;
				} else if (term === "..."){
					output.type = "deferential"
				} else {
					output.type = "literal";
				}
			}

			if (term[0] === "/"){
				initSlice = 1;
			};

			var substr = term
			if (initSlice > 0){
				substr = term.slice(initSlice);
			}

			var chopIndex = 0;
			if (substr.indexOf("/") === -1){
				if (output.type === "required"){
					output.complete = true;
					chopIndex = substr.indexOf("]");
				} else if (output.type === "optional"){
					output.complete = true;
					chopIndex = substr.indexOf(")");
				} else if (output.type === "literal"){
					output.complete = true;
					chopIndex = substr.length;
				} else if (output.type === "deferential"){
					output.complete = true;
					chopIndex = substr.length;
				}
			} else {
				chopIndex = substr.indexOf("/");
			}
			output.options.push(substr.slice(0,chopIndex));
			if (!output.complete){
				return parseTerm(substr.slice(chopIndex), output)
			}
			return output;
		}
	
		if (syntaxArgs.length === 0){
			return;
		}

		syntaxArgs.forEach(function(string, index){
			if (this.buffer.errorState){
				return;
			}
			 var argObj = parseTerm(string);
			 if (argObj.type === "required"){
			 	if ((this.buffer.syntax.args.length > 0) && Object.keys(this.buffer.syntax.args[this.buffer.syntax.args.length - 1]).indexOf("o") !== -1){
			 		var hasTermOverlap = this.buffer.syntax.args[this.buffer.syntax.args.length - 1].o.some(function(typeName){
			 			return argObj.options.includes(typeName)
			 		})
			 		if (hasTermOverlap) {
			 			this.setError(`syntax_parsing_error: invalid syntax declaration: ${command} syntax must be refactored (optional arg preceding required arg shares valid terms)`);
			 			return;
			 		};
			 	}
			 	this.buffer.syntax.args.push({"r" : argObj.options})
			 	this.buffer.syntax.requiredArgs.push(argObj.options)
			 	return;
			 } else if (argObj.type === "optional"){
			 	this.buffer.syntax.args.push({"o" : argObj.options})
			 	this.buffer.syntax.optionalArgs.push(argObj.options)
			 	return
			 } else if (argObj.type === "literal"){
			 	this.buffer.syntax.args.push({"l" : argObj.options});
			 	this.buffer.syntax.requiredArgs.push(argObj.options)
			 	return;
			 } else if (argObj.type === "deferential"){
			 	this.buffer.syntax.args.push({"o" : ["text"]});
			 	this.buffer.syntax.optionalArgs.push(["text"]);
			 } else {
			 	this.setError(`syntax_parsing_error: invalid syntax declaration: ${command} syntax must be refactored (arg type not found)`);
			 	return;
			 }
		},this);

	};

	compiler.shallowSyntaxCompare = function () {
		if (this.buffer.userInput.arguments.length < this.buffer.syntax.requiredArgs.length){
			var message = `${this.buffer.syntax.args.length} terms`;
			if (this.buffer.syntax.args.length === 1){
				message = `${this.buffer.syntax.args.length} term`
			}
			if (this.buffer.syntax.optionalArgs.length > 0){
				if (this.buffer.syntax.requiredArgs.length === 1){
					message = `at least ${this.buffer.syntax.requiredArgs.length} term`
				}
				message = `at least ${this.buffer.syntax.requiredArgs.length} terms`
			}
			
			this.setError(`invalid syntax (not enough terms)... got ${this.buffer.userInput.arguments.length} terms, expected ${message}...\\n \\t syntax: "${this.buffer.syntax.raw}"`);
			return;
		}
		if (this.buffer.userInput.arguments.length > this.buffer.syntax.args.length){
			if (Object.keys(this.buffer.syntax.args[this.buffer.syntax.args.length -1]).includes("o")){
				if (this.buffer.syntax.args[[this.buffer.syntax.args.length -1]].o[0] === 'text'){
					return;
				}
			}
			this.api.warn(`input term count exceeds command syntax term count... truncating...`)
			this.buffer.userInput.arguments.slice(0,this.buffer.syntax.args.length)
		}
	};

	compiler.deepSyntaxCompare = function () {
		var cmplr = this;
		var typeCheckAtIndex = function (argStr, index, syntaxIndex) {
			if (!syntaxIndex || syntaxIndex === undefined){
				syntaxIndex = index;
			}
			var argObj = cmplr.buffer.syntax.args[syntaxIndex];
			var argType = null;
			if (!argObj || argObj === undefined){
				return;
			}
			if (Object.keys(argObj).includes("r")){
				var typeCheckList = {};
				argObj.r.forEach(function(type){
					typeCheckList[type] = false;
				})
				Object.keys(typeCheckList).forEach(function(type){
					if (argType !== null){
						return;
					}
					typeCheckList[type] = cmplr.checkAndFixType(type, argStr, index)
					if (typeCheckList[type] === true){
						argType = type;
						return;
					}
				}, cmplr);
				if (argType === null){
					cmplr.throwTypeCheckErrors(index);
					cmplr.setEarlyReturn();
					return;
				} else {
					cmplr.clearTypeCheckErrors();
				}
			};
			if (Object.keys(argObj).includes("l")){
				if (argStr !== argObj.l[0]){
					cmplr.setTypeCheckError("literal" ,`(expected literal "${argObj.l[0]}", got "${argStr}")`)
					cmplr.throwTypeCheckErrors(index);
					cmplr.setEarlyReturn();
					return;
				} else {
					cmplr.buffer.userInput.arguments.splice(index,1)
				}

			};
			if (Object.keys(argObj).includes("o")){
				var typeCheckList = {};
				argObj.o.forEach(function(type){
					typeCheckList[type] = false;
				})
				Object.keys(typeCheckList).forEach(function(type){
					if (argType !== null){
						return;
					}
					typeCheckList[type] = cmplr.checkAndFixType(type, argStr, index)
					if (typeCheckList[type] === true){
						argType = type;
						return;
					}
				}, cmplr);
				if (argType === null){
					if (cmplr.buffer.syntax.args[index + 1] !== undefined && Object.keys(cmplr.buffer.syntax.args[index + 1]).length){
						cmplr.buffer.userInput.arguments.splice(index, 0, undefined);
						typeCheckAtIndex(argStr, index+1)
						return;
					}
					cmplr.throwTypeCheckErrors(index);
					cmplr.setEarlyReturn();
					return;
				} else {
					cmplr.clearTypeCheckErrors();
				}
			};
		}
		this.buffer.userInput.arguments.forEach(function(argStr, index){
			typeCheckAtIndex(argStr, index);
		}, this);
		if (this.buffer.errorState || this.buffer.earlyReturn){
			return;
		}

		
	};

	compiler.checkAndFixType = function (type, string, index) {
		if (!Object.keys(this.typeCheckFixRouter).includes(type)){
			//this.setError(`syntax_parsing_error : invalid syntax declaration, termtype "${type}" not supported by parser`)
			this.setTypeCheckError(type, `syntax_parsing_error : invalid syntax declaration, termtype "${type}" not supported by parser`)
			this.setEarlyReturn();
		}
		if (typeof this.typeCheckFixRouter[type] !== 'function'){
		}
		if (this.buffer.errorState || this.buffer.earlyReturn){
			return;
		}
		return this.typeCheckFixRouter[type](string, index)
	};

	compiler.typeCheckFixRouter = {
		"number" : function (string, index) {
			var intValue = parseInt(string);
			var isNum = (!isNaN(intValue))
			if (!isNum){
				this.setTypeCheckError('number', `(expected numerical value, got "${string}")`, index)
				return isNum
			}
			this.buffer.userInput.arguments[index] = intValue;
			return isNum;
		}.bind(compiler),
		"text" : function (string, index) {
			return true;
		}.bind(compiler),
		"boolean" : function (string, index) {
			var isBool = false;
			const synonyms = {
				"true" : ["t","1","+", "true"],
				"false" : ["f","0","-", "false"],
			}
			synonyms.true.forEach(function(str){
				if (isBool){
					return;
				}
				if (string == str){
					isBool = true;
					this.buffer.userInput.arguments[index] = true;
				}
			}, this)
			synonyms.false.forEach(function(str){
				if (isBool){
					return
				};
				if (string == str){
					isBool = true;
					this.buffer.userInput.arguments[index] = false;
				}

			}, this)
	
			if (!isBool){
				this.setTypeCheckError('boolean',`(expected "true" or "false", got "${string}")`, index)
			}
			return isBool;
		}.bind(compiler),
		"command" : function (string, index, isRexCmd) {

			var allCommandNames = Object.keys(this.parent.command);
			var foundCommand = false
			if (isRexCmd === undefined){
				isRexCmd = false;
			}
			allCommandNames.forEach(function(commandName){
				if (foundCommand || this.buffer.errorState){
					return;
				}
				if (commandName === string){
					if (isRexCmd){
						if ((this.parent.command[commandName].hasRexOverride === undefined ) || !this.parent.command[commandName].hasRexOverride){
							this.setTypeCheckError("command",`at present, ${commandName} is neither accessible by users nor super-users.`, index)
							return false;
						}
						foundCommand = true;
						return foundCommand;
					}
					if (this.parent.command[commandName].isAvail){
						foundCommand = true;
					}
				}
				if (this.parent.command[commandName].synonyms){
					if (this.parent.command[commandName].synonyms.includes(string)){
						if (!isRexCmd){
							if (!this.parent.command[commandName].isAvail){
								this.setTypeCheckError("command", `${string} is not a valid command, type "help" to print command list`, index);
								return false;
							}
						} else {
							if ((this.parent.command[commandName].hasRexOverride === undefined ) || !this.parent.command[commandName].hasRexOverride){
								this.setTypeCheckError("command",`at present, ${commandName} is neither accessible by users nor super-users.`, index);
								return false;
							}
						}
						this.buffer.userInput.args[index] = commandName;
						foundCommand = true;
						return foundCommand;
					}
				}
				return foundCommand
			}, this);
			if (!foundCommand){
				this.setTypeCheckError("command",`(expected an available command, got ${string})... type "help" to print command list`, index)
			}
			return foundCommand;
		}.bind(compiler),
		"anycommand" : function (string, index){
			var allCommandNames = Object.keys(this.parent.command);
			var foundCommand = false;
			allCommandNames.forEach(function(commandName){
				if (commandName === string){
					if (this.parent.command[commandName].rex === true || this.parent.command[commandName].isAvail){
						foundCommand = true;
					}
				}
			}, this);
			if (!foundCommand){
				this.setTypeCheckError("command",`(expected an available command, got ${string})... type "help" to print command list`, index);
			};
			return foundCommand
		}.bind(compiler),
		"node" : function (string, index, specifier, metaSpecifier, boolProp) {
			if (specifier === "null"){
				specifier = null;
			}
			if (metaSpecifier ==="null"){
				metaSpecifier = null;
			}
			if (specifier === "meta" && metaSpecifier !== undefined){
				var nodes = Object.keys(this.parent.accessibleNodes)
				var foundNode = false;
				var validNodes = [];
				nodes.forEach(function(nodeName, index){
					if ((metaSpecifier !== undefined) && this.parent.accessibleNodes[nodeName].Type === metaSpecifier){
						validNodes.push(nodeName);
					}
				}, this);
				if (validNodes.length === 0){
					this.setTypeCheckError(metaSpecifier, `no accessible nodes found matching type "${metaSpecifier}, try accessing different nodes"`, index);
					return foundNode
				}
				foundNode = validNodes.includes(string)
				if (!foundNode){
					var messageExt = `found ${validNodes.length} "${metaSpecifier}" node:`;
					if (validNodes.length > 1){
						messageExt = `found ${validNodes.length} "${metaSpecifier}" nodes:`;
					}
					validNodes.forEach(function(nodeName){
						var type = this.parent.accessibleNodes[nodeName].type
						messageExt = messageExt + `\\n   name: ${nodeName}` + (` .`).repeat(Math.max((16 - (nodeName.length)), 0)) + ` type: ${type}`;
					}, this)
					this.setTypeCheckError(type,`(expected ${metaSpecifier}, got "${string}")... ${messageExt}`, index);
					return foundNode
				}
				return foundNode
				
			}
			
			var type = "node"
			if (specifier && (specifier !== undefined)){
				type = specifier
		
				var nodes = Object.keys(this.parent.accessibleNodes)
				var foundNode = false;
				var validNodes = [];
				nodes.forEach(function(nodeName, index){
					if (this.parent.accessibleNodes[nodeName].type === specifier){
						validNodes.push(nodeName);
					}
					if ((metaSpecifier !== undefined) && this.parent.accessibleNodes[nodeName].Type === metaSpecifier){
						validNodes.push(nodeName);
					}
				}, this);
			
				if (validNodes.length === 0){
					this.setTypeCheckError(type,`no accessible nodes found matching type "${specifier}", try accessing different nodes`, index);
					return foundNode;
				}
				if (!validNodes.includes(string)){
					var messageExt = `type "lk" for a list of adjacent nodes`;
					if (Object.keys(this.parent.programs).includes("rucksack.ext") && (Object.keys(this.parent.programs.runningPrograms).indexOf("rucksack.ext") === -1)){
						messageExt = `\\n\\t - type "lk" to print a list of adjacent nodes
									\\n\\t - type "rummage" to access nodes stored in rucksack.ext`
					}
					this.setTypeCheckError(type,`(expected ${specifier}, got "${string}")... ${messageExt}`, index);
				} else {
					foundNode = true;
					return foundNode;	
				}
			} else {
				var validNodes = Object.keys(this.parent.accessibleNodes)
				//console.log(this.parent)
				if (!validNodes.includes(string)){
					var messageExt = `type "lk" for a list of adjacent nodes`;
					if (Object.keys(this.parent.programs).includes("rucksack.ext") && (Object.keys(this.parent.programs.runningPrograms).indexOf("rucksack.ext") === -1)){
						messageExt = `\\n \\t - type "lk" to print a list of adjacent nodes
									\\n \\t - type "rummage" to access nodes stored in rucksack.ext`
					}
					this.setTypeCheckError(type, `(expected node, got "${string}")... ${messageExt}`, index);
				} else {
					foundNode = true;
					if (!specifier && !metaSpecifier){
						if (boolProp !== undefined){
							foundNode = this.api.getAccessibleNodes()[string][boolProp]
							if (!foundNode){

								var message = `\\n\\t The following nodes satisfy node_property_${boolProp} = true:`
								var goodNodes = Object.keys(this.api.getAccessibleNodes()).filter(function(nodeName){
									return (this.api.getAccessibleNodes()[nodeName][boolProp] === true)
								}, this)
								goodNodes.forEach(function(nodeName){
									var node = this.api.getAccessibleNodes()[nodeName];
									var line = `\\n\\t  name: ${node.name}` + (` .`).repeat(Math.max((16 - Math.floor((nodeName.length)/2)), 0)) + ` type: ${node.type}`
									message = message + line;
								}, this)
								this.setTypeCheckError(type, `targeted node invalid: node_property_${boolProp} = false` + message)
							}
						}
					}
				}
				return foundNode;
			}
			return foundNode;

		}.bind(compiler),
		hardware : function (string, index) {
			return this.node(string, index, "meta", "hardware");
		},
		mole : function (string, index) {
			return this.node(string, index, "mole");
		},
		readable : function (string, index) {
			return this.node(string, index, "null", "null", "canBeRead");
		},
		recruiter : function (string, index) {
			
			return this.node(string, index, "recruiter");
		},
		library : function (string, index){
			return this.node(string, index, "library")
		},
		worm : function (string, index) {
			return this.node(string, index, "worm");
		},
		program : function (string, index) {
			if (string === "runningPrograms"){
				return false;
			}
			if (Object.keys(compiler.parent.programs).includes(string)){
				return true;
			}
			return this.node(string, index, "program", "malware");
		},
		malware : function (string, index) {
			return this.node(string, index, "malware");
		},
		mcommand : function (string, index) {
			var moleName = this.buffer.userInput.arguments[0];
			var mole = this.api.getAccessibleNodes()[moleName];
			var isMCommand = Object.keys(mole.moleCommands).includes(string)
			if (!isMCommand){
				this.setTypeCheckError('mcommand', `(expected ${moleName}-compatable command, got "${string}") ... try "mole ${moleName} help" to print a list of ${moleName}-compatible commands.`)
			} 
			return(isMCommand);
		}.bind(compiler)
	}
	compiler.executeCommand = function () {
		var command = this.buffer.userInput.command;
		var args = this.buffer.userInput.arguments;
		this.clearTypeCheckErrors();
		this.resetBuffer();

		this.command[command].ex.apply(this.command[command], args);
		return;
	}

	compiler.setEarlyReturn = function () {
		this.buffer.earlyReturn = true;
		return;
	};

	compiler.returnEarly = function (){
		this.buffer.earlyReturn = false;
		return;
	}

	compiler.setTypeCheckError = function (type, errorMessage, index){
		this.buffer.messages.typeCheckErrors[type] = {}
		this.buffer.messages.typeCheckErrors[type].text = errorMessage;
		this.buffer.messages.typeCheckErrors[type].command = this.buffer.userInput.command;
		this.buffer.messages.typeCheckErrors[type].argument = this.buffer.userInput.arguments[index];
		return;
	}

	compiler.throwTypeCheckErrors = function (argIndex) {
		var typesChecked = Object.keys(this.buffer.messages.typeCheckErrors);
		if (typesChecked.length === 1){
			this.api.throwError(`invalid syntax: type_Error: ${this.buffer.userInput.arguments[argIndex]} is not an acceptable argument...\\n ${this.buffer.messages.typeCheckErrors[typesChecked[0]].text}`)
			return;
		}
		var output = `inavlid syntax: type_Error: ${this.buffer.userInput.arguments[argIndex]} is not an acceptable argument...`;
		Object.keys(this.buffer.messages.typeCheckErrors).forEach(function(type){
			output = output + `\\n ${this.buffer.userInput.arguments[argIndex]} is not a "${type}": ${this.buffer.messages.typeCheckErrors[type].text}`
			delete this.buffer.messages.typeCheckErrors[type]
		}, this)
		this.api.throwError(output);
		this.buffer.messages.typeCheckErrors = {};
		this.resetBuffer();
		return;
	}

	compiler.clearTypeCheckErrors = function (){
		Object.keys(this.buffer.messages.typeCheckErrors).forEach(function(type){
			delete this.buffer.messages.typeCheckErrors[type]
		}, this)
		this.buffer.messages.typeCheckErrors = {};
		return;
	}

	compiler.setError = function (errorMessage) {
		this.buffer.errorState = true;
		this.buffer.errorMessage = errorMessage;
		this.setEarlyReturn();
		return;
	};

	compiler.throwError = function () {
		this.buffer.errorState = false;
		
		this.api.throwError(this.buffer.errorMessage);
		this.resetBuffer();
		return;
	}.bind(compiler);

	compiler.handleError = function () {
		if (!this.buffer.errorState){
			
			return;
		};

		return this.throwError();

	};

	init(parent);
	return compiler;
}
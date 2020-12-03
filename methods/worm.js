export class Worm  {
	constructor (name, body) {
		this.name = name;
		this.compile(body);
		this.worm = {};
	}

	compile (body) {
		/*
			@param {body} = object
			body.string = full String Of Worm Ware;
			body.width = terminal width when wormWare was last edited;

		*/


		var compileProgressObject = {};
		var cpo = compileProgressObject;
			cpo.body = "";
			cpo.subWormCount = 0;
			cpo.expectedSubWorms = 0;
			cpo.subWorms = {};
			cpo.parentWorm = {};
			cpo.wormName = "";
		
		

		const createSubWorm = function (parent) {
			subWorm = {};
			subWorm.name = "";
			subWorm.parent = parent;
			subWorm.cloneCount = 1;
			subWorm.inheritedFuncString = parent.funcString
			subWorm.setName = function (name) {
				this.name = name;
				return;
			};
			subWorm.setFunction = function (functionString) {
				var fullFunc = this.inheritedFuncString + functionString;
				this.ex = new Function(fullFunc);
			};
			subWorm.ex = function () {};
			return subWorm
		};
		const throwCompilationError = function (string, index) {
			//this needs to get re-written, for suuurrreee

			//needs to return line number of where the error is, probably using API calls?
			//prolly gonna need to build a text editor before fleshing this out...
			console.log('COMPILING ERROR' + string + 'at index' + index);
			return;
		}

		//general flow should build components using individual functions before appending them to output body.

		//this shits gonna be a multi-pass

		//passZero should remove all unnecessary characters from any input String
		const passZero = function (string){
			var newString = "";
			const appendValidChars = function (letter){
				const skipTerms = [ " ", "\n", "\t" ];
				if (skipTerms.indexOf(letter) === -1){
					return;
				}
				newString = newString + letter;
				return;
			}
			string.forEach(function(character){
				appendValidChars(character);
			})
			return newString;
		};
		/*
		//passOne should make sure that the structure of the language is preserved
		const passOne = function (string){
			var newStrings = string.split("*");
			cpo.expectedSubWorms = newStrings.length - 2;
			var worm_dec_0 = true;
			var shouldContinue = true;
			shouldContinue = compileInitialWormDeclaration(newStrings[0]);
			if (!shouldContinue){
				return false;
			}
			shouldContinue = compileParentWormEx(newStrings[1])
			if (!shouldContinue){
				return false;
			}

			if (!shouldContinue){
				return false;
			}

			if (!shouldContinue){
				return false;
			}

			if (!shouldContinue){
				return false;
			}

			if (!shouldContinue){
				return false;
			}
		}
		*/
		/*
		const compileInitialWormDeclaration = function (string){
			if (string[0] !== `w`){
				worm_dec_0 = false
			}
			if (string[1] !== `o`){
				worm_dec_0 = false
			}
			if (string[2] !== `r`){
				worm_dec_0 = false
			}
			if (string[3] !== `m`){
				worm_dec_0 = false
			}
			if (string[4] !== `-`){
				worm_dec_0 = false
			}
			if (string[5] !== `{`){
				worm_dec_0 = false
			}			
			if (!worm_dec_0){
				throwCompilationError(`Initial Worm Declaration not initialized correctly (must begin with "*worm-{"`)
				return false;
			}
			var blockZeroLastChar = string[0][string[0].length]
			if ( blockZeroLastChar !== '}'){
				throwCompilationError(`Initial Worm Declaration -- closure not found... (expected "}" but got ${blockZeroLastChar}`);
				return false;
			}
		};
		*/

		const parse = function (string, currentIndex, funcStack) {
			var character = string[currentIndex];
			if (tokenInitSigils_list.indexOf(character) === -1){
				//case that we're fucking up somewhere
				throwCompilationError(`expected a sigil, got ${character}`, currentIndex);
				return;
			};
			return tokenInitSigils_router[character](string, currentIndex, funcStack);
		};

		const tokenInitSigils_router = {
			'*' : parseWormFunc, //wormFunc 
			'%' : parseFunc, //function
			'&' : parseTypedValue, //Typed Value
			'#' : parseProperty, //property
			'(' : parseMetaProp, //meta_prop
			'|' : parseReturnValue, //returnedValue
			':' : parseFunctionMap, //functionMapInit
			'$' : parseWorm, //worm
		};
		const tokenInitSigils_list = Object.keys(tokenInitSigils_router)

		const parseWormFunc = function (string, currentIndex, funcStack){
			//case that string[currentIndex] === *

		};

		const parseIWD = function (string, currentIndex, funcStack){

		};
		const parseWEX = function (string, currentIndex, funcStack){

		};

		const parseFunc = function (string, currentIndex, funcStack){
			const funcBreakSigils = ['_','<',]
			//case that string[currentIndex] === %
			var funcs = functions_list;
			var func = string.substring(currentIndex + 1, currentIndex + 5);
			if (funcs.indexOf(func) === -1){
				throwCompilationError(`invalid function declaration ${func} is not a function`, currentIndex)
				return false;
			}
			if (funcs.indexOf(of))
		};


		const parseTypedValue = function (string, currentIndex, funcStack){
			//case that string[currentIndex] === &

		};

		const parseProperty = function (string, currentIndex, funcStack){
			//case that string[currentIndex] === #
			const props = ['seek', 'home', 'trgt']
			var lookAhead = string[currentIndex + 5]
			var prop = string.substring(currentIndex + 1, currentIndex + 5);
			if (props.indexOf(prop) === -1){
				throwCompilationError(`cannot declare a value to a non-existent property`, currentIndex)
				return false;
			}
			if (lookAhead !== '<'){
				throwCompilationError(`must open a value declaration to declare a property's value (expected '<'), but got ${lookAhead}`, currentIndex)
				return false;
			}
			//not sure this is the exact form that we want?
			return prop
		};

		const parseMetaProp = function (string, currentIndex){
			//case that string[currentIndex] === (
			const metaProps = ['WORM','CHLD']
			var lookAhead = string[currentIndex + 5]
			var metaProp = string.substring(currentIndex + 1, currentIndex + 5)
			if (metaProps.indexOf(metaProp) === -1){
				throwCompilationError(`named MetaProp (${metaProp}) not a valid argument within "()" closure`);
				return false;
			}
			if (lookAhead !== ')'){
				throwCompilationError(`metaProp improperly closed (expected ")", but got ${lookAhead})`, currentIndex + 5);
				return false;
			}
			
		};

		const parseReturnValue = function (string, currentIndex){
			//case that string[currentIndex] === |

		};

		const parseFunctionMap = function (string, currentIndex){
			//case that string[currentIndex] === :

		};

		const parseWorm = function (string, currentIndex){
			//case that string[currentIndex] === $


		};








		const breakSigils = {
			"$" : '', // worm			
			"_" : '', // uhhh... generic terminator?
			"#" : '', // property keyMarker
			"<" : '', // property value open
			">" : '', // closure for "<" or "="
			"|" : '', //returnedValue of a function?
			"&" : '', //Variable Type Indicator
			"!" : '', 
			"." : '', //breaks up addresses
			"=" : '', // (with > (=>) (assignTO))
			"%" : '', //func
			"(" : '',//access meta_prop
			")" : '', //end access meta_prop
			":" : '', // when func return multiple values, open a zone to map them places
			";" : '', // close function map zone
			"*" : '', //declare wormfunc
			"{" : '', //start wormfunc wrap
			"}" : '', //stop wormfunc wrap
			"[" : '', //startofWormBackpackObject
			"]" : '', //end of WormBackpackObjext
		};
		const breakSigils_list = Object.keys(breakSigils)

		const wormProps = {
			"seek" : ,
			"home" : ,
			// "mole" : , Ultimately have to decide if moles need prgmng too?
		};

		const functions = {
			dclr : function () {
				var functionObject = {};
				functionObject.wormIsSubWorm = false;
				functionObject.worm = "";
				functionObject.prop = "";
				functionObject.value = "";

				functionObject.assemble = function () {
					var funcBody = "";
					var a = "";
					if (this.wormIsSubWorm){
						a =`cpo.subWorms[${this.worm}]`;
					} else {
						a = `cpo.parentWorm`;
					}
					var b = `[${this.prop}]`;
					var c = ` = ${this.value}`;
					funcBody = a + b + c;
					const dclrFunc = new Function(funcBody);
					return dclrFunc;
				}
				return functionObject;
			},
			CLON : function () {
				var functionObject = {};
				functionObject.wormIsSubWorm = false;
				functionObject.worm = "";
				functionObject.value = "";

				functionObject.assemble = function () {
					var funcBody = "";
					var a = "";
					if (this.wormIsSubWorm){
						a =`cpo.subWorms[${this.worm}]`;
					} else {
						a = `cpo.parentWorm`;
					}
					var b = `.cloneCount`;
					var c = ` = ${this.value}`;
					funcBody = a + b + c;
					const clonFunc = new Function(funcBody);
					return clonFunc;
				}
				return functionObject;
			},
			MUTA : function () {
				var functionObject = {};
				functionObject.wormIsSubWorm = false;
				functionObject.worm = "";
				functionObject.value = "";

				var functionObject.assemble = function () {
					var funcBody = "";
					var a = "";
					if (this.wormIsSubWorm){
						a =`cpo.subWorms[${this.worm}]`;
					} else {
						a = `cpo.parentWorm`;
					}
					var b ='var outputArray = [];'
					var c = `for(var i=0;i<${this.value};i++){outputArray.push(createSubWorm(${a}));};`
					var d = 'return outputArray;'

					const mutaFunc = new Function(funcBody);
					return mutaFunc
				}
				return functionObject
			}
		};
		const functions_list = Object.keys(functions)

		const func_Sigils = {
			"(" : ,
			")" : ,
			":" : ,
			"=" : ,
			">" : ,
			"#" : ,
		};



		const reservedTerms = {
			"WORM" : , // meta prop of papa worm
			"CHLD" : , //saved return value for CLON
			"clon" : ,	//clones worm, takes two args, number of clones per type, number of types
			"TERM" : , //terminates worm after function exec
			"muta" : , //mutates worm, splitting into two distinct classes of worm (always returns 2)
			"worm" : , //indicates wormfunction while following *
			"ex" : ,	//indicates worm executing Function
			"defn" : , // sets definition of a novel wormClass? 
			"PRTO" : , //property : protocol
		};













	}

}
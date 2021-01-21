export const constructGraphStringParser = function (allNodes) {
	const graphCompiler = {};
	graphCompiler.state = {
		nodeMode : false,
		nodeModeComplete : false,
		edgeMode : false,
		edgeModeComplete : false,
		dataBankOpen : false,
		nodeNetOpen: false,
		settingNodeNet : false,
		settingDataBank : false,
		compiling : false,
		appending : false,
		deleting : false,
		nodeNet : null,
		dataBank : null,
		activeNode : null,
		lastNode : null,
		targetNode : null,
		targetNodes : [],
		multipleTargets : false,
		collectingTargets : false,
		symmetricEdge : true,
		fullString : '',
		index : -1,
		substring : '',
		failure : '',
		existingDiff : '',
		shouldConcat : false,
	};
	graphCompiler.sigilRouter = {
		'a' : function (string) {
			if (this.state.dataBank === null){
				this.state.failure = 'cannot append nodes/edges without declaring a databank'
				this.throwError();
				return;
			}
			if (this.state.appending || this.state.deleting){
				if (this.state.activeNode !== null && this.state.edgeMode){
					this.addRemoveEdges();
				} else if (this.state.nodeMode && this.state.collectingTargets) {
					this.state.targetNodes.push(this.state.lastNode);
					this.collectingTargets = false;
					this.addRemoveNodes();
				} else {
					this.state.failure = "expected num, got sigil 'a'... cannot add while adding/deleting"
					this.throwError();
					return;
				}
			}
			this.state.deleting = false;
			this.state.appending = true;
			if (this.state.nodeMode){
				this.state.collectingTargets = true;
			}
			var stringSansSigil = string.substring(1);
			this.state.substring = stringSansSigil;
			return this.parse(stringSansSigil);

		},
		'd' : function (string) {
			if (this.state.dataBank === null){
				this.state.failure = 'cannot delete nodes/edges without declaring a databank'
				this.throwError();
				return;
			}
			if (this.state.appending || this.state.deleting){
				if (this.state.activeNode !== null && this.state.edgeMode){
					this.addRemoveEdges();
				} else if (this.state.nodeMode && this.state.collectingTargets) {
					this.collectingTargets = false;
					this.addRemoveNodes();
				} else {
					this.state.failure = "expected num, got sigil 'd'... cannot delete while adding/deleting"
					this.throwError();
					return;
				}
			}
			this.state.deleting = true;
			this.state.appending = false;
			if (this.state.nodeMode){
				this.state.collectingTargets = true;
			}
			var stringSansSigil = string.substring(1);
			this.state.substring = stringSansSigil;
			return this.parse(stringSansSigil);

		},
		'=' : function (string) {
			if (!this.state.edgeMode){
				this.state.failure = "cannot start edgeMode before completing nodeMode (include () before edge set in all [nodeNets])";
				this.throwError();
				return;
			}
			if (this.state.appending){
				if (this.state.activeNode !== null){
					this.state.symmetricEdge = true;
					var stringSansSigil = string.substring(1);
					this.state.substring = stringSansSigil;
					return this.parse(stringSansSigil);
				} else {
					this.state.failure = "must have activeNode before declaring symmetricEdge=true";
					this.throwError();
					return;
				}
			} else if (this.state.deleting){
				if (this.state.activeNode !== null){
					this.state.symmetricEdge = true;
					var stringSansSigil = string.substring(1);
					this.state.substring = stringSansSigil;
					return this.parse(stringSansSigil);
				} else {
					this.state.failure = "must have activeNode before declaring symmetricEdge=true";
					this.throwError();
					return;
				}
			} else {
				this.state.failure = "cannot set symmetricEdge=true while neither appending nor deleting"
				this.throwError();
				return;
			}

		},
		'>' : function (string) {
			if (!this.state.edgeMode){
				this.state.failure = "cannot start edgeMode before completing nodeMode (include () before edge set in all [nodeNets])";
				this.throwError();
				return;
			}
			if (this.state.appending){
				if (this.state.activeNode !== null){
					this.state.symmetricEdge = false;
					var stringSansSigil = string.substring(1);
					this.state.substring = stringSansSigil;
					return this.parse(stringSansSigil);
				} else {
					this.state.failure = "must have activeNode before declaring symmetricEdge=false"
					this.throwError();
					return;
				}
			} else if (this.state.deleting){
				if (this.state.activeNode !== null){
					this.state.symmetricEdge = false;
					var stringSansSigil = string.substring(1);
					this.state.substring = stringSansSigil;
					return this.parse(stringSansSigil);
				} else {
					this.state.failure = "must have activeNode before declaring symmetricEdge=false"
					this.throwError();
					return;
				}
			} else {
				this.state.failure = "cannot set symmetricEdge=false while neither appending nor deleting"
				this.throwError();
				return;
			}

		},
		'{' : function (string) {
			if (this.state.appending || this.state.deleting){
				if (this.state.activeNode !== null && this.state.edgeMode){
					this.state.multipleTargets = true;
					this.state.collectingTargets = true;
					var stringSansSigil = string.substring(1);
					this.state.substring = stringSansSigil;
					return this.parse(stringSansSigil);
				} else if (this.state.nodeMode && this.state.collectingTargets) {
					this.state.multipleTargets = true;
					var stringSansSigil = string.substring(1);
					this.state.substring = stringSansSigil;
					return this.parse(stringSansSigil);
				} else {
					if (this.state.edgeMode){
						this.state.failure = `invalid "{" placement at index ${this.state.fullString.length - this.state.substring.length}:cannot initiate list without activeNode`
					} else if (this.state.nodeMode){
						this.state.failure = `invalid "{" placement at index ${this.state.fullString.length - this.state.substring.length}`
					} else {
						this.state.failure = `invalid "{" placement at index ${this.state.fullString.length - this.state.substring.length}: instantiate nodeMode or edgeMode before multipleTargets`
					}
					this.throwError();
						return;
				}
			} else {
				this.state.failure = `invalid "{" placement at index ${this.state.fullString.length - this.state.substring.length}:cannot initiate list without "a" or "d" declaration`
					this.throwError();
					return;
			} 
		},
		',' : function (string) {
			if (this.state.appending || this.state.deleting){
				if (this.state.activeNode !== null && this.state.collectingTargets && this.state.multipleTargets){
					this.state.targetNodes.push(this.state.lastNode);
					var stringSansSigil = string.substring(1);
					this.state.substring = stringSansSigil;
					return this.parse(stringSansSigil);
				} else {
					if (this.state.activeNode === null){
						this.state.failure = `invalid comma placement at index ${this.state.fullString.length - this.state.substring.length}: no declared activeNode`
					} else if (!this.state.collectingTargets){
						this.state.failure = `invalid comma placement at index ${this.state.fullString.length - this.state.substring.length}: "{" required to collect multipleTargets`
					}
					this.throwError();
					return;
				}
			} else {
				this.state.failure = `invalid comma placement at index ${this.state.fullString.length - this.state.substring.length}`
				this.throwError();
				return;
			}

		},
		'}' : function (string) {
			if (this.state.appending || this.state.deleting){
				if (this.state.activeNode === null){
					this.state.failure = `invalid "}" placement at index ${this.state.fullString.length - this.state.substring.length}`
					this.throwError();
					return;
				}
				if (this.state.collectingTargets && this.state.multipleTargets){
					this.state.collectingTargets = false;
					this.state.targetNodes.push(this.state.lastNode);
					if (this.state.edgeMode){
						this.addRemoveEdges();
					} else if (this.state.nodeMode) {
						this.addRemoveNodes();
					} else {
						this.state.failure = "Cannot terminate list while in neither nodeMode nor edgemode";
						this.throwError();
						return;
					}
					var stringSansSigil = string.substring(1);
					this.state.substring = stringSansSigil;
					return this.parse(stringSansSigil);
				} else {
					if (!this.state.collectingTargets){
						this.state.failure = `unexpected sigil "}" at index ${this.state.fullString.length - this.state.substring.length}: not collectingTargets anymore`
					} else if (!this.state.multipleTargets){
						this.state.failure = `unexpected sigil "}" at index ${this.state.fullString.length - this.state.substring.length}: no preceding "{"`
					}
					this.throwError();
					return;
				}
			}

		},
		'-' : function (string) {
			if (!this.state.lastNode || this.state.lastNode === null){
				this.state.failure = `cannot open a range without initial value (unexpected "-" at index ${this.state.fullString.length - this.state.substring.length})`;
				this.throwError();
				return;
			} else {
				if (Number.isNaN(parseInt(this.state.lastNode))){
					this.state.failure = `cannot open a range without integer initial value (unexpected "-" at index ${this.state.fullString.length - this.state.substring.length})`;
					this.throwError();
					return;
				}
				this.state.targetRange = true;
				var stringSansSigil = string.substring(1);
				this.state.substring = stringSansSigil;
				return this.parse(stringSansSigil);
			}
		},
		'(' : function (string) {
			if (this.state.nodeMode){
				this.state.failure = `cannot start edgeMode or nodeMode without completing nodeMode (expected ")" before next "(")`
				this.throwError();
				return;
			}
			if (this.state.nodeModeComplete){
				this.state.edgeMode = true;
				this.state.nodeModeComplete = false;
				var stringSansSigil = string.substring(1);
				this.state.substring = stringSansSigil;
				return this.parse(stringSansSigil);
			}
			if (this.state.edgeMode){
				this.state.failure = `cannot start edgeMode or nodeMode without completing edgeMode (expected ")" before next "(")`
				this.throwError();
				return;
			}
			if (this.state.edgeModeComplete){
				this.state.failure = `cannot start another nodeMode within the same nodeNet. (expected "]" )`
				this.throwError();
				return;
			}
			this.state.nodeMode = true;
			var stringSansSigil = string.substring(1);
			this.state.substring = stringSansSigil;
			return this.parse(stringSansSigil);

		},
		')' : function (string) {
			if (this.state.multipleTargets){
				this.state.failure = `expected "}" but got ")"... close multipleTargets before closing "("`
				this.throwError();
				return;
			}
			if (this.state.nodeMode){
				this.state.targetNodes.push(this.state.lastNode);
				this.addRemoveNodes();
				this.state.nodeMode = false;
				this.state.nodeModeComplete = true;
				this.state.collectingTargets = false;
				this.state.targetNodes = [];
				var stringSansSigil = string.substring(1);
				this.state.substring = stringSansSigil;
				return this.parse(stringSansSigil);
			}
			if (this.state.nodeModeComplete){
				this.state.failure = `expected "(" or "]", but got ")"`
				this.throwError();
				return;
			}
			if (this.state.edgeMode){
				this.addRemoveEdges();
				this.state.edgeMode = false;
				this.state.edgeModeComplete = true;
				this.state.collectingTargets = false;
				var stringSansSigil = string.substring(1);
				this.state.substring = stringSansSigil;
				return this.parse(stringSansSigil);
			}
			if (this.state.edgeModeComplete){
				this.state.failure = `expected "]", but got ")"`
				this.throwError();
				return;
			}
			this.state.failure = `unexpected ")" at index : ${this.state.fullString.length - this.state.substring.length}`
			this.throwError();
			return;
		},
		'#' : function (string) {
			if (!this.state.dataBank || this.state.dataBank === null){
				this.state.failure = "cannot declare a nodeNet outside a databank";
				this.throwError();
				return;
			}
			if (this.state.appending || this.state.deleting || this.state.nodeMode || this.state.edgeMode){
				this.state.failure = `invalid token "#", nodeNet declarations must precede all node/edge activity... index : ${this.state.fullString.length - this.state.substring.length}`
				this.throwError();
				return;
			}
			if (this.state.nodeNetOpen || this.state.nodeNet !== null){
				this.state.failure = `cannot open new nodeNet without closing last nodeNet (expected "]" before "#") index: ${this.state.fullString.length - this.state.substring.length}`
				this.throwError();
				return;
			} 
			this.state.settingNodeNet = true;
			var stringSansSigil = string.substring(1);
			this.state.substring = stringSansSigil;
			return this.parse(stringSansSigil);

		},
		'$' : function (string) {
			if (this.state.appending || this.state.deleting || this.state.nodeMode || this.state.edgeMode){
				this.state.failure = `invalid token "$", databank declarations must precede all node/edge activity... index : ${this.state.fullString.length - this.state.substring.length}`
				this.throwError();
				return;
			}
			if (this.state.nodeNetOpen){
				this.state.failure = `cannot open new databank while nodeNet remains open (expected "]%" before "$") index: ${this.state.fullString.length - this.state.substring.length}`
				this.throwError();
				return;
			}
			if (this.state.dataBankOpen || this.state.dataBank !== null){
				this.state.failure = `cannot open new databank without closing last databank (expected "%" before "$") index: ${this.state.fullString.length - this.state.substring.length}`
				this.throwError();
				return;
			}
			this.state.dataBankOpen = true;
			this.state.settingDataBank = true;
			var stringSansSigil = string.substring(1);
			this.state.substring = stringSansSigil;
			return this.parse(stringSansSigil);
		},
		'%' : function (string) {
			if (this.state.dataBank === null){
				this.state.failure = `cannot close databank... dataBank = null   (index: ${this.state.fullString.length - this.state.substring.length})`;
				this.throwError();
				return;
			}
			if (this.state.nodeNetOpen){
				this.state.failure = `cannot close dataBank while nodeNet still open (index: ${this.state.fullString.length - this.state.substring.length})`;
				this.throwError();
				return;
			}
			this.state.dataBankOpen = false;
			this.state.databank = null;
			var stringSansSigil = string.substring(1);
			this.state.substring = stringSansSigil;
			return this.parse(stringSansSigil);
		},
		'[' : function (string) {
			if (!this.state.nodeNet || this.state.nodeNet === null){
				this.state.failure = `"Cannot open a nodeNet when aforementioned nodeNet is undeclared or undefined"(index: ${this.state.fullString.length - this.state.substring.length})`
				this.throwError();
				return;
			}
			if (this.state.nodeMode || this.state.edgeMode){
				this.state.failure = `"Cannot open a nodenet while defining terms in that same nodenet????"(index: ${this.state.fullString.length - this.state.substring.length})`
				this.throwError();
				return;
			}
			this.state.nodeNetOpen = true;
			var stringSansSigil = string.substring(1);
			this.state.substring = stringSansSigil;
			return this.parse(stringSansSigil); 
		},
		']' : function (string) {
			if (!this.state.nodeNetOpen){
				this.state.failure = `cannot close a nodeNet when there is no open nodeNet (unexpected token "]" at index${this.state.fullString.length - this.state.substring.length})`
				this.throwError();
				return;
			}
			if (this.state.nodeMode || this.state.edgeMode){
				this.state.failure = `cannot close nodeNet before finishing edgeMode && nodeMode (unexpected token "]" at index${this.state.fullString.length - this.state.substring.length})`
				this.throwError();
				return;
			}
			if (this.state.nodeModeComplete){
				this.state.failure = `cannot close nodeNet withou edgemode (include empty "()" after nodeMode in this nodeNet)(unexpected token "]" at index${this.state.fullString.length - this.state.substring.length})`
				this.throwError();
				return;
			}
			this.state.edgeModeComplete = false;
			this.state.nodeNetOpen = false;
			this.state.nodeNet = null;
			var stringSansSigil = string.substring(1);
			this.state.substring = stringSansSigil;
			return this.parse(stringSansSigil); 
		},
	};
	graphCompiler.sigils = Object.keys(graphCompiler.sigilRouter);

	graphCompiler.convertToGraph = function (string) {
		this.state.fullString = string
		return this.parse(string);
	};

	graphCompiler.concatToString = function (string, existingDiff) {

		this.state.fullString = string;
		if (existingDiff !== undefined){
			this.state.existingDiff = existingDiff;
		} else {
			this.state.existingDiff = "";
		}
		this.state.shouldConcat = true;
		this.parse(string);
		var output = this.state.existingDiff;
		this.state.existingDiff = "";
		this.state.shouldConcat = false;
		return output;

	};	

	graphCompiler.parse = function (string) {
		if (this.state.errorState){
			return;
		}
		if (string.length === 0){
			return true;
		}
		var stringToConsider = string;
		if (this.state.settingDataBank){
			this.state.dataBank = this.getNextNode();
			this.state.settingDataBank = false;
			stringToConsider = stringToConsider.substring(this.findIndexOfNextSigil());
		}

		if (this.state.settingNodeNet){
			this.state.nodeNet = this.getNextNode();
			//this.addNodeNetToDataBank();
			this.state.settingNodeNet = false;
			stringToConsider = stringToConsider.substring(this.findIndexOfNextSigil());
		}

		if (this.state.appending || this.state.deleting){
			if (!this.state.activeNode && this.state.edgeMode){
				this.state.activeNode = this.getNextNode();
				stringToConsider = stringToConsider.substring(this.findIndexOfNextSigil());
			} else if (this.state.nodeMode){
				if (this.state.targetRange){
					this.assembleTargetRange();
					stringToConsider = stringToConsider.substring(this.findIndexOfNextSigil());
				} else if (this.state.collectingTargets){
					if (this.state.lastNode !== null){
						this.state.targetNodes.push(this.state.lastNode);
					}
					this.state.lastNode = this.getNextNode();
					stringToConsider = stringToConsider.substring(this.findIndexOfNextSigil());
				} else {
				}
			} else {
				if (this.findIndexOfNextSigil() !== 0){
					this.state.targetNode = this.getNextNode();
					this.state.lastNode = this.state.targetNode;
					stringToConsider = stringToConsider.substring(this.findIndexOfNextSigil());
				} else if (this.state.collectingTargets) {
					this.state.lastNode = this.getNextNode();
					stringToConsider = stringToConsider.substring(this.findIndexOfNextSigil());
				}
			}
		}

		var firstChar = stringToConsider[0];

		if (!this.sigils.includes(firstChar)){
			this.state.failure = 'noSigilhere;'
			this.throwError();
			return;
		} else {
			return this.sigilRouter[firstChar](stringToConsider);
		}
	};
	graphCompiler.assembleTargetRange = function () {
		
		var start_string = this.state.lastNode;
		var end_string = this.getNextNode();;

		var start_index = parseInt(start_string);
		var end_index = parseInt(end_string);

		if (Number.isNaN(start_index)){
			this.state.failure = "cannot assemble targetRange when start_index isNaN";
			this.state.errorState = true;
			this.throwError();
			return;
		};
		if (Number.isNaN(end_index)){
			this.state.failure = "cannot assemble targetRange when end_index isNaN";
			this.state.errorState = true;
			this.throwError();
			return;
		};

		for (var i = start_index; i <= end_index; i++){
			var node = this.allNodes.getNode(i.toString());
			if (node === undefined || !node){
				this.state.failure = `assembleTargetRange failure: no node found at trueAddress=${i}`
				this.state.errorState = true;
				this.throwError();
				return;
			}
			this.state.targetNodes.push(node);
		}

		this.state.lastNode = null;

		if (this.state.errorState){
			this.state.targetNodes = [];
			return;
		}

	};

	graphCompiler.getNextNode = function (string) {
		if (!string){
			string = this.state.substring
		}
		var nextSigilIndex = this.findIndexOfNextSigil(string)
		if ( nextSigilIndex <= 0){
			if (nextSigilIndex === 0){
				this.state.failure = `expected nodeTrueAddress, but got ${string[0]}`;
			} else {
				this.state.failute = `expected final sigil, but no more sigils to be found`;
			}
			this.throwError();
			return;
		} else {
			return string.substring(0, this.findIndexOfNextSigil());
		}
	};

	graphCompiler.findIndexOfNextSigil = function (string) {
		if (!string){
			string = this.state.substring
		}
		for (var i = 0; i< string.length; i ++){
			if (this.sigils.includes(string[i])){
				return i;
			}
		}
		return -1;
	};
	graphCompiler.addNodeNetToDataBank = function () {
		this.state.compiling = true;
		if (this.state.dataBank === null){
			if (0 === null){
				console.log(`I hate JS`)
			}
			this.state.errorState = true;
			this.state.failure = `cannot add nodeNet to databank when databank=${this.state.dataBank}`;
			this.throwError();
			return;
		};
		if (this.state.nodeNet === null ){
			this.state.errorState = true;
			this.state.failure = `cannot add nodeNet to nodeNet when nodeNet=${this.state.nodeNet}`;
			this.throwError();
			return;
		};
		console.log(this)
		var db = this.allNodes.getDatabank(this.state.dataBank)
		if (db === undefined|| !db){
			this.state.errorState = true;
			this.state.failure = `cannot add nodeNet to databank:: no such dataBank (allNodes.getDatabank(${this.state.dataBank} returned ${db})`;
			this.throwError();
			return;
		};
		var nn = this.allNodes.getNodeNet(this.state.nodeNet)
		if (nn === undefined|| !nn){
			this.state.errorState = true;
			this.state.failure = `cannot add nodeNet to databank:: no such nodeNet (allNodes.getNodeNet(${this.state.nodeNet} returned ${nn})`;
			this.throwError();
			return;
		};
		if (nn._meta.name || nn._meta !== undefined){
			this.state.errorState = true;
			this.state.failure = `cannot add nodeNet to databank: nodeNet exists in separate databank: ${nn._meta.name}`;
			this.throwError();
			return;
		}
		db.addNodeNet(nn);
		this.state.compiling = false;
	};
	graphCompiler.addRemoveNodes = function () {
		console.log(`adding/RemovingNodes`)
		this.state.compiling = true;
		if (this.state.nodeNet === null || !(this.state.nodeNet && this.state.nodeNet !== 0)){
			this.state.errorState = true;
			this.state.failure = `cannot add node to nodenet when nodeNet trueAddress = ${this.state.nodeNet}`;
			this.throwError();
			return;
		}
		var nn = this.allNodes.getNodeNet(this.state.nodeNet);
		if (nn === undefined || !nn){
			this.state.errorState = true;
			this.state.failure = `cannot add node to nodeNet : no such nodeNet (allNodes.getNodeNet(${this.state.nodeNet} returned ${nn})`
			this.throwError();
			return;
		};

		if (this.state.appending){
			console.log(`targetnodesList = ${this.state.targetNodes}`)
			this.state.targetNodes.forEach(function(nodeTrueAddress){
				if (this.state.errorState){
					return;
				}
				var node = this.allNodes.getNode(nodeTrueAddress);
				if (!node || node === undefined){
					this.state.errorState = true;
					this.state.failure = `cannot add node to ${nn.name} : no such node(allNodes.getNode(${nodeTrueAddress} returned ${node})`
					this.throwError();
					return;
				}
				if (!this.state.shouldConcat){
					nn.addNode(node);
				} else {
					this.appendNode(node)
				}
			}, this)
			this.state.appending = false;
		} else if (this.state.deleting){
			this.state.targetNodes.forEach(function(nodeTrueAddress){
				if (this.state.errorState){
					return;
				}
				var node = this.allNodes.getNode(nodeTrueAddress);
				if (!node || node === undefined){
					this.state.errorState = true;
					this.state.failure = `cannot add node to ${nn.name} : no such node(allNodes.getNode(${nodeTrueAddress} returned ${node})`
					this.throwError();
					return;
				}
				if (!this.state.shouldConcat){
					nn.deleteNode(node);
				} else {
					this.appendNode(node, true);
				}
			}, this)
			this.state.deleting = false;
		} else {

		}
		this.state.targetNodes = [];
		this.state.compiling = false;
	};
	graphCompiler.addRemoveEdges = function () {
		if (!this.state.edgeMode){
			this.state.failure = "Compiler state confusion... for some reason, tried to addRemoveEdges while edgeMode=false"
			this.throwError();this.state.failure = `invalid "{" placement at index ${this.state.fullString.length - this.state.substring.length}:cannot initiate list without activeNode`
			return;
		}
		this.state.compiling = true;
		if (this.state.appending){
			var activeNode = this.allNodes.getNode(this.state.activeNode);
			var targetNodes = [];
			if (!activeNode){
				this.throwError();
				return;
			}
			if (this.state.multipleTargets){
				if (this.state.targetNodes.length === 0){
					this.throwError();
					return;
				} else {
					this.state.targetNodes.forEach(function(nodeTrueAddress){
						if (this.state.errorState){
							return;
						}
						var targetNode = this.allNodes.getNode(nodeTrueAddress);
						if (!targetNode){
							this.state.failure = `edgeMaker : no node found at nodeTrueAddress=${nodeTrueAddress}`
							this.throwError();
							this.state.errorState = true;
							return;
						} else {
							targetNodes.push(targetNode);
						}
					}, this)
					if (this.state.errorState){
						return;
					}
				}
				this.state.multipleTargets = false;
			} else {
				var targetNode = this.allNodes.getNode(this.state.targetNode);
				if (!targetNode){
					this.throwError();
					return;
				}
				targetNodes.push(targetNode)
			}
			if (this.state.symmetricEdge){
				targetNodes.forEach(function(targetNode){
					console.log(`attaching ${activeNode.name} to ${targetNode.name}`)
					if (!this.state.shouldConcat){
						activeNode.attach(targetNode);
					} else {
						this.appendEdge(activeNode, targetNode)
					}
				}, this)
			} else {
				targetNodes.forEach(function(targetNode){
					if (!this.state.shouldConcat){
						activeNode.attachTo(targetNode);
					} else {
						this.appendEdge(activeNode, targetNode)
					}
				}, this)
			}
			this.state.appending = false;
			this.state.activeNode = null;
			this.state.targetNode = null;
			this.state.targetNodes = [];
		} else if (this.state.deleting){
			var activeNode = this.allNodes.getNode(this.state.activeNode);
			var targetNodes = [];
			if (!activeNode){
				this.throwError();
				return;
			}
			if (this.state.multipleTargets){
				if (this.state.targetNodes.length === 0){
					this.throwError();
					return;
				} else {
					this.state.targetNodes.forEach(function(nodeTrueAddress){
						if (this.state.errorState){
							return;
						}
						var targetNode = this.allNodes.getNode(nodeTrueAddress);
						if (!targetNode){
							this.state.failure = `edgeMaker : no node found at nodeTrueAddress=${nodeTrueAddress}`
							this.throwError();
							this.state.errorState = true;
							return;
						} else {
							targetNodes.push(targetNode);
						}
					}, this)
					if (this.state.errorState){
						return;
					}
				}
				var targetNode = this.allNodes.getNode(this.state.targetNode);
				if (!targetNode){
					this.throwError();
					return;
				}
				targetNodes.push(target)
			}
			if (this.state.symmetricEdge){
				targetNodes.forEach(function(targetNode){
					if (!this.state.shouldConcat){
						activeNode.detach(targetNode.name);
						targetNode.detach(activeNode.name);
					} else {
						this.appendEdge(activeNode, targetNode, true);
					}
				}, this)
			} else {
				targetNodes.forEach(function(targetNode){
					if (!this.state.shouldConcat){
						activeNode.detach(targetNode.name);
					} else {
						this.appendEdge(activeNode, targetNode, true);
					}
				})
			}
			this.state.deleting = false;
			this.state.activeNode = null;
			this.state.targetNode = null;
			this.state.targetNodes = [];
		}
		this.state.compiling = false;
	};


	graphCompiler.appendEdge = function (nodeA, nodeB, isDeletion) {
		var diffString = this.state.existingDiff;
		console.log(diffString);
		var truAddressA = nodeA.getTrueAddress();
		var truAddressB = nodeB.getTrueAddress();
		var nnTruAddress = nodeA._meta.getTrueAddress();
		var dbTruAddress = nodeA._meta._meta.getTrueAddress();
		var directionalBool = !this.state.symmetricEdge;
		console.log(`directionalBool = ${directionalBool}` )

		const initializeNodeNetDiff = function (nodeNetTrueAddress) {
			var string = `#${nodeNetTrueAddress}[()()]`;
			return string;

		};
		const initializeDataBankDiff = function (dataBankTrueAddress) {
			var string = `$${dataBankTrueAddress}%`;
			return string;
		};
		const shouldAppendDBDiff = function (diffString, dataBankTrueAddress){
			console.log(diffString)
			console.log(diffString.includes(`$${dataBankTrueAddress}`))
			return (!diffString.includes(`$${dataBankTrueAddress}`));
		};
		const shouldAppendNNDiff = function (diffString, nodeNetTrueAddress, dbTruAddress){
			if (shouldAppendDBDiff(diffString, dbTruAddress)){
				console.log(`earlyRet`)
				return;
			} else {
				console.log('didnt early ret')
				var startIndex = diffString.indexOf(`$${dbTruAddress}`);
				var dbSubstring = diffString.substring(startIndex);
				var endIndex = dbSubstring.indexOf(`%`);
				dbSubstring = dbSubstring.substring(0, endIndex);
				return (!dbSubstring.includes(`#${nodeNetTrueAddress}[`))
			}
		};
		const appendDBDiff = function (diffString, dbTruAddress) {
			return diffString + `$${dbTruAddress}%`
		}
		const appendNNDiff = function (diffString, nodeNetTrueAddress, dbTruAddress) {
			var dbTruAddressString = dbTruAddress.toString();
			var dbTruAddressLength = dbTruAddressString.length;
			var insertIndex = diffString.indexOf(`$${dbTruAddressString}`) + (1 + dbTruAddressLength);
			var preprendString = diffString.substring(0,insertIndex);
			var postpendString = diffString.substring(insertIndex);
			var returnString = preprendString + `#${nodeNetTrueAddress}[()()]` + postpendString;
			return returnString;
		};
		const appendDeleteEdge = function (diffString, nodeTrueAddress, targetTrueAddress, nodeNetTrueAddress, dbTruAddress, isDirectionalEdge, isDeletion){
			var dbTruAddressString = dbTruAddress.toString();
			var dbTruAddressLength = dbTruAddressString.length;
			var dbSubstringIndex = diffString.indexOf(`$${dbTruAddressString}`) + (1 + dbTruAddressLength);

			var dbSubstring = diffString.substring(dbSubstringIndex);
			dbSubstring = dbSubstring.substring(0, dbSubstring.indexOf('%'));

			var nnTruAddressString = nodeNetTrueAddress.toString();
			var nnTruAddressLength = nnTruAddressString.length;
			var nodeNetSubstringIndex = dbSubstring.indexOf(`#${nnTruAddressString}[`);

			var nnSubstring = dbSubstring.substring(nodeNetSubstringIndex);
			nnSubstring = nnSubstring.substring(0, nnSubstring.indexOf(']'));

			var edgeListStartIndex = nnSubstring.lastIndexOf('(') + 1;
			var edgeListEndIndex = nnSubstring.lastIndexOf(')');
			var edgeListSubstring = nnSubstring.substring(edgeListStartIndex, edgeListEndIndex);

			var nodeTrueAddressString = nodeTrueAddress.toString();
			var nodeTrueAddressLength = nodeTrueAddressString.length;

			var checkStringS1 = `a${nodeTrueAddress}=`;
			var checkStringS2 = `a${nodeTrueAddress}={`;
			var checkStringD1 = `a${nodeTrueAddress}>`;
			var checkStringD2 = `a${nodeTrueAddress}>{`;
			if (isDeletion){
				checkStringS1 = `d${nodeTrueAddress}=`;
				checkStringS2 = `d${nodeTrueAddress}={`;
				checkStringD1 = `d${nodeTrueAddress}>`;
				checkStringD2 = `d${nodeTrueAddress}>{`;
			}


			if (!isDirectionalEdge){
				if (edgeListSubstring.includes(checkStringS1)){
					if (edgeListSubstring.includes(checkStringS2)){
						var targetListStartIndex = edgeListSubstring.indexOf(checkStringS2) + 3 + nodeTrueAddressLength;
						var targetListSubstring = edgeListSubstring.substring(targetListStartIndex)
						var targetListEndIndex = targetListSubstring.indexOf('}')
						targetListSubstring = targetListSubstring.substring(0, targetListEndIndex);
						if (targetListSubstring.includes(targetTrueAddress)){
							return;
						} else {
							var insertIndex = dbSubstringIndex + nodeNetSubstringIndex + edgeListStartIndex + + targetListStartIndex + targetListEndIndex;
							var prependString = diffString.substring(0,insertIndex);
							var postpendString = diffString.substring(insertIndex);
							var appendThis = `,${targetTrueAddress}`
							return prependString + appendThis + postpendString;
						}
					} else {
						var targetListStartIndex = (edgeListSubstring.indexOf(checkStringS1) + 2 + nodeTrueAddressLength);
						var prevTarget = "";
						for (var i = targetListStartIndex; i < edgeListSubstring.length ; i++){
							var addressLetters = ['0','1','2','3','4','5','6','7','8','9']
							if (addressLetters.includes(edgeListSubstring[i])){
								prevTarget += edgeListSubstring[i];
							} else {
								break;
							}
						}
						var prevTargetLength = prevTarget.length
						var appendThis = `{${prevTarget},${targetTrueAddress}}`
						var insertIndex = dbSubstringIndex + nodeNetSubstringIndex + edgeListStartIndex + targetListStartIndex;
						var prependString = diffString.substring(0,insertIndex);
						var postpendString = diffString.substring(insertIndex + prevTargetLength);
						return prependString + appendThis + postpendString;
					}
				} else {
					var insertIndex = dbSubstringIndex + nodeNetSubstringIndex + edgeListEndIndex;
					var appendThis = `${nodeTrueAddress}=${targetTrueAddress}`;
					if (isDeletion){
						appendThis = `d` + appendThis;
					} else {
						appendThis = `a` + appendThis;
					}
					var prependString = diffString.substring(0,insertIndex);
					var postpendString = diffString.substring(insertIndex);
					return prependString + appendThis + postpendString;
				}
			} else {
				if (edgeListSubstring.includes(checkStringD1)){
					if (edgeListSubstring.includes(checkStringD2)){
						var targetListStartIndex = edgeListSubstring.indexOf(checkStringD2) + 3 + nodeTrueAddressLength;
						var targetListSubstring = edgeListSubstring.substring(targetListStartIndex)
						var targetListEndIndex = targetListSubstring.indexOf('}')
						targetListSubstring = targetListSubstring.substring(0, targetListEndIndex);
						if (targetListSubstring.includes(targetTrueAddress)){
							return;
						} else {
							var insertIndex = dbSubstringIndex + nodeNetSubstringIndex + edgeListStartIndex + targetListStartIndex + targetListEndIndex;
							var prependString = diffString.substring(0,insertIndex);
							var postpendString = diffString.substring(insertIndex);
							var appendThis = `,${targetTrueAddress}`
							return prependString + appendThis + postpendString;
						}
					} else {
							var targetListStartIndex = edgeListSubstring.indexOf(checkStringD1) + 2 + nodeTrueAddressLength;
						var prevTarget = "";
						for (var i = targetListStartIndex; i < (edgeListSubstring.length) ; i++){
							if (['0','1','2','3','4','5','6','7','8','9'].includes(edgeListSubstring[i])){
								prevTarget += edgeListSubstring[i];
							} else {
								break;
							}
						}
						var appendThis = `{${prevTarget},${targetTrueAddress}}`
						var insertIndex = dbSubstringIndex + nodeNetSubstringIndex + edgeListStartIndex + targetListStartIndex;
						var prependString = diffString.substring(0,insertIndex);
						var postpendString = diffString.substring(insertIndex);
						return prependString + appendThis + postpendString;
					}
				} else {
					var insertIndex = dbSubstringIndex + nodeNetSubstringIndex + edgeListEndIndex;
					var appendThis = `${nodeTrueAddress}>${targetTrueAddress}`;
					if (isDeletion){
						appendThis = `d` + appendThis;
					} else {
						appendThis = `a` + appendThis;
					}
					var prependString = diffString.substring(0,insertIndex);
					var postpendString = diffString.substring(insertIndex);
					return prependString + appendThis + postpendString;
				}
			}
		};


		if (shouldAppendDBDiff(diffString, dbTruAddress)){
			diffString = appendDBDiff(diffString, dbTruAddress);
		};
		
		if (shouldAppendNNDiff(diffString, nnTruAddress, dbTruAddress)){
			diffString = appendNNDiff(diffString, nnTruAddress, dbTruAddress);
		};
		diffString = appendDeleteEdge(diffString, truAddressA, truAddressB, nnTruAddress, dbTruAddress, directionalBool, isDeletion)
		console.log(diffString)
		this.state.existingDiff = diffString;
		return diffString;
	};

	graphCompiler.appendNode = function (node, isDeletion) {
		console.log(node.getTrueAddress())
		console.log(`appendingNodeToDiffString`)

		var diffString = this.state.existingDiff;
		var truAddress = node.getTrueAddress();
		var nnTruAddress = node._meta.getTrueAddress();
		var dbTruAddress = node._meta._meta.getTrueAddress();

		const initializeNodeNetDiff = function (nodeNetTrueAddress) {
			var string = `#${nodeNetTrueAddress}[()()]`;
			return string;

		};
		const initializeDataBankDiff = function (dataBankTrueAddress) {
			var string = `$${dataBankTrueAddress}%`;
			return string;
		};
		const shouldAppendDBDiff = function (diffString, dataBankTrueAddress){
			console.log(diffString)
			console.log(diffString.includes(`$${dataBankTrueAddress}`))
			return (!diffString.includes(`$${dataBankTrueAddress}`));
		};
		const shouldAppendNNDiff = function (diffString, nodeNetTrueAddress, dbTruAddress){
			if (shouldAppendDBDiff(diffString, dbTruAddress)){
				console.log(`earlyRet`)
				return;
			} else {
				console.log('didnt early ret')
				var startIndex = diffString.indexOf(`$${dbTruAddress}`);
				var dbSubstring = diffString.substring(startIndex);
				var endIndex = dbSubstring.indexOf(`%`);
				dbSubstring = dbSubstring.substring(0, endIndex);
				return (!dbSubstring.includes(`#${nodeNetTrueAddress}[`))
			}
		};
		const appendDBDiff = function (diffString, dbTruAddress) {
			return diffString + `$${dbTruAddress}%`
		}
		const appendNNDiff = function (diffString, nodeNetTrueAddress, dbTruAddress) {
			var dbTruAddressString = dbTruAddress.toString();
			var dbTruAddressLength = dbTruAddressString.length;
			var insertIndex = diffString.indexOf(`$${dbTruAddressString}`) + (1 + dbTruAddressLength);
			var preprendString = diffString.substring(0,insertIndex);
			var postpendString = diffString.substring(insertIndex);
			var returnString = preprendString + `#${nodeNetTrueAddress}[()()]` + postpendString;
			return returnString;
		};
		const appendDeleteNode = function (diffString, nodeTrueAddress, nodeNetTrueAddress, dbTruAddress, isDeletion){
			var dbTruAddressString = dbTruAddress.toString();
			var dbTruAddressLength = dbTruAddressString.length;
			var dbSubstringIndex = diffString.indexOf(`$${dbTruAddressString}`) + (1 + dbTruAddressLength);

			var dbSubstring = diffString.substring(dbSubstringIndex);
			dbSubstring = dbSubstring.substring(0, dbSubstring.indexOf('%'));

			var nnTruAddressString = nodeNetTrueAddress.toString();
			var nnTruAddressLength = nnTruAddressString.length;
			var nodeNetSubstringIndex = dbSubstring.indexOf(`#${nnTruAddressString}[`);

			var nnSubstring = dbSubstring.substring(nodeNetSubstringIndex);
			nnSubstring = nnSubstring.substring(0, nnSubstring.indexOf(']'));

			var nodeListStartIndex = nnSubstring.indexOf('(') + 1;
			var nodeListEndIndex = nnSubstring.indexOf(')');
			var nodeListSubstring = nnSubstring.substring(nodeListStartIndex, nodeListEndIndex);

			var nodeTrueAddressString = nodeTrueAddress.toString();
			var nodeTrueAddressLength = nodeTrueAddressString.length;

			var checkStringS1 = `a${nodeTrueAddress}`;
			if (isDeletion){
				checkStringS1 = `d${nodeTrueAddress}`;
			}


	
			if (nodeListSubstring.includes(checkStringS1)){
					return diffString;
			} else {
				var insertIndex = dbSubstringIndex + nodeNetSubstringIndex + nodeListEndIndex;
				var appendThis = `${nodeTrueAddress}`;
				if (isDeletion){
					appendThis = `d` + appendThis;
				} else {
					appendThis = `a` + appendThis;
				}
				var prependString = diffString.substring(0,insertIndex);
				var postpendString = diffString.substring(insertIndex);
				return prependString + appendThis + postpendString;
			}
			
		};


		if (shouldAppendDBDiff(diffString, dbTruAddress)){
			diffString = appendDBDiff(diffString, dbTruAddress);
		};
		
		if (shouldAppendNNDiff(diffString, nnTruAddress, dbTruAddress)){
			diffString = appendNNDiff(diffString, nnTruAddress, dbTruAddress);
		};
		diffString = appendDeleteNode(diffString, truAddress, nnTruAddress, dbTruAddress, isDeletion)
		console.log(diffString)
		this.state.existingDiff = diffString;
		return diffString;
	};


	graphCompiler.resetState = function () {

	};

	graphCompiler.getState = function () {
		return this.state;
	};
	graphCompiler.throwError = function () {
		var state = this.getState();
		var message = 'GRAPH_MOD_ERROR: ' + state.failure + `\n`
		Object.keys(state).forEach(function(key){
			if (key === 'failure' || key === 'errorState'){
				return;
			}
			message += `${key} : ${state[key]}\n`
		}, this)
		console.log(message)
		return;
	}

	const init = function (allNodes) {
		graphCompiler.allNodes = allNodes
		graphCompiler.sigils.forEach(function(sigil){
			graphCompiler.sigilRouter[sigil] = graphCompiler.sigilRouter[sigil].bind(graphCompiler);
		})
		Object.keys(graphCompiler).forEach(function(key){
			if (typeof graphCompiler[key] === 'function'){
				graphCompiler[key] = graphCompiler[key].bind(graphCompiler)
			}
		}, this)
	}
	init(allNodes);
	return graphCompiler;
}
export const nodeAttachmentHandlerConstructor = function (nodeVerse, saveFileManager) {
	/*
		nomenclaturewise, "nodeAttachmentHandler" is kinda wrong...
		it should act as an API for savefilemanagement/ node creation et all...
		When nodes do their functions... they should route through here...
		that way everthing is persistent between browser sessions,
		so long as folks' caches don't get cleared
	*/
	const nodeAttachmentHandler = {};
	const init = function (nodeVerse, saveFileManager) {
		nodeAttachmentHandler.nodeVerse = nodeVerse;
		nodeVerse.nodeAttachmentHandler = nodeAttachmentHandler;
		nodeAttachmentHandler.saveFileManager = saveFileManager;
		saveFileManager.nodeAttachmentHandler = nodeAttachmentHandler;
	};

	nodeAttachmentHandler.replaceWritableWithUserWritable = function (nodeTrueAddressA, name, text){
		console.warn(`NOT A COMPLETE FUNCTION`)

		var targetNode = this.nodeVerse.getNode(nodeTrueAddressA);
		Object.keys(targetNode.adjacencies).forEach(function(nodeName){
			var trueAddress = targetNode.adjacencies[nodeName].getTrueAddress();
			this.detachNodes(nodeTrueAddressA, nodeTrueAddressB);
		}, this)

	}

	nodeAttachmentHandler.updateUserWritable = function (name, text, wIndex){
		this.nodeVerse.updateUserWritableNode(name, text, wIndex);
	}

	nodeAttachmentHandler.updateUserExecutable= function (name, text, eIndex, executable){
		console.warn(`NOT A COMPLETE FUNCTION`);
		this.nodeVerse.updateUserWormTongue(name, text, eIndex, executable)
	}

	nodeAttachmentHandler.appendUserExecutable = function (activeNodeTrueAddress, name, text, executable){
		var userNode = this.nodeVerse.createUserExecutable(name, text, executable);
		if (!userNode || !userNode.name){
			console.log('no userNOde')
			return;
		}
		var activeNode = this.nodeVerse.getNode(activeNodeTrueAddress);
		if (!activeNode || !activeNode.name){
			console.log('no activeNode')
			return;
		}
		var nodeNetTrueAddress = activeNode._meta.getTrueAddress();
		if (!nodeNetTrueAddress && nodeNetTrueAddress !== 0){
			console.log('no nodeNet')
			console.log(activeNode)
			return;
		}
		var dataBankTrueAddress = activeNode._meta._meta.getTrueAddress();
		if (!dataBankTrueAddress && dataBankTrueAddress !== 0){
			console.log('no databank')
			return;
		}
		var userNodeTrueAddress = userNode.getTrueAddress();
		if (!userNodeTrueAddress){
			console.log(`no usernode address`)
		} else {
			console.log(userNodeTrueAddress)
		}
		console.log('appending');
		this.saveFileManager.appendEdge(activeNodeTrueAddress, userNodeTrueAddress, nodeNetTrueAddress, dataBankTrueAddress, false, false);
		console.log('attaching');
		activeNode.attach(userNode);
	}

	nodeAttachmentHandler.appendUserWritable = function (activeNodeTrueAddress, name, text) {
		var userNode = this.nodeVerse.createUserWritableNode(name, text);
		if (!userNode || !userNode.name){
			console.log('no userNOde')
			return;
		}
		var activeNode = this.nodeVerse.getNode(activeNodeTrueAddress);
		if (!activeNode || !activeNode.name){
			console.log('no activeNode')
			return;
		}
		var nodeNetTrueAddress = activeNode._meta.getTrueAddress();
		if (!nodeNetTrueAddress && nodeNetTrueAddress !== 0){
			console.log('no nodeNet')
			console.log(activeNode)
			return;
		}
		var dataBankTrueAddress = activeNode._meta._meta.getTrueAddress();
		if (!dataBankTrueAddress && dataBankTrueAddress !== 0){
			console.log('no databank')
			return;
		}
		var userNodeTrueAddress = userNode.getTrueAddress();
		if (!userNodeTrueAddress){
			console.log(`no usernode address`)
		} else {
			console.log(userNodeTrueAddress)
		}
		console.log('appending');
		this.saveFileManager.appendEdge(activeNodeTrueAddress, userNodeTrueAddress, nodeNetTrueAddress, dataBankTrueAddress, false, false);
		console.log('attaching')
		activeNode.attach(userNode);
	}

	nodeAttachmentHandler.appendUserWormTongue = function () {
		var userNode = this.nodeVerse.createNewUserWormTongueNode(name, text);
		if (!userNode || !userNode.name){
			return;
		}
		var activeNode = this.nodeVerse.getNode(activeNodeTrueAddress);
		if (!activeNode || !activeNode.name){
			return;
		}
		var nodeNetTrueAddress = activeNode._meta.getTrueAddress();
		if (!nodeNetTrueAddress){
			return;
		}
		var dataBankTrueAddress = activeNode._meta._meta.getTrueAddress();
		if (!dataBankTrueAddress){
			return;
		}
		var userNodeTrueAddress = userNode.getTrueAddress();
		this.saveFileManager.appendEdge(activeNodeTrueAddress, userNodeTrueAddress);
		activeNode.attach(userNode);
	}

	nodeAttachmentHandler.detachNodes = function (nodeTrueAddressA, nodeTrueAddressB){
		var nodeA = this.nodeVerse.getNode(nodeTrueAddressA);
		if (!nodeA || !nodeA.name){
			return;
		}
		var nodeB = this.nodeVerse.getNode(nodeTrueAddressB);
		if (!nodeB || !nodeB.name){
			return;
		}
		var nodeNetTrueAddress = nodeA._meta.getTrueAddress();
		if (!nodeNetTrueAddress){
			return;
		}
		var dataBankTrueAddress = nodeA._meta._meta.getTrueAddress();
		if (!dataBankTrueAddress){
			return;
		}
		//terminal arg bools swapped in graphcompiler instantiation and savefileManager instantiation
		//still need to handle the guo ran detachment
		this.saveFileManager.appendEdge(nodeTrueAddressA, nodeTrueAddressB, nodeNetTrueAddress, dataBankTrueAddress, true);


	} 

	nodeAttachmentHandler.attachNodes = function (nodeTrueAddressA, nodeTrueAddressB) {
		var nodeA = this.nodeVerse.getNode(nodeTrueAddressA);
		if (!nodeA || !nodeA.name){
			return;
		}
		var nodeB = this.nodeVerse.getNode(nodeTrueAddressB);
		if (!nodeB || !nodeB.name){
			return;
		}

		var nodeNetTrueAddress = nodeA._meta.getTrueAddress();
		if (!nodeNetTrueAddress){
			return;
		}
		var dataBankTrueAddress = nodeA._meta._meta.getTrueAddress();
		if (!dataBankTrueAddress){
			return;
		}
		//terminal arg bools swapped in graphcompiler instantiation and savefileManager instantiation
		//of the "appendEdge" file...
		this.saveFileManager.appendEdge(nodeTrueAddressA, nodeTrueAddressB, nodeNetTrueAddress, dataBankTrueAddress, false);
		nodeA.attach(nodeB)
	};

	nodeAttachmentHandler.attachNodeTo = function (nodeTrueAddressA, nodeTrueAddressB){
		var nodeA = this.nodeVerse.getNode(nodeTrueAddressA);
		if (!nodeA || !nodeA.name){
			return;
		}
		var nodeB = this.nodeVerse.getNode(nodeTrueAddressB);
		if (!nodeB || !nodeB.name){
			return;
		}

		var nodeNetTrueAddress = nodeA._meta.getTrueAddress();
		if (!nodeNetTrueAddress){
			return;
		}
		var dataBankTrueAddress = nodeA._meta._meta.getTrueAddress();
		if (!dataBankTrueAddress){
			return;
		}
		//terminal arg bools swapped in graphcompiler instantiation and savefileManager instantiation
		//of the "appendEdge" file...
		this.saveFileManager.appendEdge(nodeTrueAddressA, nodeTrueAddressB, nodeNetTrueAddress, dataBankTrueAddress, false, true);
		nodeA.attachTo(nodeB)
	}


	init(nodeVerse, saveFileManager);
	return nodeAttachmentHandler
}
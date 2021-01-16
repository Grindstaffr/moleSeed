export const nodeAttachmentHandlerConstructor = function (nodeVerse, saveFileManager) {
	const nodeAttachmentHandler = {};
	const init = function (nodeVerse, saveFileManager) {
		nodeAttachmentHandler.nodeVerse = nodeVerse;
		nodeAttachmentHandler.saveFileManager = saveFileManager;
	};

	attachNodes = function (nodeTrueAddressA, nodeTrueAddressB) {
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

		this.saveFileManager.appendEdge(nodeTrueAddressA, nodeTrueAddressB, nodeNetTrueAddress, dataBankTrueAddress);
		nodeA.attach(nodeB)
	};

	attachNodeTo = function (nodeTrueAddressA, nodeTrueAddressB){
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

		this.saveFileManager.appendEdge(nodeTrueAddressA, nodeTrueAddressB, nodeNetTrueAddress, dataBankTrueAddress, true);
		nodeA.attachTo(nodeB)
	}


	init(nodeVerse, saveFileManager);
	return nodeAttachmentHandler
}
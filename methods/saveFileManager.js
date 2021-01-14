export const saveFileManagerConstructor = function () {
	const saveFileManager = {};
	const init = function (parent) {
		saveFileManager.parent = parent;
		saveFileManager.api = parent.api;
		saveFileManager.nodeVerse = parent.nodeVerse;
		saveFileManager.parser = {};
		saveFileManager.data = {
			graphDiffString : "",
			prgmList : "",
			storedNodes : "",
			activeNode: "",
			hist: "",
		};

	};
	saveFileManager.appendEdgeToHist = function (trueAddress) {
		this.data.hist = this.data.hist + '>' + trueAddress
	};
	saveFileManager.appendEdgeByNodeName = function (nodeNameA, nodeNameB){
		var matchingNodesA = this.nodeVerse.findNodesByName(nodeNameA)
		var matchingNodesB = this.nodeVerse.findNodesByName(nodeNameB)
		if (matchingNodesA.length === 0){
			console.log(`${nodeNameA} not found....`);
			return;
		};
		if (matchingNodesB.length === 0){
			console.log(`${nodeNameB} not found....`);
			return;
		};


	};
	saveFileManager.appendEdge = function (truAddressA, truAddressB) {
		
		var truAddressA = 
		if (this.data.graph)
		this.data.graphDiffString
	};
	saveFileManager.deleteEdge = function () {

	};
	saveFileManager.addProgram = function(){

	};
	saveFileManager.deleteProgram = function () {

	};
	saveFileManager.addStoredNode = function () {

	};
	saveFileManager.removeStoredNode = function () {

	};
	saveFileManager.setActiveNode = function () {

	};
	saveFileManager.generateCompressedSaveFile = function () {
		Object.keys() 
	};

	init();


	return saveFileManager;
}
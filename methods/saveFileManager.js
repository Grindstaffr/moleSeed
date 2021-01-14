export const saveFileManagerConstructor = function (parent) {
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

		matchingNodesA.forEach(function(trueAddress){

		})
		matchingNodesB.forEach(function(trueAddress){

		})
	};
	saveFileManager.appendEdge = function (truAddressA, truAddressB) {
		
		var truAddressA = 'fart'
		if (this.data.graph) {

		}
		var x = this.data.graphDiffString
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

	init(parent);


	return saveFileManager;
}
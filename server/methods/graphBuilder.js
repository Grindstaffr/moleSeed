exports.sayHello = function () {
	console.log(`I'M BUILDING A GRAPH`)
}

const defaultGraph = {
	nodes : ['a', 'b', 'c', 'd'],
	edges : [{ 'a' : 'b', sym : true}, {'b' : 'c', sym : true}, { 'b' : 'd', sym : false}],
}

const getDefaultGraph = function () {
	var defaultGraph = {
		nodes : '',
		edges : '',
	}
	return defaultGraph;
};
const parseSaveString = function (saveString, returnObj) {
	if (!returnObj){
		returnObj = {
			adds : [],
			dels : [],
		}
	}

	if (saveString[0] === 'd'){
		var sub = saveString.substring(1);
		var chopSpot = Math.min(sub.indexOf('d'), sub.indexOf('a'))
		var valueString = sub.substring(0,chopSpot);
		returnObj.dels.push(valueString);
		return parseSaveString(sub.substring(chopSpot), returnObj)

	}
	if (saveString[0] === 'a'){
		var sub = saveString.substring(1);
		var chopSpot = Math.min(sub.indexOf('d'), sub.indexOf('a'))
		var valueString = sub.substring(0,chopSpot);
		returnObj.adds.push(valueString);
		return parseSaveString(sub.substring(chopSpot), returnObj)
	}

	return returnObj
};

const parseEdgeArrays = function (edgeArrayObj){
	const returnObj = {
		adds : [],
		dels : [],
	};

	edgeArrayObj.adds.forEach(function(edgeString){
		var sym = edgeString.indexOf("s");
		var right = edgeString.indexOf("r");
		
		if (sym !== -1){
			var node_a = edgeString.substring(0,sym);
			var node_b = edgeString.substring(sym + 1);
			returnObj.adds.push([node_a,node_b])
			returnObj.adds.push([node_b,node_a])
			return;
		}
		if (right !== -1){
			var node_a = edgeString.substring(0,right);
			var node_b = edgeString.substring(right + 1);
			returnObj.adds.push([node_a,node_b])
			return;
		}


	},this);
	edgeArrayObj.dels.forEach(function(edgeString){
		var sym = edgeString.indexOf("=");
		var left = edgeString.indexOf("<");
		
		if (sym !== -1){
			var node_a = edgeString.substring(0,sym);
			var node_b = edgeString.substring(sym + 1);
			returnObj.dels.push([node_a,node_b])
			returnObj.dels.push([node_b,node_a])
			return;
		}
		if (left !== -1){
			var node_a = edgeString.substring(0,left);
			var node_b = edgeString.substring(left + 1);
			returnObj.dels.push([node_a,node_b])
			returnObj.dels.push([node_b,node_a])
			return;
		}	


	},this);
}



exports.build = function (nodeStr, edgeStr, activeNodeName){
	/*
		I believe that this is the most condensed way to store alterations
		to the graph in save files...

		nodeStr = "[a || d][nodeTruAddress]...(repeat as needed)"
			where 
				a => add node;
				b => del node;
			and both "a" and "d" serve as breaks between nodeaddresses

		edgeStr = "[a || d][nodeTruAddress_1][s || l][nodeTruAddress_2]...(repeat as needed)"
			where 
				a => add edge;
				b => del edge;
				s => symetric edge;
				r => right edge (e.g. a->b && !(b->a))
			and both "a" and "d" serve as breaks between nodeaddresses
	*/
	var nodeListModObject = parseSaveString(nodeStr);
	var edgeListModObject = parseEdgeArrays(parseSaveString(edgeString));


	var graph = getDefaultGraph();

	Object.keys(nodesObj).forEach(function(nodeName){
		if (nodesObj[nodeName] === 'add'){
			if (nodes.indexOf(nodeName) === -1){
				nodes.push(nodeName);
			} else {
				nodes.push(findFreeName(nodeName, graph.nodes))
			}
		}
	}, this)

	
}
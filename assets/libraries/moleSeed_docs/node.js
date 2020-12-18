export const doc = {
	name : `nodes`,
	text : `--- User documentation for moleSeed ---
	\\n   - Description and Classification of Nodes - 
    \\n   -- MX --
	\\n
	\\n SECTION 1A - Introduction
	\\n \\t The term "node" comes from graph theory, a field of mathematics concerning graphs. A "graph" is a set of vertices and edges, where each edge consists of a pair of vertices. For example consider graph "G":
	\\n
	\\n      A----B----C
	\\n           |   /         
	\\n           | /
    \\n           D
    \\n 
    \\n This is a graph drawn in "graphical" form. It can also be described without loss of information as:
    \\n
    \\n G = { { A, B, C, D }, { AB, BC, BD, CD } }
    \\n
    \\n \\t "Node" operates as a synonym for vertex, and as such, is one of the primary building blocks of a graph.
    \\n \\t Within moleSeed, the term "node" means something beyond this mathematical definition. While each moleSeed node is a graph node, a moleSeed node carries far more information and utility than a single symbolic vertex, just as a moleSeed nodenet carries far more information and utility than a simple set of edges and verticies.
    \\n \\t moleSeed uses a graph-based architecture, where each instance of moleSeed acts as a node, and each tunnel between instances of moleSeed acts as an edge. moleSeed nodes are not uniform, which is to say that moleSeed has many different types of nodes that behave differently and carry different data.
    \\n 
    \\n SECTION 1B - Nodes
    \\n \\t A "Node" is defined here as a single instance of moleSeed running on some hardware. A single computer may have multiple instances of moleSeed running on it, as each instance of moleSeed is small enough as to be unnoticable. Nodes can be bound to specific data objects or have independent cached data storage. We distinguish between these types of nodes by calling nodes that are bound to specific data objects "static nodes", and nodes that have their own caches as "free nodes."
    \\n \\t Each node maintains a dynamically updated value "node depth" which refers to the total free memory in a system. "Moving to" a node with a terminal links the instance of moleSeed with the terminal, so that the terminal can act on the instance. When a node is moved to, it is declared "active" on the client-side, and the terminal remote is passed to the active node, allocating free memory in the system to the terminal remote. When the node depth value is less than the memory requirement of the terminal remote, the terminal remote cannot declare the node as active, as the moleSeed instance would not be able to coexist with both the terminal remote and the kernel of the system its embedded in. When two or more nodes share a system, they also share a node depth value.
    \\n \\t All nodes keep track of adjacent nodes, as well as those nodes' depth values, and types. 
    \\n \\t Nodes are instantiated dynamically by seedware, initializer executables which create self-replicating nodelets which wedge their way into fragmented memory, before inheriting node-type properties. As such, some nodes may lack bound data objects or caches, but remain as artifacts of the nodenet's genesis. These nodes are called "regular" or "vanilla" nodes and are typed in the terminal as simply "node".
    \\n
    \\n SECTION 2A - Static Nodes
    \\n \\t Static nodes are instantiated on data structures that are larger than the node's depth. It is not feasible to cache the data, duplicating it, and bringing it into moleSeed, so moleSeed builds a system for accessing the data. As such, static nodes cannot be cached by the terminal remote, and their bound data structures must be accessed by means of an interface.
    \\n \\t See : library, hardware, repository
    \\n
    \\n SECTION 2B - Free Nodes
    \\n \\t Free nodes are instantiated on data objects that are significantly smaller than the node's depth. As such, the data object can be cached within the moleSeed instance/node, and these nodes can in turn be cloned and cached in a terminal remote.
    \\n \\t Note that caching nodes in a terminal remote does not cache adjacencies. A terminal remote is not an instance of moleSeed, and as such, a terminal remote is not really adjacent to, or linked to, anything apart from the active node. 
    \\n \\t See : readable, directory, program
    \\n
    \\n SECTION 2C - Nodelets
    \\n \\t Nodelets are instantiated on data objects smaller than the node's depth when node depth is fairly minimal, or when the data object would have value being cached by the terminal remote. In the case that the micro-nodes have shallow or near-zero depth values they cannot support a terminal activating them. When nodelets are instantiated in memory with a large depth value, they are still treated as if they had 0 depth. 
    \\n Nodelets are created by static nodes when a terminal remote requests a certain subset of the bound data structure. Nodelets can be adjacent to other nodes, but no nodes are adjacent to them. Terminal remotes cannot declare a nodelet as active. 
    \\n Nodelets' utility comes from their overall small size, and the ability to cache them within the terminal remote without needlessly increasing the terminal's memory usage. 
    \\n \\t See : library_file
    \\n
    \\n SECTION 2D - Nodeware
    \\n \\t Nodeware is a node bound privately to an executable stored with it in memory. Many instances of node-ware take advantage of self-replication, whereby they will manufacture large cloned quantities of some subsection of their codebase, and execute it. Self-replication and non-terminal recursive functions spread extremely quickly through a nodenet, and as such, by default, Nodeware instances are non-cloneable themselves.
    \\n \\t (back in v.2.12.09, Nodeware was cloneable, much like a text file, or a vanilla node, or whatever else, and someone wrote some wormware which found its own wormware file in the nodenet and executed itself. Over and over again, about 1000 times per milisecond. For 4 weeks, the nodenet was completely unstable. Node adjacencies appeared and disappeared within nanoseconds, and nothing was accessible. That doesn't happen anymore. There are strict upper bounds on duplication, all self-replicating programs must self-terminate, and any self-replicating program cannot be cloned.) 
    \\n \\t See: moleware, seedware, wormware, recruiter, injector
	`
}
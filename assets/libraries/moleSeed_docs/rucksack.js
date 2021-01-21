export const doc = {
	name : `rucksack`,
	address : 'l7',
	text : `\\n rucksack.ext v.0.6.14 
	\\n  -- panmi --
	\\n  
	\\t rucksack.ext is an extension for the moleSeed Terminal that allows for the storage of up to 8 nodes. 
\\n \\t Unlike traditional memory storage, rucksack.ext does not utilize static memory. Like moleSeed itself, rucksack.ext doesn't run from a static cache of code, and instead finds unallocated deposits of memory to commandeer. Through extensive testing, we've found that rucksack can store eight nodes through Dynamic Memory Commandeering (DMC) without triggering anti-malware measures on all systems that aren't running PanOptic, in which case, rucksack.ext can store up to four nodes without consequence.
\\n \\t Nodes can be captured and stored with rucksack.ext with the use of the "grab" syntax, which will be available upon install.
\\n \\t "grab" takes 2 arguments (node, slot) separated by an "into," or, if you are familiar with reading moleSeed syntax "grab [NODE] into [NUMBER]".
\\n \\t e.g. "grab seed into 1"
\\n  
\\n \\t The term "rummage" acts as a shortcut for "ex rucksack.ext", which displays stored nodes in the top third of the terminal, and allows you to treat them as accessible nodes for the purposes of node-specific commands.
\\n \\t NOTE: rucksack.ext does not store node adjacencies.
\\n \\t UPDATE (MX) - rucksack.ext is currently on iteration v.2.3.12, and while panmi coerces other people into writing documentation, panmi's own stuff is often outdated and misleading. panmi wrote rucksack to be arbitrarily large, and then got a whole nodeNet fragged when panmi brought a couple gigs into a 4M databank. panmi thought it was due to having 900 nodes, but node count is irrelevant. It's all about memory usage. KETL and ludd rewrote node nav to keep panmi-type behaviour from bringing nets down, so now movement is a little slower, cause everyone's gotta handshake. PanOptic doesn't fucking matter. It's outdated. But thanks to panmi, rucksack now has a child-lock on it that panmi believes is entirely necessary for other users. Even though ludd explained the node nav update. `
}
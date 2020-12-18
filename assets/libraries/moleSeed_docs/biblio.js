export const doc = {
	name : `biblio`,
	text : `
	\\n --- biblio v 0.16.42 --- 
	\\n -- panmi --
	\\n
	\\n \\t biblio.ext is an interface for library nodes. You have to type "biblio" before you type another command. I hope to have this updated in the future, so that you only have to type one command, but system_ludd does not like doing things for me. Likewise, I would like for biblio to function not just when the terminal remote is on a library node, but also when it is adjacent to a library node.  system_ludd has informed me that this too is infeasable.
	\\n 
	\\n  COMMANDS : 
	\\n \\t search - (biblio search [search term]) - biblio asks the library which files contain the search term. The default search will only return true if it matches a complete word. Partial word matches are possible.//note to self: find what parameters allow the user to edit the search engine and put them here
	\\n \\t help - (biblio help) - lists all these commands in the terminal
	\\n \\t request - (biblio request [file name]) - asks the library to generate a nodelet out of the requested text entity. If the library finds a file, it will create a nodelet that can be read by reader.ext.
	\\n \\t next/prev - (biblio next/prev) - if a search returns a list of filenames larger than the biblio screen buffer can fit on one page, you can cycle though pages with "biblio next" and "biblio prev"

	\\n
	\\n UPDATE(ludd): if panmi wants things done in the codebase, panmi can do it. panmi is an adult.

	`
}
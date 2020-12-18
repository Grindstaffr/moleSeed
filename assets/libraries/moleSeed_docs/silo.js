export const doc = {
	name : `silo`,
	text : ` --- silo.ext v.1.04.08 ---
	\\n -- MX --
	\\n
	\\n \\t silo.ext is an expansion for rucksack.ext.(UPDATE: see Footnote) silo acts as a sterile container for recruiters, injectors, and worms that are not bound to another program. By using silo.ext, moleSeed users have a safe, reliable syntax for deploying root-level executables on target systems. 
	\\n
	\\n COMMANDS : 
	\\n \\t arm - (arm [executable]) places an executable into silo, partitioning the executable away from the active node and terminal remote in memory.
	\\n \\t trgt - (trgt [static node]) feeds the partitioned executable address information of a target. The terminal will ping the static node, which will return a memory address of a target system.
	\\n \\t fire - (fire [executable]) executes the armed code while shielding the terminal remote from potential overwrites, code injections, or other deleterous affects.

	\\n NOTE : Since v.0.12.00, (concurrent silo.ext update to KETL's seed rewrite,) the executables that silo manages are single use and self-erasing. As such, system_ludd has written a three step verification to ensure that the user does not needlessly or accidentally expend their executables. 
	\\n
	\\n Footnote (ludd): This architecture is explicitly the kind of dependency stacking non-sense that we set out to avoid when we started the project. The only reason it's not part of rucksack.ext, is because panmi had a giant schphincter rod about worms, recruiter, injectors, and other classical "malware" that's necessary for using moleSeed. panmi spent far too long in corpo-indoctrination-land, and panmi's stupid little brain just couldn't wrap around ideas that conflicted with panmi's solipsistic design principles. The rest of us can listen. Except, maybe KETL... and I can get stubborn... MX is a saint.
	\\n
	\\n UPDATE (ludd) - In spite of hours of arguing, panmi declined to bundle silo.ext with rucksack.ext for reasons that are beyond me. Now that panmi is busy writing a GUI that KETL and I are never going to merge, we've put it on the to do list. I mean, MX wrote 90% of silo's code anyway, and panmi just took credit for it, and built the shitty, glitchy UI top-bar that literally breaks all the time and lingers around when you don't want it to. All the actual work is MX's. MX is too humble in general. She's a saint.
	`
}
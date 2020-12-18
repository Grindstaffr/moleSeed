export const text = `silo.ext v.1.04.08
	\\n
	\\n \\t silo.ext is an expansion for rucksack.ext. silo acts as a sterile container for recruiters, injectors, and worms that are not bound to another program. By using silo.ext, moleSeed users have a safe, reliable syntax for deploying root-level executables on target systems. 
	\\n
	\\n COMMANDS : 
	\\n \\t arm - (arm [executable]) places an executable into silo, partitioning the executable away from the active node and terminal remote in memory.
	\\n \\t trgt - (trgt [static node]) feeds the partitioned executable address information of a target. The terminal will ping the static node, which will return a memory address of a target system.
	\\n \\t fire - (fire [executable]) executes the armed code while shielding the terminal remote from potential overwrites, code injections, or other deleterous affects.

	\\n NOTE : Since v.0.12.00, (concurrent silo.ext update to KETL's seed rewrite,) the executables that silo manages are single use and self-erasing. As such, system_ludd has written a three step verification to ensure that the user does not needlessly or accidentally expend their executables. `
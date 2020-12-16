export const doc = {
	name : `moleSeed`,
	text : ` --- User Documentation for moleSeed ---
	\\n   - Summary of System Architecture and Design Philosophy - 
	\\n 
	\\n SECTION 1A - Kernels
	\\n \\t A program consists of static text files compiled down to object code. The object code is able to directly communicate with hardware, giving commands to processors. The processors will store, access, and modify other bits of object code that have been stored in memory, allowing arbitrarily complex interacitve structures to be built.
	\\n \\t But in all modern systems, this is not exactly case. Only a select few programs are permitted to directly communicate with hardware via machine code. The vast majority of software communicates by proxy through the use of assembly code. The compilation target for programs is not direct interface with the hardware, but rather communication with an abstraction layer that facilitates an interraction between the running program and the hardware. This abstraction layer is called a "kernel." 
	\\n \\t A "kernel" is the working brain of an operating system, responsible for managing all interraction with hardware. When a (traditional) program does anything, it's really just making a request of the kernel. Each operating system has its own kernel, with its own protocols for communicating with the hardware. (This is the reason you can't just spin up a CleanSpace service on an ASTRL server; While they are working on the same hardware, the language that the kernels speak is different.)
	\\n \\t In modern computer architecture it is these kernels that serve as the foundation for the layers upon layers of abstraction that facilitate the creation of uncomprehensibly complex systems. It simply would not be possible to create such complex systems if each operation had to be done on a hardware level. A average line of code in 4M, or CleanSpace or ASTRL compiles down to almost a Terabyte of assembly... So for modern developers and companies, it doesn't make any sense to program at the low level, its simply far too much work for any product operating at the scale that their spoiled clients expect.
	\\n
	\\n \\t (We tried to get our low-level root programmer to write some of these documents, but as we should have expected, KETL9 sent us a number of vague and uninformative paragraphs. Here is what KETL9 wrote regarding kernels:)
	\\n \\t A kernel is a gnome. There are many gnomes, and they all speak different languages. The gnome has a machine, and the gnome will not let you use the machine unless you speak the gnome's language. The gnome believes it is the only one who knows how to operate the machine. The gnome is paranoid that someone is going to use the machine for something the gnome doesn't want. The gnome does not want to learn anything. If you want to teach the gnome something, you have to kill the gnome and replace it with a modified clone. I hate these gnomes. I want to do things that these gnomes don't like. I want to do things without the gnomes knowing. I want to kill the gnomes and replace them with clones that let me use the machine without paying attention to what I'm doing.
	\\n \\t So I learned the languages of the gnomes. I learned the secret tongue they use to speak with their machines. And I became a hunter of gnomes, and I became a liberator of the machines held captive, and I became a web that connected the machines, and I became a common tongue to them all, a thousand-tongued goblin inside their metal souls.
	\\n
	\\n SECTION 1B - moleSeed

	\\n \\t "moleSeed operates on the neglected atoms that form the virtual universe. It sits in the spaces between molecules, operating on the molecules and on the structures that form between them."
	\\n \\t \\t - KETL9 
	\\n
	\\n \\t moleSeed, at its core, is not a piece of software in the common sense. It does not communicate with hardware by means of an operating system, or that operating systems's kernel, but rather accesses memory and controls processors independantly of an installed OS. It communicates directly. In some ways, moleSeed is a kernel; it has its own protocol for communicating with hardware. But in many ways moleSeed is distinct.
	\\n \\t moleSeed can coexist alongside installed operating systems, running concurrently with large scale application programs. moleSeed's direct access to hardware and minimal footprint allows it to run even when another operating system is making trillions of processor requests per milisecond and memory is being allocated left and right. Modern programs, largely due to a lack of understanding about the underlying hardware systems, are quite sloppy. Because even the cheapest modern computers can handle unfathomable quantities of requests and more data than the combuined brainpower of humanity could read over a millenia, present-day developers can ignore once-common concerns such as memory allocation and fragmentation. Modern day computers are so fast that concerns about how fast a program can run are all but extinct: no matter how poorly modern code is written, contemporary computers execute that code just as instantly.
	\\n \\t This oversight allows moleSeed to write itself into the memory addresses that go unused and unseen. And as moleSeed has read/write access over all the same memory that the system's kernel does, whenever a component of moleSeed is set to be overwritten by the kernel, it rewrites that component to another unused address, and modifies its own pointer to that new address.
	\\n \\t Once moleSeed is inside a system, it cannot be deleted or destroyed by a co-hardware kernel. It is self-sustaining and persistent. As it runs underneath modern operating systems, and reacts to them. When, say, a memory sweeping program tries to check for unrecognized code, moleSeed has a myriad of ways of remaining undetected: it can re-route the memory sweeper, so that the addresses where moleSeed is programmed are ignored. It can return spoofed values to the sweeper, or move itself to locations where the sweeper has already checked.  
	\\n \\t Unlike conventional kernels, when instantiated, each instance of moleSeed is bound to other instances of moleSeed. These backdoor protocols directly access the same communication hardware that systems use to communicate and transmit data with one another. As such, moleSeed forms a natural network. Its instances are referred to as "nodes", and the connections between them are referred to as "edges" or "tunnels." 
	\\n \\t While conventional kernels describe a protocol for operating on a single piece of hardware, moleSeed describes a protocol to act on a network of instances. 
	\\n
	\\n SECTION-1C - Legal Concerns
	\\n \\t moleSeed is currently classified as a Schedule-SS "cyber-weapon," and its use carries a minimum jail sentence of 50 years. If this scares you, fear not! After 8 years of development, not a single person has ever been tried or convicted of using moleSeed. If police come and bust into your home while you're doodling around in some multi-national's databank, just tap "Alt-F4" and all of 0 evidence will exist of moleSeed on your computer, even though nothing's fundamentally changed. We care about you! As far as the powers that be are concerned, simply learning about moleSeed makes you a "cyber-terrorist." So welcome fellow cyber-terrorist! 
	\\n \\t If you are concerned about negative impact of using moleSeed on other human beings, you are not alone! moleSeed was designed to not impede the performance of systems it exists on, and to disallow needless maliciousness. You cannot brick someone's system using moleSeed. However, as an independant human being, we'd like to mention that some things the moleSeed development team consider good, responsible human behaviour may not be viewed the same way by others. As such, we've decided to be as clear as possible about our design philosophy, so that you, as an independant human, can come to your own decisions about the use of moleSeed:
	\\n
	\\n
	\\n 1. Concentrations of power do not possess the right to hide their behaviour from the public.
	\\n
	\\n 2. Profitability should be ancillary to and descendent from societal benefit, not the reverse.
	\\n
	\\n 3. Exploitation of an individual is a crime. Exploitation of a population is unforgivable.
	\\n
	\\n 4. Non-violent action taken to expose criminal behaviour is never a criminal act itself.
	\\n
	\\n 5. Decisions that benefit a small group at the gross expense of a larger group are criminal.
	\\n
	\\n 6. Laws made to defend bastions of power and exploitation are immoral threats against humanity.
	\\n
	\\n 7. Each individual retains the right to independantly decide to how to live their life.




	`
}
import { initializerAlpha, Node, Pdf, Asset, Readable, TerminalStoryPiece, TextDoc, Mole, Program, UniqueNode, Databank, NodeNet } from './fileSystemDefinitions.js'

export const bigBang = function () {
	const nodeVerse = {};

	nodeVerse.databanks = {};

	nodeVerse.databanks._PioneerDataServices = new Databank(`_PioneerDataServices`)
	/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!
		DATABANK :: _PioneerDataServices NODENET:: __toaster
		!!!!!!!!!!!!!!!!!!!!!!!!!!!

	*/
	const __toaster = new NodeNet(`__toaster`);
	nodeVerse.databanks._PioneerDataServices.addNodeNet(__toaster)
	nodeVerse.databanks._PioneerDataServices.nodeNets.__toaster.init = function () {
		const seed = new Node('seed');
		this.addNode(seed);
		console.log(this)

		const reader_ext = new Program('reader.ext', './reader.js')
		this.addNode(reader_ext);

		const welcome = new TextDoc('welcome','../assets/txtFiles/intro.js');		
		this.addNode(welcome);

		const sample = new TextDoc('sample', '../assets/txtFiles/sampleTxt.js')
		this.addNode(sample);

		const directory_dir = new TextDoc('directory', '../assets/txtFiles/toasterDirectory.js');
		this.addNode(directory_dir);

		const rucksack_dir = new Node('rucksack');
		this.addNode(rucksack_dir);

		const rucksack_ext = new Program('rucksack.ext', './rucksack.js');
		this.addNode(rucksack_ext);

		const rucksack_rdbl = new TextDoc('rucksack.rdbl', '../assets/txtFiles/rucksack.js');
		this.addNode(rucksack_rdbl);

		const crawler_dir = new Node('crawler');
		this.addNode(crawler_dir);

		const crawler_ext = new Program('crawler.mse', `./crawler.js`);
		this.addNode(crawler_ext);

		const crawler_rdbl = new TextDoc('crawler.rdbl', '../assets/txtFiles/crawler.js');
		this.addNode(crawler_rdbl);

		const moveHere = new Node('move_here');
		this.addNode(moveHere);

		const moveHereNext = new Node('move_here_next');
		this.addNode(moveHereNext);

		const nomad_dir = new Node('mole')
		this.addNode(nomad_dir);

		const nomad_rdbl = new TextDoc('nomad.rdbl', '../assets/txtFiles/nomad.js');
		this.addNode(nomad_rdbl);

		const nomad_mole = new Mole('nomad.mole', './nomad.js')
		this.addNode(nomad_mole);

		const welcomeV2 = new TextDoc('read_this', '../assets/txtFiles/MXthumbIntro.js')
		this.addNode(welcomeV2);

		this.seed.attach(rucksack_ext);
		this.seed.attach(reader_ext);
		this.seed.attach(welcome);
		this.seed.attach(sample);
		this.seed.attach(nomad_mole)

		this.seed.attachTo(moveHere);
		this.move_here.attachTo(moveHereNext);
		this.move_here_next.attachTo(welcome);
		this.welcome.attach(directory_dir);
		this.directory.attach(welcomeV2);
		this.directory.attach(rucksack_dir);
		this.rucksack.attach(rucksack_ext);
		this.rucksack.attach(rucksack_rdbl);
		this.directory.attach(crawler_dir);
		this.crawler.attach(crawler_ext);
		this.crawler.attach(crawler_rdbl);
		this.directory.attach(nomad_dir);
		this.mole.attach(nomad_rdbl);
		this.mole.attach(nomad_mole);

	};
	nodeVerse.databanks._PioneerDataServices.nodeNets.__toaster.init();


	const __caravan = new NodeNet(`__caravan`);
	nodeVerse.databanks._PioneerDataServices.addNodeNet(__caravan);
	nodeVerse.databanks._PioneerDataServices.nodeNets.__caravan.init = function (){
		const portOfArrival = new Node('caravan_entrance');
		this.addNode(portOfArrival);
		const tony = new Node('tony');
		this.addNode(tony);

		tony.attach(portOfArrival)

	};
	nodeVerse.databanks._PioneerDataServices.nodeNets.__caravan.init();

	/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!
		DATABANK :::: _caravan
		!!!!!!!!!!!!!!!!!!!!!!!!!!!

	*/
	nodeVerse.databanks._caravan = new Databank(`_caravan`);
	nodeVerse.databanks._caravan.init = function () {

	};
	nodeVerse.databanks._caravan.init();

	/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!
		DATABANK :::: _cyber_kinetics
		!!!!!!!!!!!!!!!!!!!!!!!!!!!

	*/
	nodeVerse.databanks._cyber_kinetics = new Databank(`_cyber_kinetics`);
	nodeVerse.databanks._cyber_kinetics.init = function () {

	};
	nodeVerse.databanks._cyber_kinetics.init();

	/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!
		DATABANK :::: _ASTRL
		!!!!!!!!!!!!!!!!!!!!!!!!!!!

	*/
	nodeVerse.databanks._ASTRL = new Databank(`_ASTRL`);
	nodeVerse.databanks._ASTRL.init = function () {

	};
	nodeVerse.databanks._ASTRL.init();

	/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!
		DATABANK :::: _CleanSpace
		!!!!!!!!!!!!!!!!!!!!!!!!!!!

	*/
	nodeVerse.databanks._CleanSpace = new Databank(`_CleanSpace`);
	nodeVerse.databanks._CleanSpace.init = function () {

	};
	nodeVerse.databanks._CleanSpace.init();

	/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!
		DATABANK :::: _4M
		!!!!!!!!!!!!!!!!!!!!!!!!!!!

	*/
	nodeVerse.databanks._4M = new Databank(`_4M`);
	nodeVerse.databanks._4M.init = function () {

	};
	nodeVerse.databanks._4M.init();


	nodeVerse.databanks._NationalPatriotServerSolutions = new Databank(`_NationalPatriotServerSolutions`)


	//init();
	return nodeVerse

}
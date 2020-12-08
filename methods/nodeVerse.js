import { Library, Hardware, QRig, Malware, Recruiter, Worm, initializerAlpha, Node, Pdf, Asset, Readable, TerminalStoryPiece, TextDoc, Mole, Program, UniqueNode, Databank, NodeNet } from './fileSystemDefinitions.js'

export const bigBang = function () {
	const nodeVerse = {};
	nodeVerse.databanks = {};
	nodeVerse.router = {};

	nodeVerse.appendDataBank = function (databank) {
		nodeVerse.databanks[databank.name] = databank;
		nodeVerse.router[databank.address] = {};
		Object.defineProperty(databank, '_meta', {
			value : this,
			writable : false,
		})
	}


	const _PioneerDataServices = new Databank(`_PioneerDataServices`,`PDS_p9.34.00`, `dz019q$$tajz>`)
	nodeVerse.appendDataBank(_PioneerDataServices);
	/*
		!!!!!!!!!!!!!!!!!!!!!!!!!!!
		DATABANK :: _PioneerDataServices NODENET:: __toaster
		!!!!!!!!!!!!!!!!!!!!!!!!!!!

	*/
	const __toaster = new NodeNet(`__toaster`,`%81jan222jn*=`);
	nodeVerse.databanks._PioneerDataServices.addNodeNet(__toaster)
	nodeVerse.databanks._PioneerDataServices.nodeNets.__toaster.init = function () {
		const seed = new Node('seed');
		this.addNode(seed);

		const caravanLibrary = new Library(`caravanLibrary`, `d%*a%611!c&tr\"inj`, `../assets/libraries/caravanLibrary`)
		this.addNode(caravanLibrary);

		const wallysIbsQ19 = new QRig(`wally'sIBSQ19`, 'c6#!k%uvo3yg$<lcx','./wallysIbsQ19.js');
		this.addNode(wallysIbsQ19);

		const cordyceps = new Recruiter('cordyceps.msh', './cordyceps.js');
		this.addNode(cordyceps);

		const pegleg = new Recruiter('pegleg.yaar', './pegleg.js');
		this.addNode(pegleg)

		const silo_ext = new Program('silo.ext','bxbljs00\"3p&*z\"yi' ,'./silo.js')
		this.addNode(silo_ext)

		const reader_ext = new Program('reader.ext', `a+zya0wtbd&e2fs%o`, './reader.js')
		this.addNode(reader_ext);

		const welcome = new TextDoc('welcome', `=%zp5pszgciq<6sce`,'../assets/txtFiles/intro.js',);		
		this.addNode(welcome);

		const sample = new TextDoc('sample',`0&tbiiz4pu1>t657v`, '../assets/txtFiles/sampleTxt.js')
		this.addNode(sample);

		const directory_dir = new TextDoc('directory',`muflds0?&n*$r5?3e`, '../assets/txtFiles/toasterDirectory.js');
		this.addNode(directory_dir);

		const rucksack_dir = new Node('rucksack',`7k>g+wo\"?jz$e7p&<`);
		this.addNode(rucksack_dir);

		const rucksack_ext = new Program('rucksack.ext',`hqch4+?u\"auwujxra`, './rucksack.js');
		this.addNode(rucksack_ext);

		const rucksack_rdbl = new TextDoc('rucksack.rdbl', `3\"nbb$j\"jwkx!*4<&`, '../assets/txtFiles/rucksack.js');
		this.addNode(rucksack_rdbl);

		const crawler_dir = new Node('crawler', `$ufcw&$miw2aui8=>`);
		this.addNode(crawler_dir);

		const crawler_ext = new Program('crawler.mse', `bl&<d0vqfkq42jn<3`, `./crawler.js`);
		this.addNode(crawler_ext);

		const crawler_rdbl = new TextDoc('crawler.rdbl', `=ye42z=ww39kikqat`, '../assets/txtFiles/crawler.js');
		this.addNode(crawler_rdbl);

		const moveHere = new Node('move_here', `*r#!jo>nbhk?>!mgw`);
		this.addNode(moveHere);
		moveHere.encrypt(7,`babydiaper`)

		const moveHereNext = new Node('move_here_next', `0hjn?&w?n#onkbk$j`);
		this.addNode(moveHereNext);

		const nomad_dir = new Node('mole', `4qb1927k+4c*?zwz3`)
		this.addNode(nomad_dir);

		const nomad_rdbl = new TextDoc('nomad.rdbl', `*ga#hxf$+9nf$qa?$`, '../assets/txtFiles/nomad.js');
		this.addNode(nomad_rdbl);

		const nomad_mole = new Mole('nomad.mole', `n<*c0!pxvhp%0d\"rs`, './nomad.js')
		this.addNode(nomad_mole);

		const welcomeV2 = new TextDoc('read_this', `8=4f#9>3n\"y!=3$i2`,'../assets/txtFiles/MXthumbIntro.js')
		this.addNode(welcomeV2);

		this.seed.attach(rucksack_ext);
		this.seed.attach(reader_ext);
		this.seed.attach(welcome);
		this.seed.attach(sample);
		this.seed.attach(nomad_mole);
		this.seed.attach(silo_ext);
		this.seed.attach(cordyceps);
		this.seed.attach(wallysIbsQ19);
		this.seed.attach(pegleg)


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
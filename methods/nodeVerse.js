import { Directory, Library, Hardware, QRig, Malware, Recruiter, Worm, initializerAlpha, Node, Pdf, Asset, Readable, TerminalStoryPiece, TextDoc, Mole, Program, UniqueNode, Databank, NodeNet } from './fileSystemDefinitions.js'

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

	nodeVerse.getDefaultNode = function () {
		return this.router[`dz019q$$tajz>`][`%81jan222jn*=`][`8i7eu6p!y3jigc1mw`]
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
		const seed = new Node('seed', `8i7e36p!y9jig21mw`);
		this.addNode(seed);

		const biblio = new Program(`biblio.ext`, `usi8p6diw<82ihv37`, `./biblio.js`);
		this.addNode(biblio);

		const caravanLibrary = new Library(`moleSeed_docs`, `d%*a%611!c&tr\"inj`, `../assets/libraries/moleSeed_docs`)
		this.addNode(caravanLibrary);

		const reader_ext = new Program('reader.ext', `a+zya0wtbd&e2fs%o`, './reader.js')
		this.addNode(reader_ext);

		const welcome = new TextDoc('welcome', `=%zp5pszgciq<6sce`,'../assets/txtFiles/intro.js',);		
		this.addNode(welcome);

		const sample = new TextDoc('sample',`0&tbiiz4pu1>t657v`, '../assets/txtFiles/sampleTxt.js')
		this.addNode(sample);

		const main_dir = new Directory('main',`muflds0?&n*$r5?3e`, '../assets/txtFiles/toasterDirectory.js');
		this.addNode(main_dir);

		const admin_dir = new Directory('00CE6._x172', false);
		this.addNode(admin_dir);

		const rucksack_dir = new Directory('rucksack',`7k>g+wo\"?jz$e7p&<`);
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

		const moveHereNext = new Node('move_here_next', `0hjn?&w?n#onkbk$j`);
		this.addNode(moveHereNext);

		const nomad_dir = new Directory('mole', `4qb1927k+4c*?zwz3`)
		this.addNode(nomad_dir);

		const nomad_rdbl = new TextDoc('nomad.rdbl', `*ga#hxf$+9nf$qa?$`, '../assets/txtFiles/nomad.js');
		this.addNode(nomad_rdbl);

		const nomad_mole = new Mole('nomad.mole', `n<*c0!pxvhp%0d\"rs`, './nomad.js')
		this.addNode(nomad_mole);

		const welcomeV2 = new TextDoc('welcome_update', `8=4f#9>3n\"y!=3$i2`,'../assets/txtFiles/MXthumbIntro.js')
		this.addNode(welcomeV2);

		const read_this = new TextDoc('read_this', false, '../assets/txtFiles/firstRead.js');
		this.addNode(read_this);

		const now_read_this = new TextDoc('now_read_this', false, '../assets/txtFiles/secondRead.js')
		this.addNode(now_read_this);

		const that = new TextDoc('that', false, '../assets/txtFiles/thirdRead.js')
		this.addNode(that);

		const uniquekey = new TextDoc('unique_key', false, `../assets/txtFiles/uniquekey.js`);
		this.addNode(uniquekey);

		const cordyceps = new Recruiter('cordyceps.msh', './cordyceps.js');
		this.addNode(cordyceps);

		const pegleg = new Recruiter('pegleg.yaar', './pegleg.js');
		this.addNode(pegleg);

		const silo_ext = new Program('silo.ext','bxbljs00\"3p&*z\"yi' ,'./silo.js')
		this.addNode(silo_ext);

		const there = new Node('there', false);
		this.addNode(there);

		const help = new Node('help')
		this.addNode(help)
		const oops = new Node('I_made_a_mistake');
		this.addNode(oops)
		const oops2 = new Node('I_overwrote_my_only_moleware');
		this.addNode(oops2)
		const oops3 = new Node('CaN_I_hAve_a_nEw_1?');
		this.addNode(oops3)

		const nomad_mole_2 = new Mole('nomad.mole', `n<*c0!pxvhp%0d\"rs`, './nomad.js')
		this.addNode(nomad_mole);



		this.seed.attach(admin_dir);
		admin_dir.attach(rucksack_ext);
		admin_dir.attach(reader_ext);
		admin_dir.attach(nomad_mole);
		admin_dir.attach(silo_ext);
		admin_dir.attach(cordyceps);
		admin_dir.attach(pegleg);
		admin_dir.attach(crawler_ext);

		/*
		seed.attach(caravanLibrary);
		seed.attach(biblio);
		seed.attach(reader_ext);
		seed.attach(welcome);
		seed.attach(welcomeV2);
		*/
		

		this.seed.attachTo(moveHere);

		this.move_here.attach(read_this);
		this.move_here.attachTo(there);

		this.there.attach(reader_ext);
		this.there.attach(now_read_this);
		this.there.attach(that);
		this.there.attachTo(main_dir);

		main_dir.attach(welcome);
		main_dir.attach(welcomeV2);
		main_dir.attach(rucksack_dir);
		main_dir.attach(nomad_dir);
		main_dir.attach(uniquekey);
		main_dir.attach(help);

		help.attach(oops);
		oops.attach(oops2);
		oops2.attach(oops3);
		oops3.attach(nomad_mole_2);
		oops3.attachTo(main_dir);

		nomad_dir.attach(nomad_rdbl);
		nomad_dir.attach(nomad_mole);

		rucksack_dir.attach(rucksack_ext);
		rucksack_dir.attach(rucksack_rdbl);

		/*
		this.move_here_next.attachTo(welcome);
		this.welcome.attach(main_dir);
		this.main.attach(welcomeV2);
		this.main.attach(rucksack_dir);
		this.rucksack.attach(rucksack_ext);
		this.rucksack.attach(rucksack_rdbl);
		this.main.attach(crawler_dir);
		this.crawler.attach(crawler_ext);
		this.crawler.attach(crawler_rdbl);
		this.main.attach(nomad_dir);
		this.mole.attach(nomad_rdbl);
		this.mole.attach(nomad_mole);
		*/


	};
	nodeVerse.databanks._PioneerDataServices.nodeNets.__toaster.init();


	const __caravan = new NodeNet(`__caravan`);
	nodeVerse.databanks._PioneerDataServices.addNodeNet(__caravan);
	nodeVerse.databanks._PioneerDataServices.nodeNets.__caravan.init = function (){

		const portOfArrival = new Node('caravan_entrance');
		this.addNode(portOfArrival);

		const seed = new Node('seed')
		this.addNode(seed);

		const welcome = new TextDoc('welcome', `*431hsa&cgciq>5tdi`,'../assets/txtFiles/intro.js');
		this.addNode(welcome);

		const dir = new Directory('dir', false);
		this.addNode(dir);

		const biblio = new Program(`biblio.ext`, `usi8p6diw<82ihv37`, `./biblio.js`);
		this.addNode(biblio);

		const caravanLibrary = new Library(`moleSeed_docs`, false, `../assets/libraries/moleSeed_docs`)
		this.addNode(caravanLibrary);

		const newUserRepo_dir = new Directory('new_user_repo', false);
		newUserRepo_dir.encrypt(7,`v9d%00&5k24`)
		this.addNode(newUserRepo_dir);

		const tonysIbsQ19 = new QRig(`tonys_IBS_Q19`, 'c6#!k%uvo3yg$<lcx','./wallysIbsQ19.js');
		this.addNode(tonysIbsQ19);

		const cordyceps = new Recruiter('cordyceps.msh', './cordyceps.js');
		this.addNode(cordyceps);

		const pegleg = new Recruiter('pegleg.yaar', './pegleg.js');
		this.addNode(pegleg)

		const silo_ext = new Program('silo.ext','bxbljs00\"3p&*z\"yi' ,'./silo.js')
		this.addNode(silo_ext)

		const demoMessage = new TextDoc('please_read_this', false, '../assets/txtFiles/demoCompleted.js')
		this.addNode(demoMessage);

		const nurSilo_doc = new TextDoc('silo.rdbl', false, '../assets/txtFiles/silo.js')
		this.addNode(nurSilo_doc);

		const nurBiblio_doc = new TextDoc('biblio.rdbl', false, '../assets/txtFiles/biblio.js')
		this.addNode(nurBiblio_doc);

		const gate = new Node('portcullis', false)
		gate.encrypt(7, 'password=password')
		this.addNode(gate);

		portOfArrival.attach(dir);

		dir.attach(newUserRepo_dir);
		dir.attach(tonysIbsQ19);
		dir.attach(gate);
		dir.attach(caravanLibrary);
		dir.attach(welcome);

		newUserRepo_dir.attach(cordyceps);
		newUserRepo_dir.attach(pegleg);
		newUserRepo_dir.attach(silo_ext);
		newUserRepo_dir.attach(nurSilo_doc);
		newUserRepo_dir.attach(biblio);
		newUserRepo_dir.attach(nurBiblio_doc);
		
		gate.attach(demoMessage);

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
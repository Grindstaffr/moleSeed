//import { Directory, Library, Hardware, QRig, Malware, Recruiter, Worm, initializerAlpha, Node, Pdf, Asset, Readable, TerminalStoryPiece, TextDoc, Mole, Program, UniqueNode, Databank, NodeNet } from '../../methods/fileSystemDefinitions.js'
const fileSystemDefinitions = require(`../../methods/fileSystemDefinitions.js`)
console.log(fileSystemDefinitions)

exports.makeAllNodes = function () {
	const allNodes = {};

	allNodes.getNode = function (trueAddress){
		if (this[trueAddress]){
			return this[trueAddress];
		} else {
			console.log(`No node found with trueAddress = ${trueAddress}`)
		}
	}

	const init = function () {
		const seed = new Node(allNodes,'seed', `8i7e36p!y9jig21mw`);
		const biblio = new Program(allNodes,`biblio.ext`, `usi8p6diw<82ihv37`, `./biblio.js`);
		const caravanLibrary = new Library(allNodes,`moleSeed_docs`, `d%*a%611!c&tr\"inj`, `../assets/libraries/moleSeed_docs`)
		const reader_ext = new Program(allNodes,'reader.ext', `a+zya0wtbd&e2fs%o`, './reader.js')
		const welcome = new TextDoc(allNodes,'welcome', `=%zp5pszgciq<6sce`,'../assets/txtFiles/intro.js',);		
		const sample = new TextDoc(allNodes,'sample',`0&tbiiz4pu1>t657v`, '../assets/txtFiles/sampleTxt.js')
		const main_dir = new Directory(allNodes,'main',`muflds0?&n*$r5?3e`, '../assets/txtFiles/toasterDirectory.js');
		const admin_dir = new Directory(allNodes,'00CE6._x172', false);
		const rucksack_dir = new Directory(allNodes,'rucksack',`7k>g+wo\"?jz$e7p&<`);
		const rucksack_ext = new Program(allNodes,'rucksack.ext',`hqch4+?u\"auwujxra`, './rucksack.js');
		const rucksack_rdbl = new TextDoc(allNodes,'rucksack.rdbl', `3\"nbb$j\"jwkx!*4<&`, '../assets/txtFiles/rucksack.js');
		const crawler_dir = new Node(allNodes,'crawler', `$ufcw&$miw2aui8=>`);
		const crawler_ext = new Program(allNodes,'crawler.mse', `bl&<d0vqfkq42jn<3`, `./crawler.js`);
		const crawler_rdbl = new TextDoc(allNodes,'crawler.rdbl', `=ye42z=ww39kikqat`, '../assets/txtFiles/crawler.js');
		const moveHere = new Node(allNodes,'move_here', `*r#!jo>nbhk?>!mgw`);
		const moveHereNext = new Node(allNodes,'move_here_next', `0hjn?&w?n#onkbk$j`);
		const nomad_dir = new Directory(allNodes,'mole', `4qb1927k+4c*?zwz3`)
		const nomad_rdbl = new TextDoc(allNodes,'nomad.rdbl', `*ga#hxf$+9nf$qa?$`, '../assets/txtFiles/nomad.js');
		const nomad_mole = new Mole(allNodes,'nomad.mole', `n<*c0!pxvhp%0d\"rs`, './nomad.js')
		const welcomeV2 = new TextDoc(allNodes,'welcome_update', `8=4f#9>3n\"y!=3$i2`,'../assets/txtFiles/MXthumbIntro.js')
		const read_this = new TextDoc(allNodes,'read_this', false, '../assets/txtFiles/firstRead.js');
		const now_read_this = new TextDoc(allNodes,'now_read_this', false, '../assets/txtFiles/secondRead.js')
		const that = new TextDoc(allNodes,'that', false, '../assets/txtFiles/thirdRead.js')
		const uniquekey = new TextDoc(allNodes,'unique_key', false, `../assets/txtFiles/uniquekey.js`);
		const cordyceps = new Recruiter(allNodes,'cordyceps.msh', './cordyceps.js');
		const pegleg = new Recruiter(allNodes,'pegleg.yaar', './pegleg.js');
		const silo_ext = new Program(allNodes,'silo.ext','bxbljs00\"3p&*z\"yi' ,'./silo.js')
		const there = new Node(allNodes,'there', false);
		const tonysIbsQ19 = new QRig(allNodes,`tonys_IBS_Q19`, 'c6#!k%uvo3yg$<lcx','./wallysIbsQ19.js');
		const help = new Node(allNodes,'help')
		const oops = new Node(allNodes,'I_made_a_mistake');
		const oops2 = new Node(allNodes,'I_overwrote_my_only_moleware');
		const oops3 = new Node(allNodes,'CaN_I_hAve_a_nEw_1?');
		const nomad_mole_2 = new Mole(allNodes,'nomad.mole', `n<*c0!pxvhp%0d\"rs`, './nomad.js')
		const portOfArrival = new Node(allNodes,'caravan_entrance');
		const seed2 = new Node(allNodes,'seed')
		const welcome2 = new TextDoc(allNodes,'welcome', `*431hsa&cgciq>5tdi`,'../assets/txtFiles/intro.js');
		const dir = new Directory(allNodes,'dir', false);
		const biblio2 = new Program(allNodes,`biblio.ext`, `usi8p6diw<82ihv37`, `./biblio.js`);
		const caravanLibrary2 = new Library(allNodes,`moleSeed_docs`, false, `../assets/libraries/moleSeed_docs`)
		const newUserRepo_dir = new Directory(allNodes,'new_user_repo', false);
		newUserRepo_dir.encrypt(7,`v9d%00&5k24`)
		const tonysIbsQ192 = new QRig(allNodes,`tonys_IBS_Q19`, 'c6#!k%uvo3yg$<lcx','./wallysIbsQ19.js');
		const cordyceps2 = new Recruiter(allNodes,'cordyceps.msh', './cordyceps.js');
		const pegleg2 = new Recruiter(allNodes,'pegleg.yaar', './pegleg.js');
		const silo_ext2 = new Program(allNodes,'silo.ext','bxbljs00\"3p&*z\"yi' ,'./silo.js')
		const demoMessage = new TextDoc(allNodes,'please_read_this', false, '../assets/txtFiles/demoCompleted.js')
		const nurSilo_doc = new TextDoc(allNodes,'silo.rdbl', false, '../assets/txtFiles/silo.js')
		const nurBiblio_doc = new TextDoc(allNodes,'biblio.rdbl', false, '../assets/txtFiles/biblio.js')
		const gate = new Node(allNodes,'portcullis', false)
		gate.encrypt(7, 'password=password')
	
	}

	//init();
	return allNodes;
}

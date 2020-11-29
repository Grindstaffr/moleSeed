const pdfKeyCommands = {
			'backspace' : function () {
				// previous page
			},
			'tab' : function () {},
			'enter' : function () {
				// next page or goto page with pgfinder
			},
			'shift' : function () {

			},
			'ctrl' : function () {},
			'esc' : function () {
				//disable pdfViewer
			},
			'space' : function () {
				// refresh pdfViewer
			},
			'pgup' : function () {},
			'pgdwn' : function () {},
			'end' : function () {},
			'home' : function () {},
			'left' : function () {
				// nudge left
			},
			'up' : function () {
				//nudge up
			},
			'right' : function () {
				//nudge right
			},
			'down' : function () {
				//nudge down
			},
			'0' : function () {
				//open pagefinder (if not open)
				// enter term '0'
			},
			'1' : function () {},
			'2' : function () {},
			'3' : function () {},
			'4' : function () {},
			'5' : function () {},
			'6' : function () {},
			'7' : function () {},
			'8' : function () {},
			'9' : function () {},
			':' : function () {},
			';' : function () {},
			'.' : function () {},
			'=' : function () {
				//increase scale (zoom in)
			},
			'@' : function () {},
			'a' : function () {},
			'b' : function () {},
			'c' : function () {},
			'd' : function () {},
			'e' : function () {},
			'f' : function () {},
			'g' : function () {},
			'h' : function () {},
			'i' : function () {},
			'j' : function () {},
			'k' : function () {},
			'l' : function () {},
			'm' : function () {},
			'n' : function () {},
			'o' : function () {},
			'p' : function () {},
			'q' : function () {},
			'r' : function () {},
			's' : function () {},
			't' : function () {},
			'u' : function () {},
			'v' : function () {},
			'w' : function () {},
			'x' : function () {},
			'y' : function () {},
			'z' : function () {},
			'-' : function () {
				//decrease scale (zoom out)
			}
		}

		const keyMap = {
			8 : 'backspace',
			9 : 'tab',
			13: 'enter',
			16: 'shift',
			17: 'ctrl',
			27: 'esc',
			32: 'space',
			33: 'pgup',
			34: 'pgdwn',
			35: 'end',
			36: 'home',
			37: 'left',
			38: 'up',
			39: 'right',
			40: 'down',
			48: '0',
			49: '1',
			50: '2',
			51: '3',
			52: '4',
			53: '5',
			54: '6',
			55: '7',
			56: '8',
			57: '9',
			58: ':',
			59: ';',
			60: '.',
			61: '=',
			64: '@',
			65: 'a',
			66: 'b',
			67: 'c',
			68: 'd',
			69: 'e',
			70: 'f',
			71: 'g',
			72: 'h',
			73: 'i',
			74: 'j',
			75: 'k',
			76: 'l',
			77: 'm',
			78: 'n',
			79: 'o',
			80: 'p',
			81: 'q',
			82: 'r',
			83: 's',
			84: 't',
			85: 'u',
			86: 'v',
			87: 'w',
			88: 'x',
			89: 'y',
			90: 'z',
		}
// The following is the style sheet for Ketcher. To override a default option,
// specify a value key. If value is not specified, the default option will be
// used.

const styleSheet = {
  resetToSelect: {
		title: 'Reset to Select Tool',
		enum: [true, 'paste', false],
		enumNames: ['on', 'After Paste', 'off'],
		default: 'paste'
	},
	rotationStep: {
		title: 'Rotation Step, º',
		type: 'integer',
		minimum: 1,
		maximum: 90,
		default: 15,
    value: 1
	},
  showValenceWarnings: {
		title: 'Show valence warnings',
		type: 'boolean',
		default: true
	},
	atomColoring: {
		title: 'Atom coloring',
		type: 'boolean',
		default: true
	},
	hideChiralFlag: {
		title: 'Do not show the Chiral flag',
		type: 'boolean',
		default: false
	},
	font: {
		title: 'Font',
		type: 'string',
		default: '30px Arial'
	},
	fontsz: {
		title: 'Font size',
		type: 'integer',
		default: 13,
		minimum: 1,
		maximum: 96
	},
	fontszsub: {
		title: 'Sub font size',
		type: 'integer',
		default: 13,
		minimum: 1,
		maximum: 96
	},
	// Atom
	carbonExplicitly: {
		title: 'Display carbon explicitly',
		type: 'boolean',
		default: false
	},
	showCharge: {
		title: 'Display charge',
		type: 'boolean',
		default: true
	},
	showValence: {
		title: 'Display valence',
		type: 'boolean',
		default: true
	},
	showHydrogenLabels: {
		title: 'Show hydrogen labels',
		enum: ['off', 'Hetero', 'Terminal', 'Terminal and Hetero', 'on'],
		default: 'on'
	},
	// Bonds
	aromaticCircle: {
		title: 'Aromatic Bonds as circle',
		type: 'boolean',
		default: true
	},
	doubleBondWidth: {
		title: 'Double bond width',
		type: 'integer',
		default: 6,
		minimum: 1,
		maximum: 96
	},
	bondThickness: {
		title: 'Bond thickness',
		type: 'integer',
		default: 2,
		minimum: 1,
		maximum: 96
	},
	stereoBondWidth: {
		title: 'Stereo (Wedge) bond width',
		type: 'integer',
		default: 6,
		minimum: 1,
		maximum: 96
	},
  'smart-layout': {
		title: 'Smart-layout',
		type: 'boolean',
		default: true
	},
	'ignore-stereochemistry-errors': {
		title: 'Ignore stereochemistry errors',
		type: 'boolean',
		default: true
	},
	'mass-skip-error-on-pseudoatoms': {
		title: 'Ignore pseudoatoms at mass',
		type: 'boolean',
		default: false
	},
	'gross-formula-add-rsites': {
		title: 'Add Rsites at mass calculation',
		type: 'boolean',
		default: true
	},
	'gross-formula-add-isotopes': {
		title: 'Add Isotopes at mass calculation',
		type: 'boolean',
		default: true
	},
  showAtomIds: {
		title: 'Show atom Ids',
		type: 'boolean',
		default: false
	},
	showBondIds: {
		title: 'Show bonds Ids',
		type: 'boolean',
		default: false
	},
	showHalfBondIds: {
		title: 'Show half bonds Ids',
		type: 'boolean',
		default: false
	},
	showLoopIds: {
		title: 'Show loop Ids',
		type: 'boolean',
		default: false
	},
  miewMode: {
		title: 'Display mode',
		enum: ['LN', 'BS', 'LC'],
		enumNames: ['Lines', 'Balls and Sticks', 'Licorice'],
		default: 'LN'
	},
	miewTheme: {
		title: 'Background color',
		enum: ['light', 'dark'],
		enumNames: ['Light', 'Dark'],
		default: 'light'
	},
	miewAtomLabel: {
		title: 'Label coloring',
		enum: ['no', 'bright', 'blackAndWhite', 'black'],
		enumNames: ['No', 'Bright', 'Black and White', 'Black'],
		default: 'bright'
	}
};

export default styleSheet;

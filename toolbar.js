export default {
	mainmenu: [
		{
			id: 'document',
			menu: [
				'new',
				'open',
				'save'
			]
		},
		{
			id: 'edit',
			menu: [
				'undo',
				'redo',
				'cut',
				'copy',
				'paste'
			]
		},
		{
			id: 'zoom',
			menu: [
				'zoom-in',
				'zoom-out',
				{
					id: 'zoom-list',
					component: "ZoomList"
				}
			]
		},
		{
			id: 'zoom',
			menu: [
				'zoom-in',
				'zoom-out',
				{
					id: 'zoom-list',
					component: "ZoomList"
				}
			]
		},
		{
			id: 'process',
			menu: [
				'layout',
				'clean',
				'arom',
				'dearom',
				'cip',
				'check',
				'analyse',
				'recognize',
				'miew'
			]
		},
		{
			id: 'meta',
			menu: [
				'settings',
				'help',
				'about'
			]
		}
	],
	toolbox: [
		{
			id: 'select',
			menu: [
				{
					id: 'select-common',
					menu: [
						'select-lasso',
						'select-rectangle',
						'select-fragment'
					]
				}
			]
		},
		'erase',
		{
			id: 'bond',
			menu: [
				{
					id: 'bond-common',
					menu: [
						'bond-single',
						'bond-double',
						'bond-triple'
					]
				},
				{
					id: 'bond-stereo',
					menu: [
						'bond-up',
						'bond-down',
						'bond-updown',
						'bond-crossed'
					]
				},
				{
					id: 'bond-query',
					menu: [
						'bond-any',
						'bond-aromatic',
						'bond-singledouble',
						'bond-singlearomatic',
						'bond-doublearomatic'
					]
				}
			]
		},
		'chain',
		{
			id: 'charge',
			menu: [
				'charge-plus',
				'charge-minus'
			]
		},
		{
			id: 'transform',
			menu: [
				'transform-rotate',
				'transform-flip-h',
				'transform-flip-v'
			]
		},
		'sgroup',
		'sgroup-data',
		{
			id: 'reaction',
			menu: [
				'reaction-arrow',
				'reaction-plus',
				'reaction-automap',
				'reaction-map',
				'reaction-unmap'
			]
		},
		{
			id: 'rgroup',
			menu: [
				'rgroup-label',
				'rgroup-fragment',
				'rgroup-attpoints'
			]
		}
	]
};

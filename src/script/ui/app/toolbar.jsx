/****************************************************************************
 * Copyright 2018 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ***************************************************************************/

import { connect } from 'preact-redux';
import { h } from 'preact';

import classNames from 'classnames';

import element from '../../chem/element';
import Atom from '../component/view/atom';
import Icon from '../component/view/icon';
import ActionMenu, { shortcutStr } from '../component/actionmenu';

import action from '../action';
import { atomCuts } from '../action/atoms';
import templates from '../data/templates';

import { zoomList } from '../../ui/action/zoom';

import kvp from 'key-value-pointer';
import molfile from '../../chem/molfile';

// The variable toolbar_configuration is imported if a toolbar_configuration.json
// file exists in the main directory. If the correct settings are not found in
// this file, it falls back on defaults.
if(typeof toolbar_configuration.mainmenu === "undefined"){
	console.log("Mainmenu settings not found in toolbar_configuration.json - falling back on defaults.");
	var mainmenu=[
			"new",
			"open",
			"save",
			"vertical-seperator",
			"undo",
			"redo",
			"cut",
			"copy",
			"paste",
			"vertical-seperator",
			"zoom-in",
			"zoom-out",
			"vertical-seperator",
			"layout",
			"clean",
			"arom",
			"dearom",
			"cip",
			"check",
			"analyse",
			"vertical-seperator",
			"recognize",
			"miew"
		];
}else{
	// Extract the mainmenu settings from the toolbar configuration.
	var mainmenu=toolbar_configuration.mainmenu;
}

if(typeof toolbar_configuration.toolbox === "undefined"){
	console.log("Toolbar settings not found in toolbar_configuration.json - falling back on defaults.");
	var toolbox=[
		{
			"id": "select",
			"menu": [
					"select-lasso",
					"select-rectangle",
					"select-fragment"
			]
		},
		"erase",
		"horizontal-seperator",
		{
			"id": "bond-common",
			"menu": [
				"bond-single",
				"bond-double",
				"bond-triple"
			]
		},
		"chain",
		"horizontal-seperator",
		{
			"id": "charge",
			"menu": [
				"charge-plus",
				"charge-minus"
			]
		},
		"horizontal-seperator",
		"transform-rotate",
		"transform-flip-h",
		"transform-flip-v",
		"sgroup",
		"sgroup-data",
		"horizontal-seperator",
		{
			"id": "reaction",
			"menu": [
				"reaction-arrow",
				"reaction-plus",
				"reaction-automap",
				"reaction-map",
				"reaction-unmap"
			]
		},
		"horizontal-seperator",
		{
			"id": "rgroup",
			"menu": [
				"rgroup-label",
				"rgroup-fragment",
				"rgroup-attpoints"
			]
		}
	]
}else{
	var toolbox=toolbar_configuration.toolbox;
}


if(typeof toolbar_configuration.atoms === "undefined"){
	console.log("Atom settings not found in toolbar_configuration.json - falling back on defaults.");
	var atoms = ['H', 'C', 'N', 'O', 'S', 'P', 'F', 'Cl', 'Br', 'I'];
}else{
	var atoms=toolbar_configuration.atoms;
}

// After we load in our atoms, export it for use in other locations in the app.
export const basicAtoms = atoms;

// Replace any strings with the actual react components
kvp(mainmenu).query(function (node) {
		if (node.key === 'component') {
			switch(node.value){
				case "ZoomList":
					this.replace(node.pointer, ZoomList);
					break;
				case "AtomsList":
					this.replace(node.pointer, AtomsList);
					break;
				case "TemplatesList":
					this.replace(node.pointer, TemplatesList);
					break;
				case "FrequentAtom":
					this.replace(node.pointer, (props => AtomsList(props['freqAtoms'], props)));
					break;
			}
		}
});

// Replace any strings with the actual react components
kvp(toolbox).query(function (node) {
		if (node.key === 'component') {
			switch(node.value){
				case "ZoomList":
					this.replace(node.pointer, ZoomList);
					break;
				case "AtomsList":
					this.replace(node.pointer, AtomsList);
					break;
				case "TemplatesList":
					this.replace(node.pointer, TemplatesList);
					break;
				case "FrequentAtom":
					this.replace(node.pointer, (props => AtomsList(props['freqAtoms'], props)));
					break;
			}
		}
});

const template = [
	{
	    "id": "zoom-list",
	    "component": ZoomList
	},
	{
			"id": "done",
			"component": DoneButton
	},
	{
			"id": "cancel",
			"component": CancelButton
	}
];

function CancelButton({ status, onAction }) {
	return (
		<div
			id="cancel-button"
			onClick={() => (window.close())}
		>
		Cancel
		</div>
	);
}

// Return the MOL string  of the molecules draw in the edit
function writeMolfile() {
  console.log(molfile.stringify(ketcher.editor.struct(),
		{ ignoreErrors: true })
  );
}

function DoneButton({ status, onAction }) {
	return (
		<div
			id="done-button"
			onClick={() => {writeMolfile(); window.close();}}
		>
		Insert
		</div>
	);
}

const elements = [
	{
		id: 'atom',
		component: props => AtomsList(atoms, props)
	},
	{
		id: 'freq-atoms',
		component: props => AtomsList(props['freqAtoms'], props)
	},
	'period-table'
];

const toolbar = [
	{ id: 'mainmenu', menu: mainmenu },
	{ id: 'toolbox', menu: toolbox },
	{ id: 'template', menu: template }
];


function ZoomList({ status, onAction }) {
	const zoom = status.zoom && status.zoom.selected; // TMP
	return (
		<select
			value={zoom}
			onChange={ev => onAction(editor => editor.zoom(parseFloat(ev.target.value)))}
		>
			{
				zoomList.map(val => (
					<option value={val}>{`${(val * 100).toFixed()}%`}</option>
				))
			}
		</select>
	);
}

function AtomsList(atoms, { active, onAction }) {
	const isAtom = active && active.tool === 'atom';

	// atoms is a list of atoms to display. We just want to display the last in the array.
	let lastAtomArray = (atoms.length==0?[]:[atoms[atoms.length-1]]);

	return (
		<menu>
			{
				lastAtomArray.map((label) => {
					const index = element.map[label];
					const shortcut = Object.keys(atomCuts).indexOf(label) > -1 ? shortcutStr(atomCuts[label]) : null;
					return (
						<li
							className={classNames({
								selected: isAtom && active.opts.label === label
							})}
						>
							<Atom
								el={element[index]}
								shortcut={shortcut}
								onClick={() => onAction({ tool: 'atom', opts: { label } })}
							/>
						</li>
					);
				})
			}
		</menu>
	);
}

function TemplatesList({ active, onAction }) {
	const shortcut = shortcutStr(action['benzene'].shortcut);
	const isTmpl = active && active.tool === 'template';
	return (
		<menu>
			{
				templates.map((struct, i) => (
					<li
						id={`template-${i}`}
						className={classNames({
							selected: isTmpl && active.opts.struct === struct
						})}
					>
						<button
							title={`${struct.name} (${shortcut})`}
							onClick={() => onAction({ tool: 'template', opts: { struct } })}
						>
							<Icon name={`template-${i}`} />{struct.name}
						</button>
					</li>
				))
			}
		</menu>
	);
}

export default connect(
	state => ({
		active: state.actionState && state.actionState.activeTool,
		status: state.actionState || {},
		freqAtoms: state.toolbar.freqAtoms,
		opened: state.toolbar.opened,
		visibleTools: state.toolbar.visibleTools
	}),	{
		onOpen: (menuName, isSelected) => ({ type: 'OPENED', data: { menuName, isSelected } })
	}
)(props => (
	<ActionMenu menu={toolbar} role="toolbar" {...props} />
));

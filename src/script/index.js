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

import 'babel-polyfill';
import 'whatwg-fetch';
import queryString from 'query-string';

import api from './api';
import molfile from './chem/molfile';
import smiles from './chem/smiles';
import * as structformat from './ui/data/convert/structformat';

import ui from './ui';
import Render from './render';

// Return a SMILES string that represents the molecules draw in the editor
function getSmiles() {
	return smiles.stringify(ketcher.editor.struct(),
		{ ignoreErrors: true });
}

// Return a promise that can be used to save the SMILES string to a file
function saveSmiles() {
	const struct = ketcher.editor.struct();
	return structformat.toString(struct, 'smiles-ext', ketcher.server)
		.catch(() => smiles.stringify(struct));
}

// Return the MOL string  of the molecules draw in the edit
function getMolfile() {
	return molfile.stringify(ketcher.editor.struct(),
		{ ignoreErrors: true });
}

// Clear the current fragments on the canvas and load the molecule from the MOL string
function setMolecule(molString) {
	if (!(typeof molString === 'string'))
		return;
	ketcher.ui.load(molString, {
		rescale: true
	});
}

// Add the following fragment to the canvas
function addFragment(molString) {
	if (!(typeof molString === 'string'))
		return;
	ketcher.ui.load(molString, {
		rescale: true,
		fragment: true
	});
}

function showMolfile(clientArea, molString, options) {
	const render = new Render(clientArea, Object.assign({
		scale: options.bondLength || 75
	}, options));
	if (molString) {
		const mol = molfile.parse(molString);
		render.setMolecule(mol);
	}
	render.update();
	// not sure we need to expose guts
	return render;
}

// Function that initalizes the ketcher UI and editing area
function intializeKetcher(){
	const params = queryString.parse(document.location.search);

	// Create an object that contains the information about this app
	const appInformation = Object.assign({}, params, buildInfo);

	// Initialize the UI and return a link back to the redux store
	ketcher.ui = ui(appInformation);

	// Store a pointer to the canvas region. This pointer is set by the root
	// reducer
	ketcher.editor = global._ui_editor;
}

// On load of the window, load up the ketcher UI and editor
window.onload = function () {
	intializeKetcher();
};

// Set the build info of this application
const buildInfo = {
	version: '__VERSION__',
	apiPath: '__API_PATH__',
	buildDate: '__BUILD_DATE__',
	buildNumber: '__BUILD_NUMBER__' || null
};

// Export the following functions to the ketcher module
const ketcher = module.exports = Object.assign({ // eslint-disable-line no-multi-assign
	getSmiles,
	saveSmiles,
	getMolfile,
	setMolecule,
	addFragment,
	showMolfile
}, buildInfo);

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

// Resolve the atom shortcuts from the shortcut_configuration object.
function resolveAtomShortcuts(){
	if(typeof shortcut_configuration["atoms"] !== "undefined"){
		return shortcut_configuration["atoms"];
	}else{
		return null;
	}
}

// Generate the atom shortcut objects
function generateAtomShortcutObjects(){
	var atomShortcuts = resolveAtomShortcuts();

	return Object.keys(atomShortcuts).reduce((res, label) => {
		// If the user has specified a shortcut for this atom, add a shortcut
		// object with the new shortcut.
		if(atomShortcuts !== null && typeof atomShortcuts[label] !== undefined){
			res[`atom-${label.toLowerCase()}`] = {
				title: `Atom ${label}`,
				shortcut: atomShortcuts[label],
				action: {
					tool: 'atom',
					opts: { label }
				}
			};
			return res;
		}else{ // Otherwise, return the shortcut object without a shortcut.
			res[`atom-${label.toLowerCase()}`] = {
				title: `Atom ${label}`,
				action: {
					tool: 'atom',
					opts: { label }
				}
			};
			return res;
		}
	}, {});
}

export default generateAtomShortcutObjects();
export const atomCuts = resolveAtomShortcuts();

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

import templates from "../data/templates";

const templateRawShortcutObjects = {
	"template-lib": {
		title: "Custom Templates",
		action: { dialog: "templates" }
	}
};

function resolveTemplateShortcuts(){
	if(typeof shortcut_configuration["templates"] !== "undefined"){
		return shortcut_configuration["templates"];
	}else{
		return null;
	}
}
// Generate the atom shortcut objects
function generateTemplateShortcutObjects(){
	var templateShortcuts = resolveTemplateShortcuts();

  // For each mainmenu shortcut object, look at the user configuration to see
  // if the user has specified a shortcut. If so, add the shortcut to the
  // object.
	return Object.keys(templateRawShortcutObjects).reduce((res, label) => {
    // Create a new shortcut object
		var newShortcutObject = templateRawShortcutObjects[label];

    // If the user specified a shortcut, add it to this object.
    if(templateShortcuts !== null && typeof templateShortcuts[label] !== "undefined"){
      newShortcutObject.shortcut = templateShortcuts[label];
    }

    // Add this new object to the reduced result.
    res[label] = newShortcutObject;

    // Return the reduced result.
		return res;
	}, {});
}

export default templates.reduce((res, struct, i) => {
	var templateShortcuts = resolveTemplateShortcuts();

	if(templateShortcuts !== null && typeof templateShortcuts["default-template"] !== "undefined"){
		res[`template-${i}`] = {
			title: `${struct.name}`,
			shortcut: templateShortcuts["default-template"],
			action: {
				tool: "template",
				opts: { struct }
			}
		};
	}else{
		res[`template-${i}`] = {
			title: `${struct.name}`,
			action: {
				tool: "template",
				opts: { struct }
			}
		};
	}
	return res;
}, generateTemplateShortcutObjects());

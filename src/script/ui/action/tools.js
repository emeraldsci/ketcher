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

import { bond as bondSchema } from "../data/schema/struct-schema";
import { toBondType } from "../data/convert/structconv";

// Define the behavior of each of our shortcuts
var toolRawShortcutObjects = {
	"select-lasso": {
		"title": "Lasso Selection",
		"action": { tool: "select", opts: "lasso" }
	},
	"select-rectangle": {
		"title": "Rectangle Selection",
		"action": { tool: "select", opts: "rectangle" }
	},
	"select-fragment": {
		"title": "Fragment Selection",
		"action": { tool: "select", opts: "fragment" }
	},
	erase: {
		"title": "Erase",
		"action": { tool: "eraser", opts: 1 } // TODO last selector mode is better
	},
	chain: {
		"title": "Chain",
		"action": { tool: "chain" }
	},
	"chiral-flag": {
		"title": "Chiral Flag",
		"action": { tool: "chiralFlag" },
		"selected": editor => editor.struct().isChiral
	},
	"charge-plus": {
		"title": "Charge Plus",
		"action": { tool: "charge", opts: 1 }
	},
	"charge-minus": {
		"title": "Charge Minus",
		"action": { tool: "charge", opts: -1 }
	},
	"monoradical": {
		"title": "Monoradical",
		"action": { tool: "radical", opts: 2 }
	},
	"diradical-singlet": {
		"title": "Diradical (singlet)",
		"action": { tool: "radical", opts: 1 }
	},
	"diradical-triplet": {
		"title": "Diradical (triplet)",
		"action": { tool: "radical", opts: 3 }
	},
	"transform-rotate": {
		"title": "Rotate Tool",
		"action": { tool: "rotate" }
	},
	"transform-flip-h": {
		"title": "Horizontal Flip",
		"action": { tool: "rotate", opts: "horizontal" }
	},
	"transform-flip-v": {
		"title": "Vertical Flip",
		"action": { tool: "rotate", opts: "vertical" }
	},
	sgroup: {
		"title": "S-Group",
		"action": { tool: "sgroup" }
	},
	"sgroup-data": {
		"title": "Data S-Group",
		"action": { tool: "sgroup", opts: "DAT" }
	},
	"reaction-arrow": {
		"title": "Reaction Arrow Tool",
		"action": { tool: "reactionarrow" }
	},
	"reaction-plus": {
		"title": "Reaction Plus Tool",
		"action": { tool: "reactionplus" }
	},
	"reaction-map": {
		"title": "Reaction Mapping Tool",
		"action": { tool: "reactionmap" }
	},
	"reaction-unmap": {
		"title": "Reaction Unmapping Tool",
		"action": { tool: "reactionunmap" }
	},
	"rgroup-label": {
		"title": "R-Group Label Tool",
		"action": { tool: "rgroupatom" }
	},
	"rgroup-fragment": {
		"title": "R-Group Fragment Tool",
		"action": { tool: "rgroupfragment" }
	},
	"rgroup-attpoints": {
		"title": "Attachment Point Tool",
		"action": { tool: "apoint" }
	}
};

// Get the user defined tool shortcuts from shortcut_configuration.json
function resolveToolShortcuts(){
	if(typeof shortcut_configuration["tools"] !== "undefined"){
		return shortcut_configuration["tools"];
	}else{
		return null;
	}
}

// Generate the tool shortcut objects
function generateToolShortcutObjects(){
	var toolShortcuts = resolveToolShortcuts();

  // For each mainmenu shortcut object, look at the user configuration to see
  // if the user has specified a shortcut. If so, add the shortcut to the
  // object.
	return Object.keys(toolRawShortcutObjects).reduce((res, label) => {
    // Create a new shortcut object
		var newShortcutObject = toolRawShortcutObjects[label];

    // If the user specified a shortcut, add it to this object.
    if(toolShortcuts !== null && typeof toolShortcuts[label] !== "undefined"){
      newShortcutObject.shortcut = toolShortcuts[label];
    }

    // Add this new object to the reduced result.
    res[label] = newShortcutObject;

    // Return the reduced result.
		return res;
	}, {});
}

// Resolve the user defined bond shortcuts from short_configuration.json
function resolveBondShortcuts(){
	if(typeof shortcut_configuration["bonds"] !== "undefined"){
		return shortcut_configuration["bonds"];
	}else{
		return null;
	}
}

// Go through the bond shortcuts and intiialize objects for each bond with a
// user defined shortcut. Combine the bond shortcut objects with the tool
// shortcut objects.
const bondShortcuts = resolveBondShortcuts();
const typeSchema = bondSchema.properties.type;
export default typeSchema.enum.reduce((res, type, i) => {
	if(bondShortcuts !== null && typeof bondShortcuts[type] !== "undefined"){
		res[`bond-${type}`] = {
			"title": `${typeSchema.enumNames[i]} Bond`,
			"shortcut": bondShortcuts[type],
			"action": {
				tool: "bond",
				opts: toBondType(type)
			}
		};
	}else{
		res[`bond-${type}`] = {
			"title": `${typeSchema.enumNames[i]} Bond`,
			"action": {
				tool: "bond",
				opts: toBondType(type)
			}
		};
	}
	return res;
}, generateToolShortcutObjects());

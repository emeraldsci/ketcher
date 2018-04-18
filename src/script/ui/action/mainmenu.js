import { exec } from "../component/cliparea";

function hasSelection(editor) {
	const selection = editor.selection();
	return selection && // if not only sgroupData selected
		(Object.keys(selection).length > 1 || !selection.sgroupData);
}

function dontClipMessage(title) {
	alert("This action is unavailable via menu.\n" + // eslint-disable-line no-undef
		"Instead, use shortcut to " + title + ".");
}

// The main menu shortcut objects without their shortcuts.
var mainMenuRawShortcutObjects = {
  "new": {
    "title": "Clear Canvas",
    "action": {
      "thunk": (dispatch, getState) => {
        const editor = getState().editor;
        if (!editor.struct().isBlank())
          editor.struct(null);
        dispatch({ type: "ACTION", "action": tools["select-lasso"].action });
      }
    }
  },
  "open": {
    "title": "Open…",
    "action": { dialog: "open" }
  },
  "save": {
    "title": "Save As…",
    "action": { dialog: "save" }
  },
  "undo": {
    "title": "Undo",
    "action": (editor) => {
      editor.undo();
    },
    "disabled": editor => (
      editor.historySize().undo === 0
    )
  },
  "redo": {
    "title": "Redo",
    "action": (editor) => {
      editor.redo();
    },
    "disabled": editor => (
      editor.historySize().redo === 0
    )
  },
  "cut": {
    "title": "Cut",
    "action": () => {
      exec("cut") || dontClipMessage("Cut"); // eslint-disable-line no-unused-expressions
    },
    "disabled": editor => !hasSelection(editor)
  },
  "copy": {
    "title": "Copy",
    "action": () => {
      exec("copy") || dontClipMessage("Copy"); // eslint-disable-line no-unused-expressions
    },
    "disabled": editor => !hasSelection(editor)
  },
  "paste": {
    "title": "Paste",
    "action": () => {
      exec("paste") || dontClipMessage("Paste"); // eslint-disable-line no-unused-expressions
    },
    "selected": ({ actions }) => (
      actions && // TMP
        actions.active && actions.active.tool === "paste"
    )
  },
  "settings": {
    "title": "Settings",
    "action": { dialog: "settings" }
  },
  "help": {
    "title": "Help",
    "action": { dialog: "help" }
  },
  "about": {
    "title": "About",
    "action": { dialog: "about" }
  },
  "reaction-automap": {
    "title": "Reaction Auto-Mapping Tool",
    "action": { dialog: "automap" }
  },
  "period-table": {
    "title": "Periodic Table",
    "action": { dialog: "period-table" }
  },
  "select-all": {
    "title": "Select All",
    "action": {
      "thunk": (dispatch, getState) => {
        getState().editor.selection("all");
        const selectionTool = getState().toolbar.visibleTools.select;
        dispatch({ type: "ACTION", "action": tools[selectionTool].action });
      }
    }
  },
  "deselect-all": {
    "title": "Deselect All",
    "action": (editor) => {
      editor.selection(null);
    }
  },
  "select-descriptors": {
    "title": "Select descriptors",
    "action": {
      "thunk": (dispatch, getState) => {
        const selectionTool = getState().toolbar.visibleTools.select;
        const editor = getState().editor;
        editor.alignDescriptors();
        editor.selection("descriptors");
        dispatch({ type: "ACTION", "action": tools[selectionTool].action });
      }
    }
  }
};

function resolveMainMenuShortcuts(){
	if(typeof shortcut_configuration["mainmenu"] !== "undefined"){
		return shortcut_configuration["mainmenu"];
	}else{
		return null;
	}
}
// Generate the atom shortcut objects
function generateMainMenuShortcutObjects(){
	var mainMenuShortcuts = resolveMainMenuShortcuts();

  // For each mainmenu shortcut object, look at the user configuration to see
  // if the user has specified a shortcut. If so, add the shortcut to the
  // object.
	return Object.keys(mainMenuRawShortcutObjects).reduce((res, label) => {
    // Create a new shortcut object
		var newShortcutObject = mainMenuRawShortcutObjects[label];

    // If the user specified a shortcut, add it to this object.
    if(mainMenuShortcuts !== null && typeof mainMenuShortcuts[label] !== "undefined"){
      newShortcutObject.shortcut = mainMenuShortcuts[label];
    }

    // Add this new object to the reduced result.
    res[label] = newShortcutObject;

    // Return the reduced result.
		return res;
	}, {});
}

export default generateMainMenuShortcutObjects();

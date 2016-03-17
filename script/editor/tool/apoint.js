var Action = require('../action');
var HoverHelper = require('./helper/hover');
var EditorTool = require('./base');

var ui = global.ui;

var APointTool = function (editor) {
	this.editor = editor;

	this._hoverHelper = new HoverHelper(this);
};
APointTool.prototype = new EditorTool();
APointTool.prototype.OnMouseMove = function (event) {
	this._hoverHelper.hover(this.editor.render.findItem(event, ['atoms']));
};
APointTool.prototype.OnMouseUp = function (event) {
	var rnd = this.editor.render;
	var ci = rnd.findItem(event, ['atoms']);
	if (ci && ci.map == 'atoms') {
		this._hoverHelper.hover(null);
		var apOld = rnd.ctab.molecule.atoms.get(ci.id).attpnt;
		ui.showAtomAttachmentPoints({
			primary: ((apOld || 0) & 1) > 0,
			secondary: ((apOld || 0) & 2) > 0,
			onOk: function (res) {
				var apNew = (res.primary && 1) + (res.secondary && 2);
				if (apOld != apNew) {
					ui.addUndoAction(Action.fromAtomsAttrs(ci.id, { attpnt: apNew }), true);
					rnd.update();
				}
			}
		});
		return true;
	}
};

module.exports = APointTool;
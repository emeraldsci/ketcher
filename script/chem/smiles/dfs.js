var Set = require('../../util/set');

function Dfs(mol, atomData, components, nReactants) {
	this.molecule = mol;
	this.atom_data = atomData;
	this.components = components;
	this.nComponentsInReactants = -1;
	this.nReactants = nReactants;

	this.vertices = new Array(this.molecule.atoms.count()); // Minimum size
	this.molecule.atoms.each(function (aid) {
		this.vertices[aid] = new Dfs.VertexDesc();
	}, this);

	this.edges = new Array(this.molecule.bonds.count()); // Minimum size
	this.molecule.bonds.each(function (bid) {
		this.edges[bid] = new Dfs.EdgeDesc();
	}, this);

	this.v_seq = [];
}

Dfs.VertexDesc = function () {
	this.dfs_state = 0;       // 0 -- not on stack
	// 1 -- on stack
	// 2 -- removed from stack
	this.parent_vertex = 0;   // parent vertex in DFS tree
	this.parent_edge = 0;     // edge to parent vertex
	this.branches = 0;    // how many DFS branches go out from this vertex}
};

Dfs.EdgeDesc = function () {
	this.opening_cycles = 0; // how many cycles are
	// (i) starting with this edge
	// and (ii) ending in this edge's first vertex
	this.closing_cycle = 0;  // 1 if this edge closes a cycle
};

Dfs.SeqElem = function (vIdx, parVertex, parEdge) {
	this.idx = vIdx;                // index of vertex in _graph
	this.parent_vertex = parVertex; // parent vertex in DFS tree
	this.parent_edge = parEdge;     // edge to parent vertex
};

Dfs.prototype.walk = function () { // eslint-disable-line max-statements
	var vStack = [];
	var i, j;
	var cid = 0;
	var component = 0;

	while (true) { // eslint-disable-line no-constant-condition
		if (vStack.length < 1) {
			var selected = -1;

			var findFunc = function (aid) { // eslint-disable-line func-style
				if (this.vertices[aid].dfs_state == 0) {
					selected = aid;
					return true;
				}
				return false;
			};

			while (cid < this.components.length && selected == -1) {
				selected = Set.find(this.components[cid], findFunc, this);
				if (selected === null) {
					selected = -1;
					cid++;
				}
				if (cid == this.nReactants)
					this.nComponentsInReactants = component;
			}
			if (selected < -1)
				this.molecule.atoms.find(findFunc, this);
			if (selected == -1)
				break;
			this.vertices[selected].parent_vertex = -1;
			this.vertices[selected].parent_edge = -1;
			vStack.push(selected);
			component++;
		}

		var vIdx = vStack.pop();
		var parentVertex = this.vertices[vIdx].parent_vertex;

		var seqElem = new Dfs.SeqElem(vIdx, parentVertex, this.vertices[vIdx].parent_edge);
		this.v_seq.push(seqElem);

		this.vertices[vIdx].dfs_state = 2;

		var atomD = this.atom_data[vIdx];

		for (i = 0; i < atomD.neighbours.length; i++) {
			var neiIdx = atomD.neighbours[i].aid;
			var edgeIdx = atomD.neighbours[i].bid;

			if (neiIdx == parentVertex)
				continue; // eslint-disable-line no-continue

			if (this.vertices[neiIdx].dfs_state == 2) {
				this.edges[edgeIdx].closing_cycle = 1;

				j = vIdx;

				while (j != -1 && this.vertices[j].parent_vertex != neiIdx)
					j = this.vertices[j].parent_vertex;

				if (j == -1)
					throw new Error('cycle unwind error');

				this.edges[this.vertices[j].parent_edge].opening_cycles++;
				this.vertices[vIdx].branches++;

				seqElem = new Dfs.SeqElem(neiIdx, vIdx, edgeIdx);
				this.v_seq.push(seqElem);
			} else {
				if (this.vertices[neiIdx].dfs_state == 1) {
					j = vStack.indexOf(neiIdx);

					if (j == -1) // eslint-disable-line max-depth
						throw new Error('internal: removing vertex from stack');

					vStack.splice(j, 1);

					var parent = this.vertices[neiIdx].parent_vertex;

					if (parent >= 0) // eslint-disable-line max-depth
						this.vertices[parent].branches--;
				}

				this.vertices[vIdx].branches++;
				this.vertices[neiIdx].parent_vertex = vIdx;
				this.vertices[neiIdx].parent_edge = edgeIdx;
				this.vertices[neiIdx].dfs_state = 1;
				vStack.push(neiIdx);
			}
		}
	}
};

Dfs.prototype.edgeClosingCycle = function (eIdx) {
	return this.edges[eIdx].closing_cycle != 0;
};

Dfs.prototype.numBranches = function (vIdx) {
	return this.vertices[vIdx].branches;
};

Dfs.prototype.numOpeningCycles = function (eIdx) {
	return this.edges[eIdx].opening_cycles;
};

Dfs.prototype.toString = function () {
	var str = '';
	this.v_seq.each(function (seqElem) {
		str += seqElem.idx + ' -> ';
	});
	str += '*';
	return str;
};

module.exports = Dfs;
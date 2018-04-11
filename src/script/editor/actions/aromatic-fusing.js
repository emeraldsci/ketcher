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

import molfile from '../../chem/molfile';
import { Bond } from '../../chem/struct';

import op from '../shared/op';
import Action from '../shared/action';

/**
 * @param restruct { ReStruct }
 * @param events { Array<PipelineSubscription> }
 * @param bid { number }
 * @param template {{
 * 		molecule: Struct,
 * 		bid: number
 *  }}
 * @param simpleFusing { Function }
 * @returns { Promise }
 */
export function fromAromaticTemplateOnBond(restruct, template, bid, events, simpleFusing) {
	const tmpl = template.molecule;
	const struct = restruct.molecule;

	const frid = struct.getBondFragment(bid);
	const beforeMerge = getFragmentWithBondMap(struct, frid);
	let afterMerge = null;
	let pasteItems = null;

	let action = new Action();

	action = simpleFusing(restruct, template, bid);
	return Promise.resolve(action);
}

function fromAromatize(restruct, astruct, bondMap) {
	const action = new Action();

	astruct.bonds.forEach((bond, bid) => {
		if (bond.type !== Bond.PATTERN.TYPE.AROMATIC) return;
		action.addOp(
			new op.BondAttr(bondMap.get(bid), 'type', Bond.PATTERN.TYPE.AROMATIC)
				.perform(restruct)
		);
	});

	return action;
}

/**
 * @param restruct { ReStruct }
 * @param dastruct { ReStruct }
 * @param bondMap { Map<number, number> }
 * @returns { Action }
 */
function fromDearomatize(restruct, dastruct, bondMap) {
	const action = new Action();

	dastruct.bonds.forEach((bond, bid) => {
		action.addOp(
			new op.BondAttr(bondMap.get(bid), 'type', bond.type)
				.perform(restruct)
		);
	});

	return action;
}

/* UTILS */

function canBeAromatized(struct) { // TODO correct this checking && move to chem.Struct ??
	if (struct.loops.size === 0) struct.prepareLoopStructure();

	const hasAromLoop = struct.loops.find((id, loop) => loop.aromatic);
	if (struct.loops.size === 0 || hasAromLoop) return false;

	const correctDblBonds = struct.loops.find((id, loop) =>
		loop.dblBonds === (loop.hbs.length / 2));

	return correctDblBonds !== undefined;
}

/**
 * @param struct { Struct }
 * @param frid { number }
 * @returns {{
 * 		frag: Struct,
 * 		bondMap: Map<number, number>
 *  }}
 */
function getFragmentWithBondMap(struct, frid) {
	const atomSet = struct.getFragmentIds(frid);
	const atomsInStruct = Array.from(atomSet);

	const frag = struct.clone(atomSet);
	const bondMap = new Map();
	frag.bonds.forEach((bond, bid) => {
		bondMap.set(bid, struct.findBondId(atomsInStruct[bond.begin], atomsInStruct[bond.end]));
	});

	return { frag, bondMap };
}

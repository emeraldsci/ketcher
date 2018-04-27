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
import { h } from 'preact';
import { xor } from 'lodash/fp';

function oneOrMore(multipl, values, item) {
	if (multipl) return xor(values, [item]);
	return xor(values, values.concat([item]));
}

function ButtonList({ value, onChange, schema, disabledIds, multiple }) {
	let className;

	// If all of our buttons start with R, assume that we're displaying the
	// button list for the R group menu.
	let matchesRGroup = schema.items.enumNames.every(element => element.startsWith("R"));

	let innerText;

	return (
		<ul>
			{
				schema.items.enum.map((item, i) => {
					className = value.includes(item) ? 'selected' : '';
					innerText = matchesRGroup?(
						<div>
							R<sup>{schema.items.enumNames[i].substring(1)}</sup>
						</div>
					):(
						schema.items.enumNames[i]
					);
					return (
						<li>
							<button
								disabled={disabledIds.includes(item)}
								type="button"
								className={className}
								onClick={() => (onChange(oneOrMore(multiple, value, item)))}
							>
								{innerText}
							</button>
						</li>
					);
				})
			}
		</ul>
	);
}

export default ButtonList;

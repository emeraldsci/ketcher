/****************************************************************************
 * Copyright 2020 EPAM Systems
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

import React from 'react'
import element from '../../../chem/element'
// import { sketchingColors as elementColor } from '../../../chem/element-color'

// const metPrefix = ['alkali', 'alkaline-earth', 'transition', 'post-transition'] // 'lanthanide', 'actinide'

function atomClass(el) {
  // const type =
  //   metPrefix.indexOf(el.type) >= 0
  //     ? `${el.type} metal`
  //     : el.type || 'unknown-props'
  // return [type, el.state || 'unknown-state', el.origin]
  return ["ecl-atom", el.state || 'unknown-state', el.origin]
}

function Atom({ el, shortcut, className, ...props }) {
  return (
    <button
      type="button"
      // title={shortcut ? `${el.title} (${shortcut})` : el.title}
      className={[...atomClass(el), className].join(' ')}
      // style={{ color: elementColor[el.label] }}
      value={element.map[el.label]}
      {...props}>
      <span>{el.label}</span>
    </button>
  )
}

export default Atom

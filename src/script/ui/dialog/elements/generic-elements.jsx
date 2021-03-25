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

import React, { useState } from 'react';
import { connect } from 'react-redux'
import Dialog from '../../component/dialog';
import generics from '../../../chem/generics';
import { fromElement, toElement } from '../../data/convert/structconv';
import { onAction } from '../../state';
import classNames from 'classnames'

const viewSchema = {
  atom: {
    caption: 'Atom Generics',
    order: ['any', 'no-carbon', 'metal', 'halogen']
  },
  group: {
    caption: 'Group Generics',
    order: ['acyclic', 'cyclic']
  },
  special: {
    caption: 'Special Nodes',
    order: []
  },
  'group/acyclic': {
    caption: 'Acyclic',
    order: ['carbo', 'hetero']
  },
  'group/cyclic': {
    caption: 'Cyclic',
    order: ['no-carbon', 'carbo', 'hetero']
  },
  'group/acyclic/carbo': {
    caption: 'Carbo',
    order: ['alkynyl', 'alkyl', 'alkenyl']
  },
  'group/acyclic/hetero': {
    caption: 'Hetero',
    order: ['alkoxy']
  },
  'group/cyclic/carbo': {
    caption: 'Carbo',
    order: ['aryl', 'cycloalkyl', 'cycloalkenyl']
  },
  'group/cyclic/hetero': {
    caption: 'Hetero',
    order: ['aryl']
  },
  'atom/any': 'any atom',
  'atom/no-carbon': 'except C or H',
  'atom/metal': 'any metal',
  'atom/halogen': 'any halogen',
  'group/cyclic/no-carbon': 'no carbon',
  'group/cyclic/hetero/aryl': 'hetero aryl'
}

function GenSet({ labels, caption = '', selected, onSelect, ...props }) {
  return (
    <fieldset {...props}>
      {labels.map(label => (
        <button
          type="button"
          onClick={() => onSelect(label)}
          className={selected(label) ? 'selected' : ''}>
          {label}
        </button>
      ))}
      {caption ? <legend>{caption}</legend> : null}
    </fieldset>
  )
}

function GenGroup({ gen, name, path, selected, onSelect }) {
  const group = gen[name]
  const pk = path ? `${path}/${name}` : name
  const schema = viewSchema[pk]

  return schema && schema.caption ? (
    <fieldset className={name}>
      <legend>{schema.caption}</legend>
      {group.labels ? (
        <GenSet labels={group.labels} selected={selected} onSelect={onSelect} />
      ) : null}
      {schema.order.map((
        child // TODO:order = Object.keys ifndef
      ) => (
        <GenGroup
          gen={group}
          name={child}
          path={pk}
          selected={selected}
          onSelect={onSelect}
        />
      ))}
    </fieldset>
  ) : (
    <GenSet
      labels={group.labels}
      caption={schema || name}
      className={name}
      selected={selected}
      onSelect={onSelect}
    />
  )
}

// const atomicGenerics = [
//   { pseudo: 'A', label: 'any atom' },
//   { pseudo: 'M', label: 'any metal' },
//   { pseudo: 'AH', label: 'any atom with H' },
//   { pseudo: 'MH', label: 'any metal with H' },
//   { pseudo: 'Q', label: 'any atom except C or H' },
//   { pseudo: 'X', label: 'any halogen' },
//   { pseudo: 'QH', label: 'any atom except C or H with H' },
//   { pseudo: 'XH', label: 'any halogen with H' }
// ];

const specialNodes = [
  { pseudo: 'H+', label: 'Hydrogen ion' },
  // { pseudo: 'R', label: 'any functional group' },
  { pseudo: 'D', label: 'Deuterium' },
  // { pseudo: 'Pol', label: 'polymer' },
  { pseudo: 'T', label: 'Tritium' }
];

function GenericElements(props) {

  const [selectedElement, setSelectedElement] = useState(null);
  const selected = (l) => l === selectedElement;
  const onSelect = (l) => {
    Promise.resolve(setSelectedElement(l))
      .then(() => props.onOk(result()));
  };
  const result = () => {
    return selectedElement ? { type: 'gen', label: selectedElement, pseudo: selectedElement } : null;
  };

  return (
    <Dialog
      title="Other"
      className="generic-elements"
      params={props}
      buttons={[]}
      result={result}>
      <div summary="Generic Groups" {...props}>
        {/* <div className="title">Atomic Generics</div>
        <menu className="col atomic">
          {atomicGenerics.map((el, index) =>
            <li key={index}>
              <div>
                <button
                  className={classNames({ selected: selected(el.pseudo) })}
                  onClick={() => onSelect(el.pseudo)}>{el.pseudo}
                </button> {el.label}
              </div>
            </li>
          )}
        </menu> */}
        <div className="title">Special Nodes</div>
        <menu className="col">
        {specialNodes.map((el, index) =>
            <li key={index}>
              <div>
                <button
                  type="button"
                  className={classNames({ selected: selected(el.pseudo) })}
                  onClick={() => onSelect(el.pseudo)}>{el.pseudo}
                </button> {el.label}
              </div>
            </li>
          )}
        </menu>
      </div>
    </Dialog>
  )
}

function mapSelectionToProps(editor) {
  const selection = editor.selection()

  if (
    selection &&
    Object.keys(selection).length === 1 &&
    selection.atoms &&
    Object.keys(selection.atoms).length === 1
  ) {
    const struct = editor.struct()
    const atom = struct.atoms.get(selection.atoms[0])
    return { ...fromElement(atom) }
  }

  return {}
}

export default connect(
  (store, props) => {
    if (props.values || props.label) return {}
    return mapSelectionToProps(store.editor)
  },
  (dispatch, props) => ({
    onOk: res => {
      if (res) {
        dispatch(onAction({ tool: 'atom', opts: toElement(res) }))
        props.onOk(res)
      }
    }
  })
)(GenericElements)

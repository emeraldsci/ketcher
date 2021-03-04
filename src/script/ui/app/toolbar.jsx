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

import { connect } from 'react-redux'
import React, { useState } from 'react'
import { Tooltip } from 'react-tippy';
import classNames from 'classnames'

import element from '../../chem/element'
import Atom from '../component/view/atom'
import Icon from '../component/view/icon'
import ActionMenu, { shortcutStr } from '../component/actionmenu'

import action from '../action'
import { atomCuts, basic as basicAtoms } from '../action/atoms'
import { zoomList } from '../action/zoom'
import templates from '../data/templates'

// const mainmenu = [
//   {
//     id: 'document',
//     menu: ['new', 'open', 'save']
//   },
//   {
//     id: 'edit',
//     menu: ['undo', 'redo', 'cut', 'copy', 'paste']
//   },
//   {
//     id: 'zoom',
//     menu: [
//       'zoom-in',
//       'zoom-out',
//       {
//         id: 'zoom-list',
//         component: ZoomList
//       }
//     ]
//   },
//   {
//     id: 'process',
//     menu: [
//       'layout',
//       'clean',
//       'arom',
//       'dearom',
//       'cip',
//       'check',
//       'analyse',
//       'recognize',
//       'miew'
//     ]
//   },
//   {
//     id: 'meta',
//     menu: ['settings', 'help', 'about']
//   }
// ]

const mainmenu = [
  {
    id: 'document',
    menu: ['open']
  },
  {
    id: 'edit',
    menu: ['undo', 'redo', 'cut', 'copy', 'paste']
  },
  {
    id: 'select',
    menu: ['select-lasso', 'select-rectangle']
  },
  'erase',
  'clean',
  'transform-rotate',
  'transform-flip-h',
  'transform-flip-v',
  {
    id: 'charge',
    menu: ['charge-plus', 'charge-minus']
  },
  {
    id: 'rgroup',
    menu: ['rgroup-label', 'rgroup-fragment']
  },
  'sgroup',
  {
    id: 'zoom',
    menu: [
      {
        id: 'zoom-list',
        component: ZoomList
      }
    ]
  }
]

const secondmenu = [
  {
    id: 'atom',
    menu: [
      {
        id: 'atom-list',
        component: props => AtomsList(basicAtoms, props)
      },
      {
        id: 'generic-elements',
        component: props => {
          return (
            <menu>
              <li
              className={classNames({
              selected: props.active?.opts?.label === 'X'
            })}>
              <Tooltip
                title="Generic elements"
                delay={500}
                theme="transparent"
                position="bottom"
                tag="span"
                popperOptions={{
                  modifiers: {
                    offset: {
                      offset: '0,-60px'
                    }
                  }
                }}
              >
                <Atom
                  el={{ title: 'Generic elements', label: 'X' }}
                  onClick={() => props.onAction({ dialog: 'generic-elements', opts: { label: 'X' }})}
                />
              </Tooltip>
            </li>
            </menu>)
      }},
      'period-table'
    ]
  },
  {
    id: 'bond',
    menu: [
      {
        id: 'bond-common',
        menu: ['bond-single', 'bond-double', 'bond-triple']
      },
      {
        id: 'bond-stereo',
        menu: ['bond-up', 'bond-down', 'bond-updown', 'bond-crossed']
      },
      {
        id: 'bond-query',
        menu: [
          'bond-any',
          'bond-aromatic',
          'bond-singledouble',
          'bond-singlearomatic',
          'bond-doublearomatic'
        ]
      }
    ]
  },
  'chain',
  'template-0',
  'template-1',
  {
    id: 'templates',
    menu: ['template-2', 'template-3', 'template-4', 'template-5', 'template-6', 'template-7']
  },
  'template-lib'
]

const toolbox = [
  {
    id: 'select',
    menu: ['select-lasso', 'select-rectangle', 'select-fragment']
  },
  'erase',
  {
    id: 'bond',
    menu: [
      {
        id: 'bond-common',
        menu: ['bond-single', 'bond-double', 'bond-triple']
      },
      {
        id: 'bond-stereo',
        menu: ['bond-up', 'bond-down', 'bond-updown', 'bond-crossed']
      },
      {
        id: 'bond-query',
        menu: [
          'bond-any',
          'bond-aromatic',
          'bond-singledouble',
          'bond-singlearomatic',
          'bond-doublearomatic'
        ]
      }
    ]
  },
  'chain',
  {
    id: 'charge',
    menu: ['charge-plus', 'charge-minus']
  },
  {
    id: 'transform',
    menu: ['transform-rotate', 'transform-flip-h', 'transform-flip-v']
  },
  'sgroup',
  'sgroup-data',
  {
    id: 'reaction',
    menu: [
      'reaction-arrow',
      'reaction-plus',
      'reaction-automap',
      'reaction-map',
      'reaction-unmap'
    ]
  },
  {
    id: 'rgroup',
    menu: ['rgroup-label', 'rgroup-fragment', 'rgroup-attpoints']
  },
  {
    id: 'shape',
    menu: ['shape-circle', 'shape-rectangle', 'shape-line']
  }
]

const template = [
  {
    id: 'template-common',
    component: TemplatesList
  },
  'template-lib'
  //TODO: it should be enabled after starting work on enhanced stereo
  //'enhanced-stereo'
]

const elements = [
  {
    id: 'atom',
    component: props => AtomsList(basicAtoms, props)
  },
  {
    id: 'freq-atoms',
    component: props => AtomsList(props['freqAtoms'], props)
  },
  'period-table'
]

const toolbar = [
  { id: 'mainmenu', menu: mainmenu },
  { id: 'secondmenu', menu: secondmenu }
  // { id: 'toolbox', menu: toolbox },
  // { id: 'template', menu: template },
  // { id: 'elements', menu: elements }
]

function ZoomList({ status, onAction }) {
  const [ showMenu, setShowMenu ] = useState(false);
  const zoom = status.zoom && status.zoom.selected // TMP

  const upDown = (val) => {
    const currentVal = zoom;
    const ix = zoomList.indexOf(currentVal) + val;
    if (ix > -1 && ix < zoomList.length) {
      const newValue = zoomList[ix];
      if (showMenu) {
        setShowMenu(false);
      }
      submitChange(newValue);
    }
  };

  const doClick = (e, val) => {
    const ix = zoomList.indexOf(val);
    if (ix >= 0) {
      setShowMenu(false);
      submitChange(val);
    }
    e.stopPropagation();
  };

  const submitChange = (val) => {
    onAction(editor => editor.zoom(parseFloat(val)));
  };

  const toggleMenu = (ev) => {
    setShowMenu(!showMenu);
    ev.preventDefault();
  };

  return (
    <div id="zoom-select">
      <div>
        <button id="zoom-down" onClick={ev => upDown(-1)}>-</button>
        <div className="dd-wrapper">
          <div onClick={toggleMenu}>
            <div className="dd-text">{`${(zoom * 100).toFixed()}%`}</div>
            <div className="dd-toggle">&#8964;</div>
          </div>
        </div>
        <button id="zoom-up" onClick={ev => upDown(1)}>+</button>
      </div>
      <ul className={'dd-menu ' + classNames({ hidden: !showMenu })}>
      {zoomList.map(val => (
        <li
          key={val.toString()}
          className={classNames({ selected: val === zoom })}
          onClick={(e) => doClick(e, val)}>
          {`${(val * 100).toFixed()}%`}
        </li>
      ))}
      </ul>
    </div>
  )
}

function AtomsList(atoms, { active, onAction }) {
  const isAtom = active && active.tool === 'atom'
  return (
    <menu>
      {atoms.map((label, ix) => {
        const index = element.map[label]
        const shortcut =
          basicAtoms.indexOf(label) > -1 ? shortcutStr(atomCuts[label]) : null
        return (
          <li
            key={ix}
            className={classNames({
              selected: isAtom && active.opts.label === label
            })}>
            <Tooltip
              title={shortcut ? `${label} (${shortcut})` : label}
              delay={500}
              theme="transparent"
              position="bottom"
              tag="span"
              popperOptions={{
                modifiers: {
                  offset: {
                    offset: '0,-60px'
                  }
                }
              }}
            >
              <Atom
                el={element[index]}
                shortcut={shortcut}
                onClick={() => onAction({ tool: 'atom', opts: { label } })}
              />
            </Tooltip>
          </li>
        )
      })}
    </menu>
  )
}

function TemplatesList({ active, onAction }) {
  const shortcut = shortcutStr(action['template-0'].shortcut)
  const isTmpl = active && active.tool === 'template'
  return (
    <menu>
      {templates.map((struct, i) => (
        <li
          id={`template-${i}`}
          className={classNames({
            selected: isTmpl && active.opts.struct === struct
          })}>
          <button
            title={`${struct.name} (${shortcut})`}
            onClick={() => onAction({ tool: 'template', opts: { struct } })}>
            <Icon name={`template-${i}`} />
          </button>
        </li>
      ))}
    </menu>
  )
}

export default connect(
  state => ({
    active: state.actionState && state.actionState.activeTool,
    status: state.actionState || {},
    freqAtoms: state.toolbar.freqAtoms,
    opened: state.toolbar.opened,
    visibleTools: state.toolbar.visibleTools
  }),
  {
    onOpen: (menuName, isSelected) => ({
      type: 'OPENED',
      data: { menuName, isSelected }
  })
}
)(props => <ActionMenu menu={toolbar} role="toolbar" {...props} />)

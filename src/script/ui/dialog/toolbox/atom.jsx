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

import React, { useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { atom as atomSchema } from '../../data/schema/struct-schema'
import Form, { Field } from '../../component/form/form'
import Dialog from '../../component/dialog'
import { capitalize } from 'lodash/fp'
import element from '../../../chem/element'

function ElementNumber({ label }) {
  const value = element.map[capitalize(label)] || ''
  return (
    <>
      <label>
        Number:
      </label>
      <input className="number" type="text" readOnly value={value} />
    </>
  )
}

function Atom(props) {
  const { formState, ...prop } = props
  const [currentLabel, setCurrentLabel] = useState(prop.label)
  const onLabelChangeCallback = useCallback(newValue => {
    setCurrentLabel(newValue)
  }, [])
  return (
    <Dialog
      title="Atom Properties"
      className="atom-props"
      result={() => formState.result}
      valid={() => formState.valid}
      buttons={['Submit']}
      params={prop}>
      <Form
        schema={atomSchema}
        customValid={{
          label: l => atomValid(l),
          charge: ch => chargeValid(ch)
        }}
        init={prop}
        {...formState}>
        <div className="main">
          <div className="section">
            <div className="field">
              <label>Parity</label>
              <input
                name="parity"
                type="text"
                defaultValue={props.stereoParity}
                readOnly
              />
            </div>
            <div className="field">
              <ElementNumber label={currentLabel} />
            </div>
            <Field name="isotope" />
          </div>
          <div className="section">
            <Field name="label" onChange={onLabelChangeCallback} />
            <Field name="charge" maxLength="5" />
            <Field name="radical" />
          </div>
          <div className="section">
            <Field name="alias" />
            <Field name="explicitValence" />
            <div className="field"></div>
          </div>
        </div>
        <div className="query">
          <div className="legend">Query specific</div>
          <div className="section">
            <Field name="ringBondCount" />
            <Field name="hCount" />
            <Field name="substitutionCount" />
          </div>
          <div className="section">
            <Field name="unsaturatedAtom" labelPos="after" />
          </div>
        </div>
        <div className="reaction">
          <div className="legend">Reaction flags</div>
          <div className="section">
            <Field name="invRet" />
          </div>
          <div className="section">
            <Field name="exactChangeFlag" labelPos="after" />
          </div>
        </div>
      </Form>
    </Dialog>
  )
}

function atomValid(label) {
  return label && !!element.map[capitalize(label)]
}

function chargeValid(charge) {
  const pch = atomSchema.properties.charge.pattern.exec(charge)
  return !(pch === null || (pch[1] !== '' && pch[3] !== ''))
}

export default connect(store => ({ formState: store.modal.form }))(Atom)

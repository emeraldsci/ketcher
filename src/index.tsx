import 'regenerator-runtime/runtime'
import 'whatwg-fetch'
import React, { useEffect, useRef } from 'react'
import 'element-closest-polyfill'
import 'url-search-params-polyfill'
import init from './script'
import './index.less'

interface EditorProps {
  staticResourcesUrl: string
  apiPath?: string
  cleanMolecule(molData: string): Promise<string>
}

export function Editor({ staticResourcesUrl, apiPath, cleanMolecule }: EditorProps) {
  const rootElRef = useRef(null)
  useEffect(() => {
    init(rootElRef.current, staticResourcesUrl, apiPath, cleanMolecule)
  }, [])

  return <div ref={rootElRef} className="ketcher root"></div>
}

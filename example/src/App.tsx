import React from 'react'
//@ts-ignore
import Miew from 'miew'
import 'miew/dist/Miew.min.css'
//@ts-ignore
import { Editor } from '@emeraldsci/ketcher-react'
import '@emeraldsci/ketcher-react/dist/index.css'
;(global as any).Miew = Miew

const cleanMolecule = (molecule: string): Promise<string> => {
  // do MM call here and return cleaned molecule MOL data
  return new Promise((resolve: any) => {
    resolve(molecule);
  })
};

const App = () => {
  return (
    <Editor
      staticResourcesUrl={process.env.PUBLIC_URL}
      // staticResourcesUrl="/static/"
      apiPath=""
      cleanMolecule={cleanMolecule}
    />
  )
}

export default App

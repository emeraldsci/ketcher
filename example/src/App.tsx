import React from 'react'
//@ts-ignore
import Miew from 'miew'
import 'miew/dist/Miew.min.css'
//@ts-ignore
import { Editor } from '@emeraldsci/ketcher-react'
import '@emeraldsci/ketcher-react/dist/index.css'
;(global as any).Miew = Miew

const App = () => {
  return (
    <Editor
      staticResourcesUrl={process.env.PUBLIC_URL}
      apiPath={process.env.REACT_APP_API_PATH}
    />
  )
}

export default App

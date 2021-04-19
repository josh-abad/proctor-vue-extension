import React from 'react'
import ReactDOM from 'react-dom'

const Options = (): JSX.Element => {
  return (
    <>
      <span>Options</span>
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById('options')
)

import { useState } from 'react';
import './App.css'
import { useIFrame } from 'liaison-react';

function App() {
  const [logoutRequests, setLogoutRequests] = useState(0);
  const [tokens, setTokens] = useState<Array<string>>([]);

  const { callParentEffect } = useIFrame({
    parentOrigin: 'http://localhost:3003',
    effects: {
      logout: () => setLogoutRequests(prevNum => prevNum + 1),
      saveToken: ({ args: { token } }) => {
        setTokens(prevTokens => [...prevTokens, token]);
      },
      saveTokenAsync: ({ args: { token } }) => {
        setTokens(prevTokens => [...prevTokens, token]);
      },
    }
  })

  return (
    <>
      <h1>Child Window</h1>
      <div className="buttons">
        <p className="buttons-header">Request to run events within the Parent window!</p>
        <button onClick={initiateParentLogout} className="btn">Initiate <em>Parent</em> Logout Process</button>
        <button onClick={requestTokenFromParent} className="btn">Request Token from Parent (Get Synchronously)</button>
        <button onClick={requestTokenFromParentAsync} className="btn">Request Token from Parent (Get Asynchronously)</button>
      </div>
      <div>
        <h2>Logout Requests:</h2>
        <p>{logoutRequests}</p>
        <h2>Tokens:</h2>
        <ul>
          {tokens.map((token) => <li key={token}>Token: {token}</li>)}
        </ul>
      </div>
    </>
  )

  function initiateParentLogout() {
    callParentEffect({
      name: 'logout',
    })
  }

  function requestTokenFromParent() {
    callParentEffect({
      name: 'sendToken',
    })
  }

  function requestTokenFromParentAsync() {
    callParentEffect({
      name: 'sendTokenAsync',
    })
  }

}

export default App

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
    }
  })

  return (
    <>
      <h1>Child Window</h1>
      <div className="buttons">
        <button onClick={initiateParentLogout}>Initiate <em>Parent</em> Logout Process</button>
        <button onClick={requestTokenFromParent}>Request Token from Parent</button>
      </div>
      <div>
        <h2>Logout Requests:</h2>
        <p>{logoutRequests}</p>
        <h2>Tokens:</h2>
        <ul>
          {tokens.map(token => <li>Token: {token}</li>)}
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

}

export default App

import { useState } from 'react';
import './App.css'
import { useChild } from 'post-punk';

function App() {
  const [logoutRequests, setLogoutRequests] = useState(0);
  const [tokens, setTokens] = useState<Array<string>>([]);

  const { callParentMethod } = useChild({
    parentOrigin: 'http://localhost:3003',
    methods: {
      logout: () => setLogoutRequests(prevNum => prevNum + 1),
      saveToken: ({ methodArgs: { token } }) => {
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
    callParentMethod({
      methodName: 'logout',
    })
  }

  function requestTokenFromParent() {
    callParentMethod({
      methodName: 'sendToken',
    })
  }

}

export default App

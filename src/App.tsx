import { useState } from 'react';
import { useIFrame } from 'liaison-react';
import './App.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tokens, setTokens] = useState<Array<string>>([]);

  const { callParentEffect } = useIFrame({
    parentOrigin: 'http://localhost:3003',
    effects: {
      onLogoutRequested: ({ callParentEffect }) => {
        localStorage.remove('token');
        callParentEffect({ name: 'onLogoutCompleted' });
      },
      onTokenReceived: ({ args: { token } }) => {
        setTokens(prevTokens => [...prevTokens, token]);
      },
    }
  })

  return (
    <>
      <h1>Child Window</h1>
      <div className="buttons">
        <p className="buttons-header">Request to run events within the Parent window!</p>
        <button onClick={requestTokenFromParent} className="btn">Request Token from Parent (Get Synchronously)</button>
        <button onClick={requestTokenFromParentAsync} className="btn">Request Token from Parent (Get Asynchronously)</button>
      </div>
      <div>
        {!loggedIn &&
          <p>You're not logged in...</p>
        }
        {loggedIn &&
          <p>You're logged in!</p>
        }
      </div>
    </>
  )

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

import { useState } from 'react';
import { useIFrame } from 'liaison-react';
import './App.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const { callParentEffect } = useIFrame({
    parentOrigin: 'http://localhost:3003',
    effects: {
      onLogoutRequested: ({ callParentEffect }) => {
        localStorage.removeItem('token');
        setLoggedIn(false);
        callParentEffect({ name: 'onLogoutComplete' });
      },
      onTokenReceived: ({ args: { token } }) => {
        localStorage.setItem('token', token);
        setLoggedIn(true);
      },
    }
  })

  return (
    <>
      <h1>Child Window</h1>
      <div className="buttons">
        <p className="buttons-header">Request to run events within the Parent window!</p>
        <button onClick={requestTokenFromParent} className="btn">REQUEST Token from Parent (Get Synchronously)</button>
        <button onClick={requestTokenFromParentAsync} className="btn">REQUEST Token from Parent (Get Asynchronously)</button>
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
      name: 'onSendTokenSync',
    })
  }

  function requestTokenFromParentAsync() {
    callParentEffect({
      name: 'onSendTokenAsync',
    })
  }

}

export default App

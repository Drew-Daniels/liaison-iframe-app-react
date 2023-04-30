import { useRef, useState, useEffect } from 'react';
import './App.css'
import { Child, IChild } from 'post-punk';

function App() {
  const [logoutRequests, setLogoutRequests] = useState(0);
  const [tokens, setTokens] = useState<Array<string>>([]);
  const childRef = useRef<IChild | null>(null);

  useEffect(() => {
    childRef.current = Child({
      parentOrigin: 'http://localhost:3003',
      handlers: {
        logout: () => setLogoutRequests(prevNum => prevNum + 1),
        saveToken: (token: string) => {
          setTokens(prevTokens => [...prevTokens, token]);
        },
      }
    });
    childRef.current.init();
    return () => {
      if (childRef.current) {
        childRef.current.destroy();
        childRef.current = null
      }
    };
  }, []);

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
    childRef.current?.callParentMethod({
      functionName: 'logout',
    })
  }

  function requestTokenFromParent() {
    childRef.current?.callParentMethod({
      functionName: 'sendToken',
    })
  }

}

export default App

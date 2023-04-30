import { useRef, useEffect } from 'react';
import './App.css'
import { Child, IChild } from 'post-punk';

function App() {
  const childRef = useRef<IChild | null>(null);

  useEffect(() => {
    childRef.current = Child({
      parentOrigin: 'http://localhost:3003',
      handlers: {
        logout: () => console.log('IFrame logging out'),
        saveToken: (token: string) => console.log('IFrame received token: ', token),
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

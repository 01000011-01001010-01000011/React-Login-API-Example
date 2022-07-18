import React, {useState} from 'react';

import Login from './Components/Login';
import Logout from './Components/Logout';
import Register from './Components/Register';

import './App.css';

const clientId = "Replace With Your Google APP ID" + ".apps.googleusercontent.com";    
   
const appId = 'Replace With Your Facebook API ID";

function App() { 

  const [onSuccess, setOnSuccess] = useState(false); // Changes form from login to logout upon successful login

  const [showSignUp, setShowSignup] = useState(false);

  const [processId, setProcessId] = useState(0); // Determines which login process was used Facebook or Google

  const checkLogin = (successfullLogin) => {
    setOnSuccess(successfullLogin);     
  }

  const checkSignUp = (signUp) => {
    setShowSignup(signUp);
  }

  const getProcessId = (processIdNumber) => {
    setProcessId(processIdNumber);
  } 

  return (   
            
    <div className="App">                                   
      
      { !showSignUp && !onSuccess && <Login clientId={clientId} appId={appId} checkLogin={checkLogin} showSignUpForm={checkSignUp} processId={getProcessId} /> } 
      { !showSignUp && onSuccess && <Logout func={checkLogin} checkProcessId={getProcessId} processId={processId} />  }
      { showSignUp && <Register func={checkSignUp} /> }

    </div>   

  );
}

export default App;

import React, {useState} from 'react';

import Login from './Components/Login';
import Logout from './Components/Logout';
import Register from './Components/Register';

import './App.css';

const clientId = "191225946871-vkejok79rqrm4jnrapjqogjf86psk8r5.apps.googleusercontent.com";    
   
const appId=  "724224715524095";

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

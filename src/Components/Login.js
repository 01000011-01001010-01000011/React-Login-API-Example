import React, {useState} from 'react'

import { Form, Message } from 'semantic-ui-react';

import { useForm } from "react-hook-form";

import { GoogleOAuthProvider } from '@react-oauth/google';

import { GoogleLogin } from '@react-oauth/google';

import FacebookLogin from  'react-facebook-login';

import FacebookIcon from '../Assets/facebook.jpg';

import { userService } from '../Services/UserService';

import jwt from 'jwt-decode';

import bcrypt from 'bcryptjs';

import '../CSS/login.css';

const Login = (props) => {    
   
    const { handleSubmit, formState: { formErrors } } = useForm();

    const [enableSubmitButton, setEnableSubmitButton] = useState(false);
   
    const [onEmailError, setOnEmailError] = useState(false);

    const [onPasswordError, setOnPasswordError] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    
    const [emailInput, setEmailInput] = useState('');

    const [passwordInput, setPasswordInput] = useState('');
  
    const rememberMeText = "Remember Me";      

    const submitText = "Continue";    

    const forgotPassword = "Forgot Password?";   
            
    const responseFacebook = (response) => {
        // Facebook login API repsonse
        // Check for registered user
        // Add user if not a registered user

        if(response.id) {

            let callingProcessID = 1; // 1 = API Users, 2 = Registered Users                 
                                          
            const foundUser = userService.checkForUser(response.id, callingProcessID);
           
            // Add user to users database if not found
            if(!foundUser) {            
                
                let name = response.name;

                let endOfFirst = name.indexOf(' ');
    
                const first_name = name.substring(0, endOfFirst);
    
                const last_name = name.substring(endOfFirst, name.length);

                const newUser = {
                
                    id: response.id,
                    firstName: first_name,
                    lastName: last_name,
                    email: response.email,
                    picture: response.picture.data.url
    
                };

                userService.addUser(newUser, callingProcessID);   
                   

            }
            
            userService.logInUser(response.email);

            props.checkLogin(true);
            props.processId(1);
                            

        }
    }
     
    const responseGoogle = (response) => {
        // Google login API repsonse
        // Check for registered user
        // Add user if not a registered user

        if(response.clientId){    
            
            let callingProcessID = 1; // 1 = API Users, 2 = Registered Users 
       
            let userObj = jwt(response.credential); // Decode the JWT response token

            const foundUser = userService.checkForUser(userObj.sub);
          
            // Add user to users database if not found
            if(!foundUser){
                // Add user tp oauth users database

                const newUser = {
                            
                    id: userObj.sub,
                    firstName: userObj.given_name,
                    lastName: userObj.family_name,
                    email: userObj.email,
                    picture: userObj.picture
                    
                };

                userService.addUser(newUser, callingProcessID);
              

            }

            userService.logInUser(userObj.email);
            
            props.checkLogin(true);
            props.processId(2);
         
        }
             
    } 
      
    const onSubmit = () => {      
        // Checks the form for valid input data
        // Logs the user in to the website
                          
        if(!onEmailError && !onPasswordError){

            checkLogin();

        }

    }

    const loginFailure = (response) => {

        setErrorMessage(response.error);

    }

    
    const rememberMe = () => {
        // Remember the user's email for future logins
        console.log("Remember Me!");
    }

    const showHidePassword = () => {
        // Shows or hides the contents of the password input field

        let password = document.querySelector('#password');

        if(password.type === "password"){
            password.type = "text";
        }else{
            password.type = "password";
        }

    }
          
    /*** START OF FUNCTIONS ***/   

    function checkEmail() {
    // Checks the email address for valid input/format

        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/     
            
        const goodEmail = pattern.exec(emailInput);

        if(!goodEmail){
            setOnEmailError(true);
        }
            
    }  
  
    function checkLogin() {
        // Checks the users email and password for valid input              
            
        const error = "Error: Email or password is incorrect.";

        let currentUser = userService.verifyUser(emailInput);

        if(currentUser){          
         
            const salt = bcrypt.genSaltSync(10);

            const password = bcrypt.hashSync(passwordInput, salt);

            const goodUser = userService.verifyPassword(password, currentUser);

            if(goodUser){
                            
                userService.logInUser(currentUser);

                props.checkLogin(true);
                props.processId(3);

            }else{

                setErrorMessage(error)

            }

        }else{

            setErrorMessage(error);
        }
        
    }       
    
    function checkPassword() {
        const password = passwordInput;

        if(!password) {
            setOnPasswordError(true);
        }

        if(!onEmailError && !onPasswordError) {

            setEnableSubmitButton(true);

        }else {

            setEnableSubmitButton(false);

        }

    }
        
    function handleEmailChange() {
        // Changes the style of the input field after an error
        // Clears error message
        
        if(onEmailError) {
            setOnEmailError(false);
            setErrorMessage('');
        }

    }

    function handlePasswordChange() {
        // Changes the style of the input field after an error
        // Clears error message

        if(onPasswordError){
            setOnPasswordError(false);
            setErrorMessage('');
        }

    }
        
    function sendResetPasswordRequest() {
        // In real world deployment, a popup window would be displayed to user asking if they want a reset password email to be sent to their registered email address
        window.alert("This where a message to the user is displayed asking if they want to send a reset password email.");
    }

    function showSignUpForm() {
        props.showSignUpForm(true);
    }

    return (
    
        <GoogleOAuthProvider clientId={props.clientId}>            

            <div className='user-login-container'>
                           
                <form className="login-form" onSubmit={handleSubmit(onSubmit)}>

                    <h2>Login</h2>

                    <div className='input-container'>
                                        
                        <Form.Field>
                            
                            <input
                                onBlur={checkEmail}                                                            
                                type="email" 
                                className='input-control input-email' 
                                placeholder="Email"
                                id="email"
                                value={emailInput}
                                onInput={e => setEmailInput(e.target.value)}
                                onChange={handleEmailChange}
                                style={ { color: onEmailError ? 'red' : 'black' } }                               
                            />

                        </Form.Field>    

                        {onEmailError && 
                        
                            <Message                                                           
                                content="Email address entered is not a valid email format."
                            />

                        }
                                                                                          
                        <div className='remember-me-container'>

                           <input 
                                type="checkBox" 
                                className="input-control input-remember" 
                                name="remember" 
                                id="remember" 
                                onClick={rememberMe}                                
                            /> 
                            
                            <label className='label-remember'>{rememberMeText}</label>    

                        </div>                       

                        <div className='password-container'>
                            
                           <Form.Field>
                                
                                <input     
                                    onBlur={checkPassword}                
                                    type="password" 
                                    className="input-control input-password"                                                                                                      
                                    placeholder="Password"                                 
                                    id="password"
                                    value={passwordInput}
                                    onInput={e => setPasswordInput(e.target.value)}
                                    onChange={handlePasswordChange}
                                    style={ { color: onPasswordError ? 'red' : 'black' } }
                                />         

                            </Form.Field>                          

                            <span className='show-hide-password' onClick={showHidePassword}></span>                          

                        </div>

                        {onPasswordError &&  
                                
                                <Message
                                    error                                    
                                    content='Passwords cannot be blank.'
                                /> 

                            }

                        <div className='forgot-password-container' onClick={sendResetPasswordRequest}>{forgotPassword}</div>
                                         
                    </div>
                    
                    { errorMessage && <div className="error-message-container">{errorMessage}</div> }
                    
                    <div className="button-container">
                      
                      <button className='btn btn-submit' type="submit" style={ { backgroundColor: enableSubmitButton ? "DodgerBlue": "DarkGray" } } disabled={!enableSubmitButton}>{submitText}</button>
                       
                    </div> 

                    <div className='new-user-container'>                    
                        <p>Not registered? <span className="sign-up" onClick={showSignUpForm}>Sign Up Here</span></p>
                    </div>
                  
                </form>

            
                <div className='user-auth-container'>                                                                          
                                        
                    
                    <GoogleLogin                       
                        clientId={props.clientId}                       
                        onSuccess={credentialResponse => {                                                
                            responseGoogle(credentialResponse);
                        }}  
                        onError={response => {
                            loginFailure(response);
                        }}
                        width="222px"
                        

                    />

                    <div className='facebook-container'>                                          

                        <img src={FacebookIcon} alt="Facebook Icon" className='facebook-icon'></img>
                                                
                        <FacebookLogin                                                    
                            appId={props.appId}
                            autoLoad={false}
                            fields="name,email,picture"                       
                            callback={responseFacebook}   
                            cssClass="my-facebook-button-class"                            
                        />  

                    </div>

                </div>              

            </div>

        </GoogleOAuthProvider>

    )
}

export default Login

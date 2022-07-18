import React, {useState} from 'react'

import { Form, Message } from 'semantic-ui-react';

import { useForm } from "react-hook-form";

import { userService } from '../Services/UserService';

import bcrypt from 'bcryptjs';

const Register = (props) => {

  const { handleSubmit, formState: { formErrors } } = useForm();
  
  const [enableSubmitButton, setEnableSubmitButton] = useState(false);
   
  const submitText = "Sign Up";

  const cancelText = "Cancel";

  const [firstNameInput, setFirstNameInput] = useState('');

  const [onFirstNameError, setOnFirstNameError] = useState(false);
   
  const [lastNameInput, setLastNameInput] = useState('');

  const [onLastNameError, setOnLastNameError] = useState(false);

  const [onEmailError, setOnEmailError] = useState(false);

  const [emailInput, setEmailInput] = useState('');

  const [passwordInput, setPasswordInput] = useState('');

  const [onPasswordError, setOnPasswordError] = useState(false);

  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');

  const [onConfirmPasswordError, setOnConfirmPasswordError] = useState(false);  

  const [errorMessage, setErrorMessage] = useState('');

  const callingProcessID = 2;
  
  const onSubmit = () => {      
    // Checks the form for valid input data
    // Logs the user in to the website
    
    async function checkUser() {
      
      const boolExistingUser = await userService.verifyUser(emailInput);     

      if(!boolExistingUser) {
        addUserToDatabase();  
      }else {
        setErrorMessage('Email already exists.');
      }

    };
      
    checkUser();

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

  function checkEmail() {
    // Checks the email address for valid input/format

    const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/     
        
    const goodEmail = pattern.exec(emailInput);

    if(!goodEmail){
        setOnEmailError(true);
    }

  }  

  function checkFirstName() {

    if(!firstNameInput){
      setOnFirstNameError(true);
    }

  }

  function checkLastName() {

    if(!lastNameInput){
      setOnLastNameError(true);
    }

  }
  
  function checkPassword() {
    // Checks the passwword for valid format
    // Enables the continue button if both email and password fields are valid

    const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/;
    
    const goodPassword = pattern.exec(passwordInput);

    if(!goodPassword){

        setOnPasswordError(true);

    }

  }

  function checkConfirmPassword() {
    // Checks the passwword for valid format
    // Enables the continue button if both email and password fields are valid

    const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/;
    
    const goodPassword = pattern.exec(confirmPasswordInput);

    if(!goodPassword){

        setOnConfirmPasswordError(true);

    }else{

        if(passwordInput !== confirmPasswordInput){
          setOnConfirmPasswordError(true);
        }

        if(!onEmailError && !onPasswordError && !onConfirmPasswordError){

            setEnableSubmitButton(true);

        }else{
            
            setEnableSubmitButton(false);

        }
    }

  }

  function closeForm() {

    props.func(false);

  }

  function addUserToDatabase() {
          
    const salt = bcrypt.genSaltSync(10);

    const password = bcrypt.hashSync(passwordInput, salt);

    const nextId = userService.getUsersLength(callingProcessID) + 1;

    const newUser = {
                      
      id: nextId,
      firstName: firstNameInput,
      lastName: lastNameInput,
      email: emailInput,        
      password: password,

    };
     
    const result = userService.addUser(newUser, callingProcessID);

    if(result) {
      closeForm(); 
    }
    
  }

  function handleFirstNameChange() {
    
    if(onFirstNameError) {
      setOnFirstNameError(false);
      setErrorMessage('');
    }

  }

  function handleLastNameChange() {

    if(onLastNameError) {
      setOnLastNameError(false);
      setErrorMessage('');
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
        setOnConfirmPasswordError(false);
        setErrorMessage('');
    }
    
  }
  
  function handleConfirmPasswordChange() {
    // Changes the style of the input field after an error
    // Clears error message

    if(onConfirmPasswordError){      
      setOnConfirmPasswordError(false);
      setOnPasswordError(false);
      setErrorMessage('');
    }
  
  }

  return (  

    <div className='user-signup-container'>
                      
      <form className="sign-up-form" onSubmit={handleSubmit(onSubmit)}>

        <h2>Sign Up</h2>

        <div className='input-container'>

          <Form.Field>
              
              <input
                  onBlur={checkFirstName}                                                            
                  type="text" 
                  className='input-control input-first-name' 
                  placeholder="First Name"
                  id="firstName"
                  value={firstNameInput}
                  onInput={e => setFirstNameInput(e.target.value)}         
                  onChange={handleFirstNameChange}             
                  style={ { color: onEmailError ? 'red' : 'black' } }                                                     
              />

          </Form.Field>    

          {onFirstNameError && 
          
              <Message                                                           
                  content="First name cannot be blank."
              />

          }

          <Form.Field>
              
              <input
                  onBlur={checkLastName}                                                            
                  type="text" 
                  className='input-control input-last-name' 
                  placeholder="Last Name"
                  id="lastName"
                  value={lastNameInput}
                  onInput={e => setLastNameInput(e.target.value)}
                  onChange={handleLastNameChange}
                  style={ { color: onEmailError ? 'red' : 'black' } }                                                     
              />

          </Form.Field>    

          {onLastNameError && 
          
              <Message                                                           
                  content="Last name cannot be blank."
              />

          }
                          
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

          {onEmailError && 
          
            <Message                                                           
                content="Passwords must be 6 - 15 characters in length and contain at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character."
            />

          }              
              
          <div className='password-container'>
              
              <Form.Field>
                    
                    <input     
                        onBlur={checkConfirmPassword}                
                        type="password" 
                        className="input-control input-password"                                                                                                      
                        placeholder="Confirm Password"                                 
                        id="confirmPassword"
                        value={confirmPasswordInput}
                        onInput={e => setConfirmPasswordInput(e.target.value)}
                        onChange={handleConfirmPasswordChange}
                        style={ { color: onConfirmPasswordError ? 'red' : 'black' } }
                    />         
  
                </Form.Field>                          
  
                <span className='show-hide-password' onClick={showHidePassword}></span>                          
  
            </div>

            {onConfirmPasswordError && 
          
              <Message                                                           
                  content="Passwords do not match."
              />

            }              

        </div>         
               
        <div className="sign-up-button-container">
          
          <button className='btn btn-signup' type="submit" style={ { backgroundColor: enableSubmitButton ? "MediumBlue": "DarkGray" } }>{submitText}</button>
          
          <button className='btn btn-cancel' type="button" onClick={closeForm}>{cancelText}</button>

        </div>

         { errorMessage && <div className="error-message-container">{errorMessage}</div> } 
        
      </form>

    </div>
    
  )
}

export default Register;
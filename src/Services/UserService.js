// import axios from "axios";

import bcrypt from 'bcryptjs';

const jsonServeroauthUsers = "http://localhost:5000/users";

const jsonServerRegisteredUsers = "http://localhost:4200/users";

let oauthUsers = []; // Users who logging in using oauth

let registeredUsers = []; // Users logging in using an email and password*/

async function loadArrays() {

    oauthUsers = await getAllUsers(jsonServeroauthUsers);

    registeredUsers = await getAllUsers(jsonServerRegisteredUsers);

};

loadArrays();

export const userService = {

    addUser,
    checkForUser,    
    getAllUsers,        
    getUserDetails,
    logInUser,
    logoutUser,
    verifyUser,
    verifyPassword

}

 async function addUser(user, callingProcessID) {
    // Adds the user to the registered users database
    // callinProcessID: 1 = Oauth Users (Facebook, Google), 2 = registeredUsers (Email, Password)

    let jsonServer = "";

    let result = false;
   
    switch(callingProcessID){

        case 1:
            jsonServer = jsonServeroauthUsers;
            break;

        case 2: 
            jsonServer = jsonServerRegisteredUsers;
            break;

    }

    await fetch(jsonServer, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success', data);
        result = true;
    }).catch((error) => {
        console.log('Error: ', error);
    });

    return result;
     
}

function checkForUser(userId) {
    // Checks to see if the user exists in the user database  
    // callinProcessID: 1 = API Users, 2 = registeredUsers        
    
    loadArrays();

    if(oauthUsers) {
           
       if(oauthUsers.find(x => parseInt(x.id) === parseInt(userId))){
          
            return true;

       }else{
            
            return false;

       }                      

    }else {
       
        return false;

    }
       
}

async function getAllUsers(jsonServer) {       
    // Loads the user database into an array      
        
    let allUsers = [];

    await fetch(jsonServer, {
            method: 'GET',
            headers: {
                'Content-Type':'application/json'
            }
        })
        .then(response => {
            allUsers = response.json()
        })
        .catch(error => console.log(error));      
  
        // console.log(allUsers);

    return allUsers;
        
}

function getUserDetails(email) {
    // Gets the users details from the database
  
    const user = registeredUsers.find(user => user.email === email);

    return user;

}

function logInUser(user){
    // Adds the user to localStorage

    const loggedIn = true;

    const userItems = [user.email, loggedIn];

    localStorage.setItem('currentUser', JSON.stringify(userItems));

}

function logoutUser() {

    // Removess the user from localStorage

    localStorage.removeItem('currentUser'); // Remove currentUser from localStorage

    // localStorage.clear(); // Optional: Clear all localStorage

}


function verifyUser(email) {
    // Checks for the user in the users database based on the users email address   

    loadArrays();
      
    return registeredUsers.find(user => user.email === email);
   
}

function verifyPassword(password, user) {    
    // Checks the users password for match with password in database  
             
    const checkPassword = bcrypt.compare(password, user.password);

    return checkPassword? true: false;

}

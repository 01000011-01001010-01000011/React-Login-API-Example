import React from 'react'

import { googleLogout } from '@react-oauth/google';

import { userService } from '../Services/UserService';

const Logout = (props) => {         

    const logout = () => {

       // console.log(props.processId);

        if(props.processId === 1) {
            window.FB.logout();                   
        }

        if(props.processId === 2) {
            googleLogout();
            props.func(false);                       
        }

        props.func(false);   
        props.checkProcessId(0); 
        userService.logoutUser();

    }


    return (
        <div className='logout-container'>
                          
            <button className="btn btn-logout" onClick={logout}>Logout</button>                    

        </div>
    )
}

export default Logout
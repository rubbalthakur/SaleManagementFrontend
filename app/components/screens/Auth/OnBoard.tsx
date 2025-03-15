'use client'
import { useState } from "react";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";

export function OnBoard() {
    const[showSignInPage,setShowSignInPage]=useState(true);
    const[showSignUpPage,setShowSignUpPage]=useState(false);

    return(
       <div>
        {showSignInPage && 
        <SignIn onSignUpClick={()=>{setShowSignInPage(false);setShowSignUpPage(true)}}/>}

        {showSignUpPage && <SignUp onSignInClick={()=>{setShowSignInPage(true);setShowSignUpPage(false)}}/>}

    </div>
    )
}
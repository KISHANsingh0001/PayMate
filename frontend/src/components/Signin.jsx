/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { Loader } from "./Loader"
import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useSetUserState,userState } from "../atoms";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { tokenState } from "../atoms";
import { BACKEND_URL } from "../config";

export function Signin(){
    const [loading, setLoading] = useState(false);
    return <div className={`flex min-h-screen bg-zinc-500 justify-center items-center p-4 ${loading ? 'loader-overlay' : ''}`}>
        {loading && (<Loader/>)}
        <MainSigninWindow setLoading = {setLoading}/>
    </div>
}

function MainSigninWindow({setLoading}){
    const user = useRecoilValue(userState);
    const navigate = useNavigate();
    const setUserState = useSetUserState();
    const setTokenState = useSetRecoilState(tokenState);
    async function Login(){
        setLoading(true); // Set loading to true when request starts
            try {
                const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {username : user.email,password : user.password});
                if (response.status === 200){
                    setUserState('firstName',response.data.user.firstName);
                    setUserState('lastName',response.data.user.lastName);
                    setUserState('email',response.data.user.username);
                    setUserState('password',response.data.user.password);
                    setUserState('_id', response.data.user._id);
                    setTokenState(response.data.token);
                    navigate('/dashboard');
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error('Error:', error.message);
            } finally {
                setLoading(false);
            }
    }
    return <div className="flex flex-col bg-white w-full max-w-md rounded-md pb-6 h-fit mx-4">
        <Header/>
        <Inputs type = "text" title = "Email" placeholder = "johndoe@example.com" onChange={(e) => setUserState('email', e.target.value)}/>
        <Inputs type = "password" title= "Password" placeholder = "" onChange={(e) => setUserState('password', e.target.value)}/>
        <SigninButton Login = {Login}/>
        <SignupButton navigate = {navigate}/>
    </div>
}

function Header(){
    return <>
        <div className="flex flex-col w-full h-auto mt-6 text-center text-2xl md:text-3xl font-bold">Sign In</div>
        <div className = "flex flex-col text-center text-base md:text-lg px-4 md:px-8 text-gray-500 mt-2 mb-2 font-normal">Enter your credentials to access your account</div>
    </>
}

function Inputs({title,placeholder, type, onChange}){
    return <div className = "flex flex-col mt-3 px-4 md:px-8">
        <div className="flex font-bold">{title}</div>
        <input type = {type} placeholder = {placeholder} onChange = {onChange} className = "flex mt-3 h-10 w-full px-4 rounded-md border-2 border-gray-100"></input>
    </div>
}

function SigninButton({Login}){
    return <div className = "flex flex-col h-fit px-4 md:px-8">
        <button className="flex justify-center items-center px-8 mt-3 text-white bg-black h-10 rounded-md font-semibold" onClick={Login}>
            Sign in
        </button>
    </div>
}

function SignupButton({navigate}){
    return <div className = "flex justify-center md:px-16 space-x-2 mt-3 font-medium">
        <div>Don't have an account?</div>
        <button className = "underline" onClick={()=>{
            navigate('/signup');
        }}>Signup</button>
    </div>
}
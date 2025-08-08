/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useSetUserState, userState } from '../atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader } from './Loader';
import { tokenState } from "../atoms";
import { BACKEND_URL } from '../config';

export function Signup() {
    const [loading, setLoading] = useState(false); // Initialize loading state

    return (
        <div className={`flex h-screen bg-zinc-500 justify-center ${loading ? 'loader-overlay' : ''}`}>
            {loading && (
                <Loader/>
            )}
            <MainSignupWindow setLoading={setLoading} />
        </div>
    );
}

function MainSignupWindow({setLoading }) {
    const setUserState = useSetUserState();
    const user = useRecoilValue(userState);
    const setTokenState = useSetRecoilState(tokenState);
    const navigate = useNavigate();

async function CreateUser() {
    setLoading(true);
    try {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
            username: user.email,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName
        });
        if (response.status === 200) {
            setUserState({
                firstName: response.data.user.firstName,
                lastName: response.data.user.lastName,
                email: response.data.user.username,
                password: response.data.user.password,
                _id: response.data.user._id // <-- Set _id here
            });
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

    return (
        <div className="flex flex-col bg-white my-12 w-1/4 rounded-md">
            <Header />
            <Inputs type="text" title="First Name" placeholder="John" onChange={(e) => setUserState('firstName', e.target.value)} />
            <Inputs type="text" title="Last Name" placeholder="Doe" onChange={(e) => setUserState('lastName', e.target.value)} />
            <Inputs type="text" title="Email" placeholder="johndoe@example.com" onChange={(e) => setUserState('email', e.target.value)} />
            <Inputs type="password" title="Password" placeholder="" onChange={(e) => setUserState('password', e.target.value)} />
            <SignupButton CreateUser={CreateUser} />
            <LoginButton navigate = {navigate} />
        </div>
    );
}

function Header() {
    return (
        <>
            <div className="flex flex-col w-full h-10 mt-6 text-center text-3xl font-bold">Sign Up</div>
            <div className="flex flex-col text-center text-lg px-8 text-gray-500 mt-2 mb-2 font-normal">Enter your information to create an account</div>
        </>
    );
}

function LoginButton({navigate}) {
    return (
        <div className="flex px-16 space-x-2 mt-3 font-medium">
            <div>Already have an account?</div>
            <button className="underline" onClick={()=>{
                navigate('/signin');
            }}>Login</button>
        </div>
    );
}

function Inputs({ title, placeholder, type , onChange}) {
    return (
        <div className="flex flex-col mt-3 px-8">
            <div className="flex font-bold">{title}</div>
            <input type={type} placeholder={placeholder} onChange = {onChange} className="flex mt-3 h-10 w-full px-4 rounded-md border-2 border-gray-100"></input>
        </div>
    );
}

function SignupButton({ CreateUser }) {
    return (
        <div className="flex flex-col h-fit px-8">
            <button className="flex justify-center items-center px-8 mt-3 text-white bg-black h-10 rounded-md font-semibold" onClick={CreateUser}>
                Sign up
            </button>
        </div>
    );
}

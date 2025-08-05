/* eslint-disable react/prop-types */
import {toAccountState, tokenState } from "../atoms";
import { useRecoilValue } from "recoil";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

export function SendMoney(){
    return <div className="flex flex-col h-screen bg-zinc-200 items-center justify-center">
        <MainWindow></MainWindow>
    </div>
}

function MainWindow(){
    const [amount,setAmount] = useState('');
    return <div className="flex flex-col h-fit pt-10 pb-10 rounded-md bg-white w-1/4">
        <Header/>
        <UserDetail/>
        <SubHeading/>
        <Input setAmount = {setAmount}/>
        <TransferButton amount={amount}/>
    </div>
}

function Header(){
    return <div className="flex text-3xl font-bold justify-center">Send Money</div>
}

function UserDetail(){
    return <div className="flex mt-16 px-8">
        <div className="flex rounded-full bg-green-500 items-center justify-center self-center h-12 w-12 text-center text-white">M</div>
        <div className="font-bold text-xl px-4 self-center">Name</div>
    </div>
}

function SubHeading(){
    return <div className="flex px-8 mt-1 font-semibold">Amount {'('}in Rs{')'}</div>
}

function Input({setAmount}){
    return <input type = "text" placeholder = "Enter amount" onChange = {(e)=>{setAmount(e.target.value)}} className = " h-10 mx-8 mt-2 px-2 border-2 border-slate-300 rounded-md placeholder:text-slate-500" />
}

function TransferButton({amount}){
        const toAccountId = useRecoilValue(toAccountState);
        console.log(toAccountId);
        const token = useRecoilValue(tokenState);
        const navigate = useNavigate();
        const FundTransfer = async()=>{
                try  {
                    await axios.post(
                        'http://localhost:3000/api/v1/account/transfer',
                        // Separate headers and data as two separate arguments
                        { amount: amount, to: toAccountId },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`, // Include the token in the request headers
                            },
                        }
                    );
                }
                catch(error){
                    console.log(error);
                }
                navigate('/dashboard');
        };
        return <button className="flex bg-green-500 mx-8 rounded-md mt-3 text-white h-10 justify-center items-center" onClick={FundTransfer}>Initiate Transfer</button>
}
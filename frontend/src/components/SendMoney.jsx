/* eslint-disable react/prop-types */
import {toAccountState, tokenState } from "../atoms";
import { useRecoilValue } from "recoil";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../config";

export function SendMoney(){
    return <div className="flex flex-col min-h-screen bg-gray-900 items-center justify-center p-4">
        <MainWindow></MainWindow>
    </div>
}

function MainWindow(){
    const [amount,setAmount] = useState('');
    const [recipient, setRecipient] = useState(null);
    const [isTransferring, setIsTransferring] = useState(false);
    const toAccountId = useRecoilValue(toAccountState);
    const token = useRecoilValue(tokenState);

    // Fetch recipient details
    useEffect(() => {
        const fetchRecipient = async () => {
            if (!toAccountId || !token) return;
            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/user/bulk`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { filter: "" }
                });
                const user = response.data.user.find(u => u._id === toAccountId);
                setRecipient(user);
            } catch (error) {
                console.error("Error fetching recipient:", error);
            }
        };
        fetchRecipient();
    }, [toAccountId, token]);

    return <div className="flex flex-col w-full max-w-md bg-gray-800 rounded-xl shadow-2xl border border-gray-700 pt-10 pb-10 px-8">
        <Header/>
        <UserDetail recipient={recipient}/>
        <SubHeading/>
        <Input setAmount = {setAmount}/>
        <TransferButton amount={amount} isTransferring={isTransferring} setIsTransferring={setIsTransferring}/>
        <BackButton/>
    </div>
}

function Header(){
    return <div className="flex text-3xl font-bold justify-center text-white mb-2">Send Money</div>
}

function UserDetail({recipient}){
    const displayName = recipient 
        ? `${recipient.firstName || ''} ${recipient.lastName || ''}`.trim() 
        : 'Loading...';
    
    const initial = recipient 
        ? (recipient.firstName?.[0] || recipient.lastName?.[0] || 'U').toUpperCase()
        : 'U';

    return <div className="flex mt-12 items-center bg-gray-700/50 rounded-lg p-4 border border-gray-600">
        <div className="flex rounded-full bg-green-500 items-center justify-center h-12 w-12 text-white font-semibold shadow-lg">
            {initial}
        </div>
        <div className="ml-4">
            <div className="font-bold text-xl text-white">{displayName}</div>
            <div className="text-sm text-gray-400">Recipient</div>
        </div>
    </div>
}

function SubHeading(){
    return <div className="flex mt-6 font-semibold text-gray-300">Amount (in Rs)</div>
}

function Input({setAmount}){
    return <input 
        type = "text" 
        placeholder = "Enter amount" 
        onChange = {(e)=>{setAmount(e.target.value)}} 
        className = "h-12 mt-2 px-4 bg-gray-700 border-2 border-gray-600 rounded-lg placeholder:text-gray-400 text-white focus:border-green-500 focus:outline-none transition-colors" 
    />
}

function TransferButton({amount, isTransferring, setIsTransferring}){
    const toAccountId = useRecoilValue(toAccountState);
    console.log(toAccountId);
    const token = useRecoilValue(tokenState);
    const navigate = useNavigate();
    
    const FundTransfer = async()=>{
        setIsTransferring(true);
        try  {
            await axios.post(
                `${BACKEND_URL}/api/v1/account/transfer`,
                { amount: amount, to: toAccountId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        }
        catch(error){
            console.log(error);
        }
        finally {
            setIsTransferring(false);
        }
        navigate('/dashboard');
    };
    
    return <button 
        className={`flex rounded-lg mt-6 text-white font-semibold h-12 justify-center items-center shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/50 ${
            isTransferring 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 active:bg-green-700 shadow-green-900/30'
        }`}
        onClick={FundTransfer}
        disabled={isTransferring}
    >
        {isTransferring ? (
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
            </div>
        ) : (
            'Initiate Transfer'
        )}
    </button>
}

function BackButton(){
    const navigate = useNavigate();
    return <button 
        className="flex border-2 border-gray-600 hover:bg-gray-700 rounded-lg mt-3 text-gray-300 font-medium h-10 justify-center items-center transition-colors" 
        onClick={() => navigate('/dashboard')}
    >
        Back to Dashboard
    </button>
}
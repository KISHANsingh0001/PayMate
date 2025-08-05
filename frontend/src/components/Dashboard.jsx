/* eslint-disable react/prop-types */
import { userState } from "../atoms"
import { useRecoilValue, useSetRecoilState } from "recoil";
import { balanceState } from "../atoms";
import { tokenState } from "../atoms";
import { GetBalance } from "../UtiityFunction";
import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toAccountState } from "../atoms";

export function Dashboard(){
        const currentUser = useRecoilValue(userState);
        const [filter,setFilter] = useState("");
        const [users,setUsers] = useState([]);
        const [transactions , setTransactions] = useState([]);
        const setBalanceState = useSetRecoilState(balanceState);
        const token = useRecoilValue(tokenState);
        console.log("Current user ID:", currentUser._id);
        useEffect(() => {
            const fetchBalance = async()=>{
            try{
                const balance = await GetBalance({ token });
                setBalanceState(prevBalanceState => ({
                    ...prevBalanceState, // Spread previous state
                    balance: balance // Update balance property
                }));
            } 
            catch(error){
                console.error("Error fetching balance:", error);
            }
            };
            fetchBalance();
        }, [token, setBalanceState]);

        useEffect(() => {
            const fetchTransactions = async () => {
                try {
                    console.log("Token being sent:", token);
                const response = await axios.get('http://localhost:3000/api/v1/account/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                 setTransactions(response.data.transaction || []);
                console.log(response.data.transaction);
                } catch (error) {
                console.error("Error fetching transactions:", error);
                }
            };
            fetchTransactions();
            }, [token]);

       useEffect(() => {
    const getUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/v1/user/bulk', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    filter: filter,
                }
            });
            // Only exclude the current user by _id
            setUsers(response.data.user.filter(user => user._id !== currentUser._id));
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };
    getUsers();
}, [filter, token, currentUser]);

        const balanceValue = useRecoilValue(balanceState);
        return <div className="flex flex-col px-16">
            <Header user = {currentUser}/>
            {balanceValue && <Balance balance={balanceValue.balance} />}
            <Users setFilter = {setFilter}/>
            {users.map((user,index) => {
                return <UserCard key = {index} toAccountId={user._id} Name={user.firstName} />;
            })}
            <TransactionHistory transactions={transactions} currentUser={currentUser} />
        </div>
}

function Header({user}){
    console.log("Header user:", user); 
    return <div className="flex flex-col h-fit justify-between mt-20">
        <div className="border-2 h-0 border-slate-100"></div>
        <div className="flex justify-between">
            <div className=" font-bold text-2xl px-4 mt-4 mb-4">Payments App</div>
            <div className="flex">
                <div className="font-semibold text-lg px-4 self-center">Hello, {user.firstName}</div>
                <div className="flex rounded-full bg-slate-100 items-center justify-center self-center h-9 w-9 text-center">{user.firstName[0]}</div>
            </div>
        </div>
        <div className="border-2 h-0 border-slate-100"></div>
    </div>
}

function Balance({ balance }) {
    return (
        <div className="flex h-fit px-4 mt-5 mb-5 font-bold text-xl space-x-4">
            <div>Your Balance</div>
            <div>${balance}</div>
        </div>
    );
}


function Users({setFilter}){
        return <div className="flex flex-col px-4 h-fit mb-4">
                <div className="flex text-xl font-bold mb-4">Users</div>
                <input type="text" placeholder="Search users..." className="flex font-medium h-fit py-2 px-2 rounded-md border-2 border-slate-200 placeholder-slate-400" onChange={(e)=>{
                    setFilter(e.target.value);
                }}/>
        </div>
} 

function UserCard({Name,toAccountId}){
    const setToAccountId = useSetRecoilState(toAccountState);
    const navigate = useNavigate();
    return <div className="flex justify-between px-4 mt-4">
            <div className="flex space-x-2">
                <div className="flex rounded-full bg-slate-100 items-center justify-center self-center h-9 w-9 text-center">{Name[0]}</div>
                <div className="font-semibold text-lg px-4 self-center">{Name}</div>
            </div>
            <button className="flex bg-black w-fit text-white px-4 py-2 rounded-md text-light" onClick={()=>{
                setToAccountId(toAccountId);
                navigate('/send');
            }}>Send Money</button>
    </div>
}

function TransactionHistory({ transactions = [], currentUser }) {
    
  return (
    <div className="mt-8">
      <div className="text-xl font-bold mb-2">Transaction History</div>
      <div className="bg-white rounded shadow p-4">
        {(!transactions || transactions.length === 0) ? (
          <div>No transactions found.</div>
        ) : (
          <ul>
            {transactions.map(tx => {
              // Handles both populated and unpopulated 'from' and 'to'
              const fromId = tx.from._id || tx.from;
              const toId = tx.to._id || tx.to;
              const isSent = String(fromId) === String(currentUser._id);

              // Get names if available, else show ID
              const fromName = tx.from.firstName
                ? `${tx.from.firstName}`
                : fromId;
              const toName = tx.to.firstName
                ? `${tx.to.firstName}`
                : toId;
         console.log("tx.from:", fromId, "currentUser._id:", currentUser._id, "isSent:", isSent);
              return (
                <li key={tx._id} className="border-b py-2">
                  {isSent
                    ? `You sent Rs.${tx.amount} to ${toName} on ${new Date(tx.timestamp).toLocaleString()}`
                    : `You received Rs.${tx.amount} from ${fromName} on ${new Date(tx.timestamp).toLocaleString()}`}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
/* eslint-disable react/prop-types */
import { userState } from "../atoms"
import { useRecoilValue, useSetRecoilState } from "recoil";
import { balanceState, tokenState, toAccountState } from "../atoms";
import { GetBalance } from "../UtiityFunction";
import { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BACKEND_URL } from "../config";

export function Dashboard() {
  const currentUser = useRecoilValue(userState);
  const [filter, setFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("users"); // Track active tab
  const setBalanceState = useSetRecoilState(balanceState);
  const token = useRecoilValue(tokenState);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balance = await GetBalance({ token });
        setBalanceState(prevBalanceState => ({
          ...prevBalanceState,
          balance: balance
        }));
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    fetchBalance();
  }, [token, setBalanceState]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/account/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(response.data.transaction || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, [token]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/bulk`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            filter: filter,
          }
        });
        setUsers(response.data.user.filter(user => user._id !== currentUser._id));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getUsers();
  }, [filter, token, currentUser]);

  const balanceValue = useRecoilValue(balanceState);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header user={currentUser} />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          {/* Balance Card */}
          <div className="bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700 transform transition hover:shadow-lg md:col-span-1">
            <h2 className="text-sm font-medium text-gray-400 uppercase">Available Balance</h2>
            <div className="mt-2 flex items-baseline">
              <span className="text-4xl font-extrabold text-white truncate">₹{balanceValue?.balance || 0}</span>
            </div>
          </div>

          {/* Recent Activity Preview */}
          <div className="bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700 md:col-span-2 transform transition hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-white">Recent Activity</h2>
              <button 
                className="text-sm text-indigo-400 hover:text-indigo-300"
                onClick={() => setActiveTab("transactions")}
              >
                View all
              </button>
            </div>
            <div className="space-y-3">
              {transactions.slice(0, 3).map(tx => {
                const fromId = tx.from._id || tx.from;
                const isSent = String(fromId) === String(currentUser._id);
                const toName = tx.to.firstName ? `${tx.to.firstName}` : (tx.to._id || tx.to);
                const fromName = tx.from.firstName ? `${tx.from.firstName}` : (tx.from._id || tx.from);
                
                return (
                  <div key={tx._id} className="flex items-center px-2 py-2 rounded-lg hover:bg-gray-700">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${isSent ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                      {isSent ? 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        : 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      }
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-200">
                        {isSent ? `Sent to ${toName}` : `Received from ${fromName}`}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`text-sm font-medium ${isSent ? 'text-red-400' : 'text-green-400'}`}>
                      {isSent ? `-₹${tx.amount}` : `+₹${tx.amount}`}
                    </div>
                  </div>
                );
              })}
              {transactions.length === 0 && (
                <p className="text-sm text-gray-400 py-2">No recent transactions</p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("users")}
              className={`${activeTab === "users" ? 
                'border-indigo-400 text-indigo-300' : 
                'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'} 
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Send Money
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`${activeTab === "transactions" ? 
                'border-indigo-400 text-indigo-300' : 
                'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'} 
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Transaction History
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "users" ? (
          <div>
            <div className="mb-6">
              <SearchUsers setFilter={setFilter} />
            </div>
            <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-700">
                {users.map((user, index) => (
                  <UserCard key={index} toAccountId={user._id} Name={user.firstName} lastName={user.lastName} />
                ))}
                {users.length === 0 && (
                  <li className="px-6 py-4 text-center text-gray-400">No users found</li>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <TransactionHistory transactions={transactions} currentUser={currentUser} />
        )}
      </div>
    </div>
  );
}

function Header({ user }) {
  return (
    <header className="bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-indigo-400">PayMate</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-300">Hello, {user.firstName || 'User'}</span>
            <div className="h-8 w-8 rounded-full bg-indigo-800 flex items-center justify-center text-indigo-200 font-medium">
              {user.firstName?.[0] || 'U'}
            </div>
            <Link className="text-gray-400 hover:text-gray-200"  to='/signin'>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function SearchUsers({ setFilter }) {
  return (
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </div>
      <input
        type="text"
        className="bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 py-3 text-gray-200 border-gray-600 rounded-md"
        placeholder="Search users by name..."
        onChange={(e) => setFilter(e.target.value)}
      />
    </div>
  );
}

function UserCard({ Name, lastName, toAccountId }) {
  const setToAccountId = useSetRecoilState(toAccountState);
  const navigate = useNavigate();

  return (
    <li>
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-800 flex items-center justify-center text-indigo-200 font-medium">
            {Name?.[0] || '?'}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-200">{Name} {lastName || ''}</div>
          </div>
        </div>
        <button 
          onClick={() => {
            setToAccountId(toAccountId);
            navigate('/send');
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-700 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
        >
          Send Money
        </button>
      </div>
    </li>
  );
}

function TransactionHistory({ transactions = [], currentUser }) {
  return (
    <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-white">Transaction History</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-400">Your complete transaction history</p>
      </div>
      
      {(!transactions || transactions.length === 0) ? (
        <div className="px-4 py-5 sm:p-6 text-center text-gray-400">No transactions found.</div>
      ) : (
        <div className="overflow-hidden">
          <ul className="divide-y divide-gray-700">
            {transactions.map(tx => {
              const fromId = tx.from._id || tx.from;
              const toId = tx.to._id || tx.to;
              const isSent = String(fromId) === String(currentUser._id);

              const fromName = tx.from.firstName ? `${tx.from.firstName}` : fromId;
              const toName = tx.to.firstName ? `${tx.to.firstName}` : toId;
              
              const date = new Date(tx.timestamp);
              
              return (
                <li key={tx._id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${isSent ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                        {isSent ? 
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          : 
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        }
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-200">
                          {isSent ? `Sent to ${toName}` : `Received from ${fromName}`}
                        </div>
                        <div className="text-sm text-gray-400">
                          {date.toLocaleDateString()} at {date.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${isSent ? 'text-red-400' : 'text-green-400'}`}>
                      {isSent ? `-₹${tx.amount}` : `+₹${tx.amount}`}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
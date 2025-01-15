import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './index.css'; // Or the path to your CSS file
// /home/itachi/Projects/DAPP-React/todo-dapp/build/contracts/TodoList.json
import TodoList from './contracts/TodoList.json';
import { Trash2, CheckCircle, XCircle, Plus, Loader } from 'lucide-react';

const App = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contractAddress, setContractAddress] = useState('');
  const [hasContractAddress, setHasContractAddress] = useState(false); // New state to track if the contract address is set

  useEffect(() => {
    if (hasContractAddress) {
      loadBlockchainData();
    }
  }, [hasContractAddress]); // Trigger loadBlockchainData when contractAddress is set

  const loadBlockchainData = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const currentAccount = accounts[0];
        setAccount(currentAccount);

        const networkId = await web3.eth.net.getId();

        if (!Web3.utils.isAddress(contractAddress)) {
          setError('Invalid contract address');
          setLoading(false);
          return;
        }

        const todoList = new web3.eth.Contract(TodoList.abi, contractAddress);
        setContract(todoList);

        const taskCount = await todoList.methods.taskCount().call();
        const loadedTasks = [];
        for (let i = 1; i <= taskCount; i++) {
          const task = await todoList.methods.tasks(i).call();
          loadedTasks.push(task);
        }
        setTasks(loadedTasks);
        setLoading(false);
      } else {
        setError('Please install MetaMask!');
      }
    } catch (error) {
      console.error("Error loading blockchain data:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setIsSubmitting(true);
    try {
      await contract.methods.createTask(newTask).send({ from: account });
      setNewTask('');
      await loadBlockchainData();
    } catch (error) {
      console.error("Error creating task:", error);
      setError(error.message);
    }
    setIsSubmitting(false);
  };

  const toggleTask = async (id) => {
    setIsSubmitting(true);
    try {
      await contract.methods.toggleCompleted(id).send({ from: account });
      await loadBlockchainData();
    } catch (error) {
      console.error("Error toggling task:", error);
      setError(error.message);
    }
    setIsSubmitting(false);
  };

  const deleteTask = async (id) => {
    setIsSubmitting(true);
    try {
      await contract.methods.deleteTask(id).send({ from: account });
      await loadBlockchainData();
    } catch (error) {
      console.error("Error deleting task:", error);
      setError(error.message);
    }
    setIsSubmitting(false);
  };

  const handleContractAddressSubmit = () => {
    if (Web3.utils.isAddress(contractAddress)) {
      setHasContractAddress(true); // Trigger the loading of blockchain data
    } else {
      setError('Invalid contract address');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
        <Loader className="w-8 h-8 animate-spin text-white" />
        <span className="ml-2 text-lg text-white font-bold">Loading Web3...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 to-red-500">
        <div className="bg-white text-red-500 p-6 rounded-lg shadow-lg">
          <p className="font-semibold text-lg">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!hasContractAddress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-purple-400 to-pink-300 py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            Blockchain Todo List
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Please enter the contract address to continue:
          </p>
          <div className="mb-4">
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="Enter contract address"
              className="px-4 py-2 rounded-lg border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleContractAddressSubmit}
            className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-lg hover:shadow-xl focus:outline-none transition-all"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-300 via-purple-400 to-pink-300 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
          Blockchain Todo List
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Connected: <span className="font-mono text-blue-600">{account.slice(0, 6)}...{account.slice(-4)}</span>
        </p>

        <form onSubmit={createTask} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-2 rounded-lg border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting || !newTask.trim()}
              className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-lg hover:shadow-xl focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
            >
              <Plus size={20} />
              Add
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`group flex items-center justify-between p-4 rounded-lg transition-all ${
                task.completed
                  ? 'bg-green-100 hover:bg-green-200'
                  : 'bg-white hover:bg-blue-100'
              } border border-gray-300 shadow-sm`}
            >
              <span
                className={`flex-1 ${
                  task.completed ? 'line-through text-green-500' : 'text-gray-800'
                }`}
              >
                {task.content}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleTask(task.id)}
                  disabled={isSubmitting}
                  className={`p-2 rounded-full transition-colors ${
                    task.completed
                      ? 'text-green-500 hover:bg-green-300'
                      : 'text-blue-500 hover:bg-blue-300'
                  }`}
                >
                  {task.completed ? <XCircle size={20} /> : <CheckCircle size={20} />}
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  disabled={isSubmitting}
                  className="p-2 text-red-500 hover:bg-red-300 rounded-full transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No tasks yet. Add one to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

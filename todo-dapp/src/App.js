import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import TodoList from './contracts/TodoList.json';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        
        // Get account
        const accounts = await web3.eth.getAccounts();
        const currentAccount = accounts[0];
        setAccount(currentAccount);
        console.log("Connected Account:", currentAccount);

        // Get network
        const networkId = await web3.eth.net.getId();
        console.log("Network ID:", networkId);

        // Get contract instance
        const contractAddress = '0xE2D4A2a51810B849e4a6a41817ba283a5D2838DA';
        console.log("Contract Address:", contractAddress);

        const todoList = new web3.eth.Contract(
          TodoList.abi,
          contractAddress
        );
        setContract(todoList);

        // Load tasks
        const taskCount = await todoList.methods.taskCount().call();
        console.log("Total tasks:", taskCount);

        const loadedTasks = [];
        for (let i = 1; i <= taskCount; i++) {
          const task = await todoList.methods.tasks(i).call();
          console.log(`Task ${i}:`, task);
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
    setLoading(true);
    try {
      console.log("Creating task with account:", account);
      const result = await contract.methods.createTask(newTask)
        .send({ from: account });
      console.log("Task created:", result);
      setNewTask('');
      await loadBlockchainData();
    } catch (error) {
      console.error("Error creating task:", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const toggleTask = async (id) => {
    setLoading(true);
    try {
      console.log("Toggling task", id, "with account:", account);
      const result = await contract.methods.toggleCompleted(id)
        .send({ from: account });
      console.log("Toggle result:", result);
      await loadBlockchainData();
    } catch (error) {
      console.error("Error toggling task:", error);
      setError(error.message);
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Blockchain Todo List</h1>
      <p>Your account: {account}</p>
      <p>Contract connected: {contract ? 'Yes' : 'No'}</p>

      <form onSubmit={createTask} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task..."
          style={{ marginRight: '10px', padding: '5px', width: '70%' }}
        />
        <button 
          type="submit"
          style={{
            padding: '5px 10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '3px'
          }}
        >
          Add Task
        </button>
      </form>

      <div>
        {tasks.map((task) => (
          <div 
            key={task.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px',
              margin: '5px 0',
              backgroundColor: '#f5f5f5',
              borderRadius: '5px'
            }}
          >
            <span style={{ 
              textDecoration: task.completed ? 'line-through' : 'none',
              marginRight: '10px' 
            }}>
              {task.content}
            </span>
            <button 
              onClick={() => toggleTask(task.id)}
              style={{
                padding: '5px 10px',
                backgroundColor: task.completed ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              {task.completed ? 'Undo' : 'Complete'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
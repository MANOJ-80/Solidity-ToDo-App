<div style = "display: flex">
  <img src = "https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white">
  <img src = "https://img.shields.io/badge/Solidity-e6e6e6?style=for-the-badge&logo=solidity&logoColor=black">
  <img src = "https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
</div>


# Blockchain Todo List DApp

## Overview
The Blockchain Todo List DApp is a decentralized application that allows users to create, toggle, and delete tasks on the Ethereum blockchain. The tasks are managed through a smart contract deployed on the Ethereum network. This DApp uses Web3.js to interact with the blockchain, ensuring data is stored in a secure, immutable manner.

## Features
- **Create Tasks**: Users can create new tasks, which are added to the blockchain.
- **Toggle Tasks**: Users can mark tasks as completed or incomplete.
- **Delete Tasks**: Users can delete tasks from the blockchain.
- **Smart Contract**: All tasks are stored on the Ethereum blockchain using a smart contract.

## Technologies Used
- **React**: Frontend framework for building the user interface.
- **Web3.js**: JavaScript library to interact with the Ethereum blockchain.
- **Solidity**: Smart contract language used to write the Todo List contract.
- **Ethereum (MetaMask)**: Used for connecting to the Ethereum network.
- **Tailwind CSS**: For modern and responsive UI styling.

## Installation and Setup

### Prerequisites
- **Node.js**: Ensure Node.js is installed on your system (v14 or higher).
- **MetaMask**: Install the MetaMask extension in your browser to interact with Ethereum networks.
- **Ganache**: A personal blockchain for Ethereum development (optional for local testing).

### Steps to Run the Project

1. **Clone the repository:**
   ```bash
   git clone "https://github.com/MANOJ-80/Solidity-ToDo-App.git"
   cd Solidity-ToDo-App
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   
3. **Deploy the Smart Contract:**
   - Deploy the `TodoList.sol` smart contract using Truffle or any Ethereum deployment tool.
   - After deployment, note down the `contractAddress` and ABI.
     
4. **Start the Development Server:**
   ```bash
   npm start
   ```

    

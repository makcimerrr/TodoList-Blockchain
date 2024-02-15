// TodoList.js
import React, { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';

const TodoList = ({ contract }) => {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [todoContent, setTodoContent] = useState('');
    const [todoList, setTodoList] = useState([]);
    const [filter, setFilter] = useState('all'); // État initial pour afficher toutes les tâches


    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);

                const accounts = await web3Instance.eth.getAccounts();
                setAccounts(accounts);
            } else {
                console.error('MetaMask non détecté');
            }
        };

        init();
    }, []);

    const fetchTodoList = useCallback(async () => {
        if (!web3 || !accounts.length) return;

        const contractAddress = '0x0E6695eb1956F284c7d8A3Ed7D491C92503FB165';
        const contractABI = [
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_content",
                        "type": "string"
                    }
                ],
                "name": "createTask",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "bool",
                        "name": "completed",
                        "type": "bool"
                    }
                ],
                "name": "TaskCompleted",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "content",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "internalType": "bool",
                        "name": "completed",
                        "type": "bool"
                    }
                ],
                "name": "TaskCreated",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_id",
                        "type": "uint256"
                    }
                ],
                "name": "toggleCompleted",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getMyTasks",
                "outputs": [
                    {
                        "internalType": "uint256[]",
                        "name": "",
                        "type": "uint256[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_id",
                        "type": "uint256"
                    }
                ],
                "name": "getTask",
                "outputs": [
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "id",
                                "type": "uint256"
                            },
                            {
                                "internalType": "string",
                                "name": "content",
                                "type": "string"
                            },
                            {
                                "internalType": "bool",
                                "name": "completed",
                                "type": "bool"
                            }
                        ],
                        "internalType": "struct TodoList.Task",
                        "name": "",
                        "type": "tuple"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "tasks",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "content",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "completed",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]; // Insérez ABI du contrat

        const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

        try {
            const taskIds = await contractInstance.methods.getMyTasks().call({ from: accounts[0] });
            const tasks = await Promise.all(
                taskIds.map(async (taskId) => {
                    const task = await contractInstance.methods.getTask(taskId).call({ from: accounts[0] });
                    return { id: task.id, content: task.content, completed: task.completed };
                })
            );
            setTodoList(tasks);
        } catch (error) {
            console.error('Erreur lors de la récupération de la liste des tâches :', error);
        }
    }, [web3, accounts]);

    useEffect(() => {

        fetchTodoList();

    }, [accounts, fetchTodoList]);


    const handleCreateTask = async () => {
        if (!web3 || !accounts.length) {
            console.error('Web3 ou MetaMask non initialisé');
            return;
        }

        const contractAddress = '0x0E6695eb1956F284c7d8A3Ed7D491C92503FB165';
        const contractABI = [
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_content",
                        "type": "string"
                    }
                ],
                "name": "createTask",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "bool",
                        "name": "completed",
                        "type": "bool"
                    }
                ],
                "name": "TaskCompleted",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "content",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "internalType": "bool",
                        "name": "completed",
                        "type": "bool"
                    }
                ],
                "name": "TaskCreated",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_id",
                        "type": "uint256"
                    }
                ],
                "name": "toggleCompleted",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getMyTasks",
                "outputs": [
                    {
                        "internalType": "uint256[]",
                        "name": "",
                        "type": "uint256[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_id",
                        "type": "uint256"
                    }
                ],
                "name": "getTask",
                "outputs": [
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "id",
                                "type": "uint256"
                            },
                            {
                                "internalType": "string",
                                "name": "content",
                                "type": "string"
                            },
                            {
                                "internalType": "bool",
                                "name": "completed",
                                "type": "bool"
                            }
                        ],
                        "internalType": "struct TodoList.Task",
                        "name": "",
                        "type": "tuple"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "tasks",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "content",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "completed",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]; // Insérez ABI du contrat

        const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

        try {
            await contractInstance.methods.createTask(todoContent).send({ from: accounts[0] });
            setTodoContent('');
            fetchTodoList();
        } catch (error) {
            console.error('Erreur lors de la création de la tâche :', error);
        }
    };

    const handleToggleCompleted = async (taskId) => {
        if (!web3 || !accounts.length) {
            console.error('Web3 ou MetaMask non initialisé');
            return;
        }

        const contractAddress = '0x0E6695eb1956F284c7d8A3Ed7D491C92503FB165';
        const contractABI = [
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_content",
                        "type": "string"
                    }
                ],
                "name": "createTask",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "bool",
                        "name": "completed",
                        "type": "bool"
                    }
                ],
                "name": "TaskCompleted",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "string",
                        "name": "content",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "internalType": "bool",
                        "name": "completed",
                        "type": "bool"
                    }
                ],
                "name": "TaskCreated",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_id",
                        "type": "uint256"
                    }
                ],
                "name": "toggleCompleted",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getMyTasks",
                "outputs": [
                    {
                        "internalType": "uint256[]",
                        "name": "",
                        "type": "uint256[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_id",
                        "type": "uint256"
                    }
                ],
                "name": "getTask",
                "outputs": [
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "id",
                                "type": "uint256"
                            },
                            {
                                "internalType": "string",
                                "name": "content",
                                "type": "string"
                            },
                            {
                                "internalType": "bool",
                                "name": "completed",
                                "type": "bool"
                            }
                        ],
                        "internalType": "struct TodoList.Task",
                        "name": "",
                        "type": "tuple"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "tasks",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "content",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "completed",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]; // Insérez ABI du contrat

        const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

        try {
            await contractInstance.methods.toggleCompleted(taskId).send({ from: accounts[0] });
            fetchTodoList();
        } catch (error) {
            if (error.code === 4001) {
                console.log('User rejected the transaction');
            } else {
                console.error("Error lors de la transaction:", error);
            }
        }
    };

    let filteredTodoList = todoList;

    if (filter === 'done') {
        filteredTodoList = todoList.filter(task => task.completed);
    } else if (filter === 'notDone') {
        filteredTodoList = todoList.filter(task => !task.completed);
    }

    return (
        <div>
            <h1>Todo List</h1>
            <div>
                <button onClick={() => setFilter('all')}>All</button>
                <button onClick={() => setFilter('done')}>Done</button>
                <button onClick={() => setFilter('notDone')}>Not Done</button>
            </div>
            <div>
                <input
                    type="text"
                    value={todoContent}
                    onChange={(e) => setTodoContent(e.target.value)}
                    placeholder="Entrez une nouvelle tâche"
                />
                <button onClick={handleCreateTask}>Ajouter</button>
            </div>
            <ul>
                {filteredTodoList.map((task) => (
                    <li key={task.id}>
                        <input type="checkbox" checked={task.completed}
                               onChange={() => handleToggleCompleted(task.id)}/>
                        <span >{task.content}</span>
                        {task.completed ? <span> - Done</span> : <span> - Not Done</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;

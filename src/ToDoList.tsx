import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './Modal/AddTaskModal.tsx';

interface Task {
    id: string;
    text: string;
    completed: boolean;
}

function ToDoList() {
    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', text: "Eat grass", completed: false },
        { id: '2', text: "Eat Food", completed: false }
    ]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showModal, setShowModal] = useState(false);

    function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setSearchQuery(event.target.value);
    }

    function addTask(taskText: string): void {
        if (taskText.trim()) {
            const newTask: Task = {
                id: Date.now().toString(),
                text: taskText.trim(),
                completed: false
            };
            setTasks([...tasks, newTask]);
        }
    }

    function deleteTask(id: string): void {
        setTasks(tasks.filter(task => task.id !== id));
    }

    function toggleTaskCompletion(id: string): void {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    }

    function editTask(id: string, newText: string): void {
        if (newText.trim()) {
            setTasks(tasks.map(task =>
                task.id === id ? { ...task, text: newText.trim() } : task
            ));
        }
    }

    const filteredTasks = tasks.filter(task =>
        task.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='to-do-list'>
            <h1>To Do List</h1>
            <div className='list-controls'>
                <div className='search-bar'>
                    <input
                        type='text'
                        placeholder='Search tasks...'
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className='search-input'
                    />
                </div>
                <button className='add-button' onClick={() => setShowModal(true)}>Add Task</button>
            </div>

            {showModal && createPortal(
                <ModalContent 
                    onClose={() => setShowModal(false)}
                    onAdd={(text) => {
                        addTask(text);
                        setShowModal(false);
                    }}
                />,
                document.body
            )}

            <ol className='task-list'>
                {filteredTasks.map((task) => (
                    <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                        <div className='task-content'>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTaskCompletion(task.id)}
                                className='task-checkbox'
                            />
                            <span className='task-text'>{task.text}</span>
                        </div>
                        <div className='task-buttons'>
                            <button className='view-button'>👁</button>
                            <button 
                                className='edit-button'
                                onClick={() => {
                                    const newText = prompt('Edit task:', task.text);
                                    if (newText) editTask(task.id, newText);
                                }}
                            >
                                ✎
                            </button>
                            <button 
                                className='delete-button' 
                                onClick={() => deleteTask(task.id)}
                            >
                                X
                            </button>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default ToDoList;
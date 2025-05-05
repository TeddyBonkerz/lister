import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './Modal/AddTaskModal.tsx';

function ToDoList() {
    const [tasks, setTasks] = useState<string[]>(["Eat grass", "Eat Food"])
    const [newTask, setNewTasks] = useState<string>('')
    const [showModal, setShowModal] = useState(false);


    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setNewTasks(event.target.value)
    }

    function addTask(): void {
        setShowModal(true)
    }

    function deleteTask(index: number): void {
        const updatedTasks = tasks.filter((_, i) => i !== index)
        setTasks(updatedTasks)
    }


    return (
        <div className='to-do-list'>
            <h1>To Do List</h1>
            <div>
                <input type='text' placeholder='Search tasks...' value={newTask} onChange={handleInputChange} />\

                <button className='add-button' onClick={addTask}>Add</button>
                {showModal && createPortal(
                    <ModalContent onClose={() => setShowModal(false)} />,
                    document.body
                )}

                <ol className='task-list'>
                    {tasks.map((task, index) => (
                        <li key={index} className='task-item'>
                            <span>{task}</span>
                            <div className='task-buttons'>
                                <button className='view-button'>👁</button>
                                <button className='edit-button'>✎</button>
                                <button className='delete-button' onClick={() => deleteTask(index)}>X</button>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </div>)
}

export default ToDoList
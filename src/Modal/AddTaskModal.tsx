import { useState } from 'react';
import './AddTaskModal.css'

interface AddTaskModalProps {
    onClose: () => void;
    onAdd: (text: string) => void;
}

export default function AddTaskModal({ onClose, onAdd }: AddTaskModalProps) {
    const [taskText, setTaskText] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskText.trim()) {
            setError('Task description cannot be empty');
            return;
        }
        onAdd(taskText);
        onClose();
    };

    return (
        <div className="overlay" onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="modal">
                <h2>Add New Task</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="taskDescription">
                            Task Description:
                        </label>
                        <textarea
                            id="taskDescription"
                            value={taskText}
                            onChange={(e) => {
                                setTaskText(e.target.value);
                                if (error) setError('');
                            }}
                            rows={5}
                            cols={40}
                            placeholder="Enter your task description here..."
                        />
                        {error && <div className="error-message">{error}</div>}
                    </div>
                    <div className="modal-buttons">
                        <button type="button" onClick={onClose} className="cancel-button">
                            X
                        </button>
                        <button type="submit" className="submit-button">
                            ✓
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
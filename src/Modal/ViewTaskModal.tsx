import './ViewTaskModal.css';  // We'll reuse the modal styles

interface ViewTaskModalProps {
    onClose: () => void;
    task: {
        id: string;
        text: string;
        completed: boolean;
        // Future fields will go here:
        // dueDate?: Date;
        // priority?: string;
        // category?: string;
        // attachments?: string[];
        // comments?: string[];
    };
}

export default function ViewTaskModal({ onClose, task }: ViewTaskModalProps) {
    return (
        <div className="overlay" onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="modal view-task-modal">
                <h2>Task Details</h2>
                <div className="task-details">
                    <div className="detail-group">
                        <label>Status:</label>
                        <span className={`status-badge ${task.completed ? 'completed' : 'pending'}`}>
                            {task.completed ? 'Completed' : 'Pending'}
                        </span>
                    </div>
                    
                    <div className="detail-group">
                        <label>Description:</label>
                        <p className="task-description">{task.text}</p>
                    </div>

                    {/* Future fields will be added here */}
                    {/* <div className="detail-group">
                        <label>Due Date:</label>
                        <span>{task.dueDate}</span>
                    </div> */}
                </div>
                <div className="modal-buttons">
                    <button onClick={onClose} className="cancel-button">
                        X
                    </button>
                </div>
            </div>
        </div>
    );
} 
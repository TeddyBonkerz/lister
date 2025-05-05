import './AddTaskModal.css'

export default function AddTaskModal({ onClose }: { onClose: () => void }) {

    return (
        <div className="overlay">
            <div className="modal">
                <label>
                Description:
                <textarea name="description" rows={20} cols={40} />
                </label>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    )
}
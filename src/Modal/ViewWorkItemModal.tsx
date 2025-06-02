import './ViewWorkItemModal.css';  // We'll reuse the modal styles

interface ViewWorkItemModalProps {
    onClose: () => void;
    workitem: {
        id: string;
        title: string;
        dateCompleted: string;
        company: string;
        role: string;
        description: string;
        impact: string;
        technologies: string[];
        steps: string[];
        notes: string[];
        tags: string[];
    };
    //onEdit: (id: string, updates: Partial<ViewWorkItemModalProps['workitem']>) => void;
}

export default function ViewWorkItemModal({ 
    onClose, 
    workitem,
    //onEdit 
}: ViewWorkItemModalProps) {
    return (
        <div className="overlay" onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="modal view-workitem-modal">
                <h2>{workitem.title}</h2>
                
                <div className="workitem-header">
                    <div className="meta-info">
                        <span className="company">{workitem.company}</span>
                        <span className="role">{workitem.role}</span>
                        <span className="date">
                            {new Date(workitem.dateCompleted).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="accomplishment-details">
                    <section className="detail-section">
                        <h3>Description</h3>
                        <p>{workitem.description}</p>
                    </section>

                    {workitem.impact && (
                        <section className="detail-section">
                            <h3>Impact</h3>
                            <p>{workitem.impact}</p>
                        </section>
                    )}

                    {workitem.steps.length > 0 && (
                        <section className="detail-section">
                            <h3>Steps Taken</h3>
                            <ol>
                                {workitem.steps.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ol>
                        </section>
                    )}

                    {workitem.technologies.length > 0 && (
                        <section className="detail-section">
                            <h3>Technologies Used</h3>
                            <div className="tags-list">
                                {workitem.technologies.map((tech, index) => (
                                    <span key={index} className="tech-tag">{tech}</span>
                                ))}
                            </div>
                        </section>
                    )}

                    {workitem.notes.length > 0 && (
                        <section className="detail-section">
                            <h3>Additional Notes</h3>
                            <ul>
                                {workitem.notes.map((note, index) => (
                                    <li key={index}>{note}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {workitem.tags.length > 0 && (
                        <section className="detail-section">
                            <h3>Tags</h3>
                            <div className="tags-list">
                                {workitem.tags.map((tag, index) => (
                                    <span key={index} className="tag">{tag}</span>
                                ))}
                            </div>
                        </section>
                    )}
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
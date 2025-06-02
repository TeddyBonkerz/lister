import { useState } from 'react';
import './ViewWorkItemModal.css';

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
    onEdit: (id: string, updates: Partial<ViewWorkItemModalProps['workitem']>) => void;
}

export default function ViewWorkItemModal({ 
    onClose, 
    workitem,
    onEdit 
}: ViewWorkItemModalProps) {
    const [showSteps, setShowSteps] = useState(true);
    const [showNotes, setShowNotes] = useState(true);

    return (
        <div className="overlay" onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="modal view-workitem-modal">
                <div className="modal-header">
                    <h2>{workitem.title}</h2>
                    <div className="meta-row">
                        <span className="company">{workitem.company}</span>
                        <span className="separator">•</span>
                        <span className="role">{workitem.role}</span>
                        <span className="separator">•</span>
                        <span className="date">{new Date(workitem.dateCompleted).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="modal-content">
                    <div className="content-section">
                        <p className="description">{workitem.description}</p>
                        {workitem.impact && (
                            <p className="impact">
                                <strong>Impact:</strong> {workitem.impact}
                            </p>
                        )}
                    </div>

                    <div className="two-column">
                        <div className="column">
                            <div className="collapsible-section">
                                <button 
                                    className="section-toggle"
                                    onClick={() => setShowSteps(!showSteps)}
                                >
                                    📋 Steps {showSteps ? '▼' : '▶'}
                                </button>
                                {showSteps && workitem.steps.length > 0 && (
                                    <ol className="steps-list">
                                        {workitem.steps.map((step, index) => (
                                            <li key={index}>{step}</li>
                                        ))}
                                    </ol>
                                )}
                            </div>
                        </div>

                        <div className="column">
                            <div className="collapsible-section">
                                <button 
                                    className="section-toggle"
                                    onClick={() => setShowNotes(!showNotes)}
                                >
                                    📝 Notes {showNotes ? '▼' : '▶'}
                                </button>
                                {showNotes && workitem.notes.length > 0 && (
                                    <ul className="notes-list">
                                        {workitem.notes.map((note, index) => (
                                            <li key={index}>{note}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="tags-section">
                        {workitem.technologies.length > 0 && (
                            <div className="tech-tags">
                                <span className="tag-label">🔧</span>
                                {workitem.technologies.map((tech, index) => (
                                    <span key={index} className="tech-tag">{tech}</span>
                                ))}
                            </div>
                        )}
                        {workitem.tags.length > 0 && (
                            <div className="general-tags">
                                <span className="tag-label">🏷</span>
                                {workitem.tags.map((tag, index) => (
                                    <span key={index} className="tag">{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="modal-buttons">
                    <button 
                        className='edit-button'
                        onClick={() => {
                            const newText = prompt('Edit description:', workitem.description);
                            if (newText) onEdit(workitem.id, { description: newText });
                        }}>
                            ✎
                    </button>
                    <button onClick={onClose} className="cancel-button">
                        X
                    </button>
                </div>
            </div>
        </div>
    );
} 
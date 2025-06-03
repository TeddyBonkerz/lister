import { useState, useEffect } from 'react';
import { WorkItem } from '../types';
import './WorkItemModal.css';

interface WorkItemModalProps {
    onClose: () => void;
    onSave: (item: Omit<WorkItem, 'id'>) => void;
    initialData?: WorkItem;
    mode: 'add' | 'edit';
}

export default function WorkItemModal({ onClose, onSave, initialData, mode }: WorkItemModalProps) {
    const [formData, setFormData] = useState<Omit<WorkItem, 'id'>>({
        title: '',
        dateCompleted: new Date().toISOString().split('T')[0],
        company: '',
        role: '',
        description: '',
        impact: '',
        technologies: [],
        steps: [''],
        notes: [''],
        tags: []
    });
    const [newTechnology, setNewTechnology] = useState('');
    const [newTag, setNewTag] = useState('');
    const [errors, setErrors] = useState<Partial<Record<keyof WorkItem, string>>>({});

    useEffect(() => {
        if (initialData && mode === 'edit') {
            const { id, ...rest } = initialData;
            setFormData(rest);
        }
    }, [initialData, mode]);

    const validate = () => {
        const newErrors: Partial<Record<keyof WorkItem, string>> = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.company.trim()) newErrors.company = 'Company is required';
        if (!formData.role.trim()) newErrors.role = 'Role is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        // Filter out empty steps and notes
        const cleanedData = {
            ...formData,
            steps: formData.steps.filter(step => step.trim()),
            notes: formData.notes.filter(note => note.trim())
        };
        onSave(cleanedData);
        onClose();
    };

    const handleArrayInput = (
        type: 'steps' | 'notes',
        index: number,
        value: string
    ) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].map((item, i) => (i === index ? value : item))
        }));
    };

    const addArrayItem = (type: 'steps' | 'notes') => {
        setFormData(prev => ({
            ...prev,
            [type]: [...prev[type], '']
        }));
    };

    const removeArrayItem = (type: 'steps' | 'notes', index: number) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
    };

    const addTechnology = () => {
        if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
            setFormData(prev => ({
                ...prev,
                technologies: [...prev.technologies, newTechnology.trim()]
            }));
            setNewTechnology('');
        }
    };

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const removeItem = (type: 'technologies' | 'tags', item: string) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].filter(i => i !== item)
        }));
    };

    return (
        <div className="overlay" onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="modal workitem-modal">
                <h2>{mode === 'add' ? 'Add Work Item' : 'Edit Work Item'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="title">Title*</label>
                            <input
                                id="title"
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className={errors.title ? 'error' : ''}
                            />
                            {errors.title && <div className="error-message">{errors.title}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="dateCompleted">Date Completed</label>
                            <input
                                id="dateCompleted"
                                type="date"
                                value={formData.dateCompleted}
                                onChange={(e) => setFormData(prev => ({ ...prev, dateCompleted: e.target.value }))}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="company">Company*</label>
                            <input
                                id="company"
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                                className={errors.company ? 'error' : ''}
                            />
                            {errors.company && <div className="error-message">{errors.company}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">Role*</label>
                            <input
                                id="role"
                                type="text"
                                value={formData.role}
                                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                className={errors.role ? 'error' : ''}
                            />
                            {errors.role && <div className="error-message">{errors.role}</div>}
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="description">Description*</label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={3}
                                className={errors.description ? 'error' : ''}
                            />
                            {errors.description && <div className="error-message">{errors.description}</div>}
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="impact">Impact</label>
                            <textarea
                                id="impact"
                                value={formData.impact}
                                onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value }))}
                                rows={2}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Steps</label>
                            {formData.steps.map((step, index) => (
                                <div key={index} className="array-input">
                                    <input
                                        type="text"
                                        value={step}
                                        onChange={(e) => handleArrayInput('steps', index, e.target.value)}
                                        placeholder={`Step ${index + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('steps', index)}
                                        className="remove-button"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem('steps')}
                                className="add-array-item"
                            >
                                + Add Step
                            </button>
                        </div>

                        <div className="form-group full-width">
                            <label>Notes</label>
                            {formData.notes.map((note, index) => (
                                <div key={index} className="array-input">
                                    <input
                                        type="text"
                                        value={note}
                                        onChange={(e) => handleArrayInput('notes', index, e.target.value)}
                                        placeholder={`Note ${index + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('notes', index)}
                                        className="remove-button"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addArrayItem('notes')}
                                className="add-array-item"
                            >
                                + Add Note
                            </button>
                        </div>

                        <div className="form-group full-width">
                            <label>Technologies</label>
                            <div className="tag-input">
                                <input
                                    type="text"
                                    value={newTechnology}
                                    onChange={(e) => setNewTechnology(e.target.value)}
                                    placeholder="Add technology"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addTechnology();
                                        }
                                    }}
                                />
                                <button type="button" onClick={addTechnology}>Add</button>
                            </div>
                            <div className="tags-container">
                                {formData.technologies.map((tech, index) => (
                                    <span key={index} className="tag tech-tag">
                                        {tech}
                                        <button
                                            type="button"
                                            onClick={() => removeItem('technologies', tech)}
                                            className="remove-tag"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label>Tags</label>
                            <div className="tag-input">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="Add tag"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addTag();
                                        }
                                    }}
                                />
                                <button type="button" onClick={addTag}>Add</button>
                            </div>
                            <div className="tags-container">
                                {formData.tags.map((tag, index) => (
                                    <span key={index} className="tag">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeItem('tags', tag)}
                                            className="remove-tag"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="modal-buttons">
                        <button type="button" onClick={onClose} className="cancel-button">
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            {mode === 'add' ? 'Add Work Item' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 
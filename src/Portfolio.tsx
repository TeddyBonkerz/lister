import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import AddWorkItemModal from './Modal/AddWorkItemModal.tsx';
import ViewWorkItemModal from './Modal/ViewWorkItemModal.tsx';

interface WorkItem {
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
}

function ToDoList() {
    const [items, setItems] = useState<WorkItem[]>([
        {
            id: '1',
            title: 'Implemented Authentication System',
            dateCompleted: '2023-12-01',
            company: 'Tech Corp',
            role: 'Senior Developer',
            description: 'Led the implementation of a new OAuth2 authentication system',
            impact: 'Reduced login issues by 50% and improved security standards',
            technologies: ['OAuth2', 'Node.js', 'React'],
            steps: ['Research existing solutions', 'Design new architecture', 'Implement core functionality'],
            notes: ['Great learning experience with OAuth2'],
            tags: ['authentication', 'security', 'backend']
        }
    ]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [viewingItem, setViewingItem] = useState<WorkItem | null>(null);

    function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setSearchQuery(event.target.value);
    }

    function addItem(itemData: Omit<WorkItem, 'id'>): void {
        const newItem: WorkItem = {
            ...itemData,
            id: Date.now().toString()
        };
        setItems([...items, newItem]);
    }

    function deleteItem(id: string): void {
        setItems(items.filter(item => item.id !== id));
    }

    function editItem(id: string, updates: Partial<WorkItem>): void {
        setItems(items.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ));
    }

    const filteredItems = items.filter(item => {
        const searchTerms = searchQuery.toLowerCase().split(' ');
        const itemText = `
            ${item.title}
            ${item.company}
            ${item.role}
            ${item.description}
            ${item.impact}
            ${item.technologies.join(' ')}
            ${item.tags.join(' ')}
        `.toLowerCase();

        return searchTerms.every(term => itemText.includes(term));
    });

    return (
        <div className='to-do-list'>
            <h1>Work Items</h1>
            <div className='list-controls'>
                <div className='search-bar'>
                    <input
                        type='text'
                        placeholder='Search work items...'
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className='search-input'
                    />
                </div>
                <button className='add-button' onClick={() => setShowAddModal(true)}>Add Item</button>
            </div>

            {showAddModal && createPortal(
                <AddWorkItemModal 
                    onClose={() => setShowAddModal(false)}
                    onAdd={(itemData) => {
                        addItem(itemData);
                        setShowAddModal(false);
                    }}
                />,
                document.body
            )}

            {viewingItem && createPortal(
                <ViewWorkItemModal
                    workitem={viewingItem}
                    onClose={() => setViewingItem(null)}
                    onEdit={editItem}
                />,
                document.body
            )}

            <ol className='task-list'>
                {filteredItems.map((item) => (
                    <li key={item.id} className='task-item'>
                        <div className='task-content'>
                            <span className='task-text'>
                                <strong>{item.title}</strong>
                                <br />
                                {item.company} - {item.role}
                            </span>
                        </div>
                        <div className='task-buttons'>
                            <button 
                                className='view-button'
                                onClick={() => setViewingItem(item)}
                            >
                                👁
                            </button>
                            <button 
                                className='edit-button'
                                onClick={() => {
                                    const newText = prompt('Edit description:', item.description);
                                    if (newText) editItem(item.id, { description: newText.trim() });
                                }}
                            >
                                ✎
                            </button>
                            <button 
                                className='delete-button' 
                                onClick={() => deleteItem(item.id)}
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
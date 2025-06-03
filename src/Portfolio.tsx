import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import WorkItemModal from './Modal/WorkItemModal.tsx';
import AdvancedSearch from './components/AdvancedSearch';
import { WorkItem, SearchCriteria, SearchHighlight } from './types';
import './Portfolio.css';
import './animations.css';

function Portfolio() {
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
    const [searchCriteria, setSearchCriteria] = useState<any[]>([]);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        mode: 'add' | 'edit';
        itemToEdit?: WorkItem;
    }>({
        isOpen: false,
        mode: 'add'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    const suggestions = useMemo(() => ({
        technologies: Array.from(new Set(items.flatMap(item => item.technologies))),
        companies: Array.from(new Set(items.map(item => item.company))),
        roles: Array.from(new Set(items.map(item => item.role))),
        tags: Array.from(new Set(items.flatMap(item => item.tags)))
    }), [items]);

    function addItem(itemData: Omit<WorkItem, 'id'>): void {
        const newItem = {
            id: Date.now().toString(),
            title: typeof itemData.title === 'string' ? itemData.title : '',
            dateCompleted: typeof itemData.dateCompleted === 'string' ? itemData.dateCompleted : new Date().toISOString().split('T')[0],
            company: typeof itemData.company === 'string' ? itemData.company : '',
            role: typeof itemData.role === 'string' ? itemData.role : '',
            description: typeof itemData.description === 'string' ? itemData.description : '',
            impact: typeof itemData.impact === 'string' ? itemData.impact : '',
            technologies: Array.isArray(itemData.technologies) ? itemData.technologies : [],
            steps: Array.isArray(itemData.steps) ? itemData.steps : [],
            notes: Array.isArray(itemData.notes) ? itemData.notes : [],
            tags: Array.isArray(itemData.tags) ? itemData.tags : []
        } as WorkItem;

        setItems(prevItems => [newItem, ...prevItems]);
    }

    function editItem(id: string, updates: Partial<WorkItem>): void {
        setItems(items.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ));
    }

    function deleteItem(id: string): void {
        setItems(items.filter(item => item.id !== id));
        setExpandedItems(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    }

    function toggleItemExpansion(id: string): void {
        setExpandedItems(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }

    function highlightText(text: string, searchTerm: string): SearchHighlight {
        if (!searchTerm) return { text, indices: [] };
        
        const indices: number[] = [];
        let currentIndex = text.toLowerCase().indexOf(searchTerm.toLowerCase());
        
        while (currentIndex !== -1) {
            indices.push(currentIndex);
            currentIndex = text.toLowerCase().indexOf(searchTerm.toLowerCase(), currentIndex + 1);
        }
        
        return { text, indices };
    }

    function renderHighlightedText(highlight: SearchHighlight): React.ReactNode {
        if (highlight.indices.length === 0) return highlight.text;

        const result: React.ReactNode[] = [];
        let lastIndex = 0;

        highlight.indices.forEach((startIndex, i) => {
            const endIndex = startIndex + searchCriteria[0]?.value.length;
            
            result.push(
                <React.Fragment key={`text-${i}`}>
                    {highlight.text.slice(lastIndex, startIndex)}
                </React.Fragment>
            );
            
            result.push(
                <span key={`highlight-${i}`} className="highlight">
                    {highlight.text.slice(startIndex, endIndex)}
                </span>
            );
            
            lastIndex = endIndex;
        });

        result.push(
            <React.Fragment key="text-end">
                {highlight.text.slice(lastIndex)}
            </React.Fragment>
        );

        return result;
    }

    const matchField = (item: WorkItem, field: keyof WorkItem, value: string): boolean => {
        const fieldValue = item[field];
        if (typeof fieldValue === 'string') {
            return fieldValue.toLowerCase().includes(value);
        }
        if (Array.isArray(fieldValue)) {
            return fieldValue.some(v => v.toLowerCase().includes(value));
        }
        return false;
    };

    const filteredItems = useMemo(() => {
        if (!searchCriteria.length) return items;

        return items.filter(item => {
            return searchCriteria.every(criteria => {
                const value = criteria.value.toLowerCase();
                if (!value) return true;

                if (criteria.field === 'all') {
                    return (
                        matchField(item, 'title', value) ||
                        matchField(item, 'company', value) ||
                        matchField(item, 'role', value) ||
                        matchField(item, 'description', value) ||
                        matchField(item, 'impact', value) ||
                        matchField(item, 'technologies', value) ||
                        matchField(item, 'tags', value)
                    );
                }

                return matchField(item, criteria.field as keyof WorkItem, value);
            });
        });
    }, [items, searchCriteria]);

    const handleSearch = (criteria: any[]) => {
        setIsLoading(true);
        setSearchCriteria(criteria);
        setTimeout(() => setIsLoading(false), 300); // Simulate search delay
    };

    const getItemIcon = (item: WorkItem) => {
        if (item.tags.includes('backend')) return '🔧';
        if (item.tags.includes('frontend')) return '🎨';
        if (item.tags.includes('database')) return '💾';
        if (item.tags.includes('security')) return '🔒';
        if (item.tags.includes('api')) return '🔌';
        return '📋';
    };

    return (
        <div className={`portfolio ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="header-controls">
                <h1>Work Items</h1>
                <button 
                    className="theme-toggle"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                >
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
            </div>

            <AdvancedSearch
                onSearch={handleSearch}
                suggestions={suggestions}
                isLoading={isLoading}
            />

            <button 
                className="add-button" 
                onClick={() => setModalState({ isOpen: true, mode: 'add' })}
            >
                + Add Item
            </button>

            {modalState.isOpen && createPortal(
                <WorkItemModal
                    mode={modalState.mode}
                    initialData={modalState.itemToEdit}
                    onClose={() => setModalState({ isOpen: false, mode: 'add' })}
                    onSave={(itemData) => {
                        if (modalState.mode === 'add') {
                            addItem(itemData);
                        } else if (modalState.mode === 'edit' && modalState.itemToEdit) {
                            editItem(modalState.itemToEdit.id, itemData);
                        }
                        setModalState({ isOpen: false, mode: 'add' });
                    }}
                />,
                document.body
            )}

            <ol className="task-list">
                {filteredItems.map((item, index) => (
                    <li 
                        key={item.id} 
                        className={`task-item animate-in`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div 
                            className="task-content"
                            onClick={() => toggleItemExpansion(item.id)}
                        >
                            <div className="task-header">
                                <span className="task-icon">{getItemIcon(item)}</span>
                                <span className="task-title">
                                    {renderHighlightedText(highlightText(item.title, searchCriteria[0]?.value || ''))}
                                </span>
                                <span className="task-meta">
                                    {renderHighlightedText(highlightText(item.company, searchCriteria[0]?.value || ''))} • 
                                    {renderHighlightedText(highlightText(item.role, searchCriteria[0]?.value || ''))} • 
                                    {new Date(item.dateCompleted).toLocaleDateString()}
                                </span>
                            </div>
                            
                            {expandedItems.has(item.id) && (
                                <div className="task-preview expand">
                                    <p className="task-description">
                                        {renderHighlightedText(highlightText(item.description, searchCriteria[0]?.value || ''))}
                                    </p>
                                    {item.impact && (
                                        <p className="task-impact">
                                            <strong>Impact:</strong> {renderHighlightedText(highlightText(item.impact, searchCriteria[0]?.value || ''))}
                                        </p>
                                    )}
                                    <div className="task-tags">
                                        {item.technologies.map((tech, index) => (
                                            <span key={index} className="tech-tag">
                                                {renderHighlightedText(highlightText(tech, searchCriteria[0]?.value || ''))}
                                            </span>
                                        ))}
                                        {item.tags.map((tag, index) => (
                                            <span key={index} className="tag">
                                                {renderHighlightedText(highlightText(tag, searchCriteria[0]?.value || ''))}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="task-buttons">
                            <button 
                                className="edit-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setModalState({
                                        isOpen: true,
                                        mode: 'edit',
                                        itemToEdit: item
                                    });
                                }}
                            >
                                ✎
                            </button>
                            <button 
                                className="delete-button" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteItem(item.id);
                                }}
                            >
                                ×
                            </button>
                        </div>
                    </li>
                ))}
                {filteredItems.length === 0 && (
                    <div className="no-results fade-in">
                        No items found matching your search criteria
                    </div>
                )}
            </ol>
        </div>
    );
}

export default Portfolio;
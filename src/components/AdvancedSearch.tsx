import React, { useState, useEffect } from 'react';
import './AdvancedSearch.css';

interface SearchCriteria {
    field: string;
    value: string;
    operation: 'AND' | 'OR';
}

interface SavedSearch {
    id: string;
    name: string;
    criteria: SearchCriteria[];
}

interface AdvancedSearchProps {
    onSearch: (criteria: SearchCriteria[]) => void;
    suggestions: {
        technologies: string[];
        companies: string[];
        roles: string[];
        tags: string[];
    };
    isLoading?: boolean;
}

export default function AdvancedSearch({ onSearch, suggestions, isLoading }: AdvancedSearchProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState<SearchCriteria[]>([
        { field: 'all', value: '', operation: 'AND' }
    ]);
    const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() => {
        const saved = localStorage.getItem('savedSearches');
        return saved ? JSON.parse(saved) : [];
    });
    const [showSuggestions, setShowSuggestions] = useState<number | null>(null);

    useEffect(() => {
        localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
    }, [savedSearches]);

    const fields = [
        { value: 'all', label: 'All Fields' },
        { value: 'title', label: 'Title' },
        { value: 'company', label: 'Company' },
        { value: 'role', label: 'Role' },
        { value: 'description', label: 'Description' },
        { value: 'impact', label: 'Impact' },
        { value: 'technologies', label: 'Technologies' },
        { value: 'tags', label: 'Tags' }
    ];

    const addCriteria = () => {
        setSearchCriteria([...searchCriteria, { field: 'all', value: '', operation: 'AND' }]);
    };

    const removeCriteria = (index: number) => {
        setSearchCriteria(searchCriteria.filter((_, i) => i !== index));
    };

    const updateCriteria = (index: number, updates: Partial<SearchCriteria>) => {
        setSearchCriteria(searchCriteria.map((criteria, i) => 
            i === index ? { ...criteria, ...updates } : criteria
        ));
    };

    const handleSearch = () => {
        onSearch(searchCriteria.filter(criteria => criteria.value.trim()));
    };

    const saveCurrentSearch = () => {
        const name = prompt('Enter a name for this search:');
        if (name) {
            const newSavedSearch: SavedSearch = {
                id: Date.now().toString(),
                name,
                criteria: searchCriteria
            };
            setSavedSearches([...savedSearches, newSavedSearch]);
        }
    };

    const loadSavedSearch = (saved: SavedSearch) => {
        setSearchCriteria(saved.criteria);
        handleSearch();
    };

    const deleteSavedSearch = (id: string) => {
        setSavedSearches(savedSearches.filter(search => search.id !== id));
    };

    const getSuggestions = (field: string) => {
        switch (field) {
            case 'technologies':
                return suggestions.technologies;
            case 'company':
                return suggestions.companies;
            case 'role':
                return suggestions.roles;
            case 'tags':
                return suggestions.tags;
            default:
                return [];
        }
    };

    return (
        <div className="advanced-search">
            <div className="search-header">
                <button 
                    className="toggle-button"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? '▼' : '▶'} Advanced Search
                </button>
                {isLoading && <div className="loading-spinner" />}
            </div>

            {isExpanded && (
                <div className="search-content fade-in">
                    {searchCriteria.map((criteria, index) => (
                        <div key={index} className="search-row animate-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            {index > 0 && (
                                <select
                                    value={criteria.operation}
                                    onChange={(e) => updateCriteria(index, { operation: e.target.value as 'AND' | 'OR' })}
                                    className="operation-select"
                                >
                                    <option value="AND">AND</option>
                                    <option value="OR">OR</option>
                                </select>
                            )}

                            <select
                                value={criteria.field}
                                onChange={(e) => updateCriteria(index, { field: e.target.value })}
                                className="field-select"
                            >
                                {fields.map(field => (
                                    <option key={field.value} value={field.value}>
                                        {field.label}
                                    </option>
                                ))}
                            </select>

                            <div className="search-input-container">
                                <input
                                    type="text"
                                    value={criteria.value}
                                    onChange={(e) => {
                                        updateCriteria(index, { value: e.target.value });
                                        setShowSuggestions(index);
                                    }}
                                    onFocus={() => setShowSuggestions(index)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(null), 200)}
                                    placeholder="Enter search term..."
                                    className="search-input"
                                />
                                {showSuggestions === index && getSuggestions(criteria.field).length > 0 && (
                                    <div className="suggestions-dropdown">
                                        {getSuggestions(criteria.field)
                                            .filter(suggestion => 
                                                suggestion.toLowerCase().includes(criteria.value.toLowerCase())
                                            )
                                            .map((suggestion, i) => (
                                                <div
                                                    key={i}
                                                    className="suggestion-item"
                                                    onClick={() => updateCriteria(index, { value: suggestion })}
                                                >
                                                    {suggestion}
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}
                            </div>

                            {searchCriteria.length > 1 && (
                                <button
                                    className="remove-criteria"
                                    onClick={() => removeCriteria(index)}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}

                    <div className="search-actions">
                        <button className="add-criteria" onClick={addCriteria}>
                            + Add Criteria
                        </button>
                        <button className="search-button" onClick={handleSearch}>
                            Search
                        </button>
                        <button className="save-search" onClick={saveCurrentSearch}>
                            💾 Save Search
                        </button>
                    </div>

                    {savedSearches.length > 0 && (
                        <div className="saved-searches">
                            <h4>Saved Searches</h4>
                            <div className="saved-searches-list">
                                {savedSearches.map(saved => (
                                    <div key={saved.id} className="saved-search-item">
                                        <button
                                            className="load-search"
                                            onClick={() => loadSavedSearch(saved)}
                                        >
                                            {saved.name}
                                        </button>
                                        <button
                                            className="delete-search"
                                            onClick={() => deleteSavedSearch(saved.id)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 
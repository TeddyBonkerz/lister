export interface WorkItem {
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

export interface SearchCriteria {
    field: string;
    value: string;
    operation: 'AND' | 'OR';
}

export interface SavedSearch {
    id: string;
    name: string;
    criteria: SearchCriteria[];
}

export interface SearchHighlight {
    text: string;
    indices: number[];
} 
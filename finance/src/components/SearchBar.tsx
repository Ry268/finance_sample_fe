import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';
import { fetchSearchSuggestions, Company } from '../services/api';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Company[]>([]);

    useEffect(() => {
        if (query.length > 0) {
            fetchSearchSuggestions(query)
                .then(data => {
                    console.log('Search suggestions:', data); // デバッグログ
                    setSuggestions(data);
                })
                .catch(error => console.error('Error fetching search suggestions:', error));
        } else {
            setSuggestions([]);
        }
    }, [query]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
    };

    return (
        <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search..."
            />
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion) => (
                        <li key={suggestion.id} className="suggestion-item">
                        <span className="suggestion-code">{suggestion.code}</span>
                        <span className="suggestion-separator"></span>
                        <span className="suggestion-name">{suggestion.name}</span>
                    </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;

import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';
import { fetchSearchSuggestions, Company } from '../services/api';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Company[]>([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isSuggestionsVisible, setSuggestionsVisible] = useState(true);
    const suggestionsRef = useRef<HTMLUListElement>(null);
    const activeItemRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        if (query.length > 0) {
            fetchSearchSuggestions(query)
                .then(data => {
                    setSuggestions(data);
                    setActiveIndex(-1);
                })
                .catch(error => console.error('Error fetching search suggestions:', error));
        } else {
            setSuggestions([]);
        }
    }, [query]);

    useEffect(() => {
        if (activeItemRef.current && suggestionsRef.current) {
            const activeItem = activeItemRef.current;
            const suggestionsList = suggestionsRef.current;

            const itemTop = activeItem.offsetTop;
            const itemBottom = itemTop + activeItem.clientHeight;
            const listScrollTop = suggestionsList.scrollTop;
            const listHeight = suggestionsList.clientHeight;

            // アクティブな項目が表示されるようにスクロールする
            if (itemBottom > listScrollTop + listHeight) {
                suggestionsList.scrollTop = itemBottom - listHeight;
            } else if (itemTop < listScrollTop) {
                suggestionsList.scrollTop = itemTop;
            }
        }
    }, [activeIndex]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
        setSuggestionsVisible(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            setActiveIndex(prevIndex => (prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex));
        } else if (e.key === 'ArrowUp') {
            setActiveIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : 0));
        } else if (e.key === 'Enter') {
            if (activeIndex >= 0 && activeIndex < suggestions.length) {
                setQuery(suggestions[activeIndex].name);
                setSuggestionsVisible(false);
            }
        } else if (e.key === 'Escape') {
            setSuggestionsVisible(false);
        }
    };

    return (
        <div className={`search-bar ${suggestions.length === 0 ? 'rounded' : ''}`}>
            <FaSearch className="search-icon" />
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="企業名か証券コードを入力"
            />
            {isSuggestionsVisible && suggestions.length > 0 && (
                <ul className="suggestions-list" ref={suggestionsRef}>
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={suggestion.id}
                            className={`suggestion-item ${index === activeIndex ? 'active' : ''}`}
                            ref={index === activeIndex ? activeItemRef : null}
                        >
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

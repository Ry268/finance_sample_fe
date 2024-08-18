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
    const [activeIndex, setActiveIndex] = useState(-1); // 現在アクティブな候補のインデックス
    const [isSuggestionsVisible, setSuggestionsVisible] = useState(true); // 候補リストが表示されているかどうか
    const suggestionsRef = useRef<HTMLUListElement>(null); // 候補リスト全体の参照
    const activeItemRef = useRef<HTMLLIElement>(null); // アクティブな項目の参照

    useEffect(() => {
        if (query.length > 0) {
            fetchSearchSuggestions(query)
                .then(data => {
                    setSuggestions(data);
                    setActiveIndex(-1); // 新しい候補が表示されたらアクティブな項目をリセット
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
            // 下矢印キーを押した場合
            setActiveIndex(prevIndex => (prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex));
        } else if (e.key === 'ArrowUp') {
            // 上矢印キーを押した場合
            setActiveIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : 0)); // 一番上で固定
        } else if (e.key === 'Enter') {
            // Enterキーを押した場合
            if (activeIndex >= 0 && activeIndex < suggestions.length) {
                setQuery(suggestions[activeIndex].name); // 選択された候補を入力フィールドに設定
                setSuggestionsVisible(false);
            }
        } else if (e.key === 'Escape') {
            // Escapeキーを押した場合
            setSuggestionsVisible(false); // 候補リストを非表示にする
        }
    };

    return (
        <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
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

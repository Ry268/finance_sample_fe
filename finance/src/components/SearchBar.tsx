// src/components/SearchBar.tsx
import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    console.log(`Searching for: ${query}`);
    // ここで検索クエリを処理するコードを追加
  };

  return (
    <div className="SearchBarWrapper">
      <div className="SearchBarContainer">
        <input
          type="text"
          className="Input"
          placeholder="Search Google"
          value={query}
          onChange={handleInputChange}
        />
        <button className="Button" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;

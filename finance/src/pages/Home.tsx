import React from 'react';
import SearchBar from '../components/SearchBar';

const Home: React.FC = () => {
    const handleSearch = (query: string) => {
        console.log('Searching for:', query);
    };

    return (
        <div>
            <h1>Search</h1>
            <SearchBar onSearch={handleSearch} />
        </div>
    );
};

export default Home;

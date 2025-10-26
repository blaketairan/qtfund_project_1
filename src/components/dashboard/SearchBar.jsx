import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearchChange]);

  const handleClear = () => {
    setSearchTerm('');
    onSearchChange('');
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search by stock name or symbol..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;


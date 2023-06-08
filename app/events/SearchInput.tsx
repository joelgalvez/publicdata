'use client';
import { useState } from "react";

const SearchInput = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className='px-5 py-1 w-2/3 sm:px-5 sm-py-3 flex-1 text-zinc-200 bg-zinc-800 mt-3 rounded-full'
            placeholder='What are your looking for?'
        />
    );
};

export default SearchInput;
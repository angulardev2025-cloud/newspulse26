const Search = ({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: any }) => {

    // handle search query
    const handleSearch = (e: any) => {
        const val = e.target.value;
        if (val.startsWith(' ')) return;
        setSearchQuery(val);
    };

    return (
        <div className="w-full md:w-5/12">
            <input
                type="text"
                placeholder="Search for news"
                className="search-input"
                value={searchQuery}
                onChange={handleSearch}
            />
        </div>
    );
};

export default Search;
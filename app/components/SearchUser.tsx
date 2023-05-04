'use client';

interface RepoSearch {
    setSearchTerm: Function;
    searchTerm: string;
    setSearched: Function;
}

const SearchUser = ({setSearchTerm, searchTerm, setSearched}: RepoSearch) => {
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSearched(true);
    };

    return (
        <form onSubmit={handleSubmit} className='search-form'>
            <input
                type='text'
                className='search-input'
                placeholder='Search User...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className='search-button' type='submit'>
                Search
            </button>
        </form>
    );
};
export default SearchUser;

// All Repositories.
// search(query: $searchTerm, type: REPOSITORY, first: 10)

// All Users
// search(query: $searchTerm, type: USER, first: 10)

// User Repositories
// search(query: $searchTerm, is:owner ${query}", type: USER, first: 10)

// 1- Query
// 2- Nodes
// 3- Component
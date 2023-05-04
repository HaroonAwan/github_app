'use client';
import {useState} from 'react';
import {getClient} from '@/app/lib/client';
import {gql} from "@apollo/client";

interface RepoSearch {
    getSearchResults: Function;
    username: String;
}

const RepoSearch = ({getSearchResults, username}: RepoSearch) => {
    const [query, setQuery] = useState('');
    let token = ''
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem('token') || '';
    }


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const GET_REPOSITORIES = gql`
          query {
            search(query:"user:${username} is:owner ${query}", type: REPOSITORY, first: 10) {
              repositoryCount
              edges {
                node {
                  ... on Repository {
                    id
                    name
                    nameWithOwner
                    description
                    createdAt
                    updatedAt
                    isPrivate
                    isFork
                    owner {
                        login
                    }
                    primaryLanguage {
                        name
                        color
                    }
                    stargazers {
                        totalCount
                    }
                    watchers {
                        totalCount
                    }
                    forks {
                        totalCount
                    }
                    defaultBranchRef {
                        name
                    }
                    viewerHasStarred
                  }
                }
              }
              pageInfo {
                endCursor
                startCursor
                hasNextPage
                hasPreviousPage
              }
            }
          }
        `;

        const client = getClient(token);
        const {data} = await client.query({query: GET_REPOSITORIES});
        getSearchResults(data);
    };

    return (
        <form onSubmit={handleSubmit} className='search-form'>
            <input
                type='text'
                className='search-input'
                placeholder='Search Repository...'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{marginTop: '1rem'}}
            />
            <button className='search-button' type='submit'>
                Search
            </button>
        </form>
    );
};
export default RepoSearch;
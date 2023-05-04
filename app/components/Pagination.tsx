'use client'
import React, {useEffect, useState} from 'react';
import {gql} from "@apollo/client";
import {getClient} from "@/app/lib/client";
import SearchUser from "@/app/components/SearchUser";
import {RepositoryCard} from "@/app/components/RepositoryCard";
import {ActionIcon, Grid, Group} from "@mantine/core";
import {IconChevronLeft, IconChevronRight} from "@tabler/icons-react";
import UserCard from "@/app/components/UserCard";
import Link from "next/link";
import dynamic from "next/dynamic";

interface Pagination {
    dynamicQuery: any,
    type: string,
    handleNextQuery?: any,
    handlePrevQuery?: any,
}


const Pagination = ({dynamicQuery, type, handlePrevQuery, handleNextQuery}: Pagination) => {
    const [userPersonalRepositories, setUserPersonalRepositories] = useState([]);
    const [username, setUsername] = useState('');
    const [pageInfo, setPageInfo] = useState({} as any);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searched, setSearched] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const userNameQuery = gql`query { 
      viewer { 
        login
      }
    }`
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSearched(true);
    };
    let token = ''
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem('token') || '';
    }

    const client = getClient(token);
    const fetchData = async (query: any) => {
        const {data} = await client.query({query});
        return data;
    }

    const getUserName = async (query: any) => {
        const {data: {viewer: {login}}} = await client.query({query});
        return login;
    }
    //
    const handleNextPage = () => {
        if (pageInfo.hasNextPage) {
            let newQuery = ''
            if (type === 'repository') {
                newQuery = dynamicQuery.replace('%SEARCHTERM%', `${searchTerm ? `${searchTerm}` : ''}`).replace('%PAGINATION%', `first:9, after:"${pageInfo.endCursor}"`);
            }
            if (type === 'user') {
                newQuery = handleNextQuery.replace('%SEARCHTERM%', `"${searchTerm}"`).replace('%AFTER%', `"${pageInfo.endCursor}"`);
            }
            const query = gql`${newQuery}`
            setLoading(true)
            fetchData(query).then(data => {
                const userRepos = data.search.edges.map((edge: any) => edge.node);
                setPageInfo(data.search.pageInfo);
                setUserPersonalRepositories(userRepos);

                setLoading(false)
                setSearched(false)
            });

            setPage(1)
        }
    }

    const handlePrevPage = () => {
        if (pageInfo.hasPreviousPage) {
            let newQuery = ''
            if (type === 'repository') {
                newQuery = dynamicQuery.replace('%SEARCHTERM%', `${searchTerm ? `${searchTerm}` : ''}`).replace('%PAGINATION%', `last:9, before:"${pageInfo.startCursor}"`);
            }
            if (type === 'user') {
                newQuery = handlePrevQuery.replace('%SEARCHTERM%', `"${searchTerm}"`).replace('%BEFORE%', `"${pageInfo.startCursor}"`);
            }

            const query = gql`${newQuery}`
            setLoading(true)
            fetchData(query).then(data => {
                const userRepos = data.search.edges.map((edge: any) => edge.node);
                setPageInfo(data.search.pageInfo);
                setUserPersonalRepositories(userRepos);

                setLoading(false)
                setSearched(false)
            });

            setPage(1)
        }
    }


    useEffect(() => {
        getUserName(userNameQuery).then(r => setUsername(r));
        if (type === 'repository') {
            const newQuery = dynamicQuery.replace('%SEARCHTERM%', '').replace('%PAGINATION%', 'first: 9');
            const query = gql`${newQuery}`
            if ((type === 'repository')) {
                setLoading(true)
                fetchData(query).then(data => {
                    const userRepos = data.search.edges.map((edge: any) => edge.node);
                    setPageInfo(data.search.pageInfo);
                    setUserPersonalRepositories(userRepos);
                    setLoading(false)
                    setSearched(false)
                });
            }
        }
    }, [])

    useEffect(() => {
        let newQuery = ""
        if (type === 'repository') {
            newQuery = dynamicQuery.replace('%SEARCHTERM%', `${searchTerm}`).replace('%PAGINATION%', 'first: 9');
        }
        if (type === 'user') {
            newQuery = dynamicQuery.replace('%SEARCHTERM%', `"${searchTerm}"`);
        }

        // const newQuery = dynamicQuery.replace('%SEARCHTERM%', `"${searchTerm}"`);
        const query = gql`${newQuery}`
        if (username && searched) {
            setLoading(true)
            fetchData(query).then(data => {
                console.log('Check')
                const userRepos = data.search.edges.map((edge: any) => edge.node);
                setPageInfo(data.search.pageInfo);
                setUserPersonalRepositories(userRepos);

                setLoading(false)
                setSearched(false)
            });
        }
    }, [username, searched])

    return (
        <div>
            <form onSubmit={handleSubmit} className='search-form'>
                <input
                    type='text'
                    className='search-input'
                    placeholder={`Search ${type === 'user' ? 'Users' : 'Repositories'}...`}
                    value={searchTerm}
                    style={{marginTop: '1rem'}}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className='search-button' type='submit'>
                    Search
                </button>
            </form>
            {userPersonalRepositories.length > 0 && <ul className='repo-list'>
                {
                    type === 'repository' ?
                        userPersonalRepositories.map((item: any) => (
                            <RepositoryCard repo={item} key={item.id}/>
                        )) : <Grid>
                            {userPersonalRepositories.map((item: any) => (

                                <Grid.Col span={4} key={item.id}>
                                    <Link href={`/users/repos?username=${item.login}`}>
                                        <UserCard item={item}/>
                                    </Link>
                                </Grid.Col>
                            ))}
                        </Grid>
                }
            </ul>}
            {(pageInfo.hasPreviousPage || pageInfo.hasNextPage) &&
                <div style={{display: 'flex', justifyContent: 'center', marginTop: "3rem"}}>
                    <Group position="center">
                        <ActionIcon variant="light" onClick={handlePrevPage}
                                    disabled={!pageInfo.hasPreviousPage}><IconChevronLeft size="1rem"/></ActionIcon>
                        <ActionIcon variant="light" onClick={handleNextPage}
                                    disabled={!pageInfo.hasNextPage}><IconChevronRight size="1rem"/></ActionIcon>
                    </Group>
                </div>}
        </div>
    );
};

export default Pagination;
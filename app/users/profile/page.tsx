'use client'
import {getClient} from "@/app/lib/client";
import {gql} from "@apollo/client";
import {RepositoryCard} from "@/app/components/RepositoryCard";
import {useEffect, useState} from "react";
import {Group, Button, rem, ActionIcon} from "@mantine/core";
import {IconChevronLeft, IconChevronRight} from "@tabler/icons-react";
import Loading from "@/app/loading";
import RepoSearch from "@/app/components/SearchRepository";
import {useRouter} from "next/navigation";
import Link from "next/link";


export const revalidate = 10;


const HomePage = () => {
    const [userPersonalRepositories, setUserPersonalRepositories] = useState([]);
    const [username, setUsername] = useState('');
    const [pageInfo, setPageInfo] = useState({} as any);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);

    const userNameQuery = gql`query { 
      viewer { 
        login
      }
    }`

    let token = ''
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem('token') || '';
    }
    const client = getClient(token);
    const fetchRepos = async (query: any) => {
        const {data: repos} = await client.query({query});
        return repos;
    }

    const getUserName = async (query: any) => {
        const {data: {viewer: {login}}} = await client.query({query});
        return login;
    }

    const handleNextPage = () => {
        if (pageInfo.hasNextPage) {
            const query = gql`query {
         user(login: "${username}") {
            repositories(first: 3, after: "${pageInfo.endCursor}") {
              nodes {
                id
                name
                description
                owner {
                  login
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
                viewerHasStarred
              }
              pageInfo {
                endCursor
                startCursor
                hasNextPage
                hasPreviousPage
              }
            }
          }
        }`
            setLoading(true)
            fetchRepos(query).then(repos => {
                const userRepos = repos.user.repositories.nodes;
                setPageInfo(repos.user.repositories.pageInfo);
                setUserPersonalRepositories(userRepos);
                setLoading(false)
            });

            setPage(1)
        }
    }

    const handlePrevPage = () => {
        if (pageInfo.hasPreviousPage) {
            const query = gql`query {
         user(login: "${username}") {
            repositories(last: 3, before: "${pageInfo.startCursor}") {
              nodes {
                id
                name
                description
                owner {
                  login
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
                viewerHasStarred
              }
              pageInfo {
                endCursor
                startCursor
                hasNextPage
                hasPreviousPage
              }
            }
          }
        }`
            setLoading(true)
            fetchRepos(query).then(repos => {
                const userRepos = repos.user.repositories.nodes;
                setPageInfo(repos.user.repositories.pageInfo);
                setUserPersonalRepositories(userRepos);
                setLoading(false)
            });
            setPage(1)
        }
    }


    useEffect(() => {
        getUserName(userNameQuery).then(r => setUsername(r));

        if (typeof localStorage !== 'undefined') {
            if (!localStorage.getItem('token')) {
                useRouter().push(`/`)
            }
        }

    }, [])

    useEffect(() => {
        const query = gql`query {
         user(login: "${username}") {
            repositories(first:3) {
              nodes {
                id
                name
                description
                owner {
                  login
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
                viewerHasStarred
              }
              pageInfo {
                endCursor
                startCursor
                hasNextPage
                hasPreviousPage
              }
            }
          }
        }`
        if (username && page === 0) {
            setLoading(true)
            fetchRepos(query).then(repos => {
                const userRepos = repos.user.repositories.nodes;
                setPageInfo(repos.user.repositories.pageInfo);
                setUserPersonalRepositories(userRepos);
                setLoading(false)
            });
        }
    }, [username])

    if (loading) {
        return <Loading/>
    } else {
        return (
            <div className='repos-container'>
                <Group position="apart">
                    <h2>Repositories</h2>
                    <Link href={`/users`}>
                        <Button size="sm" variant="outline" radius="xl" style={{fontSize: rem(12)}}>Search User</Button>
                    </Link>
                </Group>
                <RepoSearch getSearchResults={(data: any) => {
                    setPageInfo(data.search.pageInfo);
                    setUserPersonalRepositories(data.search.edges.map((edge: any) => edge.node));
                }} username={username}/>
                {userPersonalRepositories.length > 0 && <ul className='repo-list'>
                    {userPersonalRepositories.map((repo: any) => (
                        <RepositoryCard repo={repo} key={repo.id}/>
                    ))}
                </ul>}
                {<div style={{display: 'flex', justifyContent: 'center'}}>
                    <Group position="center">
                        <ActionIcon variant="light" onClick={handlePrevPage}
                                    disabled={!pageInfo.hasPreviousPage}><IconChevronLeft size="1rem"/></ActionIcon>
                        <ActionIcon variant="light" onClick={handleNextPage}
                                    disabled={!pageInfo.hasNextPage}><IconChevronRight size="1rem"/></ActionIcon>
                    </Group>
                </div>}
            </div>
        );
    }
};
export default HomePage;


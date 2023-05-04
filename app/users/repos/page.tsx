'use client'
import {Group, Button, rem} from "@mantine/core";
import Link from "next/link";
import Pagination from "@/app/components/Pagination";
import SearchUser from "@/app/components/SearchUser";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {gql} from "@apollo/client";

export const revalidate = 10;

interface UserPage {
    params: any,
    searchParams: any,
}

const UserPage = ({searchParams: {username}}: UserPage) => {
    // const router = useRouter();
    useEffect(() => {
        if (typeof localStorage !== 'undefined') {
            if (!localStorage.getItem('token')) {
                useRouter().push(`/`)
            }
        }
    }, []);
    let query = `
          query {
            search(query:"%USER% %SEARCHTERM%", type: REPOSITORY, %PAGINATION%) {
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
                    viewerHasStarred
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
          }`

    if (username) {
        query = query.replace('%USER%', `user:${username} is:owner`);
    } else {
        query = query.replace('%USER%', 'is:public');
    }

    return (
        <div className='repos-container'>
            <Group position="apart">
                <h2>User Repositories</h2>
                <Link href={`/users`}>
                    <Button size="sm" variant="outline" radius="xl" style={{fontSize: rem(12)}}>Search
                        Users</Button>
                </Link>
            </Group>
            {/*<SearchUser setSearchTerm={setSearchTerm} searchTerm={searchTerm} setSearched={setSearched}/>*/}
            <Pagination dynamicQuery={query} type={'repository'}/>
        </div>
    );
};
export default UserPage;


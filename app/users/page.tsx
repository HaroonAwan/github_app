'use client'
import {Group, Button, rem} from "@mantine/core";
import Link from "next/link";
import Pagination from "@/app/components/Pagination";
import SearchUser from "@/app/components/SearchUser";
import React, {useState} from "react";
import {gql} from "@apollo/client";

export const revalidate = 10;

const UserPage = () => {
    const GET_USERS = `
          query SearchUsers {
              search(query: %SEARCHTERM%, type: USER, first: 9) {
                userCount
                edges {
                  node {
                    ... on User {
                      id
                      name
                      login
                      avatarUrl
                      bio
                      company
                      location
                      email
                      websiteUrl
                      followers {
                        totalCount
                      }
                      following {
                        totalCount
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
        }
        `;

    const handleNextQuery = `
          query SearchUsers {
              search(query: %SEARCHTERM%, type: USER, first: 9, after: %AFTER%) {
                userCount
                edges {
                  node {
                    ... on User {
                      id
                      name
                      login
                      avatarUrl
                      bio
                      company
                      location
                      email
                      websiteUrl
                      followers {
                        totalCount
                      }
                      following {
                        totalCount
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
        }
        `

    const handlePreviousQuery = `
          query SearchUsers {
              search(query: %SEARCHTERM%, type: USER, last: 9, before: %BEFORE%) {
                userCount
                edges {
                  node {
                    ... on User {
                      id
                      name
                      login
                      avatarUrl
                      bio
                      company
                      location
                      email
                      websiteUrl
                      followers {
                        totalCount
                      }
                      following {
                        totalCount
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
        }
        `

    return (
        <div className='repos-container'>
            <Group position="apart">
                <h2>Users</h2>
                <Link href={`/users/repos`}>
                    <Button size="sm" variant="outline" radius="xl" style={{fontSize: rem(12)}}>Search
                        Repositories</Button>
                </Link>
            </Group>
            {/*<SearchUser setSearchTerm={setSearchTerm} searchTerm={searchTerm} setSearched={setSearched}/>*/}
            <Pagination dynamicQuery={GET_USERS} type={'user'} handleNextQuery={handleNextQuery} handlePrevQuery={handlePreviousQuery}/>
        </div>
    );
};
export default UserPage;


'use client'
import {Card, Text, Badge, Group, Switch} from '@mantine/core';
import {FaCodeBranch, FaEye, FaStar} from "react-icons/fa";
import {useEffect, useState} from "react";
import {getClient} from "@/app/lib/client";
import {gql} from "@apollo/client";


interface RepositoryCardProps {
    repo: any;
}

export function RepositoryCard({repo}: RepositoryCardProps) {
    const [checked, setChecked] = useState(repo.viewerHasStarred);
    const [count, setCount] = useState(0);
    const [star, setStar] = useState(repo.stargazers.totalCount);

    let token = ''
    if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem('token') || '';
    }

    const client = getClient(token);

    useEffect(() => {
        async function starRepository() {
            const query = gql`mutation {
              addStar(input: {starrableId: "${repo.id}"}) {
                starrable {
                  id
                  viewerHasStarred
                }
              }
            }`;
            const {data} = await client.mutate({mutation: query});
            setStar(star + 1)
        }

        async function removeStar() {
            const query = gql`mutation {
              removeStar(input: {starrableId: "${repo.id}"}) {
                starrable {
                  id
                  viewerHasStarred
                }
              }
            }`;
            const {data} = await client.mutate({mutation: query});
            setStar(star - 1)
        }

        if (checked && count !== 0) {
            starRepository().then(r => r);
        } else if (!checked && count > 0) {
            removeStar().then(r => r);
        }
        setCount(count + 1)
    }, [checked])

    return (
        // <Link href={`/repos/${repo.name}`}>
        <Card shadow="sm" padding="lg" radius="md" withBorder mb={15} pt={6}>
            <Group position="apart" mt="md" mb="xs">
                <Text weight={500}>{repo.name}</Text>
                <Badge color="pink" variant="light">
                    <FaStar style={{marginRight: '3px'}}/> {star}
                </Badge>
            </Group>

            <Text size="sm" color="dimmed">
                {repo.description}
            </Text>

            <Group spacing="lg" mt="md">
                <Badge color="pink" variant="light">
                    <FaCodeBranch style={{marginRight: '3px'}}/> {repo.forks.totalCount}
                </Badge>

                <Badge color="pink" variant="light">
                    <FaEye style={{marginRight: '3px'}}/>{repo.watchers.totalCount}
                </Badge>
                Star<Switch checked={checked} onChange={(event) => setChecked(event.currentTarget.checked)} ml={-15}/>
            </Group>
        </Card>
        // </Link>
    );
}
import React from 'react';
import {Card, Image, Text, Badge, Button, Group} from '@mantine/core';

interface UserCardProps {
    item: any
}

const UserCard = ({item}: UserCardProps) => {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder mt={15}>
            <Card.Section>
                <Image
                    src={item.avatarUrl}
                    height={160}
                    alt="Norway"
                />
            </Card.Section>

            <Group position="apart" mt="md" mb="xs">
                <Text weight={500}>{item.name}</Text>
            </Group>

            <Text size="sm" color="dimmed">
                {item.bio}
            </Text>
        </Card>
    );
};

export default UserCard;
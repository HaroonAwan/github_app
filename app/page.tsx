'use client'
import {useForm} from '@mantine/form';
import {TextInput, Box} from '@mantine/core';
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

function HomePage() {
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            router.push(`/users/profile`)
        }
    }, []);


    const form = useForm({
        initialValues: {name: ''},

        // functions will be used to validate values at corresponding key
        validate: {
            name: (value) => {
                if (value.length === 0) {
                    return 'Access Token Cannot be empty'
                }
                if (!value.startsWith('ghp_')) {
                    return 'Invalid Access Token'
                }
                return null
            }
        },
    });


    return (
        <div className='btn-container'>
            <Box miw={500} mx="auto">
                <form onSubmit={form.onSubmit((values) => {
                    let token = ''
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem('token', values.name)
                        router.push(`/users/profile`)
                    }
                })}>
                    <TextInput py={5} mt="sm" label="Github Access Token"
                               placeholder="Github Access Token" {...form.getInputProps('name')}
                               labelProps={{style: {color: 'white'}}}/>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <button type="submit">
                            Login
                        </button>
                    </div>
                </form>
            </Box>
        </div>
    );
}

export default HomePage;
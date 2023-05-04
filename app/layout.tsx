import {Poppins} from 'next/font/google';
import Header from './components/Header';
import RootStyleRegistry from "@/app/lib/Mantine";
import './globals.css';
import React from "react";

interface RootLayoutProps {
    children: React.ReactNode;
}

const poppins = Poppins({
    weight: ['400', '700'],
    subsets: ['latin'],
});

export const metadata = {
    title: 'Github Profile',
    description: 'Details about Github Repositories',
    keywords:
        'github, profile, repositories'
};

export default function RootLayout({children}: RootLayoutProps) {
    return (
        <html lang='en'>
        <body className={poppins.className}>
        <Header/>
        <RootStyleRegistry>{children}</RootStyleRegistry>
        </body>
        </html>
    );
}

import Link from 'next/link';

const Header = () => {
    return (
        <header className='header'>
            <div className='container'>
                <div className='logo'>
                    <Link href='/'>GitHub Repositories</Link>
                </div>
            </div>
        </header>
    );
};
export default Header;

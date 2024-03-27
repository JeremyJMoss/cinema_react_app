import { Link, Outlet } from "react-router-dom"
import Login from "../components/Auth/Login";
import { useAuth } from '../context/AuthContext';
import mosscinema_logo from "../assets/moss_cinema_logo.svg";
import hamburger_icon from "../assets/icons8-hamburger-menu.svg";
import Button from "../components/UI/Buttons/Button";
import { useState } from "react";

const Root = () => {
    const { showLoginModal, toggleLoginModal, logout, token, user } = useAuth();
    const [hamburgerMenuHidden, setHamburgerMenuHidden] = useState(true);

    const toggleMenu = () => {
        setHamburgerMenuHidden(prev => !prev)
    }

    const handleClickLoginInHamburger = () => {
        toggleLoginModal();
        setHamburgerMenuHidden(prev => !prev);
    }

    return (
        <>
            <header className="flex w-full justify-between items-center px-3 md:px-10 py-5">
                <div>
                    <Link to="/">
                        <img className="md:w-40 w-28" alt="Moss Cinema logo" src={mosscinema_logo} />
                    </Link>
                </div>
                <button onClick={toggleMenu} className='inline-block sm:hidden'>
                    <img src={hamburger_icon} className="w-10" alt=""/>
                </button>
                <menu className="hidden sm:flex items-center ">
                    {user && user.isAdmin && <Link to="/admin" className="decoration-none text-lg md:text-xl mr-11 text-black-800 font-medium">Admin</Link>}
                    {!token && !user && 
                    <Button 
                    onClick={toggleLoginModal}
                    colorStyling='primary'
                    type='button'
                    size='medium'>
                        Log In
                    </Button>}
                    {token && user && 
                    <Button 
                    onClick={logout}
                    colorStyling='primary'
                    type='button'
                    size="medium">
                        Logout
                    </Button>}
                </menu>
                <div className={`absolute w-full h-full top-0 right-0 bg-stone-900/90 sm:hidden ${hamburgerMenuHidden ? 'hidden' : 'block'}`} onClick={toggleMenu}>
                    <menu onClick={(e) => e.stopPropagation()} className="absolute top-0 right-0 px-8 py-6 bg-green-200 h-full flex-col flex">
                        {user && user.isAdmin && <Link to="/admin" className="decoration-none text-lg md:text-xl text-black-800 font-medium">Admin</Link>}
                        {!token && !user && <div role="button" className="text-lg md:text-xl text-black-800 font-medium" onClick={handleClickLoginInHamburger}>Login</div>}
                    </menu>
                </div>
            </header>
            {showLoginModal && <Login setModalClose={toggleLoginModal}/>}
            <main className="px-3 md:px-8 py-4">
                <Outlet/>
            </main>
        </>
    )
}

export default Root
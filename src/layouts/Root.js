import { Link, Outlet } from "react-router-dom"
import Login from "../components/Login/Login";
import {useState} from 'react';
import flickfind_logo from "../assets/flick_and_find_white.svg";

const Root = () => {
    const [loginModalOpened, setLoginModalOpened] = useState(false);

    const handleModalOpen = () => {
        setLoginModalOpened(true);
    }

    return (
        <>
            <header className="top-nav">
                <div>
                    <Link to="/">
                        <img width="120px" src={flickfind_logo} />
                    </Link>
                </div>
                <div className="d-flex align-items-center">
                    <nav>
                        <Link to="/admin">Admin</Link>
                    </nav>
                    <button className="btn btn-small btn-accent" onClick={handleModalOpen}>Sign In</button>
                </div>
            </header>
            {loginModalOpened && <Login setModalClose={setLoginModalOpened}/>}
            <Outlet/>
        </>
    )
}

export default Root
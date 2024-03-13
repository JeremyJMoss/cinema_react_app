import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import homeIcon from "../assets/icons8-home.png";
import userIcon from "../assets/icons8-user.png";
import movieIcon from "../assets/icons8-movie.png";
import theatreIcon from "../assets/icons8-cinema.png";
import sessionIcon from "../assets/icons8-session.png";
import AdminLink from '../components/Admin/AdminLink';
import Button from '../components/UI/Buttons/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import hamburger_icon from "../assets/icons8-hamburger-menu.svg";

const AdminRoot = () => {
  const {user} = useAuth();
  const navigate = useNavigate();
  const [ asideOpen, setAsideOpen ] = useState(false);

  useEffect(() => {
    if (user && !user.isAdmin){
      navigate('/');
    }
  }, [user, navigate])
  
  const handleToggleAside = () => {
    setAsideOpen(prev => !prev);
  }

  return (
    <>
    {user?.isAdmin && 
      <>
        <header className="sm:hidden px-4 py-6 top-0 left-0 w-full bg-slate-100">
          <button onClick={handleToggleAside}>
              <img src={hamburger_icon} className="w-6" alt=""/>
          </button>
        </header>
        <div className="w-full flex">
          <aside className={`bg-green-200 fixed z-10 top-0 left-0 gap-6 sm:flex flex-col px-4 py-6 h-full w-40 ${asideOpen ? 'flex' : 'hidden'}`}>
            {asideOpen &&
              <button className="sm:hidden flex items-center" onClick={handleToggleAside}>
                <img src={hamburger_icon} className="w-6" alt=""/>
              </button>
            }
            <AdminLink
            label="Home"
            href="/"
            icon={homeIcon}/>
            <AdminLink
            label="Movies"
            href="/admin/movies"
            icon={movieIcon}
            />
            <AdminLink
            label="Sessions"
            icon={sessionIcon}
            href="/admin/sessions"/>
            <AdminLink
            label="Theatres"
            icon={theatreIcon}
            href="/admin/theatres"
            />
            <AdminLink
            label="Users"
            icon={userIcon}
            href="/admin/users"/>
          </aside>
          <main className='min-h-screen grow sm:ml-40 bg-slate-100'>
            <Outlet/>
          </main>
        </div>
      </>
    }
    {!user &&
      <div className='flex flex-col gap-3 items-center justify-center h-full'>
        <p>Please Log In as administrator to access admin panel!</p>
        <Button onClick={() => navigate('/')}>
          Home Page
        </Button>
      </div>
    }
    </>
  )
}

export default AdminRoot
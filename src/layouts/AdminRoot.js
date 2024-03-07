import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import homeIcon from "../assets/icons8-home.png";
import userIcon from "../assets/icons8-user.png";
import movieIcon from "../assets/icons8-movie.png";
import cinemaIcon from "../assets/icons8-cinema.png";
import sessionIcon from "../assets/icons8-session.png";
import AdminLink from '../components/Admin/AdminLink';
import Button from '../components/UI/Buttons/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AdminRoot = () => {
  const {user} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !user.isAdmin){
      navigate('/');
    }
  }, [user, navigate])
  
  
  return (
    <>
    {user?.isAdmin && 
      <div className="w-full grow min-h-full flex">
        <aside className='bg-green-200 fixed top-0 left-0 gap-6 hidden sm:flex flex-col px-4 py-6 h-full w-40'>
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
          label="Cinemas"
          href="/admin/cinemas"
          icon={cinemaIcon}
          />
          <AdminLink
          label="Users"
          icon={userIcon}
          href="/admin/users"/>
        </aside>
        <main className='grow sm:ml-40 bg-slate-100'>
          <Outlet/>
        </main>
      </div>
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
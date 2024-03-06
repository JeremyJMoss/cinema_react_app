import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import homeIcon from "../assets/icons8-home.png";
import userIcon from "../assets/icons8-user.png";
import movieIcon from "../assets/icons8-movie.png";
import cinemaIcon from "../assets/icons8-cinema.png";
import AdminLink from '../components/Admin/AdminLink';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AdminRoot = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!(user && user.isAdmin)){
      navigate('/');
    }
  }, [user, navigate])
  
  
  return (
    <>
      <div className="w-full h-full flex">
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
          label="Cinemas"
          href="/admin/cinemas"
          icon={cinemaIcon}
          />
          <AdminLink
          label="Users"
          icon={userIcon}
          href="/admin/users"/>
        </aside>
        {user?.isAdmin && 
        <main className='grow sm:ml-40'>
          <Outlet/>
        </main>}
      </div>
    </>
  )
}

export default AdminRoot
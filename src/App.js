import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Root from "./layouts/Root";
import Home from "./components/FrontPages/Home";
import AdminRoot from "./layouts/AdminRoot";
import AdminDashboard from './components/Admin/AdminDashboard';
import Users from './components/Admin/Users/Users';
import Signup from './components/Auth/Signup';
import { AuthProvider } from './context/AuthContext';
import EditUser from './components/Admin/Users/EditUser';
import NewUser from './components/Admin/Users/NewUser';
import Movies from './components/Admin/Movies/Movies';
import NewMovie from './components/Admin/Movies/NewMovie';
import EditMovie from './components/Admin/Movies/EditMovie';
import SingleMovie from './components/FrontPages/SingleMovie';
import Cinemas from './components/Admin/Cinemas/Cinemas';
import EditCinema from './components/Admin/Cinemas/EditCinema';
import Theatres from './components/Admin/Cinemas/Theatres';

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements([
        <Route path="/" element={<Root />}>
          <Route index element={<Home/>} />
          <Route path="signup" element={<Signup/>}/>
          <Route path="movies/:id" element={<SingleMovie/>}/>
        </Route>,
        <Route path="/admin" element={<AdminRoot />} >
          <Route index element={<AdminDashboard/>}/>
          <Route path="users">
            <Route index element={<Users/>}/>
            <Route path="new" element={<NewUser/>}/>
            <Route path="edit/:id" element={<EditUser/>}/>
          </Route>
          <Route path='movies'>
            <Route index element={<Movies/>}/>
            <Route path="new" element={<NewMovie/>}/>
            <Route path="edit/:id" element={<EditMovie/>}/>
          </Route>
          <Route path='cinemas'>
            <Route index element={<Cinemas/>}/>
            <Route path="edit/:id" element={<EditCinema/>}/>
            <Route path=":id/theatres" element={<Theatres/>}/>
          </Route>
        </Route>
    ])
  );

  
  return (
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  );
}

export default App;

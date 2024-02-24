import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Root from "./layouts/Root";
import Home from "./components/Home/Home";
import AdminRoot from "./layouts/AdminRoot";
import AdminArea from './components/Admin/AdminArea';
import Users from './components/Admin/Users/Users';
import Signup from './components/Auth/Signup';
import { AuthProvider } from './context/AuthContext';
import EditUser from './components/Admin/Users/EditUser';
import NewUser from './components/Admin/Users/NewUser';
import Movies from './components/Admin/Movies/Movies';
import NewMovie from './components/Admin/Movies/NewMovie';
import EditMovie from './components/Admin/Movies/EditMovie';

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements([
        <Route path="/" element={<Root />}>
          <Route index element={<Home/>} />
          <Route path="signup" element={<Signup/>}/>
        </Route>,
        <Route path="/admin" element={<AdminRoot />} >
          <Route index element={<AdminArea/>}/>
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

import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Root from "./layouts/Root";
import Home from "./components/FrontPages/Home";
import AdminRoot from "./layouts/AdminRoot";
import AdminDashboard from './components/Admin/AdminDashboard';
import Users from './components/Admin/Users/Users';
import Signup from './components/Auth/Signup';
import EditUser from './components/Admin/Users/EditUser';
import NewUser from './components/Admin/Users/NewUser';
import Movies from './components/Admin/Movies/Movies';
import NewMovie from './components/Admin/Movies/NewMovie';
import EditMovie from './components/Admin/Movies/EditMovie';
import SingleMovie from './components/FrontPages/SingleMovie';
import Theatres from './components/Admin/Theatres/Theatres';
import NewSession from './components/Admin/Sessions/NewSession';
import Sessions from "./components/Admin/Sessions/Sessions";
import EditTheatre from './components/Admin/Theatres/EditTheatre';
import NewTheatre from './components/Admin/Theatres/NewTheatre';
import OrderProcess from './components/FrontPages/OrderProcess';

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements([
        <Route path="/" element={<Root />}>
          <Route index element={<Home/>} />
          <Route path="signup" element={<Signup/>}/>
          <Route path="movies/:id">
            <Route index element={<SingleMovie/>} />
            <Route path="order" element={<OrderProcess/>}/>
          </Route>
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
          <Route path="theatres">
            <Route index element={<Theatres/>}/>
            <Route path="edit/:id" element={<EditTheatre/>}/>
            <Route path="new" element={<NewTheatre/>}/>
          </Route>
          <Route path="sessions">
            <Route index element={<Sessions/>}/>
            <Route path="new" element={<NewSession/>}/>
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

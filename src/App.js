import './App.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Root from "./layouts/Root";
import Home from "./components/Home/Home";
import AdminRoot from "./layouts/AdminRoot";
import AdminArea from './components/Admin/AdminArea';
import Users from './components/Admin/Users';

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements([
        <Route path="/" element={<Root />}>
          <Route index element={<Home/>} />
        </Route>,
        <Route path="/admin" element={<AdminRoot />} >
          <Route index element={<AdminArea/>}/>
          <Route path="users" element={<Users/>}/>
        </Route>
    ])
  );

  
  return (
    <RouterProvider router={router}/>
  );
}

export default App;

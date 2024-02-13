import React from 'react';
import { Outlet, Link } from 'react-router-dom';


const AdminRoot = () => {
  return (
    <div className="admin-grid">
      <aside>
        <Link to="/admin/users">Users</Link>
      </aside>
      <main>
        <Outlet/>
      </main>
    </div>
  )
}

export default AdminRoot
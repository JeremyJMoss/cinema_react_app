import React, { useCallback, useState } from 'react';
import { BASE_URL } from '../../../config/constants';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../UI/Buttons/Button';
import AdminField from '../AdminField';
import { Link, useNavigate } from 'react-router-dom';
import DeleteModal from './DeleteModal';
import ErrorMessage from '../../UI/ErrorMessage';
import { useFetch } from '../../../hooks/useFetch';
import { request } from '../../../util/http';

const Users = () => {
  const [deleteModalId, setDeleteModalId] = useState(null);
  const {token, logout} = useAuth();
  const navigate = useNavigate();

  const sendFetch = useCallback(async () => {
      return await request(`${BASE_URL}/users`,
      logout, 
      {'Authorization': `Bearer ${token}`})
    }, [logout, token])

  const {
    isFetching, 
    data: users, 
    setData: setUsers, 
    errMessage
  } = useFetch(sendFetch, [])

  const handleDeleteModal = (id) => {
    setDeleteModalId(id);
  }

  const handleDelete = (id) => {
    setDeleteModalId(null);
    setUsers(prev => prev.filter((user) => user.id !== id));
  }

  return (
    <div className="h-full w-full p-5 sm:p-10 relative bg-gray-100">
      {deleteModalId && 
      <DeleteModal
      deleteId={deleteModalId}
      setDeleteId={setDeleteModalId}
      onDelete={handleDelete}
      baseRoute='/user'/>}
      {errMessage &&
      <ErrorMessage
      message={errMessage}/>}
      <div className="flex gap-2 items-center mb-8">
        <h2 className="text-2xl font-bold mr-6">Users</h2>
        <Button
        type="button"
        colorStyling='primary'
        onClick={() => navigate('/admin/users/new')}
        >
          Add New
        </Button>
      </div>
      {isFetching && <div>Loading...</div>}
      {!errMessage && !isFetching && users?.length > 0 &&
      <>
        <section className="grid grid-cols-1 md:hidden gap-5">
          {users.map((user) => {
            return (
              <div key={user.id} className="bg-white shadow-xl text-black-800 rounded-lg flex">
                <div className="p-5 flex flex-col grow">
                  <AdminField
                  label="Email"
                  data={user.email}/>
                  <div className='flex items-start sm:items-end justify-between p-2 mt-2 grow flex-col sm:flex-row'>
                    <div className="gap-5 flex">
                      <Link to={`/admin/users/edit/${user.id}`} className='bg-blue-200 shadow-md py-2 px-7 font-medium text-black-800 rounded text-center'>
                        Edit
                      </Link>
                      <button onClick={() => handleDeleteModal(user.id)} className='bg-orange-200 shadow-md py-2 px-7 font-medium text-neutral-950 rounded'>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </section>
        <table className="border-2 rounded-md hidden md:table bg-white">
          <thead>
            <tr className="text-left">
              <th className="font-medium px-5 py-3">Id</th>
              <th className='hidden lg:block font-medium px-5 py-3'>Name</th>
              <th className="font-medium px-5 py-3">Email</th>
              <th className="font-medium px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              return (
                <tr key={user.id} className={index % 2 === 0 ? "bg-slate-100" : null}>
                  <td className="px-5 py-3">{user.id}</td>
                  <td className="px-5 py-3 hidden lg:block">{user.first_name} {user.last_name}</td>
                  <td className="px-5 py-3">{user.email}</td>
                  <td className='flex gap-3 px-5 py-3'>
                    <Link to={`/admin/users/edit/${user.id}`} className='bg-blue-200 shadow-md py-2 px-7 font-medium text-black-800 rounded text-center'>
                      Edit
                    </Link>
                    <button onClick={() => handleDeleteModal(user.id)} className='bg-orange-200 shadow-md py-2 px-7 font-medium text-neutral-950 rounded'>
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </>}
    </div>
  )
}

export default Users
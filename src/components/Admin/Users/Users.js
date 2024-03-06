import { useCallback, useState } from 'react';
import { BASE_URL } from '../../../config/constants';
import { useAuth } from '../../../context/AuthContext';
import ArchiveHead from '../ArchiveHead';
import { useFetch } from '../../../hooks/useFetch';
import { request } from '../../../util/http';
import ArchiveCards from '../ArchiveCards';
import { toTitleCase } from '../../../util/util';
import ArchiveTable from '../ArchiveTable';

const Users = () => {
  const [deleteModalId, setDeleteModalId] = useState(null);
  const {token, logout} = useAuth();

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
    setUsers(prev => {
      return prev.filter((user) => {
        return user.id !== id; 
      })
    });
  }

  return (
    <div className="min-h-full w-full p-5 sm:p-10 relative bg-gray-100">
      <ArchiveHead
      deleteModalId={deleteModalId}
      setDeleteModalId={setDeleteModalId}
      title="Users"
      newLink='/admin/users/new'
      handleDelete={handleDelete}
      errMessage={errMessage}
      baseRoute='/user'
      isFetching={isFetching}/>
      {!errMessage && !isFetching && users?.length > 0 &&
      <>
        <ArchiveCards
        information={users.map((user) => {
          return {
            id: user.id,
            data: user.email,
          }
        })}
        label="Email"
        onHandleDeleteModal={handleDeleteModal}/>
        <ArchiveTable
        information={{
          labels: [
            'Name',
            'Email',
            'Role'
          ],
          data: users.map(user => {
            return {
              id: user.id,
              fields: [
              `${user.first_name} ${user.last_name}`,
              user.email,
              toTitleCase(user.role)
            ]
          }
          })
        }}
        onHandleDeleteModal={handleDeleteModal}
        editBaseRoute='/users'
        />
      </>}
    </div>
  )
}

export default Users
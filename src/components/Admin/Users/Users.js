import { useCallback, useState } from 'react';
import { BASE_URL } from '../../../config/constants';
import { useAuth } from '../../../context/AuthContext';
import ArchiveHead from '../ArchiveHead';
import { useFetch } from '../../../hooks/useFetch';
import { request } from '../../../util/http';
import { toTitleCase } from '../../../util/util';
import ArchiveTable from '../ArchiveTable';

const Users = () => {
  const [deleteId, setDeleteId] = useState(null);
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
    setDeleteId(id);
  }

  const handleDelete = () => {
    setDeleteId(null);
    setUsers(prev => {
      return prev.filter((user) => {
        return user.id !== deleteId; 
      })
    });
  }

  const outputDeleteText = (entityToDelete) => {
    return `Are you sure you wish to delete ${entityToDelete.first_name} ${entityToDelete.last_name} with email ${entityToDelete.email}?`;
  }

  return (
    <div className="min-h-full w-full p-5 sm:p-10 relative">
      <ArchiveHead
      deleteModalId={deleteId}
      setDeleteModalId={setDeleteId}
      title="Users"
      newLink='/admin/users/new'
      handleDelete={handleDelete}
      errMessage={errMessage}
      deleteUrl={`${BASE_URL}/user/${deleteId}`}
      outputDeleteText={outputDeleteText}
      isFetching={isFetching}/>
      {!errMessage && !isFetching && users?.length > 0 &&
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
        />}
    </div>
  )
}

export default Users
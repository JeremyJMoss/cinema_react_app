import ArchiveHead from "../ArchiveHead"
import { useCallback, useState } from 'react';
import { BASE_URL } from '../../../config/constants';
import { useAuth } from '../../../context/AuthContext';
import { useFetch } from '../../../hooks/useFetch';
import { request } from '../../../util/http';
import ArchiveCards from "../ArchiveCards";
import ArchiveTable from "../ArchiveTable";

const Cinemas = () => {
    const [deleteModalId, setDeleteModalId] = useState(null);
    const {token, logout} = useAuth();

    const sendFetch = useCallback(async () => {
        return await request(`${BASE_URL}/cinemas`,
        logout, 
        {'Authorization': `Bearer ${token}`})
        }, [logout, token])

    const {
        isFetching, 
        data: cinemas, 
        setData: setCinemas, 
        errMessage
    } = useFetch(sendFetch, [])

    const handleDeleteModal = (id) => {
        setDeleteModalId(id);
    }

    const handleDelete = (id) => {
        setDeleteModalId(null);
        setCinemas(prev => {
        return prev.filter((cinema) => {
            return cinema.id !== id; 
        })
        });
    }

    return (
        <div className="min-h-full w-full p-5 sm:p-10 relative bg-gray-100">
            <ArchiveHead
            deleteModalId={deleteModalId}
            setDeleteModalId={setDeleteModalId}
            title="Cinemas"
            newLink='/admin/cinemas/new'
            handleDelete={handleDelete}
            errMessage={errMessage}
            baseRoute='/cinema'
            isFetching={isFetching}/>
            {!errMessage && !isFetching && cinemas?.length > 0 &&
            <>
            <ArchiveCards
            information={cinemas.map((cinema) => {
            return {
                id: cinema.id,
                data: cinema.name,
            }
            })}
            label="Name"
            onHandleDeleteModal={handleDeleteModal}
            editBaseRoute='/cinemas'/>
            <ArchiveTable
            information={{
            labels: [
                "Name",
                "Address"
            ],
            data: cinemas.map((cinema => {
                return {
                id: cinema.id,
                fields: [
                    cinema.name,
                    cinema.address
                ]
                }
            }))
            }}
            onHandleDeleteModal={handleDeleteModal}
            editBaseRoute='/cinemas'
            />
            </>}
        </div>
    )
}

export default Cinemas
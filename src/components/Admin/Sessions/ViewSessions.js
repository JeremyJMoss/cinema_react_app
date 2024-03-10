import { useParams } from "react-router-dom";
import TabularNav from "../../UI/TabularNav";
import ArchiveHead from "../ArchiveHead";
import { useFetch } from "../../../hooks/useFetch";
import { useCallback, useState } from "react";
import { request } from "../../../util/http";
import { BASE_URL } from "../../../config/constants";

const ViewSessions = () => {
    const { cinema_id, theatre_id } = useParams();
    const [deleteModalId, setDeleteModalId] = useState(null);

    const sendFetch = useCallback(
        async () => await request(`${BASE_URL}/sessions?theatre_id=${theatre_id}`, 
        null, 
        {}
    ), [])

    const { 
        isFetching, 
        data: sessions,
        setData: setSessions, 
        errMessage 
    } = useFetch(sendFetch,[])

    const handleDelete = (id) => {
        setDeleteModalId(null);
        setSessions(prev => {
            return prev.filter((session) => session.id !== id)
        });
    }

    const handleDeleteModal = (id) => {
        setDeleteModalId(id);
    }

    return (
        <>
            <TabularNav
            links={[
                {
                    text: 'Cinema',
                    to: `/admin/cinemas/edit/${cinema_id}`
                },
                {
                    text: 'Theatres',
                    to: `/admin/cinemas/${cinema_id}/theatres`
                },
                {
                    text: 'Sessions',
                    to: `/admin/cinemas/${cinema_id}/sessions/${theatre_id}/view`
                }
            ]}/>
            <div className="min-h-full h-auto w-full p-5 sm:p-10 relative">
                <ArchiveHead
                deleteModalId={deleteModalId}
                setDeleteModalId={setDeleteModalId}
                title="Sessions"
                handleDelete={handleDelete}
                errMessage={errMessage}
                baseRoute='/sessions'
                isFetching={isFetching}/>
                {!errMessage && !isFetching && sessions.length > 0 &&
                <section className="flex flex-wrap justify-between gap-6">
                </section>
                }
            </div>
        </>
    )
}

export default ViewSessions
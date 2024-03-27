import { useState, useEffect } from "react";
import { BASE_URL} from "../../../config/constants";
import { request } from "../../../util/http";
import ArchiveHead from "../ArchiveHead";
import ArchiveTable from "../ArchiveTable";

const Theatres = () => {
    const [theatres, setTheatres] = useState([]);
    const [fetchErrorMessage, setFetchErrMessage] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        const fetchTheatres = async () => {
            try {
                setIsFetching(true);
                const response = await request(`${BASE_URL}/theatres`,
                null,
                {})
                setTheatres(response);
                setFetchErrMessage('');
            }
            catch (error) {
                setFetchErrMessage(error.message);
            }
            finally {
                setIsFetching(false);
            }
        }

        fetchTheatres();
    }, [])

    const handleDelete = (id) => {
        setDeleteId(null);
        setTheatres(prev => prev.filter((theatre) => theatre.id !== id));
      }
    
      const handleDeleteModal = (id) => {
        setDeleteId(id);
      }
    
      const outputDeleteText = (entityToDelete) => {
        return `Are you sure you wish to delete Theatre ${entityToDelete.number}?`;
      }

    return (
        <div className="p-5 sm:p-10">
            <ArchiveHead
            newLink="/admin/theatres/new"
            title="Theatres"
            isFetching={isFetching}
            errMessage={fetchErrorMessage}
            deleteModalId={deleteId}
            setDeleteModalId={setDeleteId}
            handleDelete={handleDelete}
            outputDeleteText={outputDeleteText}
            deleteUrl={`${BASE_URL}/theatre/${deleteId}`}/>
            {theatres.length > 0 &&
            <ArchiveTable
            information={{
                labels: [
                    "Theatre",
                    "Theatre Type",
                    "Seats"
                ],
                data: theatres.map((theatre => {
                    return {
                        id: theatre.id,
                        fields: [
                            theatre.number,
                            theatre.type,
                            theatre.seats
                        ]
                    }
                }))
            }}
            editBaseRoute={"/theatres"}
            onHandleDeleteModal={handleDeleteModal}
            />
            }
            {theatres.length === 0 && 
            <div className="flex justify-center">
                <p className="font-medium">No Theatres Found!</p>
            </div>}
        </div>
    )
}

export default Theatres
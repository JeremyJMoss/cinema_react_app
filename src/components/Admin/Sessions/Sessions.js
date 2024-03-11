import TabularNav from "../../UI/TabularNav";
import { useCallback, useState } from "react";
import { request } from "../../../util/http";
import { BASE_URL } from "../../../config/constants";
import DatePicker from "react-datepicker";
import ArchiveTable from "../ArchiveTable";
import ArchiveHead from "../ArchiveHead";

import "react-datepicker/dist/react-datepicker.css";
import { useFetch } from "../../../hooks/useFetch";

const Sessions = () => {
    const [ selectedSessionDate, setSelectedSessionDate ] = useState(null);
    const [ deleteId, setDeleteId ] = useState(null);
    const [ hasFetched, setHasFetched ] = useState(false);

    const sendFetch = useCallback(async () => {
        return await request(`${BASE_URL}/sessions?with_movies=true`,
                    null,
                    {}
                )
    }, [])

    const {
        data: sessions,
        setData: setSessions,
        errMessage,
        isFetching
    } = useFetch(sendFetch, [])

    const handleChangeDate = (date) => {
        setSelectedSessionDate(date);
    }

    const handleDelete = () => {
        setDeleteId(null);
        setSessions(prev => {
            return prev.filter((session) => {
                return session.id !== deleteId;
            })
        });
    }

    const handleDeleteModal = (id) => {
        setDeleteId(id);
    }

    const outputDeleteText = (entityToDelete) => {
        const session_date = entityToDelete.session_start_date.split('-').reverse().join('/');
        const session_time = entityToDelete.session_start_time;
        return `Are you sure you wish to delete session starting on ${session_date} at ${session_time}?`;
    }

    return (
        <>
            <TabularNav
            links={[
                {
                    text: 'Sessions',
                    to: `/admin/sessions`
                },

            ]}/>
            <div className="min-h-full h-auto p-5 sm:p-10">
                <ArchiveHead
                title="Sessions"
                deleteModalId={deleteId}
                setDeleteModalId={setDeleteId}
                handleDelete={handleDelete}
                newLink="/admin/sessions/new"
                deleteUrl={`${BASE_URL}/session/${deleteId}`}
                errMessage={errMessage}
                outputDeleteText={outputDeleteText}
                />
                {/* TODO sort out session_date filter */}
                {/* <form className="mb-3">
                    <div className='flex grow flex-col max-w-lg'>
                        <label 
                        className="mb-3 sm:text-lg" 
                        htmlFor="session_date"
                        >
                            Session Date <span className="text-red-500">*</span>
                        </label>
                        <DatePicker
                        id="session_date"
                        minDate={new Date()}
                        placeholderText="Select session date"
                        withPortal
                        portalId="body"
                        selected={selectedSessionDate}
                        onChange={handleChangeDate}
                        dateFormat="dd/MM/yyyy"
                        />
                    </div>
                </form> */}
                {sessions.length > 0 &&
                    <ArchiveTable
                    information={{
                        labels: [
                            "Movie Title",
                            "Theatre",
                            "Available Seats",
                            "Start Time",
                            "End Time",
                        ],
                        data: sessions.map((session => {
                            return {
                                id: session.id,
                                fields: [
                                    session.movie.title,
                                    session.theatre.number,
                                    `${session.theatre.seats - session.seats_sold}/${session.theatre.seats}`,
                                    session.session_start_date.split('-').reverse().join('/') + ' ' + session.session_start_time,
                                    session.session_end_date.split('-').reverse().join('/') + ' ' + session.session_end_time
                                ]
                            }
                        }))
                    }}
                    onHandleDeleteModal={handleDeleteModal}
                    /> 
                }

            </div>
        </>
    )
}

export default Sessions
import { useEffect, useState } from "react";
import { request } from "../../../util/http";
import { BASE_URL } from "../../../config/constants";
import DatePicker from "react-datepicker";
import ArchiveTable from "../ArchiveTable";
import ArchiveHead from "../ArchiveHead";

import "react-datepicker/dist/react-datepicker.css";

const Sessions = () => {
    const [ selectedSessionDate, setSelectedSessionDate ] = useState(null);
    const [ deleteId, setDeleteId ] = useState(null);
    const [ isFetching, setIsFetching ] = useState(false);
    const [ sessions, setSessions ] = useState([])
    const [ errMessage, setErrMessage ] = useState('');

    useEffect(() => {
        const sendFetch = async () => {
            try {
                setIsFetching(true);
                const response = await request(
                    `${BASE_URL}/sessions?with_movies=true`,
                    null,
                    {}
                );
                setIsFetching(false);
                setErrMessage('');
                setSessions(response);
            }
            catch (error) {
                setIsFetching(false);
                setErrMessage(error.message);
            }
        }

        sendFetch()
    }, [request])


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

    const handleClick = async (timeline) => {
        try {
            setIsFetching(true);
            const response = await request(
                `${BASE_URL}/sessions?with_movies=true${timeline && `&era=${timeline}`}`,
                null,
                {}
            )

            setErrMessage('');
            setIsFetching(false);
            setSessions(response);
        }
        catch (error) {
            setIsFetching(false);
            setErrMessage(error.message);
        }

        
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
        <div className="p-5 sm:p-10">
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
            <ul className="pb-3 flex pl-3 gap-5 font-semibold">
                <li role="button" onClick={() => handleClick()}>
                    All
                </li>
                <li role="button" onClick={() => handleClick('future')}>
                    Upcoming
                </li>
                <li role="button" onClick={() => handleClick('past')}>
                    Past
                </li>
            </ul>
            {/* TODO sort out session_date filter
            <form className="mb-3">
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
            {sessions.length > 0 && !isFetching &&
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
            {sessions.length === 0 && !isFetching && 
                <div className="w-full flex justify-center">
                    <p className="font-bold text-lg">No Sessions Found!</p>
                </div>
            }
        </div>
    )
}

export default Sessions
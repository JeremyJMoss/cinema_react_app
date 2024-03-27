import { useEffect, useState } from "react";
import { request } from "../../../util/http";
import { BASE_URL } from "../../../config/constants";
import ArchiveTable from "../ArchiveTable";
import ArchiveHead from "../ArchiveHead";

import "react-datepicker/dist/react-datepicker.css";

const Sessions = () => {
    const [ deleteId, setDeleteId ] = useState(null);
    const [ isFetching, setIsFetching ] = useState(false);
    const [ sessions, setSessions ] = useState([])
    const [ errMessage, setErrMessage ] = useState('');
    const [ activeLink, setActiveLink ] = useState('');

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
    }, [])

    const handleDelete = () => {
        setDeleteId(null);
        setSessions(prev => {
            return prev.filter((session) => {
                return session.id !== deleteId;
            })
        });
    }

    const handleClick = async (timeline) => {
        setActiveLink(timeline);
        try {
            setIsFetching(true);
            const response = await request(
                `${BASE_URL}/sessions?with_movies=true${timeline && `&timeline=${timeline}`}`,
                null,
                {}
            )

            setErrMessage('');
            setSessions(response);
        }
        catch (error) {
            setErrMessage(error.message);
        }
        finally {
            setIsFetching(false)
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
                <li role="button" className={activeLink === '' && 'border-b-4 border-orange-200'} onClick={() => handleClick('')}>
                    All
                </li>
                <li role="button" className={activeLink === 'future' && 'border-b-4 border-orange-200'} onClick={() => handleClick('future')}>
                    Upcoming
                </li>
                <li role="button" className={activeLink === 'past' && 'border-b-4 border-orange-200'} onClick={() => handleClick('past')}>
                    Past
                </li>
            </ul>
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
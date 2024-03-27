import { convertTo12Hour, formatDate } from "../../util/util";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../config/constants";
import { request } from "../../util/http";
import { useNavigate } from "react-router-dom";

function MovieSessions({id}) {
    const navigate = useNavigate();
    const [ weekDates, setWeekDates ] = useState([]);
    const [ sessionDate, setSessionDate ] = useState(new Date());
    const [ sessions, setSessions ] = useState([]);
    const [ isFetchingSessions, setIsFetchingSessions ] = useState(false);
    const [ sessionErrMessage, setSessionErrMessage ] = useState('');

    useEffect(() => {
        const sendFetch = async () => {
            try {
                setIsFetchingSessions(true);
                const response = await request(
                    `${BASE_URL}/sessions?movie_id=${id}&session_date=${formatDate(sessionDate)}`,
                    null,
                    {}
                )
                setSessionErrMessage('');
                setSessions(response);
            } 
            catch (error) {
                setSessionErrMessage(error.message);
            }
            finally {
                setIsFetchingSessions(false);
            }
        }

        sendFetch();
    }, [id, sessionDate])

    useEffect(() => {
        function getDatesForWeek() {
            const dateArray = [];
            const currentDate = new Date();

            for (let i = 0; i < 7; i++) {
                dateArray.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }

            return dateArray;
        }

        setWeekDates(getDatesForWeek());
    }, [])

    return (
    <section>
        <div>
            <h2 className="font-semibold text-xl text-center sm:text-left">Sessions</h2>
            <ul className="flex gap-x-3 gap-y-2 mt-3 flex-wrap">
                {weekDates?.length > 0 &&
                weekDates.map((weekDate, index) => {
                    
                    const text = weekDate
                    .toLocaleDateString('en-AU', { 
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                    }).toUpperCase().replace(',', '')

                    return (
                        <li 
                        key={formatDate(weekDate)} 
                        role="button" 
                        onClick={() => setSessionDate(weekDate)}
                        className={`text-sm sm:text-base hover:text-slate-800 px-2 py-1 font-medium border-orange-300${weekDate.getDate() === sessionDate.getDate() ? ' border-b-2' : ''}`}
                        >
                            {text}
                        </li>
                    )
                })}
            </ul>
        </div>
        {!isFetchingSessions && !sessionErrMessage && 
        <div className="py-6">
            { sessions?.length === 0 &&
            <div className="flex justify-center bg-blue-100 py-10 px-5">
                <p className="text-xl text-center sm:text-left">Sorry, we couldn't find any results for your session date.</p>
            </div>
            }
            { sessions?.length > 0 &&
                <div className="w-full gap-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {sessions.sort((a, b) => {
                        const first = new Date(`${a.session_start_date} ${a.session_start_time}`);
                        const last = new Date(`${b.session_start_date} ${b.session_start_time}`);
                    
                        return first - last;
                        
                    }).map(session  => {
                        const twelve_hour_time = convertTo12Hour(session.session_start_time);
                        const session_date = new Date(`${session.session_start_date} ${session.session_start_time}`);
                        const today = new Date();

                        if (session_date > today){
                            return (
                                <div 
                                className="cursor-pointer session-card overflow-hidden relative px-8 py-3 bg-slate-100 rounded-lg border-green-200 border-2"
                                key={session.session_start_time}
                                onClick={() => navigate(`/movies/${id}/order`, { state: { session }})}
                                >
                                    <p className="font-medium text-lg">{twelve_hour_time}</p>
                                    <p className="font-medium text-lg">{session.theatre.type}</p>
                                </div>
                            )
                        }
                        else {
                            return null;
                        }
                    })}
                </div>
            }
        </div>}
    </section>
  )
}

export default MovieSessions
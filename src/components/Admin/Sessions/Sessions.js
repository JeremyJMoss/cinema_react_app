import { useCallback } from "react";
import ArchiveHead from "../ArchiveHead";
import ArchiveCards from "../ArchiveCards";
import ArchiveTable from "../ArchiveTable";
import { BASE_URL } from "../../../config/constants";
import { useFetch } from "../../../hooks/useFetch";
import { request } from "../../../util/http";

const Sessions = () => {
    const sendFetch = useCallback(async () => {
        return await request(`${BASE_URL}/movies`,
        null,
        {})
    }, []);

    const {
        data,
        errMessage,
        isFetching
    } = useFetch(sendFetch, []);


    return (
        <div className="min-h-full w-full p-5 sm:p-10 relative">
            <ArchiveHead
            isFetching={isFetching}
            errMessage={errMessage}
            title="Sessions"
            />
            {!errMessage && !isFetching && data.movies?.length > 0 &&
            <>
                <ArchiveCards
                information={data.movies.map((movie) => {
                return {
                    id: movie.id,
                    data: movie.title,
                }
                })}
                label="Title"
                isSession={true}/>
                <ArchiveTable
                information={{
                    labels: [
                        'Title',
                        'Rating'
                    ],
                    data: data.movies.map(movie => {
                        return {
                            id: movie.id,
                            fields: [
                            movie.title,
                            movie.rating
                            ]
                        }
                    })
                }}
                isSession={true}
                />
            </>}
        </div>
    )
}

export default Sessions
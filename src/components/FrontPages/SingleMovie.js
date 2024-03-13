import { useCallback } from "react";
import { useParams } from "react-router-dom"
import { request } from "../../util/http";
import { BASE_URL } from "../../config/constants";
import { useFetch } from "../../hooks/useFetch";
import Rating from "../Sections/Partials/Rating";
import ErrorMessage from "../UI/ErrorMessage";

const SingleMovie = () => {
    const {id} = useParams();

    const sendFetch = useCallback(async () => {
        return await request(
            `${BASE_URL}/movie/${id}`,
            null,
            {}
        )
    }, [id])

    const {
        isFetching,
        data: movie,
        errMessage
    } = useFetch(sendFetch, {})

    const date = new Date(movie.release_date);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-AU', options);

    return (
        <section>
            {isFetching && <div>Loading...</div>}
            {errMessage && !isFetching && 
            <ErrorMessage 
            message={errMessage}
            />}
            {!isFetching && !errMessage && movie && 
            <article>
                <div className="flex flex-col sm:flex-row gap-6">
                    <img 
                    src={`${BASE_URL}/${movie.cover_art}`}
                    className="w-72"
                    alt={`cover art for ${movie.title}`}/>
                    <div className="h-auto gap-2 flex flex-col justify-end mb-2">
                        <h1 className="text-4xl font-medium">{movie.title}</h1>
                        <div className="flex items-center">
                            <Rating
                            rating={movie.rating}
                            size='medium'/>
                            <p className="md:text-lg pl-3 pr-4 border-r-2 border-orange-200">{movie.run_time} mins</p>
                            <p className="pl-4 md:text-lg">{formattedDate}</p>
                        </div>
                        {movie.director && 
                        <p><span className="font-semibold">Directed By:</span> {movie.director}</p>}
                        {movie.cast.length > 0 &&
                        <p>
                            <span className="font-semibold">Cast:</span> {movie.cast.map(actor => actor.name).join(', ')}
                        </p>}
                    </div>
                </div>
                <div className="py-6">
                    {movie.summary}
                </div>
                <div>
                    <h2 className="font-semibold text-xl">Sessions</h2>
                </div>
            </article>}
        </section>
    )
}

export default SingleMovie
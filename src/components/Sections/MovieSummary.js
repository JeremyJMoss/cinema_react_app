import { request } from "../../util/http";
import { BASE_URL } from "../../config/constants";
import { useState, useEffect } from "react";
import ErrorMessage from "../UI/ErrorMessage";
import Rating from "./Partials/Rating";

function MovieSummary({id, isShort}) {
    const [ isFetchingMovie, setIsFetchingMovie ] = useState(false);
    const [ movieErrMessage, setMovieErrMessage ] = useState('');
    const [ movie, setMovie ] = useState(null);

    let formattedDate;

    if (movie){
        const releaseDate = new Date(movie.release_date);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        formattedDate = releaseDate.toLocaleDateString('en-AU', options);
    }

    useEffect(() => {
        const sendFetch = async () => {
            try {
                setIsFetchingMovie(true);
                const response = await request(
                    `${BASE_URL}/movie/${id}`,
                    null,
                    {}
                )
                setMovieErrMessage('');
                setMovie(response);
            } 
            catch (error) {
                setMovieErrMessage(error.message);
            }
            finally {
                setIsFetchingMovie(false);
            }
        }

        sendFetch();

    }, [id])

    return (
        <section>
            {isFetchingMovie && <div>Loading...</div>}
            {movieErrMessage && !isFetchingMovie && 
            <ErrorMessage 
            message={movieErrMessage}
            />}
            {!isFetchingMovie && !movieErrMessage && movie &&
            <article>
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-end">
                    <img 
                    src={`${BASE_URL}/${movie.cover_art}`}
                    className={`${isShort ? 'w-32': 'w-52'}`}
                    alt={`cover art for ${movie.title}`}/>
                    <div className="h-auto gap-2 flex flex-col justify-end mb-2 items-center sm:items-start">
                        <h1 className="text-4xl font-medium text-center sm:text-left">{movie.title}</h1>
                        <div className="flex items-center">
                            <Rating
                            rating={movie.rating}
                            size='medium'/>
                            <p className={`md:text-lg pl-3 pr-4 ${!isShort && 'border-r-2 border-orange-200'}`}>{movie.run_time} mins</p>
                            {!isShort &&
                            <p className="pl-4 md:text-lg">{formattedDate}</p>
                            }
                        </div>
                        {movie.director && !isShort && 
                        <p><span className="font-semibold">Directed By:</span> {movie.director}</p>}
                        {movie.cast.length > 0 && !isShort &&
                        <p className="text-center">
                            <span className="font-semibold">Cast:</span> {movie.cast.map(actor => actor.name).join(', ')}
                        </p>}
                    </div>
                </div>
                {!isShort &&
                <div className="py-6">
                    <p className="text-center sm:text-left leading-relaxed max-w-2xl">{movie.summary}</p>
                </div>
                }
            </article>
            }
        </section>
  )
}

export default MovieSummary
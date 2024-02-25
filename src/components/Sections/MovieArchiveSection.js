import { useCallback, useState } from 'react';
import { BASE_URL } from '../../config/constants';
import defaultCoverArt from "../../assets/ImageDefaultPoster.png";
import { useFetch } from '../../hooks/useFetch';
import { request } from '../../util/http';
import Pagination from '../UI/Pagination';
import Rating from './Partials/Rating';
import { Link } from 'react-router-dom';

const MovieArchiveSection = () => {
    const [page, setPage] = useState(1);

    const sendFetch = useCallback(async () => {
        return await request(
            `${BASE_URL}/movies?page=${page}`,
            null,
            {}
        )
    }, [page])

    const {
        isFetching,
        data,
        errMessage
    } = useFetch(sendFetch, null)

    return (
        <section className=''>
            {isFetching && <div>Loading...</div>}
            {errMessage && <div>{errMessage}</div>}
            <div 
            className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 place-items-center'
            >
            {data?.movies?.length > 0 && !isFetching &&
            data.movies.map(movie => {
                return (
                <div 
                key={movie.id} 
                className='rounded-lg w-64 md:w-56 h-full flex flex-col'
                >
                    <Link 
                    className='hover:-translate-y-2 duration-300'
                    to={`/movies/${movie.id}`}
                    >
                        <img 
                        className='rounded-lg w-full h-96 md:h-80 cursor-pointer' 
                        src={movie.cover_art ? `${BASE_URL}/${movie.cover_art}` : defaultCoverArt} 
                        alt={`${movie.title} cover art`}
                        />
                    </Link>
                    <div className='grow'>
                        <p className='pt-4 pb-2 text-md font-medium'>{movie.title}</p>
                        <div className='flex gap-3 items-center pb-4'>
                            <Rating
                            rating={movie.rating}
                            size="small"/>
                            <p>{movie.run_time} mins</p>
                        </div>
                    </div>
                </div>
                )
            })}
            </div>
            {data?.totalPages && !isFetching && !errMessage &&
            <Pagination
            page={page}
            totalPages={data.totalPages}
            handlePagination={setPage}/>
            }
        </section>
    )
}

export default MovieArchiveSection;
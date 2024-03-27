import { useEffect, useState } from 'react';
import { BASE_URL } from '../../config/constants';
import defaultCoverArt from "../../assets/ImageDefaultPoster.png";
import { request } from '../../util/http';
import Pagination from '../UI/Pagination';
import Rating from './Partials/Rating';
import { Link } from 'react-router-dom';
import ErrorMessage from '../UI/ErrorMessage';

const MovieArchiveSection = () => {
    const [ page, setPage ] = useState(1);
    const [ isFetching, setIsFetching ] = useState(false);
    const [ movies, setMovies ] = useState([]);
    const [ totalPages, setTotalPages ] = useState(null);
    const [ errMessage, setErrMessage ] = useState('');

    useEffect(() => {
        const sendFetch = async () => {
            setIsFetching(true);
            try{
                const response = await request(
                    `${BASE_URL}/current-movies?page=${page}`,
                    null,
                    {}
                )
                setMovies(response.movies);
                if (response.totalPages){
                    setTotalPages(response.totalPages);
                }
                setErrMessage('');
            }
            catch (error) {
                setErrMessage(error.message);
            }
            finally {
                setIsFetching(false);
            }
        };

        sendFetch();
    }, [page])

    return (
        <section>
            {isFetching && <div className='flex justify-center text-lg'>Loading...</div>}
            {errMessage && 
            <ErrorMessage
            message={errMessage}
            />}
            <div 
            className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 place-items-center'
            >
            {movies?.length > 0 && !isFetching &&
            movies.map(movie => {
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
            {movies.length === 0 && !isFetching &&
            <div className='flex justify-center'>
                <p className='text-lg'>No Movie Sessions Found!</p>
            </div>}
            {totalPages && !isFetching && !errMessage &&
            <Pagination
            page={page}
            totalPages={totalPages}
            handlePagination={setPage}/>
            }
        </section>
    )
}

export default MovieArchiveSection;
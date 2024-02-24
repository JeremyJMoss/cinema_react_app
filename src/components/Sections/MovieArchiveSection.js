import { useCallback } from 'react';
import { BASE_URL } from '../../config/constants';
import defaultCoverArt from "../../assets/ImageDefaultPoster.png";
import { useFetch } from '../../hooks/useFetch';
import { request } from '../../util/http';
import Button from '../UI/Buttons/Button';

const MovieArchiveSection = () => {

    const sendFetch = useCallback(async () => {
        return await request(
            `${BASE_URL}/movies`,
            null,
            {}
        )
    }, [])

    const {
        isFetching,
        data: movies,
        errMessage
    } = useFetch(sendFetch, [])

    return (
        <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 place-items-center'>
        {errMessage && <div>{errMessage}</div>}
        {movies && movies.length > 0 && !isFetching &&
        movies.map(movie => {
            return (
            <div key={movie.id} className='rounded-lg w-64 md:w-48 h-full shadow-lg flex flex-col'>
                <img className='rounded-t-lg w-full h-96 md:h-72' src={movie.cover_art ? `${BASE_URL}/${movie.cover_art}` : defaultCoverArt} alt={`${movie.title} cover art`}/>
                <div className='border-2 border-slate-300 rounded-b-lg grow'>
                    <div className='relative h-5'>
                        <div className='whitespace-nowrap absolute -top-4 left-1/2 -translate-x-1/2'>
                            <Button
                            type='button'
                            shadow="shadow-lg"
                            colorStyling="accent"
                            size="small">
                                Book a Session
                            </Button>
                        </div>
                    </div>
                    <p className='text-center py-5 px-3 text-sm'>{movie.title}</p>
                </div>
            </div>
            )
        })}
        {isFetching &&
        <div>Loading...</div>}
        </section>
    )
}

export default MovieArchiveSection;
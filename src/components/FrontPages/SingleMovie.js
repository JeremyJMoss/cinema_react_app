import { useParams } from "react-router-dom"
import MovieSummary from "../Sections/MovieSummary";
import MovieSessions from "../Sections/MovieSessions";

const SingleMovie = () => {
    const {id} = useParams();

    return (
        <section>
            <MovieSummary
            id={id}/>
            <MovieSessions
            id={id}/>
        </section>
    )
}

export default SingleMovie
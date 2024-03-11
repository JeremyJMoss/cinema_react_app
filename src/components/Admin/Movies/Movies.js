import { useState, useCallback } from "react";
import { BASE_URL } from "../../../config/constants";
import { request } from "../../../util/http";
import { useFetch } from "../../../hooks/useFetch";
import ArchiveHead from "../ArchiveHead";
import ArchiveTable from "../ArchiveTable";

const Movies = () => {
  const [deleteId, setDeleteId] = useState(null);

  const sendFetch = useCallback(
    async () => await request(`${BASE_URL}/movies`, 
    null, 
    {}
  ), [])

  const { 
    isFetching, 
    data,
    setData: setMovies, 
    errMessage 
  } = useFetch(sendFetch,[])

  const handleDelete = (id) => {
    setDeleteId(null);
    setMovies(prev => prev.movies.filter((movie) => movie.id !== id));
  }

  const handleDeleteModal = (id) => {
    setDeleteId(id);
  }

  const outputDeleteText = (entityToDelete) => {
    return `Are you sure you wish to delete ${entityToDelete.title}?`;
  }

  return (
    <div className="min-h-full h-auto w-full p-5 sm:p-10 relative">
      <ArchiveHead
      deleteModalId={deleteId}
      setDeleteModalId={setDeleteId}
      title="Movies"
      newLink='/admin/movies/new'
      handleDelete={handleDelete}
      errMessage={errMessage}
      deleteUrl={`${BASE_URL}/movie/${deleteId}`}
      outputDeleteText={outputDeleteText}
      isFetching={isFetching}/>
      {!errMessage && !isFetching && data?.movies?.length > 0 &&
        <ArchiveTable
        information={{
          labels: [
            "Title",
            "Rating",
            "Runtime(mins)"
          ],
          data: data.movies.map((movie => {
            return {
              id: movie.id,
              fields: [
                movie.title,
                movie.rating,
                movie.run_time
              ]
            }
          }))
        }}
        onHandleDeleteModal={handleDeleteModal}
        editBaseRoute='/movies'
        />
      }
    </div>
  )
}


export default Movies;
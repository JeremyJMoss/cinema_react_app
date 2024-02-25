import { useState, useCallback } from "react";
import { BASE_URL } from "../../../config/constants";
import DeleteModal from "../Users/DeleteModal";
import { request } from "../../../util/http";
import { useFetch } from "../../../hooks/useFetch";
import ErrorMessage from "../../UI/ErrorMessage";
import Button from "../../UI/Buttons/Button";
import { useNavigate, Link } from "react-router-dom";
import AdminField from "../AdminField";

const Movies = () => {
  const navigate = useNavigate();
  const [deleteModalId, setDeleteModalId] = useState(null);

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
    setDeleteModalId(null);
    setMovies(prev => prev.movies.filter((movie) => movie.id !== id));
  }

  const handleDeleteModal = (id) => {
    setDeleteModalId(id);
  }

  return (
    <div className="h-full w-full p-5 sm:p-10 relative bg-gray-100">
      {deleteModalId && 
      <DeleteModal
      deleteId={deleteModalId}
      setDeleteId={setDeleteModalId}
      onDelete={handleDelete}
      baseRoute='/movie'/>}
      {errMessage &&
      <ErrorMessage
      message={errMessage}/>}
      <div className="flex gap-2 items-center mb-8">
        <h2 className="text-2xl font-bold mr-6">Movies</h2>
        <Button
        type="button"
        colorStyling='primary'
        onClick={() => navigate('/admin/movies/new')}
        >
          Add New
        </Button>
      </div>
      {isFetching && <div>Loading...</div>}
      {!errMessage && !isFetching && data?.movies?.length > 0 &&
      <>
        <section className="grid grid-cols-1 md:hidden gap-5">
          {data.movies.map((movie) => {
            return (
              <div key={movie.id} className="bg-white shadow-xl text-black-800 rounded-lg flex">
                <div className="p-5 flex flex-col grow">
                  <AdminField
                  label="Title"
                  data={movie.title}/>
                  <div className='flex items-start sm:items-end justify-between p-2 mt-2 grow flex-col sm:flex-row'>
                    <div className="gap-5 flex">
                      <Link to={`/admin/movies/edit/${movie.id}`} className='bg-blue-200 shadow-md py-2 px-7 font-medium text-black-800 rounded text-center'>
                        Edit
                      </Link>
                      <button onClick={() => handleDeleteModal(movie.id)} className='bg-orange-200 shadow-md py-2 px-7 font-medium text-neutral-950 rounded'>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </section>
        <table className="border-2 rounded-md bg-white hidden md:table">
          <thead>
            <tr className="text-left">
              <th className="font-medium px-5 py-3">Id</th>
              <th className="font-medium px-5 py-3">Title</th>
              <th className="font-medium px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.movies.map((movie, index) => {
              return (
                <tr key={movie.id} className={index % 2 === 0 ? "bg-slate-100" : null}>
                  <td className="px-5 py-3">{movie.id}</td>
                  <td className="px-5 py-3">{movie.title}</td>
                  <td className='flex gap-3 px-5 py-3'>
                    <Link to={`/admin/movies/edit/${movie.id}`} className='bg-blue-200 shadow-md py-2 px-7 font-medium text-black-800 rounded text-center'>
                      Edit
                    </Link>
                    <button onClick={() => handleDeleteModal(movie.id)} className='bg-orange-200 shadow-md py-2 px-7 font-medium text-neutral-950 rounded'>
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </>
      }
    </div>
  )
}


export default Movies;
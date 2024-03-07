import { useNavigate } from "react-router-dom"
import AdminField from "./AdminField"
import Button from "../UI/Buttons/Button"

const ArchiveCards = ({information, label, onHandleDeleteModal, editBaseRoute, isSession}) => {
  const navigate = useNavigate();

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-5">
        {information.map(({id, data}) => {
        return (
            <div key={id} className="bg-white shadow-xl text-black-800 rounded-lg flex">
            <div className="p-5 flex flex-col grow">
                <AdminField
                label={label}
                data={data}/>
                <div className='flex items-start sm:items-end justify-between p-2 mt-2 grow flex-col sm:flex-row'>
                <div className="gap-5 flex">
                    {!isSession &&
                    <>
                      <Button 
                      onClick={() => navigate(`/admin${editBaseRoute}/edit/${id}`)}
                      colorStyling="secondary"
                      size="medium">
                      Edit
                      </Button>
                      <Button 
                      onClick={() => onHandleDeleteModal(id)} 
                      colorStyling="accent"
                      size="medium">
                      Delete
                      </Button>
                    </>
                    }
                    {isSession &&
                    <>
                        <Button
                        colorStyling="primary"
                        size="small"
                        onClick={() => navigate(`/admin/sessions/${id}/new`)}
                        >
                            New Session
                        </Button>
                        <Button
                        colorStyling="secondary"
                        size="small"
                        onClick={() => navigate(`/admin/sessions/${id}`)}
                        >
                            View Sessions
                        </Button>
                    </>
                    }
                </div>
                </div>
            </div>
            </div>
        )
        })}
    </section>
  )
}

export default ArchiveCards
import ErrorMessage from "../UI/ErrorMessage"
import DeleteModal from "./Users/DeleteModal"
import Button from "../UI/Buttons/Button"
import { useNavigate } from "react-router-dom"

const ArchiveHead = ({isFetching, newLink, title, errMessage, deleteModalId, setDeleteModalId, handleDelete, deleteUrl, outputDeleteText}) => {
    const navigate = useNavigate();

    return (
        <>
            {deleteModalId && 
                <DeleteModal
                deleteId={deleteModalId}
                setDeleteId={setDeleteModalId}
                onDelete={handleDelete}
                outputDeleteText={outputDeleteText}
                deleteUrl={deleteUrl}
                />
            }
            {errMessage &&
            <ErrorMessage
            message={errMessage}/>}
            <div className="flex gap-2 items-center mb-8">
            <h2 className="text-2xl font-bold mr-6">{title}</h2>
            {newLink && <Button
            type="button"
            colorStyling='primary'
            size="small"
            onClick={() => navigate(newLink)}
            >
                Add New
            </Button>}
            </div>
            {isFetching && <div>Loading...</div>}
        </>
    )
}

export default ArchiveHead
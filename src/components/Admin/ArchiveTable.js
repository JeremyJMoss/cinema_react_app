import Button from "../UI/Buttons/Button"
import { useNavigate } from "react-router-dom"

const ArchiveTable = ({ information, onHandleDeleteModal, editBaseRoute }) => {
    const navigate = useNavigate();

    return (
        <table className="lg:border-2 rounded-md bg-white">
            <thead className="hidden lg:table-header-group">
                <tr className="text-left">
                    {information.labels.map((label) => {
                        return <th key={label} className="font-medium px-5 py-3">{label}</th>
                    })}
                    <th className="font-medium px-5 py-3">Actions</th>
                </tr>
            </thead>
            <tbody>
            {information.data.map((obj, index) => {
                return (
                <tr key={obj.id} className={`flex flex-col lg:table-row pt-3 lg:pt-0 px-5 lg:px-0 border-b-8 ${index % 2 === 0 ? "lg:bg-slate-100" : null}`}>
                    {obj.fields.map((field, fieldIndex) => {
                    return <td key={obj.id + '_' + field} className="px-5 py-3 grid grid-cols-2 lg:table-cell border-b-4 lg:border-0">
                        <label className="lg:hidden text-lg font-semibold">{information.labels[fieldIndex]}:</label>
                        <p className="text-left">{field}</p>
                    </td>
                    })}
                    <td className='h-full flex grow lg:grow-0 lg:table-cell items-center'>
                        <div className="flex gap-5 grow lg:grow-0 justify-end lg:justify-start lg:gap-3 px-5 py-5 lg:py-3">   
                            {editBaseRoute && <Button
                            colorStyling="secondary"
                            size="medium"
                            onClick={() => navigate(`/admin${editBaseRoute}/edit/${obj.id}`)}>
                                Edit
                            </Button>}
                            <Button
                            onClick={() => onHandleDeleteModal(obj.id)}
                            colorStyling="accent"
                            size="medium">
                                Delete    
                            </Button>
                        </div>
                    </td>
                </tr>
                )
            })}
            </tbody>
        </table>
    )
}

export default ArchiveTable
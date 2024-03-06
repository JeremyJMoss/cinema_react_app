import Button from "../UI/Buttons/Button"
import { useNavigate } from "react-router-dom"

const ArchiveTable = ({information, onHandleDeleteModal, editBaseRoute}) => {
    const navigate = useNavigate();

    return (
        <table className="border-2 rounded-md hidden lg:table bg-white">
            <thead>
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
                <tr key={obj.id} className={index % 2 === 0 ? "bg-slate-100" : null}>
                    {obj.fields.map(field => {
                    return <td key={obj.id + '_' + field} className="px-5 py-3">{field}</td>
                    })}
                    <td className='h-full'>
                        <div className="flex gap-3 px-5 py-3">
                            <Button
                            colorStyling="secondary"
                            size="medium"
                            onClick={() => navigate(`/admin${editBaseRoute}/edit/${obj.id}`)}>
                                Edit
                            </Button>
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
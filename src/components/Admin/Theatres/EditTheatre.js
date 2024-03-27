import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../../context/AuthContext";
import { BASE_URL } from "../../../config/constants";
import { request } from "../../../util/http";
import { useState, useEffect } from "react";
import ErrorMessage from "../../UI/ErrorMessage";
import Input from "../../UI/Input";
import { THEATRE_TYPES } from "../../../config/constants";
import Select from "../../UI/Select";
import TheatreGrid from "../TheatreGrid";
import Button from "../../UI/Buttons/Button";

function EditTheatre() {
    const { id } = useParams();
    const { logout, token } = useAuth();
    const navigate = useNavigate();
    const [ errMessage, setErrMessage ] = useState('');
    const [ isFetching, setIsFetching ] = useState(false);
    const [ formData, setFormData ] = useState({
        number: '',
        type: "Standard"
    })

    const [ seats, setSeats ] = useState([]);

    useEffect(() => {
        const sendFetch = async () => {
            try {
                setIsFetching(true);
                const response = await request(
                    `${BASE_URL}/theatre/${id}`,
                    null,
                    {}
                )
                setFormData(response);
                setErrMessage('');
            }
            catch (error) {
                setErrMessage(error.message);
            }
            finally {
                setIsFetching(false);
            }
        }

        sendFetch()
    }, [id])

    const handleEdit = (theatre_number, value) => {
        if (!formData.number){
            setErrMessage('No theatre number added');
            return;
        }
        const editTheatre = async () => {
            try {
                await request(`${BASE_URL}/theatre/${id}`,
                    logout,
                    {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    'PUT',
                    JSON.stringify({
                        ...formData,
                        seats
                    })
                )
                setErrMessage('');
                navigate('/admin/theatres');
            }
            catch (error){
                setErrMessage(error.message);
            }
        }

        editTheatre();
    }

    const handleFieldChange = (fieldName, value) => {
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: value
        }));
    };

    return (
        <div className="p-10">
            {isFetching && <div>Loading...</div>}
            {!isFetching &&
            <form>
                <div className="max-w-2xl">
                    <h1 className="text-2xl mb-6 text-slate-800 font-medium">Edit Theatre</h1>
                    {errMessage &&
                    <ErrorMessage
                    message={errMessage}/>}
                    <Input
                    fieldType='number'
                    fieldName='Theatre Number'
                    name='number'
                    id='number'
                    required={true}
                    onFieldChange={handleFieldChange}
                    value={formData.number}
                    />
                    <Select
                    onFieldChange={handleFieldChange}
                    options={THEATRE_TYPES}
                    name='type'
                    id='type'
                    label="Theatre Type"
                    required={true}
                    value={formData.type}
                    />
                </div>
                <TheatreGrid
                setGrid={setSeats}
                grid={seats}
                theatre_id={id}/>
                <Button
                colorStyling="primary"
                type="button"
                size="medium"
                onClick={handleEdit}
                >
                    Submit
                </Button>
            </form>}
        </div>
                    
    )
}

export default EditTheatre
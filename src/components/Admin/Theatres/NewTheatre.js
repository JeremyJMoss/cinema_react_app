import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";
import { BASE_URL } from "../../../config/constants";
import { request } from "../../../util/http";
import { THEATRE_TYPES } from "../../../config/constants";
import ErrorMessage from "../../UI/ErrorMessage";
import Input from "../../UI/Input";
import Select from "../../UI/Select";
import TheatreGrid from "../TheatreGrid";
import Button from "../../UI/Buttons/Button";

function NewTheatre() {
    const [errMessage, setErrMessage] = useState('');
    const {logout, token} = useAuth();
    const [formData, setFormData] = useState({
        number: '',
        type: 'Standard'
    })

    const [seats, setSeats] = useState([]);

    const handleSubmit = () => {
        if (!formData.number){
            setErrMessage('No theatre number added');
            return;
        }
        const sendTheatres = async () => {
            try {
                await request(`${BASE_URL}/theatre`,
                    logout,
                    {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    'POST',
                    JSON.stringify({
                        ...formData,
                        seats
                    })
                )
                
                setErrMessage('');
            }
            catch (error){
                setErrMessage(error.message);
            }
        }

        sendTheatres();
    }

    const handleFieldChange = (fieldName, value) => {
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: value
        }));
    };

    return (
        <div className="p-10">
            <form>
                <div className="max-w-2xl">
                    <h1 className="text-2xl mb-6 text-slate-800 font-medium">Create New Theatre</h1>
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
                grid={seats}/>
                <Button
                colorStyling="primary"
                type="button"
                size="medium"
                onClick={handleSubmit}
                >
                    Submit
                </Button>
            </form>
        </div>
    )
}

export default NewTheatre
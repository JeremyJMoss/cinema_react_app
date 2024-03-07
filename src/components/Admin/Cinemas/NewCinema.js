import TabularNav from "../../UI/TabularNav";
import Input from "../../UI/Input";
import Button from "../../UI/Buttons/Button";
import ErrorMessage from "../../UI/ErrorMessage";
import { useState } from "react";
import { request } from "../../../util/http";
import { BASE_URL } from "../../../config/constants";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const NewCinema = () => {
    const {logout, token} = useAuth();
    const navigate = useNavigate();
    const [errMessage, setErrMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        designator: '',
        streetAddress: '',
        city: '',
        state: '',
        country: '',
        postcode: ''
    })

    const handleFieldChange = (fieldName, value) => {
        setFormData(prev => {
            return {
                ...prev,
                [fieldName]: value
            }
        })
    }

    const handleSubmit = () => {
        const sendData = async () => {
            try {
                const response = await request(`${BASE_URL}/cinema`,
                    logout,
                    {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    'POST',
                    JSON.stringify(formData)
                )

                const cinema_id = response.cinema.id;
                setErrMessage('');
                navigate(`/admin/cinemas/${cinema_id}/theatres`);
            }
            catch (error) {
                setErrMessage(error.message);
            }
        }
        
        sendData();
    }

    return (
        <>
            <TabularNav
            links={[
                {
                    text: 'Cinema',
                    to: '/admin/cinemas/new'
                }
            ]}/>
            <div className="max-w-2xl p-10">
                {errMessage && 
                <ErrorMessage
                message={errMessage}/>}
                <form>
                    <h1 className="text-2xl mb-6 text-slate-800 font-medium">Create New Cinema</h1>
                    <Input
                    fieldType="text"
                    fieldName="Name" 
                    name="name" 
                    id="name" 
                    required={true} 
                    onFieldChange={handleFieldChange} 
                    value={formData.name}
                    />
                    
                    <Input
                    fieldType="text"
                    fieldName="Apartment, Suite, etc." 
                    name="designator" 
                    id="designator" 
                    required={true} 
                    onFieldChange={handleFieldChange} 
                    value={formData.designator}
                    />
                    
                    <Input
                    fieldType="text"
                    fieldName="Street Address" 
                    name="streetAddress" 
                    id="street_address" 
                    required={true}
                    onFieldChange={handleFieldChange} 
                    value={formData.streetAddress}
                    />

                    <Input
                    fieldType="text"
                    fieldName="City" 
                    name="city" 
                    id="city" 
                    required={false} 
                    onFieldChange={handleFieldChange} 
                    value={formData.city}
                    />

                    <Input
                    fieldType="text"
                    fieldName="State" 
                    name="state" 
                    id="state" 
                    required={false} 
                    onFieldChange={handleFieldChange} 
                    value={formData.state}
                    />

                    <Input
                    fieldType="text"
                    fieldName="Country" 
                    name="country" 
                    id="country" 
                    required={false} 
                    onFieldChange={handleFieldChange} 
                    value={formData.country}
                    />

                    <Input
                    fieldType="number"
                    fieldName="Postcode" 
                    name="postcode" 
                    id="postcode" 
                    required={false} 
                    onFieldChange={handleFieldChange} 
                    value={formData.postcode}
                    />

                    <div className="flex justify-end w-full py-8">
                        <Button
                        size='medium'
                        type="button"
                        colorStyling="primary"
                        onClick={handleSubmit}
                        >
                            Create
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default NewCinema
import { useParams, useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useFetch } from "../../../hooks/useFetch";
import ErrorMessage from "../../UI/ErrorMessage";
import Button from "../../UI/Buttons/Button";
import Input from "../../UI/Input";
import { BASE_URL } from "../../../config/constants";
import { request } from "../../../util/http";
import TabularNav from "../../UI/TabularNav";

const splitAddress = (address, object) => {
    let count = 0;

    const segmentedAddress = address.split(', ');

    if (segmentedAddress.length > 5){
        object.designator = segmentedAddress[count++];
    }

    object.streetAddress = segmentedAddress[count++];
    object.city = segmentedAddress[count++];
    object.state = segmentedAddress[count++];
    object.country = segmentedAddress[count++];
    object.postcode = segmentedAddress[count++];

    return object;
}


const EditCinema = () => {
    const {id} = useParams();
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        designator: '',
        country: '',
        city: '',
        streetAddress: '',
        state: '',
        postcode: ''
    });

    const sendFetch = useCallback(async () => {
        const result = await request(
        `${BASE_URL}/cinema/${id}`,
        logout,
        {}
        )

        const dataObject = splitAddress(result.address, {
            name: result.name
        })

        setFormData(dataObject);

        return result;

    }, [logout, id]);


    const {
        isFetching,
        data: cinemaToEdit,
        errMessage,
        setErrMessage
    } = useFetch(sendFetch, null)


    const handleFieldChange = (fieldName, value) => {
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: value
        }));
    };

    const handleSubmit = () => {
        const postData = async () => {
            try {
                await request(`${BASE_URL}/cinema/${id}`,
                    logout,
                    {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    "PUT",
                    JSON.stringify(formData)
                );
                setErrMessage('');
                navigate('/admin/cinemas');

            } catch(error){
                setErrMessage(error.message);
            }
        }

        postData();
    }

    return (
        <>
            <TabularNav
            links={[
                {
                    text: 'Cinema',
                    to: `/admin/cinemas/edit/${id}`
                },
                {
                    text: 'Theatres',
                    to: `/admin/cinemas/${id}/theatres`
                }
            ]}/>
            <div className="max-w-2xl p-10">
                {errMessage && 
                <ErrorMessage
                message={errMessage}/>}
                {isFetching &&
                <div>Loading...</div>
                }
                {cinemaToEdit && !isFetching &&
                <form>
                    <h1 className="text-2xl mb-6 text-slate-800 font-medium">Edit Cinema</h1>
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
                            Update
                        </Button>
                    </div>
                </form>}
            </div>
        </>
    )
}

export default EditCinema
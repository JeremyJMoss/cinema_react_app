import { useParams, useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { BASE_URL, ROLES } from '../../../config/constants';
import { useAuth } from '../../../context/AuthContext';
import Input from '../../UI/Input';
import Button from '../../UI/Buttons/Button';
import Select from '../../UI/Select';
import ErrorMessage from '../../UI/ErrorMessage';
import { useFetch } from '../../../hooks/useFetch';
import { request } from '../../../util/http';

const EditUser = () => {
    const {id} = useParams();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        role: ''
    });
    const {token, logout} = useAuth();
    const navigate = useNavigate();

    const sendFetch = useCallback(async () => {
        const result = await request(
            `${BASE_URL}/user/${id}`,
            logout,
            {
                'Authorization': `Bearer ${token}`
            }
        );

        setFormData({
            first_name: result.first_name,
            last_name: result.last_name,
            email: result.email,
            role: result.role
        })
        return result;

    }, [logout, id, token])

    const {
        isFetching,
        data: userToEdit,
        setErrMessage,
        errMessage
    } = useFetch(sendFetch, null)

    const handleFieldChange = (fieldName, value) => {
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: value
        }));
    };

    const handleSubmit = () => {
        fetch(`${BASE_URL}/user/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(async response => {
            if (!response.ok){
                const err = await response.json()
                if (err.expiresAt){
                    logout();
                }
                throw new Error(err.message);
            }
            await response.json();
            navigate('/admin/users')
        })
        .catch(err => {
            setErrMessage(err.message);
        });
    }
    
    return (
        <>
            <div className="max-w-2xl p-10">
                {isFetching &&
                    <div>Loading...</div>
                }
                {userToEdit && !isFetching &&
                    <form>
                        <h1 className="text-2xl mb-6 text-slate-800 font-medium">Edit User</h1>
                        {errMessage && 
                            <ErrorMessage
                            message={errMessage}/>
                        }
                        <Input
                        fieldType="text"
                        fieldName="First Name" 
                        name="first_name" 
                        id="first_name" 
                        required={true} 
                        onFieldChange={handleFieldChange} 
                        value={formData.first_name}/>
                        <Input
                        fieldType="text"
                        fieldName="Last Name" 
                        name="last_name" 
                        id="last_name" 
                        required={true} 
                        onFieldChange={handleFieldChange} 
                        value={formData.last_name}/>
                        <Input
                        fieldType="text"
                        fieldName="Email" 
                        name="email" 
                        id="email" 
                        required={true} 
                        onFieldChange={handleFieldChange} 
                        value={formData.email}/>
                        {formData.role !== 'super admin' &&
                        <Select
                        name='role'
                        id='select_role'
                        label='Role'
                        options={ROLES}
                        required={true}
                        onFieldChange={handleFieldChange}
                        value={formData.role}/>}
                        <div className='flex w-full justify-end'>
                            <Button
                            colorStyling='secondary'
                            size="medium"
                            onClick={handleSubmit}>
                                Update
                            </Button>
                        </div>
                    </form>
                }
            </div>
        </>
    )
}

export default EditUser
import Input from "../../UI/Input"
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { ROLES, BASE_URL } from "../../../config/constants";
import Select from "../../UI/Select";
import Button from "../../UI/Buttons/Button";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../UI/ErrorMessage";
import { request } from "../../../util/http";
import TabularNav from "../../UI/TabularNav";

const NewUser = () => {
    const { token, user, logout } = useAuth();
    const navigate = useNavigate();
    const [errMessage, setErrMessage] = useState('');

    if (user){
        if (user.role === 'admin'){
            ROLES = ROLES.filter((role) => role !== 'super admin')
        }
    }

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'user'
    });

    const handleFieldChange = (fieldName, value) => {
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: value
        }));
    };

    const handleSubmit = () => {
        const postData = async () => {
            try {
                await request(`${BASE_URL}/signup`,
                    logout,
                    {
                        'Authentication': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    'POST',
                    JSON.stringify(formData)
                )
                
                navigate('/admin/users')
            }
            catch(error) {
                setErrMessage(error.message);
            }
        }
        
        postData() 
    }

        

    return (
        <>
            <TabularNav
            links={[
                {
                    text: 'User',
                    to: '/admin/users/new'
                }
            ]}/>
            <div className="max-w-2xl p-10">
                <form>
                    <h1 className="text-2xl mb-6 text-slate-800 font-medium">Create New User</h1>
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
                    fieldType="email"
                    fieldName="Email" 
                    name="email" 
                    id="email" 
                    required={true} 
                    onFieldChange={handleFieldChange} 
                    value={formData.email}/>
                    <Input
                    fieldType="password"
                    fieldName="Password" 
                    name="password" 
                    id="password" 
                    required={true} 
                    onFieldChange={handleFieldChange} 
                    value={formData.password}/>
                    <Select 
                    id='select_role'
                    name='role'
                    options={ROLES}
                    label='Role'
                    required={true}
                    onFieldChange={handleFieldChange}
                    value={formData.role}
                    />
                    <div className="flex justify-end w-full mt-6">
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

export default NewUser
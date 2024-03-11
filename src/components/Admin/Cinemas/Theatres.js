import Button from "../../UI/Buttons/Button";
import { useState, useEffect } from "react";
import TabularNav from "../../UI/TabularNav";
import Input from "../../UI/Input";
import Select from "../../UI/Select";
import { BASE_URL, THEATRE_TYPES } from "../../../config/constants";
import ErrorMessage from "../../UI/ErrorMessage";
import { request } from "../../../util/http";
import { useAuth } from "../../../context/AuthContext";

const Theatres = () => {
    const {logout, token} = useAuth();
    const [formOpen, setFormOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        number: '',
        type: 'Standard'
    });
    const [errMessage, setErrMessage] = useState('');
    const [theatres, setTheatres] = useState([]);
    const [fetchErrorMessage, setFetchErrMessage] = useState('');

    useEffect(() => {
        const fetchTheatres = async () => {
            try {
                const response = await request(`${BASE_URL}/theatres`,
                null,
                {})
                setTheatres(response);
                setFetchErrMessage('');
            }
            catch (error) {
                setFetchErrMessage(error.message);
            }
        }

        fetchTheatres();
    }, [])

    const openForm = () => {
        setFormOpen(true);
    }

    const handleFieldChange = (fieldName, value) => {
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: value
        }));
    };

    const handleCancel = () => {
        setFormOpen(false);
        setFormData({
            number: '',
            type: 'Standard'
        });
        setErrMessage('');
    }

    const handleSubmit = () => {
        if (!formData.number){
            setErrMessage('No theatre number added');
            return;
        }
        if (theatres.some(theatre => {
            return theatre.number === formData.number;
        })){
            setErrMessage('Theatre with that number already exists')
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
                        ...formData
                    })
                )
                
                setTheatres(prev => [
                    ...prev,
                    formData
                ])
                setFormData({
                    number: '',
                    type: 'Standard'
                });
                setFormOpen(false);
                setErrMessage('');
            }
            catch (error){
                setErrMessage(error.message);
            }
        }

        sendTheatres();
    }

    const handleEdit = (theatre_number, value) => {
        const theatre = theatres.find(theatre => theatre.number === theatre_number);

        const editTheatre = async () => {
            try {
                await request(`${BASE_URL}/theatre/${theatre.id}`,
                    logout,
                    {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    'PUT',
                    JSON.stringify({
                        number: theatre_number,
                        type: value
                    })
                )
                
                setTheatres(prev => {
                    return prev.map(theatre => {
                        if (theatre.number === theatre_number){
                            theatre.type = value;
                        }
                        return theatre;
                    })
                })
                setEditId(null)
                setFetchErrMessage('');
            }
            catch (error){
                setFetchErrMessage(error.message);
                setEditId(null);
            }
        }

        editTheatre();
    }

    const handleDelete = (theatre_id) => {
        const deleteTheatre = async () => {
            try {
                await request(`${BASE_URL}/theatre/${theatre_id}`,
                    logout,
                    {
                        'Authorization': `Bearer ${token}`
                    },
                    'DELETE',
                )
                
                setTheatres(prev => {
                    return prev.filter(val => {
                        return val.id !== theatre_id; 
                    })
                })
                setFetchErrMessage('');
            }
            catch (error){
                setFetchErrMessage("Error deleting theatre");
            }
        }

        deleteTheatre();
        
    }

    return (
        <>
            <TabularNav
            links={[
                {
                    text: 'Theatres',
                    to: `/admin/theatres`
                }
            ]}/>
            <div className="p-10">
                <div className="flex gap-6 items-center mb-6">
                    <h1 className="text-2xl text-slate-800 font-medium">Manage Theatres</h1>
                    {!formOpen && 
                    <div className='flex'>
                        <Button
                        size="small"
                        colorStyling="primary"
                        onClick={openForm}>
                            Add New
                        </Button>
                    </div>}
                </div>
                {formOpen &&
                <form className="mb-6 max-w-lg">
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
                    <div className="flex justify-end mt-7 gap-4">
                        <Button
                        type='button'
                        colorStyling='accent'
                        onClick={handleCancel}
                        size='medium'>
                            Cancel
                        </Button>
                        <Button
                        type='button'
                        colorStyling='primary'
                        size='medium'
                        onClick={handleSubmit}>
                            Create
                        </Button>
                    </div>
                </form>}
                {fetchErrorMessage &&
                <ErrorMessage
                message={fetchErrorMessage}/>}
                {theatres.length > 0 &&
                    <div className="flex gap-8 flex-wrap">
                        {theatres.sort((a, b) => a.number - b.number).map((theatre) => {
                            return (
                                <div className="bg-white rounded-lg shadow-lg px-10 p-8 flex flex-col items-center justify-between" key={theatre.id}>
                                    <h2 className="text-2xl font-semibold mb-3">Theatre {theatre.number}</h2>
                                    {editId === theatre.id ?
                                    <div>
                                        <Select 
                                        options={THEATRE_TYPES}
                                        name={theatre.number}
                                        onFieldChange={handleEdit}
                                        value={theatre.type}
                                        />
                                    </div> :
                                    <p className="text-lg">
                                        Category: <span className="font-medium">{theatre.type}</span>
                                    </p>
                                    }
                                    <div className="flex gap-4 mt-5">
                                        <Button
                                        colorStyling="secondary"
                                        size="medium"
                                        onClick={() => setEditId(prev =>  prev ? null : theatre.id)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                        colorStyling="accent"
                                        size="medium"
                                        onClick={() => handleDelete(theatre.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                }
            </div>
        </>
    )
}

export default Theatres
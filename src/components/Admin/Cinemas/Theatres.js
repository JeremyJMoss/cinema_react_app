import { useParams } from "react-router-dom";
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
    const {id} = useParams();
    const {logout, token} = useAuth();
    const [formOpen, setFormOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        theatre_number: '',
        theatre_type: 'Standard'
    });
    const [errMessage, setErrMessage] = useState('');
    const [theatres, setTheatres] = useState([]);
    const [fetchErrorMessage, setFetchErrMessage] = useState('');

    useEffect(() => {
        const fetchTheatres = async () => {
            try {
                const response = await request(`${BASE_URL}/theatres/${id}`,
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
    }, [id])

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
            theatre_number: '',
            theatre_type: 'Standard'
        });
        setErrMessage('');
    }

    const handleSubmit = () => {
        if (!formData.theatre_number){
            setErrMessage('No theatre number added');
            return;
        }
        if (theatres.some(theatre => {
            return theatre.theatre_number === formData.theatre_number;
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
                        ...formData,
                        cinema_id: id
                    })
                )
                
                setTheatres(prev => [
                    ...prev,
                    formData
                ])
                setFormData({
                    theatre_number: '',
                    theatre_type: 'Standard'
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
        const theatre = theatres.find(theatre => theatre.theatre_number === theatre_number);

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
                        theatre_number,
                        theatre_type: value,
                        cinema_id: id,
                    })
                )
                
                setTheatres(prev => {
                    return prev.map(theatre => {
                        if (theatre.theatre_number === theatre_number){
                            theatre.theatre_type = value;
                        }
                        return theatre;
                    })
                })
                setEditId(null)
                setFetchErrMessage('');
            }
            catch (error){
                setFetchErrMessage("Error editing theatre");
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
                    text: 'Cinema',
                    to: `/admin/cinemas/edit/${id}`
                },
                {
                    text: 'Theatres',
                    to: `/admin/cinemas/${id}/theatres`
                },
                {
                    text: 'Sessions',
                    to: `/admin/cinemas/${id}/sessions`
                }
            ]}/>
            <div className="max-w-lg p-10">
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
                <form className="mb-6">
                    {errMessage &&
                        <ErrorMessage
                        message={errMessage}/>}
                    <Input
                    fieldType='number'
                    fieldName='Theatre Number'
                    name='theatre_number'
                    id='theatre_number'
                    required={true}
                    onFieldChange={handleFieldChange}
                    value={formData.theatre_number}
                    />
                    <Select
                    onFieldChange={handleFieldChange}
                    options={THEATRE_TYPES}
                    name='theatre_type'
                    id='theatre_type'
                    label="Theatre Type"
                    required={true}
                    value={formData.theatre_type}
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
                    theatres.map((theatre) => {
                        return (
                            <div className="bg-white rounded-lg grow shadow-lg p-8 mb-6 flex flex-col items-center justify-between" key={theatre.id}>
                                <h2 className="text-2xl font-semibold">Theatre {theatre.theatre_number}</h2>
                                {editId === theatre.id ?
                                <div className="mt-4">
                                    <Select 
                                    options={THEATRE_TYPES}
                                    name={theatre.theatre_number}
                                    onFieldChange={handleEdit}
                                    value={theatre.theatre_type}/>
                                </div> :
                                <p className="text-lg">
                                    Category: <span className="font-medium">{theatre.theatre_type}</span>
                                </p>
                                }
                                <div className="flex gap-4 mt-4">
                                    <Button
                                    colorStyling="secondary"
                                    size="medium"
                                    onClick={() => setEditId(theatre.id)}
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
                    })
                }
            </div>
        </>
    )
}

export default Theatres
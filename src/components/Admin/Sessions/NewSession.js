import { useNavigate } from "react-router-dom";
import TabularNav from "../../UI/TabularNav";
import Select from "../../UI/Select";
import { TIMES } from "../../../config/constants";
import { useEffect, useState } from "react";
import { request } from "../../../util/http";
import SelectAjax from "../../UI/SelectAjax";
import { BASE_URL } from "../../../config/constants";
import Button from "../../UI/Buttons/Button";
import DatePicker from "react-datepicker";
import { useAuth } from "../../../context/AuthContext";
import { formatDate } from "../../../util/util";

import "react-datepicker/dist/react-datepicker.css";
import ErrorMessage from "../../UI/ErrorMessage";

const NewSession = () => {
    const { logout, token } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        theatre_id: null,
        session_time: '00:00',
        session_date: null,
        movie_id: ''
    });

    const [timeOptions, setTimeOptions] = useState(TIMES);
    const [searchText, setSearchText] = useState('');
    const [ theatres, setTheatres ] = useState([]);
    const [ errMessage, setErrMessage ] = useState('');

    useEffect(() => {
        const sendFetch = async () => {
            try{
                const response = await request( `${BASE_URL}/theatres`,
                null,
                []);

                if (!response.length > 0){
                    setTheatres([]);
                }

                const theatre_array = response.map(theatre => {
                    return {
                        value: theatre.id,
                        text: `Theatre ${theatre.number}`
                    }
                })

                setFormData({
                    theatre_id: theatre_array[0].value,
                    session_time: '00:00',
                    session_date: null,
                    movie_id: ''
                })

                setTheatres(theatre_array);
                setErrMessage('');

            }
            catch (error) {
                setErrMessage(error.message);
            }

        }

        sendFetch()
    }, [])

    const handleFieldChange = (fieldName, value) => {
        if (fieldName === 'theatre_id'){
            return setFormData({
                theatre_id: value,
                session_time: '00:00',
                session_date: null,
                movie_id: ''
            })
        }
        setFormData(prev => {
            return {
                ...prev,
                [fieldName]: value
            }
        })
    }

    const handleSetMovieId = (value) => {
        // blanking options if will not work with current movie downtime
        const base_down_time = value.run_time + 15;
        const remaining_time = base_down_time % 30;
        const down_time = base_down_time + 30 - remaining_time;
        const intervals = down_time / 30 - 1; 
        setTimeOptions(prev => {
            return prev.map((option, index) => { 
                if (option.disabled){
                    return option;
                }
                
                const newOption = {...option};

                for (let i = 1; i <= intervals; i++){
                    const newIndex = index + i;
                    if (newIndex < prev.length && prev[newIndex].disabled){
                        newOption.disabled = true;
                        break;
                    }
                }

                return newOption;
            })
        })
        setFormData(prev => {
            return {
                ...prev,
                movie_id: value.id,
            }
        })
    }

    const outputTitle = (option) => {
        return option.title;
    }

    const handleChangeDate = (date) => {
        // research
        setFormData(prev => {
            return {
                ...prev,
                movie_id: ''
            }
        })
        setSearchText('');
        const getSessions = async () => {
            
            try {
                const response = await request(`${BASE_URL}/sessions?theatre_id=${formData.theatre_id}&session_date=${formatDate(date)}`,
                null,
                {});

                // set session times back to normal options array with no disabled times
                let session_times = TIMES;

                if (response.length > 0) {
                    // loop through each session and disable session times that are out of bounds
                    response.forEach(session => {
                        const startIndex = TIMES.findIndex((option) => session.session_start_time === option.value);
                        const endIndex = TIMES.findIndex((option) => session.session_end_time === option.value);
                        const session_start_date = new Date(session.session_start_date);
                        const session_end_date = new Date(session.session_start_date);

                        if (session_end_date > session_start_date) {
                            session_times = session_times.map((option, index) => index >= startIndex ? {...option, disabled: true} : option )
                        }
                        else {
                            session_times = session_times.map((option, index) => index >= startIndex && index <= endIndex ? { ...option, disabled: true } : option );
                        }
                    });
                }
                setTimeOptions(session_times);
                setErrMessage('');
            }
            catch (error) {
                setErrMessage(error.message);
            }
            
            
            
        }

        getSessions()

        setFormData(prev => {
            return {
                ...prev,
                session_date: date
            }
        })

    }

    const handleSubmit = () => {
        const sendData = async () => {
            try {
                await request(`${BASE_URL}/session`,
                logout,
                {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                'POST',
                JSON.stringify({
                    theatre_id: formData.theatre_id,
                    session_time: formData.session_time,
                    session_date: formatDate(formData.session_date),
                    movie_id: formData.movie_id
                }))

                setErrMessage('');
                navigate(`/admin/sessions`)
            }
            catch (error) {
                setErrMessage(error.message);
            }
        }

        sendData()
    }


    return (
        <>
            <div className="max-w-lg p-10">
                {errMessage && 
                <ErrorMessage
                message={errMessage}/>}
                <form>
                    <h1 className="text-2xl mb-6 text-slate-800 font-medium">Create New Session</h1>
                    {theatres && 
                    <Select
                    label="Theatre Number"
                    name="theatre_id"
                    id="theatre_number"
                    onFieldChange={handleFieldChange}
                    value={formData.theatre_id}
                    required={true}
                    options={theatres}
                    />}
                    {formData.theatre_id && <div className='flex grow flex-col'>
                        <label className="mb-3 sm:text-lg" htmlFor="session_date">Session Date <span className="text-red-500">*</span></label>
                        <DatePicker
                        id="session_date"
                        minDate={new Date()}
                        placeholderText="Click to select session date"
                        withPortal
                        portalId="body"
                        selected={formData.session_date}
                        onChange={handleChangeDate}
                        dateFormat="dd/MM/yyyy"
                        />
                    </div>}
                    {formData.session_date && 
                    <SelectAjax
                    reqFunc={(value) => request(
                        `${BASE_URL}/movies/search?searchQuery=${value}`,
                        null,
                        {}
                    )}
                    outputOptionText={(option) => outputTitle(option)}
                    label="Movie"
                    setData={handleSetMovieId}
                    required={true}
                    name="movie"
                    id="movie_select"
                    setSearchText={setSearchText}
                    searchText={searchText}
                    />}
                    {formData.session_date && formData.movie_id && 
                    <Select
                    label="Session Time"
                    options={timeOptions}
                    name="session_time"
                    id="session_time"
                    value={formData.session_time}
                    onFieldChange={handleFieldChange}
                    required={true}
                    />}
                    
                    <div className="flex justify-end mt-5">
                        <Button
                        type="button"
                        colorStyling="primary"
                        size="medium"
                        onClick={handleSubmit}>
                            Create
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default NewSession
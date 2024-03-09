import { useParams } from "react-router-dom";
import TabularNav from "../../UI/TabularNav";
import Select from "../../UI/Select";
import { TIMES } from "../../../config/constants";
import { useState } from "react";
import { request } from "../../../util/http";
import SelectAjax from "../../UI/SelectAjax";
import { BASE_URL } from "../../../config/constants";
import Button from "../../UI/Buttons/Button";
import DatePicker from "react-datepicker";
import { useAuth } from "../../../context/AuthContext";
import { formatDate } from "../../../util/util";

import "react-datepicker/dist/react-datepicker.css";

const NewSession = () => {
    const { cinema_id, theatre_id } = useParams();
    const { logout, token } = useAuth();

    const [formData, setFormData] = useState({
        session_time: '0:00',
        session_date: null,
        movie_id: '',
        theatre_down_time: null
    });

    const [timeOptions, setTimeOptions] = useState(TIMES);
    const [searchText, setSearchText] = useState('');

    const handleFieldChange = (fieldName, value) => {
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
        setTimeOptions(prev => {
            return prev.map((option, index) => {
                if (option.disabled){
                    return option;
                }
                
                const intervals = down_time / 30 - 1;

                for (let i = 1; i <= intervals; i++){
                    const newIndex = index + i;
                    if (newIndex < 48 && prev[newIndex].disabled){
                        option.disabled = true;
                    }
                }

                return option;
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
        setFormData(prev => {
            return {
                ...prev,
                movie_id: ''
            }
        })
        setSearchText('');
        const getSessions = async () => {
            
            try {
                const response = await request(`${BASE_URL}/sessions?theatre_id=${theatre_id}&session_date=${formatDate(date)}`,
                null,
                {});

                if (response.length > 0) {
                    let session_times = TIMES;

                    response.forEach(session => {
                        const startIndex = TIMES.findIndex((option) => session.session_start_time === option.value);
                        const endIndex = TIMES.findIndex((option) => session.session_end_time === option.value);
                        const session_start_date = new Date(session.session_start_date);
                        const session_end_date = new Date(session.session_start_date);


                        if (session_end_date > session_start_date) {
                            session_times = session_times.map((option, index) => {
                                    if (index >= startIndex){
                                        option.disabled = true;
                                    }
                                    return option;  
                            })
                        }
                        else {
                            session_times = session_times.map((option, index) =>{
                                if (index >= startIndex && index <= endIndex){
                                    option.disabled = true;
                                }
                                return option;
                            })
                        }

                    });

                    setTimeOptions(session_times);
                }
            }
            catch (error) {
                console.log(error);
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
                const result = await request(`${BASE_URL}/session`,
                logout,
                {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                'POST',
                JSON.stringify({
                    theatre_id,
                    session_time: formData.session_time,
                    session_date: formatDate(formData.session_date),
                    movie_id: formData.movie_id
                }))

                console.log(result);
            }
            catch (error) {
                console.log(error);
            }
        }

        sendData()
    }


    return (
        <>
            <TabularNav
            links={[
                {
                    text: 'Cinema',
                    to: `/admin/cinemas/edit/${cinema_id}`
                },
                {
                    text: 'Theatres',
                    to: `/admin/cinemas/${cinema_id}/theatres`
                },
                {
                    text: 'Sessions',
                    to: `/admin/cinemas/${cinema_id}/sessions`
                }
            ]}/>
            <div className="max-w-lg p-10">
                <form>
                    <h1 className="text-2xl mb-6 text-slate-800 font-medium">Create New Session</h1>
                    <div className='flex grow flex-col'>
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
                    </div>
                    {formData.session_date && <SelectAjax
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
                    {formData.session_date && formData.movie_id && <Select
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
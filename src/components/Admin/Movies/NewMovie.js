import Input from "../../UI/Input"
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { RATINGS, BASE_URL } from "../../../config/constants";
import Select from "../../UI/Select";
import Button from "../../UI/Buttons/Button";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../UI/ErrorMessage";
import { request } from "../../../util/http";
import CoverArtInput from "../CoverArtInput";

const NewMovie = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [errMessage, setErrMessage] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        run_time: '',
        release_date: '',
        rating: 'G',
        cover_art: null,
        director: ''
    });

    const [uploadPreview, setUploadPreview] = useState(null);
    const [fileName, setFileName] = useState('');

    const handleFieldChange = (fieldName, value) => {
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files?.length > 0){
            const file = e.target.files[0];
            const { name: fileName, size } = file;
            const fileSize = (size / 1000).toFixed(2);
            const fileNameAndSize = `${fileName} - ${fileSize}KB`;
            setFileName(fileNameAndSize);
            const reader = new FileReader();
            reader.onload = function(e) {
                const dataURL = e.target.result;
                setFormData(prevData => ({
                    ...prevData,
                    cover_art: file
                }))
                setUploadPreview(dataURL);
            }

            reader.readAsDataURL(file);
        }
    }

    const handleSubmit = () => {
        const postData = async () => {
            const formDataToSend = new FormData();
            for (const [name, value] of Object.entries(formData)){
                formDataToSend.append(name, value);
            }
            try {
                await request(`${BASE_URL}/movie`,
                    logout,
                    {
                        'Authorization': `Bearer ${token}` 
                    },
                    "POST",
                    formDataToSend
                );
                setErrMessage('');
                navigate('/admin/movies');
            } catch(error){
                setErrMessage(error.message);
            }
        }

        postData();
    }

    return (
        <section className="p-10 w-full h-full">
            <div className="max-w-lg">
                {errMessage && 
                <ErrorMessage
                message={errMessage}/>}
                <div className="mb-7">
                    <h1 className="text-2xl mb-6 text-slate-800 font-medium">Create New Movie</h1>
                    <Input
                    fieldType="text"
                    fieldName="Title" 
                    name="title" 
                    id="title" 
                    required={true} 
                    onFieldChange={handleFieldChange} 
                    value={formData.title}
                    />
                    
                    <Input
                    fieldType="textarea"
                    fieldName="Summary" 
                    name="summary" 
                    id="summary" 
                    required={true} 
                    onFieldChange={handleFieldChange} 
                    value={formData.summary}
                    />
                    
                    <Input
                    fieldType="number"
                    fieldName="Runtime(mins)" 
                    name="run_time" 
                    id="run_time" 
                    required={true} 
                    onFieldChange={handleFieldChange} 
                    value={formData.run_time}
                    />
                    
                    <Input
                    fieldType="date"
                    fieldName="Release Date" 
                    name="release_date" 
                    id="release_date" 
                    required={true}
                    onFieldChange={handleFieldChange} 
                    value={formData.release_date}
                    />

                    <Select
                    onFieldChange={handleFieldChange}
                    options={RATINGS}
                    name="rating"
                    id='rating'
                    label="Rating"
                    required={false}
                    value={formData.rating}
                    />

                    <CoverArtInput
                    onChange={handleFileChange}
                    fileName={fileName}
                    cover_art_url={formData.cover_art}
                    uploadPreview={uploadPreview}
                    />

                    <Input
                    fieldType="text"
                    fieldName="Director" 
                    name="director" 
                    id="director" 
                    required={false} 
                    onFieldChange={handleFieldChange} 
                    value={formData.director}
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
                </div>
            </div>
        </section>
    )
}

export default NewMovie;
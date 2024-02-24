import { useState, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext";
import { RATINGS, BASE_URL } from "../../../config/constants";
import Select from "../../UI/Select";
import Input from "../../UI/Input";
import Button from "../../UI/Buttons/Button";
import ErrorMessage from "../../UI/ErrorMessage";
import { request } from "../../../util/http";
import { useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import CoverArtInput from "../CoverArtInput";

const EditMovie = () => {
    const {id} = useParams();
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        run_time: null,
        release_date: '',
        rating: 'G',
        cover_art: null,
        director: ''
    });

    const [uploadPreview, setUploadPreview] = useState(false);
    const [fileName, setFileName] = useState('');

    const sendFetch = useCallback(async () => {
        const result = await request(
        `${BASE_URL}/movie/${id}`,
        logout,
        {}
        )

        setFormData({
            title: result.title,
            summary: result.summary,
            run_time: result.run_time,
            release_date: result.release_date,
            rating: result.rating,
            director: result.director,
            cover_art: result.cover_art
        })

        return result;

    }, [logout, id]);


    const {
        isFetching,
        data: movieToEdit,
        errMessage,
        setErrMessage
    } = useFetch(sendFetch, null)


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
            formDataToSend.append('id', id);
            for (const [name, value] of Object.entries(formData)){
                formDataToSend.append(name, value);
            }
            try {
                await request(`${BASE_URL}/movie`,
                    logout,
                    {
                        'Authorization': `Bearer ${token}` 
                    },
                    "PUT",
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
                {isFetching &&
                <div>Loading...</div>
                }
                {movieToEdit && !isFetching &&
                    <form>
                        <div className="mb-7">
                            <h1 className="text-2xl mb-6 text-slate-800 font-medium">Edit Movie</h1>
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
                            required={true}
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
                                    Update
                                </Button>
                            </div>
                        </div>
                    </form>}
                </div>
            </section>
    )
}

export default EditMovie;
import { useState, useRef, useEffect     } from "react";
import closeImg from "../../assets/icons8-close.svg";
import Input from "../UI/Input";
import { BASE_URL } from "../../config/constants";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Button from "../UI/Buttons/Button";
import ErrorMessage from "../UI/ErrorMessage";
import { createPortal } from "react-dom";

function Login({setModalClose}) {
    const closeBtnRef = useRef(null);
    const loginBtnRef = useRef(null);
    const {login} = useAuth();
    const [LoginError, setLoginError] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        const handleEscapeModal = (e) => {
            if (e.key === 'Escape'){
                setModalClose();
            }
        }

        const cleanup = () => {
            window.removeEventListener('keydown', handleEscapeModal)
        };

        window.addEventListener('keydown', handleEscapeModal);

        return cleanup;
    }, [setModalClose])

    useEffect(() => {
        if (closeBtnRef && closeBtnRef.current){
            closeBtnRef.current.focus();
        }
    }, [closeBtnRef])

    const handleFieldChange = (fieldName, value) => {
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: value
        }));
    };

    const handleSubmit = () => {
        fetch(BASE_URL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(async response => {
            if (!response.ok){
                const err = await response.json();
                throw new Error(err.message);
            }
            else {
                const result = await response.json();
                if (result.token){
                    login(result.token)
                    setFormData({
                        email: '',
                        password: ''
                    })
                    setLoginError('');
                    setModalClose();
                }
                else{
                    throw new Error('No token found in response. Please try again')
                }
            } 
        })
        .catch(err => {
            setLoginError(err.message);
        })
    }

    const handleCloseModal = () => {
        setModalClose();
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter"){
            handleSubmit();
        }
    }

    const handleTab = (e) => {
        if (e.key === "Tab" && !e.shiftKey){
            e.preventDefault();
            closeBtnRef.current.focus();
        }
    }

    const handleShiftTab = (e) => {
        if (e.key === "Tab" && e.shiftKey){
            e.preventDefault();
            loginBtnRef.current.focus();
        }
    }

  return createPortal(
    <div className="bg-stone-900/90 h-full w-full fixed z-10 justify-center items-center top-0 right-0 flex" onClick={handleCloseModal}>
        <div className="md:w-4/5 md:h-auto bg-slate-200 rounded w-full h-full flex overflow-hidden min-w-80 max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <form className="flex grow flex-col">
                <div className="w-full flex justify-end">
                    <button 
                    onClick={handleCloseModal} 
                    type="button"
                    ref={closeBtnRef}
                    onKeyDown={handleShiftTab}
                    className="bg-cyan-600 hover:cursor-pointer hover:bg-cyan-900 duration-100 border-none rounded-sm p-1">
                        <img className="w-7" src={closeImg} alt=""/>
                    </button>
                </div>
                <div className="login-modal_header flex w-full px-6 mb-5">
                    <h2 className="text-4xl underline underline-offset-6 decoration-red-500">Log In</h2>
                </div>
                <div className="p-6">
                    { LoginError && 
                    <ErrorMessage
                    message={LoginError}/>}
                    <Input
                    fieldType="email"
                    fieldName="Email Address"
                    name="email"
                    id="login_email"
                    required={true}
                    onFieldChange={handleFieldChange}
                    value={formData.email}
                    />

                    <Input
                    fieldType="password"
                    fieldName="Password"
                    name="password"
                    id="login_password"
                    required={true}
                    onFieldChange={handleFieldChange}
                    value={formData.password}
                    onKeyDown={handleKeyDown}
                    />
                </div>
                <div className="w-full flex justify-between items-center p-6 mt-auto">
                    <Link to="/signup">New User? Sign up here.</Link>
                    <Button 
                    colorStyling='accent'
                    size='medium'
                    type="button" 
                    onClick={handleSubmit}
                    ref={loginBtnRef}
                    onKeyDown={handleTab}>
                        Log In
                    </Button>
                </div>
            </form>
        </div>
    </div>,
    document.body
  )
}

export default Login;
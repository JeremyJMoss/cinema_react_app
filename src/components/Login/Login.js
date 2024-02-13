import { useState } from "react";
import closeImg from "../../assets/icons8-close.svg";
import LoginField from "./LoginField";

function Login({setModalClose}) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleFieldChange = (fieldName, value) => {
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: value
        }));
    };

    const handleSubmit = () => {
        console.log(formData);
    }

    const handleCloseModal = () => {
        setModalClose(false);
        setFormData({
            email: '',
            password: ''
        })
    }

  return (
    <>
        <div className="login-modal_backdrop" onClick={handleCloseModal}>
            <div className="login-modal" onClick={(e) => e.stopPropagation()}>
                <form className="login-modal_body">
                    <div className="login-modal_close-section">
                        <button onClick={handleCloseModal} type="button" className="login-modal_close">
                            <img src={closeImg}/>
                        </button>
                    </div>
                    <div className="login-modal_header">
                        <h2 className="font-xxl">Sign In</h2>
                    </div>
                    <div className="login-modal_inputs">
                        <LoginField
                        fieldType="email"
                        fieldName="Email Address"
                        name="email"
                        id="login_email"
                        required={true}
                        onFieldChange={handleFieldChange}
                        />

                        <LoginField
                        fieldType="password"
                        fieldName="Password"
                        name="password"
                        id="login_password"
                        required={true}
                        onFieldChange={handleFieldChange}
                        />
                    </div>
                    <div className="login-modal_button-container">
                        <a href="#">New User? Sign up here.</a>
                        <button className="btn btn-primary btn-small" type="button" onClick={handleSubmit}>Sign In</button>
                    </div>
                </form>
            </div>
        </div>
    </>
  )
}

export default Login
import Input from "../UI/Input";
import Button from "../UI/Buttons/Button";
import { useState } from "react";
import LoadingDots from "../UI/LoadingDots";
import { BASE_URL } from "../../config/constants";
import { request } from "../../util/http";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../UI/ErrorMessage";

const Signup = () => {
  const navigate = useNavigate();
  const { logout, token } = useAuth()
  const [ errMessage, setErrMessage ] = useState('');
  const [ isSubmitting, setIsSubmitting ] = useState('');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'user'
  })

  const handleFieldChange = (fieldName, value) => {
    setFormData(prevData => ({
        ...prevData,
        [fieldName]: value
    }));
  };

  const handleSubmit = () => {
    if (formData.password !== formData.confirm_password){
      setErrMessage("Passwords don't match!");
      return;
    }

    const postData = async () => {
      try {
          setIsSubmitting(true);
          await request(`${BASE_URL}/signup`,
              logout,
              {
                  'Authentication': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              },
              'POST',
              JSON.stringify({
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password,
                role: formData.role
              })
          )
          
          setErrMessage('');
          navigate('/');
      }
      catch(error) {
          setErrMessage(error.message);
      }
      finally {
        setIsSubmitting(false);
      }
    }
  
    postData()
  }

  return (
    <section className="flex flex-col items-center">
      <h1 className="text-xl font-semibold sm:text-3xl sm:font-medium">Welcome to Moss Cinema</h1>
      <p className="text-md sm:text-lg text-center py-4 max-w-md">Create your profile below to enjoy access to a range of exclusive movie experiences.</p>
      {errMessage &&
      <ErrorMessage
      message={errMessage}
      />
      }
      <form className="rounded-xl w-full md:min-w-none bg-slate-200 py-10 px-14 flex flex-col max-w-3xl">
        <Input
        fieldType="text"
        id="first_name"
        name="first_name"
        fieldName="First Name"
        value={formData.first_name}
        onFieldChange={handleFieldChange}
        />
        <Input
        fieldType="text"
        id="last_name"
        name="last_name"
        fieldName="Last Name"
        value={formData.last_name}
        onFieldChange={handleFieldChange}
        />
        <Input
        fieldType="email"
        id="email"
        name="email"
        fieldName="Email Address"
        value={formData.email}
        onFieldChange={handleFieldChange}
        />
        <Input
        fieldType="password"
        id="password"
        name="password"
        fieldName="Password"
        value={formData.password}
        onFieldChange={handleFieldChange}
        />
        <Input
        fieldType="password"
        id="confirm_password"
        name="confirm_password"
        fieldName="Confirm Password"
        value={formData.confirm_password}
        onFieldChange={handleFieldChange}
        />
        <div className="flex justify-end mt-4">
          <Button
          size="large"
          type="button"
          onClick={handleSubmit}
          >
            {!isSubmitting && <span>Signup</span>}
            {isSubmitting && <LoadingDots/>}
          </Button>
        </div>
      </form>
    </section>
  )
}

export default Signup
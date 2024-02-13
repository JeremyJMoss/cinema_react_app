const LoginField = ({fieldType, fieldName, name, id, required, onFieldChange}) => {
    const handleChange = (event) => {
        const { value } = event.target;
        onFieldChange(name, value);
    };
  
    return (
        <div className="login-modal_input-field">
            <label htmlFor={name}>
                {fieldName}
                {required && <span className="text-danger"> *</span>}</label>
            <input 
            type={fieldType} 
            name={name} 
            id={id}
            onChange={handleChange}/>
        </div>
    )
}

export default LoginField;
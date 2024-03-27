const Input = ({fieldType, fieldName, name, required, onFieldChange, ...props}) => {
    const handleChange = (event) => {
        const { value } = event.target;
        if (onFieldChange){
            onFieldChange(name, value);
        }
        
    };
  
    return (
        <div className="flex flex-col grow">
            <label 
            htmlFor={name}
            className="mb-4 text-md sm:text-lg">
                {fieldName}
                {required && <span className="text-red-500"> *</span>}</label>
            {fieldType !== 'textarea' &&
            <input 
            type={fieldType}
            name={name}
            className="py-2 px-5 mb-3 text-lg border-2 border-slate-300 rounded-md"
            onChange={handleChange}
            {...props}/>
            }
            {fieldType === 'textarea' &&
            <textarea
            name={name}
            className="py-2 px-5 mb-3 text-lg border-2 rounded-md"
            onChange={handleChange}
            rows="6"
            {...props}
            >
            </textarea>}
        </div>
    )
}

export default Input;
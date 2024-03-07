const Input = ({fieldType, fieldName, name, id, required, onFieldChange, value, onKeyDown}) => {
    const handleChange = (event) => {
        const { value } = event.target;
        if (onFieldChange){
            onFieldChange(name, value);
        }
        
    };
  
    return (
        <div className="flex flex-col">
            <label 
            htmlFor={name}
            className="mb-4 text-md sm:text-lg">
                {fieldName}
                {required && <span className="text-red-500"> *</span>}</label>
            {fieldType !== 'textarea' &&
            <input 
            type={fieldType}
            className="py-2 px-5 mb-3 text-lg border-2 border-slate-300 rounded-md"
            name={name} 
            id={id}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            value={value}/>}
            {fieldType === 'textarea' &&
            <textarea
            className="py-2 px-5 mb-3 text-lg border-2 rounded-md"
            id={id} 
            name={name}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            rows="6"
            value={value}
            >
            </textarea>}
        </div>
    )
}

export default Input;
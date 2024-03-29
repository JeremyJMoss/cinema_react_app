const Select = ({options, id, name, label, required, onFieldChange, value, ...props}) => {
    const handleChange = (event) => {
        const { value } = event.target;
        onFieldChange(name, value);
    };

    return (
        <div className="flex flex-col mb-3">
            {label && <label htmlFor={id} className="mb-4 text-md sm:text-lg">
                {label}{required && <span className="text-red-500"> *</span>}
            </label>}
            <select
            name={name}
            id={id}
            onChange={handleChange}
            required={required}
            value={value}
            aria-required={required}
            className='py-2 px-5 text-md appearance-none sm:text-lg bg-white border-2 border-slate-300 rounded-md'
            {...props}
            >
                {options && options.length > 0 &&
                    options.map((opt) => <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.text}</option>)
                }
            </select>
        </div>
    )
}

export default Select
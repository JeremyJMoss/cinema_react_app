

const Select = ({options, id, name, label, required, onFieldChange, value}) => {
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
            className='py-2 px-5 appearance-none text-md sm:text-lg bg-white border-2 border-slate-300 rounded-md'
            >
                {options && options.length > 0 &&
                    options.map((opt) => <option key={opt.value} value={opt.value}>{opt.text}</option>)
                }
            </select>
        </div>
    )
}

export default Select
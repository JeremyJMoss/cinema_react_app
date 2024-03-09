import { useState } from "react";

const SelectAjax = ({disabled, label, required, id, name, setData, reqFunc, outputOptionText, setSearchText, searchText}) => {
    const [options, setOptions] = useState([]);
    const [timer, setTimer] = useState('');
    const [errMessage, setErrMessage] = useState('');

    const handleBlur = (e) => {
        // Making dropdown tabbable
        if (!e.nativeEvent?.relatedTarget?.closest('#dropdown')){
            setOptions([]);
            setErrMessage('');
        }   
    }

    const handleChange = (e) => {
        const {value} = e.target;
        setSearchText(value);

        if (timer){
            clearTimeout(timer);
        }

        if (value?.length > 1){
            const newTimer = setTimeout(() => {
                const sendFetch = async () => {
                    try{
                        let result = await reqFunc(value);
                        setOptions(result);
                        setErrMessage('');
                    }
                    catch (error){
                        setErrMessage(error.message);
                        setOptions([]);
                    }
                }

                sendFetch();
            }, 500);
            setTimer(newTimer);
        }
        else {
            setOptions([]);
            setErrMessage('');
        }
    }

    const handleClickOption = (option) => {
        setSearchText(option.title);
        setData(option);
        setOptions([]);
    }

    return (
        <div className="flex flex-col">
            <label 
            htmlFor={name}
            className="mb-4 text-md sm:text-lg">
            {label}
            {required && <span className="text-red-500"> *</span>}
            </label>
            <div className="relative w-full">
                <input 
                type='text'
                className="py-2 px-5 mb-3 text-lg border-2 border-slate-300 rounded-md w-full"
                name={name} 
                id={id}
                onChange={handleChange}
                value={searchText}
                onBlur={handleBlur}
                autoComplete="false"
                disabled={disabled}
                />
                {(options.length > 0 || errMessage) &&
                <div id="dropdown" className='w-full z-10 absolute bg-white border-x-2 border-t-2 border-slate-300 rounded-t-md bottom-full'>
                    {errMessage && 
                    <p className="w-full text-left p-3 text-lg">{errMessage}</p>}
                    {options.length > 0 && !errMessage &&
                    <ul className="flex flex-col gap-1">
                        {options.map((option) => {
                            return (
                            <li 
                            key={option.id} 
                            className="p-3 hover:bg-slate-100">
                                <button 
                                onBlur={handleBlur}
                                onClick={() => handleClickOption(option)}
                                type="button"
                                className="w-full text-left pl-3 text-lg">
                                    {outputOptionText(option)}
                                </button>
                            </li>
                            )
                        })}
                    </ul>}
                </div>}
            </div>
        </div>
    )
}

export default SelectAjax
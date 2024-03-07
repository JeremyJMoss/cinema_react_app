import { useState } from "react"

const SelectAjax = ({name, id, fieldName, required, setData, data, reqFunc}) => {
    const [searchText, setSearchText] = useState('');
    const [timer, setTimer] = useState(null);
    const [matchingData, setMatchingData] = useState([]);
    const [errMessage, setErrMessage] = useState('');

    const handleBlur = (e) => {
        // Making dropdown tabbable
        if (!e.nativeEvent?.relatedTarget?.closest('#dropdown')){
            setMatchingData([]);
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
                        if (data.length > 0){
                        result = result.filter(segment => {
                            for (const element of data){
                                if (segment.id === element.id){
                                    return false;
                                }
                            }
                            return true;
                        })
                        }
                        setMatchingData(result);
                        setErrMessage('');
                    }
                    catch (error){
                        setErrMessage(error.message);
                        setMatchingData([]);
                    }
                }

                sendFetch();
            }, 500);
            setTimer(newTimer);
        }
        else {
            setMatchingData([]);
            setErrMessage('');
        }
    }

    const handleClickOption = (value) => {
        setData(value)
        setMatchingData([]);
        setSearchText('');
    }

    const handleClickDelete = (value) => {
        setData(value, true);
    }

    const addNewElement = () => {
        setData({name: searchText});
        setMatchingData([]);
        setSearchText('');
        setErrMessage('');
    }
  
    return (
        <div className="flex flex-col">
            <label 
            htmlFor={name}
            className="mb-4 text-md sm:text-lg">
            {fieldName}
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
                />
                {(matchingData.length > 0 || errMessage) &&
                <div id="dropdown" className='w-full absolute bg-white border-x-2 border-t-2 border-slate-300 rounded-t-md bottom-full'>
                    {errMessage &&
                    <>
                        <p className="px-3 py-2 text-lg">{errMessage}!</p>
                        <button 
                        onClick={addNewElement}
                        type="button"
                        className="font-semibold px-3 py-2 text-lg w-full text-left">{searchText}</button>
                    </>}
                    {matchingData.length > 0 && !errMessage &&
                    <ul className="flex flex-col gap-1">
                        {matchingData.map((el) => {
                            return (
                            <li 
                            key={el.id} 
                            className="p-3 hover:bg-slate-100">
                                <button 
                                onBlur={handleBlur}
                                onClick={() => handleClickOption(el)}
                                type="button"
                                className="w-full text-left pl-3 text-lg">
                                    {el.name}
                                </button>
                            </li>
                            )
                        })}
                    </ul>}
                </div>}
            </div>
            <div className="flex gap-3 flex-wrap">
                {data?.length > 0 && 
                data.map((el) => {
                    return (
                    <div key={el.id} className="flex items-center bg-orange-200 rounded-xl">
                        <p className="mr-1 ml-2 text-nowrap">{el.name}</p>
                        <button 
                        className="text-xs p-2 font-bold"
                        onClick={() => handleClickDelete(el)}>X</button>
                    </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SelectAjax
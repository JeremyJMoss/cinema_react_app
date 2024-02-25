import { useEffect, useState } from 'react';

export function useFetch(fetchFn, initialValue){
    const [isFetching, setIsFetching] = useState(true);
    const [errMessage, setErrMessage] = useState('');
    const [data, setData] = useState(initialValue);

    useEffect(() => {
        async function fetchData(){
            setIsFetching(true);
            try {
                const data = await fetchFn();
                setData(data);
                setErrMessage('');
            } catch(error){
                setErrMessage(error.message);
            }
            setIsFetching(false);

        }

        fetchData();
    }, [fetchFn])

    return {
        isFetching,
        errMessage,
        setErrMessage,
        data,
        setData
    }
}
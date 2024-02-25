import { useEffect, useRef, useCallback } from 'react';
import { BASE_URL } from '../../../config/constants'
import { useAuth } from '../../../context/AuthContext'
import Button from '../../UI/Buttons/Button';
import { createPortal } from 'react-dom';
import { request } from '../../../util/http';
import { useFetch } from '../../../hooks/useFetch';

const DeleteModal = ({deleteId, setDeleteId, onDelete, baseRoute}) => {
    const deleteBtnRef = useRef(null);
    const cancelBtnRef = useRef(null);
    const {token, logout} = useAuth();

    const sendFetch = useCallback(async () => {
        return await request(
        `${BASE_URL}${baseRoute}/${deleteId}`, 
        logout, 
        {
            'Authorization': `Bearer ${token}`
        }
    )}, [token, logout, baseRoute, deleteId])

    const {
        isFetching,
        data: entityToDelete,
        errMessage,
        setErrMessage
    } = useFetch(sendFetch, null)

    useEffect(() => {
        const handleEscapeModal = (e) => {
            if (e.key === 'Escape'){
                setDeleteId(null);
            }
        }

        const cleanup = () => {
            window.removeEventListener('keydown', handleEscapeModal)
        };

        window.addEventListener('keydown', handleEscapeModal);

        return cleanup;
    }, [setDeleteId])

    const handleCancel = () => {
        setDeleteId(null);
    }

    const handleDelete = () => {
        request(
            `${BASE_URL}${baseRoute}/${deleteId}`,
            logout,
            {
                'Authorization': `Bearer ${token}`
            },
            "DELETE",
        ).then(() => {
            onDelete(deleteId);
            setErrMessage('');
        }).catch (error => {
            setErrMessage(error.message);
        })
    }

    // focus trap within modal
    const handleShiftTab = (e) => {
        if (e.key === "Tab" && e.shiftKey) {
            e.preventDefault();
            const secondElement = cancelBtnRef.current;
            secondElement.focus();
        }
    }

    const handleTab = (e) => {
        if (e.key === "Tab" && !e.shiftKey){
            e.preventDefault();
            const firstElement = deleteBtnRef.current;
            firstElement.focus();
        }
        
    }

    return createPortal(
        <div className='bg-stone-900/90 fixed top-0 left-0 z-10 w-full h-full items-center justify-center flex' onClick={handleCancel}>
            <dialog className='flex flex-col items-center static p-10 rounded' onClick={(e) => e.stopPropagation()}>               
                { errMessage && !isFetching &&
                <div className="w-full flex items-center justify-center mb-4">
                    <div className="bg-error px-8 py-4 rounded text-center">{errMessage}</div>
                </div>}
                { entityToDelete && !isFetching &&
                <>
                    <p className="mb-5 text-center">
                    {baseRoute === '/user' && `Are you sure you wish to delete ${entityToDelete.first_name} ${entityToDelete.last_name} with email ${entityToDelete.email}?`}
                    {baseRoute === '/movie' && `Are you sure you wish to delete ${entityToDelete.title}?`}
                    </p> 
                    <div className="flex gap-5">
                        <Button
                        colorStyling='accent'
                        size='medium'
                        onClick={handleDelete}
                        ref={deleteBtnRef}
                        onKeyDown={handleShiftTab}
                        >
                            Delete
                        </Button>
                        <Button
                        colorStyling='primary'
                        size='medium'
                        onClick={handleCancel}
                        ref={cancelBtnRef}
                        onKeyDown={handleTab}>
                            Cancel
                        </Button>
                    </div>
                </>
                }
                {isFetching && <div>Loading...</div>}
            </dialog>
        </div>, document.body)
};

export default DeleteModal
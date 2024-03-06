import leftArrow from "../../assets/icons8-left-arrow.png";
import rightArrow from "../../assets/icons8-right-arrow.png";


const Pagination = ({page, totalPages, handlePagination}) => {
    const handleChangePage = (isForward) => {
        if (!isForward){
            handlePagination(prev => {
                return --prev;
            })
            return;
        }
        handlePagination(prev => {
            return ++prev;
        })
        
    }

    return (
        <div className='w-full flex justify-center mt-5'>
            <div className="gap-5 flex justify-center bg-green-200 px-5 rounded-xl">
                {page !== 1 && 
                <button
                onClick={() => handleChangePage(false)}
                className="flex items-center p-2"
                >
                    <img src={leftArrow} className="mr-1 w-4" alt="previous button icon"/>
                    <p>Previous</p>
                </button>}
                <p className="font-medium p-2">Page <span className="font-extrabold">{page}</span> of <span className="font-extrabold">{totalPages}</span></p>
                {page !== totalPages && 
                <button 
                onClick={() => handleChangePage(true)}
                className="flex items-center p-2">
                    <p >Next</p>
                    <img src={rightArrow} className="ml-1 w-4" alt="next button icon"/>
                </button>}
            </div>
        </div>
    )
}

export default Pagination
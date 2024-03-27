import { useEffect, useState } from "react"
import { BASE_URL } from "../../config/constants"
import { request } from "../../util/http"
import ErrorMessage from "../UI/ErrorMessage";
const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

function SeatGrid({ theatre_id, selectedSeats, setSelectedSeats }) {
  const [ seats, setSeats ] = useState([]);
  const [ errMessage, setErrMessage ] = useState('');
  const [ isFetching, setIsFetching ] = useState(false);

  useEffect(() => {
    const sendFetch = async () => {
      try {
        setIsFetching(true);
        const response = await request(`${BASE_URL}/seat-structures?theatre_id=${theatre_id}`)
        setSeats(response);
        setErrMessage('');
      }
      catch (error) {
        setErrMessage(error.message);
      }
      finally {
        setIsFetching(false);
      }
    }

    sendFetch()
  }, [theatre_id])

  const handleClick = (seat) => {
    setSelectedSeats(prev => {
      if (prev.includes(seat)){
        return prev;
      }
      return [
        ...prev,
        seat
      ]
    })
  }

  return (
    <section className='flex items-center flex-col my-8'>
        {isFetching && <div>Loading...</div>}
        {errMessage && !isFetching && 
        <ErrorMessage
        message={errMessage}/>}
        {!isFetching && !errMessage &&
        <>
        <div>
          <h2 className="font-semibold text-lg mb-8">Choose Your Seats</h2>
        </div>
        <div className="flex gap-10">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 bg-blue-300 rounded"></div>
            <p>Standard</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 p-1 bg-orange-300 rounded">
                <div role="img" className="seat-disabled w-full h-full">
                </div>
            </div>
            <p>Disabled</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 bg-red-300 rounded"></div>
            <p>Unavailable</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 p-1 bg-green-300 rounded">
                <div role="img" className="seat-selected w-full h-full">
                </div>
            </div>
            <p>Selected</p>
          </div>
        </div>
        <div className="grid gap-2 mt-8">
          {seats.length > 0 &&
            <>
              {seats.map((row, row_index) => {
                return (
                    <div 
                    before={alphabet[row_index]} 
                    role="row" 
                    key={alphabet[row_index]} 
                    className="h-8 flex gap-2 items-center before:content-[attr(before)] relative before:absolute before:-left-8"
                    >
                        {row.map((col, _) => {
                            let background = ' transparent';
                            if (!col.is_empty){
                                background = col.seat_type === "disabled" ? ' bg-orange-300' : ' bg-blue-300';
                            }
                            if (selectedSeats.includes(col.seat_number)){
                              background = ' bg-green-300' 
                            }
                            return (
                                <div 
                                role="cell"
                                key={col.seat_number}
                                onClick={!col.is_empty ? () => handleClick(col.seat_number) : null}
                                className={`w-8 h-8 p-1 rounded${!col.is_empty ? ' cursor-pointer' : ''}${background}`} 
                                >
                                    <div 
                                    role={col.seat_type === "disabled" || selectedSeats.includes(col.seat_number) ? "img" : "" } 
                                    className={`w-full h-full${col.seat_type === "disabled" && !selectedSeats.includes(col.seat_number) ? ' seat-disabled' : ''}
                                    ${selectedSeats.includes(col.seat_number) ? ' seat-selected' : ''}`}
                                    >
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
              })}
            </>
          }
        </div>
      </>}
    </section>
  )
}

export default SeatGrid
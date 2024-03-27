import { useLocation, useParams } from "react-router-dom"
import MovieSummary from "../Sections/MovieSummary";
import SeatGrid from "../Sections/SeatGrid";
import OrderNav from "../Sections/Partials/OrderNav";
import { useState } from "react";
import Button from "../UI/Buttons/Button";
import TicketSale from "../Sections/TicketSale";
import BookingSummary from "../Sections/BookingSummary";
import { useAuth } from "../../context/AuthContext";

function OrderProcess() {
    const { id } = useParams();
    const location = useLocation();
    const {user, token} = useAuth();
    const [ activeId, setActiveId ] = useState(1);
    const [ selectedSeats, setSelectedSeats ] = useState([]);
    const [ selectedTickets, setSelectedTickets ] = useState([]);
    const [ paymentInfo, setPaymentInfo ] = useState({
      card_number: '',
      expiry: null,
      cvc: ''
    });
    const { session } = location.state;

    const handleNextClick = (direction) => {
      setActiveId(prev => {
        if (direction === "next") return ++prev;
        else return --prev;
      }); 
    }

  return (
    <section>
            <div className="flex flex-col lg:items-center">
              <MovieSummary
              id={id}
              isShort={true}/>
            </div>
            <OrderNav 
            activeId={activeId}
            setActiveId={setActiveId}/>
            {activeId === 1 &&
            <SeatGrid 
            theatre_id={session.theatre.id}
            setSelectedSeats={setSelectedSeats}
            selectedSeats={selectedSeats}/>
            }
            {activeId === 2 &&
            <TicketSale
            setSelectedTickets={setSelectedTickets}
            selectedTickets={selectedTickets}
            amountTickets={selectedSeats.length}
            sessionType={session.theatre.type}
            />
            }
            {activeId === 3 &&
            <BookingSummary
            selectedTickets={selectedTickets}
            paymentInfo={paymentInfo}
            setPaymentInfo={setPaymentInfo}
            />
            }
            <div className="flex justify-end mb-4 gap-4">
              {activeId > 1 && <Button
              size="medium"
              colorStyling="secondary"
              onClick={() => handleNextClick("prev")}
              >
                Back
              </Button>}
              {((selectedSeats.length > 0 && activeId === 1) ||
              (selectedTickets.length === selectedSeats.length && activeId === 2)) && 
              <Button
              size="medium"
              colorStyling="primary"
              onClick={() => handleNextClick("next")}
              >
                Next
              </Button>}
            </div>
    </section>
  )
}

export default OrderProcess
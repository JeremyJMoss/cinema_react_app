import { TICKET_TYPES } from "../../config/constants";
import {useAuth} from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Input from "../UI/Input";
import Button from "../UI/Buttons/Button";
import DatePicker from "react-datepicker";
import { useState } from "react";
import LoadingDots from "../UI/LoadingDots";

function BookingSummary({selectedTickets, setPaymentInfo, paymentInfo}) {
    const { user, token, toggleLoginModal } = useAuth();
    const [ timer, setTimer ] = useState(null);

    const handleChangeDate = (date) => {
        setPaymentInfo((prev) => {
            return {
                ...prev,
                expiry: date
            }
        });
    }

    const handleFieldChange = (fieldName, value) => {
        setPaymentInfo(prevData => ({
            ...prevData,
            [fieldName]: value
        }));
    };

    const handleCompleteOrder = () => {
        if (timer){
            setTimer(null);
        }

        const newTimer = setTimeout(() => {
            setTimer(null);
            
        }, 5000)

        setTimer(newTimer);
    }

    return (
        <section className="my-8 w-full flex flex-col items-center">
            {timer && <LoadingDots/>}
            {!timer && 
            <>
            <div className="shadow-custom py-5 px-5 rounded-md flex flex-col items-center max-w-2xl w-full mb-20">
                <p className="font-semibold text-lg mb-4">Booking Summary</p>
                {TICKET_TYPES.map(type => {
                    const matching_tickets = selectedTickets.filter(ticket => {
                        return ticket.type === type.label;                     
                    })

                    if (matching_tickets.length > 0) {
                        return (
                            <div className="flex justify-between w-full">
                                <p>{matching_tickets.length}x {type.label}</p>
                                <div>
                                    <p className="font-semibold">${matching_tickets.reduce((acc, cur) => {
                                        return acc + cur.price;
                                    }, 0).toFixed(2)}</p>
                                </div>
                            </div>
                        )
                    }
                    return null;
                })}
                <hr className="border-b border-slate-400 w-full my-5"/>
                <div className="flex justify-between w-full items-center px-4">
                    <p className="font-semibold text-xl">Total Price</p>
                    <p className="font-semibold text-xl">
                        ${selectedTickets.reduce((acc, cur) => {
                            return acc + cur.price;
                        }, 0).toFixed(2)}
                    </p>
                </div>
            </div>
            {!user && !token &&
            <div className="bg-slate-200 max-w-2xl w-full flex p-10 items-center flex-col">
                <p className="font-medium text-lg">
                    You are not logged in. <button onClick={toggleLoginModal} className="underline cursor-pointer">Login</button> or <Link to="/signup" className="underline cursor-pointer">Signup</Link> to continue.
                </p>
            </div>}
            {user && token && 
            <div className="shadow-custom py-5 px-5 rounded-md flex flex-col items-center max-w-2xl w-full mb-8">
                <p className="font-semibold text-lg mb-4">Credit Card Details</p>
                <form className="w-full">
                    <Input
                    fieldName="Card Number"
                    name="card_number"
                    id="card_number"
                    required={true}
                    placeholder="xxxx-xxxx-xxxx-xxxx"
                    onFieldChange={handleFieldChange}/>
                    <div className="flex gap-4">
                        <div className="flex flex-col grow">
                            <label className="text-lg mb-4">Expiry <span className="text-red-500">*</span></label>
                            <DatePicker
                            selected={paymentInfo.expiry}
                            dateFormat="MM/YY"
                            placeholderText="MM/YY"
                            showMonthYearPicker
                            onChange={(date) => handleChangeDate(date)}
                            />
                        </div>
                        <Input 
                        fieldName="CVC"
                        name="cvc"
                        id="cvc"
                        required={true}
                        placeholder="999"
                        onFieldChange={handleFieldChange}/>
                    </div>
                    <div className="flex justify-center mt-8">
                        <Button
                        size="medium"
                        type="button"
                        onClick={handleCompleteOrder}
                        >
                            Complete Order
                        </Button>
                    </div>
                </form>
            </div>
            }
            </>}
        </section>
    )
}

export default BookingSummary
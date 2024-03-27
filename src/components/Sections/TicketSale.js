import { TICKET_TYPES } from "../../config/constants"
import Button from "../UI/Buttons/Button"

function TicketSale({amountTickets, setSelectedTickets, selectedTickets, sessionType}) {
  
    const handleAdd = (type, price) => {
        setSelectedTickets(prev => {
            return [
                ...prev,
                {
                    type,
                    price
                }
            ]
        })
    }

    const handleRemove = (type) => {
        setSelectedTickets(prev => {
            const index = prev.findIndex(item => item.type === type)
                if (index !== -1) {
                    prev.splice(index, 1);
                }
                return [
                    ...prev
                ];
        })
    }
  
    return (
        <section className="my-8 flex flex-col items-center">
            <div className="min-w-96">
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-lg">Choose Your Tickets</h2>
                    <p className="font-medium text-md">
                        {selectedTickets.length}/{amountTickets} tickets selected
                    </p>
                </div>
                <div className="my-3 rounded border">
                    {TICKET_TYPES.map((type) => {
                        return (
                            <div key={type.label} className="px-5 py-3 flex justify-between items-center border-b">
                                <p>{type.label}</p>
                                <div className="flex items-center gap-3">
                                    <p><span className="font-semibold">$</span>{type.price[sessionType].toFixed(2)}</p>
                                    <Button
                                    colorStyling="accent"
                                    onClick={() => handleRemove(type.label)}>
                                        -
                                    </Button>
                                    <p>
                                        {selectedTickets.filter(ticket => {
                                            return ticket.type === type.label;
                                        }).length}
                                    </p>
                                    {selectedTickets.length !== amountTickets &&
                                    <Button
                                    onClick={() => handleAdd(type.label, type.price[sessionType])}>
                                        +
                                    </Button>}
                                </div>
                            </div>
                        )
                    })
                    }
                </div>
            </div>
        </section>
    )
}

export default TicketSale
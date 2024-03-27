import { useEffect, useState } from "react";
import { request } from "../../util/http";
import { BASE_URL } from "../../config/constants";
import ErrorMessage from "../UI/ErrorMessage";
const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

function TheatreGrid({grid, setGrid, theatre_id}) {
    const [ isFetching, setIsFetching ] = useState(false);
    const [ errMessage, setErrMessage ] = useState('');

    useEffect(() => {
        if (!theatre_id) {
            setGrid([
                [
                    {
                        seat: 'A1',
                        hasSeat: true,
                        isDisabled: false
                    }
                ]
            ])
            return;
        }
        const sendFetch = async () => {
            try {
                setIsFetching(true);
                const response = await request(
                    `${BASE_URL}/seat-structures?theatre_id=${theatre_id}`,
                    null,
                    {}
                );
                const seat_structure = response.map((row) => {
                    return row.map((col) => {
                        return {
                            seat: col.seat_number,
                            hasSeat: !col.is_empty,
                            isDisabled: col.seat_type === "disabled"
                        }
                    })
                })

                setGrid(seat_structure);

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

    }, [theatre_id, setGrid])

    const handleAddRow = () => {
        setGrid(prev => {
            const newRow = []; 
            for (let i = 0; i < prev[0].length; i++){
                newRow.push({
                    seat: `${alphabet[prev.length]}${i + 1}`,
                    hasSeat: true,
                    isDisabled: false
                })
            }
            return [
                ...prev,
                newRow
            ]
        })
    }

    const handleAddColumn = () => {
        setGrid(prev => {
            return prev.map((row, index) => {
                row.push({
                    seat: `${alphabet[index]}${row.length + 1}`,
                    hasSeat: true,
                    isDisabled: false
                })
                return row;
            });
        })
    }

    const handleOnDrag = (e, seat_type) => {
        e.dataTransfer.setData("seat_type", seat_type);
    }

    const handleDragOver = (e) => {
        e.preventDefault();    
    }

    const handleClick = (seat) => {
        const [row] = seat.split('');
        const col = seat.replace(row, '');
        const rowIndex = alphabet.findIndex((letter) => row === letter);
        const col_index = col - 1;
        setGrid(prev => {
            prev[rowIndex][col_index] = {
                ...prev[rowIndex][col_index],
                hasSeat: false,
                isDisabled: false
            }
            return [
                ...prev
            ];
        })
    }

    const handleDrop = (e, seat) => {
        const seat_type = e.dataTransfer.getData("seat_type");
        const [row] = seat.split('');
        const col = seat.replace(row, '');
        const rowIndex = alphabet.findIndex((letter) => row === letter);
        const col_index = col - 1;
        setGrid(prev => {
            prev[rowIndex][col_index] = {
                ...prev[rowIndex][col_index],
                hasSeat: seat_type !== 'empty',
                isDisabled: seat_type === "disabled"
            }
            return [
                ...prev
            ];
        })
    }

  return (
    <section className="w-full flex flex-col">
        {theatre_id && !isFetching && errMessage &&
        <ErrorMessage
        message={"Error loading theatre layout grid. Try refreshing your browser."}/>}
        {theatre_id && isFetching && 
        <div className="flex">
            Loading...
        </div>}
        {(!theatre_id || (!isFetching && !errMessage)) &&
        <>
            <p className="pt-6 text-center max-w-2xl">Drag seats into place, empty cells by clicking and add rows and columns with + buttons on the end of each row and column to create theatre layout.</p>
            <div className="flex gap-8 mt-5">
                <div className="flex flex-col items-center gap-6 p-6">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-6 p-3 bg-slate-400 rounded cursor-move" draggable={true} onDragStart={(e) => handleOnDrag(e, "empty")}>
                        </div>
                        <p>empty</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className=" w-6 p-3 bg-green-300 rounded cursor-move" draggable={true} onDragStart={(e) => handleOnDrag(e, "standard")}>
                        </div>
                        <p>standard</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className=" w-6 p-1 bg-orange-300 rounded cursor-move" draggable={true} onDragStart={(e) => handleOnDrag(e, "disabled")}>
                            <div role="img" className="seat-disabled p-2">
                            </div>
                        </div>
                        <p>disabled</p>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="grid gap-2">
                    {grid.length > 0 &&
                    <>
                        <div role="row" className="h-6 flex gap-3">
                            <div className="w-4"></div>
                            {grid[0].map((_, col_index) => {
                                return (
                                    <div key={col_index + 1} className="w-6 text-center">{col_index + 1}</div>
                                )
                            })}
                            <button
                            type="button"
                            onClick={handleAddColumn}>
                                +
                            </button>
                        </div>
                        {grid.map((row, row_index) => {
                            return (
                                <div role="row" key={alphabet[row_index]} className="h-6 flex gap-3">
                                    <div className="w-4 text-center">{alphabet[row_index]}</div>
                                    {row.map((col, col_index) => {
                                        let background = 'bg-slate-400';
                                        if (col.hasSeat){
                                            background = col.isDisabled ? 'bg-orange-300' : 'bg-green-300';
                                        }
                                        return (
                                            <div 
                                            role="cell"
                                            key={col.seat}
                                            className={`w-6 p-1 rounded cursor-pointer ${background}`} 
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, col.seat)}
                                            onClick={() => handleClick(col.seat)}
                                            >
                                                <div role={col.isDisabled ? "img" : "" } className={`p-2${col.isDisabled && ' seat-disabled'}`}>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </>
                    }
                    <button
                    type="button"
                    className="flex w-full"
                    onClick={handleAddRow}>
                        +
                    </button>
                    </div>
                </div>
            </div>
        </>}
    </section>
  )
}

export default TheatreGrid
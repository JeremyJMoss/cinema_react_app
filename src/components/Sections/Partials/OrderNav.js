function OrderNav({ activeId, setActiveId }) {
    const navigationItems = [
        {
            id: 1,
            text: 'Seats',
        },
        {
            id: 2,
            text: 'Tickets'
        },
        {
            id: 3,
            text: 'Payment'
        },
        {
            id: 4,
            text: 'Confirmation'
        }
    ]


    return (
        <nav className="justify-center mt-8 md:flex hidden">
            <ol className="flex items-center justify-between h-20 bg-slate-200 rounded-xl overflow-hidden">
                {navigationItems.map((item) => {
                    return (
                        <li className={`flex h-full${item.id <= activeId ? ' bg-orange-200' : ''}${item.id === activeId && item.id !== navigationItems.length ? ' active' : ''}`} key={item.id}>
                            <button className={`px-14 lg:px-20 lg:text-lg${activeId < item.id ? ' cursor-not-allowed' : ''}`} onClick={activeId >= item.id ? () => setActiveId(item.id) : null}>{item.text}</button>
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}

export default OrderNav
import { useParams } from "react-router-dom";
import Button from "../../UI/Buttons/Button";
import { useState } from "react";
import TabularNav from "../../UI/TabularNav";

const Theatres = () => {
    const {id} = useParams();
    const [formOpen, setFormOpen] = useState(false);

    const openForm = () => {
        setFormOpen(true);
    }

    return (
        <>
            <TabularNav
            links={[
                {
                    text: 'Cinema',
                    to: `/admin/cinemas/edit/${id}`
                },
                {
                    text: 'Theatres',
                    to: `/admin/cinemas/${id}/theatres`
                }
            ]}/>
            <div className="max-w-2xl p-10">
                <h1 className="text-2xl mb-6 text-slate-800 font-medium">Manage Theatres</h1>
                {!formOpen ? 
                <Button
                size="small"
                colorStyling="primary"
                onClick={openForm}>
                    Add New
                </Button> : 
                
                <form>

                </form>}
            </div>
        </>
    )
}

export default Theatres
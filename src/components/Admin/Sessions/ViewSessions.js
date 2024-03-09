import { useParams } from "react-router-dom";
import TabularNav from "../../UI/TabularNav";

const ViewSessions = () => {
    const { cinema_id, theatre_id } = useParams();

    return (
        <>
            <TabularNav
            links={[
                {
                    text: 'Cinema',
                    to: `/admin/cinemas/edit/${cinema_id}`
                },
                {
                    text: 'Theatres',
                    to: `/admin/cinemas/${cinema_id}/theatres`
                },
                {
                    text: 'Sessions',
                    to: `/admin/cinemas/${cinema_id}/sessions`
                }
            ]}/>
        </>
    )
}

export default ViewSessions
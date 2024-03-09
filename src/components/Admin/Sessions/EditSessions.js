import { useParams, useNavigate } from "react-router-dom";
import TabularNav from "../../UI/TabularNav";
import Button from "../../UI/Buttons/Button";
import { useCallback } from "react";
import { request } from "../../../util/http";
import { BASE_URL } from "../../../config/constants";
import { useFetch } from "../../../hooks/useFetch";

const EditSessions = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const sendFetch = useCallback(async () => {
        return await request(`${BASE_URL}/theatres/${id}`,
        null,
        {})
    }, [id]);

    const {
        data: theatres,
        errMessage,
        isFetching
    } = useFetch(sendFetch, [])

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
                },
                {
                    text: 'Sessions',
                    to: `/admin/cinemas/${id}/sessions`
                }
            ]}/>
            <div className="max-w-2xl p-10">
                <h1 className="text-2xl mb-6 text-slate-800 font-medium">Manage Sessions</h1>
                {theatres && theatres.length > 0 && 
                    <table className="border-2 rounded-md bg-white">
                        <thead>
                            <tr className="text-left">
                                <th className="font-medium px-5 py-3 md:text-lg">Theatre Number</th>
                                <th className="font-medium px-5 py-3 md:text-lg">Theatre Type</th>
                                <th className="font-medium px-5 py-3 md:text-lg">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {theatres.map((theatre, index) => {
                                return (
                                    <tr key={theatre.id} className={index % 2 === 0 ? "bg-slate-100" : null}>
                                        <td className="px-5 py-3 md:text-lg">{theatre.theatre_number}</td>
                                        <td className="px-5 py-3 md:text-lg">{theatre.theatre_type}</td>
                                        <td className="h-full">
                                            <div className="flex gap-5 px-5 py-3">
                                                <Button
                                                colorStyling="primary"
                                                size="medium"
                                                onClick={() => navigate(`/admin/cinemas/${id}/sessions/${theatre.id}/new`)}>
                                                    Add
                                                </Button>
                                                <Button
                                                colorStyling="secondary"
                                                size="medium"
                                                onClick={() => navigate(`/admin/cinemas/${id}/sessions/${theatre.id}/view`)}>
                                                    View
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                }
            </div>
        </>
    )
}

export default EditSessions
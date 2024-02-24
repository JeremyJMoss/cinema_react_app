import { Link } from "react-router-dom";

const AdminLink = ({label, href, icon}) => {
  return (
    <Link to={href} className="flex items-center">
        <img src={icon} className="w-6 mr-3" alt=""/>
        <span className="font-semibold">{label}</span>
    </Link>
  )
}

export default AdminLink
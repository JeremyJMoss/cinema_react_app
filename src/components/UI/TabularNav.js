import { NavLink } from "react-router-dom";

// for edit and create pages within admin panel
const TabularNav = ({links}) => {
  return (
    <nav className="flex pl-10 pt-7 bg-blue-200 top-tabs">
        {links.map(link => {
            return (
                <NavLink 
                activeClassName="active" 
                className="rounded-t-xl flex py-2 px-7"
                to={link.to}>
                    <span>{link.text}</span>
                </NavLink>
            )
        })}
    </nav>
  )
}

export default TabularNav
const AdminField = ({label, data}) => {
  return (
    <div className="flex flex-col p-2">
        <label className="font-bold mr-2">{label}:</label>
        <p className="font-medium">{data}</p>
    </div>
  )
}

export default AdminField
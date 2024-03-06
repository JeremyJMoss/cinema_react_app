import React from 'react'

const ErrorMessage = ({message}) => {
  return (
    <div className="w-full flex items-center justify-center mb-3">
        <div className=" w-full bg-red-200 px-10 py-3 font-medium rounded text-center">{message}</div>
    </div>
  )
}

export default ErrorMessage
import React from 'react'

const ErrorMessage = ({message}) => {
  return (
    <div className="w-full flex items-center justify-center">
        <div className="bg-red-200 px-10 py-5 rounded text-center">{message}</div>
    </div>
  )
}

export default ErrorMessage
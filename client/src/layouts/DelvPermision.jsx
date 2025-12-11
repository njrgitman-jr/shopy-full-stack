import React from 'react'
import { useSelector } from 'react-redux'
import isDelv from '../utils/isDelv'

//#3 03:08:17 if the user is admin then display th menue item otherwise do not have permission
//in the props can accept the children parm
const DelvPermision = ({children}) => {
    const user = useSelector(state => state.user)//to check if user is admin or not


  return (
    <>
        {
            isDelv(user.role) ?  children : <p className='text-red-600 bg-red-100 p-4'>Do not have access permission for delivery page</p>
        }
    </>
  )
}

export default DelvPermision
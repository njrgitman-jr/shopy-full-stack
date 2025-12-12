//client/src/layouts/AdminPermision.jsx

import React from 'react'
import { useSelector } from 'react-redux'
import isAdmin from '../utils/isAdmin'

//#3 03:08:17 if the user is admin then display th menue item otherwise do not have permission
//in the props can accept the children parm
const AdminPermision = ({children}) => {
    const user = useSelector(state => state.user)//to check if user is admin or not


  return (
    <>
        {
            isAdmin(user.role) ?  children : <p className='text-red-600 bg-red-100 p-4'>Do not have permission</p>
        }
    </>
  )
}

export default AdminPermision
import React, { useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  
  // 🟢 Start with no address selected
  const [selectAddress, setSelectAddress] = useState(null)
  
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()

  // ✅ Cash on Delivery handler
  const handleCashOnDelivery = async () => {
    try {
      if (selectAddress === null || !addressList[selectAddress]?._id) {
        toast.error("Please select a delivery address.")
        return
      }

      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        if (fetchCartItem) fetchCartItem()
        if (fetchOrder) fetchOrder()
        navigate('/success', { state: { text: "Order" } })
      }

    } catch (error) {
      AxiosToastError(error)
    }
  }

  // ✅ Online Payment (Stripe)
  const handleOnlinePayment = async () => {
    try {
      if (selectAddress === null || !addressList[selectAddress]?._id) {
        toast.error("Please select a delivery address.")
        return
      }

      toast.loading("Redirecting to payment...")
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
      const stripePromise = await loadStripe(stripePublicKey)

      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        }
      })

      const { data: responseData } = response
      await stripePromise.redirectToCheckout({ sessionId: responseData.id })

      if (fetchCartItem) fetchCartItem()
      if (fetchOrder) fetchOrder()

    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className='bg-blue-50 min-h-screen'>
      <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>
        
        {/* Address Section */}
        <div className='w-full'>
          <h3 className='text-lg font-semibold mb-2'>Choose delivery address</h3>
          <div className='bg-white p-2 grid gap-4 rounded'>
            {addressList.map((address, index) => (
              <label htmlFor={"address" + index} key={index} className={!address.status && "hidden"}>
                <div className={`border rounded p-3 flex gap-3 hover:bg-blue-50 ${selectAddress === index ? 'border-blue-500' : ''}`}>
                  <div>
                    <input
                      id={"address" + index}
                      type='radio'
                      value={index}
                      checked={selectAddress === index}
                      onChange={(e) => setSelectAddress(Number(e.target.value))}
                      name='address'
                    />
                  </div>
                  <div>
                    <p>{address.address_line}</p>
                    <p>{address.city}</p>
                    <p>{address.state}</p>
                    <p>{address.country} - {address.pincode}</p>
                    <p>{address.mobile}</p>
                  </div>
                </div>
              </label>
            ))}

            <div
              onClick={() => setOpenAddress(true)}
              className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer hover:bg-blue-100 rounded'
            >
              Add address
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className='w-full max-w-md bg-white py-4 px-2 rounded'>
          <h3 className='text-lg font-semibold mb-3'>Summary</h3>
          <div className='bg-white p-4 border rounded'>
            <h3 className='font-semibold mb-2'>Bill details</h3>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Items total</p>
              <p className='flex items-center gap-2'>
                <span className='line-through text-neutral-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                <span>{DisplayPriceInRupees(totalPrice)}</span>
              </p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Quantity total</p>
              <p>{totalQty} item(s)</p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Delivery Charge</p>
              <p>Free</p>
            </div>
            <div className='font-semibold flex items-center justify-between gap-4 mt-2'>
              <p>Grand total</p>
              <p>{DisplayPriceInRupees(totalPrice)}</p>
            </div>
          </div>

          <div className='w-full flex flex-col gap-4 mt-5'>
            {/* 🟢 Online Payment Button */}
            {/* <button
              className={`py-2 px-4 rounded text-white font-semibold transition ${
                selectAddress !== null ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'
              }`}
              onClick={handleOnlinePayment}
              disabled={selectAddress === null}
            >
              Online Payment
            </button> */}

            {/* 🟢 Cash on Delivery Button */}
            <button
              className={`py-2 px-4 border-2 font-semibold rounded transition ${
                selectAddress !== null ? 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white' : 'border-gray-300 text-gray-400 cursor-not-allowed'
              }`}
              onClick={handleCashOnDelivery}
              disabled={selectAddress === null}
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  )
}

export default CheckoutPage

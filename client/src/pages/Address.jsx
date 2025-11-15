//#5 01:30:00
import React, { useState } from "react";
import { useSelector } from "react-redux";
import AddAddress from "../components/AddAddress";
import { MdDelete, MdEdit } from "react-icons/md";
import EditAddressDetails from "../components/EditAddressDetails";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { useGlobalContext } from "../provider/GlobalProvider";

/*
  ✅ COMPONENT PURPOSE:
  The Address component displays the list of user addresses,
  allows adding new ones, editing existing ones, and deleting/disabling them.
*/

const Address = () => {
  // Get the list of addresses from Redux store (global state)
  const addressList = useSelector((state) => state.addresses.addressList);

  // State for controlling "Add Address" popup visibility
  const [openAddress, setOpenAddress] = useState(false);

  // State for controlling "Edit Address" popup visibility
  const [OpenEdit, setOpenEdit] = useState(false);

  // Holds the specific address data when editing
  const [editData, setEditData] = useState({});

  // Access global context functions (e.g. to refresh data)
  const { fetchAddress } = useGlobalContext();

  // #5 2:00:00
  // 🔹 Function to disable (soft delete) an address
  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress, // API endpoint and method
        data: { _id: id }, // Send address ID to disable
      });

      // If successful response from server
      if (response.data.success) {
        toast.success("Address Removed"); // Notify user
        if (fetchAddress) {
          fetchAddress(); // Re-fetch address list
        }
      }
    } catch (error) {
      AxiosToastError(error); // Handle errors gracefully
    }
  };

  return (
    <div className="">
      {/* 🔹 Header section: Title + "Add Address" button */}
      <div className="bg-white shadow-lg px-2 py-2 flex justify-between gap-4 items-center ">
        <h2 className="font-semibold text-ellipsis line-clamp-1">Address</h2>
        <button
          onClick={() => setOpenAddress(true)}
          className="border border-primary-200 text-primary-200 px-3 hover:bg-primary-200 hover:text-black py-1 rounded-full"
        >
          Add Address
        </button>
      </div>

      {/* 🔹 List of Addresses */}
      <div className="bg-blue-50 p-2 grid gap-4">
        {addressList.map((address, index) => {
          return (
            <div
              key={index}
              className={`border rounded p-3 flex gap-3 bg-white ${
                !address.status && "hidden"
              }`}
            >
              {/* Address Details Section */}
              <div className="w-full">
                <p>{address.address_line}</p>
                <p>{address.city}</p>
                <p>{address.state}</p>
                <p>
                  {address.country} - {address.pincode}
                </p>
                <p>{address.mobile}</p>
              </div>

              {/* Action Buttons: Edit / Delete */}
              <div className="grid gap-4 justify-center items-center">
                {/* Edit Button */}
                <button
                  onClick={() => {
                    setOpenEdit(true);
                    setEditData(address);
                  }}
                  className="bg-green-200 p-2 rounded-full hover:text-white hover:bg-green-600 transition-colors duration-200"
                >
                  <MdEdit size={18} />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDisableAddress(address._id)}
                  className="bg-red-200 p-2 rounded-full hover:text-white hover:bg-red-600 transition-colors duration-200"
                >
                  <MdDelete size={18} />
                </button>
              </div>
            </div>
          );
        })}

        {/* 🔹 Add Address Placeholder Box */}
        <div
          onClick={() => setOpenAddress(true)}
          className="h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer"
        >
          Add address
        </div>
      </div>

      {/* 🔹 Popup for Adding Address */}
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}

      {/* 🔹 Popup for Editing Address */}
      {OpenEdit && (
        <EditAddressDetails
          data={editData}
          close={() => setOpenEdit(false)}
        />
      )}
    </div>
  );
};

export default Address;

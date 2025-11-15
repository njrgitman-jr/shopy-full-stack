// Import models
import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

/**
 * -------------------------------
 * ADD NEW ADDRESS CONTROLLER
 * -------------------------------
 * Creates a new address for the logged-in user,
 * saves it in the Address collection, and adds
 * its reference to the user's address_details array.
 */
export const addAddressController = async (request, response) => {
  try {
    const userId = request.userId; // Extract user ID from authentication middleware
    const { address_line, city, state, pincode, country, mobile } =
      request.body;

    // Create a new address document
    const createAddress = new AddressModel({
      address_line,
      city,
      state,
      country,
      pincode,
      mobile,
      userId: userId,
    });

    // Save the new address to the database
    const saveAddress = await createAddress.save();

    // Push the address ID to the user's address_details array in user.model
    await UserModel.findByIdAndUpdate(userId, {
      $push: {
        address_details: saveAddress._id,
      },
    });

    // Respond with success
    return response.json({
      message: "Address Created Successfully",
      error: false,
      success: true,
      data: saveAddress, //address detail
    });
  } catch (error) {
    // Handle server or validation errors
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/**
 * -------------------------------
 * GET USER ADDRESSES CONTROLLER
 * -------------------------------
 * Fetches all active addresses of the authenticated user,
 * sorted by the most recently created.
 */
export const getAddressController = async (request, response) => {
  try {
    const userId = request.userId; // Extract user ID from middleware

    // Get all addresses of the user, sorted by latest created
    const data = await AddressModel.find({ userId: userId }).sort({
      createdAt: -1,
    });

    return response.json({
      data: data,
      message: "List of address",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/**
 * -------------------------------
 * UPDATE ADDRESS CONTROLLER
 * -------------------------------
 * Updates an existing address belonging to the logged-in user.
 * Only the fields provided in the request body are updated.
 */
export const updateAddressController = async (request, response) => {
  try {
    const userId = request.userId; // Authenticated user
    const { _id, address_line, city, state, country, pincode, mobile } =
      request.body;

    // Update the address that belongs to this user
    const updateAddress = await AddressModel.updateOne(
      { _id: _id, userId: userId },
      { address_line, city, state, country, mobile, pincode }
    );

    return response.json({
      message: "Address Updated",
      error: false,
      success: true,
      data: updateAddress,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

/**
 * -------------------------------
 * DELETE (DISABLE) ADDRESS CONTROLLER
 * -------------------------------
 * Soft deletes an address by setting `status: false`
 * instead of removing it from the database completely.
 */
export const deleteAddresscontroller = async (request, response) => {
  try {
    const userId = request.userId; // Authenticated user ID
    const { _id } = request.body;

    // Instead of deleting, mark as inactive
    const disableAddress = await AddressModel.updateOne(
      { _id: _id, userId },
      { status: false }
    );

    return response.json({
      message: "Address removed",
      error: false,
      success: true,
      data: disableAddress,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

